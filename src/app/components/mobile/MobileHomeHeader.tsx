import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '@/app/context/WishlistContext';
import { useCart } from '@/app/context/CartContext';
import { useSiteConfig } from '@/app/context/SiteConfigContext';
import { RlocoLogo } from '../RlocoLogo';

interface MobileHomeHeaderProps {
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export function MobileHomeHeader(_props: MobileHomeHeaderProps = {}) {
  const navigate = useNavigate();
  const { itemCount } = useWishlist();
  const { itemCount: cartCount } = useCart();
  const { config } = useSiteConfig();

  // Over the full-screen hero the header is transparent (white icons); once the
  // user scrolls past it, it becomes solid white (dark icons).
  const heroEnabled = config.homepage.hero.enabled;
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const over = heroEnabled && !scrolled;

  // Over the hero the icons are white with a soft shadow so they stay legible
  // over bright parts of the image too.
  const iconColor = over
    ? 'text-white [filter:drop-shadow(0_1px_4px_rgba(0,0,0,0.55))]'
    : 'text-foreground/80';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        over ? 'bg-transparent' : 'bg-white border-b border-border/10'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      {/* Scrim so white icons stay legible over the hero image */}
      {over && (
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/25 to-transparent" />
      )}

      {/* Logo and Action Icons Section */}
      <div className={`px-4 py-3 flex items-center justify-between ${over ? '' : 'border-b border-border/10'}`}>
        <RlocoLogo size="sm" className={over ? '[filter:brightness(0)_invert(1)_drop-shadow(0_1px_4px_rgba(0,0,0,0.5))]' : ''} />

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/wishlist')}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors touch-manipulation ${over ? 'bg-black/30' : 'active:bg-foreground/5'}`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-label="Wishlist"
          >
            <Heart size={24} className={iconColor} />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate('/cart')}
            className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors touch-manipulation ${over ? 'bg-black/30' : 'active:bg-foreground/5'}`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-label="Cart"
          >
            <ShoppingBag size={24} className={iconColor} />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
