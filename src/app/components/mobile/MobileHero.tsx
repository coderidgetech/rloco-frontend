import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useSiteConfig } from '@/app/context/SiteConfigContext';
import { RlocoLogo } from '../RlocoLogo';

const HERO_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85';

/**
 * Full-screen editorial hero (matches the desktop web Hero): a single dynamic
 * image from the site config, a centered transparent RLOKO logo watermark, and a
 * "Shop Now" link. No carousel. Pulled up under the (transparent) header so it
 * reads edge-to-edge.
 */
export function MobileHero() {
  const { config } = useSiteConfig();
  const navigate = useNavigate();
  const hero = config.homepage.hero;

  const image = hero.backgroundImage?.trim() ? hero.backgroundImage : HERO_FALLBACK_IMAGE;
  const cta = hero.primaryButtonText?.trim() || 'Shop Now';
  const link = hero.primaryButtonLink?.trim() || '/all-products';

  return (
    <section className="relative -mt-[110px] h-[100svh] w-full overflow-hidden bg-neutral-900">
      {/* Dynamic background image */}
      <motion.img
        key={image}
        src={image}
        alt=""
        initial={{ scale: 1.06, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 h-full w-full object-cover object-[center_25%]"
      />

      {/* Legibility overlays: darken top (header) and bottom (CTA) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/65" />

      {/* Centered transparent logo watermark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ filter: 'drop-shadow(0 6px 30px rgba(0,0,0,0.45))' }}
      >
        <RlocoLogo
          size="3xl"
          className="opacity-90 [&_svg]:h-16 [filter:brightness(0)_invert(1)]"
        />
      </motion.div>

      {/* Bottom content: subheading, heading, Shop Now link */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-6 pb-[calc(7rem+env(safe-area-inset-bottom))] text-center">
        {hero.subheading && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-2 text-[11px] font-medium uppercase tracking-[0.25em] text-white/90"
            style={{ textShadow: '1px 1px 8px rgba(0,0,0,0.6)' }}
          >
            {hero.subheading}
          </motion.p>
        )}
        {hero.heading && (
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-6 text-3xl font-light uppercase leading-tight tracking-[0.08em] text-white"
            style={{ textShadow: '2px 2px 20px rgba(0,0,0,0.6)' }}
          >
            {hero.heading}
          </motion.h1>
        )}
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate(link)}
          className="text-sm font-medium uppercase tracking-[0.2em] text-white underline decoration-1 underline-offset-8 active:opacity-80"
          style={{ textShadow: '1px 1px 8px rgba(0,0,0,0.6)' }}
        >
          {cta}
        </motion.button>
      </div>
    </section>
  );
}
