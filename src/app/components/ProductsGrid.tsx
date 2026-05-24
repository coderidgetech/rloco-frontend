import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, Check, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { Product } from '../types/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { BackgroundDecor } from './BackgroundDecor';
import { useFeaturedProducts } from '../hooks/useProducts';
import { useSiteConfig } from '../context/SiteConfigContext';
import { AddToBagPopover } from './AddToBagPopover';
import { colorMap } from '../utils/filterConfig';

const TOP_COLLECTION_LIMIT = 4;

export function ProductsGrid() {
  const { config } = useSiteConfig();
  const [addToBagProduct, setAddToBagProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Don't render if featured products (Top Collection) section is disabled
  if (!config.homepage.sections.featuredProducts) {
    return null;
  }
  const { addToCart, items } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  // Top Collection = featured products (matches reference design)
  const { products: displayProducts, loading, error } = useFeaturedProducts(TOP_COLLECTION_LIMIT);

  const openAddToBagDialog = (product: Product) => {
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

  const toggleWishlist = (product: Product) => {
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
    <section id="products" className="pt-8 pb-10 px-4 md:pt-10 md:pb-12 md:px-6 bg-background relative">
      {/* Reusable Background Decoration */}
      <BackgroundDecor 
        variant="alternate"
        showDots={true}
        showLines={true}
        showOrbs={true}
        showGeometric={false}
      />
      
      <div className="w-full relative z-10">
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600">Error loading products: {error}</p>
          </div>
        )}
        
        {!loading && !error && displayProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No products found</p>
          </div>
        )}
        
        {!loading && !error && displayProducts.length > 0 && (
          <>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-end justify-between gap-4 mb-8 md:mb-10"
            >
              <div>
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '2.5rem' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="h-0.5 bg-foreground mb-4"
                />
                <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tight">Top Collection</h2>
                <p className="text-sm text-foreground/60 mt-1.5">{displayProducts.length} handpicked pieces</p>
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

        {/* Products Grid - single scrollable row */}
        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4 md:-mx-6 md:px-6">
          <AnimatePresence mode="popLayout">
            {displayProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                className="group shrink-0 w-[44vw] sm:w-[30vw] md:w-52 lg:w-56"
              >
                <div 
                  className="relative aspect-[3/4] overflow-hidden mb-2 bg-accent cursor-pointer rounded shadow-sm hover:shadow-lg transition-all duration-500"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <motion.img
                    src={product.images[0] || ''}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                    whileHover={{ scale: 1.08, rotate: 0.5 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                  
                  {/* Badge */}
                  {product.badge && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`absolute top-1.5 left-1.5 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase z-10 ${
                        product.badge === 'Best Seller' ? 'bg-[#B4770E] text-white' :
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
                    </motion.div>
                  )}

                  {/* Wishlist Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                    className={`absolute top-1.5 right-1.5 w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-md backdrop-blur-sm z-10 ${
                      isInWishlist(String(product.id))
                        ? 'bg-red-500 text-white'
                        : 'bg-white/90 text-foreground hover:bg-white'
                    }`}
                  >
                    <Heart size={14} fill={isInWishlist(String(product.id)) ? 'currentColor' : 'none'} />
                  </motion.button>

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 + 0.2 }}
                  className="flex-1 flex flex-col overflow-visible"
                >
                  <div className="text-[10px] text-foreground/50 mb-1 tracking-wider uppercase">
                    {product.category}
                  </div>
                  <h3
                    className="text-xs mb-1 h-4 overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-foreground/70 transition-colors cursor-pointer leading-tight"
                    title={product.name}
                    onClick={() => navigate(`/product/${product.id}`)}
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
                      <span className="text-sm font-medium">{formatPrice(product.price)}</span>
                      {product.original_price && (
                        <span className="text-[10px] text-foreground/40 line-through shrink-0">
                          {formatPrice(product.original_price)}
                        </span>
                      )}
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={(e) => { e.stopPropagation(); openAddToBagDialog(product); }}
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
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

          </>
        )}
      </div>
    </section>
  );
}