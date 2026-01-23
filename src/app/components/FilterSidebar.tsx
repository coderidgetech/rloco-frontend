import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp, Star, Sparkles, Tag, TrendingUp, Award } from 'lucide-react';
import { categories, categoriesByGender, colorMap, allColors, allSizes, allMaterials, allSubcategories, getSubcategoriesForCategory } from '../utils/filterConfig';

const BADGE_OPTIONS = ['Best Seller', 'Trending', 'Most Ordered', 'New', 'Limited Edition', 'Exclusive', 'Hot', 'Popular'] as const;

interface FilterSidebarProps {
  // State
  searchQuery: string;
  selectedCategory: string;
  selectedGender: 'all' | 'women' | 'men';
  priceRange: number[];
  selectedColors: string[];
  selectedSizes: string[];
  selectedMaterials: string[];
  selectedSubcategories: string[];
  minRating: number;
  showOnSale: boolean;
  showNewArrivals: boolean;
  showFeatured: boolean;
  selectedBadges: string[];
  expandedSections: Set<string>;
  
  // Setters
  setSearchQuery: (value: string) => void;
  setSelectedCategory: (value: string) => void;
  setSelectedGender: (value: 'all' | 'women' | 'men') => void;
  setPriceRange: (value: number[]) => void;
  setSelectedColors: (value: string[]) => void;
  setSelectedSizes: (value: string[]) => void;
  setSelectedMaterials: (value: string[]) => void;
  setSelectedSubcategories: (value: string[]) => void;
  setMinRating: (value: number) => void;
  setShowOnSale: (value: boolean) => void;
  setShowNewArrivals: (value: boolean) => void;
  setShowFeatured: (value: boolean) => void;
  setSelectedBadges: (value: string[]) => void;
  
  // Functions
  toggleSection: (section: string) => void;
  toggleArrayFilter: (array: string[], setter: (arr: string[]) => void, value: string) => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
}

// Reusable Accordion Section Component
function AccordionSection({ 
  title, 
  isExpanded, 
  onToggle, 
  children,
  count
}: { 
  title: string; 
  isExpanded: boolean; 
  onToggle: () => void; 
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <div className="border border-foreground/10 bg-background">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-foreground/5 transition-colors group"
      >
        <span className="text-sm font-medium flex items-center gap-2">
          {title}
          {count !== undefined && count > 0 && (
            <span className="text-xs bg-foreground text-background px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </span>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-foreground/60 group-hover:text-foreground"
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-foreground/10"
          >
            <div className="p-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FilterSidebar({
  searchQuery,
  selectedCategory,
  selectedGender,
  priceRange,
  selectedColors,
  selectedSizes,
  selectedMaterials,
  selectedSubcategories,
  minRating,
  showOnSale,
  showNewArrivals,
  showFeatured,
  selectedBadges,
  expandedSections,
  setSearchQuery,
  setSelectedCategory,
  setSelectedGender,
  setPriceRange,
  setSelectedColors,
  setSelectedSizes,
  setSelectedMaterials,
  setSelectedSubcategories,
  setMinRating,
  setShowOnSale,
  setShowNewArrivals,
  setShowFeatured,
  setSelectedBadges,
  toggleSection,
  toggleArrayFilter,
  clearAllFilters,
  hasActiveFilters,
}: FilterSidebarProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="hidden md:block w-64 flex-shrink-0 space-y-4 sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto pb-8"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(0,0,0,0.2) transparent',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {/* Filter Header */}
      <div className="flex items-center justify-between border-b border-foreground/10 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} />
          <h2 className="text-base font-medium uppercase tracking-wider">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-foreground/60 hover:text-foreground underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Search - Always Visible */}
      <div className="border border-foreground/10 bg-background p-4">
        <label className="block text-xs uppercase tracking-wider text-foreground/60 mb-2">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 border border-foreground/20 bg-transparent focus:outline-none focus:border-foreground transition-colors text-sm"
          />
        </div>
      </div>

      {/* Gender - Always Visible */}
      <div className="border border-foreground/10 bg-background p-4">
        <label className="block text-xs uppercase tracking-wider text-foreground/60 mb-3">Shop For</label>
        <div className="space-y-2">
          {(['all', 'women', 'men'] as const).map((gender) => (
            <button
              key={gender}
              onClick={() => setSelectedGender(gender)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-all ${
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

      {/* Special Offers - Always Visible with Icons */}
      <div className="border border-foreground/10 bg-background p-4 space-y-2">
        <label className="block text-xs uppercase tracking-wider text-foreground/60 mb-3">Special Offers</label>
        
        <button
          onClick={() => setShowOnSale(!showOnSale)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all ${
            showOnSale
              ? 'bg-foreground text-background'
              : 'bg-transparent hover:bg-foreground/5 border border-foreground/10'
          }`}
        >
          <Tag size={16} />
          <span>On Sale</span>
        </button>

        <button
          onClick={() => setShowNewArrivals(!showNewArrivals)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all ${
            showNewArrivals
              ? 'bg-foreground text-background'
              : 'bg-transparent hover:bg-foreground/5 border border-foreground/10'
          }`}
        >
          <Sparkles size={16} />
          <span>New Arrivals</span>
        </button>

        <button
          onClick={() => setShowFeatured(!showFeatured)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all ${
            showFeatured
              ? 'bg-foreground text-background'
              : 'bg-transparent hover:bg-foreground/5 border border-foreground/10'
          }`}
        >
          <TrendingUp size={16} />
          <span>Featured</span>
        </button>
      </div>

      {/* Category - Accordion */}
      <AccordionSection 
        title="Category" 
        isExpanded={expandedSections.has('category')}
        onToggle={() => toggleSection('category')}
        count={selectedCategory !== 'All' ? 1 : 0}
      >
        <div className="space-y-1 max-h-64 overflow-y-auto pr-2">
          {(categoriesByGender[selectedGender] || categoriesByGender.all).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`w-full text-left px-3 py-2 text-sm transition-all ${
                selectedCategory === category
                  ? 'text-foreground font-medium bg-foreground/10'
                  : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </AccordionSection>

      {/* Price Range - Accordion */}
      <AccordionSection 
        title="Price Range" 
        isExpanded={expandedSections.has('price')}
        onToggle={() => toggleSection('price')}
        count={(priceRange[0] !== 0 || priceRange[1] !== 1000) ? 1 : 0}
      >
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="1000"
            step="10"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
            className="w-full accent-foreground h-2"
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground/60">₹0</span>
            <span className="text-sm font-medium text-foreground px-3 py-1 bg-foreground/5">
              ₹{(priceRange[1] * 75).toLocaleString()}
            </span>
          </div>
        </div>
      </AccordionSection>

      {/* Colors - Accordion */}
      <AccordionSection 
        title="Colors" 
        isExpanded={expandedSections.has('colors')}
        onToggle={() => toggleSection('colors')}
        count={selectedColors.length}
      >
        <div className="space-y-2">
          {allColors.map(color => {
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
                  isSelected ? 'text-foreground font-medium' : 'text-foreground/60 group-hover:text-foreground'
                }`}>
                  {color}
                </span>
              </label>
            );
          })}
        </div>
      </AccordionSection>

      {/* Sizes - Accordion */}
      <AccordionSection 
        title="Sizes" 
        isExpanded={expandedSections.has('sizes')}
        onToggle={() => toggleSection('sizes')}
        count={selectedSizes.length}
      >
        <div className="space-y-2">
          {allSizes.map(size => (
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
                selectedSizes.includes(size) ? 'text-foreground font-medium' : 'text-foreground/60 group-hover:text-foreground'
              }`}>
                {size}
              </span>
            </label>
          ))}
        </div>
      </AccordionSection>

      {/* Materials - Accordion */}
      <AccordionSection 
        title="Materials" 
        isExpanded={expandedSections.has('materials')}
        onToggle={() => toggleSection('materials')}
        count={selectedMaterials.length}
      >
        <div className="space-y-1">
          {allMaterials.map(material => (
            <label
              key={material}
              className="flex items-center gap-3 px-3 py-2 hover:bg-foreground/5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedMaterials.includes(material)}
                onChange={() => toggleArrayFilter(selectedMaterials, setSelectedMaterials, material)}
                className="w-4 h-4 accent-foreground cursor-pointer"
              />
              <span className="text-sm text-foreground/60 group-hover:text-foreground">
                {material}
              </span>
            </label>
          ))}
        </div>
      </AccordionSection>

      {/* Subcategories - Accordion */}
      <AccordionSection 
        title="Subcategories" 
        isExpanded={expandedSections.has('subcategories')}
        onToggle={() => toggleSection('subcategories')}
        count={selectedSubcategories.length}
      >
        <div className="space-y-1 max-h-48 overflow-y-auto pr-2">
          {getSubcategoriesForCategory(selectedCategory, selectedGender).map((subcategory: string) => (
            <label
              key={subcategory}
              className="flex items-center gap-3 px-3 py-2 hover:bg-foreground/5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedSubcategories.includes(subcategory)}
                onChange={() => toggleArrayFilter(selectedSubcategories, setSelectedSubcategories, subcategory)}
                className="w-4 h-4 accent-foreground cursor-pointer"
              />
              <span className="text-sm text-foreground/60 group-hover:text-foreground">
                {subcategory}
              </span>
            </label>
          ))}
        </div>
      </AccordionSection>

      {/* Rating - Accordion */}
      <AccordionSection 
        title="Minimum Rating" 
        isExpanded={expandedSections.has('rating')}
        onToggle={() => toggleSection('rating')}
        count={minRating > 0 ? 1 : 0}
      >
        <div className="space-y-2">
          {[4, 3, 2, 1].map(rating => (
            <button
              key={rating}
              onClick={() => setMinRating(minRating === rating ? 0 : rating)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-all ${
                minRating === rating
                  ? 'bg-foreground/10 text-foreground'
                  : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
              }`}
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < rating ? 'fill-yellow-500 text-yellow-500' : 'text-foreground/20'}
                  />
                ))}
              </div>
              <span>& Up</span>
            </button>
          ))}
        </div>
      </AccordionSection>

      {/* Badges - Accordion */}
      <AccordionSection 
        title="Product Tags" 
        isExpanded={expandedSections.has('badges')}
        onToggle={() => toggleSection('badges')}
        count={selectedBadges.length}
      >
        <div className="space-y-1">
          {BADGE_OPTIONS.map(badge => (
            <label
              key={badge}
              className="flex items-center gap-3 px-3 py-2 hover:bg-foreground/5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={selectedBadges.includes(badge)}
                onChange={() => toggleArrayFilter(selectedBadges, setSelectedBadges, badge)}
                className="w-4 h-4 accent-foreground cursor-pointer"
              />
              <span className="text-sm text-foreground/60 group-hover:text-foreground">
                {badge}
              </span>
            </label>
          ))}
        </div>
      </AccordionSection>
    </motion.aside>
  );
}