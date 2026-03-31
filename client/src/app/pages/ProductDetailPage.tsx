import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import {
  Category,
  Product,
  categories as mainCategories,
} from '../../data/products';
import * as api from '../../services/api';

function toSlug(value: string): string {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function resolveMainCategory(routeCategoryId: string): Category | null {
  const aliases: Record<string, string[]> = {
    airdrops: ['airdrop', 'airdrops', 'air-freshener', 'airfreshener', 'air-fresheners', 'airfresheners'],
    handwash: ['hand-wash', 'handwashes', 'hand-washes', 'handwash-liquid'],
    toiletries: ['toiletry', 'personal-care', 'personalcare'],
  };
  const routeKey = toSlug(routeCategoryId);

  return (
    mainCategories.find((item) => {
      const keys = [item.id, item.name, ...(aliases[item.id] || [])].map(toSlug);
      return keys.includes(routeKey);
    }) || null
  );
}

function buildTagline(product: Product, category: Category | null): string {
  if (product.variant) {
    return `Premium ${category?.name ?? 'FMCG'} solution in ${product.variant}.`;
  }

  return `Premium ${category?.name ?? 'FMCG'} solution crafted by Khushit.`;
}

export function ProductDetailPage() {
  const { categoryId, productId } = useParams<{ categoryId: string; productId: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!categoryId || !productId) {
        setError('Invalid product path');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const fallbackCategory = resolveMainCategory(categoryId);
        const resolvedCategoryId = fallbackCategory?.id || categoryId;
        const productsResult = await Promise.allSettled([api.getProductsByCategory(resolvedCategoryId)]);

        const categoryData =
          fallbackCategory ||
          ({
            id: resolvedCategoryId,
            name: resolvedCategoryId.replace(/-/g, ' '),
            description: '',
            icon: '📦',
            productCount: 0
          } as Category);
        const productsData = productsResult[0].status === 'fulfilled' ? productsResult[0].value : [];

        const matchedProduct =
          productsData.find((item) => item.id === productId) ||
          productsData.find((item) => item.id === decodeURIComponent(productId)) ||
          null;

        if (!matchedProduct || !categoryData) {
          setError('Product not found');
        } else {
          setCategory(categoryData);
          setProduct(matchedProduct);
          setError(null);
        }
      } catch (fetchError) {
        console.error('Error loading product detail:', fetchError);
        setError('Unable to load product details');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [categoryId, productId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product || !category) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || 'Unable to load this product.'}</p>
          <Link to="/products" className="text-primary hover:underline">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-white to-secondary/20">
      <section className="py-4 px-4 sm:px-6 lg:px-8 border-b border-border/70 bg-white/90">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <Link to={`/products/${category.id}`} className="text-muted-foreground hover:text-primary transition-colors">
            {category.name}
          </Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground font-medium">{product.name}</span>
        </div>
      </section>

      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            className="order-1 lg:order-1"
          >
            <div className="bg-white rounded-2xl border border-border shadow-lg p-4 sm:p-6">
              <div className="aspect-square w-full rounded-xl overflow-hidden bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                ) : (
                  <span className="text-muted-foreground">No image available</span>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="order-2 lg:order-2"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{product.name}</h1>
            <p className="text-lg text-primary font-medium mb-6">{buildTagline(product, category)}</p>
            <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

            {(product.keyBenefits || []).length > 0 && (
              <div className="bg-white rounded-xl border border-border p-6 shadow-sm mb-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Key Benefits</h2>
                <ul className="space-y-3">
                  {(product.keyBenefits || []).map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.ingredientsUsage && (
              <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-foreground mb-4">Ingredients / Usage</h2>
                <p className="text-muted-foreground whitespace-pre-line">{product.ingredientsUsage}</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
