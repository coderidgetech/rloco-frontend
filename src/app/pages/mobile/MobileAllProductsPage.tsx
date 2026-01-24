import { motion } from 'motion/react';
import { ChevronLeft, SlidersHorizontal, Grid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useProducts } from '@/app/hooks/useProducts';
import { MobileProductGrid } from '@/app/components/mobile/MobileProductGrid';
import { BottomNavigation } from '@/app/components/mobile/BottomNavigation';

export function MobileAllProductsPage() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('featured');
  const [showSort, setShowSort] = useState(false);
  const { products: allProducts, loading } = useProducts({ limit: 200 });

  // Sort products
  const sortedProducts = useMemo(() => {
    if (!allProducts) return [];
    const sorted = [...allProducts];
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
  }, [allProducts, sortBy]);

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
              <Grid size={20} className="text-foreground/60" />
              <h1 className="text-lg font-medium">All Products</h1>
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

        {/* Stats Bar */}
        <div className="px-4 py-2 bg-foreground/5 text-sm text-foreground/60 border-t border-border/10">
          Showing {sortedProducts.length} products
        </div>
      </div>

      {/* Products */}
      <div className="pt-[88px]">
        <MobileProductGrid products={sortedProducts} title="" />
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
                { value: 'featured', label: 'Featured' },
                { value: 'newest', label: 'Newest' },
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
    </div>
  );
}
