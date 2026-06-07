import { motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';
import { useState, useMemo, useEffect } from 'react';
import { Footer } from '../components/Footer';
import { Tag, SlidersHorizontal, X, ChevronRight, AlertCircle } from 'lucide-react';
import { FilterSidebar } from '../components/FilterSidebar';
import { MobileFilterPanel } from '../components/MobileFilterPanel';
import { sortOptions, productMatchesSearchQuery } from '../utils/filterConfig';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { Product } from '../types/product';
import { useCurrency } from '../context/CurrencyContext';

export function SalePage() {
  const { market } = useCurrency();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // All filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGender, setSelectedGender] = useState<'all' | 'women' | 'men'>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [sortBy, setSortBy] = useState('discount');
  const [showFilters, setShowFilters] = useState(false);

  // Advanced filters
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [showOnSale, setShowOnSale] = useState(true);
  const [showNewArrivals, setShowNewArrivals] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);

  // Filter panel sections
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Fetch products on sale
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await productService.list({ on_sale: true, limit: 1000, market });
        const fetched = response.products || [];
        setProducts(fetched);
        // Initialise price range to actual product max on first load
        if (fetched.length > 0) {
          const max = Math.ceil(Math.max(...fetched.map(p => p.price || 0)) / 100) * 100;
          setPriceRange([0, max]);
        }
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load sale products. Please check your connection and try again.');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [market]);

  // ─── Derived values ──────────────────────────────────────────────────────────

  /** Actual maximum price across all fetched products. */
  const maxPrice = useMemo(() => {
    if (products.length === 0) return 1000;
    return Math.ceil(Math.max(...products.map(p => p.price || 0)) / 100) * 100;
  }, [products]);

  /** Maximum discount % across all sale products — shown in hero. */
  const maxDiscountPct = useMemo(() => {
    if (products.length === 0) return 0;
    return Math.round(
      Math.max(
        ...products.map(p => {
          const orig = p.original_price || p.originalPrice || 0;
          return orig > p.price ? ((orig - p.price) / orig) * 100 : 0;
        })
      )
    );
  }, [products]);

  /** Filter options derived from the full product set. */
  const availableColors = useMemo(
    () => [...new Set(products.flatMap(p => p.colors || []))].sort(),
    [products]
  );
  const availableSizes = useMemo(
    () => [...new Set(products.flatMap(p => p.sizes || []))],
    [products]
  );
  const availableMaterials = useMemo(
    () => [...new Set(products.map(p => p.material).filter(Boolean))].sort(),
    [products]
  );
  const availableSubcategories = useMemo(
    () => [...new Set(products.map(p => p.subcategory).filter(Boolean))].sort(),
    [products]
  );

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) newExpanded.delete(section);
    else newExpanded.add(section);
    setExpandedSections(newExpanded);
  };

  const toggleArrayFilter = (array: string[], setter: (arr: string[]) => void, value: string) => {
    setter(array.includes(value) ? array.filter(v => v !== value) : [...array, value]);
  };

  // ─── Filter + sort ───────────────────────────────────────────────────────────

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => p.on_sale || p.onSale);

    if (searchQuery.trim()) {
      filtered = filtered.filter(p => productMatchesSearchQuery(p, searchQuery));
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (selectedGender !== 'all') {
      filtered = filtered.filter(p => p.gender === selectedGender || p.gender === 'unisex');
    }

    // Price range — only apply if user has changed from defaults
    const priceMax = priceRange[1] || maxPrice;
    filtered = filtered.filter(p => {
      const price = p.price || 0;
      return price >= priceRange[0] && price <= priceMax;
    });

    if (selectedColors.length > 0) {
      filtered = filtered.filter(p => p.colors.some(c => selectedColors.includes(c)));
    }
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
    }
    if (selectedMaterials.length > 0) {
      filtered = filtered.filter(p => selectedMaterials.includes(p.material));
    }
    if (selectedSubcategories.length > 0) {
      filtered = filtered.filter(p => selectedSubcategories.includes(p.subcategory));
    }
    if (minRating > 0) {
      filtered = filtered.filter(p => p.rating >= minRating);
    }
    if (showNewArrivals) {
      filtered = filtered.filter(p => p.new_arrival || p.newArrival);
    }
    if (showFeatured) {
      filtered = filtered.filter(p => p.featured);
    }

    // Badge filter — product.badge is a single string field
    if (selectedBadges.length > 0) {
      filtered = filtered.filter(p =>
        p.badge && selectedBadges.some(b => b.toLowerCase() === p.badge!.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case 'discount':
        filtered.sort((a, b) => {
          const origA = a.original_price || a.originalPrice || a.price;
          const origB = b.original_price || b.originalPrice || b.price;
          const discountA = origA > a.price ? ((origA - a.price) / origA) * 100 : 0;
          const discountB = origB > b.price ? ((origB - b.price) / origB) * 100 : 0;
          return discountB - discountA;
        });
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) =>
          ((b.new_arrival || b.newArrival) ? 1 : 0) - ((a.new_arrival || a.newArrival) ? 1 : 0)
        );
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, selectedGender, priceRange, maxPrice, sortBy, selectedColors, selectedSizes, selectedMaterials, selectedSubcategories, minRating, showNewArrivals, showFeatured, selectedBadges]);

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'All' ||
    selectedGender !== 'all' ||
    priceRange[0] !== 0 ||
    priceRange[1] !== maxPrice ||
    selectedColors.length > 0 ||
    selectedSizes.length > 0 ||
    selectedMaterials.length > 0 ||
    selectedSubcategories.length > 0 ||
    minRating > 0 ||
    selectedBadges.length > 0 ||
    showNewArrivals ||
    showFeatured;

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedGender('all');
    setPriceRange([0, maxPrice]);
    setSortBy('discount');
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedMaterials([]);
    setSelectedSubcategories([]);
    setMinRating(0);
    setShowOnSale(true);
    setShowNewArrivals(false);
    setShowFeatured(false);
    setSelectedBadges([]);
  };

  return (
    <div className="min-h-screen w-full min-w-0 bg-background pt-page-nav pb-mobile-nav">
      {/* Breadcrumb */}
      <div className="border-b border-foreground/5 bg-background">
        <div className="page-container py-3">
          <div className="flex items-center gap-2 text-xs text-foreground/50">
            <button onClick={() => navigate('/')} className="hover:text-foreground transition-colors uppercase">
              Home
            </button>
            <ChevronRight size={12} />
            <span className="text-foreground uppercase">Sale</span>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="border-b border-foreground/5 bg-gradient-to-b from-red-50 to-transparent">
        <div className="w-full px-4 md:px-6 lg:px-12 xl:px-16 py-12 md:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Tag size={24} className="text-red-600" />
              <span className="text-xs uppercase tracking-[0.3em] text-red-600">Sale</span>
            </div>
            <h1 className="text-4xl md:text-6xl uppercase tracking-[0.2em] mb-6">
              {maxDiscountPct > 0 ? `Up to ${maxDiscountPct}% Off` : 'Sale'}
            </h1>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              Discover incredible deals on premium fashion. Limited time offers.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-foreground/60">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-600"></div>
                <span>{loading ? '...' : `${products.length} Items`}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                <span>Easy Returns</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 md:px-6 lg:px-12 xl:px-16 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-foreground/70">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden px-4 py-2 border border-foreground/20 hover:border-foreground transition-colors flex items-center gap-2"
              >
                <SlidersHorizontal size={16} />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-primary"></span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="flex flex-col gap-2">
                <span className="text-xs uppercase tracking-wider text-foreground/60">Sort By</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-foreground/20 bg-background focus:outline-none focus:border-foreground transition-colors cursor-pointer text-sm"
                >
                  <option value="discount">Highest Discount</option>
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 flex flex-wrap items-center gap-2"
            >
              <span className="text-xs text-foreground/60">Active filters:</span>

              {selectedGender !== 'all' && (
                <span className="px-3 py-1 bg-foreground text-background text-xs flex items-center gap-2">
                  {selectedGender}
                  <button onClick={() => setSelectedGender('all')} className="hover:opacity-70"><X size={12} /></button>
                </span>
              )}

              {selectedCategory !== 'All' && (
                <span className="px-3 py-1 bg-foreground text-background text-xs flex items-center gap-2">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')} className="hover:opacity-70"><X size={12} /></button>
                </span>
              )}

              {selectedColors.map(color => (
                <span key={color} className="px-3 py-1 bg-foreground text-background text-xs flex items-center gap-2">
                  {color}
                  <button onClick={() => toggleArrayFilter(selectedColors, setSelectedColors, color)} className="hover:opacity-70"><X size={12} /></button>
                </span>
              ))}

              {selectedSizes.map(size => (
                <span key={size} className="px-3 py-1 bg-foreground text-background text-xs flex items-center gap-2">
                  Size: {size}
                  <button onClick={() => toggleArrayFilter(selectedSizes, setSelectedSizes, size)} className="hover:opacity-70"><X size={12} /></button>
                </span>
              ))}

              {selectedBadges.map(badge => (
                <span key={badge} className="px-3 py-1 bg-[#B4770E] text-background text-xs flex items-center gap-2">
                  {badge}
                  <button onClick={() => toggleArrayFilter(selectedBadges, setSelectedBadges, badge)} className="hover:opacity-70"><X size={12} /></button>
                </span>
              ))}

              {(priceRange[0] !== 0 || priceRange[1] !== maxPrice) && (
                <span className="px-3 py-1 bg-foreground text-background text-xs flex items-center gap-2">
                  ₹{(priceRange[0] * 75).toLocaleString()} – ₹{(priceRange[1] * 75).toLocaleString()}
                  <button onClick={() => setPriceRange([0, maxPrice])} className="hover:opacity-70"><X size={12} /></button>
                </span>
              )}

              <button onClick={clearAllFilters} className="text-xs text-foreground/60 hover:text-foreground underline ml-2">
                Clear all
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Main Content: Sidebar + Products */}
        <div className="flex min-w-0 gap-8 items-start">
          {/* Desktop Sidebar */}
          <FilterSidebar
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            selectedGender={selectedGender}
            priceRange={priceRange}
            selectedColors={selectedColors}
            selectedSizes={selectedSizes}
            selectedMaterials={selectedMaterials}
            selectedSubcategories={selectedSubcategories}
            minRating={minRating}
            showOnSale={showOnSale}
            showNewArrivals={showNewArrivals}
            showFeatured={showFeatured}
            selectedBadges={selectedBadges}
            setSelectedBadges={setSelectedBadges}
            availableColors={availableColors}
            availableSizes={availableSizes}
            availableMaterials={availableMaterials}
            availableSubcategories={availableSubcategories}
            expandedSections={expandedSections}
            setSearchQuery={setSearchQuery}
            setSelectedCategory={setSelectedCategory}
            setSelectedGender={setSelectedGender}
            setPriceRange={setPriceRange}
            setSelectedColors={setSelectedColors}
            setSelectedSizes={setSelectedSizes}
            setSelectedMaterials={setSelectedMaterials}
            setSelectedSubcategories={setSelectedSubcategories}
            setMinRating={setMinRating}
            setShowOnSale={setShowOnSale}
            setShowNewArrivals={setShowNewArrivals}
            setShowFeatured={setShowFeatured}
            toggleSection={toggleSection}
            toggleArrayFilter={toggleArrayFilter}
            clearAllFilters={clearAllFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Mobile Filter Panel */}
          <MobileFilterPanel
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            selectedGender={selectedGender}
            priceRange={priceRange}
            selectedColors={selectedColors}
            selectedSizes={selectedSizes}
            showOnSale={showOnSale}
            showNewArrivals={showNewArrivals}
            showFeatured={showFeatured}
            selectedBadges={selectedBadges}
            setSearchQuery={setSearchQuery}
            setSelectedCategory={setSelectedCategory}
            setSelectedGender={setSelectedGender}
            setPriceRange={setPriceRange}
            toggleArrayFilter={toggleArrayFilter}
            setSelectedColors={setSelectedColors}
            setSelectedSizes={setSelectedSizes}
            setShowOnSale={setShowOnSale}
            setShowNewArrivals={setShowNewArrivals}
            setShowFeatured={setShowFeatured}
            setSelectedBadges={setSelectedBadges}
            clearAllFilters={clearAllFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto"></div>
                <p className="mt-4 text-foreground/60">Loading sale products…</p>
              </div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
                <p className="text-foreground/70 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-foreground text-background hover:bg-foreground/90 transition-all uppercase tracking-widest text-xs"
                >
                  Try Again
                </button>
              </motion.div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.02 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-foreground/60 mb-6">No sale products found matching your filters.</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-foreground text-background hover:bg-foreground/90 transition-all uppercase tracking-widest text-xs"
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
