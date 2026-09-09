import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { useSiteConfig } from '@/app/context/SiteConfigContext';
import { RlocoLogo } from '../RlocoLogo';

const HERO_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85';

/**
 * Full-screen editorial hero (matches the desktop web Hero): a single dynamic
 * image from the site config and a transparent RLOKO logo watermark that
 * shrinks and rides up into the header on scroll, mirroring the desktop
 * HeroCenterMark effect. Pulled up under the (transparent) header so it reads
 * edge-to-edge.
 */
export function MobileHero() {
  const { config } = useSiteConfig();
  const hero = config.homepage.hero;
  const image = hero.backgroundImage?.trim() ? hero.backgroundImage : HERO_FALLBACK_IMAGE;

  const ref = useRef<HTMLDivElement>(null);
  const [vh, setVh] = useState(() => (typeof window !== 'undefined' ? window.innerHeight : 800));

  useEffect(() => {
    const update = () => setVh(window.innerHeight);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Logo rests at ~42% down the hero. It's positioned `absolute` inside this
  // (normally-flowed) section, so it already scrolls up 1:1 with the page —
  // no extra `y` transform is needed to make it "arrive" at the header; that
  // would double-count the travel and send it flying off-screen. We only
  // need to time the scale/opacity/x transforms to *finish* exactly when
  // natural scroll has carried it to the header's vertical position.
  //
  // The header (MobileHomeHeader) centers its logo in a `py-3` row against a
  // 40px-tall sibling (the menu/icon buttons), so its vertical center sits at
  // 12 (top padding) + 20 (half of 40px) = 32px from the header's top edge.
  // Horizontally it's absolutely centered at the true viewport middle
  // (independent of the asymmetric icon groups on either side — see
  // MobileHomeHeader), so no x-offset is needed here either. The header logo
  // itself renders at `size="sm"` (24px tall) vs this hero logo's 64px base,
  // so the end scale is 24/64.
  const restCenter = vh * 0.42;
  const headerCenterY = 32;
  const headerScale = 24 / 64;
  // scrollYProgress reaches this value after exactly (restCenter - headerCenterY)
  // px of scroll — the natural distance for the logo to reach the header.
  const arrivalProgress = Math.max(0.05, (restCenter - headerCenterY) / vh);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const logoScale = useTransform(scrollYProgress, [0, arrivalProgress], [1, headerScale]);
  const logoOpacity = useTransform(scrollYProgress, [0, arrivalProgress * 0.85, arrivalProgress], [1, 1, 0]);

  return (
    <section
      ref={ref}
      className="relative -mt-[110px] h-[100svh] w-full overflow-hidden bg-neutral-900"
    >
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

      {/* Legibility overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/65" />

      {/* Scroll-linked logo watermark — shrinks and rides up into the header, matching web */}
      <motion.div
        style={{ scale: logoScale, opacity: logoOpacity, top: restCenter }}
        className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            filter: 'drop-shadow(0 4px 30px rgba(0,0,0,0.3)) drop-shadow(0 0 40px rgba(241,176,65,0.15))',
          }}
        >
          <RlocoLogo size="3xl" className="[&_svg]:h-16" />
        </motion.div>
      </motion.div>
    </section>
  );
}
