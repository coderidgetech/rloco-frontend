import { motion } from 'motion/react';
import { Home, Grid, Search, ShoppingBag, User, Heart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/app/context/CartContext';
import { useWishlist } from '@/app/context/WishlistContext';
import { useUser } from '@/app/context/UserContext';
import { useState } from 'react';

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { isAuthenticated } = useUser();
  const [activeTab, setActiveTab] = useState('home');

  const isActive = (path: string) => location.pathname === path;

  const handleNavigation = (path: string, tab: string) => {
    setActiveTab(tab);
    navigate(path);
  };

  const handleAccountClick = () => {
    const target = isAuthenticated ? '/account' : '/login?redirect=/account';
    handleNavigation(target, 'account');
  };

  return (
    <motion.nav
      initial={false}
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border/50 md:hidden safe-area-bottom"
      style={{
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {/* Home */}
        <button
          onClick={() => handleNavigation('/', 'home')}
          className="flex flex-col items-center justify-center flex-1 h-full relative group"
        >
          <div className={`flex flex-col items-center transition-all ${
            isActive('/') ? 'scale-110' : 'scale-100'
          }`}>
            <div className="relative">
              <Home
                size={22}
                className={`transition-all ${
                  isActive('/') 
                    ? 'text-primary stroke-[2.5]' 
                    : 'text-foreground/60 group-active:text-primary'
                }`}
                fill={isActive('/') ? '#B4770E' : 'none'}
              />
            </div>
            <span className={`text-[10px] mt-1 font-medium transition-all ${
              isActive('/') ? 'text-primary' : 'text-foreground/60 group-active:text-primary'
            }`}>
              Home
            </span>
          </div>
          {isActive('/') && (
            <motion.div
              layoutId="activeTab"
              className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </button>

        {/* Categories */}
        <button
          onClick={() => handleNavigation('/categories', 'categories')}
          className="flex flex-col items-center justify-center flex-1 h-full relative group"
        >
          <div className={`flex flex-col items-center transition-all ${
            isActive('/categories') ? 'scale-110' : 'scale-100'
          }`}>
            <Grid
              size={22}
              className={`transition-all ${
                isActive('/categories') 
                  ? 'text-primary stroke-[2.5]' 
                  : 'text-foreground/60 group-active:text-primary'
              }`}
            />
            <span className={`text-[10px] mt-1 font-medium transition-all ${
              isActive('/categories') ? 'text-primary' : 'text-foreground/60 group-active:text-primary'
            }`}>
              Categories
            </span>
          </div>
          {isActive('/categories') && (
            <motion.div
              layoutId="activeTab"
              className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </button>

        {/* Search */}
        <button
          onClick={() => handleNavigation('/search', 'search')}
          className="flex flex-col items-center justify-center flex-1 h-full relative group"
        >
          <div className={`flex flex-col items-center transition-all ${
            isActive('/search') ? 'scale-110' : 'scale-100'
          }`}>
            <Search
              size={22}
              className={`transition-all ${
                isActive('/search') 
                  ? 'text-primary stroke-[2.5]' 
                  : 'text-foreground/60 group-active:text-primary'
              }`}
            />
            <span className={`text-[10px] mt-1 font-medium transition-all ${
              isActive('/search') ? 'text-primary' : 'text-foreground/60 group-active:text-primary'
            }`}>
              Search
            </span>
          </div>
          {isActive('/search') && (
            <motion.div
              layoutId="activeTab"
              className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </button>

        {/* Account */}
        <button
          onClick={handleAccountClick}
          className="flex flex-col items-center justify-center flex-1 h-full relative group"
        >
          <div className={`flex flex-col items-center transition-all ${
            location.pathname === '/account' ? 'scale-110' : 'scale-100'
          }`}>
            <div className="relative">
              <User
                size={22}
                className={`transition-all ${
                  location.pathname === '/account' 
                    ? 'text-primary stroke-[2.5]' 
                    : 'text-foreground/60 group-active:text-primary'
                }`}
                fill={location.pathname === '/account' ? '#B4770E' : 'none'}
              />
            </div>
            <span className={`text-[10px] mt-1 font-medium transition-all ${
              location.pathname === '/account' ? 'text-primary' : 'text-foreground/60 group-active:text-primary'
            }`}>
              Account
            </span>
          </div>
          {location.pathname === '/account' && (
            <motion.div
              layoutId="activeTab"
              className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </button>

        {/* Cart */}
        <button
          onClick={() => handleNavigation('/cart', 'cart')}
          className="flex flex-col items-center justify-center flex-1 h-full relative group"
        >
          <div className={`flex flex-col items-center transition-all ${
            location.pathname === '/cart' ? 'scale-110' : 'scale-100'
          }`}>
            <div className="relative">
              <ShoppingBag
                size={22}
                className={`transition-all ${
                  location.pathname === '/cart' 
                    ? 'text-primary stroke-[2.5]' 
                    : 'text-foreground/60 group-active:text-primary'
                }`}
                fill={location.pathname === '/cart' ? '#B4770E' : 'none'}
              />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </div>
            <span className={`text-[10px] mt-1 font-medium transition-all ${
              location.pathname === '/cart' ? 'text-primary' : 'text-foreground/60 group-active:text-primary'
            }`}>
              Cart
            </span>
          </div>
          {location.pathname === '/cart' && (
            <motion.div
              layoutId="activeTab"
              className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </button>
      </div>
    </motion.nav>
  );
}