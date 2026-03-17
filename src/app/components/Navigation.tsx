import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Search, User, Heart, ChevronDown, Globe, LogIn } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useUser } from '../context/UserContext';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SearchModal } from './SearchModal';
import { AccountPage } from './AccountPage';
import { RlocoLogo } from './RlocoLogo';
import { MegaMenu } from './MegaMenu';
import { LoginModal } from './LoginModal';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'women' | 'men' | null>(null);
  const [mobileSubMenu, setMobileSubMenu] = useState<'women' | 'men' | null>(null);
  
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { country, setCountry } = useCurrency();
  const { config } = useSiteConfig();
  const { isAuthenticated } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

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
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
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
        <div className="w-full px-3 sm:px-4 md:px-6 lg:px-10 xl:px-16 py-3 sm:py-4">
          {/* Top row: 3-column grid so logo stays centered when left nav hidden */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 min-h-14 sm:min-h-16">
          {/* Left: Desktop nav links - show from lg to avoid crowding on tablet */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:flex items-center gap-5 xl:gap-8 justify-start min-w-0 flex-1"
          >
              <button
                onClick={() => navigate('/new-arrivals')}
                className="text-foreground/70 hover:text-foreground transition-colors relative group"
              >
                New Arrivals
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-300" />
              </button>

              {/* Women Dropdown */}
              <motion.div
                className="relative"
                onMouseEnter={() => setActiveDropdown('women')}
              >
                <button
                  className="text-foreground/70 hover:text-foreground transition-colors relative group flex items-center gap-1"
                  onClick={() => handleCategoryClick('women')}
                >
                  Women
                  <ChevronDown size={16} className={`transition-transform duration-300 ${activeDropdown === 'women' ? 'rotate-180' : ''}`} />
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-300" />
                </button>
              </motion.div>

              {/* Men Dropdown */}
              <motion.div
                className="relative"
                onMouseEnter={() => setActiveDropdown('men')}
              >
                <button
                  className="text-foreground/70 hover:text-foreground transition-colors relative group flex items-center gap-1"
                  onClick={() => handleCategoryClick('men')}
                >
                  Men
                  <ChevronDown size={16} className={`transition-transform duration-300 ${activeDropdown === 'men' ? 'rotate-180' : ''}`} />
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-300" />
                </button>
              </motion.div>
            </motion.div>

            {/* Center Logo - flex-shrink-0 so it never squishes */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{
                opacity: location.pathname === '/' ? (scrolled ? 1 : 0) : 1,
                scale: 1,
              }}
              transition={{
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
                opacity: { duration: 0.25, ease: [0.22, 1, 0.36, 1] },
                scale: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
              }}
              className="flex flex-shrink-0 justify-center text-2xl tracking-tighter cursor-pointer relative"
              onClick={handleLogoClick}
              style={{
                pointerEvents: location.pathname === '/' ? (scrolled ? 'auto' : 'none') : 'auto',
                willChange: location.pathname === '/' && !scrolled ? 'opacity, transform' : 'auto',
              }}
            >
              <RlocoLogo size="sm" />
            </motion.div>

            {/* Right: Desktop links (lg+) + Icons - flex-1 justify-end so no overflow */}
            <div className="flex items-center justify-end min-w-0 flex-1 gap-3 sm:gap-4 lg:gap-5 xl:gap-8">
              {/* Desktop: Collections, Promotions, Sale, Country - only from lg */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="hidden lg:flex items-center gap-4 xl:gap-6 flex-shrink-0"
              >
                <button
                  onClick={() => scrollToSection('categories')}
                  className="text-foreground/70 hover:text-foreground transition-colors relative group whitespace-nowrap text-sm xl:text-base"
                >
                  Collections
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-300" />
                </button>
                <button
                  onClick={() => scrollToSection('products')}
                  className="text-foreground/70 hover:text-foreground transition-colors relative group whitespace-nowrap text-sm xl:text-base"
                >
                  Promotions
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-300" />
                </button>
                <button
                  onClick={() => navigate('/sale')}
                  className="text-foreground/70 hover:text-foreground transition-colors relative group whitespace-nowrap text-sm xl:text-base"
                >
                  Sale
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-300" />
                </button>
                <div className="relative group">
                  <button
                    className="text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1.5 relative text-sm xl:text-base"
                    aria-label="Select country"
                  >
                    <span>{country === 'India' ? '🇮🇳' : '🇺🇸'}</span>
                    <span>{country === 'India' ? 'IN' : 'US'}</span>
                    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" className="opacity-70 flex-shrink-0">
                      <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-300" />
                  </button>
                  <div className="absolute top-full right-0 mt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="bg-white shadow-2xl border border-foreground/10 min-w-[180px] overflow-hidden">
                      <button
                        onClick={() => setCountry('India')}
                        className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-foreground/5 transition-colors text-left ${country === 'India' ? 'bg-foreground/5' : ''}`}
                      >
                        <span className="text-xl">🇮🇳</span>
                        <div className="flex-1">
                          <div className="text-sm font-medium">India</div>
                          <div className="text-xs text-foreground/50">₹ INR</div>
                        </div>
                        {country === 'India' && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                      <div className="h-px bg-foreground/10" />
                      <button
                        onClick={() => setCountry('United States')}
                        className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-foreground/5 transition-colors text-left ${country === 'United States' ? 'bg-foreground/5' : ''}`}
                      >
                        <span className="text-xl">🇺🇸</span>
                        <div className="flex-1">
                          <div className="text-sm font-medium">United States</div>
                          <div className="text-xs text-foreground/50">$ USD</div>
                        </div>
                        {country === 'United States' && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Icons: Search, User, Wishlist from sm; Cart + Hamburger always; min touch target 44px on touch */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center flex-shrink-0 gap-1 sm:gap-2 md:gap-3"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchOpen(true)}
                  className="hidden sm:flex p-2.5 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 md:p-0 justify-center items-center text-foreground/70 hover:text-foreground transition-colors rounded-md active:bg-foreground/5"
                  aria-label="Search"
                >
                  <Search size={20} className="sm:w-5 sm:h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(isAuthenticated ? '/account' : '/login?redirect=/account')}
                  className="hidden sm:flex p-2.5 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 md:p-0 justify-center items-center text-foreground/70 hover:text-foreground transition-colors rounded-md active:bg-foreground/5"
                  aria-label="Account"
                >
                  <User size={20} className="sm:w-5 sm:h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/wishlist')}
                  className="hidden sm:flex p-2.5 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 md:p-0 justify-center items-center text-foreground/70 hover:text-foreground transition-colors relative rounded-md active:bg-foreground/5"
                  aria-label="Wishlist"
                >
                  <Heart size={20} className="sm:w-5 sm:h-5" />
                  <AnimatePresence>
                    {wishlistCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-0.5 -right-0.5 sm:top-0 sm:right-0 bg-red-500 text-white text-xs min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1"
                      >
                        {wishlistCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/cart')}
                  className="relative p-2.5 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 sm:p-0 sm:flex justify-center items-center text-foreground/70 hover:text-foreground transition-colors rounded-md active:bg-foreground/5"
                  aria-label="Cart"
                >
                  <ShoppingBag size={22} className="sm:w-5 sm:h-5" />
                  <AnimatePresence>
                    {itemCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-0.5 -right-0.5 sm:top-0 sm:right-0 bg-primary text-primary-foreground text-xs min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1"
                      >
                        {itemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(!isOpen)}
                  className="lg:hidden p-2.5 min-w-[44px] min-h-[44px] flex justify-center items-center rounded-md active:bg-foreground/5"
                  aria-label={isOpen ? 'Close menu' : 'Open menu'}
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Mobile Navigation - scrollable when long, full width below toolbar */}
          <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="pt-4 pb-4 border-t border-border mt-4 max-h-[70vh] overflow-y-auto overscroll-contain">
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
                    onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); navigate('/sale'); }}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate('/sale'); }}
                    className="text-foreground/70 hover:text-foreground transition-colors text-left py-3 px-3 -mx-2 rounded-md active:bg-foreground/5 min-h-[48px] flex items-center"
                    type="button"
                  >
                    Sale
                  </button>
                  <div className="border-t border-border pt-4 mt-3 flex flex-col gap-1">
                    <button
                      onClick={() => { setSearchOpen(true); setIsOpen(false); }}
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
        </div>
        
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
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      
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