import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { useWishlist } from '@/app/context/WishlistContext';
import { useCart } from '@/app/context/CartContext';
import { useSiteConfig } from '@/app/context/SiteConfigContext';
import { RlocoLogo } from '../RlocoLogo';
import { MobileNavDrawer } from '../MobileNavDrawer';

interface MobileHomeHeaderProps {
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export function MobileHomeHeader(_props: MobileHomeHeaderProps = {}) {
  const navigate = useNavigate();
  const { itemCount } = useWishlist();
  const { itemCount: cartCount } = useCart();
  const { config } = useSiteConfig();
  const [menuOpen, setMenuOpen] = useState(false);

  // Over the full-screen hero the header is transparent (white icons); once the
  // user scrolls past it, it becomes solid white (dark icons).
  const heroEnabled = config.homepage.hero.enabled;
  const [scrolled, setScrolled] = useState(false);
  // The hero's own big logo (MobileHero) rests at 42% of the hero's height
  // and needs (0.42*vh - 32) px of scroll to naturally reach this header's
  // logo position, fading out over the last 15% of that distance. Fade this
  // logo in over that same final stretch so the handoff is one continuous
  // crossfade with no gap — a separate CSS-timed transition would lag behind
  // fast scrolls and read as "logo vanishes, then reappears".
  const [logoOpacity, setLogoOpacity] = useState(heroEnabled ? 0 : 1);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.55);
      if (heroEnabled) {
        const vh = window.innerHeight;
        const end = Math.max(vh * 0.05, vh * 0.42 - 32);
        const start = end * 0.85;
        setLogoOpacity(Math.min(1, Math.max(0, (window.scrollY - start) / (end - start))));
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [heroEnabled]);
  const over = heroEnabled && !scrolled;

  // Over the hero the icons are white with a soft shadow so they stay legible
  // over bright parts of the image too.
  const iconColor = over
    ? 'text-white [filter:drop-shadow(0_1px_4px_rgba(0,0,0,0.55))]'
    : 'text-foreground/80';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        over ? 'bg-transparent' : 'bg-white/35 backdrop-blur-xl border-b border-white/25'
      }`}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      {/* Scrim so white icons stay legible over the hero image */}
      {over && (
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/25 to-transparent" />
      )}

      {/* Logo and Action Icons Section */}
      <div className={`relative px-4 py-2 flex items-center justify-between ${over ? '' : 'border-b border-white/20'}`}>
        <button
          onClick={() => setMenuOpen((open) => !open)}
          className={`relative w-9 h-9 -ml-1.5 rounded-full flex items-center justify-center transition-colors touch-manipulation ${over ? 'bg-black/30' : 'active:bg-foreground/5'}`}
          style={{ WebkitTapHighlightColor: 'transparent' }}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={20} className={iconColor} /> : <Menu size={20} className={iconColor} />}
        </button>

        {/* True viewport-center regardless of the icon groups' widths on either
            side (they're asymmetric: one 40px button left, two + gap right) —
            matches the same absolute-centering technique Navigation.tsx uses. */}
        <div
          style={{ opacity: logoOpacity }}
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${logoOpacity < 1 ? 'pointer-events-none' : ''}`}
        >
          <RlocoLogo size="sm" className={`[&_svg]:h-[18px] ${over ? '[filter:drop-shadow(0_1px_4px_rgba(0,0,0,0.5))]' : ''}`} />
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate('/wishlist')}
            className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors touch-manipulation ${over ? 'bg-black/30' : 'active:bg-foreground/5'}`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-label="Wishlist"
          >
            <Heart size={20} className={iconColor} />
            {itemCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] px-1 bg-destructive text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate('/cart')}
            className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-colors touch-manipulation ${over ? 'bg-black/30' : 'active:bg-foreground/5'}`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-label="Cart"
          >
            <ShoppingBag size={20} className={iconColor} />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] px-1 bg-destructive text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <MobileNavDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
