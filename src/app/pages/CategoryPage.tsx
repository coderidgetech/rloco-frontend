import { motion } from 'motion/react';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { MobileProductCard, MobileProductCardData } from '../components/mobile/MobileProductCard';
import { useIsMobile } from '../hooks/useIsMobile';
import { Footer } from '../components/Footer';
import { FilterSidebar } from '../components/FilterSidebar';
import { MobileFilterPanel } from '../components/MobileFilterPanel';
import {
  sortOptions,
  extractFilterOptions,
  getSubcategoriesForCategory,
  productMatchesSearchQuery,
  categoriesByGender,
} from '../utils/filterConfig';
import { PromotionalOffers } from '../components/PromotionalOffers';
import { productService } from '../services/productService';
import { Product } from '../types/product';
import { useCurrency } from '../context/CurrencyContext';

export function CategoryPage() {
  const { market, formatPrice } = useCurrency();
  const location = useLocation();
  const isGiftHer = location.pathname === '/gift-for-her';
  const isGiftHim = location.pathname === '/gift-for-him';
  const isGiftRoute = isGiftHer || isGiftHim;
  const isMobile = useIsMobile();
  const { gender, category } = useParams<{ gender: string; category?: string }>();
  const [searchParams] = useSearchParams();
  const giftOnly = searchParams.get('gift') === 'true' || isGiftRoute;
  const navigate = useNavigate();
  const routeGender = (isGiftHer ? 'women' : isGiftHim ? 'men' : gender) as string | undefined;
  const validGenders = new Set(['women', 'men', 'all']);
  const normalizedGender = routeGender?.toLowerCase();
  const hasValidGender = isGiftRoute || (!!normalizedGender && validGenders.has(normalizedGender));
  const looksLikeObjectId = !!gender && /^[a-f0-9]{24}$/i.test(gender);

  // Canonicalize the URL category against the known list, so a bad slug (e.g.
  // /category/women/women, where the gender word lands in the category slot)
  // doesn't filter the catalog down to a non-existent category.
  const canonicalUrlCategory = useMemo(() => {
    if (!category) return 'All';
    const match = categoriesByGender.all.find(
      (c) => c.toLowerCase() === category.toLowerCase(),
    );
    return match && match !== 'All' ? match : 'All';
  }, [category]);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // All filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(canonicalUrlCategory);
  const [selectedGender, setSelectedGender] = useState<'all' | 'women' | 'men'>(
    (isGiftHer ? 'women' : isGiftHim ? 'men' : (gender as 'all' | 'women' | 'men')) || 'all'
  );
  const [priceRange, setPriceRange] = useState([0, 1000]); // synced to catalog max once products load
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
    if (isGiftRoute) return;
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
        // Fetch by GENDER only (driven by the filter, not the URL category) and do
        // all category/subcategory filtering client-side. This lets the sidebar
        // category and gender filters actually switch the result set.
        const params: any = { limit: 1000, market };
        if (selectedGender && selectedGender !== 'all') {
          params.gender = selectedGender;
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
  }, [selectedGender, giftOnly, hasValidGender, looksLikeObjectId, navigate, market, gender, isGiftRoute]);

  // Reset filters when URL parameters change
  useEffect(() => {
    if (!hasValidGender && !isGiftRoute) return;
    setSelectedCategory(canonicalUrlCategory);
    if (routeGender && routeGender !== 'all') {
      setSelectedGender(routeGender as 'all' | 'women' | 'men');
    } else if (isGiftRoute) {
      setSelectedGender(isGiftHer ? 'women' : 'men');
    }
  }, [gender, category, hasValidGender, isGiftRoute, routeGender, isGiftHer, canonicalUrlCategory]);

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

  // Price-slider upper bound derived from the catalog (USD, rounded up to 100), so
  // the slider range always covers the products instead of a fixed 1000/10000.
  const maxPrice = useMemo(() => {
    const m = products.reduce((acc, p) => Math.max(acc, p.price), 0);
    return m > 0 ? Math.ceil(m / 100) * 100 : 1000;
  }, [products]);

  // Re-sync the price range to the catalog max whenever the product set changes.
  useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    // products is already gender-scoped by the fetch (selectedGender), so we only
    // apply category + the advanced filters client-side here.
    let filtered = [...products];

    if (searchQuery.trim()) {
      filtered = filtered.filter((p) => productMatchesSearchQuery(p, searchQuery));
    }

    // Category filter (seeded from the URL, switchable via the sidebar)
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
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
      filtered = filtered.filter(p => {
        const tags = Array.isArray(p.badges) ? p.badges : (p.badge ? [p.badge] : []);
        return tags.some(b => selectedBadges.includes(b));
      });
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
  }, [
    products,
    routeGender,
    category,
    searchQuery,
    selectedCategory,
    selectedGender,
    priceRange,
    sortBy,
    selectedColors,
    selectedSizes,
    selectedMaterials,
    selectedSubcategories,
    minRating,
    showOnSale,
    showNewArrivals,
    showFeatured,
    selectedBadges,
  ]);

  // Check if any filters are active
  const urlGender = (routeGender as 'all' | 'women' | 'men') || 'all';
  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'All' ||
    selectedGender !== urlGender ||
    priceRange[0] !== 0 ||
    priceRange[1] !== maxPrice ||
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
    setSelectedCategory(canonicalUrlCategory);
    setSelectedGender(urlGender);
    setPriceRange([0, maxPrice]);
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

  const pageTitle = !hasValidGender
    ? 'Collection'
    : giftOnly && selectedGender === 'women'
    ? 'Gifts for Her'
    : giftOnly && selectedGender === 'men'
    ? 'Gifts for Him'
    : selectedCategory !== 'All'
    ? selectedCategory
    : selectedGender === 'all'
    ? 'All Products'
    : `${selectedGender.charAt(0).toUpperCase()}${selectedGender.slice(1)}'s Collection`;

  return (
    <div className="min-h-screen w-full min-w-0 bg-background pt-page-nav pb-mobile-nav">
      {isGiftRoute && (
        <section className="border-b border-foreground/10 bg-gradient-to-b from-primary/5 to-background">
          <div className="page-container py-10 md:py-14 text-center">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[10px] uppercase tracking-[0.35em] text-primary mb-2"
            >
              Curated gifts
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-3xl md:text-4xl font-light tracking-tight mb-3"
            >
              {isGiftHer ? 'Gifts for Her' : 'Gifts for Him'}
            </motion.h2>
            <p className="text-foreground/60 max-w-xl mx-auto text-sm md:text-base">
              Gift-worthy pieces, ready to make an impression.
            </p>
          </div>
        </section>
      )}

      {/* Page header */}
      <div className="border-b border-foreground/5">
        <div className="page-container">
          {/* Consolidated: title, Filter, Sort — always one line, never scrolls
              (title truncates first if space is tight). */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between gap-2 py-3"
          >
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-medium tracking-tight truncate">{pageTitle}</h1>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Mobile Filter Toggle — soft squircle with an active-filter dot */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                aria-label="Filters"
                className="md:hidden shrink-0 relative w-9 h-9 rounded-xl flex items-center justify-center bg-muted hover:bg-muted/70 transition-colors"
              >
                <SlidersHorizontal size={15} className="text-foreground/70" />
                {hasActiveFilters && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />}
              </button>

              {/* Sort Dropdown — same squircle language as the filter button */}
              <div className="relative shrink-0 h-9 rounded-xl bg-muted overflow-hidden">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-9 w-full max-w-[110px] sm:max-w-none pl-3 pr-8 rounded-xl bg-transparent focus:outline-none cursor-pointer text-xs font-medium appearance-none"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-0 top-0 h-9 w-8 rounded-xl bg-foreground flex items-center justify-center">
                  <ChevronDown size={13} className="text-background" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 flex flex-wrap items-center gap-2 pb-1"
            >
              <span className="text-xs text-foreground/60 mr-0.5">Active Filters:</span>

              {selectedGender !== urlGender && (
                <span className="pl-3.5 pr-2.5 py-1.5 rounded-full bg-muted text-foreground text-xs flex items-center gap-1.5">
                  {selectedGender}
                  <button onClick={() => setSelectedGender(urlGender)} className="hover:opacity-70">
                    <X size={12} />
                  </button>
                </span>
              )}

              {selectedCategory !== 'All' && (
                <span className="pl-3.5 pr-2.5 py-1.5 rounded-full bg-foreground text-background text-xs flex items-center gap-1.5">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')} className="hover:opacity-70">
                    <X size={12} />
                  </button>
                </span>
              )}

              {selectedColors.map(color => (
                <span key={color} className="pl-3.5 pr-2.5 py-1.5 rounded-full bg-foreground text-background text-xs flex items-center gap-1.5">
                  {color}
                  <button onClick={() => toggleArrayFilter(selectedColors, setSelectedColors, color)} className="hover:opacity-70">
                    <X size={12} />
                  </button>
                </span>
              ))}

              {selectedSizes.map(size => (
                <span key={size} className="pl-3.5 pr-2.5 py-1.5 rounded-full bg-foreground text-background text-xs flex items-center gap-1.5">
                  Size: {size}
                  <button onClick={() => toggleArrayFilter(selectedSizes, setSelectedSizes, size)} className="hover:opacity-70">
                    <X size={12} />
                  </button>
                </span>
              ))}

              {selectedBadges.map(badge => (
                <span key={badge} className="pl-3.5 pr-2.5 py-1.5 rounded-full bg-foreground text-background text-xs flex items-center gap-1.5">
                  {badge}
                  <button onClick={() => toggleArrayFilter(selectedBadges, setSelectedBadges, badge)} className="hover:opacity-70">
                    <X size={12} />
                  </button>
                </span>
              ))}

              {(priceRange[0] !== 0 || priceRange[1] !== 10000) && (
                <span className="pl-3.5 pr-2.5 py-1.5 rounded-full bg-foreground text-background text-xs flex items-center gap-1.5">
                  {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                  <button onClick={() => setPriceRange([0, 10000])} className="hover:opacity-70">
                    <X size={12} />
                  </button>
                </span>
              )}

              <button
                onClick={clearAllFilters}
                className="text-xs text-foreground/60 hover:text-foreground underline ml-1"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <div className="page-container">
        <PromotionalOffers filterGender={routeGender as 'women' | 'men' | 'all'} selectedCategory={category} />

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
            expandedSections={expandedSections}
            setSearchQuery={setSearchQuery}
            setSelectedCategory={setSelectedCategory}
            setSelectedGender={setSelectedGender}
            setPriceRange={setPriceRange}
            maxPrice={maxPrice}
            formatPrice={formatPrice}
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
            maxPrice={maxPrice}
            formatPrice={formatPrice}
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
                {filteredProducts.map((product, index) =>
                  isMobile ? (
                    // Match the home grid card design on mobile.
                    <MobileProductCard key={product.id} product={product as MobileProductCardData} index={index} />
                  ) : (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.02 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ),
                )}
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
                      onClick={() => navigate(`/category/${routeGender}/${cat.toLowerCase()}`)}
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