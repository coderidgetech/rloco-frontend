import { motion } from 'motion/react';
import { SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useOnSaleProducts } from '@/app/hooks/useProducts';
import { MobileProductGrid } from '@/app/components/mobile/MobileProductGrid';
import { MobileSubPageHeader } from '@/app/components/mobile/MobileSubPageHeader';

export function MobileSalePage() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('discount');
  const [showSort, setShowSort] = useState(false);
  const { products: apiProducts } = useOnSaleProducts(200);
  const saleProducts = apiProducts.filter(p => p.on_sale && (p.original_price ?? p.price));

  let sortedProducts = [...saleProducts];
  if (sortBy === 'discount') {
    sortedProducts.sort((a, b) => {
      const origA = a.original_price ?? a.price;
      const origB = b.original_price ?? b.price;
      const discountA = origA ? ((origA - a.price) / origA) * 100 : 0;
      const discountB = origB ? ((origB - b.price) / origB) * 100 : 0;
      return discountB - discountA;
    });
  } else if (sortBy === 'price-low') {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <MobileSubPageHeader showBackButton={true} showDeliveryAddress={false} />

      {/* Sale Banner */}
      <div 
        className="fixed left-0 right-0 z-40 bg-gradient-to-r from-red-50 to-orange-50 border-b border-border/10"
        style={{ top: 'calc(env(safe-area-inset-top) + 56px)' }}
      >
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-red-600 uppercase tracking-wide">Limited Time Offer</p>
            <p className="text-sm text-foreground/70 mt-0.5">Up to 70% off on selected items</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-2xl font-bold text-red-600">{saleProducts.length}</p>
              <p className="text-xs text-foreground/60">Items</p>
            </div>
            <button
              onClick={() => setShowSort(true)}
              className="text-sm text-foreground/70 flex items-center gap-1 px-3 py-1.5 rounded-full border border-border/30 bg-white"
            >
              <SlidersHorizontal size={14} />
              Sort
            </button>
          </div>
        </div>
      </div>

      {/* Products */}
      <div style={{ paddingTop: 'calc(env(safe-area-inset-top) + 120px)' }}>{/* Header + filters */}
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
                { value: 'discount', label: 'Highest Discount' },
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