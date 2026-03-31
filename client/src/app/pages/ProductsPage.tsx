import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { Category, Product } from '../../data/products';
import * as api from '../../services/api';
import { Package } from 'lucide-react';

function toSlug(value: string): string {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toCategoryName(value: string): string {
  return String(value || 'Uncategorized')
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function deriveCategoriesFromProducts(items: Product[]): Category[] {
  const counts = new Map<string, number>();

  items.forEach((product) => {
    const categoryId = toSlug(product.category || 'uncategorized');
    counts.set(categoryId, (counts.get(categoryId) || 0) + 1);
  });

  return Array.from(counts.entries()).map(([id, productCount]) => ({
    id,
    name: toCategoryName(id),
    description: '',
    icon: '📦',
    productCount,
  }));
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(`${label} request timed out`)), timeoutMs);
    }),
  ]);
}

export function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      setLoading(true);
      try {
        let nextProducts: Product[] = [];
        let nextCategories: Category[] = [];

        try {
          nextProducts = await withTimeout(api.getProducts(), 12000, 'Products');
        } catch (error) {
          console.error('Error fetching products:', error);
        }

        try {
          nextCategories = await withTimeout(api.getCategories(), 12000, 'Categories');
        } catch (error) {
          console.error('Error fetching categories:', error);
        }

        if (!nextCategories.length && nextProducts.length) {
          nextCategories = deriveCategoriesFromProducts(nextProducts);
        }

        if (isMounted) {
          setProducts(nextProducts);
          setCategories(nextCategories);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-primary/5 via-secondary to-accent">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-6">
              <Package className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Our <span className="text-primary">Products</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Explore our comprehensive range of quality personal care and household products.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {!loading && (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                  Shop by <span className="text-primary">Category</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Click any category to view its products.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <CategoryCard category={category} />
                  </motion.div>
                ))}
              </div>
              {categories.length === 0 && (
                <div className="text-center mb-16">
                  <p className="text-muted-foreground">No categories found.</p>
                </div>
              )}

              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                  All <span className="text-primary">Products</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Showing products loaded from the database.
                </p>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No products found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Link to={`/products/${product.category}/${product.id}`}>
                        <ProductCard product={product} />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
