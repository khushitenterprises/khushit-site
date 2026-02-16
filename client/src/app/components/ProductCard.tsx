import { motion } from 'motion/react';
import { Product } from '../../data/products';
import { Package } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(100, 45, 134, 0.1), 0 10px 10px -5px rgba(100, 45, 134, 0.04)' }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className="aspect-square bg-gradient-to-br from-secondary to-accent flex items-center justify-center relative overflow-hidden group">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`absolute inset-0 flex items-center justify-center ${product.image ? 'hidden' : ''} bg-secondary/20`}>
          <Package className="w-16 h-16 text-primary opacity-50" />
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">{product.name}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
      </div>
    </motion.div>
  );
}
