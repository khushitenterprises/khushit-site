import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';
import { Product, Category } from '../../data/products';
import * as api from '../../services/api';
import { ChevronRight } from 'lucide-react';

function toSlug(value: string): string {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function resolveDatabaseCategory(routeCategoryId: string, categories: Category[]): Category | null {
  const aliases: Record<string, string[]> = {
    'bath-soaps': ['bath-soap', 'bathsoap', 'bathsoaps', 'soap', 'soaps'],
    detergents: ['detergent'],
    'fabric-conditioner': ['fabricconditioner', 'fabric-conditioners', 'fabricconditioners', 'fabric-softener', 'fabricsoftener'],
    airdrops: ['airdrop', 'airdrops', 'air-freshener', 'airfreshener', 'air-fresheners', 'airfresheners'],
    'hair-oil': ['hair-oils', 'hairoil', 'hairoils'],
    handwash: ['hand-wash', 'handwashes', 'hand-washes', 'handwash-liquid'],
    shampoo: ['shampoos'],
    toiletries: ['toiletry', 'personal-care', 'personalcare'],
  };
  const routeKey = toSlug(routeCategoryId);

  return (
    categories.find((item) => {
      const keys = [item.id, item.name, ...(aliases[item.id] || [])].map(toSlug);
      return keys.includes(routeKey);
    }) || null
  );
}

export function CategoryDetailPage() {
  const { categoryId } = useParams<{ categoryId: string }>();

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!categoryId) return;

      try {
        setLoading(true);
        const [productsResult, categoriesResult] = await Promise.allSettled([
          api.getProductsByCategory(categoryId),
          api.getCategories(),
        ]);
        const nextProducts = productsResult.status === 'fulfilled' ? productsResult.value : [];
        const resolvedCategory =
          categoriesResult.status === 'fulfilled'
            ? resolveDatabaseCategory(categoryId, categoriesResult.value)
            : null;
        const nextCategory =
          resolvedCategory ||
          ({
            id: categoryId,
            name: categoryId.replace(/-/g, ' '),
            description: '',
            icon: '',
            productCount: nextProducts.length,
          } as Category);

        setCategory(nextCategory);
        setFilteredProducts(nextProducts);
        setError(null);
      } catch (err) {
        setCategory(null);
        setFilteredProducts([]);
        setError('Failed to load products for this category');
        console.error('Error fetching category data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [categoryId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading category...</p>
        </div>
      </div>
    );
  }

  // Error or not found state
  if (error || !category) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Category Not Found</h1>
          <Link to="/products" className="text-primary hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const isImageIcon = typeof category.icon === 'string' && /\.(png|jpe?g|svg|webp)$/i.test(category.icon);

  return (
    <div className="min-h-screen pt-20">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link to="/products" className="text-muted-foreground hover:text-primary transition-colors">
              Products
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium">{category.name}</span>
          </div>
        </div>
      </div>

      {/* Category Banner */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary to-accent -z-10" />

        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-6"
          >
            {isImageIcon ? (
              <div className="w-20 h-20 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                <img
                  src={category.icon}
                  alt={`${category.name} icon`}
                  className="w-12 h-12 object-contain"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="text-6xl">{category.icon}</div>
            )}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">{category.name}</h1>
              <p className="text-xl text-muted-foreground mb-2">{category.description}</p>
              <p className="text-sm text-primary font-medium">
                {filteredProducts.length} {category.id === 'airdrops' ? 'Flavours Available' : 'Products Available'}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter Bar (UI Only) */}

      {/* Products Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No products found in this category.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/products/${encodeURIComponent(category.id)}/${encodeURIComponent(product.id)}`}>
                      <ProductCard product={product} />
                    </Link>
                  </motion.div>
                ))}
              </div>
              {filteredProducts.length > 12 && (
                <div className="mt-12 flex justify-center gap-2">
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Previous
                  </button>
                  <button className="px-4 py-2 bg-primary text-white rounded-lg">1</button>
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    2
                  </button>
                  <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Related Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Explore Other Categories</h2>
          <div className="flex justify-center">
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-primary text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View All Categories
              </motion.button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
