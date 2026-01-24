import { motion } from 'motion/react';
import { ChevronLeft, Sparkles, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useNewArrivals } from '../../hooks/useProducts';
import { MobileProductGrid } from '../../components/mobile/MobileProductGrid';
import { BottomNavigation } from '../../components/mobile/BottomNavigation';

export function MobileNewArrivalsPage() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('newest');
  const [showSort, setShowSort] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { products: newProducts } = useNewArrivals(200);

  // Apply category filter
  const filteredProducts = useMemo(() => {
    if (!newProducts) return [];
    if (selectedFilter === 'all') return newProducts;
    return newProducts.filter(p => 
      p.category.toLowerCase() === selectedFilter.toLowerCase()
    );
  }, [newProducts, selectedFilter]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    if (sortBy === 'price-low') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      sorted.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime();
        const dateB = new Date(b.created_at || 0).getTime();
        return dateB - dateA;
      });
    }
    return sorted;
  }, [filteredProducts, sortBy]);

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'dresses', label: 'Dresses' },
    { value: 'tops', label: 'Tops' },
    { value: 'bags', label: 'Bags' },
    { value: 'shoes', label: 'Shoes' },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border/20">
        <div className="flex items-center justify-between h-14 px-4" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className="flex items-center flex-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/')}
              className="w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center"
            >
              <ChevronLeft size={20} />
            </motion.button>
            <div className="flex items-center gap-2 ml-3">
              <Sparkles size={20} className="text-primary" />
              <h1 className="text-lg font-medium">New Arrivals</h1>
            </div>
          </div>

          <button
            onClick={() => setShowSort(true)}
            className="text-sm text-foreground/70 flex items-center gap-1"
          >
            <SlidersHorizontal size={14} />
            Sort
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide border-t border-border/10">
          {filterOptions.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedFilter(filter.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                selectedFilter === filter.value
                  ? 'bg-primary text-white'
                  : 'bg-foreground/5 text-foreground/70'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="px-4 py-2 bg-foreground/5 text-sm text-foreground/60">
          {sortedProducts.length} new items this week
        </div>
      </div>

      {/* Products */}
      <div className="pt-[140px]">
        {sortedProducts.length > 0 ? (
          <MobileProductGrid products={sortedProducts} title="" />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <Sparkles size={48} className="text-foreground/20 mb-4" />
            <h3 className="text-lg font-medium mb-2">No new arrivals</h3>
            <p className="text-sm text-foreground/60 text-center">
              Check back soon for new items in this category
            </p>
          </div>
        )}
      </div>

      {/* Sort Bottom Sheet */}
      {showSort && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => setShowSort(false)}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className="p-4 border-b border-border/20">
              <div className="w-12 h-1 bg-foreground/20 rounded-full mx-auto mb-4" />
              <h3 className="text-lg font-medium">Sort By</h3>
            </div>
            <div className="p-4">
              {[
                { value: 'newest', label: 'Newest First' },
                { value: 'price-low', label: 'Price: Low to High' },
                { value: 'price-high', label: 'Price: High to Low' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setShowSort(false);
                  }}
                  className={`w-full text-left py-4 border-b border-border/10 ${
                    sortBy === option.value ? 'text-primary font-medium' : 'text-foreground'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}

      <BottomNavigation />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
