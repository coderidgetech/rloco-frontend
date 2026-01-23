import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Search, User, Heart, ChevronDown, Globe, LogIn } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCurrency } from '../context/CurrencyContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SearchModal } from './SearchModal';
import { AccountPage } from './AccountPage';
import { Logo } from './Logo';
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
  // Check login state from localStorage on mount (for regular users, not admin)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Only check localStorage on client side
    if (typeof window === 'undefined') return false;
    try {
      const stored = localStorage.getItem('isLoggedIn');
      return stored === 'true';
    } catch {
      return false;
    }
  });
  
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { country, setCountry } = useCurrency();
  const { config } = useSiteConfig();
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
      // Hero logo starts fading at 75% of 140px = 105px, completely gone by 119px
      // Navbar logo appears at 105px to ensure smooth handoff
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
    setIsLoggedIn(true);
    // Store user data in sessionStorage for better security (vs localStorage)
    try {
      sessionStorage.setItem('userData', JSON.stringify(userData));
      sessionStorage.setItem('isLoggedIn', 'true');
      // Also keep in localStorage for backwards compatibility if needed
      localStorage.setItem('isLoggedIn', 'true');
    } catch (error) {
      console.error('Failed to save login state:', error);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    try {
      sessionStorage.removeItem('userData');
      sessionStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userData');
      localStorage.removeItem('isLoggedIn');
    } catch (error) {
      console.error('Failed to clear login state:', error);
    }
  };

  // Sync login state from storage changes (for multi-tab support)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'isLoggedIn') {
        setIsLoggedIn(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
        style={{ 
          transform: visible ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.3s ease-in-out, background-color 0.3s ease',
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.6)',
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(12px)',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'blur(12px)',
          borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
          boxShadow: scrolled ? '0 1px 3px 0 rgba(0, 0, 0, 0.1)' : 'none'
        }}
      >
        <div className="w-full px-4 md:px-6 lg:px-12 xl:px-16 py-2">
          {/* Main Navigation Row */}
          <div className="grid grid-cols-3 items-center">
            {/* Left Navigation - Desktop */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden md:flex items-center gap-8 justify-start"
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

            {/* Center Logo - appears when hero logo starts fading out */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ 
                opacity: location.pathname === '/' ? (scrolled ? 1 : 0) : 1, 
                scale: 1
              }}
              transition={{ 
                duration: 0.3, 
                ease: [0.22, 1, 0.36, 1],
                opacity: { 
                  duration: 0.25,
                  ease: [0.22, 1, 0.36, 1]
                },
                scale: {
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1]
                }
              }}
              className="flex justify-center text-2xl tracking-tighter cursor-pointer relative"
              onClick={handleLogoClick}
              style={{ 
                pointerEvents: location.pathname === '/' ? (scrolled ? 'auto' : 'none') : 'auto',
                willChange: location.pathname === '/' && !scrolled ? 'opacity, transform' : 'auto'
              }}
            >
              <Logo />
            </motion.div>

            {/* Right Side - Desktop Navigation + Icons */}
            <div className="flex items-center justify-end gap-8">
              {/* Desktop Navigation Links */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="hidden md:flex items-center gap-8"
              >
                <button
                  onClick={() => scrollToSection('categories')}
                  className="text-foreground/70 hover:text-foreground transition-colors relative group"
                >
                  Collections
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-300" />
                </button>

                <button
                  onClick={() => scrollToSection('products')}
                  className="text-foreground/70 hover:text-foreground transition-colors relative group"
                >
                  Promotions
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-300" />
                </button>

                <button
                  onClick={() => navigate('/sale')}
                  className="text-foreground/70 hover:text-foreground transition-colors relative group"
                >
                  Sale
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-300" />
                </button>

                {/* Country Selector */}
                <div className="relative group">
                  <button
                    className="text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1.5 relative"
                  >
                    <span className="text-sm">{country === 'India' ? '🇮🇳' : '🇺🇸'}</span>
                    <span className="text-sm">{country === 'India' ? 'IN' : 'US'}</span>
                    <svg width="8" height="5" viewBox="0 0 8 5" fill="none" className="opacity-70">
                      <path d="M1 1L4 4L7 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-300" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute top-full right-0 mt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="bg-white shadow-2xl border border-foreground/10 min-w-[180px] overflow-hidden">
                      <button
                        onClick={() => setCountry('India')}
                        className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-foreground/5 transition-colors text-left ${
                          country === 'India' ? 'bg-foreground/5' : ''
                        }`}
                      >
                        <span className="text-xl">🇮🇳</span>
                        <div className="flex-1">
                          <div className="text-sm font-medium">India</div>
                          <div className="text-xs text-foreground/50">₹ INR</div>
                        </div>
                        {country === 'India' && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                      <div className="h-px bg-foreground/10" />
                      <button
                        onClick={() => setCountry('United States')}
                        className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-foreground/5 transition-colors text-left ${
                          country === 'United States' ? 'bg-foreground/5' : ''
                        }`}
                      >
                        <span className="text-xl">🇺🇸</span>
                        <div className="flex-1">
                          <div className="text-sm font-medium">United States</div>
                          <div className="text-xs text-foreground/50">$ USD</div>
                        </div>
                        {country === 'United States' && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Icons */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchOpen(true)}
                  className="hidden md:block text-foreground/70 hover:text-foreground transition-colors"
                >
                  <Search size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAccountOpen(true)}
                  className="hidden md:block text-foreground/70 hover:text-foreground transition-colors"
                >
                  <User size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/wishlist')}
                  className="hidden md:block text-foreground/70 hover:text-foreground transition-colors relative"
                >
                  <Heart size={20} />
                  <AnimatePresence>
                    {wishlistCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
                      >
                        {wishlistCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/cart')}
                  className="relative text-foreground/70 hover:text-foreground transition-colors"
                >
                  <ShoppingBag size={20} />
                  <AnimatePresence>
                    {itemCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center"
                      >
                        {itemCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
                
                {/* Mobile Menu Button */}
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="md:hidden"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.button>
              </motion.div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden pt-4 pb-4 border-t border-border mt-4">
              <div className="flex flex-col gap-1">
                <button
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('New Arrivals touched');
                    scrollToSection('products');
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('New Arrivals clicked');
                    scrollToSection('products');
                  }}
                  className="text-foreground/70 hover:text-foreground transition-colors text-left py-3 px-2 -mx-2 rounded-md active:bg-foreground/5"
                  type="button"
                >
                  New Arrivals
                </button>
                
                {/* Women Menu with Sub-items */}
                <div>
                  <button
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Women touched');
                      setMobileSubMenu(mobileSubMenu === 'women' ? null : 'women');
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Women clicked');
                      setMobileSubMenu(mobileSubMenu === 'women' ? null : 'women');
                    }}
                    className="text-foreground/70 hover:text-foreground transition-colors text-left w-full flex items-center justify-between py-3 px-2 -mx-2 rounded-md active:bg-foreground/5"
                    type="button"
                  >
                    <span>Women</span>
                    <ChevronDown size={16} className={`transition-transform duration-300 ${mobileSubMenu === 'women' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {mobileSubMenu === 'women' && (
                    <div className="pl-4 pt-2 flex flex-col gap-1">
                      <button
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('View All Women touched');
                          handleCategoryClick('women');
                          setTimeout(() => {
                            setIsOpen(false);
                            setMobileSubMenu(null);
                          }, 100);
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('View All Women clicked');
                          handleCategoryClick('women');
                          setTimeout(() => {
                            setIsOpen(false);
                            setMobileSubMenu(null);
                          }, 100);
                        }}
                        className="text-sm text-foreground/60 hover:text-primary transition-colors text-left py-2 px-2 -mx-2 rounded-md active:bg-foreground/5"
                        type="button"
                      >
                        View All Women's
                      </button>
                      <div className="text-xs text-primary uppercase tracking-wider mt-2 mb-1 px-2">Clothing</div>
                      {womenCategories.clothing.map((item) => (
                        <button
                          key={item}
                          onTouchEnd={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log(`${item} touched`);
                            handleCategoryClick('women', item);
                            setTimeout(() => {
                              setIsOpen(false);
                              setMobileSubMenu(null);
                            }, 100);
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log(`${item} clicked`);
                            handleCategoryClick('women', item);
                            setTimeout(() => {
                              setIsOpen(false);
                              setMobileSubMenu(null);
                            }, 100);
                          }}
                          className="text-sm text-foreground/60 hover:text-primary transition-colors text-left py-2 px-2 -mx-2 rounded-md active:bg-foreground/5"
                          type="button"
                        >
                          {item}
                        </button>
                      ))}
                      <div className="text-xs text-primary uppercase tracking-wider mt-2 mb-1 px-2">Accessories</div>
                      {womenCategories.accessories.map((item) => (
                        <button
                          key={item}
                          onTouchEnd={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log(`${item} touched`);
                            handleCategoryClick('women', item);
                            setTimeout(() => {
                              setIsOpen(false);
                              setMobileSubMenu(null);
                            }, 100);
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log(`${item} clicked`);
                            handleCategoryClick('women', item);
                            setTimeout(() => {
                              setIsOpen(false);
                              setMobileSubMenu(null);
                            }, 100);
                          }}
                          className="text-sm text-foreground/60 hover:text-primary transition-colors text-left py-2 px-2 -mx-2 rounded-md active:bg-foreground/5"
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
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Men touched');
                      setMobileSubMenu(mobileSubMenu === 'men' ? null : 'men');
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log('Men clicked');
                      setMobileSubMenu(mobileSubMenu === 'men' ? null : 'men');
                    }}
                    className="text-foreground/70 hover:text-foreground transition-colors text-left w-full flex items-center justify-between py-3 px-2 -mx-2 rounded-md active:bg-foreground/5"
                    type="button"
                  >
                    <span>Men</span>
                    <ChevronDown size={16} className={`transition-transform duration-300 ${mobileSubMenu === 'men' ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {mobileSubMenu === 'men' && (
                    <div className="pl-4 pt-2 flex flex-col gap-1">
                      <button
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('View All Men touched');
                          handleCategoryClick('men');
                          setTimeout(() => {
                            setIsOpen(false);
                            setMobileSubMenu(null);
                          }, 100);
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('View All Men clicked');
                          handleCategoryClick('men');
                          setTimeout(() => {
                            setIsOpen(false);
                            setMobileSubMenu(null);
                          }, 100);
                        }}
                        className="text-sm text-foreground/60 hover:text-primary transition-colors text-left py-2 px-2 -mx-2 rounded-md active:bg-foreground/5"
                        type="button"
                      >
                        View All Men's
                      </button>
                      <div className="text-xs text-primary uppercase tracking-wider mt-2 mb-1 px-2">Clothing</div>
                      {menCategories.clothing.map((item) => (
                        <button
                          key={item}
                          onTouchEnd={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log(`${item} touched`);
                            handleCategoryClick('men', item);
                            setTimeout(() => {
                              setIsOpen(false);
                              setMobileSubMenu(null);
                            }, 100);
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log(`${item} clicked`);
                            handleCategoryClick('men', item);
                            setTimeout(() => {
                              setIsOpen(false);
                              setMobileSubMenu(null);
                            }, 100);
                          }}
                          className="text-sm text-foreground/60 hover:text-primary transition-colors text-left py-2 px-2 -mx-2 rounded-md active:bg-foreground/5"
                          type="button"
                        >
                          {item}
                        </button>
                      ))}
                      <div className="text-xs text-primary uppercase tracking-wider mt-2 mb-1 px-2">Accessories</div>
                      {menCategories.accessories.map((item) => (
                        <button
                          key={item}
                          onTouchEnd={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log(`${item} touched`);
                            handleCategoryClick('men', item);
                            setTimeout(() => {
                              setIsOpen(false);
                              setMobileSubMenu(null);
                            }, 100);
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log(`${item} clicked`);
                            handleCategoryClick('men', item);
                            setTimeout(() => {
                              setIsOpen(false);
                              setMobileSubMenu(null);
                            }, 100);
                          }}
                          className="text-sm text-foreground/60 hover:text-primary transition-colors text-left py-2 px-2 -mx-2 rounded-md active:bg-foreground/5"
                          type="button"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <button
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Collections touched');
                    scrollToSection('categories');
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Collections clicked');
                    scrollToSection('categories');
                  }}
                  className="text-foreground/70 hover:text-foreground transition-colors text-left py-3 px-2 -mx-2 rounded-md active:bg-foreground/5"
                  type="button"
                >
                  Collections
                </button>
                
                <button
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Sale touched');
                    navigate('/sale');
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Sale clicked');
                    navigate('/sale');
                  }}
                  className="text-foreground/70 hover:text-foreground transition-colors text-left py-3 px-2 -mx-2 rounded-md active:bg-foreground/5"
                  type="button"
                >
                  Sale
                </button>
                
                <div className="border-t border-border pt-4 mt-3 flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setSearchOpen(true);
                      setIsOpen(false);
                    }}
                    className="text-foreground/70 hover:text-foreground transition-colors text-left flex items-center gap-2 py-3 px-2 -mx-2 rounded-md active:bg-foreground/5"
                    type="button"
                  >
                    <Search size={18} />
                    Search
                  </button>
                  <button
                    onClick={() => {
                      setAccountOpen(true);
                      setIsOpen(false);
                    }}
                    className="text-foreground/70 hover:text-foreground transition-colors text-left flex items-center gap-2 py-3 px-2 -mx-2 rounded-md active:bg-foreground/5"
                    type="button"
                  >
                    <User size={18} />
                    Account
                  </button>
                  <button
                    onClick={() => {
                      navigate('/wishlist');
                      setIsOpen(false);
                    }}
                    className="text-foreground/70 hover:text-foreground transition-colors text-left flex items-center gap-2 py-3 px-2 -mx-2 rounded-md active:bg-foreground/5"
                    type="button"
                  >
                    <Heart size={18} />
                    Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                  </button>
                </div>
              </div>
            </div>
          )}
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
      
      {/* Show LoginModal if not logged in, AccountPage if logged in */}
      {isLoggedIn ? (
        <AccountPage 
          isOpen={accountOpen} 
          onClose={() => setAccountOpen(false)} 
          onLogout={handleLogout}
        />
      ) : (
        <LoginModal 
          isOpen={accountOpen} 
          onClose={() => setAccountOpen(false)} 
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
}