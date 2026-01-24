import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, Star, ShoppingCart, Truck, Shield, RotateCcw, Ruler, ChevronRight, Minus, Plus, User, Package, Sparkles, TrendingUp } from 'lucide-react';
import { Product } from '../types/product';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';

interface ProductDetailProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetail({ product, isOpen, onClose }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showVideo, setShowVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'shipping' | 'reviews'>('description');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const { addToCart, items } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  // Fetch products for recommendations
  useEffect(() => {
    if (isOpen) {
      const fetchProducts = async () => {
        try {
          const response = await productService.list({ limit: 200 });
          setAllProducts(response.products || []);
        } catch (error) {
          console.error('Failed to fetch products:', error);
          setAllProducts([]);
        }
      };
      fetchProducts();
    }
  }, [isOpen]);

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);
  
  // Check if product is already in cart
  const isInCart = items.some(item => item.id === product.id);

  const handleAddToCart = () => {
    if (isInCart) {
      navigate('/cart');
      onClose();
      return;
    }
    
    const size = selectedSize || product.sizes[0];
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.image || '',
        size,
      });
    }
    
    toast.success(`Added ${quantity} item(s) to cart`);
  };

  const handleToggleWishlist = () => {
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
      });
      toast.success('Added to wishlist');
    }
  };

  const getColorValue = (colorName: string): string => {
    const colorMap: Record<string, string> = {
      'Black': '#000000', 'White': '#FFFFFF', 'Navy': '#001F3F', 'Charcoal': '#36454F',
      'Gray': '#808080', 'Grey': '#808080', 'Blue': '#0074D9', 'Light Blue': '#87CEEB',
      'Royal Blue': '#4169E1', 'Red': '#FF4136', 'Rose': '#FF69B4', 'Burgundy': '#800020',
      'Wine': '#722F37', 'Green': '#2ECC40', 'Sage': '#9CAF88', 'Olive': '#808000',
      'Forest': '#228B22', 'Beige': '#F5F5DC', 'Cream': '#FFFDD0', 'Ivory': '#FFFFF0',
      'Camel': '#C19A6B', 'Tan': '#D2B48C', 'Sand': '#C2B280', 'Brown': '#8B4513',
      'Chocolate': '#D2691E', 'Pink': '#FF69B4', 'Blush': '#FFC0CB', 'Yellow': '#FFDC00',
      'Gold': '#FFD700', 'Silver': '#C0C0C0', 'Orange': '#FF851B', 'Purple': '#B10DC9',
      'Lavender': '#E6E6FA', 'Mint': '#98FF98', 'Coral': '#FF7F50',
    };
    return colorMap[colorName] || '#CCCCCC';
  };

  const relatedProducts = allProducts
    .filter(p => String(p.id) !== String(product.id) && p.category === product.category)
    .slice(0, 4);

  // Get similar products (same gender and category)
  const similarProducts = allProducts
    .filter(p => String(p.id) !== String(product.id) && p.gender === product.gender && p.category !== product.category)
    .slice(0, 4);

  // Get trending products (high rating products)
  const trendingProducts = allProducts
    .filter(p => String(p.id) !== String(product.id) && p.rating >= 4.5)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  // Get products often bought together (same price range)
  const completeTheLook = allProducts
    .filter(p => 
      String(p.id) !== String(product.id) && 
      Math.abs(p.price - product.price) < 50 &&
      p.category !== product.category
    )
    .slice(0, 3);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(60px)',
              WebkitBackdropFilter: 'blur(60px)',
            }}
            className="fixed inset-0 z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-7xl h-[90vh] bg-background rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground tracking-wider uppercase">
                    {product.category}
                  </span>
                  {(product.new_arrival || product.newArrival) && (
                    <span className="px-2 py-1 bg-primary text-primary-foreground text-xs tracking-wider uppercase">
                      New
                    </span>
                  )}
                  {(product.on_sale || product.onSale) && (
                    <span className="px-2 py-1 bg-red-600 text-white text-xs tracking-wider uppercase">
                      Sale
                    </span>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-8 p-6">
                  {/* Left: Image Gallery */}
                  <div className="space-y-4">
                    {/* Main Image */}
                    <div className="relative aspect-[3/4] bg-muted rounded-xl overflow-hidden">
                      {showVideo && (product.video_url || product.videoURL) ? (
                        <video
                          src={product.video_url || product.videoURL || ''}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                          onError={() => setVideoError(true)}
                        />
                      ) : (
                        <motion.img
                          key={selectedImage}
                          src={product.images[selectedImage]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      {videoError && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <p className="text-white text-sm">Video failed to load</p>
                        </div>
                      )}
                    </div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-4 gap-3">
                      {product.images.map((image, index) => (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedImage(index);
                            setShowVideo(false);
                          }}
                          className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === index && !showVideo
                              ? 'border-primary shadow-lg'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <img src={image} alt="" className="w-full h-full object-cover" style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }} />
                        </motion.button>
                      ))}
                      {(product.video_url || product.videoURL) && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowVideo(true)}
                          className={`aspect-square rounded-lg overflow-hidden border-2 transition-all relative ${
                            showVideo
                              ? 'border-primary shadow-lg'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <img src={product.images?.[0] || product.image || ''} alt="" className="w-full h-full object-cover" style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }} />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Right: Product Info */}
                  <div className="space-y-6">
                    {/* Title & Rating */}
                    <div>
                      <h1 className="text-4xl mb-3">{product.name}</h1>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={18}
                              fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                              className="text-foreground"
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {product.rating} ({product.reviews} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">${product.price}</span>
                      {(product.original_price || product.originalPrice) && (
                        <>
                          <span className="text-xl text-muted-foreground line-through">
                            ${product.original_price || product.originalPrice}
                          </span>
                          <span className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full">
                            Save ${(product.original_price || product.originalPrice || 0) - product.price}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Color Selection */}
                    {product.colors.length > 0 && (
                      <div>
                        <label className="block text-sm uppercase tracking-wider mb-3">
                          Color: <span className="text-primary font-semibold">{selectedColor || product.colors[0]}</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {product.colors.map((color) => {
                            const isSelected = selectedColor === color || (!selectedColor && color === product.colors[0]);
                            const colorValue = getColorValue(color);
                            return (
                              <motion.button
                                key={color}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedColor(color)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                                  isSelected
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50'
                                }`}
                              >
                                <div
                                  className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                                  style={{ backgroundColor: colorValue }}
                                />
                                <span className="text-sm">{color}</span>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Size Selection */}
                    {product.sizes[0] !== 'One Size' && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm uppercase tracking-wider">
                            Size: <span className="text-primary font-semibold">{selectedSize || 'Please Select'}</span>
                          </label>
                          <button className="text-sm text-primary hover:underline flex items-center gap-1">
                            <Ruler size={14} />
                            Size Guide
                          </button>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                          {product.sizes.map((size) => {
                            const isSelected = selectedSize === size;
                            return (
                              <motion.button
                                key={size}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedSize(size)}
                                className={`h-12 rounded-lg border-2 transition-all font-semibold ${
                                  isSelected
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border hover:border-primary/50'
                                }`}
                              >
                                {size}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Quantity */}
                    <div>
                      <label className="block text-sm uppercase tracking-wider mb-3">Quantity</label>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border-2 border-border rounded-lg">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Minus size={18} />
                          </motion.button>
                          <span className="w-16 text-center font-semibold">{quantity}</span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Plus size={18} />
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddToCart}
                        className={`flex-1 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg flex items-center justify-center gap-2 ${
                          isInCart
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-primary text-primary-foreground hover:bg-primary/90'
                        }`}
                      >
                        <ShoppingCart size={22} />
                        {isInCart ? 'Go to Cart' : 'Add to Bag'}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleToggleWishlist}
                        className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center transition-all shadow-lg ${
                          isWishlisted
                            ? 'border-red-500 bg-red-500 text-white'
                            : 'border-border hover:border-primary'
                        }`}
                      >
                        <Heart size={24} fill={isWishlisted ? 'currentColor' : 'none'} />
                      </motion.button>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-3 gap-3 py-6 border-y border-border">
                      <div className="text-center">
                        <Truck className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <p className="text-xs font-semibold">Free Shipping</p>
                        <p className="text-xs text-muted-foreground">Over $200</p>
                      </div>
                      <div className="text-center">
                        <RotateCcw className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <p className="text-xs font-semibold">Easy Returns</p>
                        <p className="text-xs text-muted-foreground">30 Days</p>
                      </div>
                      <div className="text-center">
                        <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <p className="text-xs font-semibold">Secure Payment</p>
                        <p className="text-xs text-muted-foreground">100% Safe</p>
                      </div>
                    </div>

                    {/* Tabs */}
                    <div>
                      <div className="flex gap-6 border-b border-border mb-6">
                        {[
                          { id: 'description', label: 'Description' },
                          { id: 'details', label: 'Details' },
                          { id: 'shipping', label: 'Shipping' },
                          { id: 'reviews', label: 'Reviews' }
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`pb-3 text-sm font-semibold tracking-wider uppercase transition-all relative ${
                              activeTab === tab.id
                                ? 'text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {tab.label}
                            {activeTab === tab.id && (
                              <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                              />
                            )}
                          </button>
                        ))}
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeTab}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {activeTab === 'description' && (
                            <div className="space-y-4">
                              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                              <div>
                                <h4 className="font-semibold mb-2">Material</h4>
                                <p className="text-muted-foreground">{product.material}</p>
                              </div>
                            </div>
                          )}

                          {activeTab === 'details' && (
                            <ul className="space-y-3">
                              {product.details.map((detail, index) => (
                                <li key={index} className="flex items-start gap-3">
                                  <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                  <span className="text-muted-foreground">{detail}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {activeTab === 'shipping' && (
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold mb-2">Delivery Options</h4>
                                <ul className="space-y-2 text-muted-foreground">
                                  <li className="flex items-center gap-2">
                                    <ChevronRight size={16} className="text-primary" />
                                    Standard Shipping: 5-7 business days ($9.99)
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <ChevronRight size={16} className="text-primary" />
                                    Express Shipping: 2-3 business days ($19.99)
                                  </li>
                                  <li className="flex items-center gap-2">
                                    <ChevronRight size={16} className="text-primary" />
                                    Free Shipping on orders over $200
                                  </li>
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-semibold mb-2">Returns & Exchanges</h4>
                                <p className="text-muted-foreground">
                                  We offer free returns within 30 days of purchase. Items must be in original condition with tags attached.
                                </p>
                              </div>
                            </div>
                          )}

                          {activeTab === 'reviews' && (
                            <div className="space-y-6">
                              <div className="flex items-center gap-6 pb-6 border-b border-border">
                                <div className="text-center">
                                  <div className="text-5xl font-bold mb-1">{product.rating}</div>
                                  <div className="flex items-center gap-1 mb-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        size={16}
                                        fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                                        className="text-foreground"
                                      />
                                    ))}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{product.reviews} reviews</p>
                                </div>
                                <div className="flex-1 space-y-2">
                                  {[5, 4, 3, 2, 1].map((stars) => (
                                    <div key={stars} className="flex items-center gap-3">
                                      <span className="text-sm w-12">{stars} stars</span>
                                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-primary rounded-full"
                                          style={{ width: stars === 5 ? '75%' : stars === 4 ? '20%' : '5%' }}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {[].map((review: any) => (
                                <div key={review.id} className="border-b border-border pb-6 last:border-0">
                                  <div className="flex items-start gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                      <User size={20} className="text-primary" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold">{review.name}</span>
                                        <span className="text-sm text-muted-foreground">{review.date}</span>
                                      </div>
                                      <div className="flex items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                          <Star
                                            key={i}
                                            size={14}
                                            fill={i < review.rating ? 'currentColor' : 'none'}
                                            className="text-foreground"
                                          />
                                        ))}
                                      </div>
                                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                  <div className="px-6 pb-6">
                    <h3 className="text-2xl mb-6">You May Also Like</h3>
                    <div className="grid grid-cols-4 gap-4">
                      {relatedProducts.map((relatedProduct) => (
                        <motion.div
                          key={relatedProduct.id}
                          whileHover={{ y: -4 }}
                          className="cursor-pointer"
                          onClick={() => {
                            // Reset states and load new product
                            setSelectedImage(0);
                            setSelectedSize('');
                            setSelectedColor('');
                            setQuantity(1);
                            setShowVideo(false);
                            setActiveTab('description');
                          }}
                        >
                          <div className="aspect-[3/4] rounded-lg overflow-hidden mb-3 bg-muted">
                            <img
                              src={relatedProduct.images?.[0] || relatedProduct.image || ''}
                              alt={relatedProduct.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-sm font-semibold mb-1 line-clamp-2">{relatedProduct.name}</p>
                          <p className="text-sm text-muted-foreground">${relatedProduct.price}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Similar Products */}
                {similarProducts.length > 0 && (
                  <div className="px-6 pb-6">
                    <h3 className="text-2xl mb-6">Similar Products</h3>
                    <div className="grid grid-cols-4 gap-4">
                      {similarProducts.map((similarProduct) => (
                        <motion.div
                          key={similarProduct.id}
                          whileHover={{ y: -4 }}
                          className="cursor-pointer"
                          onClick={() => {
                            // Reset states and load new product
                            setSelectedImage(0);
                            setSelectedSize('');
                            setSelectedColor('');
                            setQuantity(1);
                            setShowVideo(false);
                            setActiveTab('description');
                          }}
                        >
                          <div className="aspect-[3/4] rounded-lg overflow-hidden mb-3 bg-muted">
                            <img
                              src={similarProduct.images?.[0] || similarProduct.image || ''}
                              alt={similarProduct.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-sm font-semibold mb-1 line-clamp-2">{similarProduct.name}</p>
                          <p className="text-sm text-muted-foreground">${similarProduct.price}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Products */}
                {trendingProducts.length > 0 && (
                  <div className="px-6 pb-6">
                    <h3 className="text-2xl mb-6">Trending Products</h3>
                    <div className="grid grid-cols-4 gap-4">
                      {trendingProducts.map((trendingProduct) => (
                        <motion.div
                          key={trendingProduct.id}
                          whileHover={{ y: -4 }}
                          className="cursor-pointer"
                          onClick={() => {
                            // Reset states and load new product
                            setSelectedImage(0);
                            setSelectedSize('');
                            setSelectedColor('');
                            setQuantity(1);
                            setShowVideo(false);
                            setActiveTab('description');
                          }}
                        >
                          <div className="aspect-[3/4] rounded-lg overflow-hidden mb-3 bg-muted">
                            <img
                              src={trendingProduct.images?.[0] || trendingProduct.image || ''}
                              alt={trendingProduct.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-sm font-semibold mb-1 line-clamp-2">{trendingProduct.name}</p>
                          <p className="text-sm text-muted-foreground">${trendingProduct.price}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Complete the Look */}
                {completeTheLook.length > 0 && (
                  <div className="px-6 pb-6">
                    <h3 className="text-2xl mb-6">Complete the Look</h3>
                    <div className="grid grid-cols-4 gap-4">
                      {completeTheLook.map((lookProduct) => (
                        <motion.div
                          key={lookProduct.id}
                          whileHover={{ y: -4 }}
                          className="cursor-pointer"
                          onClick={() => {
                            // Reset states and load new product
                            setSelectedImage(0);
                            setSelectedSize('');
                            setSelectedColor('');
                            setQuantity(1);
                            setShowVideo(false);
                            setActiveTab('description');
                          }}
                        >
                          <div className="aspect-[3/4] rounded-lg overflow-hidden mb-3 bg-muted">
                            <img
                              src={lookProduct.images?.[0] || lookProduct.image || ''}
                              alt={lookProduct.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-sm font-semibold mb-1 line-clamp-2">{lookProduct.name}</p>
                          <p className="text-sm text-muted-foreground">${lookProduct.price}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}