import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Search, X, TrendingUp, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productService } from '@/app/services/productService';
import { Product } from '@/app/types/api';
import { MobileProductGrid } from '@/app/components/mobile/MobileProductGrid';
import { EmptyState } from '@/app/components/mobile/EmptyState';

const TRENDING_SEARCHES = [
  'Dresses',
  'Summer Collection',
  'Designer Bags',
  'Sneakers',
  'Jewelry',
  'Sale Items',
];

const CATEGORIES = [
  { name: 'Women', link: '/category/women' },
  { name: 'Men', link: '/category/men' },
  { name: 'Dresses', link: '/category/women/dresses' },
  { name: 'Shoes', link: '/all-products?category=Shoes' },
  { name: 'Bags', link: '/all-products?category=Accessories' },
  { name: 'Jewelry', link: '/all-products?category=Jewelry' },
];

export function MobileSearchPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await productService.list({ limit: 200 });
        setAllProducts(res.products || []);
      } catch {
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      );
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setShowResults(false);
      setSearchResults(allProducts);
    }
  }, [searchQuery, allProducts]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Add to recent searches
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleClearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Search Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border/20" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              autoFocus
              className="w-full pl-11 pr-10 py-3 bg-foreground/5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-foreground/10 flex items-center justify-center"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Cancel Button */}
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-foreground/70"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="pt-[80px]">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="suggestions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-4 py-4"
            >
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-foreground/60">Recent</h3>
                    <button
                      onClick={handleClearRecent}
                      className="text-xs text-primary"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="w-full flex items-center gap-3 py-2"
                      >
                        <Clock size={18} className="text-foreground/40" />
                        <span className="flex-1 text-left text-sm">{search}</span>
                        <ChevronRight size={16} className="text-foreground/20" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-foreground/60 mb-3">
                  Trending
                </h3>
                <div className="space-y-2">
                  {TRENDING_SEARCHES.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="w-full flex items-center gap-3 py-2"
                    >
                      <TrendingUp size={18} className="text-primary" />
                      <span className="flex-1 text-left text-sm">{search}</span>
                      <ChevronRight size={16} className="text-foreground/20" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Categories */}
              <div>
                <h3 className="text-sm font-medium text-foreground/60 mb-3">
                  Browse Categories
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat, index) => (
                    <motion.button
                      key={index}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(cat.link)}
                      className="p-4 bg-foreground/5 rounded-2xl text-center font-medium text-sm"
                    >
                      {cat.name}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {loading ? (
                <div className="flex justify-center py-12 text-muted-foreground">Loading...</div>
              ) : searchResults.length > 0 ? (
                <MobileProductGrid
                  products={searchResults}
                  title={`${searchResults.length} Results for "${searchQuery}"`}
                />
              ) : (
                <EmptyState
                  type="search"
                  description={`Try searching with different keywords for "${searchQuery}"`}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}