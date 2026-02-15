import { motion } from 'motion/react';
import { ShoppingCart, Heart, Eye, ArrowRight } from 'lucide-react';
import { Product } from '../types/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { toast } from 'sonner';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeaturedProducts } from '../hooks/useProducts';
import { useSiteConfig } from '../context/SiteConfigContext';

export function Featured() {
  const { config } = useSiteConfig();

  // Don't render if featured products section is disabled
  if (!config.homepage.sections.featuredProducts) {
    return null;
  }
  const { products: featuredProducts, loading, error } = useFeaturedProducts(8);
  const { addToCart, items } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const handleAddToCart = (product: Product) => {
    // Check if product is already in cart
    const isInCart = items.some(item => String(item.id) === String(product.id));
    
    if (isInCart) {
      // Navigate to cart if already added
      navigate('/cart');
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      size: product.sizes[0] || 'M',
    });
    
    toast.success('Added to cart');
  };

  const toggleWishlist = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWishlist(String(product.id))) {
      removeFromWishlist(product.id);
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

  return (
    <section id="featured" className="py-16 md:py-24 bg-accent/20 relative" style={{ position: 'relative' }}>
      <div className="w-full" style={{ position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '3rem' }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-0.5 bg-foreground mx-auto mb-6"
          />
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-3 tracking-tight">
            Featured Collection
          </h2>
          <p className="text-lg md:text-xl text-foreground/70">
            Handpicked pieces for the season
          </p>
        </motion.div>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">Error loading featured products: {error}</p>
          </div>
        )}

        {!loading && !error && (!featuredProducts || featuredProducts.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-600">No featured products available</p>
          </div>
        )}

        {!loading && !error && featuredProducts && featuredProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12 px-2 md:px-4">
            {featuredProducts.slice(0, 8).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
              whileHover={{ scale: 1.05, rotateY: 5, rotateX: -2 }}
              style={{ perspective: 1000 }}
              className="group"
            >
              <div 
                className="relative aspect-[3/4] overflow-hidden mb-3 md:mb-4 bg-accent rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-500 cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <motion.img
                  src={product.images[0] || ''}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Wishlist Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => toggleWishlist(product, e)}
                  className={`absolute top-3 right-3 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all shadow-lg backdrop-blur-sm ${
                    isInWishlist(String(product.id))
                      ? 'bg-red-500 text-white'
                      : 'bg-white/90 text-foreground hover:bg-white'
                  }`}
                >
                  <Heart size={18} className="md:w-5 md:h-5" fill={isInWishlist(String(product.id)) ? 'currentColor' : 'none'} />
                </motion.button>

                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="text-xs md:text-sm text-foreground/50 mb-1 md:mb-2 tracking-wider uppercase">
                {product.category}
              </div>
              <h3 
                className="text-sm md:text-base mb-2 md:mb-3 group-hover:text-foreground/70 transition-colors line-clamp-1 cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {product.name}
              </h3>
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <span className="text-base md:text-lg">{formatPrice(product.price)}</span>
                {product.original_price && (
                  <span className="text-xs md:text-sm text-foreground/40 line-through">
                    {formatPrice(product.original_price)}
                  </span>
                )}
              </div>

              <motion.button
                onClick={() => handleAddToCart(product)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-2.5 md:py-3 text-sm md:text-base transition-all duration-300 relative overflow-hidden group rounded-lg ${
                  items.some(item => String(item.id) === String(product.id))
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                <motion.div
                  className="absolute inset-0 bg-foreground/10"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">
                  {items.some(item => String(item.id) === String(product.id)) ? 'Go to Cart' : 'Add to Bag'}
                </span>
              </motion.button>
            </motion.div>
            ))}
          </div>
        )}

        {!loading && !error && (
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.a
            href="#products"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 text-sm md:text-base border border-border hover:bg-accent transition-colors group rounded-lg"
          >
            View Full Collection
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </motion.a>
        </motion.div>
        )}
      </div>
    </section>
  );
}