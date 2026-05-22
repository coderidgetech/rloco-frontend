import { motion } from 'motion/react';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../types/product';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  index?: number;
  onProductClick?: (product: Product) => void;
}

export function ProductCard({ product, index = 0, onProductClick }: ProductCardProps) {
  const { addToCart, items } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const isWishlisted = isInWishlist(product.id);
  const isInCart = items.some(item => item.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInCart) {
      navigate('/cart');
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      priceINR: product.price_inr || product.priceINR,
      image: product.images?.[0] || product.image || '',
      size: product.sizes?.[0] || 'M',
    });
    toast.success('Added to bag');
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.image || '',
        category: product.category,
        gender: product.gender,
        colors: product.colors,
        onSale: product.on_sale || product.onSale,
        newArrival: product.new_arrival || product.newArrival,
        featured: product.featured,
      });
      toast.success('Added to wishlist');
    }
  };

  const handleCardClick = () => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden mb-3 bg-muted rounded-lg">
        <motion.img
          src={product.images?.[0] || product.image || ''}
          alt={product.name}
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
          {(product.new_arrival || product.newArrival) && (
            <span className="px-2 py-0.5 bg-primary text-primary-foreground text-[10px] tracking-wider uppercase rounded-sm">
              New
            </span>
          )}
          {(product.on_sale || product.onSale) && (
            <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] tracking-wider uppercase rounded-sm">
              Sale
            </span>
          )}
        </div>

        {/* Wishlist */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleWishlist}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-md backdrop-blur-sm transition-all ${
            isWishlisted ? 'bg-red-500 text-white' : 'bg-white/90 text-foreground hover:bg-white'
          }`}
        >
          <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
        </motion.button>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
      </div>

      {/* Info */}
      <div className="space-y-1">
        <p className="text-[11px] text-muted-foreground tracking-wider uppercase">{product.category}</p>
        <h3 className="text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-between gap-1.5 pt-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm font-medium">{formatPrice(product.price, (product as any).priceINR)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through shrink-0">
                {formatPrice(product.originalPrice, (product as any).originalPriceINR)}
              </span>
            )}
          </div>
          <motion.button
            type="button"
            onClick={handleAddToCart}
            whileTap={{ scale: 0.85 }}
            className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center shadow-sm transition-colors ${
              isInCart
                ? 'bg-green-500 text-white'
                : 'bg-foreground text-background hover:opacity-80'
            }`}
          >
            {isInCart ? <Check size={12} strokeWidth={2.5} /> : <ShoppingBag size={12} />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
