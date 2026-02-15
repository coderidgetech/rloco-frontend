import { motion } from 'motion/react';
import { SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useProducts } from '@/app/hooks/useProducts';
import { MobileProductGrid } from '@/app/components/mobile/MobileProductGrid';
import { MobileSubPageHeader } from '@/app/components/mobile/MobileSubPageHeader';

export function MobileAllProductsPage() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('featured');
  const [showSort, setShowSort] = useState(false);
  const { products: apiProducts, loading } = useProducts({ limit: 200 });
  let sortedProducts = [...apiProducts];
  if (sortBy === 'price-low') {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'newest') {
    sortedProducts.sort((a, b) => (b.new_arrival ? 1 : 0) - (a.new_arrival ? 1 : 0));
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <MobileSubPageHeader showBackButton={true} showDeliveryAddress={false} />

      {/* Stats Bar */}
      <div 
        className="fixed left-0 right-0 z-40 bg-white border-b border-border/10"
        style={{ top: 'calc(env(safe-area-inset-top) + 56px)' }}
      >
        <div className="px-4 py-2 flex items-center justify-between">
          <span className="text-sm text-foreground/60">
            Showing {sortedProducts.length} products
          </span>
          <button
            onClick={() => setShowSort(true)}
            className="text-sm text-foreground/70 flex items-center gap-1 px-3 py-1.5 rounded-full border border-border/30"
          >
            <SlidersHorizontal size={14} />
            Sort
          </button>
        </div>
      </div>

      {/* Products */}
      <div style={{ paddingTop: 'calc(env(safe-area-inset-top) + 56px + 44px)' }}>
        {loading ? (
          <div className="flex justify-center py-12 text-muted-foreground">Loading...</div>
        ) : (
          <MobileProductGrid products={sortedProducts} title="" />
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
    </div>
  );
}
