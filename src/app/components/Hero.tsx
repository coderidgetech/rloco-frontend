import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { Logo } from './Logo';
import { Sparkles, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useNavigate } from 'react-router-dom';

export function Hero() {
  const { config } = useSiteConfig();
  const navigate = useNavigate();
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
  
  // Calculate exact vertical distance to navbar logo position
  // Hero logo: absolute top-[38%] with -translate-y-1/2 means center is at 38% of viewport
  // Navbar: fixed top-0, py-2 (8px padding), grid items-center centers logo vertically
  // Logo center in navbar: 8px (padding) + 16px (half logo) = 24px from viewport top
  const viewportHeight = windowSize.height || window.innerHeight || 1000;
  const heroLogoCenterY = viewportHeight * 0.38; // Hero logo center Y position
  const navbarLogoCenterY = 24; // Exact navbar logo center (8px padding + 16px center)
  const totalYMovement = heroLogoCenterY - navbarLogoCenterY;
  
  // Logo should stop moving and fade out at 75% of scroll (105px) - well before navbar
  // This ensures it never visually reaches or passes over the toolbar
  const fadeOutStart = 0.75; // Start fading at 75% (105px)
  const movementLimit = 0.75; // Stop movement at 75% to prevent overflow
  
  // Smooth scale transition - complete before fade out
  const logoScale = scrollProgress < movementLimit 
    ? 1 + (initialScale - 1) * (1 - scrollProgress / movementLimit)
    : 1;
  
  // Logo fades out starting at 75% - completely invisible by 85%
  // This ensures it never visually passes over the toolbar
  const logoOpacity = scrollProgress < fadeOutStart 
    ? 1 
    : scrollProgress < 0.85 
      ? Math.max(0, 1 - (scrollProgress - fadeOutStart) / 0.1)
      : 0;
  
  // Move logo up - but stop movement at 75% so it never reaches navbar
  const logoY = scrollProgress < movementLimit 
    ? -totalYMovement * (scrollProgress / movementLimit) * 0.8 // Only move 80% of distance
    : -totalYMovement * 0.8 * (movementLimit / movementLimit); // Lock at max position
  
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
      style={{ position: 'relative' }}
    >
      {/* Background Model Image - Centered */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-full w-full"
        >
          {config.homepage.hero.backgroundImage && (
            <img
              src={config.homepage.hero.backgroundImage}
              alt={config.homepage.hero.heading || 'Hero image'}
              className="h-full w-full object-cover object-center"
            />
          )}
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
      <motion.div
        style={{ 
          scale: logoScale,
          y: logoY,
          x: logoX,
          opacity: logoOpacity,
          willChange: 'transform, opacity'
        }}
        className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] pointer-events-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            filter: 'drop-shadow(2px 2px 20px rgba(0,0,0,0.4)) brightness(1.8)',
          }}
        >
          <Logo />
        </motion.div>
      </motion.div>

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