import { motion, AnimatePresence } from 'motion/react';
import { Heart, Star, Truck, RefreshCw, Check, ShoppingBag, Edit2, Trash2, ThumbsUp, Share2, X, Flag, Ruler } from 'lucide-react';
import { Product } from '../types/api';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'sonner';
import { useParams, useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { ProductRecommendationSection } from '../components/ProductRecommendationSection';
import { useProduct, useProductVariants } from '../hooks/useProducts';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';
import { ProductReview } from '../types/api';
import { useUser } from '../context/UserContext';
import { useCurrency } from '../context/CurrencyContext';
import { PLACEHOLDER_IMAGE } from '../constants';
import { PH } from '../lib/formPlaceholders';
import { getApiErrorMessage } from '../lib/apiErrors';

const getColorHex = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    'black': '#000000',
    'white': '#FFFFFF',
    'navy': '#1E3A8A',
    'beige': '#F5F5DC',
    'grey': '#6B7280',
    'gray': '#6B7280',
    'charcoal': '#36454F',
    'cream': '#FFFDD0',
    'burgundy': '#800020',
    'brown': '#8B4513',
    'tan': '#D2B48C',
    'camel': '#C19A6B',
    'red': '#DC2626',
    'blue': '#3B82F6',
    'sky blue': '#0EA5E9',
    'green': '#16A34A',
    'pink': '#EC4899',
    'purple': '#9333EA',
    'yellow': '#EAB308',
    'orange': '#F97316',
    'gold': '#FFD700',
    'silver': '#C0C0C0',
    'ivory': '#FFFFF0',
    'sage': '#9DC183',
    'rose': '#FFB6C1',
    'emerald': '#059669',
    'blush': '#FFB6C1',
    'indigo': '#4F46E5',
    'light wash': '#A5B4C3',
    'taupe': '#B38B6D',
  };
  
  const normalized = colorName.toLowerCase().trim();
  if (colorMap[normalized]) return colorMap[normalized];
  
  for (const [key, value] of Object.entries(colorMap)) {
    if (normalized.includes(key)) return value;
  }
  
  return '#9CA3AF';
};

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading: productLoading, error: productError } = useProduct(id || '');
  const { variants } = useProductVariants(product?.id ? String(product.id) : undefined);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: '',
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const { isAuthenticated, user } = useUser();
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editReviewForm, setEditReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [markingHelpful, setMarkingHelpful] = useState<Set<string>>(new Set());
  const [reportedReviews, setReportedReviews] = useState<Set<string>>(new Set());
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeDetailsTab, setActiveDetailsTab] = useState<'details' | 'care' | 'shipping' | 'reviews'>('details');
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [imageDirection, setImageDirection] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const touchStartX = useRef<number | null>(null);
  
  const { addToCart, items } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { formatPrice, convertPrice, currency, market, country } = useCurrency();

  // Fetch all products for recommendations
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productService.list({ limit: 200, market });
        setAllProducts(response.products || []);
      } catch (error) {
        console.error('Failed to fetch products for recommendations:', error);
        setAllProducts([]);
      }
    };
    fetchProducts();
  }, [market]);

  // Fetch reviews when product loads
  useEffect(() => {
    if (id) {
      // Validate ObjectID format (24 character hex string)
      const isValidObjectID = /^[0-9a-fA-F]{24}$/.test(id);
      if (!isValidObjectID) {
        setReviews([]);
        setReviewsLoading(false);
        return;
      }

      const fetchReviews = async () => {
        try {
          setReviewsLoading(true);
          const data = await productService.getReviews(id);
          setReviews(Array.isArray(data) ? data : []);
        } catch (error: any) {
          // Only log if it's not a 400 error (invalid ID format)
          if (error?.response?.status !== 400) {
            console.error('Failed to fetch reviews:', error);
          }
          setReviews([]);
        } finally {
          setReviewsLoading(false);
        }
      };
      fetchReviews();
    }
  }, [id]);

  useEffect(() => {
    // Reset scroll position to top
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Reset all states when product changes
    setSelectedImage(0);
    setSelectedSize('');
    setActiveDetailsTab('details');
    setPincode('');
    setPincodeResult(null);
    setQuantity(1);
    setImageDirection(0);
  }, [id]);

  useEffect(() => {
    if (product?.colors && product.colors.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0]);
    }
  }, [product, selectedColor]);

  if (productLoading) {
    return (
      <div className="flex min-h-screen w-full min-w-0 items-center justify-center bg-background px-4 pt-page-nav">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="flex min-h-screen w-full min-w-0 items-center justify-center bg-background px-4 pt-page-nav">
        <div className="text-center">
          <h1 className="text-2xl mb-6">Product Not Found</h1>
          <p className="text-gray-600 mb-4">{productError || 'The product you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-foreground text-background hover:opacity-90"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const isWishlisted = isInWishlist(String(product.id));
  
  // Check if current product is in cart
  const isInCart = items.some(item => String(item.id) === String(product.id));

  const selectedSizeStock = selectedSize && product.stock?.[selectedSize];
  const hasSizes = !!(product.sizes && product.sizes.length > 0);
  const needsSizeSelection = hasSizes && !selectedSize;
  // Only "out of stock" once a real size is chosen — an empty selection must not
  // read product.stock[''] (undefined → 0) and falsely disable the CTA.
  const selectedSizeOOS = !!selectedSize
    && product.stock != null
    && Object.keys(product.stock).length > 0
    && (product.stock[selectedSize] ?? 0) <= 0;
  const ctaDisabled = selectedSizeOOS || needsSizeSelection;

  const handleAddToCart = async () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      toast.error('Please select a size');
      return;
    }
    if (selectedSizeOOS) {
      toast.error('This size is out of stock');
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      priceINR: product.price_inr,
      image: product.images[0] || '',
      size: selectedSize || (product.sizes && product.sizes[0]) || 'One Size',
      color: selectedColor || undefined,
      quantity: quantity,
    });
    toast.success('Added to bag');
  };

  const handleBuyNow = () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      toast.error('Please select a size');
      return;
    }
    if (selectedSizeOOS) {
      toast.error('This size is out of stock');
      return;
    }

    if (!isInCart) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        priceINR: product.price_inr,
        image: product.images[0] || '',
        size: selectedSize || (product.sizes && product.sizes[0]) || 'One Size',
        color: selectedColor || undefined,
        quantity: quantity,
      });
    }
    navigate('/checkout');
  };

  const handleShare = async () => {
    const url = window.location.href;
    const text = `Check out ${product.name} on Rloko`;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text, url });
      } catch {
        // user cancelled — do nothing
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    }
  };

  const handleToggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(String(product.id));
      toast.success('Removed from wishlist');
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '',
        category: product.category,
        gender: product.gender,
        colors: product.colors,
        onSale: product.on_sale,
        newArrival: product.new_arrival,
        featured: product.featured,
      });
      toast.success('Added to wishlist');
    }
  };

  // Get color variants - same product name or very similar products with different colors
  const colorVariants = allProducts
    .filter(p => {
      if (String(p.id) === String(product.id)) return false;
      
      // Extract base name (remove color descriptors)
      const currentBaseName = product.name.toLowerCase()
        .replace(/\b(black|white|navy|beige|grey|gray|charcoal|cream|burgundy|brown|tan|camel|red|blue|green|pink|purple|yellow|orange|gold|silver|ivory|sage|rose|emerald|blush|indigo)\b/gi, '')
        .trim();
      const variantBaseName = p.name.toLowerCase()
        .replace(/\b(black|white|navy|beige|grey|gray|charcoal|cream|burgundy|brown|tan|camel|red|blue|green|pink|purple|yellow|orange|gold|silver|ivory|sage|rose|emerald|blush|indigo)\b/gi, '')
        .trim();
      
      // Same base name and same category
      return currentBaseName === variantBaseName && p.category === product.category;
    })
    .slice(0, 5);

  // Get similar products (same gender, different category)
  const similarProducts = allProducts
    .filter(p => String(p.id) !== String(product.id) && p.gender === product.gender && p.category !== product.category)
    .slice(0, 6);

  // Get trending products (high rating products)
  const trendingProducts = allProducts
    .filter(p => String(p.id) !== String(product.id) && p.rating >= 4.5)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  // Get product images - ensure we have an array with valid image URLs
  const productImages = product.images && Array.isArray(product.images) && product.images.length > 0 
    ? product.images.filter(img => img && typeof img === 'string' && img.trim() !== '') // Filter out empty/invalid strings
    : [PLACEHOLDER_IMAGE]; // Fallback placeholder

  // Image gallery navigation (shared by arrows + touch swipe)
  const showPrevImage = () => {
    setImageDirection(-1);
    setSelectedImage((i) => (i === 0 ? productImages.length - 1 : i - 1));
  };
  const showNextImage = () => {
    setImageDirection(1);
    setSelectedImage((i) => (i === productImages.length - 1 ? 0 : i + 1));
  };
  // Finger-swipe: horizontal drag past a small threshold flips the image.
  const handleGalleryTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleGalleryTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null || productImages.length <= 1) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (dx <= -40) showNextImage();
    else if (dx >= 40) showPrevImage();
  };

  const ratingCount = reviewsLoading ? (product.reviews ?? 0) : reviews.length;
  const averageRating = !reviewsLoading && reviews.length > 0
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
    : product.rating || 0;

  // Calculate estimated delivery date (5-7 business days from today)
  const getEstimatedDelivery = () => {
    const today = new Date();
    let businessDays = 0;
    let current = new Date(today);
    while (businessDays < 7) {
      current.setDate(current.getDate() + 1);
      const day = current.getDay();
      if (day !== 0 && day !== 6) businessDays++;
    }
    return current.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handlePincodeCheck = () => {
    if (!pincode.trim() || pincode.trim().length < 4) {
      setPincodeResult('Please enter a valid postal code');
      return;
    }
    setPincodeResult(`Estimated delivery by ${getEstimatedDelivery()}`);
  };

  return (
    <div className="min-h-screen w-full min-w-0 bg-background pt-page-nav pb-mobile-nav">
      {/* Main Content */}
      <div className="page-section pt-3 pb-3 md:pt-6 md:pb-6">
        <div className="grid min-w-0 grid-cols-1 gap-1.5 md:gap-12 lg:grid-cols-2">
          {/* Left - Images Section */}
          <div className="flex flex-col gap-3 lg:sticky lg:top-24 lg:self-start">
            {/* Main Image */}
            <div
              className="relative overflow-hidden group touch-pan-y select-none"
              onTouchStart={handleGalleryTouchStart}
              onTouchEnd={handleGalleryTouchEnd}
            >
              <AnimatePresence initial={false} custom={imageDirection} mode="wait">
                <motion.div
                  key={selectedImage}
                  custom={imageDirection}
                  initial={{ x: imageDirection > 0 ? '100%' : '-100%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: imageDirection > 0 ? '-100%' : '100%', opacity: 0 }}
                  transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.3 }
                  }}
                  className="aspect-[3/4] lg:aspect-auto lg:h-[calc(100vh-8rem)] overflow-hidden bg-background relative"
                >
                  <img
                    src={productImages[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                    onError={(e) => {
                      // Fallback to placeholder if image fails
                      (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                    }}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Slide counter */}
              {productImages.length > 1 && (
                <div className="absolute bottom-4 right-4 z-10 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-medium tabular-nums">
                  {selectedImage + 1} / {productImages.length}
                </div>
              )}

              {/* Reviews badge, overlaid on the image — Myntra-style rating chip */}
              {ratingCount > 0 && (
                <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1 rounded bg-green-700 pl-2 pr-1.5 py-1 text-white text-xs font-semibold shadow-sm">
                  <span>{averageRating}</span>
                  <Star size={10} className="fill-white text-white" />
                  <span className="ml-1 pl-1 border-l border-white/40 font-normal text-white/90">{ratingCount}</span>
                </div>
              )}

              {/* Wishlist toggle */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className="absolute top-4 right-4 z-10 flex items-center justify-center"
              >
                <Heart
                  size={22}
                  className={isWishlisted ? 'text-red-500' : 'text-white'}
                  fill="currentColor"
                  style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))' }}
                />
              </button>
            </div>

            {/* Size Guide — opens in a modal from the "Size Guide" link (Myntra-style) */}
            <AnimatePresence>
              {showSizeGuide && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/50 sm:p-4"
                  onClick={() => setShowSizeGuide(false)}
                >
                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 40, opacity: 0 }}
                    transition={{ type: 'spring', damping: 30, stiffness: 350 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full sm:max-w-lg max-h-[85vh] overflow-y-auto bg-background rounded-t-2xl sm:rounded-2xl p-5 shadow-2xl"
                  >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-medium tracking-wide">Size Guide</h3>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(false)}
                  aria-label="Close size guide"
                  className="w-8 h-8 rounded-full flex items-center justify-center text-foreground/50 hover:bg-muted hover:text-foreground transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="px-3 py-2 text-left font-medium text-foreground/70">Size</th>
                      <th className="px-3 py-2 text-center font-medium text-foreground/70">Chest (in)</th>
                      <th className="px-3 py-2 text-center font-medium text-foreground/70">Waist (in)</th>
                      <th className="px-3 py-2 text-center font-medium text-foreground/70">Hips (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/20 transition-colors hover:bg-primary/5">
                      <td className="px-3 py-2.5 font-medium">XS</td>
                      <td className="px-3 py-2.5 text-center text-foreground/70">32-34</td>
                      <td className="px-3 py-2.5 text-center text-foreground/70">24-26</td>
                      <td className="px-3 py-2.5 text-center text-foreground/70">34-36</td>
                    </tr>
                    <tr className="border-b border-border/20 transition-colors hover:bg-primary/5">
                      <td className="px-3 py-2.5 font-medium">S</td>
                      <td className="px-3 py-2.5 text-center text-foreground/70">34-36</td>
                      <td className="px-3 py-2.5 text-center text-foreground/70">26-28</td>
                      <td className="px-3 py-2.5 text-center text-foreground/70">36-38</td>
                    </tr>
                    <tr className="border-b border-border/20 transition-colors hover:bg-primary/5">
                      <td className="px-3 py-2.5 font-medium">M</td>
                      <td className="px-3 py-2.5 text-center text-foreground/70">36-38</td>
                      <td className="px-3 py-2.5 text-center text-foreground/70">28-30</td>
                      <td className="px-3 py-2.5 text-center text-foreground/70">38-40</td>
                    </tr>
                    <tr className="border-b border-border/20 transition-colors hover:bg-primary/5">
                      <td className="px-3 py-2.5 font-medium">L</td>
                      <td className="px-3 py-2.5 text-center text-foreground/70">38-40</td>
                      <td className="px-3 py-2.5 text-center text-foreground/70">30-32</td>
                      <td className="px-3 py-2.5 text-center text-foreground/70">40-42</td>
                    </tr>
                    <tr className="transition-colors hover:bg-primary/5">
                      <td className="px-3 py-2.5 font-medium">XL</td>
                      <td className="px-3 py-2.5 text-center text-foreground/70">40-42</td>
                      <td className="px-3 py-2.5 text-center text-foreground/70">32-34</td>
                      <td className="px-3 py-2.5 text-center text-foreground/70">42-44</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-foreground/50">
                All measurements are in inches. For best fit, measure yourself and compare with the chart.
              </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right - Product Details */}
          <div className="lg:pt-0">
            {/* Brand, Name, Rating, Price & Color — consolidated into a single block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="py-2 border-b border-foreground/10 space-y-0"
            >
              <div>
                <div className="flex flex-wrap items-start justify-between gap-x-2 gap-y-1">
                  <div className="flex items-center gap-2 flex-1 min-w-[65%]">
                    <h1 className="text-base md:text-lg">{product.name}</h1>
                    {product.badge && (
                      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 bg-primary text-primary-foreground rounded-full">
                        {product.badge}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="mt-1 md:mt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-base md:text-lg">
                    {formatPrice(product.price, product.price_inr)}
                  </span>
                  {product.original_price && (
                    <>
                      <span className="text-sm text-foreground/30 line-through">
                        {formatPrice(product.original_price, product.original_price_inr)}
                      </span>
                      <span className="text-xs text-red-600">
                        {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Color / Variant swatches — only when there's an actual choice to make */}
              {variants.length > 1 && (
                <div>
                  <div className="flex flex-wrap gap-3">
                    {variants.map((variant) => {
                      const isCurrent = String(variant.id) === String(product.id);
                      const isSoldOut = variant.stock
                        ? Object.values(variant.stock).every((q) => q === 0)
                        : false;
                      const colorHex = getColorHex(variant.color || variant.colors?.[0] || '');
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          title={variant.color || variant.name}
                          disabled={isCurrent}
                          onClick={() => navigate(`/product/${variant.id}`)}
                          className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                            isCurrent
                              ? 'border-foreground scale-110 cursor-default'
                              : 'border-transparent hover:border-foreground/50 hover:scale-105'
                          } ${isSoldOut ? 'opacity-40' : ''}`}
                          style={{ backgroundColor: colorHex }}
                        >
                          {isSoldOut && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="block w-full h-px bg-foreground/60 rotate-45" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {/* Variant image thumbnails */}
                  {variants.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
                      {variants.map((variant) => {
                        const isCurrent = String(variant.id) === String(product.id);
                        return (
                          <motion.button
                            key={variant.id}
                            type="button"
                            whileHover={{ scale: 1.04, y: -2 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => !isCurrent && navigate(`/product/${variant.id}`)}
                            className={`flex-shrink-0 w-14 h-16 overflow-hidden border-2 transition-all ${
                              isCurrent ? 'border-foreground cursor-default' : 'border-foreground/10 hover:border-foreground/50 cursor-pointer'
                            }`}
                            title={variant.color || variant.name}
                          >
                            <img
                              src={variant.images?.[0] || PLACEHOLDER_IMAGE}
                              alt={variant.color || variant.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
                            />
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
              {/* Fallback: product has colors[] but no variant group yet — only when there's a choice */}
              {variants.length === 0 && product.colors?.length > 1 && (
                <div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        title={color}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${selectedColor === color ? 'border-foreground scale-110' : 'border-transparent hover:border-foreground/40'}`}
                        style={{ backgroundColor: getColorHex(color) }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="py-2 border-b border-foreground/10"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-sm">Size</span>
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide(true)}
                    className="flex items-center gap-1 text-xs text-foreground/60 hover:text-foreground underline transition-colors"
                  >
                    <Ruler size={13} />
                    Size Chart
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map((size) => {
                    const available = product.stock?.[size] ?? 0;
                    const outOfStock = available === 0;
                    return (
                      <motion.button
                        key={size}
                        type="button"
                        onClick={() => !outOfStock && setSelectedSize(size)}
                        whileHover={!outOfStock ? { scale: 1.05 } : undefined}
                        whileTap={!outOfStock ? { scale: 0.95 } : undefined}
                        disabled={outOfStock}
                        className={`h-10 px-1 rounded-md border text-xs transition-all flex items-center justify-center ${
                          outOfStock
                            ? 'border-foreground/10 bg-foreground/5 text-foreground/40 cursor-not-allowed line-through'
                            : selectedSize === size
                              ? 'border-foreground bg-foreground text-background'
                              : 'border-foreground/20 hover:border-foreground'
                        }`}
                      >
                        {size}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="py-2"
            >
              <div className="flex flex-col gap-2">
                {isInCart ? (
                  <motion.button
                    onClick={() => navigate('/cart')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-12 rounded-full border-2 border-foreground bg-background text-foreground font-medium hover:bg-foreground/5 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={16} />
                    Go to Bag
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleAddToCart}
                    whileHover={ctaDisabled ? undefined : { scale: 1.02 }}
                    whileTap={ctaDisabled ? undefined : { scale: 0.98 }}
                    disabled={ctaDisabled}
                    className={`w-full h-12 rounded-full border-2 font-medium transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 ${
                      ctaDisabled
                        ? 'border-foreground/10 bg-muted text-muted-foreground cursor-not-allowed'
                        : 'border-foreground bg-background text-foreground hover:bg-foreground/5'
                    }`}
                  >
                    {selectedSizeOOS ? 'Out of Stock' : needsSizeSelection ? 'Select a Size' : 'Add to Bag'}
                  </motion.button>
                )}
                <div className="flex gap-2">
                  <motion.button
                    onClick={handleBuyNow}
                    whileHover={ctaDisabled ? undefined : { scale: 1.02 }}
                    whileTap={ctaDisabled ? undefined : { scale: 0.98 }}
                    disabled={ctaDisabled}
                    className={`flex-1 h-12 rounded-full font-medium transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2 ${
                      ctaDisabled
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-foreground text-background hover:bg-foreground/90'
                    }`}
                  >
                    Buy Now
                  </motion.button>
                  <motion.button
                    onClick={handleShare}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    title="Share this product"
                    className="h-12 w-12 rounded-full border border-foreground/20 hover:border-foreground transition-all flex items-center justify-center shrink-0"
                  >
                    <Share2 size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Delivery Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="py-3 border-t border-foreground/10"
            >
              <div className="mb-2">
                <span className="text-xs font-medium uppercase tracking-widest">Check Delivery</span>
                <p className="text-[11px] text-foreground/50 mt-1 normal-case tracking-normal">
                  Enter your {country === 'India' ? 'pincode' : 'ZIP code'} to see the estimated delivery date.
                </p>
              </div>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder={PH.postalCode}
                  value={pincode}
                  onChange={(e) => { setPincode(e.target.value); setPincodeResult(null); }}
                  onKeyDown={(e) => e.key === 'Enter' && handlePincodeCheck()}
                  className="flex-1 h-11 px-4 border border-foreground/20 text-sm bg-background focus:border-foreground focus:outline-none transition-colors"
                  maxLength={10}
                />
                <button
                  onClick={handlePincodeCheck}
                  className="px-6 h-11 border border-foreground text-foreground font-medium text-xs hover:bg-foreground hover:text-background transition-all uppercase tracking-widest"
                >
                  Check
                </button>
              </div>
              {pincodeResult && (
                <p className="text-xs mb-4 text-foreground/70">{pincodeResult}</p>
              )}
              <div className="space-y-3 text-sm">
                <div className="flex gap-3 items-start">
                  <Truck size={16} className="text-foreground/40 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="mb-0.5">Estimated delivery by {getEstimatedDelivery()}</p>
                    <p className="text-foreground/50 text-xs">Pay on delivery available</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <RefreshCw size={16} className="text-foreground/40 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="mb-0.5">30-day returns & exchange</p>
                    <p className="text-foreground/50 text-xs">Easy return policy</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Details & Description | Wash Care | Shipping | Reviews — persistent tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="pt-3 md:pt-4 border-t border-foreground/10"
            >
              <div className="flex border-b border-foreground/10 overflow-x-auto scrollbar-hide">
                {([
                  { key: 'details', label: 'Details & Description' },
                  { key: 'care', label: 'Wash Care' },
                  { key: 'shipping', label: 'Shipping' },
                  { key: 'reviews', label: `Reviews (${ratingCount})` },
                ] as const).map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveDetailsTab(tab.key)}
                    className={`shrink-0 px-4 py-2 text-xs uppercase tracking-wider whitespace-nowrap transition-colors border-b-2 ${
                      activeDetailsTab === tab.key
                        ? 'text-foreground border-foreground'
                        : 'text-foreground/50 border-transparent hover:text-foreground'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {activeDetailsTab === 'details' && (
                <div className="pt-3 pb-3 text-sm text-foreground/60 space-y-4 tracking-wide leading-relaxed">
                  <p>{product.description || 'Crafted with meticulous attention to detail, this piece embodies timeless elegance and modern sophistication.'}</p>
                  {product.details && product.details.length > 0 && (
                    <ul className="space-y-1 pt-1">
                      {product.details.map((d, i) => <li key={i}>• {d}</li>)}
                    </ul>
                  )}
                  <div className="space-y-2 pt-2">
                    <p><span className="text-foreground uppercase text-xs tracking-wider">Category:</span> <span className="capitalize ml-2">{product.category}</span></p>
                    {product.subcategory && <p><span className="text-foreground uppercase text-xs tracking-wider">Subcategory:</span> <span className="capitalize ml-2">{product.subcategory}</span></p>}
                    {product.material && <p><span className="text-foreground uppercase text-xs tracking-wider">Material:</span> <span className="ml-2">{product.material}</span></p>}
                    {product.sku && <p><span className="text-foreground uppercase text-xs tracking-wider">SKU:</span> <span className="ml-2 font-mono text-xs">{product.sku}</span></p>}
                  </div>
                </div>
              )}
              {activeDetailsTab === 'care' && (
                <div className="pt-3 pb-3 text-sm text-foreground/60 space-y-2 tracking-wide">
                  {product.material && <p>• {product.material}</p>}
                  {product.care ? (
                    product.care.split(/[,;.\n]+/).filter(Boolean).map((line, i) => (
                      <p key={i}>• {line.trim()}</p>
                    ))
                  ) : (
                    <>
                      <p>• Machine wash cold</p>
                      <p>• Do not bleach</p>
                      <p>• Tumble dry low</p>
                    </>
                  )}
                </div>
              )}
              {activeDetailsTab === 'shipping' && (
                <div className="pt-3 pb-3 text-sm text-foreground/60 space-y-4 tracking-wide">
                  <div>
                    <p className="text-foreground mb-2 text-xs uppercase tracking-wider">Shipping</p>
                    <p>• Free standard shipping on all orders</p>
                    <p>• Express shipping available at checkout</p>
                    <p>• International shipping to select countries</p>
                    <p>• Orders processed within 1-2 business days</p>
                  </div>
                  <div>
                    <p className="text-foreground mb-2 text-xs uppercase tracking-wider">Returns</p>
                    <p>• 30-day return window from delivery date</p>
                    <p>• Items must be unworn with original tags</p>
                    <p>• Free returns for store credit</p>
                    <p>• Refunds processed within 5-7 business days</p>
                  </div>
                </div>
              )}
              {activeDetailsTab === 'reviews' && (
                <div className="pt-3 pb-5">
                        {/* Rating Summary */}
                        {!reviewsLoading && reviews.length > 0 && (() => {
                          const dist = [5, 4, 3, 2, 1].map((star) => ({
                            star,
                            count: reviews.filter((r) => r.rating === star).length,
                            pct: Math.round((reviews.filter((r) => r.rating === star).length / reviews.length) * 100),
                          }));
                          return (
                            <div className="flex gap-6 mb-6 pb-6 border-b border-foreground/5">
                              {/* Left: score */}
                              <div className="flex flex-col items-center justify-center min-w-[72px]">
                                <span className="text-4xl font-light">{averageRating}</span>
                                <div className="flex gap-0.5 my-1">
                                  {[1, 2, 3, 4, 5].map((i) => (
                                    <Star
                                      key={i}
                                      size={12}
                                      className={
                                        i <= Math.floor(averageRating)
                                          ? 'fill-foreground text-foreground'
                                          : i - 0.5 <= averageRating
                                            ? 'fill-foreground/50 text-foreground/50'
                                            : 'fill-foreground/20 text-foreground/20'
                                      }
                                    />
                                  ))}
                                </div>
                                <span className="text-[11px] text-foreground/50">{ratingCount} reviews</span>
                              </div>
                              {/* Right: distribution bars */}
                              <div className="flex-1 space-y-1.5">
                                {dist.map(({ star, count, pct }) => (
                                  <div key={star} className="flex items-center gap-2 text-xs">
                                    <span className="w-3 text-right text-foreground/60 shrink-0">{star}</span>
                                    <Star size={10} className="fill-foreground/40 text-foreground/40 shrink-0" />
                                    <div className="flex-1 h-1.5 bg-foreground/10 rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-foreground/60 rounded-full transition-all duration-500"
                                        style={{ width: `${pct}%` }}
                                      />
                                    </div>
                                    <span className="w-6 text-right text-foreground/40 shrink-0">{count}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Reviews */}
                        <div className="space-y-6">
                          {reviewsLoading ? (
                            <div className="text-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                            </div>
                          ) : !reviews || reviews.length === 0 ? (
                            <p className="text-center text-gray-600 py-8">No reviews yet. Be the first to review!</p>
                          ) : (
                            (reviews || []).map((review) => {
                              const isOwnReview = user && review.user_id === user.id;
                              const isEditing = editingReview === review.id;
                              
                              return (
                                <div key={review.id} className="border-b border-foreground/5 pb-6 last:border-0">
                                  {isEditing ? (
                                    <div className="space-y-4">
                                      <div>
                                        <label className="block text-xs uppercase tracking-wider mb-2 text-foreground/60">Rating</label>
                                        <div className="flex gap-2">
                                          {[1, 2, 3, 4, 5].map((rating) => (
                                            <button
                                              key={rating}
                                              type="button"
                                              onClick={() => setEditReviewForm({ ...editReviewForm, rating })}
                                              className="focus:outline-none"
                                            >
                                              <Star
                                                size={20}
                                                className={rating <= editReviewForm.rating ? 'fill-foreground text-foreground' : 'fill-foreground/20 text-foreground/20'}
                                              />
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                      <div>
                                        <label className="block text-xs uppercase tracking-wider mb-2 text-foreground/60">Title (Optional)</label>
                                        <input
                                          type="text"
                                          value={editReviewForm.title}
                                          onChange={(e) => setEditReviewForm({ ...editReviewForm, title: e.target.value })}
                                          className="w-full px-3 py-2 bg-background border border-foreground/20 text-sm focus:border-foreground focus:outline-none"
                                          placeholder={PH.reviewTitle}
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs uppercase tracking-wider mb-2 text-foreground/60">Review</label>
                                        <textarea
                                          value={editReviewForm.comment}
                                          onChange={(e) => setEditReviewForm({ ...editReviewForm, comment: e.target.value })}
                                          rows={4}
                                          className="w-full px-3 py-2 bg-background border border-foreground/20 text-sm focus:border-foreground focus:outline-none resize-none"
                                          placeholder={PH.reviewBody}
                                        />
                                      </div>
                                      <div className="flex gap-3">
                                        <button
                                          onClick={async () => {
                                            if (!editReviewForm.comment.trim()) {
                                              toast.error('Please enter a review comment');
                                              return;
                                            }
                                            
                                            try {
                                              await reviewService.update(id!, review.id, {
                                                rating: editReviewForm.rating,
                                                title: editReviewForm.title || undefined,
                                                comment: editReviewForm.comment,
                                              });
                                              
                                              const updatedReviews = await productService.getReviews(id!);
                                              setReviews(updatedReviews);
                                              
                                              setEditingReview(null);
                                              setEditReviewForm({ rating: 5, title: '', comment: '' });
                                              toast.success('Review updated successfully!');
                                            } catch (error: unknown) {
                                              console.error('Failed to update review:', error);
                                              toast.error(getApiErrorMessage(error, 'Failed to update review'));
                                            }
                                          }}
                                          className="flex-1 px-4 py-2 bg-foreground text-background hover:bg-foreground/90 transition-colors text-sm uppercase tracking-wider"
                                        >
                                          Save Changes
                                        </button>
                                        <button
                                          onClick={() => {
                                            setEditingReview(null);
                                            setEditReviewForm({ rating: 5, title: '', comment: '' });
                                          }}
                                          className="px-4 py-2 border border-foreground/20 hover:bg-foreground/5 transition-colors text-sm uppercase tracking-wider"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="flex items-start justify-between mb-3">
                                        <div className="flex gap-1">
                                          {[...Array(5)].map((_, i) => (
                                            <Star
                                              key={i}
                                              size={12}
                                              className={i < review.rating ? 'fill-foreground text-foreground' : 'fill-foreground/20 text-foreground/20'}
                                            />
                                          ))}
                                        </div>
                                        {isOwnReview && (
                                          <div className="flex gap-2">
                                            <button
                                              onClick={() => {
                                                setEditingReview(review.id);
                                                setEditReviewForm({
                                                  rating: review.rating,
                                                  title: review.title || '',
                                                  comment: review.comment,
                                                });
                                              }}
                                              className="p-1.5 hover:bg-foreground/5 rounded transition-colors"
                                              title="Edit review"
                                            >
                                              <Edit2 size={14} className="text-foreground/60" />
                                            </button>
                                            <button
                                              onClick={async () => {
                                                if (confirm('Are you sure you want to delete this review?')) {
                                                  try {
                                                    await reviewService.delete(id!, review.id);
                                                    const updatedReviews = await productService.getReviews(id!);
                                                    setReviews(updatedReviews);
                                                    toast.success('Review deleted successfully');
                                                  } catch (error: unknown) {
                                                    console.error('Failed to delete review:', error);
                                                    toast.error(getApiErrorMessage(error, 'Failed to delete review'));
                                                  }
                                                }
                                              }}
                                              className="p-1.5 hover:bg-red-500/10 rounded transition-colors"
                                              title="Delete review"
                                            >
                                              <Trash2 size={14} className="text-red-600" />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                      {review.title && (
                                        <p className="text-sm font-medium mb-2 tracking-wide">{review.title}</p>
                                      )}
                                      <p className="text-sm text-foreground/70 mb-3 tracking-wide leading-relaxed">{review.comment}</p>
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-xs text-foreground/50 tracking-wide flex-wrap">
                                          <span className="uppercase">{review.user_name}</span>
                                          {review.verified && (
                                            <span className="flex items-center gap-1">
                                              <Check size={10} /> Verified
                                            </span>
                                          )}
                                          <span>• {new Date(review.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                        {isAuthenticated && (
                                          <button
                                            onClick={async () => {
                                              if (markingHelpful.has(review.id)) return;

                                              setMarkingHelpful(new Set([...markingHelpful, review.id]));
                                              try {
                                                await reviewService.markHelpful(id!, review.id);
                                                setReviews(prev => prev.map(r => r.id === review.id ? { ...r, helpful: (r.helpful || 0) + 1 } : r));
                                                toast.success('Thank you for your feedback!');
                                              } catch (error: unknown) {
                                                console.error('Failed to mark review as helpful:', error);
                                                const newSet = new Set(markingHelpful);
                                                newSet.delete(review.id);
                                                setMarkingHelpful(newSet);
                                                toast.error(getApiErrorMessage(error, 'Failed to mark review as helpful'));
                                              }
                                            }}
                                            disabled={markingHelpful.has(review.id)}
                                            className="flex items-center gap-1 px-2 py-1 text-xs text-foreground/60 hover:text-foreground hover:bg-foreground/5 rounded transition-colors disabled:opacity-50"
                                          >
                                            <ThumbsUp size={12} className={markingHelpful.has(review.id) ? 'fill-foreground' : ''} />
                                            Helpful{review.helpful > 0 ? ` (${review.helpful})` : ''}
                                          </button>
                                        )}
                                        {isAuthenticated && !isOwnReview && (
                                          <button
                                            onClick={async () => {
                                              if (reportedReviews.has(review.id)) return;
                                              try {
                                                const { message } = await reviewService.report(id!, review.id);
                                                setReportedReviews(prev => new Set([...prev, review.id]));
                                                toast.success(message);
                                              } catch (error: unknown) {
                                                console.error('Failed to report review:', error);
                                                toast.error(getApiErrorMessage(error, 'Failed to report review'));
                                              }
                                            }}
                                            disabled={reportedReviews.has(review.id)}
                                            title={reportedReviews.has(review.id) ? 'Reported' : 'Report this review'}
                                            className="flex items-center gap-1 px-2 py-1 text-xs text-foreground/40 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                          >
                                            <Flag size={12} className={reportedReviews.has(review.id) ? 'fill-current' : ''} />
                                            {reportedReviews.has(review.id) ? 'Reported' : 'Report'}
                                          </button>
                                        )}
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>

                        {/* Review Submission Form */}
                        {isAuthenticated && (
                          <div className="mt-8 pt-6 border-t border-foreground/10">
                            {!showReviewForm ? (
                              <button
                                onClick={() => setShowReviewForm(true)}
                                className="w-full py-3 border border-foreground/20 hover:bg-foreground/5 transition-colors text-sm uppercase tracking-wider"
                              >
                                Write a Review
                              </button>
                            ) : (
                              <div className="space-y-4">
                                <h4 className="text-sm uppercase tracking-wider mb-4">Write a Review</h4>
                                
                                {/* Rating Selection */}
                                <div>
                                  <label className="block text-xs uppercase tracking-wider mb-2 text-foreground/60">Rating</label>
                                  <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                      <button
                                        key={rating}
                                        type="button"
                                        onClick={() => setReviewForm({ ...reviewForm, rating })}
                                        className="focus:outline-none"
                                      >
                                        <Star
                                          size={24}
                                          className={rating <= reviewForm.rating ? 'fill-foreground text-foreground' : 'fill-foreground/20 text-foreground/20'}
                                        />
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* Title */}
                                <div>
                                  <label className="block text-xs uppercase tracking-wider mb-2 text-foreground/60">Title (Optional)</label>
                                  <input
                                    type="text"
                                    value={reviewForm.title}
                                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                                    className="w-full px-3 py-2 bg-background border border-foreground/20 text-sm focus:border-foreground focus:outline-none transition-colors"
                                    placeholder={PH.reviewTitle}
                                  />
                                </div>

                                {/* Comment */}
                                <div>
                                  <label className="block text-xs uppercase tracking-wider mb-2 text-foreground/60">Review</label>
                                  <textarea
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                    rows={4}
                                    className="w-full px-3 py-2 bg-background border border-foreground/20 text-sm focus:border-foreground focus:outline-none transition-colors resize-none"
                                    placeholder={PH.reviewBody}
                                  />
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                  <button
                                    onClick={async () => {
                                      if (!reviewForm.comment.trim()) {
                                        toast.error('Please enter a review comment');
                                        return;
                                      }
                                      
                                      setSubmittingReview(true);
                                      try {
                                        await reviewService.create(id!, {
                                          rating: reviewForm.rating,
                                          title: reviewForm.title || undefined,
                                          comment: reviewForm.comment,
                                        });
                                        
                                        // Refresh reviews
                                        const updatedReviews = await productService.getReviews(id!);
                                        setReviews(updatedReviews);
                                        
                                        // Reset form
                                        setReviewForm({ rating: 5, title: '', comment: '' });
                                        setShowReviewForm(false);
                                        toast.success('Review submitted successfully!');
                                      } catch (error: unknown) {
                                        console.error('Failed to submit review:', error);
                                        toast.error(getApiErrorMessage(error, 'Failed to submit review. Please try again.'));
                                      } finally {
                                        setSubmittingReview(false);
                                      }
                                    }}
                                    disabled={submittingReview}
                                    className="flex-1 py-2 bg-foreground text-background hover:bg-foreground/90 transition-colors text-sm uppercase tracking-wider disabled:opacity-50"
                                  >
                                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setShowReviewForm(false);
                                      setReviewForm({ rating: 5, title: '', comment: '' });
                                    }}
                                    className="px-4 py-2 border border-foreground/20 hover:bg-foreground/5 transition-colors text-sm uppercase tracking-wider"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <ProductRecommendationSection
            title="Similar Products"
            products={similarProducts}
            variant="minimal"
          />
        )}

        {/* Trending Products */}
        {trendingProducts.length > 0 && (
          <ProductRecommendationSection
            title="Trending Products"
            subtitle="Most loved by our customers"
            products={trendingProducts}
            variant="bold"
          />
        )}

      <Footer />
    </div>
  );
}