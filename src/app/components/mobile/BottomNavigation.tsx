import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Home, Search, ShoppingBag, User, type LucideIcon } from 'lucide-react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useCart } from '@/app/context/CartContext';
import { useUser } from '@/app/context/UserContext';
import { useSearchOverlay } from '@/app/context/SearchOverlayContext';
import { ACCOUNT_DEFAULT_PATH, isAccountPath } from '@/app/lib/accountRoutes';

export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { openSearch, isSearchOpen } = useSearchOverlay();
  const { itemCount } = useCart();
  const { isAuthenticated } = useUser();

  // Visible near the top and while scrolling up; hides while scrolling down,
  // so it doesn't sit over content the user is actively reading further down
  // the page.
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;
      if (y < 40) {
        setVisible(true);
      } else if (delta > 4) {
        setVisible(false);
      } else if (delta < -4) {
        setVisible(true);
      }
      lastScrollY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isSearchTabActive =
    isSearchOpen ||
    (location.pathname === '/all-products' && searchParams.get('from') === 'search');

  const goAccount = () =>
    navigate(
      isAuthenticated
        ? ACCOUNT_DEFAULT_PATH
        : `/login?redirect=${encodeURIComponent(ACCOUNT_DEFAULT_PATH)}`,
    );

  const tabs: {
    key: string;
    Icon: LucideIcon;
    active: boolean;
    onClick: () => void;
    badge?: number;
  }[] = [
    { key: 'Home', Icon: Home, active: location.pathname === '/', onClick: () => navigate('/') },
    { key: 'Search', Icon: Search, active: isSearchTabActive, onClick: () => openSearch() },
    { key: 'Account', Icon: User, active: isAccountPath(location.pathname), onClick: goAccount },
    { key: 'Cart', Icon: ShoppingBag, active: location.pathname === '/cart', onClick: () => navigate('/cart'), badge: itemCount },
  ];

  return (
    <motion.nav
      initial={false}
      animate={{ y: visible ? 0 : 96, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-4 right-4 z-50 md:hidden rounded-full bg-white/35 backdrop-blur-xl border border-white/25"
      style={{
        bottom: 'calc(0.75rem + env(safe-area-inset-bottom))',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div className="flex items-center justify-around h-14 px-2">
        {tabs.map(({ key, Icon, active, onClick, badge }) => (
          <button
            key={key}
            onClick={onClick}
            aria-label={key}
            className="flex items-center justify-center flex-1 h-full"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div
              className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                active ? 'bg-foreground/10' : ''
              }`}
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.4 : 1.8}
                className={active ? 'text-foreground/80' : 'text-foreground/50'}
              />
              {badge != null && badge > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-foreground/70 text-background text-[9px] font-bold rounded-full flex items-center justify-center">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </motion.nav>
  );
}
