import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Search, SlidersHorizontal, X, ChevronDown, Star } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Footer } from '../components/Footer';
import { FilterSidebar } from '../components/FilterSidebar';
import { MobileFilterPanel } from '../components/MobileFilterPanel';
import { sortOptions } from '../utils/filterConfig';
import { productService } from '../services/productService';
import { Product } from '../types/product';

export function AllProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGender, setSelectedGender] = useState<'all' | 'women' | 'men'>('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  
  // Advanced filters
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [showOnSale, setShowOnSale] = useState(false);
  const [showNewArrivals, setShowNewArrivals] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  
  // Filter panel sections
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.list({ limit: 1000 });
        setProducts(response.data || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const toggleArrayFilter = (array: string[], setter: (arr: string[]) => void, value: string) => {
    if (array.includes(value)) {
      setter(array.filter(v => v !== value));
    } else {
      setter([...array, value]);
    }
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Gender filter
    if (selectedGender !== 'all') {
      filtered = filtered.filter(p => p.gender === selectedGender || p.gender === 'unisex');
    }

    // Price range filter
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Advanced filters
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
    if (showOnSale) {
      filtered = filtered.filter(p => p.on_sale || p.onSale);
    }
    if (showNewArrivals) {
      filtered = filtered.filter(p => p.new_arrival || p.newArrival);
    }
    if (showFeatured) {
      filtered = filtered.filter(p => p.featured);
    }
    if (selectedBadges.length > 0) {
      filtered = filtered.filter(p => p.badge && selectedBadges.includes(p.badge));
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => ((b.new_arrival || b.newArrival) ? 1 : 0) - ((a.new_arrival || a.newArrival) ? 1 : 0));
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
  }, [products, searchQuery, selectedCategory, selectedGender, priceRange, sortBy, selectedColors, selectedSizes, selectedMaterials, selectedSubcategories, minRating, showOnSale, showNewArrivals, showFeatured, selectedBadges]);

  // Check if any filters are active
  const hasActiveFilters = 
    searchQuery !== '' || 
    selectedCategory !== 'All' || 
    selectedGender !== 'all' || 
    priceRange[0] !== 0 || 
    priceRange[1] !== 1000 ||
    selectedColors.length > 0 ||
    selectedSizes.length > 0 ||
    selectedMaterials.length > 0 ||
    selectedSubcategories.length > 0 ||
    minRating > 0 ||
    showOnSale ||
    showNewArrivals ||
    showFeatured ||
    selectedBadges.length > 0;

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedGender('all');
    setPriceRange([0, 1000]);
    setSortBy('featured');
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedMaterials([]);
    setSelectedSubcategories([]);
    setMinRating(0);
    setShowOnSale(false);
    setShowNewArrivals(false);
    setShowFeatured(false);
    setSelectedBadges([]);
  };

  return (
    <div className="min-h-screen bg-background pt-[72px]">
      {/* Breadcrumb */}
      <div className="border-b border-foreground/5 bg-background">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-foreground/50">
            <button onClick={() => navigate('/')} className="hover:text-foreground transition-colors uppercase">
              Home
            </button>
            <ChevronRight size={12} />
            <span className="text-foreground uppercase">All Products</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl mb-2">All Products</h1>
              <p className="text-foreground/70">
                Showing {filteredProducts.length} of {products.length} {filteredProducts.length === 1 ? 'product' : 'products'}
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
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-foreground/20 bg-background focus:outline-none focus:border-foreground transition-colors cursor-pointer text-sm"
                >
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
                  <button onClick={() => setSelectedGender('all')} className="hover:opacity-70">
                    <X size={12} />
                  </button>
                </span>
              )}
              
              {selectedCategory !== 'All' && (
                <span className="px-3 py-1 bg-foreground text-background text-xs flex items-center gap-2">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')} className="hover:opacity-70">
                    <X size={12} />
                  </button>
                </span>
              )}
              
              {selectedColors.map(color => (
                <span key={color} className="px-3 py-1 bg-foreground text-background text-xs flex items-center gap-2">
                  {color}
                  <button onClick={() => toggleArrayFilter(selectedColors, setSelectedColors, color)} className="hover:opacity-70">
                    <X size={12} />
                  </button>
                </span>
              ))}
              
              {selectedSizes.map(size => (
                <span key={size} className="px-3 py-1 bg-foreground text-background text-xs flex items-center gap-2">
                  Size: {size}
                  <button onClick={() => toggleArrayFilter(selectedSizes, setSelectedSizes, size)} className="hover:opacity-70">
                    <X size={12} />
                  </button>
                </span>
              ))}
              
              {selectedBadges.map(badge => (
                <span key={badge} className="px-3 py-1 bg-[#B4770E] text-background text-xs flex items-center gap-2">
                  {badge}
                  <button onClick={() => toggleArrayFilter(selectedBadges, setSelectedBadges, badge)} className="hover:opacity-70">
                    <X size={12} />
                  </button>
                </span>
              ))}
              
              {(priceRange[0] !== 0 || priceRange[1] !== 1000) && (
                <span className="px-3 py-1 bg-foreground text-background text-xs flex items-center gap-2">
                  ₹{(priceRange[0] * 75).toLocaleString()} - ₹{(priceRange[1] * 75).toLocaleString()}
                  <button onClick={() => setPriceRange([0, 1000])} className="hover:opacity-70">
                    <X size={12} />
                  </button>
                </span>
              )}

              <button
                onClick={clearAllFilters}
                className="text-xs text-foreground/60 hover:text-foreground underline ml-2"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Main Content: Sidebar + Products */}
        <div className="flex gap-8 items-start">
          {/* Desktop Sidebar - Sticky with bottom constraint */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:block w-64 flex-shrink-0 space-y-8 sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto pb-8"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(0,0,0,0.2) transparent',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <FilterSidebar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedGender={selectedGender}
              setSelectedGender={setSelectedGender}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedColors={selectedColors}
              setSelectedColors={setSelectedColors}
              selectedSizes={selectedSizes}
              setSelectedSizes={setSelectedSizes}
              selectedMaterials={selectedMaterials}
              setSelectedMaterials={setSelectedMaterials}
              selectedSubcategories={selectedSubcategories}
              setSelectedSubcategories={setSelectedSubcategories}
              minRating={minRating}
              setMinRating={setMinRating}
              showOnSale={showOnSale}
              setShowOnSale={setShowOnSale}
              showNewArrivals={showNewArrivals}
              setShowNewArrivals={setShowNewArrivals}
              showFeatured={showFeatured}
              setShowFeatured={setShowFeatured}
              selectedBadges={selectedBadges}
              setSelectedBadges={setSelectedBadges}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              toggleArrayFilter={toggleArrayFilter}
              hasActiveFilters={hasActiveFilters}
              clearAllFilters={clearAllFilters}
            />
          </motion.aside>

          {/* Mobile Filter Panel */}
          <MobileFilterPanel
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedGender={selectedGender}
            setSelectedGender={setSelectedGender}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
            selectedColors={selectedColors}
            setSelectedColors={setSelectedColors}
            selectedSizes={selectedSizes}
            setSelectedSizes={setSelectedSizes}
            selectedMaterials={selectedMaterials}
            setSelectedMaterials={setSelectedMaterials}
            selectedSubcategories={selectedSubcategories}
            setSelectedSubcategories={setSelectedSubcategories}
            minRating={minRating}
            setMinRating={setMinRating}
            showOnSale={showOnSale}
            setShowOnSale={setShowOnSale}
            showNewArrivals={showNewArrivals}
            setShowNewArrivals={setShowNewArrivals}
            showFeatured={showFeatured}
            setShowFeatured={setShowFeatured}
            selectedBadges={selectedBadges}
            setSelectedBadges={setSelectedBadges}
            expandedSections={expandedSections}
            toggleSection={toggleSection}
            toggleArrayFilter={toggleArrayFilter}
            hasActiveFilters={hasActiveFilters}
            clearAllFilters={clearAllFilters}
          />

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <Search size={64} className="mx-auto text-foreground/20 mb-4" />
                <h3 className="text-2xl mb-2">No products found</h3>
                <p className="text-foreground/60 mb-6">
                  Try adjusting your filters or search query
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearAllFilters}
                  className="px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Clear Filters
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}