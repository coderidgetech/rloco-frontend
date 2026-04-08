import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShoppingBag, Trash2, ArrowLeft, SlidersHorizontal, Grid3x3, List, X, ChevronDown } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Footer } from '../components/Footer';
import { PH } from '../lib/formPlaceholders';

type ViewMode = 'grid' | 'list';
type SortOption = 'recent' | 'price-low' | 'price-high' | 'name';

export function WishlistPage() {
  const navigate = useNavigate();
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showOnSale, setShowOnSale] = useState(false);
  const [showNewArrivals, setShowNewArrivals] = useState(false);
  const [showFeatured, setShowFeatured] = useState(false);
  const [showFilters, setShowFilters] = useState(true); // Open by default

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

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      size: 'M', // Default size
    });
    toast.success('Added to cart');
  };

  const handleAddAllToCart = () => {
    sortedItems.forEach(item => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        size: 'M',
      });
    });
    toast.success(`${sortedItems.length} items added to cart!`);
  };

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
      <div className="page-container py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          <div className="flex items-center gap-3 md:gap-4 mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-red-500/10 flex items-center justify-center">
              <Heart className="text-red-500" size={24} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl">My Wishlist</h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                {items.length} {items.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-muted/30 p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showFilters ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'
                }`}
              >
                <SlidersHorizontal size={18} />
                <span className="hidden sm:inline">Filters</span>
                {(selectedCategories.length > 0 || selectedGenders.length > 0 || selectedColors.length > 0 || priceRange[0] !== minPrice || priceRange[1] !== maxPrice || showOnSale || showNewArrivals || showFeatured) && (
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                )}
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
              >
                <option value="recent">Recently Added</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddAllToCart}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <ShoppingBag size={18} />
                    <span className="hidden sm:inline">Add All to Cart</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (confirm('Clear all items from wishlist?')) {
                        clearWishlist();
                        toast.success('Wishlist cleared');
                      }
                    }}
                    className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                    title="Clear all"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </>
              )}

              <div className="flex bg-background rounded-lg border border-border">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-l-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  }`}
                >
                  <Grid3x3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-r-lg transition-colors ${
                    viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="lg:col-span-1"
              >
                <div className="bg-muted/30 rounded-xl p-6 sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    {(selectedCategories.length > 0 || selectedGenders.length > 0 || selectedColors.length > 0 || priceRange[0] !== minPrice || priceRange[1] !== maxPrice || showOnSale || showNewArrivals || showFeatured) && (
                      <button
                        onClick={clearFilters}
                        className="text-sm text-primary hover:underline"
                      >
                        Clear All
                      </button>
                    )}
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
              /* Items Grid/List */
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Showing {sortedItems.length} of {items.length} items
                </p>
                <AnimatePresence mode="popLayout">
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                      {sortedItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ delay: index * 0.05 }}
                          className="group bg-muted/30 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div 
                            onClick={() => navigate(`/product/${item.id}`)}
                            className="aspect-[3/4] overflow-hidden bg-muted cursor-pointer relative"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFromWishlist(item.id);
                                toast.success('Removed from wishlist');
                              }}
                              className="absolute top-3 right-3 p-2 bg-background/90 hover:bg-destructive/90 hover:text-white rounded-full transition-colors backdrop-blur-sm"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <div className="p-4">
                            <h3 
                              onClick={() => navigate(`/product/${item.id}`)}
                              className="font-medium mb-1 line-clamp-1 cursor-pointer hover:text-primary transition-colors"
                            >
                              {item.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">{item.category}</p>
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-lg">₹{(item as any).priceINR || item.price * 75}</span>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleAddToCart(item)}
                                className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                              >
                                <ShoppingBag size={16} />
                                Add
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {sortedItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex gap-4 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors group"
                        >
                          <div 
                            onClick={() => navigate(`/product/${item.id}`)}
                            className="w-24 md:w-32 h-24 md:h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0 cursor-pointer"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 
                              onClick={() => navigate(`/product/${item.id}`)}
                              className="font-medium text-lg mb-1 cursor-pointer hover:text-primary transition-colors"
                            >
                              {item.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">{item.category}</p>
                            <p className="font-semibold text-xl">₹{(item as any).priceINR || item.price * 75}</p>
                          </div>
                          <div className="flex flex-col gap-2 justify-center">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleAddToCart(item)}
                              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 whitespace-nowrap"
                            >
                              <ShoppingBag size={16} />
                              Add to Bag
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                removeFromWishlist(item.id);
                                toast.success('Removed from wishlist');
                              }}
                              className="px-4 py-2 border border-border hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                            >
                              <Trash2 size={16} />
                              Remove
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
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