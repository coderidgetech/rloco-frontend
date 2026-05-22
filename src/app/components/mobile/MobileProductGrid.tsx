import { motion } from 'motion/react';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCurrency } from '../../context/CurrencyContext';
import { PLACEHOLDER_IMAGE } from '../../constants';
import { toast } from 'sonner';

interface ProductLike {
  id: string | number;
  name: string;
  price: number;
  price_inr?: number;
  images: string[];
  category?: string;
  originalPrice?: number;
  original_price?: number;
  sizes?: string[];
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

export function MobileProductGrid({ products = [], title = 'Featured Products' }: MobileProductGridProps) {
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  const handleWishlistToggle = (e: React.MouseEvent, product: ProductLike) => {
    e.stopPropagation();
    const id = product.id;
    if (isInWishlist(id)) {
      removeFromWishlist(id);
    } else {
      addToWishlist({
        id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] ?? PLACEHOLDER_IMAGE,
        category: product.category ?? '',
        gender: 'unisex',
      });
    }
  };

  const handleAddToCart = (e: React.MouseEvent, product: ProductLike) => {
    e.stopPropagation();
    const id = String(product.id);
    if (items.some(item => String(item.id) === id)) {
      navigate('/cart');
      return;
    }
    addToCart({
      id,
      name: product.name,
      price: product.price,
      priceINR: product.price_inr,
      image: product.images?.[0] ?? PLACEHOLDER_IMAGE,
      size: product.sizes?.[0] ?? 'M',
    });
    toast.success('Added to bag');
  };

  return (
    <div className="w-full bg-white py-6">
      {(title || products.length > 0) && (
        <div className="px-4 mb-4">
          {title && <h2 className="text-xl font-medium tracking-wide">{title}</h2>}
          <p className="text-sm text-foreground/60 mt-1">{products.length} items</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 px-4">
        {products.map((product, index) => {
          const inCart = items.some(item => String(item.id) === String(product.id));
          const img = product.images?.[0] ?? PLACEHOLDER_IMAGE;
          const isOnSale = product.sale ?? product.on_sale;
          const isNew = (product.isNew ?? product.new_arrival) && !isOnSale;

          return (
            <motion.div
              key={`${product.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/product/${product.id}`)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm active:shadow-none transition-shadow"
            >
              {/* Image */}
              <div className="relative aspect-[3/4] bg-muted overflow-hidden">
                <img
                  src={img}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Wishlist */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleWishlistToggle(e, product)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm z-10"
                >
                  <Heart
                    size={13}
                    className={isInWishlist(product.id) ? 'text-red-500 fill-red-500' : 'text-foreground/60'}
                  />
                </motion.button>

                {/* Badges */}
                {isOnSale && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                    Sale
                  </span>
                )}
                {isNew && (
                  <span className="absolute top-2 left-2 bg-foreground text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                    New
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-2.5">
                <h3 className="text-xs font-medium text-foreground line-clamp-2 leading-snug mb-1">
                  {product.name}
                </h3>
                {product.category && (
                  <p className="text-[10px] text-foreground/45 uppercase tracking-wide mb-2">
                    {product.category}
                  </p>
                )}

                {/* Price row + cart icon */}
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-sm font-semibold text-foreground truncate">
                      {formatPrice(product.price, product.price_inr)}
                    </span>
                    {(product.originalPrice ?? product.original_price) != null && (
                      <span className="text-[10px] text-foreground/40 line-through shrink-0">
                        {formatPrice(product.originalPrice ?? product.original_price ?? 0, undefined)}
                      </span>
                    )}
                  </div>

                  {/* Cart icon button */}
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={(e) => handleAddToCart(e, product)}
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center shadow-sm transition-colors ${
                      inCart
                        ? 'bg-green-500 text-white'
                        : 'bg-foreground text-background'
                    }`}
                  >
                    {inCart
                      ? <Check size={12} strokeWidth={2.5} />
                      : <ShoppingBag size={12} />
                    }
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {products.length >= 10 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileTap={{ scale: 0.98 }}
          className="mt-6 mx-4 w-[calc(100%-2rem)] block py-3 border border-foreground/15 rounded-full text-sm font-medium active:bg-foreground/5 transition-colors"
        >
          Load More
        </motion.button>
      )}
    </div>
  );
}
