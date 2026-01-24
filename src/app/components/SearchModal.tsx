import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Filter } from 'lucide-react';
import { Product } from '../types/product';
import { ProductDetail } from './ProductDetail';
import { productService } from '../services/productService';
import { useCurrency } from '../context/CurrencyContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BADGE_OPTIONS = ['Best Seller', 'Trending', 'Most Ordered', 'New', 'Limited Edition', 'Exclusive', 'Hot', 'Popular'] as const;

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const { formatPrice } = useCurrency();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch products when modal opens
  useEffect(() => {
    if (isOpen && allProducts.length === 0) {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const response = await productService.list({ limit: 500 });
          setAllProducts(response.products || []);
        } catch (error) {
          console.error('Failed to fetch products:', error);
          setAllProducts([]);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [isOpen, allProducts.length]);

  useEffect(() => {
    // Ensure allProducts is an array
    if (!Array.isArray(allProducts)) {
      setResults([]);
      return;
    }

    let filtered = [...allProducts];

    // Filter by search query
    if (query.trim() !== '') {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          product.subcategory.toLowerCase().includes(query.subcategory || '')
      );
    }

    // Filter by selected badges
    if (selectedBadges.length > 0) {
      filtered = filtered.filter((product) => 
        product.badge && selectedBadges.includes(product.badge)
      );
    }

    setResults(filtered.slice(0, query.trim() === '' ? 6 : 12));
  }, [query, selectedBadges, allProducts]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedBadges([]);
      setShowFilters(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !selectedProduct) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, selectedProduct]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(60px)',
                WebkitBackdropFilter: 'blur(60px)',
              }}
              className="fixed inset-0 z-50"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
              <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full max-w-2xl bg-background rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Search Input */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-center gap-4">
                    <Search size={24} className="text-muted-foreground" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search for products..."
                      autoFocus
                      className="flex-1 bg-transparent outline-none text-lg placeholder:text-muted-foreground"
                    />
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Filters */}
                <div className="px-6 py-4 border-b border-border bg-muted/20">
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
                    >
                      <Filter size={16} />
                      Filter by Badge
                      {selectedBadges.length > 0 && (
                        <span className="ml-1 px-2 py-0.5 bg-primary text-primary-foreground rounded-full text-xs">
                          {selectedBadges.length}
                        </span>
                      )}
                    </button>
                    {selectedBadges.length > 0 && (
                      <button
                        onClick={() => setSelectedBadges([])}
                        className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  
                  <AnimatePresence>
                    {showFilters && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-2 gap-2 pt-3">
                          {BADGE_OPTIONS.map((badge) => {
                            const isSelected = selectedBadges.includes(badge);
                            return (
                              <motion.button
                                key={badge}
                                onClick={() => {
                                  if (isSelected) {
                                    setSelectedBadges(selectedBadges.filter((b) => b !== badge));
                                  } else {
                                    setSelectedBadges([...selectedBadges, badge]);
                                  }
                                }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`px-3 py-2 text-xs font-bold tracking-wider uppercase rounded transition-all ${
                                  isSelected
                                    ? badge === 'Best Seller' ? 'bg-[#B4770E] text-white shadow-md' :
                                      badge === 'Trending' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md' :
                                      badge === 'Most Ordered' ? 'bg-blue-600 text-white shadow-md' :
                                      badge === 'New' ? 'bg-green-600 text-white shadow-md' :
                                      badge === 'Limited Edition' ? 'bg-black text-white shadow-md' :
                                      badge === 'Exclusive' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md' :
                                      badge === 'Hot' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md' :
                                      badge === 'Popular' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md' :
                                      'bg-foreground text-background shadow-md'
                                    : 'bg-muted text-foreground/60 hover:bg-muted/80 border border-border'
                                }`}
                              >
                                {badge}
                              </motion.button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Results */}
                <div className="max-h-[500px] overflow-y-auto p-6">
                  {loading ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                      <p>Loading products...</p>
                    </div>
                  ) : results.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Search size={48} className="mx-auto mb-4 opacity-20" />
                      <p>{query.trim() ? `No products found for "${query}"` : 'Start typing to search for products...'}</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {results.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => {
                            setSelectedProduct(product);
                          }}
                          className="flex gap-4 p-4 rounded-lg hover:bg-muted transition-colors cursor-pointer group"
                        >
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={product.images?.[0] || product.image || ''}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                                {product.name}
                              </h3>
                              {product.badge && (
                                <span className={`px-1.5 py-0.5 text-[8px] font-bold tracking-wider uppercase rounded flex-shrink-0 ${
                                  product.badge === 'Best Seller' ? 'bg-[#B4770E] text-white' :
                                  product.badge === 'Trending' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' :
                                  product.badge === 'Most Ordered' ? 'bg-blue-600 text-white' :
                                  product.badge === 'New' ? 'bg-green-600 text-white' :
                                  product.badge === 'Limited Edition' ? 'bg-black text-white' :
                                  product.badge === 'Exclusive' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' :
                                  product.badge === 'Hot' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' :
                                  product.badge === 'Popular' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' :
                                  'bg-foreground text-background'
                                }`}>
                                  {product.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {product.category} · {product.subcategory}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="font-medium">
                                {formatPrice(product.price, product.price_inr || (product as any).priceINR)}
                              </p>
                              {(product.original_price || product.originalPrice) && (
                                <p className="text-sm text-muted-foreground line-through">
                                  {formatPrice(
                                    product.original_price || product.originalPrice || 0,
                                    product.original_price_inr || (product as any).originalPriceINR
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border bg-muted/30 text-center text-sm text-muted-foreground">
                  Press <kbd className="px-2 py-1 bg-background rounded text-xs">ESC</kbd> to close
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Product Detail Modal */}
      <ProductDetail
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}