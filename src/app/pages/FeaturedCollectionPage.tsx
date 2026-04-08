import { motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';
import { useState, useMemo, useEffect } from 'react';
import { Footer } from '../components/Footer';
import { Star, SlidersHorizontal, ChevronRight } from 'lucide-react';
import { FilterSidebar } from '../components/FilterSidebar';
import { MobileFilterPanel } from '../components/MobileFilterPanel';
import { sortOptions, productMatchesSearchQuery } from '../utils/filterConfig';
import { useNavigate } from 'react-router-dom';
import { useFeaturedProducts } from '../hooks/useProducts';
import { Product } from '../types/api';

export function FeaturedCollectionPage() {
  const navigate = useNavigate();
  const { products: allProducts, loading } = useFeaturedProducts(200);
  
  // All filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
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
  const [showFeatured, setShowFeatured] = useState(true); // Default to true for Featured page
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  
  // Filter panel sections
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

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
    let filtered = allProducts || []; // Start with featured items from API

    if (searchQuery.trim()) {
      filtered = filtered.filter((p) => productMatchesSearchQuery(p, searchQuery));
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
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
      filtered = filtered.filter(p => p.onSale);
    }
    if (showNewArrivals) {
      filtered = filtered.filter(p => p.newArrival);
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
        filtered.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
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
  }, [searchQuery, selectedCategories, selectedGender, priceRange, sortBy, selectedColors, selectedSizes, selectedMaterials, selectedSubcategories, minRating, showOnSale, showNewArrivals, selectedBadges]);

  // Check if any filters are active
  const hasActiveFilters = 
    searchQuery !== '' || 
    selectedCategories.length > 0 || 
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
    selectedBadges.length > 0;

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
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
    setShowFeatured(true);
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
            <span className="text-foreground uppercase">Featured Collection</span>
          </div>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="border-b border-foreground/5 bg-gradient-to-b from-[#B4770E]/5 to-transparent">
        <div className="w-full px-4 md:px-6 lg:px-12 xl:px-16 py-8 md:py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <Star size={20} className="text-[#B4770E] fill-[#B4770E]" />
              <span className="text-xs uppercase tracking-[0.3em] text-[#B4770E]">Featured</span>
            </div>
            <h1 className="text-3xl md:text-4xl uppercase tracking-[0.2em] mb-4">
              Curated Collection
            </h1>
            <p className="text-base text-foreground/60 max-w-2xl mx-auto">
              Discover our handpicked selection of premium fashion pieces
            </p>
          </motion.div>
        </div>
      </div>

      {/* Products Section */}
      <div className="w-full px-4 md:px-6 lg:px-12 xl:px-16 py-8 md:py-12">
        <div className="flex min-w-0 gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
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
              hasActiveFilters={hasActiveFilters}
              clearAllFilters={clearAllFilters}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
              toggleArrayFilter={toggleArrayFilter}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs text-foreground/60">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
              
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-foreground/10 hover:border-foreground/30 transition-colors text-sm"
              >
                <SlidersHorizontal size={16} />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-[#B4770E]" />
                )}
              </button>

              {/* Desktop Sort */}
              <div className="hidden lg:flex items-center gap-3">
                <span className="text-sm text-foreground/60">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-foreground/10 bg-background text-sm focus:outline-none focus:border-foreground/30 transition-colors"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid min-w-0 grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <Star size={64} className="mx-auto mb-4 text-foreground/20" />
                <h3 className="text-2xl mb-2">No products found</h3>
                <p className="text-foreground/60 mb-6">
                  Try adjusting your filters to see more results
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-3 bg-foreground text-background hover:bg-foreground/90 transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Panel */}
      <MobileFilterPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
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
        hasActiveFilters={hasActiveFilters}
        clearAllFilters={clearAllFilters}
        expandedSections={expandedSections}
        toggleSection={toggleSection}
        toggleArrayFilter={toggleArrayFilter}
      />

      <Footer />
    </div>
  );
}