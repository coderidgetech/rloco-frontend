import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useState, useEffect, type ImgHTMLAttributes } from 'react';
import { RlocoLogo } from './RlocoLogo';
import { ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useNavigate } from 'react-router-dom';

const HERO_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1574288443562-5ccb5bdb46d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGJsYWNrJTIwZHJlc3MlMjBlZGl0b3JpYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3Njc0NDU5NTN8MA&ixlib=rb-4.1.0&q=85&w=1920';

export function Hero() {
  const { config } = useSiteConfig();
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setImgError(false);
  }, [config.homepage.hero.backgroundImage]);
  const ref = useRef<HTMLDivElement>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollThreshold = 140;
  const scrollProgress = Math.min(scrollY / scrollThreshold, 1);

  /** width 0 = pre-hydration: assume desktop so fixed hero logo still shows */
  const showDesktopHeroLogo = windowSize.width === 0 || windowSize.width >= 768;
  const initialScale = 3.8;
  const finalScale = 1;

  const viewportHeight = windowSize.height || window.innerHeight || 1000;
  const heroLogoCenterY = viewportHeight * 0.38;
  const navbarLogoCenterY = 24;
  const totalYMovement = Math.max(0, heroLogoCenterY - navbarLogoCenterY);

  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const easedProgress = easeInOutCubic(scrollProgress);
  const scaleProgress = Math.min(scrollProgress / 0.9, 1);
  const logoScale = 1 + (initialScale - 1) * (1 - scaleProgress);

  const fadeOutStart = 0.9;
  const logoOpacity =
    scrollProgress < fadeOutStart
      ? 1
      : Math.max(0, 1 - (scrollProgress - fadeOutStart) / (1 - fadeOutStart));

  const logoY = -totalYMovement * easedProgress;
  const logoX = 0;

  const sideY1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const sideY2 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const heroImg =
    config.homepage.hero.backgroundImage?.trim() && !imgError
      ? config.homepage.hero.backgroundImage
      : HERO_FALLBACK_IMAGE;

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={ref}
      className="relative isolate min-h-screen min-h-svh w-full overflow-hidden bg-neutral-900"
    >
      {/* Background: absolute fill avoids Windows/Chrome %height quirks when parent only has min-height */}
      <div className="absolute inset-0 min-h-screen min-h-svh">
        <motion.div
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 min-h-screen min-h-svh w-full"
        >
          <img
            src={heroImg}
            alt={config.homepage.hero.heading || 'Hero'}
            className="absolute inset-0 h-full min-h-screen min-h-svh w-full object-cover object-[center_22%] sm:object-[center_28%] md:object-center"
            onError={() => setImgError(true)}
            {...({ fetchpriority: 'high' } as ImgHTMLAttributes<HTMLImageElement>)}
            decoding="async"
          />
          {/* Readability: slightly stronger mids for consistent contrast (Win/mac gamma) */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/15 sm:from-black/70 sm:via-black/22 sm:to-black/10"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-transparent sm:from-black/15"
            aria-hidden
          />
        </motion.div>
      </div>

      {/* Side accents — desktop */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <motion.div style={{ y: sideY1 }} className="absolute left-0 top-1/4">
          <div className="ml-6 flex flex-col space-y-6">
            <motion.div
              initial={{ x: -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 1.2 }}
              className="ml-6 h-32 w-px bg-gradient-to-b from-white/35 via-white/15 to-transparent"
            />
          </div>
        </motion.div>
        <motion.div style={{ y: sideY2 }} className="absolute bottom-1/3 right-0">
          <div className="mr-6 flex flex-col items-end space-y-6">
            <motion.div
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.9, delay: 1.2 }}
              className="mr-6 h-32 w-px bg-gradient-to-b from-white/35 via-white/15 to-transparent"
            />
          </div>
        </motion.div>
        <div className="absolute left-0 top-0 hidden h-40 w-40 border-l-2 border-t-2 border-white/10 xl:block" />
        <div className="absolute right-0 top-0 hidden h-40 w-40 border-r-2 border-t-2 border-white/10 xl:block" />
        <div className="absolute bottom-0 left-0 hidden h-40 w-40 border-b-2 border-l-2 border-white/10 xl:block" />
        <div className="absolute bottom-0 right-0 hidden h-40 w-40 border-b-2 border-r-2 border-white/10 xl:block" />
      </div>

      {/* Desktop/tablet: center logo animates toward nav on scroll */}
      {scrollY < scrollThreshold && showDesktopHeroLogo && (
        <motion.div
          style={{
            scale: logoScale,
            y: logoY,
            x: logoX,
            opacity: logoOpacity,
            willChange: 'transform, opacity',
            transformOrigin: 'center center',
          }}
          className="pointer-events-none fixed left-1/2 top-[38%] z-[45] hidden -translate-x-1/2 -translate-y-1/2 md:block"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{
              filter:
                'drop-shadow(0 6px 24px rgba(0,0,0,0.35)) drop-shadow(0 0 48px rgba(180,119,14,0.12))',
            }}
          >
            <RlocoLogo size="lg" />
          </motion.div>
        </motion.div>
      )}

      {/* Copy + CTAs — on mobile, logo sits above tagline */}
      <div
        className="absolute inset-x-0 bottom-0 z-30 px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-24 antialiased sm:px-8 sm:pb-[calc(2rem+env(safe-area-inset-bottom))] sm:pt-28 md:px-12 md:pb-20 md:pt-32 lg:px-20 lg:pb-24 max-md:pb-[calc(5.5rem+env(safe-area-inset-bottom))]"
      >
        <div className="mx-auto max-w-3xl text-center lg:max-w-4xl [text-rendering:optimizeLegibility]">
          {/* Mobile / small screens: logo directly above subheading */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 flex justify-center md:hidden"
            style={{
              filter:
                'drop-shadow(0 4px 20px rgba(0,0,0,0.4)) drop-shadow(0 0 32px rgba(180,119,14,0.15))',
            }}
          >
            <RlocoLogo size="2xl" className="[&_svg]:h-14 [&_svg]:w-auto sm:[&_svg]:h-16" />
          </motion.div>

          {config.homepage.hero.enabled && (
            <>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mb-3 text-[10px] font-medium uppercase tracking-[0.28em] text-white/90 sm:mb-4 sm:text-xs md:tracking-[0.25em]"
                style={{ textShadow: '0 1px 12px rgba(0,0,0,0.45)' }}
              >
                {config.homepage.hero.subheading || config.general.tagline}
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mb-6 text-balance text-3xl font-light uppercase leading-[1.12] tracking-[0.05em] text-white sm:mb-8 sm:text-4xl sm:leading-[1.14] sm:tracking-[0.06em] md:text-5xl md:leading-[1.1] lg:text-6xl xl:text-7xl"
                style={{ textShadow: '0 2px 24px rgba(0,0,0,0.5)' }}
              >
                {config.homepage.hero.heading || 'Timeless Elegance Redefined'}
              </motion.h2>
            </>
          )}

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
          >
            <Button
              variant="white"
              size="lg"
              onClick={() =>
                navigate(config.homepage.hero.primaryButtonLink || '/all-products')
              }
              className="min-h-12 w-full uppercase tracking-[0.12em] shadow-lg shadow-black/20 sm:min-h-11 sm:w-auto sm:min-w-[200px] sm:px-10"
            >
              {config.homepage.hero.primaryButtonText || 'Shop Collection'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={scrollToProducts}
              className="min-h-12 w-full border-2 border-white/50 bg-white/15 uppercase tracking-[0.12em] text-white backdrop-blur-[8px] hover:bg-white/25 hover:text-white sm:min-h-11 sm:w-auto sm:min-w-[180px]"
            >
              Explore
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        onClick={scrollToProducts}
        className="absolute bottom-[calc(6.5rem+env(safe-area-inset-bottom))] left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 text-white/70 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/50 sm:bottom-10 md:bottom-12"
        aria-label="Scroll to products"
      >
        <span className="text-[10px] uppercase tracking-[0.2em]">Discover</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-6 w-6 opacity-80" strokeWidth={1.5} />
        </motion.div>
      </motion.button>
    </section>
  );
}
