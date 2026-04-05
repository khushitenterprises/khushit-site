import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Category } from '../../data/products';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const isImageIcon = typeof category.icon === 'string' && /\.(png|jpe?g|svg|webp)$/i.test(category.icon);

  return (
    <Link to={`/products/${encodeURIComponent(category.id)}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.05, y: -5 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10">
          <div className="mb-4">
            {isImageIcon ? (
              <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                <img
                  src={category.icon}
                  alt={`${category.name} icon`}
                  className="w-10 h-10 object-contain"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="text-5xl">{category.icon}</div>
            )}
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">{category.name}</h3>
          <p className="text-muted-foreground line-clamp-2 min-h-[3rem]">{category.description}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-primary font-medium">
              {category.productCount} Products
            </span>
            <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
