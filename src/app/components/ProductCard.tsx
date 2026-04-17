import { motion } from 'motion/react';
import { Heart, ShoppingCart } from 'lucide-react';
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
  
  // Check if product is already in cart - updates button to "Go to Cart"
  const isInCart = items.some(item => item.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isInCart) {
      // Navigate to cart if already added
      navigate('/cart');
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      priceINR: product.price_inr || product.priceINR, // Add INR price
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
      <div className="relative aspect-[3/4] overflow-hidden mb-3 md:mb-4 bg-muted rounded-lg">
        <motion.img
          src={product.images?.[0] || product.image || ''}
          alt={product.name}
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 md:top-4 md:left-4 flex flex-col gap-2">
          {(product.new_arrival || product.newArrival) && (
            <span className="px-2 py-1 md:px-3 md:py-1 bg-primary text-primary-foreground text-xs tracking-wider uppercase">
              New
            </span>
          )}
          {(product.on_sale || product.onSale) && (
            <span className="px-2 py-1 md:px-3 md:py-1 bg-red-600 text-white text-xs tracking-wider uppercase">
              Sale
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleWishlist}
          className={`absolute z-10 top-3 right-3 md:top-4 md:right-4 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-sm ${
            isWishlisted
              ? 'bg-red-500 text-white'
              : 'bg-white/90 text-foreground hover:bg-white'
          }`}
        >
          <Heart size={18} className="md:w-5 md:h-5" fill={isWishlisted ? 'currentColor' : 'none'} />
        </motion.button>

        <motion.div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.05 + 0.2 }}
      >
        <div className="text-xs md:text-sm text-muted-foreground mb-1 md:mb-2 tracking-wider uppercase">
          {product.category}
        </div>
        <h3 className="text-sm md:text-base mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <span className="text-base md:text-lg">{formatPrice(product.price, (product as any).priceINR)}</span>
          {product.originalPrice && (
            <span className="text-xs md:text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice, (product as any).originalPriceINR)}
            </span>
          )}
        </div>

        {/* Add to Bag / Go to Cart — quantity is adjusted only on the cart page */}
        <motion.button
          onClick={handleAddToCart}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-2.5 md:py-3 flex items-center justify-center gap-2 text-sm transition-all ${
            isInCart
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-foreground text-background hover:bg-foreground/90'
          }`}
        >
          <ShoppingCart size={18} />
          {isInCart ? 'Go to Cart' : 'Add to Bag'}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}