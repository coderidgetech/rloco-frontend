import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Search, User, Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useUser } from '../context/UserContext';
import { useSearchOverlay } from '../context/SearchOverlayContext';
import { ACCOUNT_DEFAULT_PATH } from '../lib/accountRoutes';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Shared mobile menu drawer content — used by both the desktop-nav's mobile
 * hamburger (Navigation.tsx) and the mobile home header, so the two never
 * drift into separate menu structures.
 */
export function MobileNavDrawer({ isOpen, onClose }: MobileNavDrawerProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { openSearch } = useSearchOverlay();
  const { itemCount: wishlistCount } = useWishlist();
  const { config } = useSiteConfig();
  const { isAuthenticated } = useUser();
  const [mobileSubMenu, setMobileSubMenu] = useState<'women' | 'men' | null>(null);

  const womenCategories = config?.categories?.women || {
    clothing: ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Knitwear'],
    accessories: ['Shoes', 'Jewelry', 'Bags'],
  };
  const menCategories = config?.categories?.men || {
    clothing: ['Shirts', 'Tops', 'Bottoms', 'Outerwear', 'Knitwear'],
    accessories: ['Shoes', 'Accessories'],
  };

  const closeAll = () => {
    setMobileSubMenu(null);
    onClose();
  };

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
    setTimeout(() => onClose(), 100);
  };

  const handleCategoryClick = (gender: 'women' | 'men', category?: string) => {
    closeAll();
    if (category) {
      navigate(`/category/${gender}/${category.toLowerCase()}`);
    } else {
      navigate(`/category/${gender}`);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="border-b border-border/40 bg-background/98 shadow-sm overflow-hidden"
        >
          <div className="border-t border-border/60 bg-muted/20 px-6 pt-3 pb-4 dark:bg-muted/10 max-h-[min(72vh,520px)] overflow-y-auto overscroll-contain rounded-b-2xl">
            <div className="flex flex-col gap-1">
              <button
                onClick={() => scrollToSection('products')}
                className="text-foreground/70 hover:text-foreground transition-colors text-left py-3 px-3 -mx-2 rounded-md active:bg-foreground/5 min-h-[48px] flex items-center"
                type="button"
              >
                New Arrivals
              </button>

              {/* Women Menu with Sub-items */}
              <div>
                <button
                  onClick={() => setMobileSubMenu(mobileSubMenu === 'women' ? null : 'women')}
                  className="text-foreground/70 hover:text-foreground transition-colors text-left w-full flex items-center justify-between py-3 px-3 -mx-2 rounded-md active:bg-foreground/5 min-h-[48px]"
                  type="button"
                >
                  <span>Women</span>
                  <ChevronDown size={16} className={`transition-transform duration-300 ${mobileSubMenu === 'women' ? 'rotate-180' : ''}`} />
                </button>
                {mobileSubMenu === 'women' && (
                  <div className="pl-4 pt-2 flex flex-col gap-1">
                    <button
                      onClick={() => handleCategoryClick('women')}
                      className="text-sm text-foreground/60 hover:text-primary transition-colors text-left py-2.5 px-3 -mx-2 rounded-md active:bg-foreground/5 min-h-[44px] flex items-center"
                      type="button"
                    >
                      View All Women's
                    </button>
                    <div className="text-xs text-primary uppercase tracking-wider mt-2 mb-1 px-2">Clothing</div>
                    {womenCategories.clothing.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleCategoryClick('women', item)}
                        className="text-sm text-foreground/60 hover:text-primary transition-colors text-left py-2.5 px-3 -mx-2 rounded-md active:bg-foreground/5 min-h-[44px] flex items-center"
                        type="button"
                      >
                        {item}
                      </button>
                    ))}
                    <div className="text-xs text-primary uppercase tracking-wider mt-2 mb-1 px-2">Accessories</div>
                    {womenCategories.accessories.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleCategoryClick('women', item)}
                        className="text-sm text-foreground/60 hover:text-primary transition-colors text-left py-2.5 px-3 -mx-2 rounded-md active:bg-foreground/5 min-h-[44px] flex items-center"
                        type="button"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Men Menu with Sub-items */}
              <div>
                <button
                  onClick={() => setMobileSubMenu(mobileSubMenu === 'men' ? null : 'men')}
                  className="text-foreground/70 hover:text-foreground transition-colors text-left w-full flex items-center justify-between py-3 px-3 -mx-2 rounded-md active:bg-foreground/5 min-h-[48px]"
                  type="button"
                >
                  <span>Men</span>
                  <ChevronDown size={16} className={`transition-transform duration-300 ${mobileSubMenu === 'men' ? 'rotate-180' : ''}`} />
                </button>
                {mobileSubMenu === 'men' && (
                  <div className="pl-4 pt-2 flex flex-col gap-1">
                    <button
                      onClick={() => handleCategoryClick('men')}
                      className="text-sm text-foreground/60 hover:text-primary transition-colors text-left py-2.5 px-3 -mx-2 rounded-md active:bg-foreground/5 min-h-[44px] flex items-center"
                      type="button"
                    >
                      View All Men's
                    </button>
                    <div className="text-xs text-primary uppercase tracking-wider mt-2 mb-1 px-2">Clothing</div>
                    {menCategories.clothing.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleCategoryClick('men', item)}
                        className="text-sm text-foreground/60 hover:text-primary transition-colors text-left py-2.5 px-3 -mx-2 rounded-md active:bg-foreground/5 min-h-[44px] flex items-center"
                        type="button"
                      >
                        {item}
                      </button>
                    ))}
                    <div className="text-xs text-primary uppercase tracking-wider mt-2 mb-1 px-2">Accessories</div>
                    {menCategories.accessories.map((item) => (
                      <button
                        key={item}
                        onClick={() => handleCategoryClick('men', item)}
                        className="text-sm text-foreground/60 hover:text-primary transition-colors text-left py-2.5 px-3 -mx-2 rounded-md active:bg-foreground/5 min-h-[44px] flex items-center"
                        type="button"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => scrollToSection('categories')}
                className="text-foreground/70 hover:text-foreground transition-colors text-left py-3 px-3 -mx-2 rounded-md active:bg-foreground/5 min-h-[48px] flex items-center"
                type="button"
              >
                Collections
              </button>
              <button
                onClick={() => scrollToSection('products')}
                className="text-foreground/70 hover:text-foreground transition-colors text-left py-3 px-3 -mx-2 rounded-md active:bg-foreground/5 min-h-[48px] flex items-center"
                type="button"
              >
                Promotions
              </button>
              <button
                onClick={() => { onClose(); navigate('/sale'); }}
                className="text-foreground/70 hover:text-foreground transition-colors text-left py-3 px-3 -mx-2 rounded-md active:bg-foreground/5 min-h-[48px] flex items-center"
                type="button"
              >
                Sale
              </button>
              <div className="border-t border-border pt-4 mt-3 flex flex-col gap-1">
                <button
                  onClick={() => { openSearch(); onClose(); }}
                  className="text-foreground/70 hover:text-foreground transition-colors text-left flex items-center gap-2 py-3 px-3 -mx-2 rounded-md active:bg-foreground/5 min-h-[48px]"
                  type="button"
                >
                  <Search size={18} />
                  Search
                </button>
                <button
                  onClick={() => {
                    navigate(isAuthenticated ? ACCOUNT_DEFAULT_PATH : `/login?redirect=${encodeURIComponent(ACCOUNT_DEFAULT_PATH)}`);
                    onClose();
                  }}
                  className="text-foreground/70 hover:text-foreground transition-colors text-left flex items-center gap-2 py-3 px-3 -mx-2 rounded-md active:bg-foreground/5 min-h-[48px]"
                  type="button"
                >
                  <User size={18} />
                  Account
                </button>
                <button
                  onClick={() => { navigate('/wishlist'); onClose(); }}
                  className="text-foreground/70 hover:text-foreground transition-colors text-left flex items-center gap-2 py-3 px-3 -mx-2 rounded-md active:bg-foreground/5 min-h-[48px]"
                  type="button"
                >
                  <Heart size={18} />
                  Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
