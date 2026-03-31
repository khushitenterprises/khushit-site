import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CategoryCard } from '../components/CategoryCard';
import { Category, categories as mainCategories } from '../../data/products';
import * as api from '../../services/api';
import { Package } from 'lucide-react';

function toSlug(value: string): string {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeCategoryKey(value: string): string {
  return toSlug(value).replace(/-/g, '');
}

function getCategoryKeys(category: Category): string[] {
  const aliases: Record<string, string[]> = {
    airdrops: ['airdrop', 'airdrops', 'air-freshener', 'airfreshener', 'air-fresheners', 'airfresheners'],
    handwash: ['hand-wash', 'handwashes', 'hand-washes', 'handwash-liquid'],
    toiletries: ['toiletry', 'personal-care', 'personalcare'],
  };

  const keys = [category.id, category.name, ...(aliases[category.id] || [])];
  return Array.from(new Set(keys.map(normalizeCategoryKey).filter(Boolean)));
}

export function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>(mainCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadCategoriesFromProducts() {
      setLoading(true);
      try {
        const categoryKeys = new Map<string, string[]>(
          mainCategories.map((category) => [category.id, getCategoryKeys(category)])
        );
        const counts = new Map<string, number>();

        try {
          const products = await api.getProducts();
          products.forEach((product) => {
            const productKey = normalizeCategoryKey(product.category || '');
            if (!productKey) return;
            const matchedCategory = mainCategories.find((category) =>
              (categoryKeys.get(category.id) || []).includes(productKey)
            );
            if (!matchedCategory) return;
            counts.set(matchedCategory.id, (counts.get(matchedCategory.id) || 0) + 1);
          });
        } catch (productsError) {
          console.error('Error loading categories from products:', productsError);
        }

        if (counts.size === 0) {
          try {
            const dbCategories = await api.getCategories();
            dbCategories.forEach((dbCategory) => {
              const dbKeys = [
                normalizeCategoryKey(dbCategory.id),
                normalizeCategoryKey(dbCategory.name),
              ].filter(Boolean);
              const matchedCategory = mainCategories.find((category) =>
                dbKeys.some((key) => (categoryKeys.get(category.id) || []).includes(key))
              );
              if (!matchedCategory) return;
              counts.set(
                matchedCategory.id,
                Number(dbCategory.productCount || 0) || counts.get(matchedCategory.id) || 1
              );
            });
          } catch (categoriesError) {
            console.error('Error loading categories:', categoriesError);
          }
        }

        const nextCategories = mainCategories
          .filter((category) => (counts.get(category.id) || 0) > 0)
          .map((category) => ({
            ...category,
            productCount: counts.get(category.id) || category.productCount,
          }));

        if (isMounted) {
          setCategories(nextCategories.length > 0 ? nextCategories : mainCategories);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCategoriesFromProducts();

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
          )}

        </div>
      </section>
    </div>
  );
}
