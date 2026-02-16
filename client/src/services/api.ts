import { Product, Category } from '../data/products';

const envApiUrl = import.meta.env.VITE_API_URL;
const API_URL = envApiUrl || '';

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
    return fetchAPI<Category[]>('/categories');
}

// Get category by ID
export async function getCategoryById(id: string): Promise<Category> {
    return fetchAPI<Category>(`/categories/${id}`);
}

// Get all products
export async function getProducts(): Promise<Product[]> {
    return fetchAPI<Product[]>('/products');
}

// Get products by category
export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
    return fetchAPI<Product[]>(`/products/category/${categoryId}`);
}

// Get featured products
export async function getFeaturedProducts(): Promise<Product[]> {
    return fetchAPI<Product[]>('/products/featured');
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
