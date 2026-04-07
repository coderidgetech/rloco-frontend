import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Search, User, Heart, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useUser } from '../context/UserContext';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSearchOverlay } from '../context/SearchOverlayContext';
import { RlocoLogo } from './RlocoLogo';
import { MegaMenu } from './MegaMenu';
import { LoginModal } from './LoginModal';
import { useIsMobile } from '../hooks/useIsMobile';

export function Navigation() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [accountOpen, setAccountOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'women' | 'men' | null>(null);
  const [mobileSubMenu, setMobileSubMenu] = useState<'women' | 'men' | null>(null);

  const { openSearch } = useSearchOverlay();
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { country, setCountry } = useCurrency();
  const { config } = useSiteConfig();
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const isCheckoutFunnel =
    /^\/(checkout|address|address-selection|payment|order-confirmation)(\/|$)/.test(location.pathname);
  // Market switch exists only for catalog discovery; keep it read-only elsewhere.
  const isCatalogRoute =
    /^\/($|all-products$|sale$|new-arrivals$|featured-collection$|category\/|product\/)/.test(location.pathname);
  const isMarketSwitchInteractive = !isCheckoutFunnel && isCatalogRoute;

  // Get configured categories or use defaults
  const womenCategories = config?.categories?.women || {
    clothing: ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Knitwear'],
    accessories: ['Shoes', 'Jewelry', 'Bags'],
  };
  const menCategories = config?.categories?.men || {
    clothing: ['Shirts', 'Tops', 'Bottoms', 'Outerwear', 'Knitwear'],
    accessories: ['Shoes', 'Accessories'],
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // Always keep header visible
      setVisible(true);
      
      setPrevScrollPos(currentScrollPos);
      // Show logo after scrolling 105px - appears when hero logo starts fading
      // Hero logo starts fading at 85% of 140px = 119px, completely gone by 140px
      // Navbar logo appears at 105px (75% of 140px) to ensure smooth handoff
      // This creates overlap period where both logos are visible for seamless transition
      setScrolled(currentScrollPos > 105);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  const scrollToSection = (sectionId: string) => {
    // Check if we're on the home page
    if (location.pathname !== '/') {
      // Navigate to home page first, then scroll
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    // Delay closing to allow scroll to start
    setTimeout(() => {
      setIsOpen(false);
    }, 100);
  };

  const handleCategoryClick = (gender: 'women' | 'men', category?: string) => {
    // Close dropdowns and mobile menu
    setActiveDropdown(null);
    setIsOpen(false);
    setMobileSubMenu(null);
    
    // Navigate to category page
    if (category) {
      navigate(`/category/${gender}/${category.toLowerCase()}`);
    } else {
      navigate(`/category/${gender}`);
    }
  };

  const scrollToProductsAndFilter = (gender: 'women' | 'men', category?: string) => {
    // Scroll to products section
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Trigger filter event
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent('filterProducts', {
          detail: { gender, category }
        })
      );
    }, 500);
  };

  const handleLogoClick = () => {
    if (location.pathname !== '/') {
      // Navigate to home page
      navigate('/');
    } else {
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLoginSuccess = (userData: { email: string; name: string }) => {
    setAccountOpen(false);
    // Navigate to account page after successful login
    navigate('/account');
  };

  const handleLogout = () => {
    setAccountOpen(false);
    // Navigation will be handled by AccountPageStandalone
  };


  return (
    <>
      <nav
        className="fixed left-0 right-0 top-0 z-50 min-h-14 border-b border-transparent transition-all duration-300 dark:border-border/30 dark:bg-background/95"
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          transform: visible ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.3s ease-in-out, background-color 0.3s ease',
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.6)',
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(12px)',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'blur(12px)',
          borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
          boxShadow: scrolled ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none',
        }}
      >
        <div className="mx-auto flex h-14 w-full min-w-0 max-w-[100%] items-center gap-1.5 px-3 sm:gap-2 sm:px-4 md:px-6 lg:px-10 xl:px-14 2xl:px-20">
          <div className="relative flex h-full w-full min-w-0 items-center justify-between gap-1">
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-lg p-2 text-foreground -ml-2"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              type="button"
            >
              {isOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="scrollbar-hide hidden min-w-0 flex-1 items-center justify-start gap-2 overflow-x-auto md:flex lg:gap-5 xl:gap-8"
            >
              <button
                type="button"
                onClick={() => navigate('/new-arrivals')}
                className="shrink-0 text-foreground/70 transition-colors hover:text-foreground relative group text-xs lg:text-sm"
              >
                New Arrivals
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
              </button>
              <motion.div className="relative" onMouseEnter={() => setActiveDropdown('women')}>
                <button
                  type="button"
                  className="shrink-0 flex items-center gap-1 text-foreground/70 transition-colors hover:text-foreground relative group text-xs lg:text-sm"
                  onClick={() => handleCategoryClick('women')}
                >
                  Women
                  <ChevronDown size={16} className={`transition-transform duration-300 ${activeDropdown === 'women' ? 'rotate-180' : ''}`} />
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-foreground transition-all duration-300 ${
                      activeDropdown === 'women' ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </button>
              </motion.div>
              <motion.div className="relative" onMouseEnter={() => setActiveDropdown('men')}>
                <button
                  type="button"
                  className="shrink-0 flex items-center gap-1 text-foreground/70 transition-colors hover:text-foreground relative group text-xs lg:text-sm"
                  onClick={() => handleCategoryClick('men')}
                >
                  Men
                  <ChevronDown size={16} className={`transition-transform duration-300 ${activeDropdown === 'men' ? 'rotate-180' : ''}`} />
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-foreground transition-all duration-300 ${
                      activeDropdown === 'men' ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </button>
              </motion.div>
              <button
                type="button"
                onClick={() => navigate('/sale')}
                className="shrink-0 text-foreground/70 transition-colors hover:text-foreground relative group text-xs lg:text-sm"
              >
                Sale
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{
                opacity: location.pathname === '/' && !scrolled && !isMobile ? 0 : 1,
                scale: location.pathname === '/' && !scrolled && !isMobile ? 0.92 : 1,
              }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-1/2 top-1/2 w-20 max-w-[28%] shrink-0 -translate-x-1/2 -translate-y-1/2 cursor-pointer md:static md:left-auto md:top-auto md:w-24 md:max-w-none md:translate-x-0 md:translate-y-0"
              onClick={handleLogoClick}
              style={{
                pointerEvents: location.pathname === '/' && !scrolled && !isMobile ? 'none' : 'auto',
              }}
            >
              <RlocoLogo size="sm" />
            </motion.div>

            <div className="flex min-w-0 flex-1 items-center justify-end gap-1.5 pl-3 sm:gap-2 md:gap-3 md:pl-2 lg:gap-4 xl:gap-6">
              <button
                type="button"
                onClick={() => openSearch()}
                className="relative hidden min-w-0 max-w-[200px] text-left sm:block sm:w-[min(120px,24vw)] md:max-w-[240px] md:w-[min(180px,20vw)] lg:max-w-[280px] lg:w-[min(240px,18vw)]"
                aria-label="Search products"
              >
                <Search
                  size={14}
                  className="pointer-events-none absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground/30 md:left-0.5 md:h-[15px] md:w-[15px]"
                />
                <span className="block w-full border-0 border-b border-foreground/10 py-1.5 pl-7 pr-2 text-xs text-foreground/40 md:pl-8 md:text-sm">
                  Search
                </span>
              </button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => openSearch()}
                className="sm:hidden flex h-10 w-10 shrink-0 items-center justify-center text-foreground/70"
                aria-label="Search"
              >
                <Search size={20} />
              </motion.button>

              {!isMarketSwitchInteractive ? (
                <div
                  className="hidden md:flex items-center gap-1.5 text-sm text-foreground/50 cursor-not-allowed"
                  title={
                    isCheckoutFunnel
                      ? 'Market is locked during checkout'
                      : 'Market switch is available only while browsing products'
                  }
                >
                  <span>{country === 'India' ? '🇮🇳' : '🇺🇸'}</span>
                  <span>{country === 'India' ? 'IN' : 'US'}</span>
                </div>
              ) : (
                <div className="relative group hidden md:block">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-2 text-sm text-foreground/70 transition-colors hover:text-foreground"
                    aria-label="Select country"
                  >
                    <span>{country === 'India' ? '🇮🇳' : '🇺🇸'}</span>
                    <span>{country === 'India' ? 'IN' : 'US'}</span>
                    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" className="opacity-70">
                      <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div className="absolute top-full right-0 z-50 mt-3 opacity-0 invisible transition-all duration-300 group-hover:visible group-hover:opacity-100">
                    <div className="min-w-[180px] overflow-hidden border border-foreground/10 bg-white shadow-2xl">
                      <button
                        type="button"
                        onClick={() => setCountry('India')}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-foreground/5 ${country === 'India' ? 'bg-foreground/5' : ''}`}
                      >
                        <span className="text-xl">🇮🇳</span>
                        <div className="flex-1">
                          <div className="text-sm font-medium">India</div>
                          <div className="text-xs text-foreground/50">₹ INR</div>
                        </div>
                      </button>
                      <div className="h-px bg-foreground/10" />
                      <button
                        type="button"
                        onClick={() => setCountry('United States')}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-foreground/5 ${country === 'United States' ? 'bg-foreground/5' : ''}`}
                      >
                        <span className="text-xl">🇺🇸</span>
                        <div className="flex-1">
                          <div className="text-sm font-medium">United States</div>
                          <div className="text-xs text-foreground/50">$ USD</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => navigate(isAuthenticated ? '/account' : '/login?redirect=/account')}
                className="hidden md:flex text-foreground/70 transition-colors hover:text-foreground"
                aria-label="Account"
              >
                <User size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => navigate('/wishlist')}
                className="relative text-foreground/70 transition-colors hover:text-foreground"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                <AnimatePresence>
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white"
                    >
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => navigate('/cart')}
                className="relative text-foreground/70 transition-colors hover:text-foreground"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground"
                    >
                      {itemCount > 9 ? '9+' : itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

          {/* Mobile Navigation - below 56px bar */}
          <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="border-b border-border/40 bg-background/98 shadow-sm md:hidden overflow-hidden"
            >
              <div className="border-t border-border/60 bg-muted/20 px-6 pt-3 pb-4 dark:bg-muted/10 max-h-[min(72vh,520px)] overflow-y-auto overscroll-contain rounded-b-2xl">
                <div className="flex flex-col gap-1">
                  <button
                    onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); scrollToSection('products'); }}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollToSection('products'); }}
                    className="text-foreground/70 hover:text-foreground transition-colors text-left py-3 px-3 -mx-2 rounded-md active:bg-foreground/5 min-h-[48px] flex items-center"
                    type="button"
                  >
                    New Arrivals
                  </button>

                  {/* Women Menu with Sub-items */}
                  <div>
                    <button
                      onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); setMobileSubMenu(mobileSubMenu === 'women' ? null : 'women'); }}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMobileSubMenu(mobileSubMenu === 'women' ? null : 'women'); }}
                      className="text-foreground/70 hover:text-foreground transition-colors text-left w-full flex items-center justify-between py-3 px-3 -mx-2 rounded-md active:bg-foreground/5 min-h-[48px]"
                      type="button"
                    >
                      <span>Women</span>
                      <ChevronDown size={16} className={`transition-transform duration-300 ${mobileSubMenu === 'women' ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileSubMenu === 'women' && (
                      <div className="pl-4 pt-2 flex flex-col gap-1">
                        <button
                          onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); handleCategoryClick('women'); setTimeout(() => { setIsOpen(false); setMobileSubMenu(null); }, 100); }}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleCategoryClick('women'); setTimeout(() => { setIsOpen(false); setMobileSubMenu(null); }, 100); }}
                          className="text-sm text-foreground/60 hover:text-primary transition-colors text-left py-2.5 px-3 -mx-2 rounded-md active:bg-foreground/5 min-h-[44px] flex items-center"
                          type="button"
                        >
                          View All Women's
                        </button>
                      <div className="text-xs text-primary uppercase tracking-wider mt-2 mb-1 px-2">Clothing</div>
                      {womenCategories.clothing.map((item) => (
                        <button
                          key={item}
                          onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); handleCategoryClick('women', item); setTimeout(() => { setIsOpen(false); setMobileSubMenu(null); }, 100); }}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleCategoryClick('women', item); setTimeout(() => { setIsOpen(false); setMobileSubMenu(null); }, 100); }}
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
                          onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); handleCategoryClick('women', item); setTimeout(() => { setIsOpen(false); setMobileSubMenu(null); }, 100); }}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleCategoryClick('women', item); setTimeout(() => { setIsOpen(false); setMobileSubMenu(null); }, 100); }}
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
                      onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); setMobileSubMenu(mobileSubMenu === 'men' ? null : 'men'); }}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMobileSubMenu(mobileSubMenu === 'men' ? null : 'men'); }}
                      className="text-foreground/70 hover:text-foreground transition-colors text-left w-full flex items-center justify-between py-3 px-3 -mx-2 rounded-md active:bg-foreground/5 min-h-[48px]"
                      type="button"
                    >
                      <span>Men</span>
                      <ChevronDown size={16} className={`transition-transform duration-300 ${mobileSubMenu === 'men' ? 'rotate-180' : ''}`} />
                    </button>
                    {mobileSubMenu === 'men' && (
                      <div className="pl-4 pt-2 flex flex-col gap-1">
                        <button
                          onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); handleCategoryClick('men'); setTimeout(() => { setIsOpen(false); setMobileSubMenu(null); }, 100); }}
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleCategoryClick('men'); setTimeout(() => { setIsOpen(false); setMobileSubMenu(null); }, 100); }}
                          className="text-sm text-foreground/60 hover:text-primary transition-colors text-left py-2.5 px-3 -mx-2 rounded-md active:bg-foreground/5 min-h-[44px] flex items-center"
                          type="button"
                        >
                          View All Men's
                        </button>
                        <div className="text-xs text-primary uppercase tracking-wider mt-2 mb-1 px-2">Clothing</div>
                        {menCategories.clothing.map((item) => (
                          <button
                            key={item}
                            onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); handleCategoryClick('men', item); setTimeout(() => { setIsOpen(false); setMobileSubMenu(null); }, 100); }}
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleCategoryClick('men', item); setTimeout(() => { setIsOpen(false); setMobileSubMenu(null); }, 100); }}
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
                            onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); handleCategoryClick('men', item); setTimeout(() => { setIsOpen(false); setMobileSubMenu(null); }, 100); }}
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleCategoryClick('men', item); setTimeout(() => { setIsOpen(false); setMobileSubMenu(null); }, 100); }}
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
                    onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); scrollToSection('categories'); }}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollToSection('categories'); }}
                    className="text-foreground/70 hover:text-foreground transition-colors text-left py-3 px-3 -mx-2 rounded-md active:bg-foreground/5 min-h-[48px] flex items-center"
                    type="button"
                  >
                    Collections
                  </button>
                  <button
                    onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); scrollToSection('products'); }}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollToSection('products'); }}
                    className="text-foreground/70 hover:text-foreground transition-colors text-left py-3 px-3 -mx-2 rounded-md active:bg-foreground/5 min-h-[48px] flex items-center"
                    type="button"
                  >
                    Promotions
                  </button>
                  <button
                    onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); navigate('/sale'); }}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate('/sale'); }}
                    className="text-foreground/70 hover:text-foreground transition-colors text-left py-3 px-3 -mx-2 rounded-md active:bg-foreground/5 min-h-[48px] flex items-center"
                    type="button"
                  >
                    Sale
                  </button>
                  <div className="border-t border-border pt-4 mt-3 flex flex-col gap-1">
                    <button
                      onClick={() => {
                        openSearch();
                        setIsOpen(false);
                      }}
                      className="text-foreground/70 hover:text-foreground transition-colors text-left flex items-center gap-2 py-3 px-3 -mx-2 rounded-md active:bg-foreground/5 min-h-[48px]"
                      type="button"
                    >
                      <Search size={18} />
                      Search
                    </button>
                    <button
                      onClick={() => { navigate(isAuthenticated ? '/account' : '/login?redirect=/account'); setIsOpen(false); }}
                      className="text-foreground/70 hover:text-foreground transition-colors text-left flex items-center gap-2 py-3 px-3 -mx-2 rounded-md active:bg-foreground/5 min-h-[48px]"
                      type="button"
                    >
                      <User size={18} />
                      Account
                    </button>
                    <button
                      onClick={() => { navigate('/wishlist'); setIsOpen(false); }}
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
        
        {/* Mega Menus - Outside nav with fixed positioning */}
        <MegaMenu 
          isOpen={activeDropdown === 'women'} 
          gender="women" 
          onClose={() => setActiveDropdown(null)}
          onCategoryClick={handleCategoryClick}
        />
        <MegaMenu 
          isOpen={activeDropdown === 'men'} 
          gender="men" 
          onClose={() => setActiveDropdown(null)}
          onCategoryClick={handleCategoryClick}
        />
      </nav>

      {/* Cart Drawer */}
      {/* Show LoginModal if not logged in (for modal access), AccountPage route handles logged-in state */}
      {!isAuthenticated && (
        <LoginModal 
          isOpen={accountOpen} 
          onClose={() => setAccountOpen(false)} 
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
}