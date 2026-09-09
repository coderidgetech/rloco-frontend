import { motion, AnimatePresence } from 'motion/react';
import { Heart, SlidersHorizontal, X } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Footer } from '../components/Footer';
import { PH } from '../lib/formPlaceholders';
import { ProductCard } from '../components/ProductCard';
import { MobileProductCard, MobileProductCardData } from '../components/mobile/MobileProductCard';
import { useIsMobile } from '../hooks/useIsMobile';

type SortOption = 'recent' | 'price-low' | 'price-high' | 'name';

export function WishlistPage() {
  const navigate = useNavigate();
  const { items } = useWishlist();
  const isMobile = useIsMobile();
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showOnSale, setShowOnSale] = useState(false);
  const [showNewArrivals, setShowNewArrivals] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Get unique values from wishlist items
  const categories = Array.from(new Set(items.map(item => item.category)));
  const genders = Array.from(new Set(items.map(item => item.gender)));
  const allColors = Array.from(new Set(items.flatMap(item => item.colors || [])));

  // Get price range from items
  const minPrice = items.length > 0 ? Math.min(...items.map(item => item.price)) : 0;
  const maxPrice = items.length > 0 ? Math.max(...items.map(item => item.price)) : 1000;

  // Initialize price range
  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  // Filter items
  const filteredItems = items.filter(item => {
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(item.category);
    const genderMatch = selectedGenders.length === 0 || selectedGenders.includes(item.gender);
    const colorMatch = selectedColors.length === 0 || (item.colors && item.colors.some(color => selectedColors.includes(color)));
    const priceMatch = item.price >= priceRange[0] && item.price <= priceRange[1];
    const saleMatch = !showOnSale || item.onSale;
    const newMatch = !showNewArrivals || item.newArrival;
    const featuredMatch = !showFeatured || item.featured;
    
    return categoryMatch && genderMatch && colorMatch && priceMatch && saleMatch && newMatch && featuredMatch;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'recent':
      default:
        return 0;
    }
  });

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleGender = (gender: string) => {
    setSelectedGenders(prev =>
      prev.includes(gender)
        ? prev.filter(c => c !== gender)
        : [...prev, gender]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedGenders([]);
    setSelectedColors([]);
    setPriceRange([minPrice, maxPrice]);
    setShowOnSale(false);
    setShowNewArrivals(false);
    setShowFeatured(false);
  };

  return (
    <div className="min-h-screen w-full min-w-0 bg-background pt-page-nav pb-mobile-nav">
      <div className="page-container pt-3 pb-6 md:pt-4 md:pb-8">
        {/* Header */}
        <div className="mb-4 md:mb-6">
          {/* Title, Filters and Sort — one row, always single-line */}
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg md:text-3xl lg:text-4xl truncate">My Wishlist</h1>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => setShowFilters(!showFilters)}
                aria-label="Filters"
                className="shrink-0 relative w-9 h-9 rounded-full flex items-center justify-center border border-foreground/15 hover:border-foreground/40 bg-background transition-colors"
              >
                <SlidersHorizontal size={15} className="text-foreground/70" />
                {(selectedCategories.length > 0 || selectedGenders.length > 0 || selectedColors.length > 0 || priceRange[0] !== minPrice || priceRange[1] !== maxPrice || showOnSale || showNewArrivals || showFeatured) && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-background" />
                )}
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="shrink-0 h-9 max-w-[100px] sm:max-w-none px-3.5 rounded-full border border-foreground/15 hover:border-foreground/40 bg-background outline-none focus:border-foreground/40 transition-colors cursor-pointer text-xs"
              >
                <option value="recent">Recently Added</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters — inline sidebar on desktop, full-screen bottom sheet on mobile
              so it doesn't push the whole page (including the empty state) down. */}
          <AnimatePresence>
            {showFilters && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowFilters(false)}
                  className="fixed inset-0 z-50 bg-black/40 lg:hidden"
                />
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-y-auto rounded-t-2xl lg:static lg:col-span-1 lg:max-h-none lg:overflow-visible lg:rounded-none"
                >
                <div className="bg-background lg:bg-muted/30 rounded-t-2xl lg:rounded-xl p-6 lg:sticky lg:top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <div className="flex items-center gap-4">
                      {(selectedCategories.length > 0 || selectedGenders.length > 0 || selectedColors.length > 0 || priceRange[0] !== minPrice || priceRange[1] !== maxPrice || showOnSale || showNewArrivals || showFeatured) && (
                        <button
                          onClick={clearFilters}
                          className="text-sm text-primary hover:underline"
                        >
                          Clear All
                        </button>
                      )}
                      <button
                        onClick={() => setShowFilters(false)}
                        className="lg:hidden p-1 -mr-1 text-muted-foreground hover:text-foreground"
                        aria-label="Close filters"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Categories */}
                  {categories.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-medium mb-3">Categories</h3>
                      <div className="space-y-2">
                        {categories.map(category => {
                          const count = items.filter(item => item.category === category).length;
                          return (
                            <label
                              key={category}
                              className="flex items-center gap-2 cursor-pointer group"
                            >
                              <input
                                type="checkbox"
                                checked={selectedCategories.includes(category)}
                                onChange={() => toggleCategory(category)}
                                className="w-4 h-4 accent-primary"
                              />
                              <span className="flex-1 text-sm group-hover:text-primary transition-colors">
                                {category}
                              </span>
                              <span className="text-xs text-muted-foreground">{count}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Genders */}
                  {genders.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-medium mb-3">Genders</h3>
                      <div className="space-y-2">
                        {genders.map(gender => {
                          const count = items.filter(item => item.gender === gender).length;
                          return (
                            <label
                              key={gender}
                              className="flex items-center gap-2 cursor-pointer group"
                            >
                              <input
                                type="checkbox"
                                checked={selectedGenders.includes(gender)}
                                onChange={() => toggleGender(gender)}
                                className="w-4 h-4 accent-primary"
                              />
                              <span className="flex-1 text-sm group-hover:text-primary transition-colors">
                                {gender}
                              </span>
                              <span className="text-xs text-muted-foreground">{count}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Colors */}
                  {allColors.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-medium mb-3">Colors</h3>
                      <div className="space-y-2">
                        {allColors.map(color => {
                          const count = items.filter(item => item.colors && item.colors.includes(color)).length;
                          return (
                            <label
                              key={color}
                              className="flex items-center gap-2 cursor-pointer group"
                            >
                              <input
                                type="checkbox"
                                checked={selectedColors.includes(color)}
                                onChange={() => toggleColor(color)}
                                className="w-4 h-4 accent-primary"
                              />
                              <span className="flex-1 text-sm group-hover:text-primary transition-colors">
                                {color}
                              </span>
                              <span className="text-xs text-muted-foreground">{count}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Price Range */}
                  {items.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-3">Price Range</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>₹{priceRange[0] * 75}</span>
                          <span>₹{priceRange[1] * 75}</span>
                        </div>
                        <input
                          type="range"
                          min={minPrice}
                          max={maxPrice}
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                          className="w-full accent-primary"
                        />
                        <div className="flex gap-2">
                          <input
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                            min={minPrice}
                            max={priceRange[1]}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-primary"
                            placeholder={PH.min}
                          />
                          <input
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                            min={priceRange[0]}
                            max={maxPrice}
                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm outline-none focus:border-primary"
                            placeholder={PH.max}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* On Sale */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">On Sale</h3>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={showOnSale}
                        onChange={() => setShowOnSale(!showOnSale)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="flex-1 text-sm group-hover:text-primary transition-colors">
                        Show On Sale
                      </span>
                    </label>
                  </div>

                  {/* New Arrivals */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">New Arrivals</h3>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={showNewArrivals}
                        onChange={() => setShowNewArrivals(!showNewArrivals)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="flex-1 text-sm group-hover:text-primary transition-colors">
                        Show New Arrivals
                      </span>
                    </label>
                  </div>

                  {/* Featured */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Featured</h3>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={showFeatured}
                        onChange={() => setShowFeatured(!showFeatured)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="flex-1 text-sm group-hover:text-primary transition-colors">
                        Show Featured
                      </span>
                    </label>
                  </div>
                </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Content */}
          <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
            {sortedItems.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center text-center py-20">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted flex items-center justify-center mb-6"
                >
                  <Heart size={64} className="text-muted-foreground" />
                </motion.div>
                <h2 className="text-xl md:text-2xl mb-3">
                  {items.length === 0 ? 'Your wishlist is empty' : 'No items match your filters'}
                </h2>
                <p className="text-sm md:text-base text-muted-foreground mb-8 max-w-md">
                  {items.length === 0 
                    ? 'Save items you love by clicking the heart icon on products'
                    : 'Try adjusting your filters to see more items'}
                </p>
                {items.length === 0 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/')}
                    className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Start Shopping
                  </motion.button>
                ) : (
                  <button
                    onClick={clearFilters}
                    className="px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              /* Items Grid — same card used everywhere else products show in a grid */
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Showing {sortedItems.length} of {items.length} items
                </p>
                <AnimatePresence mode="popLayout">
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {sortedItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        {isMobile ? (
                          <MobileProductCard product={item as unknown as MobileProductCardData} index={index} wishlistView />
                        ) : (
                          <ProductCard product={item as any} index={index} wishlistView />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}