import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { ImageSlider } from '../components/ImageSlider';
import { Product } from '../../data/products';
import * as api from '../../services/api';
import { Award, Shield, TrendingUp } from 'lucide-react';
import c1 from '../../assets/c1.PNG';
import c2 from '../../assets/c2.PNG';

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadFromDatabase() {
      try {
        setProductsLoading(true);
        setProductsError(null);
        const productsResult = await api.getProducts();
        if (!isMounted) {
          return;
        }
        setProducts(productsResult);
      } catch (error) {
        console.error('Error loading products from database:', error);
        if (isMounted) {
          setProducts([]);
          setProductsError('Unable to load products right now.');
        }
      } finally {
        if (isMounted) {
          setProductsLoading(false);
        }
      }
    }

    loadFromDatabase();

    return () => {
      isMounted = false;
    };
  }, []);


  return (
    <div className="min-h-screen">
      <>
          {/* Image Slider Section */}
          <ImageSlider />

          {/* Products Section */}
          <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Our Products
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Products loaded from database
                </p>
              </motion.div>

              {productsLoading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
              ) : productsError ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">{productsError}</p>
                </div>
              ) : products.length === 0 ? (
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
                      transition={{ delay: index * 0.04 }}
                    >
                      <Link to={`/products/${encodeURIComponent(product.category)}/${encodeURIComponent(product.id)}`}>
                        <ProductCard product={product} />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
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
    </div>
  );
}

