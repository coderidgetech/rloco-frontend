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
      className="fixed left-4 right-4 z-50 overflow-hidden rounded-full border border-white/45 bg-white/45 backdrop-blur-xl backdrop-saturate-150 md:hidden dark:border-white/10 dark:bg-neutral-950/45"
      style={{
        bottom: 'calc(0.75rem + env(safe-area-inset-bottom))',
        boxShadow:
          '0 10px 28px rgba(15, 23, 42, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.55)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"
      />
      <div className="flex h-14 items-center justify-around px-2">
        {tabs.map(({ key, Icon, active, onClick, badge }) => (
          <button
            key={key}
            onClick={onClick}
            aria-label={key}
            className="flex h-full flex-1 items-center justify-center"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div
              className={`relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${
                active ? 'bg-white/55 shadow-sm ring-1 ring-white/60 dark:bg-white/10 dark:ring-white/10' : ''
              }`}
            >
              <Icon
                size={24}
                strokeWidth={active ? 2.4 : 1.85}
                className={active ? 'text-foreground' : 'text-foreground/75'}
              />
              {badge != null && badge > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-foreground/70 px-1 text-[9px] font-bold text-background">
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
