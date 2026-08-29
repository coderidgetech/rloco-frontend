import { motion } from 'motion/react';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { useState } from 'react';
import { Product } from '../types/product';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { AddToBagPopover } from './AddToBagPopover';
import { colorMap } from '../utils/filterConfig';

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

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const isWishlisted = isInWishlist(product.id);
  const isInCart = items.some(item => item.id === product.id);
  const isOutOfStock = product.stock != null
    && Object.keys(product.stock).length > 0
    && Object.values(product.stock).every(qty => qty <= 0);

  // Normalise original price — API returns snake_case; legacy data uses camelCase.
  const originalPrice = product.original_price || product.originalPrice;
  const originalPriceInr = product.original_price_inr || (product as any).originalPriceINR;
  const discountPct = originalPrice && originalPrice > product.price
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    if (isInCart) {
      navigate('/cart');
      return;
    }
    setSelectedSize(product.sizes?.[0] || 'M');
    setSelectedColor(product.colors?.[0] || 'Default');
    setPopoverOpen(true);
  };

  const handleConfirm = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      priceINR: product.price_inr || product.priceINR,
      image: product.images?.[0] || product.image || '',
      size: selectedSize || product.sizes?.[0] || 'M',
    });
    toast.success('Added to bag');
    setPopoverOpen(false);
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
        sizes: product.sizes,
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
      <div className="relative aspect-[4/5] overflow-hidden mb-2 bg-accent rounded shadow-sm hover:shadow-lg transition-all duration-500">
        <motion.img
          src={product.images?.[0] || product.image || ''}
          alt={product.name}
          className={`w-full h-full object-cover ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
          style={{ filter: isOutOfStock ? undefined : 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
          whileHover={isOutOfStock ? undefined : { scale: 1.08, rotate: 0.5 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Badge */}
        {!isOutOfStock && product.badge && (
          <div
            className={`absolute top-1.5 left-1.5 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase z-10 ${
              product.badge === 'Best Seller' ? 'bg-primary text-white' :
              product.badge === 'Trending' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' :
              product.badge === 'Most Ordered' ? 'bg-blue-600 text-white' :
              product.badge === 'New' ? 'bg-green-600 text-white' :
              product.badge === 'Limited Edition' ? 'bg-black text-white' :
              product.badge === 'Exclusive' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' :
              product.badge === 'Hot' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' :
              product.badge === 'Popular' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' :
              'bg-foreground text-background'
            }`}
          >
            {product.badge}
          </div>
        )}
        {!isOutOfStock && !product.badge && (product.on_sale || product.onSale) && (
          <div className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-red-600 text-white text-[9px] font-bold tracking-wider uppercase z-10">
            {discountPct > 0 ? `-${discountPct}%` : 'Sale'}
          </div>
        )}

        {/* Wishlist */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleWishlist}
          className={`absolute top-1.5 right-1.5 w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-md backdrop-blur-sm z-10 ${
            isWishlisted ? 'bg-red-500 text-white' : 'bg-white/90 text-foreground hover:bg-white'
          }`}
        >
          <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
        </motion.button>

        {/* Hover overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col overflow-visible">
        <div className="text-[10px] text-foreground/50 mb-1 tracking-wider uppercase">
          {product.category}
        </div>
        <h3
          className="text-xs mb-1 h-4 overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-foreground/70 transition-colors leading-tight"
          title={product.name}
        >
          {product.name}
        </h3>
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 mb-1.5">
            {product.colors.slice(0, 5).map((color) => (
              <span
                key={color}
                title={color}
                className="w-2.5 h-2.5 rounded-full border border-foreground/10 shrink-0"
                style={{ backgroundColor: colorMap[color.toLowerCase()] || '#9CA3AF' }}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-[9px] text-foreground/40">+{product.colors.length - 5}</span>
            )}
          </div>
        )}
        <div className="relative flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sm font-medium">{formatPrice(product.price, product.price_inr || (product as any).priceINR)}</span>
            {originalPrice && originalPrice > product.price && (
              <span className="text-[10px] text-foreground/40 line-through shrink-0">
                {formatPrice(originalPrice, originalPriceInr)}
              </span>
            )}
          </div>
          <div className="relative shrink-0">
            <AddToBagPopover
              isOpen={popoverOpen}
              product={product as any}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              onSizeChange={setSelectedSize}
              onColorChange={setSelectedColor}
              onConfirm={handleConfirm}
              onCancel={() => setPopoverOpen(false)}
            />
            <motion.button
              type="button"
              onClick={handleAddToCart}
              whileTap={isOutOfStock ? undefined : { scale: 0.85 }}
              disabled={isOutOfStock}
              className={`w-7 h-7 rounded-full flex items-center justify-center shadow-sm transition-colors ${
                isOutOfStock
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : isInCart
                  ? 'bg-green-500 text-white'
                  : 'bg-foreground text-background hover:opacity-80'
              }`}
            >
              {isInCart ? <Check size={12} strokeWidth={2.5} /> : <ShoppingBag size={12} />}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
