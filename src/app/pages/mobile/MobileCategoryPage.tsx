import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChevronLeft, SlidersHorizontal, Grid as GridIcon, List } from 'lucide-react';
import { productService } from '@/app/services/productService';
import { MobileProductGrid } from '@/app/components/mobile/MobileProductGrid';
import { BottomNavigation } from '@/app/components/mobile/BottomNavigation';
import { QuickActions } from '@/app/components/mobile/QuickActions';
import { Product } from '@/app/types/api';

export function MobileCategoryPage() {
  const { gender, category } = useParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: 'all',
    size: 'all',
    color: 'all',
  });
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products based on filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productService.list({
          limit: 200,
          gender: gender as 'women' | 'men' | 'unisex' | undefined,
          category: category,
        });
        setFilteredProducts(response.products || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [gender, category]);

  // Sort products
  const sortedProducts = [...filteredProducts];
  if (sortBy === 'price-low') {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    sortedProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'newest') {
    sortedProducts.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA;
    });
  }

  const categoryTitle = category 
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : gender 
    ? gender.charAt(0).toUpperCase() + gender.slice(1)
    : 'All Products';

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border/20">
        <div className="flex items-center justify-between h-14 px-4" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className="flex items-center flex-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center"
            >
              <ChevronLeft size={20} />
            </motion.button>
            <h1 className="text-lg font-medium ml-3 truncate">{categoryTitle}</h1>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center"
            >
              {viewMode === 'grid' ? (
                <List size={18} className="text-foreground/70" />
              ) : (
                <GridIcon size={18} className="text-foreground/70" />
              )}
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 px-4 py-2 border-t border-border/10">
          <span className="text-sm text-foreground/60">
            {filteredProducts.length} items
          </span>
          <div className="flex-1" />
          <button
            onClick={() => setShowSort(true)}
            className="text-sm text-foreground/70 flex items-center gap-1"
          >
            <SlidersHorizontal size={14} />
            Sort
          </button>
        </div>
      </div>

      {/* Products */}
      <div className="pt-[120px]">
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

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Quick Actions */}
      <QuickActions
        onFilterClick={() => setShowFilters(true)}
        onSortClick={() => setShowSort(true)}
      />
    </div>
  );
}
