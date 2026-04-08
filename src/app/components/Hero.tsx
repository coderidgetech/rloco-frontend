import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useRef, useState, useEffect, useMemo, type ImgHTMLAttributes } from 'react';
import { RlocoLogo } from './RlocoLogo';
import { ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useNavigate } from 'react-router-dom';

const HERO_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1574288443562-5ccb5bdb46d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGJsYWNrJTIwZHJlc3MlMjBlZGl0b3JpYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3Njc0NDU5NTN8MA&ixlib=rb-4.1.0&q=85&w=1920';

/** Typography + padding when vertical space is tight (matches “Final Design 2” density). */
function getHeroLayout(vh: number) {
  const veryCompact = vh < 660;
  const compact = vh < 840;
  const hideDiscoverHint = vh < 720;

  const bottomWrapClass = veryCompact
    ? 'px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-10 antialiased sm:px-6 sm:pb-4 sm:pt-11 md:px-10 md:pb-12 md:pt-11 lg:px-14 max-md:pb-[calc(4.5rem+env(safe-area-inset-bottom))]'
    : compact
      ? 'px-4 pb-[calc(1.1rem+env(safe-area-inset-bottom))] pt-[clamp(2.25rem,7.5vh,5rem)] antialiased sm:px-8 sm:pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pt-20 md:px-12 md:pb-16 md:pt-20 lg:px-16 lg:pb-20 max-md:pb-[calc(5rem+env(safe-area-inset-bottom))]'
      : 'px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-24 antialiased sm:pb-[calc(2rem+env(safe-area-inset-bottom))] sm:pt-28 md:px-12 md:pb-20 md:pt-28 lg:px-20 lg:pb-24 max-md:pb-[calc(5.5rem+env(safe-area-inset-bottom))]';

  const headlineClass = veryCompact
    ? 'mb-4 text-balance text-2xl font-light uppercase leading-tight tracking-[0.08em] text-white sm:text-3xl md:mb-5 md:text-4xl lg:text-4xl xl:text-5xl'
    : compact
      ? 'mb-5 text-balance text-3xl font-light uppercase leading-tight tracking-[0.08em] text-white sm:mb-6 sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl'
      : 'mb-8 text-balance text-2xl font-light uppercase leading-tight tracking-[0.08em] text-white sm:mb-10 sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl';

  const subheadingClass = veryCompact
    ? 'mb-2 text-center text-[10px] font-medium uppercase tracking-[0.25em] text-white sm:text-xs'
    : compact
      ? 'mb-2 text-center text-[10px] font-medium uppercase tracking-[0.25em] text-white sm:mb-3 sm:text-xs md:text-xs'
      : 'mb-4 text-center text-[11px] font-medium uppercase tracking-[0.25em] text-white md:mb-5 md:text-xs';

  const ctaGapClass = veryCompact ? 'gap-2 sm:gap-3 sm:flex-row' : 'gap-4 md:gap-5';

  return { hideDiscoverHint, bottomWrapClass, headlineClass, subheadingClass, ctaGapClass };
}

/** Rloco Final Design 2: scroll-linked logo; remount when scale range changes (breakpoint). */
function HeroCenterMark({
  scrollYProgress,
  scaleMax,
  viewportHeight,
}: {
  scrollYProgress: MotionValue<number>;
  scaleMax: number;
  viewportHeight: number;
}) {
  const logoScale = useTransform(scrollYProgress, [0, 0.15], [scaleMax, 1]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.12, 0.15], [1, 1, 0]);
  const logoY = useTransform(scrollYProgress, [0, 0.15], [0, -viewportHeight * 0.5 + 28]);
  const logoX = useTransform(scrollYProgress, [0, 0.15], [0, 0]);

  return (
    <motion.div
      style={{
        scale: logoScale,
        y: logoY,
        x: logoX,
        opacity: logoOpacity,
      }}
      className="pointer-events-none absolute left-1/2 top-[38%] z-10 -translate-x-1/2 -translate-y-1/2"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{
          filter:
            'drop-shadow(0 4px 30px rgba(0,0,0,0.3)) drop-shadow(0 0 40px rgba(241,176,65,0.15))',
        }}
      >
        <RlocoLogo
          size="lg"
          className="min-[1024px]:[&_svg]:!h-11 min-[1280px]:[&_svg]:!h-12 min-[1536px]:[&_svg]:!h-14"
        />
      </motion.div>
    </motion.div>
  );
}

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

  const vw =
    windowSize.width > 0 ? windowSize.width : typeof window !== 'undefined' ? window.innerWidth : 1280;
  const vh =
    windowSize.height > 0 ? windowSize.height : typeof window !== 'undefined' ? window.innerHeight : 800;

  const heroLayout = useMemo(() => getHeroLayout(vh), [vh]);
  const scaleMax = vw < 768 ? 2.2 : 3.8;

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
      className="relative isolate h-screen min-h-svh w-full min-w-0 overflow-hidden bg-neutral-900"
    >
      {/* Background — z-0; vignette aligned with Final Design 2 + extra bottom read for CTAs */}
      <div className="absolute inset-0 z-0 min-h-svh">
        <motion.div
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 min-h-svh w-full"
        >
          <img
            src={heroImg}
            alt={config.homepage.hero.heading || 'Hero'}
            className="absolute inset-0 h-full min-h-svh w-full object-cover object-[center_22%] sm:object-[center_28%] md:object-center"
            onError={() => setImgError(true)}
            {...({ fetchpriority: 'high' } as ImgHTMLAttributes<HTMLImageElement>)}
            decoding="async"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent sm:from-black/45"
            aria-hidden
          />
        </motion.div>
      </div>

      {/* Content layer — logo z-10, copy z-30 (text always paints above mark, per design reference). */}
      <div className="relative z-20 h-full min-h-svh w-full min-w-0">
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <motion.div style={{ y: sideY1 }} className="absolute left-0 top-1/4">
            <div className="flex flex-col space-y-6 pl-6">
              <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 1.4 }}
                className="ml-6 h-32 w-px bg-gradient-to-b from-white/40 via-white/20 to-transparent"
              />
            </div>
          </motion.div>
          <motion.div style={{ y: sideY2 }} className="absolute bottom-1/3 right-0">
            <div className="flex flex-col items-end space-y-6 pr-6">
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 1.4 }}
                className="mr-6 h-32 w-px bg-gradient-to-b from-white/40 via-white/20 to-transparent"
              />
            </div>
          </motion.div>
          <div className="absolute left-0 top-0 hidden h-40 w-40 border-l-2 border-t-2 border-white/10 xl:block" />
          <div className="absolute right-0 top-0 hidden h-40 w-40 border-r-2 border-t-2 border-white/10 xl:block" />
          <div className="absolute bottom-0 left-0 hidden h-40 w-40 border-b-2 border-l-2 border-white/10 xl:block" />
          <div className="absolute bottom-0 right-0 hidden h-40 w-40 border-b-2 border-r-2 border-white/10 xl:block" />
        </div>

        <HeroCenterMark
          key={scaleMax}
          scrollYProgress={scrollYProgress}
          scaleMax={scaleMax}
          viewportHeight={vh}
        />

        <div className={`absolute inset-x-0 bottom-0 z-30 ${heroLayout.bottomWrapClass}`}>
          <div className="mx-auto max-w-4xl text-center [text-rendering:optimizeLegibility]">
            {config.homepage.hero.enabled && (
              <>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className={heroLayout.subheadingClass}
                  style={{ textShadow: '1px 1px 8px rgba(0,0,0,0.5)' }}
                >
                  {config.homepage.hero.subheading || config.general.tagline}
                </motion.p>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className={heroLayout.headlineClass}
                  style={{ textShadow: '2px 2px 20px rgba(0,0,0,0.6)' }}
                >
                  {config.homepage.hero.heading || 'Timeless Elegance Redefined'}
                </motion.h2>
              </>
            )}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className={`flex flex-col items-stretch justify-center sm:flex-row sm:flex-wrap sm:items-center ${heroLayout.ctaGapClass}`}
            >
              <Button
                variant="white"
                size="lg"
                onClick={() =>
                  navigate(config.homepage.hero.primaryButtonLink || '/all-products')
                }
                className="min-h-12 w-full uppercase tracking-[0.15em] shadow-lg shadow-black/20 sm:min-h-11 sm:w-auto sm:min-w-[200px] sm:px-10"
              >
                {config.homepage.hero.primaryButtonText || 'Shop Collection'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={scrollToProducts}
                className="min-h-12 w-full border-2 border-white/50 bg-white/15 uppercase tracking-[0.15em] text-white backdrop-blur-[8px] hover:bg-white/25 hover:text-white sm:min-h-11 sm:w-auto sm:min-w-[180px]"
              >
                Explore
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.button
        type="button"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        onClick={scrollToProducts}
        className={`absolute left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-1 text-white/70 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/50 ${
          heroLayout.hideDiscoverHint
            ? 'hidden'
            : 'bottom-[calc(6.5rem+env(safe-area-inset-bottom))] sm:bottom-10 md:bottom-12'
        }`}
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
