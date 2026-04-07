import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingCart } from 'lucide-react';
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

const TOP_COLLECTION_LIMIT = 16;

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
    <section id="products" className="py-16 md:py-24 px-4 md:px-6 bg-background relative overflow-hidden">
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
            {/* Header - matches reference: decorative line + Top Collection + handpicked subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12 text-center"
            >
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: '3rem' }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="h-0.5 bg-foreground mx-auto mb-6"
              />
              <h2 className="text-3xl md:text-4xl lg:text-5xl mb-3 tracking-tight">Top Collection</h2>
              <p className="text-foreground/70">
                Discover our handpicked selection of {displayProducts.length} featured products
              </p>
            </motion.div>

        {/* Products Grid - 4 columns with smaller cards */}
        <div className="grid min-w-0 grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
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
                className="group"
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

                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />

                  {/* Quick View */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${product.id}`);
                      }}
                      className="w-full py-1.5 bg-white text-foreground hover:bg-white/90 transition-colors text-xs font-medium"
                    >
                      Quick View
                    </button>
                  </motion.div>
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
                    className="text-xs mb-1.5 h-4 overflow-hidden text-ellipsis whitespace-nowrap group-hover:text-foreground/70 transition-colors cursor-pointer leading-tight"
                    title={product.name}
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-sm font-medium">{formatPrice(product.price)}</span>
                    {product.original_price && (
                      <span className="text-[10px] text-foreground/40 line-through">
                        {formatPrice(product.original_price)}
                      </span>
                    )}
                  </div>

                  <div className="relative overflow-visible">
                    <motion.button
                      onClick={() => openAddToBagDialog(product)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-2.5 md:py-3 transition-all duration-300 relative overflow-hidden text-sm font-medium flex items-center justify-center gap-2 ${
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
                      <ShoppingCart size={18} className="relative z-10" />
                      <span className="relative z-10">
                        {items.some(item => String(item.id) === String(product.id)) ? 'Go to Cart' : 'Add to Bag'}
                      </span>
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

        {/* View All Button - reference: px-12 py-4 text-sm font-medium uppercase tracking-widest */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/all-products')}
            className="px-12 py-4 bg-foreground text-background hover:bg-foreground/90 transition-colors text-sm font-medium uppercase tracking-widest"
          >
            View All Products
          </motion.button>
        </motion.div>
          </>
        )}
      </div>
    </section>
  );
}