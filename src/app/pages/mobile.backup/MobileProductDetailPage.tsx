import { motion, AnimatePresence } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Heart, Share2, ChevronLeft, Star, Truck, RotateCcw, Shield, Plus, Minus, ShoppingBag, ChevronRight, MapPin, Package, CreditCard, CheckCircle2 } from 'lucide-react';
import { useProduct, useProducts } from '@/app/hooks/useProducts';
import { useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishlistContext';
import { toast } from 'sonner';
import { MobileSubPageHeader } from '@/app/components/mobile/MobileSubPageHeader';
import { MobileProductRecommendations } from '@/app/components/mobile/MobileProductRecommendations';
import { MobileCompleteTheLook } from '@/app/components/mobile/MobileCompleteTheLook';

export function MobileProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading: productLoading, error: productError } = useProduct(id || '');
  const { products: allProducts = [] } = useProducts({ limit: 200 });
  const { addToCart } = useCart();
  const { addItem, removeItem, isInWishlist } = useWishlist();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [showDescription, setShowDescription] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const inWishlist = product ? isInWishlist(String(product.id)) : false;

  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }
  if (productError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const productImages = product.images?.length ? product.images : [''];
  const recommendedSize = product.sizes?.length ? product.sizes[Math.floor(product.sizes.length / 2)] : (product.sizes?.[0] || '');

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

    if (isLeftSwipe && currentImageIndex < productImages.length - 1) {
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
      image: productImages[0],
      quantity,
      size: selectedSize,
    });

    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: productImages[0],
      quantity,
      size: selectedSize,
    });

    navigate('/mobile/cart');
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
        image: productImages[0],
      });
      toast.success('Added to wishlist');
    }
  };

  // Calculate delivery date (3-5 business days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const deliveryDateStr = deliveryDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Unified Header */}
      <MobileSubPageHeader showDeliveryAddress={false} />

      {/* Image Gallery - Swipeable */}
      <div className="relative" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 56px)' }}>{/* Header + safe area */}
        <div
          className="relative aspect-[3/4] bg-muted overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={productImages[currentImageIndex]}
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
            {productImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Rating Badge */}
          {product.rating && (
            <div className="absolute bottom-4 right-4 bg-white rounded-full px-3 py-1.5 shadow-lg flex items-center gap-1">
              <span className="text-sm font-medium">{product.rating}</span>
              <Star size={14} className="text-primary fill-primary" />
              <span className="text-xs text-foreground/50">|</span>
              <span className="text-xs text-foreground/60">{product.reviews || '5.6k'}</span>
            </div>
          )}
        </div>

        {/* Thumbnail Strip */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
          {productImages.map((image, index) => (
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
        {/* Title */}
        <h1 className="text-xl font-medium mb-2">{product.name}</h1>
        <p className="text-sm text-foreground/60 mb-4">{product.category}</p>

        {/* Price */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl font-bold">
            ${product.price}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-base text-foreground/40 line-through">
                ${product.originalPrice}
              </span>
              <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            </>
          )}
        </div>

        {/* Size Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="font-medium text-base">Size: {selectedSize || '—'}</span>
              {selectedSize && (
                <p className="text-xs text-foreground/60 mt-0.5">Garment Measurement: Chest 41.0in</p>
              )}
            </div>
            <button 
              onClick={() => navigate('/mobile/size-guide')}
              className="text-sm text-primary font-medium flex items-center gap-1"
            >
              Size Chart
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Size Recommended Badge */}
          {!selectedSize && recommendedSize && (
            <div className="flex items-center justify-between mb-3">
              <div className="bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded">
                Size {recommendedSize} Recommended
              </div>
            </div>
          )}

          {/* Size Buttons */}
          <div className="grid grid-cols-4 gap-3">
            {product.sizes.map((size) => (
              <motion.button
                key={size}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedSize(size)}
                className={`py-3 rounded-xl font-medium text-sm transition-all ${
                  selectedSize === size
                    ? 'bg-foreground text-white border-2 border-foreground'
                    : 'bg-white text-foreground border-2 border-border'
                }`}
              >
                {size}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Buy Now and Add to Bag Buttons */}
        <div className="flex gap-3 mb-6">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleBuyNow}
            className="flex-1 py-3.5 border-2 border-primary text-primary rounded-lg font-medium text-sm flex items-center justify-center gap-2"
          >
            <ShoppingBag size={18} />
            Buy Now
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className="flex-1 py-3.5 bg-primary text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2"
          >
            <ShoppingBag size={18} />
            Add to Bag
          </motion.button>
        </div>

        {/* Delivery & Services */}
        <div className="mb-6">
          <h3 className="font-medium text-base mb-3">Delivery & Services</h3>

          {/* Delivery Address */}
          <div className="flex items-center justify-between p-4 bg-foreground/5 rounded-xl mb-3">
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-foreground/60" />
              <div>
                <p className="text-sm font-medium">Deliver to: New York, 10001</p>
              </div>
            </div>
            <button className="text-sm text-primary font-medium">
              Change
            </button>
          </div>

          {/* Delivery Options */}
          <div className="space-y-3">
            {/* Standard Delivery */}
            <div className="flex items-start gap-3 p-4 border border-border rounded-xl">
              <Package size={20} className="text-foreground/60 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="text-sm font-medium">STANDARD</p>
                    <p className="text-sm font-medium">Delivery by {deliveryDateStr}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-foreground/40 line-through">₹2099</p>
                    <p className="text-sm font-bold text-green-600">₹671 (68% OFF)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pay on Delivery */}
            <div className="flex items-start gap-3 p-3 bg-[#F0FDF4] rounded-xl">
              <CreditCard size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Pay on Delivery is available</p>
                <p className="text-xs text-foreground/60 mt-0.5">₹10 additional fee applicable</p>
              </div>
            </div>

            {/* Return & Exchange */}
            <div className="flex items-start gap-3 p-3 bg-[#F0FDF4] rounded-xl">
              <RotateCcw size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Hassle free 7 days Return & Exchange</p>
              </div>
            </div>
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

        {/* Details */}
        <div className="mb-6">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between py-3 border-t border-b border-border"
          >
            <span className="font-medium">Product Details</span>
            <motion.div
              animate={{ rotate: showDetails ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Plus size={20} />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="py-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">Material</span>
                    <span className="font-medium">100% Cotton</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">Care Instructions</span>
                    <span className="font-medium">Machine Wash</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">Country of Origin</span>
                    <span className="font-medium">USA</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/60">SKU</span>
                    <span className="font-medium">RL-{product.id}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Reviews */}
        <div className="mb-6">
          <button
            onClick={() => setShowReviews(!showReviews)}
            className="w-full flex items-center justify-between py-3 border-t border-b border-border"
          >
            <div className="flex items-center gap-2">
              <span className="font-medium">Customer Reviews</span>
              <div className="flex items-center gap-1">
                <Star size={14} className="text-primary fill-primary" />
                <span className="text-sm font-medium">{product.rating || 4.5}</span>
              </div>
            </div>
            <motion.div
              animate={{ rotate: showReviews ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Plus size={20} />
            </motion.div>
          </button>
          
          <AnimatePresence>
            {showReviews && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="py-4 space-y-4">
                  {/* Review 1 */}
                  <div className="pb-4 border-b border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">Sarah M.</span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className="text-primary fill-primary" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-foreground/70 leading-relaxed mb-1">
                      Absolutely love this piece! The quality is amazing and fits perfectly. Highly recommend!
                    </p>
                    <span className="text-xs text-foreground/40">2 days ago</span>
                  </div>

                  {/* Review 2 */}
                  <div className="pb-4 border-b border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">Emma R.</span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} className="text-primary fill-primary" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-foreground/70 leading-relaxed mb-1">
                      Great product! True to size and very comfortable. Will definitely buy again.
                    </p>
                    <span className="text-xs text-foreground/40">1 week ago</span>
                  </div>

                  {/* Review 3 */}
                  <div className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">Jessica L.</span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(4)].map((_, i) => (
                          <Star key={i} size={12} className="text-primary fill-primary" />
                        ))}
                        <Star size={12} className="text-foreground/20" />
                      </div>
                    </div>
                    <p className="text-sm text-foreground/70 leading-relaxed mb-1">
                      Beautiful design and good quality. Runs slightly small, consider sizing up.
                    </p>
                    <span className="text-xs text-foreground/40">2 weeks ago</span>
                  </div>

                  <button className="w-full text-sm text-primary font-medium py-2">
                    View All Reviews ({product.reviews || 120})
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Related Products */}
      <MobileProductRecommendations
        title="You May Also Like"
        subtitle="Handpicked recommendations just for you"
        products={allProducts.filter(p => String(p.id) !== String(product.id) && p.category === product.category).slice(0, 10)}
        icon="heart"
      />

      {/* Similar Products */}
      <MobileProductRecommendations
        title="Similar Products"
        subtitle="Explore similar styles"
        products={allProducts.filter(p =>
          String(p.id) !== String(product.id) &&
          p.category !== product.category &&
          Math.abs(p.price - product.price) < 100
        ).slice(0, 10)}
        icon="sparkles"
      />

      {/* Trending Products */}
      <MobileProductRecommendations
        title="Trending Now"
        subtitle="Most loved by our customers"
        products={allProducts.filter(p => {
          const relatedIds = allProducts.filter(pr => String(pr.id) !== String(product.id) && pr.category === product.category).slice(0, 10).map(pr => pr.id);
          return String(p.id) !== String(product.id) && (p.rating ?? 0) >= 4.5 && !relatedIds.includes(p.id);
        }).slice(0, 10)}
        icon="trending"
      />

      {/* Complete the Look */}
      <MobileCompleteTheLook
        currentProduct={{
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: productImages[0],
          category: product.category,
        }}
        products={allProducts.filter(p =>
          String(p.id) !== String(product.id) &&
          Math.abs(p.price - product.price) < 50 &&
          p.category !== product.category
        ).slice(0, 3)}
      />

      {/* Custom scrollbar hide */}
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