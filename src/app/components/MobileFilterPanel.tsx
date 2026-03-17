import { motion, AnimatePresence } from 'motion/react';
import { Search, X } from 'lucide-react';
import { categoriesByGender, colorMap } from '../utils/filterConfig';
import { LuxuryCheckbox } from './ui/luxury-checkbox';

const BADGE_OPTIONS = ['Best Seller', 'Trending', 'Most Ordered', 'New', 'Limited Edition', 'Exclusive', 'Hot', 'Popular'] as const;

interface MobileFilterPanelProps {
  showFilters?: boolean;
  setShowFilters?: (value: boolean) => void;
  searchQuery: string;
  selectedCategory: string;
  selectedGender: 'all' | 'women' | 'men';
  priceRange: number[];
  selectedColors: string[];
  selectedSizes: string[];
  selectedMaterials?: string[];
  selectedSubcategories?: string[];
  minRating?: number;
  showOnSale: boolean;
  showNewArrivals: boolean;
  showFeatured: boolean;
  selectedBadges: string[];
  sortBy?: string;
  setSearchQuery: (value: string) => void;
  setSelectedCategory: (value: string) => void;
  setSelectedGender: (value: 'all' | 'women' | 'men') => void;
  setPriceRange: (value: number[]) => void;
  setSortBy?: (value: string) => void;
  toggleArrayFilter: (array: string[], setter: (arr: string[]) => void, value: string) => void;
  setSelectedColors: (value: string[]) => void;
  setSelectedSizes: (value: string[]) => void;
  setSelectedMaterials?: (value: string[]) => void;
  setSelectedSubcategories?: (value: string[]) => void;
  setMinRating?: (value: number) => void;
  setShowOnSale: (value: boolean) => void;
  setShowNewArrivals: (value: boolean) => void;
  setShowFeatured: (value: boolean) => void;
  setSelectedBadges: (value: string[]) => void;
  availableColors?: string[];
  availableSizes?: string[];
  expandedSections?: Set<string>;
  toggleSection?: (section: string) => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
}

export function MobileFilterPanel({
  showFilters,
  setShowFilters,
  searchQuery,
  selectedCategory,
  selectedGender,
  priceRange,
  selectedColors,
  selectedSizes,
  selectedMaterials = [],
  selectedSubcategories = [],
  minRating = 0,
  showOnSale,
  showNewArrivals,
  showFeatured,
  selectedBadges = [],
  sortBy = 'featured',
  setSearchQuery,
  setSelectedCategory,
  setSelectedGender,
  setPriceRange,
  setSortBy = () => {},
  toggleArrayFilter,
  setSelectedColors,
  setSelectedSizes,
  setSelectedMaterials = () => {},
  setSelectedSubcategories = () => {},
  setMinRating = () => {},
  setShowOnSale,
  setShowNewArrivals,
  setShowFeatured,
  setSelectedBadges,
  availableColors = [],
  availableSizes = [],
  expandedSections = new Set(),
  toggleSection = () => {},
  clearAllFilters,
  hasActiveFilters,
}: MobileFilterPanelProps) {
  return (
    <AnimatePresence>
      {showFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="md:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setShowFilters(false)}
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="absolute left-0 top-0 bottom-0 w-80 bg-background overflow-y-auto p-6 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="hover:opacity-70">
                <X size={24} />
              </button>
            </div>

            {/* Mobile filters - same content as desktop sidebar */}
            <div className="space-y-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium mb-3">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-foreground/20 bg-transparent focus:outline-none focus:border-foreground transition-colors text-sm"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium mb-3">Shop For</label>
                <div className="space-y-2">
                  {(['all', 'women', 'men'] as const).map((gender) => (
                    <button
                      key={gender}
                      onClick={() => setSelectedGender(gender)}
                      className={`w-full text-left px-4 py-2 text-sm transition-all ${
                        selectedGender === gender
                          ? 'bg-foreground text-background'
                          : 'bg-transparent hover:bg-foreground/5 border border-foreground/10'
                      }`}
                    >
                      {gender === 'all' ? 'All Products' : gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-3">Category</label>
                <div className="space-y-1">
                  {(categoriesByGender[selectedGender] || categoriesByGender.all).map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 text-sm transition-all ${
                        selectedCategory === category
                          ? 'text-foreground font-medium'
                          : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium mb-3">Price Range</label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full accent-foreground"
                />
                <div className="flex items-center justify-between text-sm text-foreground/70 mt-2">
                  <span>₹0</span>
                  <span className="font-medium text-foreground">₹{(priceRange[1] * 75).toLocaleString()}</span>
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-medium mb-3">Colors</label>
                <div className="space-y-2">
                  {availableColors.map(color => {
                    const hexColor = colorMap[color] || '#999';
                    const isSelected = selectedColors.includes(color);
                    return (
                      <label
                        key={color}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleArrayFilter(selectedColors, setSelectedColors, color)}
                          className="w-4 h-4 accent-foreground cursor-pointer flex-shrink-0"
                        />
                        <div 
                          className="w-6 h-6 rounded-full flex-shrink-0 shadow-sm border border-foreground/20"
                          style={{ 
                            backgroundColor: hexColor,
                            border: hexColor === '#FFFFFF' || color === 'White' ? '1px solid #e5e5e5' : '1px solid rgba(0,0,0,0.1)'
                          }}
                        />
                        <span className={`text-sm transition-colors ${
                          isSelected ? 'text-foreground font-medium' : 'text-foreground/70 group-hover:text-foreground'
                        }`}>
                          {color}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block text-sm font-medium mb-3">Sizes</label>
                <div className="space-y-2">
                  {availableSizes.map(size => (
                    <label
                      key={size}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSizes.includes(size)}
                        onChange={() => toggleArrayFilter(selectedSizes, setSelectedSizes, size)}
                        className="w-4 h-4 accent-foreground cursor-pointer flex-shrink-0"
                      />
                      <span className={`text-sm transition-colors ${
                        selectedSizes.includes(size) ? 'text-foreground font-medium' : 'text-foreground/70 group-hover:text-foreground'
                      }`}>
                        {size}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Special Filters */}
              <div>
                <label className="block text-sm font-medium mb-3">Special</label>
                <div className="space-y-2">
                  <LuxuryCheckbox
                    checked={showOnSale}
                    onChange={(e) => setShowOnSale(e.target.checked)}
                    label="On Sale"
                  />
                  <LuxuryCheckbox
                    checked={showNewArrivals}
                    onChange={(e) => setShowNewArrivals(e.target.checked)}
                    label="New Arrivals"
                  />
                  <LuxuryCheckbox
                    checked={showFeatured}
                    onChange={(e) => setShowFeatured(e.target.checked)}
                    label="Featured"
                  />
                </div>
              </div>

              {/* Badges */}
              <div>
                <label className="block text-sm font-medium mb-3">Product Tags</label>
                <div className="space-y-2">
                  {BADGE_OPTIONS.map(badge => (
                    <LuxuryCheckbox
                      key={badge}
                      checked={selectedBadges.includes(badge)}
                      onChange={(e) => toggleArrayFilter(selectedBadges, setSelectedBadges, badge)}
                      label={badge}
                    />
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => setShowFilters(false)}
                className="w-full py-3 bg-foreground text-background hover:bg-foreground/90 transition-colors font-medium"
              >
                Apply Filters
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="w-full py-2 border border-foreground/20 hover:bg-foreground hover:text-background transition-colors text-sm"
                >
                  Clear All
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}