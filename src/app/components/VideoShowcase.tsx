import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Maximize2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'sonner';
import { productService } from '../services/productService';
import { Product } from '../types/api';
import { useCurrency } from '../context/CurrencyContext';

export function VideoShowcase() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showcaseProducts, setShowcaseProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await productService.getFeatured(5);
        const productList = products || [];
        setShowcaseProducts(productList);
        if (productList.length > 0) {
          setCurrentSlide(0);
        }
      } catch (error) {
        console.error('Failed to fetch featured products:', error);
        setShowcaseProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Auto-slide products every 6 seconds
  useEffect(() => {
    if (showcaseProducts.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % showcaseProducts.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [showcaseProducts.length]);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: parseInt(product.id) || product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      size: product.sizes[0] || 'M',
    });
    toast.success(`${product.name} added to bag`);
  };

  const handleWishlistToggle = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      category: product.category || '',
      gender: product.gender || 'women',
    });
    toast.success(`${product.name} added to wishlist`);
  };

  if (loading) {
    return (
      <section className="relative w-full h-screen bg-black overflow-hidden snap-start snap-always flex items-center justify-center">
        <div className="text-white">Loading showcase...</div>
      </section>
    );
  }

  if (showcaseProducts.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full h-screen bg-black overflow-hidden snap-start snap-always">
      {/* Background Image - Synced with Current Product */}
      {showcaseProducts[currentSlide] && (
        <div className="absolute inset-0">
          <motion.img
            key={currentSlide}
            src={showcaseProducts[currentSlide].images?.[0] || ''}
            alt={showcaseProducts[currentSlide].name}
            className="w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40"></div>
        </div>
      )}

      {/* Product Cards - Bottom Center - Sliding Carousel */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-6xl overflow-hidden">
        <motion.div
          className="flex gap-4 px-4"
          animate={{
            x: `-${currentSlide * (280 + 16)}px`,
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut"
          }}
        >
          {showcaseProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white shadow-lg overflow-hidden w-[280px] flex-shrink-0 flex group hover:shadow-xl transition-shadow duration-300"
            >
              {/* Product Image */}
              <div 
                className="w-20 h-28 flex-shrink-0 cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img
                  src={product.images?.[0] || ''}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 p-3 flex flex-col justify-between">
                <div>
                  <h3 
                    className="text-sm font-medium text-gray-900 mb-1.5 cursor-pointer hover:text-gray-600 transition-colors leading-tight"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-base font-semibold text-gray-900">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>

              {/* Action Icons */}
              <div className="flex flex-col items-center justify-center gap-3 px-3 border-l border-gray-100">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleAddToCart(product, e)}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  title="Add to bag"
                >
                  <ShoppingBag size={18} strokeWidth={1.5} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  title="View details"
                >
                  <Maximize2 size={18} strokeWidth={1.5} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Slide Indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {showcaseProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white w-6' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}