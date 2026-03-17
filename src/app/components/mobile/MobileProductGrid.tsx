import { motion } from 'motion/react';
import { Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { PLACEHOLDER_IMAGE } from '../../constants';

/** Supports both API Product (id: string, images, on_sale, new_arrival) and data Product (id: number, sale, isNew) */
interface ProductLike {
  id: string | number;
  name: string;
  price: number;
  images: string[];
  category?: string;
  originalPrice?: number;
  original_price?: number;
  rating?: number;
  reviews?: number;
  sale?: boolean;
  isNew?: boolean;
  on_sale?: boolean;
  new_arrival?: boolean;
}

interface MobileProductGridProps {
  products: ProductLike[];
  title?: string;
}

const placeholder = PLACEHOLDER_IMAGE;

export function MobileProductGrid({ products = [], title = 'Featured Products' }: MobileProductGridProps) {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleWishlistToggle = (e: React.MouseEvent, product: ProductLike) => {
    e.stopPropagation();
    const id = product.id;
    if (isInWishlist(id)) {
      removeFromWishlist(id);
    } else {
      const img = product.images?.[0] ?? placeholder;
      addToWishlist({
        id,
        name: product.name,
        price: product.price,
        image: img,
        category: product.category ?? '',
        gender: 'unisex',
      });
    }
  };

  return (
    <div className="w-full bg-white py-6">
      {/* Section Header */}
      {(title || products.length > 0) && (
        <div className="px-4 mb-4">
          {title && <h2 className="text-xl font-medium tracking-wide">{title}</h2>}
          <p className="text-sm text-foreground/60 mt-1">
            {(products || []).length} items
          </p>
        </div>
      )}

      {/* 2-Column Grid */}
      <div className="grid grid-cols-2 gap-3 px-4">
        {(products || []).map((product, index) => (
          <motion.div
            key={`${product.id}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/product/${product.id}`)}
            className="bg-white rounded-2xl overflow-hidden active:bg-foreground/5 transition-colors"
          >
            {/* Product Image */}
            <div className="relative aspect-[3/4] bg-muted overflow-hidden">
              <img
                src={product.images?.[0] ?? placeholder}
                alt={product.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Wishlist Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleWishlistToggle(e, product)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm active:bg-white transition-colors z-10"
              >
                <Heart
                  size={16}
                  className={`transition-colors ${
                    isInWishlist(product.id)
                      ? 'text-primary fill-primary'
                      : 'text-foreground/60'
                  }`}
                />
              </motion.button>

              {/* Sale Badge */}
              {(product.sale ?? product.on_sale) && (
                <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full">
                  SALE
                </div>
              )}

              {/* New Badge */}
              {(product.isNew ?? product.new_arrival) && !(product.sale ?? product.on_sale) && (
                <div className="absolute top-2 left-2 bg-foreground text-white text-[10px] font-bold px-2 py-1 rounded-full">
                  NEW
                </div>
              )}

              {/* Quick View Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-3 opacity-0 hover:opacity-100 transition-opacity">
                <button className="w-full bg-white text-foreground text-xs font-medium py-2 rounded-full">
                  Quick View
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-3">
              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-1 mb-1.5">
                  <Star size={12} className="text-primary fill-primary" />
                  <span className="text-[11px] font-medium text-foreground/80">
                    {product.rating}
                  </span>
                  <span className="text-[10px] text-foreground/40">
                    ({product.reviews || 0})
                  </span>
                </div>
              )}

              {/* Product Name */}
              <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-1.5 leading-snug">
                {product.name}
              </h3>

              {/* Category */}
              <p className="text-[11px] text-foreground/50 mb-2 uppercase tracking-wide">
                {product.category}
              </p>

              {/* Price */}
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-primary">
                  ${product.price}
                </span>
                {(product.originalPrice ?? product.original_price) != null && (
                  <span className="text-xs text-foreground/40 line-through">
                    ${product.originalPrice ?? product.original_price}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Load More Button */}
      {products.length >= 10 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-6 mx-4 py-3.5 border-2 border-foreground/10 rounded-full font-medium text-sm active:border-foreground/20 transition-colors"
          style={{ width: 'calc(100% - 32px)' }}
        >
          Load More Products
        </motion.button>
      )}
    </div>
  );
}
