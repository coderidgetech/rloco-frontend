import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Heart, Share2, ChevronLeft, Star, Truck, RotateCcw, Shield, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useProduct } from '@/app/hooks/useProducts';
import { useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishlistContext';
import { useCurrency } from '@/app/context/CurrencyContext';
import { toast } from 'sonner';
import { MobileHeader } from '@/app/components/mobile/MobileHeader';
import { BottomNavigation } from '@/app/components/mobile/BottomNavigation';

export function MobileProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading: productLoading, error: productError } = useProduct(id || '');
  const { addToCart } = useCart();
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [showDescription, setShowDescription] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Product not found</p>
      </div>
    );
  }

  const inWishlist = isInWishlist(String(product.id));

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentImageIndex < product.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      size: selectedSize,
    });

    toast.success('Added to cart!');
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeItem(product.id);
      toast.success('Removed from wishlist');
    } else {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
      });
      toast.success('Added to wishlist');
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/20">
        <div className="flex items-center justify-between h-14 px-4" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center"
          >
            <ChevronLeft size={20} />
          </motion.button>

          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlistToggle}
              className="w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center"
            >
              <Heart
                size={18}
                className={inWishlist ? 'text-primary fill-primary' : 'text-foreground/70'}
              />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                navigator.share?.({ title: product.name, url: window.location.href });
              }}
              className="w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center"
            >
              <Share2 size={18} className="text-foreground/70" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Image Gallery - Swipeable */}
      <div className="relative pt-14">
        <div
          className="relative aspect-[3/4] bg-muted overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={product.images[currentImageIndex]}
              alt={product.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Image Indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-1.5">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && (
              <div className="bg-foreground text-white text-xs font-bold px-3 py-1 rounded-full">
                NEW
              </div>
            )}
            {product.sale && (
              <div className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                SALE
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Strip */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto">
          {product.images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentImageIndex
                  ? 'border-primary'
                  : 'border-transparent'
              }`}
            >
              <img src={image} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="px-4 py-4">
        {/* Title & Price */}
        <div className="mb-4">
          <h1 className="text-2xl font-medium tracking-wide mb-2">{product.name}</h1>
          
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star size={16} className="text-primary fill-primary" />
                <span className="text-sm font-medium">{product.rating}</span>
              </div>
              <span className="text-sm text-foreground/50">
                ({product.reviews || 0} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-semibold text-primary">
              {formatPrice(product.price, (product as any).priceINR)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-foreground/40 line-through">
                  {formatPrice(product.originalPrice, (product as any).originalPriceINR)}
                </span>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>
        </div>

        {/* Size Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium">Select Size</span>
            <button className="text-sm text-primary">Size Guide</button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-3 rounded-lg border-2 font-medium transition-all ${
                  selectedSize === size
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border bg-white text-foreground/70'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-6">
          <span className="font-medium block mb-3">Quantity</span>
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center"
            >
              <Minus size={18} />
            </motion.button>
            <span className="text-lg font-medium w-8 text-center">{quantity}</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center"
            >
              <Plus size={18} />
            </motion.button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-foreground/5 rounded-2xl">
          <div className="text-center">
            <Truck size={20} className="mx-auto mb-1 text-foreground/60" />
            <p className="text-xs text-foreground/60">Free Shipping</p>
          </div>
          <div className="text-center">
            <RotateCcw size={20} className="mx-auto mb-1 text-foreground/60" />
            <p className="text-xs text-foreground/60">Easy Returns</p>
          </div>
          <div className="text-center">
            <Shield size={20} className="mx-auto mb-1 text-foreground/60" />
            <p className="text-xs text-foreground/60">Secure Pay</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <button
            onClick={() => setShowDescription(!showDescription)}
            className="w-full flex items-center justify-between py-3 border-t border-b border-border"
          >
            <span className="font-medium">Description</span>
            <motion.div
              animate={{ rotate: showDescription ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Plus size={20} />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {showDescription && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="text-sm text-foreground/70 leading-relaxed py-4">
                  {product.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-border/20 p-4" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 64px)' }}>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          className="w-full bg-primary text-white py-4 rounded-full font-medium text-base flex items-center justify-center gap-2 shadow-lg active:bg-primary/90"
        >
          <ShoppingBag size={20} />
          Add to Cart - ${(product.price * quantity).toFixed(2)}
        </motion.button>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
