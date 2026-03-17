import { motion } from 'motion/react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Footer } from '../components/Footer';
import { FilterSidebar } from '../components/FilterSidebar';
import { MobileFilterPanel } from '../components/MobileFilterPanel';
import { sortOptions, extractFilterOptions, getSubcategoriesForCategory } from '../utils/filterConfig';
import { PromotionalOffers } from '../components/PromotionalOffers';
import { productService } from '../services/productService';
import { Product } from '../types/product';

export function CategoryPage() {
  const { gender, category } = useParams<{ gender: string; category?: string }>();
  const [searchParams] = useSearchParams();
  const giftOnly = searchParams.get('gift') === 'true';
  const navigate = useNavigate();
  const validGenders = new Set(['women', 'men', 'all']);
  const normalizedGender = gender?.toLowerCase();
  const hasValidGender = normalizedGender ? validGenders.has(normalizedGender) : false;
  const looksLikeObjectId = !!gender && /^[a-f0-9]{24}$/i.test(gender);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // All filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All');
  const [selectedGender, setSelectedGender] = useState<'all' | 'women' | 'men'>(gender as 'all' | 'women' | 'men' || 'all');
  const [priceRange, setPriceRange] = useState([0, 10000]); // Increased max to accommodate all products
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

  // Fetch products
  useEffect(() => {
    if (gender && !hasValidGender) {
      if (looksLikeObjectId) {
        navigate('/all-products', { replace: true });
      } else {
        navigate(`/all-products?category=${encodeURIComponent(gender)}`, { replace: true });
      }
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params: any = { limit: 1000 };
        if (gender && gender !== 'all') {
          params.gender = gender;
        }
        if (category) {
          // Capitalize category to match database format (e.g., "dresses" -> "Dresses")
          params.category = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
        }
        if (giftOnly) {
          params.gift = true;
        }
        const response = await productService.list(params);
        setProducts(response.products || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [gender, category, giftOnly, hasValidGender, looksLikeObjectId, navigate]);

  // Reset filters when URL parameters change
  useEffect(() => {
    if (!hasValidGender) return;
    setSelectedCategory(category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All');
    setSelectedGender(gender as 'all' | 'women' | 'men' || 'all');
  }, [gender, category, hasValidGender]);

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

  // Compute available filter options dynamically from fetched products
  const { colors: availableColors, sizes: availableSizes, materials: availableMaterials } = useMemo(
    () => extractFilterOptions(products),
    [products]
  );
  const availableSubcategories = useMemo(
    () => getSubcategoriesForCategory(products, selectedCategory, selectedGender),
    [products, selectedCategory, selectedGender]
  );

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Base filter by gender from URL
    if (gender) {
      filtered = filtered.filter(p => p.gender.toLowerCase() === gender.toLowerCase() || p.gender === 'unisex');
    }

    // Base filter by category from URL
    if (category) {
      filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter from sidebar (if different from URL)
    if (selectedCategory !== 'All' && (!category || selectedCategory.toLowerCase() !== category.toLowerCase())) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Gender filter from sidebar (if different from URL)
    if (selectedGender !== 'all' && (!gender || selectedGender.toLowerCase() !== gender.toLowerCase())) {
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
  }, [products, gender, category, searchQuery, selectedCategory, selectedGender, priceRange, sortBy, selectedColors, selectedSizes, selectedMaterials, selectedSubcategories, minRating, showOnSale, showNewArrivals, showFeatured]);

  // Check if any filters are active
  const hasActiveFilters = 
    searchQuery !== '' || 
    (selectedCategory !== 'All' && (!category || selectedCategory.toLowerCase() !== category.toLowerCase())) || 
    (selectedGender !== 'all' && (!gender || selectedGender.toLowerCase() !== gender.toLowerCase())) || 
    priceRange[0] !== 0 || 
    priceRange[1] !== 10000 ||
    selectedColors.length > 0 ||
    selectedSizes.length > 0 ||
    selectedMaterials.length > 0 ||
    selectedSubcategories.length > 0 ||
    minRating > 0 ||
    showOnSale ||
    showNewArrivals ||
    showFeatured;

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory(category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All');
    setSelectedGender(gender as 'all' | 'women' | 'men' || 'all');
    setPriceRange([0, 10000]);
    setSortBy('featured');
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedMaterials([]);
    setSelectedSubcategories([]);
    setMinRating(0);
    setShowOnSale(false);
    setShowNewArrivals(false);
    setShowFeatured(false);
  };

  const pageTitle = !hasValidGender
    ? 'Collection'
    : giftOnly && gender === 'women'
    ? 'Gift For Her'
    : giftOnly && gender === 'men'
    ? 'Gift For Him'
    : category 
    ? `${category.charAt(0).toUpperCase() + category.slice(1)} - ${gender?.charAt(0).toUpperCase() + gender?.slice(1)}`
    : `${gender?.charAt(0).toUpperCase() + gender?.slice(1)}'s Collection`;

  return (
    <div className="min-h-screen bg-background pt-24">
      {/* Breadcrumb */}
      <div className="border-b border-foreground/5 bg-background">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-foreground/50">
            <button onClick={() => navigate('/')} className="hover:text-foreground transition-colors uppercase">
              Home
            </button>
            <ChevronRight size={12} />
            <button 
              onClick={() => navigate(`/category/${gender}`)}
              className="hover:text-foreground transition-colors uppercase capitalize"
            >
              {gender}
            </button>
            {category && (
              <>
                <ChevronRight size={12} />
                <span className="text-xs text-foreground uppercase capitalize">{category}</span>
              </>
            )}
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
              <h1 className="text-3xl md:text-4xl mb-2">{pageTitle}</h1>
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
              
              {selectedGender !== 'all' && selectedGender !== gender && (
                <span className="px-3 py-1 bg-foreground text-background text-xs flex items-center gap-2">
                  {selectedGender}
                  <button onClick={() => setSelectedGender(gender as any || 'all')} className="hover:opacity-70">
                    <X size={12} />
                  </button>
                </span>
              )}
              
              {selectedCategory !== 'All' && (!category || selectedCategory.toLowerCase() !== category.toLowerCase()) && (
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
              
              {(priceRange[0] !== 0 || priceRange[1] !== 10000) && (
                <span className="px-3 py-1 bg-foreground text-background text-xs flex items-center gap-2">
                  ₹{(priceRange[0] * 75).toLocaleString()} - ₹{(priceRange[1] * 75).toLocaleString()}
                  <button onClick={() => setPriceRange([0, 10000])} className="hover:opacity-70">
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

        <PromotionalOffers filterGender={gender as 'women' | 'men' | 'all'} selectedCategory={category} />

        {/* Main Content: Sidebar + Products */}
        <div className="flex gap-8 items-start">
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
            setSelectedBadges={setSelectedBadges}
            toggleSection={toggleSection}
            toggleArrayFilter={toggleArrayFilter}
            clearAllFilters={clearAllFilters}
            hasActiveFilters={hasActiveFilters}
            availableColors={availableColors}
            availableSizes={availableSizes}
            availableMaterials={availableMaterials}
            availableSubcategories={availableSubcategories}
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
            availableColors={availableColors}
            availableSizes={availableSizes}
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <p className="text-foreground/60 mb-6">No products found in this category.</p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-foreground text-background hover:bg-foreground/90 transition-all uppercase tracking-widest text-xs mr-3"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 border border-foreground/20 hover:border-foreground transition-all uppercase tracking-widest text-xs"
                >
                  Back to Home
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Related Categories */}
        {category && filteredProducts.length > 0 && (
          <div className="mt-12 pt-8 border-t border-foreground/10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-xs uppercase tracking-[0.2em] mb-4 text-foreground/60">Shop More Categories</h2>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Shoes', 'Accessories', 'Bags', 'Jewelry'].map((cat) => {
                  if (cat.toLowerCase() === category.toLowerCase()) return null;
                  return (
                    <motion.button
                      key={cat}
                      onClick={() => navigate(`/category/${gender}/${cat.toLowerCase()}`)}
                      whileHover={{ y: -2 }}
                      className="px-5 py-2 border border-foreground/10 hover:border-foreground hover:bg-foreground hover:text-background transition-all whitespace-nowrap flex-shrink-0 text-xs uppercase tracking-wider"
                    >
                      {cat}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}