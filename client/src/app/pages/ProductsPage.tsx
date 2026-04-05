import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CategoryCard } from '../components/CategoryCard';
import { Category } from '../../data/products';
import * as api from '../../services/api';
import { Package } from 'lucide-react';

export function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      setLoading(true);
      try {
        const dbCategories = await api.getCategories();
        const nextCategories = dbCategories.filter((category) => Number(category.productCount || 0) > 0);
        if (isMounted) {
          setCategories(nextCategories);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        if (isMounted) setCategories([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCategories();

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
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Shop by <span className="text-primary">Category</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Click any category to view its products.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading categories...</p>
              </div>
            </div>
          ) : (
            categories.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No categories found in database.</p>
              </div>
            ) : (
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
            )
          )}

        </div>
      </section>
    </div>
  );
}
