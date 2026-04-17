import { motion } from 'motion/react';
import { ShoppingBag, Plus, Check, Heart, Package2, Sparkles, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { toast } from 'sonner';

interface Product {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  priceINR?: number;
  originalPriceINR?: number;
}

interface CompleteTheLookSectionProps {
  currentProduct: Product;
  products: Product[];
}

export function CompleteTheLookSection({ currentProduct, products }: CompleteTheLookSectionProps) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { formatPrice, convertPrice, formatAmount } = useCurrency();
  const [selectedItems, setSelectedItems] = useState<Set<string | number>>(new Set());
  const [hoveredItem, setHoveredItem] = useState<string | number | null>(null);

  // Limit to 4 complementary products
  const displayProducts = products.slice(0, 4);
  
  // Always include the current product
  const allProducts = [currentProduct, ...displayProducts];

  const toggleItem = (id: string | number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const calculateTotal = () => {
    let total = 0;
    allProducts.forEach(product => {
      if (selectedItems.has(product.id)) {
        total += convertPrice(product.price, product.priceINR);
      }
    });
    return total;
  };

  const calculateSavings = () => {
    let savings = 0;
    allProducts.forEach(product => {
      if (selectedItems.has(product.id) && product.originalPrice) {
        const originalPrice = convertPrice(product.originalPrice, product.originalPriceINR);
        const currentPrice = convertPrice(product.price, product.priceINR);
        savings += originalPrice - currentPrice;
      }
    });
    return savings;
  };

  const handleAddAllToCart = () => {
    if (selectedItems.size === 0) {
      toast.error('Please select at least one item');
      return;
    }

    let addedCount = 0;
    allProducts.forEach(product => {
      if (selectedItems.has(product.id)) {
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          priceINR: product.priceINR, // Add INR price
          image: product.image,
          size: 'One Size',
        });
        addedCount++;
      }
    });

    toast.success(`Added ${addedCount} ${addedCount === 1 ? 'item' : 'items'} to your bag`);
    setSelectedItems(new Set());
  };

  if (displayProducts.length === 0) return null;

  const totalPrice = calculateTotal();
  const totalSavings = calculateSavings();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative mt-16 md:mt-20 overflow-hidden bg-gradient-to-br from-[#faf9f6] to-white border-y-4 border-primary/20"
    >
      {/* Enhanced Sophisticated Background with Patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(180,119,14,0.12),transparent_50%)]" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/8 to-transparent" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(180,119,14,0.03)_50%,transparent_52%)] bg-[length:80px_80px]" />

      <div className="relative py-12 md:py-16">
        {/* Enhanced Header Section */}
        <div className="w-full mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-16 h-16 border-3 border-primary/30 flex items-center justify-center bg-white shadow-lg">
                <Package2 size={28} className="text-primary" />
              </div>
            </div>
            <h2 className="text-4xl md:text-6xl mb-4 tracking-tight font-medium bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text">Complete the Look</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-4" />
            <p className="text-foreground/60 tracking-wide max-w-2xl mx-auto text-lg">
              Curated pieces that perfectly complement your selection. Build your complete outfit with confidence.
            </p>
          </motion.div>
        </div>

        {/* Products Grid */}
        <div className="w-full">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 mb-8 px-2 md:px-4">
            {allProducts.map((product, index) => {
              const isSelected = selectedItems.has(product.id);
              const isCurrentProduct = String(product.id) === String(currentProduct.id);
              const isHovered = hoveredItem === product.id;

              return (
                <motion.div
                  key={`${product.id}-${index}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.5 }}
                  className="relative"
                  onMouseEnter={() => setHoveredItem(product.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Product Card */}
                  <div
                    className={`relative bg-white border-3 transition-all duration-300 shadow-md hover:shadow-2xl ${
                      isSelected 
                        ? 'border-primary shadow-xl shadow-primary/20 scale-105' 
                        : 'border-foreground/10 hover:border-primary/50'
                    }`}
                  >
                    {/* Current Product Badge */}
                    {isCurrentProduct && (
                      <div className="absolute top-3 left-3 z-10">
                        <div className="bg-gradient-to-r from-primary to-secondary text-white px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 shadow-lg">
                          <Sparkles size={12} />
                          Your Pick
                        </div>
                      </div>
                    )}

                    {/* Savings Badge */}
                    {product.originalPrice && (
                      <div className="absolute top-3 right-3 z-10">
                        <div className="bg-gradient-to-br from-red-600 to-red-700 text-white px-2.5 py-1.5 text-[10px] uppercase tracking-wider font-bold shadow-lg">
                          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </div>
                      </div>
                    )}

                    {/* Image Section */}
                    <div 
                      className="relative aspect-[3/4] overflow-hidden bg-foreground/5 cursor-pointer group"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`w-full h-full object-cover transition-all duration-700 ${
                          isHovered ? 'scale-110' : 'scale-100'
                        }`}
                        style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                      />
                      
                      {/* Enhanced Hover Overlay */}
                      <div
                        className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 ${
                          isHovered ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <p className="text-xs uppercase tracking-wider mb-1 font-bold">Quick View</p>
                          <p className="text-[10px] text-white/80 capitalize">{product.category}</p>
                        </div>
                      </div>
                      
                      {/* Selection Indicator Overlay */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/10 border-4 border-primary pointer-events-none" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-3 md:p-4">
                      <p className="text-xs uppercase tracking-wider text-foreground/50 mb-1.5 font-semibold">RLOCO</p>
                      <h3 className="text-sm mb-2 line-clamp-2 min-h-[40px] tracking-wide leading-snug font-medium">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-base font-bold">
                          {formatPrice(product.price, product.priceINR)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-foreground/40 line-through">
                            {formatPrice(product.originalPrice, product.originalPriceINR)}
                          </span>
                        )}
                      </div>

                      {/* Enhanced Select Button */}
                      <motion.button
                        onClick={() => toggleItem(product.id)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={`w-full h-11 flex items-center justify-center gap-2 text-xs uppercase tracking-widest transition-all font-bold shadow-md ${
                          isSelected
                            ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/30'
                            : 'border-2 border-primary/30 text-foreground hover:border-primary hover:bg-primary/5'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check size={16} strokeWidth={3} />
                            Selected
                          </>
                        ) : (
                          <>
                            <Plus size={16} strokeWidth={3} />
                            Select
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {/* Plus Icon Connector (except for last item on desktop) */}
                  {index < allProducts.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-5 transform -translate-y-1/2 z-20">
                      <div className="w-10 h-10 bg-white border-2 border-primary/30 flex items-center justify-center shadow-md">
                        <Plus size={18} className="text-primary" strokeWidth={3} />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Enhanced Summary and Action Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-foreground via-foreground to-foreground/90 text-background p-6 md:p-8 relative overflow-hidden shadow-2xl border-4 border-primary/20"
          >
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.08),transparent_60%)]" />
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-primary/10 to-transparent" />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.02)_50%,transparent_52%)] bg-[length:60px_60px]" />

            <div className="relative grid md:grid-cols-2 gap-6 md:gap-8 items-center">
              {/* Left: Summary */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary flex items-center justify-center">
                    <ShoppingBag size={24} className="text-white" />
                  </div>
                  <h3 className="text-2xl md:text-3xl tracking-tight font-bold">Your Selection</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b-2 border-background/20">
                    <span className="text-sm text-background/70 uppercase tracking-wider font-semibold">Items Selected:</span>
                    <span className="text-2xl font-bold">{selectedItems.size}</span>
                  </div>
                  
                  {totalSavings > 0 && (
                    <div className="flex items-center justify-between py-2 border-b-2 border-background/20">
                      <span className="text-sm text-background/70 uppercase tracking-wider font-semibold">Total Savings:</span>
                      <span className="text-xl font-bold text-green-400">{formatAmount(totalSavings)}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between py-3">
                    <span className="text-base uppercase tracking-wider font-bold">Total Price:</span>
                    <span className="text-3xl md:text-4xl font-bold text-secondary">{formatAmount(totalPrice)}</span>
                  </div>
                </div>

                {/* Benefits */}
                <div className="mt-6 space-y-2 text-xs text-background/70">
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-secondary" strokeWidth={3} />
                    <span className="font-medium">Free shipping on all orders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-secondary" strokeWidth={3} />
                    <span className="font-medium">30-day easy returns & exchanges</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-secondary" strokeWidth={3} />
                    <span className="font-medium">Authentic products guaranteed</span>
                  </div>
                </div>
              </div>

              {/* Right: Action Button */}
              <div className="flex flex-col items-center justify-center text-center">
                <motion.button
                  onClick={handleAddAllToCart}
                  disabled={selectedItems.size === 0}
                  whileHover={selectedItems.size > 0 ? { scale: 1.05 } : {}}
                  whileTap={selectedItems.size > 0 ? { scale: 0.95 } : {}}
                  className={`w-full md:w-auto px-8 md:px-12 py-5 md:py-6 text-sm uppercase tracking-[0.2em] font-bold transition-all shadow-xl ${
                    selectedItems.size === 0
                      ? 'bg-background/20 text-background/40 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-2xl hover:shadow-primary/50'
                  }`}
                >
                  <span className="flex items-center justify-center gap-3">
                    <ShoppingBag size={20} />
                    {selectedItems.size === 0 
                      ? 'Select Items Above'
                      : `Add ${selectedItems.size} ${selectedItems.size === 1 ? 'Item' : 'Items'} to Bag`
                    }
                  </span>
                </motion.button>

                {selectedItems.size > 0 && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-background/70 mt-4 tracking-wide font-medium"
                  >
                    Ready to complete your look? Add to bag now!
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Enhanced Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="flex items-center gap-4 p-5 border-2 border-primary/20 bg-white shadow-md hover:shadow-xl transition-all">
              <div className="w-14 h-14 border-2 border-primary/30 flex items-center justify-center flex-shrink-0 bg-primary/5">
                <TrendingUp size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider mb-1 font-bold">Trending Combination</p>
                <p className="text-xs text-foreground/60 font-medium">Frequently bought together</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 border-2 border-primary/20 bg-white shadow-md hover:shadow-xl transition-all">
              <div className="w-14 h-14 border-2 border-primary/30 flex items-center justify-center flex-shrink-0 bg-primary/5">
                <Heart size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider mb-1 font-bold">Stylist Approved</p>
                <p className="text-xs text-foreground/60 font-medium">Curated by experts</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-5 border-2 border-primary/20 bg-white shadow-md hover:shadow-xl transition-all">
              <div className="w-14 h-14 border-2 border-primary/30 flex items-center justify-center flex-shrink-0 bg-primary/5">
                <Sparkles size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider mb-1 font-bold">Premium Quality</p>
                <p className="text-xs text-foreground/60 font-medium">Finest materials only</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}