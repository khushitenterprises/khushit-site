import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { CategoryCard } from '../components/CategoryCard';
import { ProductCard } from '../components/ProductCard';
import { ImageSlider } from '../components/ImageSlider';
import { Category, Product } from '../../data/products';
import * as api from '../../services/api';
import { Award, Shield, TrendingUp, Sparkles } from 'lucide-react';
import c1 from '../../assets/c1.PNG';
import c2 from '../../assets/c2.PNG';

export function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [categoriesData, productsData] = await Promise.all([
          api.getCategories(),
          api.getFeaturedProducts()
        ]);
        console.log('[HomePage] categories:', categoriesData.length, categoriesData);
        console.log('[HomePage] featuredProducts:', productsData.length, productsData);
        setCategories(categoriesData);
        setFeaturedProducts(productsData);
        setError(null);
      } catch (err) {
        setError('Failed to load data. Please make sure the backend server is running.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);


  return (
    <div className="min-h-screen">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h3 className="text-red-800 font-semibold mb-2">Error Loading Data</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-sm text-red-500">Make sure the backend server is running and your phone is on the same Wi-Fi network.</p>
          </div>
        </div>
      )}

      {/* Main Content - only show when not loading and no error */}
      {!loading && !error && (
        <>
          {/* Image Slider Section */}
          <ImageSlider />

          {/* Product Categories Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Our Product Categories
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Explore our comprehensive range of quality products across multiple categories
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CategoryCard category={category} />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Why Choose Khushit Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Why Choose Khushit?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Our commitment to quality, consistency, and trust sets us apart
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: <Shield className="w-12 h-12" />,
                    title: 'Manufacturing Quality',
                    description: 'State-of-the-art facilities ensuring the highest quality standards in every product we manufacture.'
                  },
                  {
                    icon: <TrendingUp className="w-12 h-12" />,
                    title: 'Consistency',
                    description: 'Reliable and consistent product quality that you can trust, batch after batch.'
                  },
                  {
                    icon: <Award className="w-12 h-12" />,
                    title: 'Trust & Excellence',
                    description: 'Years of expertise and dedication to delivering products that exceed expectations.'
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    whileHover={{ y: -10 }}
                    className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center text-white mb-6">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-semibold text-foreground mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Certificates Section */}
          <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10 sm:mb-12 lg:mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Certificates
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Certified to international safety and quality benchmarks (ISO, GMP and related standards)
                </p>
              </motion.div>

              {/* Centered Certificates */}
              <div className="flex justify-center items-center gap-12 flex-wrap">
                {[c1, c2].map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt={`certificate-${idx + 1}`}
                    className="h-40 sm:h-48 md:h-56 w-auto object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          {/* <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-12 text-center text-white shadow-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Experience Quality?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of satisfied customers who trust Khushit for their daily needs
            </p>
            <Link to="/register">
              <Button variant="outline" size="lg" className="bg-white text-primary hover:bg-white/90">
                Register for Exhibition
              </Button>
            </Link>
          </motion.div>
        </div>
      </section> */}
        </>
      )}
    </div>
  );
}

