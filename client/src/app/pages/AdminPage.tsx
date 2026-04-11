import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Product, categories as frontendCategories } from '../../data/products';
import { Button } from '../components/Button';

type RegistrationRecord = {
    id: string;
    name: string;
    company: string;
    phone: string;
    email: string;
    city: string;
    message: string;
    source: 'page' | 'modal';
    createdAt: string;
};

type ProductFormState = {
    name: string;
    description: string;
    category: string;
    existingImage: string;
    keyBenefits: string;
    ingredientsUsage: string;
};

type SliderItem = {
    id: string;
    src: string;
    alt: string;
    title: string;
    link?: string;
};

type SliderFormState = {
    title: string;
    alt: string;
    existingImage: string;
};

const INITIAL_PRODUCT_FORM: ProductFormState = {
    name: '',
    description: '',
    category: frontendCategories[0]?.id || '',
    existingImage: '',
    keyBenefits: '',
    ingredientsUsage: ''
};

const INITIAL_SLIDER_FORM: SliderFormState = {
    title: '',
    alt: '',
    existingImage: ''
};

const SLIDER_TARGET_ASPECT_RATIO = 2.64;
const SLIDER_ASPECT_TOLERANCE = 0.06;
const SLIDER_MIN_WIDTH = 1440;
const SLIDER_MIN_HEIGHT = 545;

function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const objectUrl = URL.createObjectURL(file);
        const image = new Image();

        image.onload = () => {
            const width = image.naturalWidth;
            const height = image.naturalHeight;
            URL.revokeObjectURL(objectUrl);
            resolve({ width, height });
        };

        image.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Unable to read image dimensions.'));
        };

        image.src = objectUrl;
    });
}

export function AdminPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [loginError, setLoginError] = useState('');

    const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
    const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(false);
    const [registrationsError, setRegistrationsError] = useState('');

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [productsError, setProductsError] = useState('');
    const [productSuccess, setProductSuccess] = useState('');

    const [productForm, setProductForm] = useState<ProductFormState>(INITIAL_PRODUCT_FORM);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [editingProductId, setEditingProductId] = useState('');
    const [isSavingProduct, setIsSavingProduct] = useState(false);

    const [sliders, setSliders] = useState<SliderItem[]>([]);
    const [isLoadingSliders, setIsLoadingSliders] = useState(false);
    const [sliderError, setSliderError] = useState('');
    const [sliderSuccess, setSliderSuccess] = useState('');
    const [sliderForm, setSliderForm] = useState<SliderFormState>(INITIAL_SLIDER_FORM);
    const [sliderImageFile, setSliderImageFile] = useState<File | null>(null);
    const [sliderImagePreviewUrl, setSliderImagePreviewUrl] = useState('');
    const [editingSliderId, setEditingSliderId] = useState('');
    const [isSavingSlider, setIsSavingSlider] = useState(false);

    const apiBase = useMemo(() => import.meta.env.VITE_API_URL || '', []);

    const authHeader = useMemo(() => {
        if (!email || !password) {
            return '';
        }

        return `Basic ${btoa(`${email.trim()}:${password}`)}`;
    }, [email, password]);

    const resetProductForm = () => {
        setProductForm(INITIAL_PRODUCT_FORM);
        setImageFile(null);
        setImagePreviewUrl('');
        setEditingProductId('');
    };

    const resetSliderForm = () => {
        setSliderForm(INITIAL_SLIDER_FORM);
        setSliderImageFile(null);
        setSliderImagePreviewUrl('');
        setEditingSliderId('');
    };

    const loadRegistrations = useCallback(async () => {
        if (!authHeader) {
            return;
        }

        setIsLoadingRegistrations(true);
        setRegistrationsError('');

        try {
            const response = await fetch(`${apiBase}/api/admin/registrations`, {
                headers: {
                    Authorization: authHeader
                }
            });

            if (!response.ok) {
                throw new Error('Unable to load registered users');
            }

            const data = (await response.json()) as RegistrationRecord[];
            setRegistrations(data);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to load registered users';
            setRegistrationsError(message);
        } finally {
            setIsLoadingRegistrations(false);
        }
    }, [apiBase, authHeader]);

    const loadProducts = useCallback(async () => {
        if (!authHeader) {
            return;
        }

        setIsLoadingProducts(true);
        setProductsError('');

        try {
            const response = await fetch(`${apiBase}/api/admin/products`, {
                headers: {
                    Authorization: authHeader
                }
            });

            if (!response.ok) {
                throw new Error('Unable to load products');
            }

            const data = (await response.json()) as Product[];
            setProducts(data);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to load products';
            setProductsError(message);
        } finally {
            setIsLoadingProducts(false);
        }
    }, [apiBase, authHeader]);

    const loadSliders = useCallback(async () => {
        if (!authHeader) {
            return;
        }

        setIsLoadingSliders(true);
        setSliderError('');

        try {
            const response = await fetch(`${apiBase}/api/admin/sliders`, {
                headers: {
                    Authorization: authHeader
                }
            });

            if (!response.ok) {
                throw new Error('Unable to load sliders');
            }

            const data = (await response.json()) as SliderItem[];
            setSliders(data);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to load sliders';
            setSliderError(message);
        } finally {
            setIsLoadingSliders(false);
        }
    }, [apiBase, authHeader]);

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoggingIn(true);
        setLoginError('');

        try {
            const response = await fetch(`${apiBase}/api/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Invalid email or password');
            }

            setIsAuthenticated(true);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Login failed';
            setLoginError(message);
            setIsAuthenticated(false);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setEmail('');
        setPassword('');
        setRegistrations([]);
        setProducts([]);
        setProductsError('');
        setProductSuccess('');
        resetProductForm();
        setSliders([]);
        setSliderError('');
        setSliderSuccess('');
        resetSliderForm();
    };

    const handleProductFieldChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target;
        setProductForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProductImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const nextFile = event.target.files?.[0] || null;
        setImageFile(nextFile);
    };

    const handleSliderFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setSliderForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSliderImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.target;
        const nextFile = input.files?.[0] || null;

        if (!nextFile) {
            setSliderImageFile(null);
            return;
        }

        try {
            const { width, height } = await readImageDimensions(nextFile);
            const ratio = width / height;
            const ratioDelta = Math.abs(ratio - SLIDER_TARGET_ASPECT_RATIO);
            const isAspectValid = ratioDelta <= SLIDER_ASPECT_TOLERANCE;
            const isSizeValid = width >= SLIDER_MIN_WIDTH && height >= SLIDER_MIN_HEIGHT;

            if (!isAspectValid || !isSizeValid) {
                setSliderImageFile(null);
                input.value = '';
                setSliderError(
                    `Invalid poster size (${width}x${height}). Use approx 2.64:1 ratio, recommended 1890x716 or 1440x545.`
                );
                return;
            }

            setSliderError('');
            setSliderImageFile(nextFile);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to validate image.';
            setSliderError(message);
            setSliderImageFile(null);
            input.value = '';
        }
    };

    const handleProductSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!authHeader) {
            return;
        }

        setIsSavingProduct(true);
        setProductsError('');
        setProductSuccess('');

        const payload = new FormData();
        payload.append('name', productForm.name);
        payload.append('description', productForm.description);
        payload.append('category', productForm.category);
        payload.append('keyBenefits', productForm.keyBenefits);
        payload.append('ingredientsUsage', productForm.ingredientsUsage);
        if (imageFile) {
            payload.append('image', imageFile);
        }

        const endpoint = editingProductId
            ? `${apiBase}/api/admin/products/${encodeURIComponent(editingProductId)}`
            : `${apiBase}/api/admin/products`;
        const method = editingProductId ? 'PUT' : 'POST';

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    Authorization: authHeader
                },
                body: payload
            });

            const json = await response.json().catch(() => null);

            if (!response.ok) {
                const errorMessage =
                    json && typeof json.error === 'string'
                        ? json.error
                        : editingProductId
                          ? 'Unable to update product'
                          : 'Unable to add product';
                throw new Error(errorMessage);
            }

            setProductSuccess(editingProductId ? 'Product updated successfully.' : 'Product added successfully.');
            await loadProducts();
            resetProductForm();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to save product';
            setProductsError(message);
        } finally {
            setIsSavingProduct(false);
        }
    };

    const handleEditProduct = (product: Product) => {
        setEditingProductId(product.id);
        setProductForm({
            name: product.name,
            description: product.description,
            category: product.category,
            existingImage: product.image || '',
            keyBenefits: (product.keyBenefits || []).join('\n'),
            ingredientsUsage: product.ingredientsUsage || ''
        });
        setImageFile(null);
        setProductSuccess('');
        setProductsError('');
    };

    const handleDeleteProduct = async (product: Product) => {
        if (!authHeader) {
            return;
        }

        const confirmed = window.confirm(`Delete product "${product.name}"?`);
        if (!confirmed) {
            return;
        }

        setProductsError('');
        setProductSuccess('');

        try {
            const response = await fetch(`${apiBase}/api/admin/products/${encodeURIComponent(product.id)}`, {
                method: 'DELETE',
                headers: {
                    Authorization: authHeader
                }
            });

            if (!response.ok) {
                throw new Error('Unable to delete product');
            }

            if (editingProductId === product.id) {
                resetProductForm();
            }

            setProductSuccess('Product deleted successfully.');
            await loadProducts();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to delete product';
            setProductsError(message);
        }
    };

    const handleSliderSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!authHeader) {
            return;
        }

        setIsSavingSlider(true);
        setSliderError('');
        setSliderSuccess('');

        const payload = new FormData();
        payload.append('title', sliderForm.title);
        payload.append('alt', sliderForm.alt);
        payload.append('link', '');
        if (sliderImageFile) {
            payload.append('image', sliderImageFile);
        }

        const endpoint = editingSliderId
            ? `${apiBase}/api/admin/sliders/${encodeURIComponent(editingSliderId)}`
            : `${apiBase}/api/admin/sliders`;
        const method = editingSliderId ? 'PUT' : 'POST';

        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    Authorization: authHeader
                },
                body: payload
            });

            const json = await response.json().catch(() => null);
            if (!response.ok) {
                const errorMessage =
                    json && typeof json.error === 'string'
                        ? json.error
                        : editingSliderId
                          ? 'Unable to update slider'
                          : 'Unable to add slider';
                throw new Error(errorMessage);
            }

            setSliderSuccess(editingSliderId ? 'Slider updated successfully.' : 'Slider added successfully.');
            await loadSliders();
            resetSliderForm();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to save slider';
            setSliderError(message);
        } finally {
            setIsSavingSlider(false);
        }
    };

    const handleEditSlider = (slider: SliderItem) => {
        setEditingSliderId(slider.id);
        setSliderForm({
            title: slider.title || '',
            alt: slider.alt || '',
            existingImage: slider.src || ''
        });
        setSliderImageFile(null);
        setSliderSuccess('');
        setSliderError('');
    };

    const handleDeleteSlider = async (slider: SliderItem) => {
        if (!authHeader) {
            return;
        }

        const confirmed = window.confirm(`Delete slider "${slider.title}"?`);
        if (!confirmed) {
            return;
        }

        setSliderError('');
        setSliderSuccess('');

        try {
            const response = await fetch(`${apiBase}/api/admin/sliders/${encodeURIComponent(slider.id)}`, {
                method: 'DELETE',
                headers: {
                    Authorization: authHeader
                }
            });

            if (!response.ok) {
                throw new Error('Unable to delete slider');
            }

            if (editingSliderId === slider.id) {
                resetSliderForm();
            }

            setSliderSuccess('Slider deleted successfully.');
            await loadSliders();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unable to delete slider';
            setSliderError(message);
        }
    };

    const formatRegistrationDate = (value?: string) => {
        if (!value) {
            return '-';
        }
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) {
            return value;
        }
        return parsed.toLocaleString();
    };

    const handleExportRegistrationsPdf = () => {
        if (!registrations.length) {
            setRegistrationsError('No registrations to export.');
            return;
        }

        setRegistrationsError('');

        const tableRows = registrations
            .map(
                (record, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${record.name || '-'}</td>
                    <td>${record.company || '-'}</td>
                    <td>${record.phone || '-'}</td>
                    <td>${record.email || '-'}</td>
                    <td>${record.city || '-'}</td>
                    <td>${record.source || '-'}</td>
                    <td>${formatRegistrationDate(record.createdAt)}</td>
                    <td>${(record.message || '-').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
                </tr>
            `
            )
            .join('');

        const html = `
            <!doctype html>
            <html>
                <head>
                    <meta charset="utf-8" />
                    <title>Registrations Export</title>
                    <style>
                        body { font-family: Arial, sans-serif; color: #111827; padding: 24px; }
                        h1 { font-size: 20px; margin-bottom: 4px; }
                        p { margin: 0 0 16px; color: #6b7280; }
                        table { width: 100%; border-collapse: collapse; font-size: 12px; }
                        th, td { border: 1px solid #e5e7eb; padding: 8px; vertical-align: top; text-align: left; }
                        th { background: #f9fafb; }
                        tr:nth-child(even) { background: #f8fafc; }
                        .note { margin-top: 12px; font-size: 12px; color: #6b7280; }
                    </style>
                </head>
                <body>
                    <h1>Registration Export</h1>
                    <p>Generated on ${new Date().toLocaleString()}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Company</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>City</th>
                                <th>Source</th>
                                <th>Date</th>
                                <th>Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                    <p class="note">If the print dialog does not open automatically, use your browser's Share/Print option.</p>
                    <script>
                        window.addEventListener('load', () => {
                            setTimeout(() => {
                                window.print();
                            }, 300);
                        });
                    </script>
                </body>
            </html>
        `;

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const printWindow = window.open(url, '_blank');

        if (!printWindow) {
            const fallbackWindow = window.open(url, '_self');
            if (!fallbackWindow) {
                setRegistrationsError('Popup blocked. Please allow popups to export PDF.');
                URL.revokeObjectURL(url);
                return;
            }
        }

        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 5000);
    };

    useEffect(() => {
        if (!isAuthenticated) {
            return;
        }

        loadRegistrations();
        loadProducts();
        loadSliders();
    }, [isAuthenticated, loadRegistrations, loadProducts, loadSliders]);

    useEffect(() => {
        if (imageFile) {
            const objectUrl = URL.createObjectURL(imageFile);
            setImagePreviewUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }

        setImagePreviewUrl(productForm.existingImage || '');
    }, [imageFile, productForm.existingImage]);

    useEffect(() => {
        if (sliderImageFile) {
            const objectUrl = URL.createObjectURL(sliderImageFile);
            setSliderImagePreviewUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }

        setSliderImagePreviewUrl(sliderForm.existingImage || '');
    }, [sliderImageFile, sliderForm.existingImage]);

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-md mx-auto py-16">
                    <div className="bg-white p-8 rounded-xl shadow-md">
                        <h1 className="text-3xl font-bold text-foreground mb-2 text-center">Admin Login</h1>
                        <p className="text-muted-foreground text-center mb-8">
                            Sign in to access the admin dashboard.
                        </p>

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label htmlFor="admin-email" className="block text-sm font-medium text-foreground mb-2">
                                    Email
                                </label>
                                <input
                                    id="admin-email"
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="test@gmail.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="admin-password" className="block text-sm font-medium text-foreground mb-2">
                                    Password
                                </label>
                                <input
                                    id="admin-password"
                                    type="password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="Enter admin password"
                                />
                            </div>

                            {loginError && <p className="text-sm text-red-600">{loginError}</p>}

                            <Button type="submit" className="w-full" disabled={isLoggingIn}>
                                {isLoggingIn ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto py-8 sm:py-10">
                <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-center sm:text-left">
                        <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
                        <p className="text-muted-foreground max-w-2xl">
                            Manage products, sliders, and view registered users.
                        </p>
                    </div>
                    <Button onClick={handleLogout}>Logout</Button>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <h2 className="text-2xl font-semibold text-foreground">Product Management</h2>
                        <Button onClick={loadProducts} disabled={isLoadingProducts}>
                            {isLoadingProducts ? 'Refreshing...' : 'Refresh Products'}
                        </Button>
                    </div>

                    <form onSubmit={handleProductSubmit} className="space-y-4 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="product-name" className="block text-sm font-medium text-foreground mb-2">
                                    Product Name *
                                </label>
                                <input
                                    id="product-name"
                                    name="name"
                                    type="text"
                                    required
                                    value={productForm.name}
                                    onChange={handleProductFieldChange}
                                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="Enter product name"
                                />
                            </div>

                            <div>
                                <label htmlFor="product-category" className="block text-sm font-medium text-foreground mb-2">
                                    Category *
                                </label>
                                <select
                                    id="product-category"
                                    name="category"
                                    required
                                    value={productForm.category}
                                    onChange={handleProductFieldChange}
                                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                >
                                    <option value="" disabled>
                                        Select category
                                    </option>
                                    {frontendCategories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="product-image" className="block text-sm font-medium text-foreground mb-2">
                                    Product Image {!editingProductId ? '*' : ''}
                                </label>
                                <input
                                    id="product-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProductImageChange}
                                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                />
                            </div>

                            {imagePreviewUrl && (
                                <div className="md:col-span-2">
                                    <img
                                        src={imagePreviewUrl}
                                        alt="Product preview"
                                        className="h-36 w-36 object-cover rounded-lg border border-border"
                                    />
                                </div>
                            )}

                            <div className="md:col-span-2">
                                <label htmlFor="product-description" className="block text-sm font-medium text-foreground mb-2">
                                    Description *
                                </label>
                                <textarea
                                    id="product-description"
                                    name="description"
                                    required
                                    rows={4}
                                    value={productForm.description}
                                    onChange={handleProductFieldChange}
                                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                                    placeholder="Enter product description"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="product-key-benefits" className="block text-sm font-medium text-foreground mb-2">
                                    Key Benefits (one per line)
                                </label>
                                <textarea
                                    id="product-key-benefits"
                                    name="keyBenefits"
                                    rows={4}
                                    value={productForm.keyBenefits}
                                    onChange={handleProductFieldChange}
                                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                                    placeholder={"Benefit 1\nBenefit 2\nBenefit 3"}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="product-ingredients-usage" className="block text-sm font-medium text-foreground mb-2">
                                    Ingredients / Usage
                                </label>
                                <textarea
                                    id="product-ingredients-usage"
                                    name="ingredientsUsage"
                                    rows={4}
                                    value={productForm.ingredientsUsage}
                                    onChange={handleProductFieldChange}
                                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                                    placeholder="Add ingredients and/or usage instructions"
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Button type="submit" disabled={isSavingProduct}>
                                {isSavingProduct
                                    ? editingProductId
                                        ? 'Updating...'
                                        : 'Adding...'
                                    : editingProductId
                                      ? 'Update Product'
                                      : 'Add Product'}
                            </Button>
                            {editingProductId && (
                                <Button type="button" onClick={resetProductForm} className="bg-gray-700 hover:bg-gray-800">
                                    Cancel Edit
                                </Button>
                            )}
                        </div>
                    </form>

                    {productsError && <p className="text-sm text-red-600 mb-4">{productsError}</p>}
                    {productSuccess && <p className="text-sm text-green-600 mb-4">{productSuccess}</p>}

                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <table className="min-w-[720px] w-full text-xs sm:text-sm">
                            <thead>
                                <tr className="border-b border-border text-left">
                                    <th className="py-2 pr-4">Name</th>
                                    <th className="py-2 pr-4">Category</th>
                                    <th className="py-2 pr-4">ID</th>
                                    <th className="py-2 pr-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="border-b border-border/60 align-top">
                                        <td className="py-2 pr-4 whitespace-nowrap">{product.name}</td>
                                        <td className="py-2 pr-4 whitespace-nowrap">{product.category}</td>
                                        <td className="py-2 pr-4 whitespace-nowrap">{product.id}</td>
                                        <td className="py-2 pr-4">
                                            <div className="flex flex-wrap gap-2">
                                                <Button type="button" onClick={() => handleEditProduct(product)}>
                                                    Update
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={() => handleDeleteProduct(product)}
                                                    className="bg-red-600 hover:bg-red-700"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {!isLoadingProducts && products.length === 0 && (
                                    <tr>
                                        <td className="py-4 text-muted-foreground" colSpan={4}>
                                            No products found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <h2 className="text-2xl font-semibold text-foreground">Slider Management</h2>
                        <Button onClick={loadSliders} disabled={isLoadingSliders}>
                            {isLoadingSliders ? 'Refreshing...' : 'Refresh Sliders'}
                        </Button>
                    </div>

                    <form onSubmit={handleSliderSubmit} className="space-y-4 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="slider-title" className="block text-sm font-medium text-foreground mb-2">
                                    Slider Title *
                                </label>
                                <input
                                    id="slider-title"
                                    name="title"
                                    type="text"
                                    required
                                    value={sliderForm.title}
                                    onChange={handleSliderFieldChange}
                                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="Enter slider title"
                                />
                            </div>

                            <div>
                                <label htmlFor="slider-alt" className="block text-sm font-medium text-foreground mb-2">
                                    Alt Text
                                </label>
                                <input
                                    id="slider-alt"
                                    name="alt"
                                    type="text"
                                    value={sliderForm.alt}
                                    onChange={handleSliderFieldChange}
                                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="Accessible image description"
                                />
                            </div>

                            <div>
                                <label htmlFor="slider-image" className="block text-sm font-medium text-foreground mb-2">
                                    Slider Image {!editingSliderId ? '*' : ''}
                                </label>
                                <input
                                    id="slider-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleSliderImageChange}
                                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                />
                                <p className="mt-2 text-xs text-muted-foreground">
                                    Use ratio ~2.64:1 (recommended: 1890x716 or 1440x545).
                                </p>
                            </div>

                            {sliderImagePreviewUrl && (
                                <div className="md:col-span-2">
                                    <img
                                        src={sliderImagePreviewUrl}
                                        alt="Slider preview"
                                        className="h-36 w-60 object-cover rounded-lg border border-border"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Button type="submit" disabled={isSavingSlider}>
                                {isSavingSlider
                                    ? editingSliderId
                                        ? 'Updating...'
                                        : 'Adding...'
                                    : editingSliderId
                                      ? 'Update Slider'
                                      : 'Add Slider'}
                            </Button>
                            {editingSliderId && (
                                <Button type="button" onClick={resetSliderForm} className="bg-gray-700 hover:bg-gray-800">
                                    Cancel Edit
                                </Button>
                            )}
                        </div>
                    </form>

                    {sliderError && <p className="text-sm text-red-600 mb-4">{sliderError}</p>}
                    {sliderSuccess && <p className="text-sm text-green-600 mb-4">{sliderSuccess}</p>}

                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <table className="min-w-[720px] w-full text-xs sm:text-sm">
                            <thead>
                                <tr className="border-b border-border text-left">
                                    <th className="py-2 pr-4">Title</th>
                                    <th className="py-2 pr-4">ID</th>
                                    <th className="py-2 pr-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sliders.map((slider) => (
                                    <tr key={slider.id} className="border-b border-border/60 align-top">
                                        <td className="py-2 pr-4 whitespace-nowrap">{slider.title}</td>
                                        <td className="py-2 pr-4 whitespace-nowrap">{slider.id}</td>
                                        <td className="py-2 pr-4">
                                            <div className="flex flex-wrap gap-2">
                                                <Button type="button" onClick={() => handleEditSlider(slider)}>
                                                    Edit
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={() => handleDeleteSlider(slider)}
                                                    className="bg-red-600 hover:bg-red-700"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {!isLoadingSliders && sliders.length === 0 && (
                                    <tr>
                                        <td className="py-4 text-muted-foreground" colSpan={3}>
                                            No sliders found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md mb-10">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                        <h2 className="text-2xl font-semibold text-foreground">Registered Users</h2>
                        <div className="flex flex-wrap gap-2">
                            <Button onClick={loadRegistrations} disabled={isLoadingRegistrations}>
                                {isLoadingRegistrations ? 'Refreshing...' : 'Refresh'}
                            </Button>
                            <Button
                                type="button"
                                onClick={handleExportRegistrationsPdf}
                                className="bg-emerald-600 hover:bg-emerald-700"
                            >
                                Export PDF
                            </Button>
                        </div>
                    </div>

                    {registrationsError && <p className="text-sm text-red-600 mb-4">{registrationsError}</p>}

                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <table className="min-w-[1100px] w-full text-xs sm:text-sm">
                            <thead>
                                <tr className="border-b border-border text-left">
                                    <th className="py-2 pr-4">Name</th>
                                    <th className="py-2 pr-4">Email</th>
                                    <th className="py-2 pr-4">Phone</th>
                                    <th className="py-2 pr-4">Company</th>
                                    <th className="py-2 pr-4">City</th>
                                    <th className="py-2 pr-4">Source</th>
                                    <th className="py-2 pr-4">Date</th>
                                    <th className="py-2 pr-4">Message</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.map((record) => (
                                    <tr key={record.id} className="border-b border-border/60 align-top">
                                        <td className="py-2 pr-4 whitespace-nowrap">{record.name || '-'}</td>
                                        <td className="py-2 pr-4 whitespace-nowrap">{record.email || '-'}</td>
                                        <td className="py-2 pr-4 whitespace-nowrap">{record.phone || '-'}</td>
                                        <td className="py-2 pr-4 whitespace-nowrap">{record.company || '-'}</td>
                                        <td className="py-2 pr-4 whitespace-nowrap">{record.city || '-'}</td>
                                        <td className="py-2 pr-4 whitespace-nowrap">{record.source || '-'}</td>
                                        <td className="py-2 pr-4 whitespace-nowrap">
                                            {record.createdAt ? new Date(record.createdAt).toLocaleString() : '-'}
                                        </td>
                                        <td className="py-2 pr-4 max-w-xs whitespace-pre-wrap">{record.message || '-'}</td>
                                    </tr>
                                ))}

                                {!isLoadingRegistrations && registrations.length === 0 && (
                                    <tr>
                                        <td className="py-4 text-muted-foreground" colSpan={8}>
                                            No registrations found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
