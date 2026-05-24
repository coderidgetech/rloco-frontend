import { motion } from 'motion/react';
import { ShoppingBag, Check, Heart, ArrowRight } from 'lucide-react';
import { Product } from '../types/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { toast } from 'sonner';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeaturedProducts } from '../hooks/useProducts';
import { useSiteConfig } from '../context/SiteConfigContext';
import { AddToBagPopover } from './AddToBagPopover';
import { colorMap } from '../utils/filterConfig';

export function Featured() {
  const { config } = useSiteConfig();
  const [addToBagProduct, setAddToBagProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Don't render if featured products section is disabled
  if (!config.homepage.sections.featuredProducts) {
    return null;
  }
  const { products: featuredProducts, loading, error } = useFeaturedProducts(4);
  const { addToCart, items } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  const openAddToBagDialog = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const isInCart = items.some(item => String(item.id) === String(product.id));
    if (isInCart) {
      navigate('/cart');
      return;
    }
    setSelectedSize(product.sizes?.[0] || 'M');
    setSelectedColor(product.colors?.[0] || 'Default');
    setAddToBagProduct(product);
  };

  const handleConfirmAddToBag = () => {
    if (!addToBagProduct) return;
    const size = selectedSize || addToBagProduct.sizes?.[0] || 'M';
    addToCart({
      id: addToBagProduct.id,
      name: addToBagProduct.name,
      price: addToBagProduct.price,
      image: addToBagProduct.images[0] || '',
      size,
    });
    toast.success('Added to cart');
    setAddToBagProduct(null);
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
    <section id="featured" className="py-10 md:py-12 bg-accent/20 relative" style={{ position: 'relative' }}>
      <div className="w-full" style={{ position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between gap-4 mb-8 md:mb-10 px-2 md:px-4"
        >
          <div>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '2.5rem' }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="h-0.5 bg-foreground mb-4"
            />
            <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tight">Featured Collection</h2>
            <p className="text-sm text-foreground/60 mt-1.5">Handpicked pieces for the season</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/all-products')}
            className="group shrink-0 flex items-center gap-2 border border-foreground/20 hover:border-foreground hover:bg-foreground hover:text-background px-4 py-2 text-[11px] uppercase tracking-widest font-medium transition-all duration-200"
          >
            View all
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-200" />
          </motion.button>
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
          <div className="flex gap-4 md:gap-6 overflow-x-auto pb-3 scrollbar-hide mb-8 md:mb-12 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8">
            {featuredProducts.slice(0, 4).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
              whileHover={{ scale: 1.05, rotateY: 5, rotateX: -2 }}
              style={{ perspective: 1000 }}
              className="group shrink-0 w-[44vw] sm:w-[30vw] md:w-56 lg:w-60"
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
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => toggleWishlist(product, e)}
                  className={`absolute z-10 top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md backdrop-blur-sm ${
                    isInWishlist(String(product.id))
                      ? 'bg-red-500 text-white'
                      : 'bg-white/90 text-foreground hover:bg-white'
                  }`}
                >
                  <Heart size={14} fill={isInWishlist(String(product.id)) ? 'currentColor' : 'none'} />
                </motion.button>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
              </div>

              <div className="text-xs md:text-sm text-foreground/50 mb-1 md:mb-2 tracking-wider uppercase">
                {product.category}
              </div>
              <h3
                className="text-sm md:text-base mb-1.5 group-hover:text-foreground/70 transition-colors line-clamp-1 cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                {product.name}
              </h3>
              {product.colors && product.colors.length > 0 && (
                <div className="flex items-center gap-1 mb-2">
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
                  <span className="text-sm font-medium">{formatPrice(product.price)}</span>
                  {product.original_price && (
                    <span className="text-xs text-foreground/40 line-through shrink-0">
                      {formatPrice(product.original_price)}
                    </span>
                  )}
                </div>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={(e) => { e.stopPropagation(); openAddToBagDialog(product, e); }}
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center shadow-sm transition-colors ${
                    items.some(item => String(item.id) === String(product.id))
                      ? 'bg-green-500 text-white'
                      : 'bg-foreground text-background hover:opacity-80'
                  }`}
                >
                  {items.some(item => String(item.id) === String(product.id))
                    ? <Check size={12} strokeWidth={2.5} />
                    : <ShoppingBag size={12} />
                  }
                </motion.button>
                <AddToBagPopover
                  isOpen={addToBagProduct?.id === product.id}
                  product={product}
                  selectedSize={selectedSize}
                  selectedColor={selectedColor}
                  onSizeChange={setSelectedSize}
                  onColorChange={setSelectedColor}
                  onConfirm={handleConfirmAddToBag}
                  onCancel={() => setAddToBagProduct(null)}
                />
              </div>
            </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}