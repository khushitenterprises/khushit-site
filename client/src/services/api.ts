import { Product, Category } from '../data/products';

const envApiUrl = import.meta.env.VITE_API_URL;
const API_URL = envApiUrl || '';

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

function normalizeProduct(raw: any): Product {
    const name = String(raw?.name || raw?.title || '').trim();
    const imageCandidate = String(
        raw?.image || raw?.imageUrl || raw?.image_url || raw?.src || raw?.url || raw?.photo || ''
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

    return {
        id: String(raw?.id || raw?.productId || toSlug(name) || `product-${Date.now()}`).trim(),
        name,
        description: String(raw?.description || '').trim(),
        category: String(
            raw?.category || raw?.categoryId || raw?.category_id || toSlug(raw?.categoryName || raw?.category_name || '')
        ).trim(),
        variant: raw?.variant ? String(raw.variant).trim() : undefined,
        image,
        keyBenefits: Array.isArray(raw?.keyBenefits) ? raw.keyBenefits.map((item: any) => String(item)) : undefined,
        ingredientsUsage: raw?.ingredientsUsage ? String(raw.ingredientsUsage).trim() : undefined,
    };
}

function normalizeCategoryKey(value: string): string {
    return toSlug(value).replace(/-/g, '');
}

function getCategoryAliases(categoryId: string): string[] {
    const aliases: Record<string, string[]> = {
        airdrops: ['airdrop', 'airdrops', 'air-freshener', 'airfreshener', 'air-fresheners', 'airfresheners'],
        handwash: ['hand-wash', 'handwashes', 'hand-washes', 'handwash-liquid'],
        toiletries: ['toiletry', 'personal-care', 'personalcare'],
    };
    return aliases[categoryId] || [];
}

function categoryMatches(requestedCategoryId: string, productCategory: string): boolean {
    const requestedKeys = [
        normalizeCategoryKey(requestedCategoryId),
        ...getCategoryAliases(requestedCategoryId).map(normalizeCategoryKey),
    ];
    const productKey = normalizeCategoryKey(productCategory);
    return requestedKeys.includes(productKey);
}

// Generic fetch wrapper with error handling
async function fetchAPI<T>(endpoint: string): Promise<T> {
    try {
        const response = await fetch(`${API_URL}/api${endpoint}`);

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch ${endpoint}:`, error);
        throw error;
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
    try {
        const products = await fetchAPI<any[]>(`/products/category/${categoryId}`);
        const normalized = Array.isArray(products)
            ? products
                  .map(normalizeProduct)
                  .filter((item) => item.id && categoryMatches(categoryId, item.category))
            : [];
        if (normalized.length > 0) {
            return normalized;
        }
        const allProducts = await getProducts();
        return allProducts.filter((item) => categoryMatches(categoryId, item.category));
    } catch {
        const products = await getProducts();
        return products.filter((item) => categoryMatches(categoryId, item.category));
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
