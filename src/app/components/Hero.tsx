import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { RlocoLogo } from './RlocoLogo';
import { Sparkles, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useNavigate } from 'react-router-dom';

/** Fallback hero background image when config is missing or image fails to load (from ref project). */
const HERO_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1574288443562-5ccb5bdb46d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGJsYWNrJTIwZHJlc3MlMjBlZGl0b3JpYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3Njc0NDU5NTN8MA&ixlib=rb-4.1.0&q=80&w=1080';

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
    // Set initial window size
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Update on resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Logo animation - smoothly transitions from hero center to navbar
  // Use absolute scroll position to match Navigation component exactly
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial value
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Scroll threshold: 140px (matches Navigation component)
  const scrollThreshold = 140;
  const scrollProgress = Math.min(scrollY / scrollThreshold, 1);
  
  const isMobile = windowSize.width < 768;
  const initialScale = isMobile ? 2.2 : 3.8;
  const finalScale = 1; // Final scale matches navbar logo size
  
  // Calculate exact vertical distance to navbar logo position
  // Hero logo: fixed top-[38%] with -translate-y-1/2 means center is at 38% of viewport
  // Navbar: fixed top-0, py-2 (8px padding), grid items-center centers logo vertically
  // Logo center in navbar: 8px (padding) + 16px (half logo) = 24px from viewport top
  const viewportHeight = windowSize.height || window.innerHeight || 1000;
  const heroLogoCenterY = viewportHeight * 0.38; // Hero logo center Y position (38% from top)
  const navbarLogoCenterY = 24; // Exact navbar logo center (8px padding + 16px center)
  const totalYMovement = heroLogoCenterY - navbarLogoCenterY; // Distance to travel upward
  
  // Smooth easing function for natural motion
  const easeInOutCubic = (t: number) => t < 0.5 
    ? 4 * t * t * t 
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
  
  // Use eased progress for smoother animation
  const easedProgress = easeInOutCubic(scrollProgress);
  
  // Logo scales down smoothly from initialScale to finalScale (1)
  // Scale transition completes at 90% scroll for smooth handoff
  const scaleProgress = Math.min(scrollProgress / 0.9, 1);
  const logoScale = 1 + (initialScale - 1) * (1 - scaleProgress);
  
  // Logo fades out smoothly as it approaches navbar (starts at 90%, invisible by 100%)
  // This creates seamless handoff with navbar logo which fades in at 105px (75% of 140px)
  // Navbar logo appears at 75% scroll (105px), hero logo fades out from 90% to 100%
  const fadeOutStart = 0.90; // Start fading at 90% (126px) - after navbar logo appears
  const logoOpacity = scrollProgress < fadeOutStart 
    ? 1 
    : Math.max(0, 1 - (scrollProgress - fadeOutStart) / (1 - fadeOutStart));
  
  // Move logo smoothly all the way to navbar position
  // Complete the full Y movement using eased progress for smooth motion
  const logoY = -totalYMovement * easedProgress;
  
  // Keep centered horizontally (no X movement needed)
  const logoX = 0;
  
  // Parallax for side decorations
  const sideY1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const sideY2 = useTransform(scrollYProgress, [0, 1], [0, -200]);

  const handleShopDresses = () => {
    // Trigger filter for dresses in women's category
    window.dispatchEvent(new CustomEvent('filterProducts', {
      detail: { gender: 'women', category: 'Dresses' }
    }));
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShopBags = () => {
    // Trigger filter for accessories
    window.dispatchEvent(new CustomEvent('filterProducts', {
      detail: { category: 'Accessories' }
    }));
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      ref={ref} 
      className="relative h-screen w-full overflow-hidden bg-[#c5c5c5]"
      style={{ position: 'relative', isolation: 'isolate' }}
    >
      {/* Background Model Image - Centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-full w-full"
        >
          <img
            src={
              config.homepage.hero.backgroundImage?.trim() && !imgError
                ? config.homepage.hero.backgroundImage
                : HERO_FALLBACK_IMAGE
            }
            alt={config.homepage.hero.heading || 'Elegant woman in black dress'}
            className="h-full w-full object-cover object-center"
            onError={() => setImgError(true)}
          />
          {/* Subtle vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
        </motion.div>
      </div>
      
      {/* Side Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left Side Decorations */}
        <motion.div 
          style={{ y: sideY1 }}
          className="absolute left-0 top-1/4 hidden lg:block"
        >
          <div className="flex flex-col space-y-6 pl-6">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="h-32 w-px bg-gradient-to-b from-white/40 via-white/20 to-transparent ml-6"
            />
          </div>
        </motion.div>
        
        {/* Right Side Decorations */}
        <motion.div 
          style={{ y: sideY2 }}
          className="absolute right-0 bottom-1/3 hidden lg:block"
        >
          <div className="flex flex-col space-y-6 pr-6 items-end">
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 1.4 }}
              className="h-32 w-px bg-gradient-to-b from-white/40 via-white/20 to-transparent mr-6"
            />
          </div>
        </motion.div>
        
        {/* Corner Decorative Lines */}
        <div className="absolute top-0 left-0 w-40 h-40 border-l-2 border-t-2 border-white/10 hidden xl:block" />
        <div className="absolute top-0 right-0 w-40 h-40 border-r-2 border-t-2 border-white/10 hidden xl:block" />
        <div className="absolute bottom-0 left-0 w-40 h-40 border-l-2 border-b-2 border-white/10 hidden xl:block" />
        <div className="absolute bottom-0 right-0 w-40 h-40 border-r-2 border-b-2 border-white/10 hidden xl:block" />
      </div>

      {/* Large Logo in center that smoothly transitions to navbar position */}
      {scrollY < scrollThreshold && (
        <motion.div
          style={{ 
            scale: logoScale,
            y: logoY,
            x: logoX,
            opacity: logoOpacity,
            willChange: 'transform, opacity'
          }}
          className="fixed top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[45] pointer-events-none"
        >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            filter: 'drop-shadow(0 4px 30px rgba(0,0,0,0.3)) drop-shadow(0 0 40px rgba(241,176,65,0.15))',
          }}
        >
          <RlocoLogo size="lg" />
        </motion.div>
      </motion.div>
      )}

      {/* Content Container - Bottom Aligned */}
      <div className="absolute bottom-0 left-0 right-0 z-30 px-6 md:px-12 lg:px-20 pb-16 md:pb-20 lg:pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Tagline */}
          {config.homepage.hero.enabled && (
            <>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-white text-[11px] md:text-xs tracking-[0.25em] mb-4 md:mb-5 text-center uppercase"
                style={{ textShadow: '1px 1px 8px rgba(0,0,0,0.5)' }}
              >
                {config.homepage.hero.subheading || config.general.tagline}
              </motion.p>

              {/* Main Headline */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-white text-2xl md:text-4xl lg:text-5xl xl:text-6xl tracking-[0.08em] uppercase mb-8 md:mb-10 text-center leading-tight"
                style={{ textShadow: '2px 2px 20px rgba(0,0,0,0.6)' }}
              >
                {config.homepage.hero.heading || 'Timeless Elegance Redefined'}
              </motion.h2>
            </>
          )}

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col sm:flex-row gap-4 md:gap-5 justify-center"
          >
            {/* Primary Button */}
            <Button
              variant="white"
              size="lg"
              onClick={() => navigate(config.homepage.hero.primaryButtonLink || '/all-products')}
              className="tracking-[0.15em] uppercase"
            >
              {config.homepage.hero.primaryButtonText || 'Shop Collection'}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Bottom: Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 md:w-7 md:h-11 border-2 border-white/60 rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 bg-white/60 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}