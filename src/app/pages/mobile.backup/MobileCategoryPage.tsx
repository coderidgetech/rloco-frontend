import { motion } from 'motion/react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { productService } from '@/app/services/productService';
import { Product } from '@/app/types/api';
import { MobileProductGrid } from '@/app/components/mobile/MobileProductGrid';
import { QuickActions } from '@/app/components/mobile/QuickActions';
import { EmptyState } from '@/app/components/mobile/EmptyState';
import { MobileSubPageHeader } from '@/app/components/mobile/MobileSubPageHeader';
import { useCurrency } from '@/app/context/CurrencyContext';

export function MobileCategoryPage() {
  const { market } = useCurrency();
  const { gender, category } = useParams();
  const [searchParams] = useSearchParams();
  const giftOnly = searchParams.get('gift') === 'true';
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [selectedFilters, setSelectedFilters] = useState({
    priceRange: 'all',
    size: 'all',
    color: 'all',
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await productService.list({
          limit: 200,
          market,
          ...(gender && gender !== 'all' && { gender }),
          ...(category && { category }),
          ...(giftOnly && { gift: true }),
        });
        setProducts(res.products || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [gender, category, giftOnly, market]);

  const subCategories = gender === 'women' 
    ? ['All', 'Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Shoes', 'Bags', 'Jewelry']
    : gender === 'men'
    ? ['All', 'Shirts', 'Pants', 'Outerwear', 'Shoes', 'Accessories']
    : ['All'];

  let filteredProducts = products.filter(p => {
    // Handle "all" gender (all products in a category)
    if (gender === 'all' && category) {
      const matchesCategory = p.category.toLowerCase() === category.toLowerCase();
      return matchesCategory;
    }
    
    // Handle gender-only filter
    if (gender && gender !== 'all' && !category) {
      const matchesGender = p.gender.toLowerCase() === gender.toLowerCase();
      const matchesSubCategory = selectedSubCategory === 'all' || 
        p.category.toLowerCase() === selectedSubCategory.toLowerCase();
      return matchesGender && matchesSubCategory;
    }
    
    // Handle gender + category filter
    if (gender && gender !== 'all' && category) {
      return (
        p.gender.toLowerCase() === gender.toLowerCase() &&
        p.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    return true;
  });

  // Apply additional filters
  filteredProducts = filteredProducts.filter(p => {
    // Price filter
    if (selectedFilters.priceRange !== 'all') {
      if (selectedFilters.priceRange === '0-50' && p.price >= 50) return false;
      if (selectedFilters.priceRange === '50-100' && (p.price < 50 || p.price >= 100)) return false;
      if (selectedFilters.priceRange === '100-200' && (p.price < 100 || p.price >= 200)) return false;
      if (selectedFilters.priceRange === '200-500' && (p.price < 200 || p.price >= 500)) return false;
      if (selectedFilters.priceRange === '500+' && p.price < 500) return false;
    }

    // Size filter
    if (selectedFilters.size !== 'all') {
      if (!p.sizes.some(s => s.toLowerCase() === selectedFilters.size)) return false;
    }

    // Color filter
    if (selectedFilters.color !== 'all') {
      if (!p.colors.some(c => c.toLowerCase() === selectedFilters.color)) return false;
    }

    return true;
  });

  // Sort products
  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'newest') {
    filteredProducts.sort((a, b) => (b.new_arrival ? 1 : 0) - (a.new_arrival ? 1 : 0));
  }

  const categoryTitle = giftOnly && gender === 'women'
    ? 'Gift For Her'
    : giftOnly && gender === 'men'
    ? 'Gift For Him'
    : category 
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : gender 
    ? gender.charAt(0).toUpperCase() + gender.slice(1)
    : 'All Products';

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <MobileSubPageHeader showBackButton={true} showDeliveryAddress={false} />

      {/* Filter Bar - Fixed below header */}
      <div 
        className="fixed left-0 right-0 z-40 bg-white border-b border-border/10"
        style={{ top: 'calc(env(safe-area-inset-top) + 56px)' }}
      >
        {/* Item count */}
        <div className="flex items-center justify-between px-4 py-2">
          <h2 className="text-base font-medium">{categoryTitle}</h2>
          <span className="text-sm text-foreground/60">
            {filteredProducts.length} items
          </span>
        </div>

        {/* Subcategory Filter - Only show if not already in a specific category */}
        {gender && !category && (
          <div className="border-t border-border/10">
            <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
              {subCategories.map((subCat) => (
                <motion.button
                  key={subCat}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSubCategory(subCat.toLowerCase())}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedSubCategory === subCat.toLowerCase()
                      ? 'bg-primary text-white'
                      : 'bg-foreground/5 text-foreground/70'
                  }`}
                >
                  {subCat}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Products - Scrollable Area */}
      <div 
        style={{ 
          paddingTop: gender && !category 
            ? 'calc(env(safe-area-inset-top) + 56px + 36px + 60px)' // Header + item count + subcategory pills
            : 'calc(env(safe-area-inset-top) + 56px + 36px)' // Header + item count only
        }}
      >
        {loading ? (
          <div className="flex justify-center py-12 text-muted-foreground">Loading...</div>
        ) : filteredProducts.length > 0 ? (
          <MobileProductGrid products={filteredProducts} title="" showItemCount={false} />
        ) : (
          <EmptyState type="category" />
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

      {/* Filter Bottom Sheet */}
      {showFilters && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-[60]"
            onClick={() => setShowFilters(false)}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            <div className="sticky top-0 bg-white p-4 border-b border-border/20 z-10">
              <div className="w-12 h-1 bg-foreground/20 rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Filters</h3>
                <button
                  onClick={() => {
                    setSelectedFilters({
                      priceRange: 'all',
                      size: 'all',
                      color: 'all',
                    });
                  }}
                  className="text-sm text-primary font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Price Range */}
              <div>
                <h4 className="font-medium mb-3">Price Range</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'all', label: 'All' },
                    { value: '0-50', label: 'Under $50' },
                    { value: '50-100', label: '$50 - $100' },
                    { value: '100-200', label: '$100 - $200' },
                    { value: '200-500', label: '$200 - $500' },
                    { value: '500+', label: 'Over $500' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setSelectedFilters({ ...selectedFilters, priceRange: option.value })
                      }
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        selectedFilters.priceRange === option.value
                          ? 'bg-primary text-white'
                          : 'bg-foreground/5 text-foreground/70'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div>
                <h4 className="font-medium mb-3">Size</h4>
                <div className="grid grid-cols-4 gap-2">
                  {['all', 'XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      key={size}
                      onClick={() =>
                        setSelectedFilters({ ...selectedFilters, size: size.toLowerCase() })
                      }
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        selectedFilters.size === size.toLowerCase()
                          ? 'bg-primary text-white'
                          : 'bg-foreground/5 text-foreground/70'
                      }`}
                    >
                      {size === 'all' ? 'All' : size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <h4 className="font-medium mb-3">Color</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'all', label: 'All' },
                    { value: 'black', label: 'Black' },
                    { value: 'white', label: 'White' },
                    { value: 'red', label: 'Red' },
                    { value: 'blue', label: 'Blue' },
                    { value: 'green', label: 'Green' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setSelectedFilters({ ...selectedFilters, color: option.value })
                      }
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        selectedFilters.color === option.value
                          ? 'bg-primary text-white'
                          : 'bg-foreground/5 text-foreground/70'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="sticky bottom-0 bg-white p-4 border-t border-border/20">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowFilters(false)}
                className="w-full py-4 bg-primary text-white rounded-xl font-medium"
              >
                Apply Filters
              </motion.button>
            </div>
          </motion.div>
        </>
      )}

      {/* Quick Actions */}
      <QuickActions
        onFilterClick={() => setShowFilters(true)}
        onSortClick={() => setShowSort(true)}
      />

      {/* Custom scrollbar hide */}
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