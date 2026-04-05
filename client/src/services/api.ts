import { Product, Category, categories as mainCategories } from '../data/products';

const envApiUrl = import.meta.env.VITE_API_URL;
const API_URL = envApiUrl || '';
const API_TIMEOUT_MS = 12000;

function toSlug(value: string): string {
    return String(value || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function normalizeCategory(raw: any): Category {
    const id = String(raw?.id || raw?.categoryId || toSlug(raw?.name || '')).trim();
    return {
        id,
        name: String(raw?.name || id || 'Category').trim(),
        description: String(raw?.description || '').trim(),
        icon: String(raw?.icon || '').trim(),
        productCount: Number(raw?.productCount || 0),
    };
}

function keyToComparable(value: string): string {
    return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function pickRawField(raw: any, keys: string[]): any {
    if (!raw || typeof raw !== 'object') {
        return undefined;
    }

    for (const key of keys) {
        if (raw[key] !== undefined && raw[key] !== null && String(raw[key]).trim() !== '') {
            return raw[key];
        }
    }

    const expectedKeys = new Set(keys.map(keyToComparable));
    for (const [entryKey, entryValue] of Object.entries(raw)) {
        if (!expectedKeys.has(keyToComparable(entryKey))) {
            continue;
        }

        if (entryValue !== undefined && entryValue !== null && String(entryValue).trim() !== '') {
            return entryValue;
        }
    }

    return undefined;
}

function normalizeProduct(raw: any): Product {
    const name = String(pickRawField(raw, ['name', 'title', 'productName', 'product_name']) || '').trim();
    const imageCandidate = String(
        pickRawField(raw, ['image', 'imageUrl', 'image_url', 'src', 'url', 'photo'])
            || ''
    ).trim();

    let image: string | undefined;
    if (imageCandidate) {
        if (/^(https?:)?\/\//i.test(imageCandidate) || imageCandidate.startsWith('data:') || imageCandidate.startsWith('blob:')) {
            image = imageCandidate;
        } else if (API_URL) {
            image = imageCandidate.startsWith('/') ? `${API_URL}${imageCandidate}` : `${API_URL}/${imageCandidate}`;
        } else {
            image = imageCandidate;
        }
    }

    const normalizedCategory = String(
        pickRawField(raw, [
            'category',
            'catagory',
            'cetegory',
            'categary',
            'categoryName',
            'category_name',
            'categoryId',
            'category_id',
        ]) || ''
    ).trim();
    const normalizedPrice = String(
        pickRawField(raw, ['price', 'mrp', 'rate', 'amount', 'sellingPrice', 'selling_price']) || ''
    ).trim();

    return {
        id: String(pickRawField(raw, ['id', 'productId', 'product_id']) || toSlug(name) || `product-${Date.now()}`).trim(),
        name,
        description: String(pickRawField(raw, ['description', 'productDescription', 'product_description']) || '').trim(),
        category: normalizedCategory || 'uncategorized',
        price: normalizedPrice || undefined,
        variant: pickRawField(raw, ['variant']) ? String(pickRawField(raw, ['variant'])).trim() : undefined,
        image,
        keyBenefits: Array.isArray(raw?.keyBenefits) ? raw.keyBenefits.map((item: any) => String(item)) : undefined,
        ingredientsUsage: pickRawField(raw, ['ingredientsUsage', 'ingredients_usage'])
            ? String(pickRawField(raw, ['ingredientsUsage', 'ingredients_usage'])).trim()
            : undefined,
    };
}

function normalizeCategoryKey(value: string): string {
    return toSlug(value).replace(/-/g, '');
}

function getCategoryAliases(categoryId: string): string[] {
    const aliases: Record<string, string[]> = {
        'bath-soaps': ['bath-soap', 'bathsoap', 'bathsoaps', 'soap', 'soaps'],
        detergents: ['detergent'],
        'fabric-conditioner': ['fabricconditioner', 'fabric-conditioners', 'fabricconditioners', 'fabric-softener', 'fabricsoftener'],
        airdrops: ['airdrop', 'airdrops', 'air-freshener', 'airfreshener', 'air-fresheners', 'airfresheners'],
        'hair-oil': ['hair-oils', 'hairoil', 'hairoils'],
        handwash: ['hand-wash', 'handwashes', 'hand-washes', 'handwash-liquid', 'hand-wash-liquid'],
        shampoo: ['shampoos'],
        toiletries: ['toiletry', 'personal-care', 'personalcare'],
    };
    return aliases[categoryId] || [];
}

function resolveCategoryAliases(requestedCategoryId: string): string[] {
    const requestedKey = normalizeCategoryKey(requestedCategoryId);
    const matchedMainCategory = mainCategories.find((item) => {
        const keys = [item.id, item.name, ...getCategoryAliases(item.id)].map(normalizeCategoryKey);
        return keys.includes(requestedKey);
    });

    if (!matchedMainCategory) {
        return getCategoryAliases(requestedCategoryId);
    }

    return [matchedMainCategory.id, matchedMainCategory.name, ...getCategoryAliases(matchedMainCategory.id)];
}

function categoryMatches(requestedCategoryId: string, productCategory: string): boolean {
    const requestedKeys = Array.from(
        new Set([requestedCategoryId, ...resolveCategoryAliases(requestedCategoryId)].map(normalizeCategoryKey))
    );
    const productKey = normalizeCategoryKey(productCategory);
    return requestedKeys.includes(productKey);
}

// Generic fetch wrapper with error handling
async function fetchAPI<T>(endpoint: string): Promise<T> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    try {
        const response = await fetch(`${API_URL}/api${endpoint}`, {
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            console.error(`Request timeout for ${endpoint} after ${API_TIMEOUT_MS}ms`);
            throw new Error('Request timed out');
        }
        console.error(`Failed to fetch ${endpoint}:`, error);
        throw error;
    } finally {
        clearTimeout(timeout);
    }
}

// Get all categories
export async function getCategories(): Promise<Category[]> {
    const categories = await fetchAPI<any[]>('/categories');
    return Array.isArray(categories) ? categories.map(normalizeCategory).filter((item) => item.id) : [];
}

// Get category by ID
export async function getCategoryById(id: string): Promise<Category> {
    try {
        const category = await fetchAPI<any>(`/categories/${id}`);
        return normalizeCategory(category);
    } catch {
        const categories = await getCategories();
        const matched = categories.find((item) => item.id === id || toSlug(item.name) === id);
        if (matched) {
            return matched;
        }
        throw new Error('Category not found');
    }
}

// Get all products
export async function getProducts(): Promise<Product[]> {
    const products = await fetchAPI<any[]>('/products');
    return Array.isArray(products) ? products.map(normalizeProduct).filter((item) => item.id) : [];
}

// Get products by category
export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
    // Prefer all-products + local matching for resilience against backend category format mismatch.
    try {
        const allProducts = await getProducts();
        const matched = allProducts.filter((item) => categoryMatches(categoryId, item.category));
        if (matched.length > 0) {
            return matched;
        }
    } catch {
        // Fall through to category endpoint attempts below.
    }

    try {
        const products = await fetchAPI<any[]>(`/products/category/${categoryId}`);
        const normalized = Array.isArray(products) ? products.map(normalizeProduct).filter((item) => item.id) : [];
        const matchedFromCategoryEndpoint = normalized.filter((item) =>
            categoryMatches(categoryId, item.category)
        );
        return matchedFromCategoryEndpoint;
    } catch {
        try {
            const products = await getProducts();
            const matched = products.filter((item) => categoryMatches(categoryId, item.category));
            return matched;
        } catch {
            return [];
        }
    }
}

// Get featured products
export async function getFeaturedProducts(): Promise<Product[]> {
    const products = await fetchAPI<any[]>('/products/featured');
    return Array.isArray(products) ? products.map(normalizeProduct).filter((item) => item.id) : [];
}

// Upload products file
export async function uploadProductsFile(file: File): Promise<Product[]> {
    const formData = new FormData();
    formData.append('file', file);

    // We can't use the generic fetchAPI easily because it assumes JSON body or no body for GET
    // But fetchAPI is just a wrapper around fetch.
    // wait, fetchAPI does not set Content-Type: application/json automatically?
    // Let's check fetchAPI implementation in api.ts again.
    // It just does fetch(`${API_URL}/api${endpoint}`). It doesn't set headers or anything.
    // So for POST we need to handle it.

    const response = await fetch(`${API_URL}/api/upload-products`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
}
