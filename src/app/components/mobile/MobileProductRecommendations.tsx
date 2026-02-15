import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, TrendingUp, Sparkles, ThumbsUp, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useWishlist } from '@/app/context/WishlistContext';
import { toast } from 'sonner';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  sale?: boolean;
}

interface Props {
  title: string;
  subtitle?: string;
  products: Product[];
  icon?: 'heart' | 'star' | 'trending' | 'sparkles';
}

const iconMap = {
  heart: Heart,
  star: Star,
  trending: TrendingUp,
  sparkles: Sparkles,
};

export function MobileProductRecommendations({
  title,
  subtitle,
  products,
  icon = 'heart',
}: Props) {
  const navigate = useNavigate();
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const Icon = iconMap[icon];

  const handleWishlistToggle = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    
    if (isInWishlist(product.id)) {
      removeItem(product.id);
      toast.success('Removed from wishlist');
    } else {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
      toast.success('Added to wishlist');
    }
  };

  if (products.length === 0) return null;

  return (
    <div className="py-6 bg-white">
      <div className="px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Icon size={20} className="text-primary" />
            <h3 className="text-xl font-medium">{title}</h3>
          </div>
          <button className="text-sm text-primary font-medium flex items-center gap-1">
            View All
            <ChevronRight size={16} />
          </button>
        </div>
        {subtitle && (
          <p className="text-sm text-foreground/60 mb-4">{subtitle}</p>
        )}
      </div>

      {/* Horizontal Scroll */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 px-4 pb-2">
          {products.slice(0, 10).map((product, index) => {
            const inWishlist = isInWishlist(product.id);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/product/${product.id}`)}
                className="flex-shrink-0 w-40 bg-white rounded-xl overflow-hidden border border-border/20"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] bg-muted overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isNew && (
                      <div className="bg-foreground text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        NEW
                      </div>
                    )}
                    {product.sale && (
                      <div className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        SALE
                      </div>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => handleWishlistToggle(e, product)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center"
                  >
                    <Heart
                      size={14}
                      className={
                        inWishlist
                          ? 'text-primary fill-primary'
                          : 'text-foreground/60'
                      }
                    />
                  </button>

                  {/* Quick Add Button */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-full bg-white text-foreground text-xs font-medium py-1.5 rounded-full">
                      Quick Add
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-2.5">
                  <h4 className="text-sm font-medium mb-1 line-clamp-1">
                    {product.name}
                  </h4>

                  {/* Rating */}
                  {product.rating && (
                    <div className="flex items-center gap-1 mb-2">
                      <Star
                        size={12}
                        className="text-primary fill-primary"
                      />
                      <span className="text-xs text-foreground/60">
                        {product.rating}
                      </span>
                      {product.reviews && (
                        <span className="text-xs text-foreground/40">
                          ({product.reviews})
                        </span>
                      )}
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-primary">
                      ${product.price}
                    </span>
                    {product.originalPrice && (
                      <>
                        <span className="text-xs text-foreground/40 line-through">
                          ${product.originalPrice}
                        </span>
                        <span className="text-[10px] font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                          {Math.round(
                            ((product.originalPrice - product.price) /
                              product.originalPrice) *
                              100
                          )}
                          % OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* View All Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: products.length * 0.05 }}
            className="flex-shrink-0 w-40"
          >
            <div className="h-full bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border-2 border-dashed border-primary/30 flex flex-col items-center justify-center p-6 text-center">
              <ChevronRight size={32} className="text-primary mb-2" />
              <p className="text-sm font-medium text-primary mb-1">
                View All
              </p>
              <p className="text-xs text-foreground/60">
                {products.length} products
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
