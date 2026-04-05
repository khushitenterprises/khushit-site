import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { getDb } from '../lib/mongo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'harshkothiya0807@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'khushit';
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
        fieldSize: 10 * 1024 * 1024
    }
});

// In-memory cache for ultra-fast responses
let cachedData = null;
let cachedSliders = null;
const productImageCache = new Map();

const defaultSliders = [
    {
        id: 'sld_1',
        src: '/allairdrops.jpeg',
        alt: 'Product showcase 1',
        title: 'Premium Quality Products',
        link: '/products/airdrops'
    },
    {
        id: 'sld_2',
        src: '/allairdrops.jpeg',
        alt: 'Product showcase 2',
        title: 'Trusted by Thousands',
        link: ''
    },
    {
        id: 'sld_3',
        src: '/allairdrops.jpeg',
        alt: 'Product showcase 3',
        title: 'Daily Essentials',
        link: ''
    },
    {
        id: 'sld_4',
        src: '/allairdrops.jpeg',
        alt: 'Product showcase 4',
        title: 'Excellence in Every Product',
        link: ''
    }
];

function isValidAdmin(email, password) {
    return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

function getBasicAuthCredentials(req) {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Basic ')) {
        return null;
    }

    const encoded = authHeader.slice(6);

    try {
        const decoded = Buffer.from(encoded, 'base64').toString('utf8');
        const separatorIndex = decoded.indexOf(':');
        if (separatorIndex < 0) {
            return null;
        }

        return {
            email: decoded.slice(0, separatorIndex),
            password: decoded.slice(separatorIndex + 1)
        };
    } catch {
        return null;
    }
}

function requireAdmin(req, res, next) {
    const credentials = getBasicAuthCredentials(req);

    if (!credentials || !isValidAdmin(credentials.email, credentials.password)) {
        res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    return next();
}

function toImageDataUrl(file) {
    if (!file) {
        return '';
    }

    return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
}

function sanitizeProductPayload(payload = {}, file = null, options = {}) {
    const { existingImage = '', requireImage = false } = options;
    const name = String(payload.name || '').trim();
    const description = String(payload.description || '').trim();
    const category = String(payload.category || '').trim();
    const image = file ? toImageDataUrl(file) : String(existingImage || '').trim();
    const keyBenefits = String(payload.keyBenefits || '')
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean);
    const ingredientsUsage = String(payload.ingredientsUsage || '').trim();

    if (!name || !description || !category) {
        return {
            error: 'Name, description, and category are required'
        };
    }

    if (requireImage && !image) {
        return {
            error: 'Product image is required'
        };
    }

    return {
        product: {
            name,
            description,
            category,
            image,
            keyBenefits,
            ingredientsUsage
        }
    };
}

function sanitizeSliderPayload(payload = {}, file = null, options = {}) {
    const { existingImage = '', requireImage = false } = options;
    const title = String(payload.title || '').trim();
    const alt = String(payload.alt || '').trim();
    const link = String(payload.link || '').trim();
    const src = file ? toImageDataUrl(file) : String(existingImage || '').trim();

    if (!title) {
        return {
            error: 'Slider title is required'
        };
    }

    if (requireImage && !src) {
        return {
            error: 'Slider image is required'
        };
    }

    return {
        slider: {
            title,
            alt,
            link,
            src
        }
    };
}

// Helper function to read products data with caching
async function getProductsData() {
    if (cachedData) {
        return cachedData;
    }

    const db = await getDb();
    const categories = await db.collection('categories').find({}).maxTimeMS(10000).toArray();
    const products = await db
        .collection('products')
        .find(
            {},
            {
                projection: {
                    _id: 0,
                    id: 1,
                    name: 1,
                    description: 1,
                    category: 1,
                    price: 1,
                    variant: 1,
                    keyBenefits: 1,
                    ingredientsUsage: 1
                }
            }
        )
        .maxTimeMS(10000)
        .toArray();

    if (categories.length === 0 || products.length === 0) {
        const dataPath = path.join(__dirname, '../data/products.json');
        let data = { categories: [], products: [] };
        try {
            const fileContent = await fs.readFile(dataPath, 'utf-8');
            data = JSON.parse(fileContent);
        } catch (error) {
            console.warn(`Seed file missing or invalid at ${dataPath}.`, error?.message || error);
        }

        if (categories.length === 0 && data.categories?.length) {
            await db.collection('categories').insertMany(data.categories);
        }

        if (products.length === 0 && data.products?.length) {
            await db.collection('products').insertMany(data.products);
        }

        const seededCategories = await db.collection('categories').find({}).toArray();
        const seededProducts = await db.collection('products').find({}).toArray();
        cachedData = {
            categories: seededCategories.map(({ _id, ...rest }) => rest),
            products: seededProducts.map(({ _id, image, ...rest }) => ({
                ...rest,
                image: rest.id ? `/api/products/${encodeURIComponent(rest.id)}/image` : ''
            }))
        };
    } else {
        cachedData = {
            categories: categories.map(({ _id, ...rest }) => rest),
            products: products.map(({ _id, ...rest }) => ({
                ...rest,
                image: rest.id ? `/api/products/${encodeURIComponent(rest.id)}/image` : ''
            }))
        };
    }

    console.log('Data cached in memory for fast access');
    return cachedData;
}

function withDynamicProductCounts(categories = [], products = []) {
    const countsByCategory = products.reduce((acc, product) => {
        const categoryId = String(product.category || '');
        if (!categoryId) {
            return acc;
        }

        acc[categoryId] = (acc[categoryId] || 0) + 1;
        return acc;
    }, {});

    return categories.map((category) => ({
        ...category,
        productCount: countsByCategory[category.id] || 0
    }));
}

async function getSlidersData() {
    if (cachedSliders) {
        return cachedSliders;
    }

    const db = await getDb();
    const slidersCollection = db.collection('sliders');
    const sliders = await slidersCollection.find({}).sort({ createdAt: 1, id: 1 }).toArray();

    if (sliders.length === 0) {
        const seed = defaultSliders.map((slider) => ({
            ...slider,
            createdAt: new Date()
        }));
        await slidersCollection.insertMany(seed);
        const seeded = await slidersCollection.find({}).sort({ createdAt: 1, id: 1 }).toArray();
        cachedSliders = seeded.map(({ _id, createdAt, ...rest }) => ({
            ...rest,
            src: String(rest.src || '').replace('/allairdrop.jpeg', '/allairdrops.jpeg')
        }));
    } else {
        cachedSliders = sliders.map(({ _id, createdAt, ...rest }) => ({
            ...rest,
            src: String(rest.src || '').replace('/allairdrop.jpeg', '/allairdrops.jpeg')
        }));
    }

    return cachedSliders;
}

router.post('/admin/login', (req, res) => {
    const payload = req.body ?? {};
    const email = String(payload.email || '').trim();
    const password = String(payload.password || '');

    if (!isValidAdmin(email, password)) {
        return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    return res.json({ ok: true });
});

router.get('/admin/registrations', requireAdmin, async (req, res) => {
    try {
        const db = await getDb();
        const registrations = await db
            .collection('registrations')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        res.json(
            registrations.map(({ _id, ...rest }) => ({
                id: String(_id),
                ...rest
            }))
        );
    } catch (error) {
        console.error('Error fetching registrations:', error);
        res.status(500).json({ error: 'Failed to fetch registrations' });
    }
});

router.get('/admin/products', requireAdmin, async (req, res) => {
    try {
        const db = await getDb();
        const products = await db.collection('products').find({}).sort({ name: 1 }).toArray();
        res.json(products.map(({ _id, ...rest }) => rest));
    } catch (error) {
        console.error('Error fetching admin products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

router.post('/admin/products', requireAdmin, upload.single('image'), async (req, res) => {
    try {
        const parsed = sanitizeProductPayload(req.body ?? {}, req.file, { requireImage: true });
        if (parsed.error) {
            return res.status(400).json({ error: parsed.error });
        }

        const db = await getDb();
        const productsCollection = db.collection('products');
        const now = Date.now().toString(36);
        const slug = parsed.product.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 20);
        const id = `prd_${slug || 'item'}_${now}`;

        const product = {
            ...parsed.product,
            id
        };

        await productsCollection.insertOne(product);
        cachedData = null;
        if (product.id) {
            productImageCache.set(product.id, product.image || '');
        }

        return res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

router.put('/admin/products/:id', requireAdmin, upload.single('image'), async (req, res) => {
    try {
        const productId = String(req.params.id || '').trim();
        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }

        const db = await getDb();
        const productsCollection = db.collection('products');
        const existingProduct = await productsCollection.findOne({ id: productId });
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const parsed = sanitizeProductPayload(req.body ?? {}, req.file, {
            existingImage: String(existingProduct.image || '').trim(),
            requireImage: true
        });
        if (parsed.error) {
            return res.status(400).json({ error: parsed.error });
        }

        const update = {
            name: parsed.product.name,
            description: parsed.product.description,
            category: parsed.product.category,
            image: parsed.product.image,
            keyBenefits: parsed.product.keyBenefits,
            ingredientsUsage: parsed.product.ingredientsUsage
        };

        await productsCollection.updateOne(
            { id: productId },
            {
                $set: update,
                $unset: {
                    variant: ''
                }
            }
        );

        cachedData = null;
        productImageCache.delete(productId);

        return res.json({
            id: productId,
            ...update
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

router.delete('/admin/products/:id', requireAdmin, async (req, res) => {
    try {
        const productId = String(req.params.id || '').trim();
        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }

        const db = await getDb();
        const result = await db.collection('products').deleteOne({ id: productId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        cachedData = null;
        productImageCache.delete(productId);

        return res.status(204).send();
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

router.get('/admin/sliders', requireAdmin, async (req, res) => {
    try {
        const sliders = await getSlidersData();
        res.json(sliders);
    } catch (error) {
        console.error('Error fetching admin sliders:', error);
        res.status(500).json({ error: 'Failed to fetch sliders' });
    }
});

router.post('/admin/sliders', requireAdmin, upload.single('image'), async (req, res) => {
    try {
        const parsed = sanitizeSliderPayload(req.body ?? {}, req.file, { requireImage: true });
        if (parsed.error) {
            return res.status(400).json({ error: parsed.error });
        }

        const db = await getDb();
        const slidersCollection = db.collection('sliders');
        const now = Date.now().toString(36);
        const id = `sld_${now}`;
        const slider = {
            id,
            ...parsed.slider,
            createdAt: new Date()
        };

        await slidersCollection.insertOne(slider);
        cachedSliders = null;

        const { createdAt, ...responseBody } = slider;
        return res.status(201).json(responseBody);
    } catch (error) {
        console.error('Error creating slider:', error);
        res.status(500).json({ error: 'Failed to create slider' });
    }
});

router.put('/admin/sliders/:id', requireAdmin, upload.single('image'), async (req, res) => {
    try {
        const sliderId = String(req.params.id || '').trim();
        if (!sliderId) {
            return res.status(400).json({ error: 'Slider ID is required' });
        }

        const db = await getDb();
        const slidersCollection = db.collection('sliders');
        const existingSlider = await slidersCollection.findOne({ id: sliderId });

        if (!existingSlider) {
            return res.status(404).json({ error: 'Slider not found' });
        }

        const parsed = sanitizeSliderPayload(req.body ?? {}, req.file, {
            existingImage: String(existingSlider.src || '').trim(),
            requireImage: true
        });

        if (parsed.error) {
            return res.status(400).json({ error: parsed.error });
        }

        const update = {
            title: parsed.slider.title,
            alt: parsed.slider.alt,
            link: parsed.slider.link,
            src: parsed.slider.src
        };

        await slidersCollection.updateOne(
            { id: sliderId },
            {
                $set: update
            }
        );

        cachedSliders = null;

        return res.json({
            id: sliderId,
            ...update
        });
    } catch (error) {
        console.error('Error updating slider:', error);
        res.status(500).json({ error: 'Failed to update slider' });
    }
});

router.delete('/admin/sliders/:id', requireAdmin, async (req, res) => {
    try {
        const sliderId = String(req.params.id || '').trim();
        if (!sliderId) {
            return res.status(400).json({ error: 'Slider ID is required' });
        }

        const db = await getDb();
        const result = await db.collection('sliders').deleteOne({ id: sliderId });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Slider not found' });
        }

        cachedSliders = null;

        return res.status(204).send();
    } catch (error) {
        console.error('Error deleting slider:', error);
        res.status(500).json({ error: 'Failed to delete slider' });
    }
});

// GET /api/categories - Get all categories
router.get('/categories', async (req, res) => {
    try {
        const data = await getProductsData();
        res.json(withDynamicProductCounts(data.categories, data.products));
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// GET /api/categories/:id - Get category by ID
router.get('/categories/:id', async (req, res) => {
    try {
        const data = await getProductsData();
        const categoriesWithCounts = withDynamicProductCounts(data.categories, data.products);
        const category = categoriesWithCounts.find(c => c.id === req.params.id);

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({ error: 'Failed to fetch category' });
    }
});

// GET /api/products - Get all products
router.get('/products', async (req, res) => {
    try {
        const data = await getProductsData();
        res.json(data.products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// GET /api/products/category/:categoryId - Get products by category
router.get('/products/category/:categoryId', async (req, res) => {
    try {
        const data = await getProductsData();
        const products = data.products.filter(p => p.category === req.params.categoryId);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// GET /api/products/featured - Get featured products
router.get('/products/featured', async (req, res) => {
    try {
        const data = await getProductsData();
        const featuredIds = ['bs1', 'dt1', 'ho1', 'sh1', 'fc1', 'hw1'];
        const featured = data.products.filter(p => featuredIds.includes(p.id));
        res.json(featured);
    } catch (error) {
        console.error('Error fetching featured products:', error);
        res.status(500).json({ error: 'Failed to fetch featured products' });
    }
});

router.get('/products/:id/image', async (req, res) => {
    try {
        const productId = String(req.params.id || '').trim();
        if (!productId) {
            return res.status(400).send('Invalid product id');
        }

        let imageValue = String(productImageCache.get(productId) || '').trim();
        if (!imageValue) {
            let lastError = null;
            for (let attempt = 0; attempt < 3; attempt += 1) {
                try {
                    const db = await getDb();
                    const doc = await db.collection('products').findOne(
                        { id: productId },
                        {
                            projection: {
                                _id: 0,
                                image: 1
                            }
                        }
                    );
                    imageValue = String(doc?.image || '').trim();
                    if (imageValue) {
                        productImageCache.set(productId, imageValue);
                    }
                    break;
                } catch (error) {
                    lastError = error;
                    const message = String(error?.message || '').toLowerCase();
                    const isTimeout = message.includes('timed out') || message.includes('timeout');
                    if (!isTimeout || attempt === 2) {
                        throw error;
                    }
                    await new Promise((resolve) => setTimeout(resolve, 250));
                }
            }

            if (!imageValue && lastError) {
                throw lastError;
            }
        }

        if (!imageValue) {
            return res.status(404).send('Image not found');
        }

        if (/^https?:\/\//i.test(imageValue)) {
            return res.redirect(imageValue);
        }

        const dataUriMatch = imageValue.match(/^data:([^;]+);base64,(.+)$/);
        if (dataUriMatch) {
            const mimeType = dataUriMatch[1] || 'application/octet-stream';
            const base64Payload = dataUriMatch[2] || '';
            const buffer = Buffer.from(base64Payload, 'base64');
            res.setHeader('Content-Type', mimeType);
            res.setHeader('Cache-Control', 'public, max-age=300');
            return res.send(buffer);
        }

        return res.redirect(imageValue);
    } catch (error) {
        console.error('Error fetching product image:', error);
        return res.status(500).send('Failed to fetch image');
    }
});

router.get('/sliders', async (req, res) => {
    try {
        const sliders = await getSlidersData();
        res.json(sliders);
    } catch (error) {
        console.error('Error fetching sliders:', error);
        res.status(500).json({ error: 'Failed to fetch sliders' });
    }
});

// POST /api/registrations - Save a registration
router.post('/registrations', async (req, res) => {
    try {
        const payload = req.body ?? {};
        const name = String(payload.name || '').trim();
        const email = String(payload.email || '').trim();

        if (!name || !email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }

        const db = await getDb();
        const registration = {
            name,
            company: String(payload.company || '').trim(),
            phone: String(payload.phone || '').trim(),
            email,
            city: String(payload.city || '').trim(),
            message: String(payload.message || '').trim(),
            source: payload.source === 'modal' ? 'modal' : 'page',
            createdAt: new Date()
        };

        const result = await db.collection('registrations').insertOne(registration);

        res.status(201).json({ id: result.insertedId, ...registration });
    } catch (error) {
        console.error('Error saving registration:', error);
        res.status(500).json({ error: 'Failed to save registration' });
    }
});

export default router;
