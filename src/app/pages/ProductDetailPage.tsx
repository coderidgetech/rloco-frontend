import { motion, AnimatePresence } from 'motion/react';
import { Heart, Star, ChevronRight, ChevronDown, Truck, RefreshCw, Check, Shield, Award, Package, Sparkles, Leaf, Users, Info, MessageCircle, Ruler, Shirt, HelpCircle, Plus, Minus, ShoppingBag, ChevronLeft, Edit2, Trash2, ThumbsUp } from 'lucide-react';
import { Product } from '../types/api';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'sonner';
import { useParams, useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { ProductRecommendationSection } from '../components/ProductRecommendationSection';
import { CompleteTheLookSection } from '../components/CompleteTheLookSection';
import { useProduct } from '../hooks/useProducts';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';
import { shippingService } from '../services/shippingService';
import { ProductReview } from '../types/api';
import { useUser } from '../context/UserContext';
import { useCurrency } from '../context/CurrencyContext';
import { PLACEHOLDER_IMAGE } from '../constants';
import { PH } from '../lib/formPlaceholders';

interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

// Mock reviews removed - using API reviews instead

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
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [expandedSection, setExpandedSection] = useState<string>('details');
  const sizeGuideRef = useRef<HTMLDivElement>(null);
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<string | null>(null);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [imageDirection, setImageDirection] = useState(0);
  
  const { addToCart, items } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { formatPrice, convertPrice, currency, market } = useCurrency();

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
    setExpandedSection('details');
    setPincode('');
    setQuantity(1);
    setImageDirection(0);
  }, [id]);

  // Auto-slide images every 4 seconds
  useEffect(() => {
    if (!product || !product.images || product.images.length === 0) return;
    
    const interval = setInterval(() => {
      setImageDirection(1);
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [product]);

  useEffect(() => {
    if (product?.colors && product.colors.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0]);
    }
  }, [product, selectedColor]);

  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-page-nav px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-page-nav px-4">
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

  const handleAddToCart = async () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      toast.error('Please select a size');
      return;
    }
    
    addToCart({
      id: product.id, // Use product.id directly (MongoDB ObjectID string)
      name: product.name,
      price: product.price,
      priceINR: product.price_inr,
      image: product.images[0] || '',
      size: selectedSize || (product.sizes && product.sizes[0]) || 'One Size',
      quantity: quantity,
    });
    toast.success('Added to bag');
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

  // Get related products (same category) - map to format expected by components
  const relatedProducts = allProducts
    .filter(p => String(p.id) !== String(product.id) && p.category === product.category)
    .slice(0, 6)
    .map(p => ({
      id: String(p.id),
      name: p.name,
      price: p.price,
      originalPrice: p.original_price,
      image: p.images && p.images.length > 0 ? p.images[0] : PLACEHOLDER_IMAGE,
      priceINR: p.price_inr,
      originalPriceINR: p.original_price_inr,
      badge: p.badge,
    }));

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
    .slice(0, 6)
    .map(p => ({
      id: String(p.id),
      name: p.name,
      price: p.price,
      originalPrice: p.original_price,
      image: p.images && p.images.length > 0 ? p.images[0] : PLACEHOLDER_IMAGE,
      priceINR: p.price_inr,
      originalPriceINR: p.original_price_inr,
      badge: p.badge,
    }));

  // Get trending products (high rating products)
  const trendingProducts = allProducts
    .filter(p => String(p.id) !== String(product.id) && p.rating >= 4.5)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6)
    .map(p => ({
      id: String(p.id),
      name: p.name,
      price: p.price,
      originalPrice: p.original_price,
      image: p.images && p.images.length > 0 ? p.images[0] : PLACEHOLDER_IMAGE,
      priceINR: p.price_inr,
      originalPriceINR: p.original_price_inr,
      badge: p.badge,
    }));

  // Get products often bought together (same price range)
  const completeTheLook = allProducts
    .filter(p => 
      String(p.id) !== String(product.id) && 
      Math.abs(p.price - product.price) < 50 &&
      p.category !== product.category
    )
    .slice(0, 6)
    .map(p => ({
      id: String(p.id),
      name: p.name,
      price: p.price,
      originalPrice: p.original_price,
      image: p.images && p.images.length > 0 ? p.images[0] : PLACEHOLDER_IMAGE,
      category: p.category,
      priceINR: p.price_inr,
      originalPriceINR: p.original_price_inr,
    }));

  // Get product images - ensure we have an array with valid image URLs
  const productImages = product.images && Array.isArray(product.images) && product.images.length > 0 
    ? product.images.filter(img => img && typeof img === 'string' && img.trim() !== '') // Filter out empty/invalid strings
    : [PLACEHOLDER_IMAGE]; // Fallback placeholder
  
  const averageRating = product.rating || 0;
  const ratingCount = product.reviews || reviews.length;

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

  const handlePincodeCheck = async () => {
    if (!pincode.trim() || pincode.trim().length < 4) {
      setPincodeResult('Please enter a valid postal code');
      return;
    }
    setPincodeLoading(true);
    setPincodeResult(null);
    try {
      const methods = await shippingService.calculate({
        country: 'IN',
        postal_code: pincode.trim(),
        subtotal: product?.price || 0,
      });
      if (methods && methods.length > 0) {
        const method = methods[0];
        const deliveryDate = getEstimatedDelivery();
        const convertedCost =
          method.currency?.toUpperCase() === 'USD' ? method.base_cost * 75 : method.base_cost;
        const cost = convertedCost === 0 ? 'Free' : `₹${convertedCost}`;
        setPincodeResult(`Delivery by ${deliveryDate} · ${cost}`);
      } else {
        setPincodeResult(`Estimated delivery by ${getEstimatedDelivery()}`);
      }
    } catch {
      setPincodeResult(`Estimated delivery by ${getEstimatedDelivery()}`);
    } finally {
      setPincodeLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  return (
    <div className="min-h-screen bg-background pt-page-nav pb-mobile-nav w-full">
      {/* Breadcrumb */}
      <div className="border-b border-foreground/5 bg-background">
        <div className="w-full px-2 md:px-4 py-3 md:py-4">
          <div className="flex items-center gap-2 text-xs text-foreground/50">
            <button onClick={() => navigate('/')} className="hover:text-foreground transition-colors uppercase whitespace-nowrap">Home</button>
            <ChevronRight size={12} className="flex-shrink-0" />
            <span className="capitalize uppercase whitespace-nowrap">{product.category}</span>
            <ChevronRight size={12} className="flex-shrink-0" />
            <span className="text-foreground uppercase truncate">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-2 md:px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {/* Left - Images Section */}
          <div className="flex flex-col gap-3">
            {/* Main Image */}
            <div className="relative overflow-hidden group">
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
                  className="aspect-[3/4] overflow-hidden bg-background relative"
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

              {/* Navigation Arrows */}
              {productImages.length > 1 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all hover:bg-white z-10"
                    onClick={() => {
                      const newIndex = selectedImage === 0 ? productImages.length - 1 : selectedImage - 1;
                      setImageDirection(-1);
                      setSelectedImage(newIndex);
                    }}
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} strokeWidth={2} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all hover:bg-white z-10"
                    onClick={() => {
                      const newIndex = selectedImage === productImages.length - 1 ? 0 : selectedImage + 1;
                      setImageDirection(1);
                      setSelectedImage(newIndex);
                    }}
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} strokeWidth={2} />
                  </motion.button>
                </>
              )}

              {/* Slide Indicators */}
              {productImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {productImages.map((_, idx) => (
                    <motion.button
                      key={idx}
                      onClick={() => {
                        setImageDirection(idx > selectedImage ? 1 : -1);
                        setSelectedImage(idx);
                      }}
                      whileHover={{ scale: 1.2 }}
                      className={`h-1.5 transition-all ${
                        selectedImage === idx 
                          ? 'w-8 bg-white' 
                          : 'w-1.5 bg-white/50 hover:bg-white/70'
                      }`}
                      aria-label={`Go to image ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Horizontal Thumbnails Below */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {productImages.map((img, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => {
                    setImageDirection(idx > selectedImage ? 1 : -1);
                    setSelectedImage(idx);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-shrink-0 w-16 h-20 border overflow-hidden transition-all ${
                    selectedImage === idx ? 'border-foreground' : 'border-foreground/10'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`${product.name} - Image ${idx + 1}`}
                    className="w-full h-full object-cover" 
                    style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                    onError={(e) => {
                      // If image fails to load, hide the thumbnail
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </motion.button>
              ))}
            </div>

            {/* Size guide — below gallery (matches design) */}
            <div
              ref={sizeGuideRef}
              className="border border-border/30 bg-background p-4 shadow-sm dark:border-border/40"
            >
              <div className="mb-3 flex items-center gap-2">
                <Ruler size={18} className="text-[#B4770E]" />
                <h3 className="font-medium tracking-wide">Size Guide</h3>
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
                    <tr className="border-b border-border/20 transition-colors hover:bg-[#B4770E]/5">
                      <td className="px-3 py-2.5 font-medium">XS</td>
                      <td className="px-3 py-2.5 text-center text-foreground/70">32-34</td>
                      <td className="px-3 py-2.5 text-center text-foreground/70">24-26</td>
                      <td className="px-3 py-2.5 text-center text-foreground/70">34-36</td>
                    </tr>
                    <tr className="border-b border-border/20 transition-colors hover:bg-[#B4770E]/5">
                      <td className="px-3 py-2.5 font-medium">S</td>
                      <td className="px-3 py-2.5 text-center text-foreground/70">34-36</td>
                      <td className="px-3 py-2.5 text-center text-foreground/70">26-28</td>
                      <td className="px-3 py-2.5 text-center text-foreground/70">36-38</td>
                    </tr>
                    <tr className="border-b border-border/20 transition-colors hover:bg-[#B4770E]/5">
                      <td className="px-3 py-2.5 font-medium">M</td>
                      <td className="px-3 py-2.5 text-center text-foreground/70">36-38</td>
                      <td className="px-3 py-2.5 text-center text-foreground/70">28-30</td>
                      <td className="px-3 py-2.5 text-center text-foreground/70">38-40</td>
                    </tr>
                    <tr className="border-b border-border/20 transition-colors hover:bg-[#B4770E]/5">
                      <td className="px-3 py-2.5 font-medium">L</td>
                      <td className="px-3 py-2.5 text-center text-foreground/70">38-40</td>
                      <td className="px-3 py-2.5 text-center text-foreground/70">30-32</td>
                      <td className="px-3 py-2.5 text-center text-foreground/70">40-42</td>
                    </tr>
                    <tr className="transition-colors hover:bg-[#B4770E]/5">
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
            </div>
          </div>

          {/* Right - Product Details */}
          <div className="lg:pt-0">
            {/* Brand & Product Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <h2 className="text-xs uppercase text-foreground/60 mb-2 tracking-widest">RLOCO</h2>
              <h1 className="text-2xl md:text-3xl mb-3">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.floor(averageRating) ? 'fill-foreground text-foreground' : 'fill-foreground/20 text-foreground/20'}
                    />
                  ))}
                </div>
                <span className="text-sm text-foreground/60">({ratingCount} reviews)</span>
              </div>
            </motion.div>

            {/* Price */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="py-6 border-t border-b border-foreground/10"
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-2xl md:text-3xl">
                  {formatPrice(product.price, product.price_inr)}
                </span>
                {product.original_price && (
                  <>
                    <span className="text-lg text-foreground/30 line-through">
                      {formatPrice(product.original_price, product.original_price_inr)}
                    </span>
                    <span className="text-sm text-red-600">
                      {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-foreground/50 uppercase tracking-wide">Tax Included • Free Shipping</p>
            </motion.div>

            {/* Available Colors - Slider */}
            {colorVariants.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="py-6 border-b border-foreground/10"
              >
                <span className="text-xs font-medium uppercase tracking-widest text-foreground/60 block mb-4">Available Colors</span>
                <div className="relative overflow-hidden">
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {colorVariants.map((variant) => (
                      <motion.button
                        key={variant.id}
                        onClick={() => navigate(`/product/${variant.id}`)}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative flex-shrink-0 snap-start"
                        title={variant.name}
                      >
                        <div className="w-14 h-16 border border-foreground/10 overflow-hidden hover:border-foreground transition-all">
                          <img 
                            src={variant.images && variant.images.length > 0 ? variant.images[0] : PLACEHOLDER_IMAGE} 
                            alt={variant.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                            }}
                          />
                        </div>
                      </motion.button>
                    ))}
                    {colorVariants.length > 4 && (
                      <div className="w-14 h-16 border border-foreground/10 flex items-center justify-center text-[10px] uppercase tracking-wider bg-foreground/5 flex-shrink-0">
                        +{colorVariants.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="py-6 border-b border-foreground/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-medium uppercase tracking-widest">Size</span>
                  <button
                    type="button"
                    onClick={() => sizeGuideRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                    className="text-xs text-foreground/60 hover:text-foreground transition-colors uppercase underline underline-offset-4"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {product.sizes.map((size) => {
                    const available = product.stock?.[size] ?? 0;
                    const outOfStock = available === 0;
                    const availabilityText = outOfStock
                      ? 'Out of stock'
                      : available <= 5
                        ? `${available} left`
                        : 'In stock';
                    return (
                      <motion.button
                        key={size}
                        type="button"
                        onClick={() => !outOfStock && setSelectedSize(size)}
                        whileHover={!outOfStock ? { scale: 1.05 } : undefined}
                        whileTap={!outOfStock ? { scale: 0.95 } : undefined}
                        disabled={outOfStock}
                        className={`min-h-14 py-2 px-1 border text-sm transition-all flex flex-col items-center justify-center gap-0.5 ${
                          outOfStock
                            ? 'border-foreground/10 bg-foreground/5 text-foreground/40 cursor-not-allowed'
                            : selectedSize === size
                              ? 'border-foreground bg-foreground text-background'
                              : 'border-foreground/20 hover:border-foreground'
                        }`}
                      >
                        <span>{size}</span>
                        <span className={`text-[10px] uppercase tracking-wider ${outOfStock ? 'text-foreground/50' : 'text-inherit opacity-80'}`}>
                          {availabilityText}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Quantity Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="py-6 border-b border-foreground/10"
            >
              <span className="text-xs font-medium uppercase tracking-widest block mb-4">Quantity</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-foreground/20">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-foreground/5 transition-colors"
                  >
                    <Minus size={16} />
                  </motion.button>
                  <span className="w-16 text-center font-medium">{quantity}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-foreground/5 transition-colors"
                  >
                    <Plus size={16} />
                  </motion.button>
                </div>
                <span className="text-xs text-foreground/50 uppercase tracking-wide">Max 10 per order</span>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="py-6"
            >
              <div className="flex flex-col gap-3">
                {isInCart ? (
                  <motion.button
                    onClick={() => navigate('/cart')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-14 bg-foreground text-background font-medium hover:bg-foreground/90 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={18} />
                    Go to Bag
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleAddToCart}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-14 bg-foreground text-background font-medium hover:bg-foreground/90 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={18} />
                    Add to Bag
                  </motion.button>
                )}
                <motion.button
                  onClick={handleToggleWishlist}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full h-12 border transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs ${
                    isWishlisted
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-foreground/20 hover:border-foreground'
                  }`}
                >
                  <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
                  {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </motion.button>
              </div>
            </motion.div>

            {/* Product Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="py-6 border-t border-foreground/10"
            >
              <div className="mb-5">
                <span className="text-xs font-medium uppercase tracking-widest">Why Choose This</span>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 border border-foreground/10 flex items-center justify-center flex-shrink-0">
                    <Award size={16} className="text-foreground/60" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide mb-1">Premium Quality</p>
                    <p className="text-xs text-foreground/50">Finest materials</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 border border-foreground/10 flex items-center justify-center flex-shrink-0">
                    <Shield size={16} className="text-foreground/60" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide mb-1">Authentic</p>
                    <p className="text-xs text-foreground/50">100% genuine</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 border border-foreground/10 flex items-center justify-center flex-shrink-0">
                    <Package size={16} className="text-foreground/60" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide mb-1">Fast Delivery</p>
                    <p className="text-xs text-foreground/50">2-5 business days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 border border-foreground/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={16} className="text-foreground/60" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide mb-1">Limited Edition</p>
                    <p className="text-xs text-foreground/50">Exclusive design</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Delivery Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="py-6 border-t border-foreground/10"
            >
              <div className="mb-4">
                <span className="text-xs font-medium uppercase tracking-widest">Check Delivery</span>
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
                  disabled={pincodeLoading}
                  className="px-6 h-11 border border-foreground text-foreground font-medium text-xs hover:bg-foreground hover:text-background transition-all uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {pincodeLoading ? '...' : 'Check'}
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

            {/* Product Details Accordion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="pt-5 md:pt-6 border-t border-foreground/10"
            >
              {/* Product Details */}
              <div className="border border-foreground/10 bg-background mb-3">
                <button
                  onClick={() => toggleSection('details')}
                  className="w-full px-4 md:px-5 py-4 md:py-5 flex items-center justify-between hover:bg-foreground/5 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Info size={18} className="text-foreground/60 group-hover:text-foreground transition-colors" />
                    <span className="text-sm font-medium">Product Details</span>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedSection === 'details' ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-foreground/60 group-hover:text-foreground transition-colors"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedSection === 'details' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-foreground/10"
                    >
                      <div className="px-4 md:px-5 py-4 text-sm text-foreground/60 space-y-4 tracking-wide leading-relaxed">{/* Content stays same */}
                        <p>{product.description || 'Crafted with meticulous attention to detail, this piece embodies timeless elegance and modern sophistication.'}</p>
                        <div className="space-y-2 pt-2">
                          <p><span className="text-foreground uppercase text-xs tracking-wider">Category:</span> <span className="capitalize ml-2">{product.category}</span></p>
                          <p><span className="text-foreground uppercase text-xs tracking-wider">Material:</span> <span className="ml-2">Premium Cotton Blend</span></p>
                          <p><span className="text-foreground uppercase text-xs tracking-wider">Fit:</span> <span className="ml-2">Regular</span></p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Size & Fit */}
              <div className="border border-foreground/10 bg-background mb-3">
                <button
                  onClick={() => toggleSection('size')}
                  className="w-full px-4 md:px-5 py-4 md:py-5 flex items-center justify-between hover:bg-foreground/5 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Ruler size={18} className="text-foreground/60 group-hover:text-foreground transition-colors" />
                    <span className="text-sm font-medium">Size & Fit</span>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedSection === 'size' ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-foreground/60 group-hover:text-foreground transition-colors"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedSection === 'size' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-foreground/10"
                    >
                      <div className="px-4 md:px-5 py-4 text-sm text-foreground/60 space-y-2 tracking-wide">
                        <p>• Model height 5'8", wearing size S</p>
                        <p>• Regular fit</p>
                        <p>• True to size</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Material & Care */}
              <div className="border border-foreground/10 bg-background mb-3">
                <button
                  onClick={() => toggleSection('care')}
                  className="w-full px-4 md:px-5 py-4 md:py-5 flex items-center justify-between hover:bg-foreground/5 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Shirt size={18} className="text-foreground/60 group-hover:text-foreground transition-colors" />
                    <span className="text-sm font-medium">Material & Care</span>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedSection === 'care' ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-foreground/60 group-hover:text-foreground transition-colors"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedSection === 'care' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-foreground/10"
                    >
                      <div className="px-4 md:px-5 py-4 text-sm text-foreground/60 space-y-2 tracking-wide">
                        <p>• 100% Premium Cotton</p>
                        <p>• Machine wash cold</p>
                        <p>• Do not bleach</p>
                        <p>• Tumble dry low</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Ratings & Reviews */}
              <div className="border border-foreground/10 bg-background mb-3">
                <button
                  onClick={() => toggleSection('reviews')}
                  className="w-full px-4 md:px-5 py-4 md:py-5 flex items-center justify-between hover:bg-foreground/5 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle size={18} className="text-foreground/60 group-hover:text-foreground transition-colors" />
                    <span className="text-sm font-medium">Reviews ({ratingCount})</span>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedSection === 'reviews' ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-foreground/60 group-hover:text-foreground transition-colors"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedSection === 'reviews' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-foreground/10"
                    >
                      <div className="px-4 md:px-5 py-4">{/* Reviews content stays same */}
                        {/* Rating Summary */}
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-foreground/5">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{averageRating}</span>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={i < Math.floor(averageRating) ? 'fill-foreground text-foreground' : 'fill-foreground/20 text-foreground/20'}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-foreground/50 tracking-wide">{ratingCount} reviews</span>
                        </div>

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
                                            } catch (error: any) {
                                              console.error('Failed to update review:', error);
                                              toast.error(error.message || 'Failed to update review');
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
                                                  } catch (error: any) {
                                                    console.error('Failed to delete review:', error);
                                                    toast.error(error.message || 'Failed to delete review');
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
                                        {isAuthenticated && (
                                          <button
                                            onClick={async () => {
                                              if (markingHelpful.has(review.id)) return;
                                              
                                              setMarkingHelpful(new Set([...markingHelpful, review.id]));
                                              try {
                                                await reviewService.markHelpful(id!, review.id);
                                                toast.success('Thank you for your feedback!');
                                              } catch (error: any) {
                                                console.error('Failed to mark review as helpful:', error);
                                                const newSet = new Set(markingHelpful);
                                                newSet.delete(review.id);
                                                setMarkingHelpful(newSet);
                                                toast.error('Failed to mark review as helpful');
                                              }
                                            }}
                                            disabled={markingHelpful.has(review.id)}
                                            className="flex items-center gap-1 px-2 py-1 text-xs text-foreground/60 hover:text-foreground hover:bg-foreground/5 rounded transition-colors disabled:opacity-50"
                                          >
                                            <ThumbsUp size={12} className={markingHelpful.has(review.id) ? 'fill-foreground' : ''} />
                                            Helpful
                                          </button>
                                        )}
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
                                      } catch (error: any) {
                                        console.error('Failed to submit review:', error);
                                        toast.error(error.message || 'Failed to submit review. Please try again.');
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Shipping & Returns */}
              <div className="border border-foreground/10 bg-background mb-3">
                <button
                  onClick={() => toggleSection('shipping')}
                  className="w-full px-4 md:px-5 py-4 md:py-5 flex items-center justify-between hover:bg-foreground/5 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Truck size={18} className="text-foreground/60 group-hover:text-foreground transition-colors" />
                    <span className="text-sm font-medium">Shipping & Returns</span>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedSection === 'shipping' ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-foreground/60 group-hover:text-foreground transition-colors"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedSection === 'shipping' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-foreground/10"
                    >
                      <div className="px-4 md:px-5 py-4 text-sm text-foreground/60 space-y-4 tracking-wide">{/* Content stays same */}
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sustainability */}
              <div className="border border-foreground/10 bg-background mb-3">
                <button
                  onClick={() => toggleSection('sustainability')}
                  className="w-full px-4 md:px-5 py-4 md:py-5 flex items-center justify-between hover:bg-foreground/5 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Leaf size={18} className="text-foreground/60 group-hover:text-foreground transition-colors" />
                    <span className="text-sm font-medium">Sustainability</span>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedSection === 'sustainability' ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-foreground/60 group-hover:text-foreground transition-colors"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedSection === 'sustainability' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-foreground/10"
                    >
                      <div className="px-4 md:px-5 py-4 text-sm text-foreground/60 space-y-3 tracking-wide leading-relaxed">{/* Content stays same */}
                        <div className="flex gap-3 items-start">
                          <Leaf size={16} className="text-foreground/60 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-foreground mb-1 text-xs uppercase tracking-wider">Eco-Friendly Materials</p>
                            <p>Crafted from responsibly sourced and sustainable materials with minimal environmental impact.</p>
                          </div>
                        </div>
                        <div className="flex gap-3 items-start">
                          <Users size={16} className="text-foreground/60 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-foreground mb-1 text-xs uppercase tracking-wider">Ethical Production</p>
                            <p>Produced in fair-trade certified facilities with ethical labor practices and safe working conditions.</p>
                          </div>
                        </div>
                        <div className="flex gap-3 items-start">
                          <Package size={16} className="text-foreground/60 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-foreground mb-1 text-xs uppercase tracking-wider">Recyclable Packaging</p>
                            <p>All packaging materials are 100% recyclable and made from post-consumer recycled content.</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Style Tips */}
              <div className="border border-foreground/10 bg-background mb-3">
                <button
                  onClick={() => toggleSection('styling')}
                  className="w-full px-4 md:px-5 py-4 md:py-5 flex items-center justify-between hover:bg-foreground/5 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles size={18} className="text-foreground/60 group-hover:text-foreground transition-colors" />
                    <span className="text-sm font-medium">Style Tips</span>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedSection === 'styling' ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-foreground/60 group-hover:text-foreground transition-colors"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedSection === 'styling' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-foreground/10"
                    >
                      <div className="px-4 md:px-5 py-4 text-sm text-foreground/60 space-y-3 tracking-wide leading-relaxed">{/* Content stays same */}
                        <p><span className="text-foreground">Casual Look:</span> Pair with your favorite denim and sneakers for an effortlessly chic everyday style.</p>
                        <p><span className="text-foreground">Office Ready:</span> Style with tailored trousers and loafers for a polished professional appearance.</p>
                        <p><span className="text-foreground">Evening Elegance:</span> Dress up with statement jewelry and heels for sophisticated evening occasions.</p>
                        <p><span className="text-foreground">Weekend Vibes:</span> Layer over a basic tee with joggers for comfortable weekend relaxation.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* FAQs */}
              <div className="border border-foreground/10 bg-background">
                <button
                  onClick={() => toggleSection('faq')}
                  className="w-full px-4 md:px-5 py-4 md:py-5 flex items-center justify-between hover:bg-foreground/5 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle size={18} className="text-foreground/60 group-hover:text-foreground transition-colors" />
                    <span className="text-sm font-medium">FAQs</span>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedSection === 'faq' ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-foreground/60 group-hover:text-foreground transition-colors"
                  >
                    <ChevronDown size={18} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {expandedSection === 'faq' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-foreground/10"
                    >
                      <div className="px-4 md:px-5 py-4 text-sm text-foreground/60 space-y-4 tracking-wide">
                        <div>
                          <p className="text-foreground mb-2 text-xs uppercase tracking-wider flex items-center gap-2">
                            <MessageCircle size={12} />
                            How do I know my size?
                          </p>
                          <p>Refer to our detailed size guide above. We recommend measuring your current favorite piece and comparing it to our measurements.</p>
                        </div>
                        <div>
                          <p className="text-foreground mb-2 text-xs uppercase tracking-wider flex items-center gap-2">
                            <MessageCircle size={12} />
                            Can I exchange for a different size?
                          </p>
                          <p>Yes! We offer free exchanges within 30 days. Simply initiate a return and place a new order for your preferred size.</p>
                        </div>
                        <div>
                          <p className="text-foreground mb-2 text-xs uppercase tracking-wider flex items-center gap-2">
                            <MessageCircle size={12} />
                            Is this item available in other colors?
                          </p>
                          <p>All available color options are displayed above. Sign up for notifications to be alerted when new colors become available.</p>
                        </div>
                        <div>
                          <p className="text-foreground mb-2 text-xs uppercase tracking-wider flex items-center gap-2">
                            <MessageCircle size={12} />
                            How do I care for this product?
                          </p>
                          <p>Follow the care instructions on the garment label. Generally, we recommend gentle washing and avoiding harsh chemicals to maintain quality.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* You May Also Like */}
      {relatedProducts.length > 0 && (
          <ProductRecommendationSection
            title="You May Also Like"
            subtitle="Handpicked recommendations"
            products={relatedProducts}
            variant="featured"
            icon="heart"
          />
        )}

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <ProductRecommendationSection
            title="Similar Products"
            subtitle="Explore similar styles"
            products={similarProducts}
            variant="minimal"
            icon="sparkles"
          />
        )}

        {/* Trending Products */}
        {trendingProducts.length > 0 && (
          <ProductRecommendationSection
            title="Trending Products"
            subtitle="Most loved by our customers"
            products={trendingProducts}
            variant="bold"
            icon="star"
          />
        )}

        {/* Complete the Look */}
        {completeTheLook.length > 0 && (
          <CompleteTheLookSection
            currentProduct={{
              id: String(product.id),
              name: product.name,
              price: product.price,
              originalPrice: product.original_price,
              image: product.images && product.images.length > 0 ? product.images[0] : PLACEHOLDER_IMAGE,
              category: product.category,
              priceINR: product.price_inr,
              originalPriceINR: product.original_price_inr,
            }}
            products={completeTheLook}
          />
        )}

      <Footer />
    </div>
  );
}