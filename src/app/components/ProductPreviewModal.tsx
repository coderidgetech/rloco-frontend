import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, ShoppingCart, ChevronRight } from 'lucide-react';
import { Product } from '../data/products';
import { useCurrency } from '../context/CurrencyContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface ProductPreviewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductPreviewModal({ product, isOpen, onClose }: ProductPreviewModalProps) {
  const { formatPrice } = useCurrency();
  const { addToCart, items } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);
  const isInCart = items.some(item => item.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isInCart) {
      navigate('/cart');
      onClose();
      return;
    }
    
    // Validate size selection is mandatory
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      toast.error('Please select a size');
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      priceINR: product.priceINR,
      image: product.image,
      size: selectedSize || product.sizes[0],
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
        priceINR: product.priceINR,
        image: product.image,
        category: product.category,
        gender: product.gender,
        colors: product.colors,
        sizes: product.sizes,
        onSale: product.onSale,
        newArrival: product.newArrival,
        featured: product.featured,
      });
      toast.success('Added to wishlist');
    }
  };

  const handleViewFullDetails = () => {
    navigate(`/product/${product.id}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Subtle Backdrop - barely visible */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[100]"
            onClick={onClose}
          />

          {/* Myntra-style Side Panel */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ 
              duration: 0.3, 
              ease: [0.19, 1.0, 0.22, 1.0]
            }}
            className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-2xl z-[101] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with close button */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider">Quick View</h3>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Product Image */}
            <div className="relative bg-gray-50">
              <motion.img
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                src={product.image}
                alt={product.name}
                className="w-full aspect-[3/4] object-cover"
                style={{ filter: 'brightness(1.02) contrast(1.05)' }}
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.newArrival && (
                  <span className="px-2 py-1 bg-primary text-primary-foreground text-[10px] font-medium tracking-wider uppercase">
                    New
                  </span>
                )}
                {product.onSale && (
                  <span className="px-2 py-1 bg-red-600 text-white text-[10px] font-medium tracking-wider uppercase">
                    Sale
                  </span>
                )}
                {product.badge && (
                  <span className={`px-2 py-1 text-[10px] font-medium tracking-wider uppercase ${
                    product.badge === 'Best Seller' ? 'bg-[#B4770E] text-white' :
                    product.badge === 'Trending' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' :
                    product.badge === 'Most Ordered' ? 'bg-blue-600 text-white' :
                    product.badge === 'New' ? 'bg-green-600 text-white' :
                    product.badge === 'Limited Edition' ? 'bg-black text-white' :
                    product.badge === 'Exclusive' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' :
                    product.badge === 'Hot' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' :
                    product.badge === 'Popular' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' :
                    'bg-foreground text-background'
                  }`}>
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Wishlist Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleToggleWishlist}
                className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all ${
                  isWishlisted
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} strokeWidth={2} />
              </motion.button>
            </div>

            {/* Product Details */}
            <div className="px-6 py-5">
              {/* Brand/Category */}
              <div className="text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                {product.category}
              </div>

              {/* Product Name */}
              <h2 className="text-lg font-medium text-gray-900 mb-1 line-clamp-2">
                {product.name}
              </h2>

              {/* Description (if available) */}
              {product.description && (
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-5">
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(product.price, (product as any).priceINR)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(product.originalPrice, (product as any).originalPriceINR)}
                    </span>
                    <span className="text-xs font-semibold text-red-600">
                      ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF)
                    </span>
                  </>
                )}
              </div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-5">
                  <div className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Select Size
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border text-xs font-medium transition-all ${
                          selectedSize === size
                            ? 'border-[#B4770E] bg-[#B4770E]/5 text-[#B4770E]'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Options */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-5">
                  <div className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    Available Colors
                  </div>
                  <div className="flex gap-2">
                    {product.colors.map((color, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-7 h-7 rounded-full border-2 border-gray-300 hover:border-gray-500 transition-colors shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 mb-4">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleAddToCart}
                  className={`w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                    isInCart
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-[#B4770E] text-white hover:bg-[#9a6109]'
                  }`}
                >
                  <ShoppingCart size={18} strokeWidth={2} />
                  {isInCart ? 'GO TO BAG' : 'ADD TO BAG'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleViewFullDetails}
                  className="w-full py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all text-sm font-semibold flex items-center justify-center gap-1"
                >
                  VIEW FULL DETAILS
                  <ChevronRight size={16} />
                </motion.button>
              </div>

              {/* Product Features */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Free shipping on orders over $100</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>Easy returns & exchanges within 30 days</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span>100% authentic products</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}