import { motion } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { ReactNode, useEffect, useState } from 'react';

interface RouteTransitionProps {
  children: ReactNode;
}

// Luxury easing for smooth transitions
const luxuryEasing = [0.19, 1.0, 0.22, 1.0];

export function RouteTransition({ children }: RouteTransitionProps) {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (location !== displayLocation) {
      setIsTransitioning(true);
    }
  }, [location, displayLocation]);

  return (
    <div className="relative">
      {/* Curtain overlay during transition */}
      {isTransitioning && (
        <>
          {/* Top curtain */}
          <motion.div
            initial={{ scaleY: 0, transformOrigin: 'top' }}
            animate={{ scaleY: 0.5, transformOrigin: 'top' }}
            exit={{ scaleY: 0, transformOrigin: 'top' }}
            transition={{ duration: 0.5, ease: luxuryEasing }}
            className="fixed inset-x-0 top-0 h-screen bg-background z-[9999] pointer-events-none"
          />
          
          {/* Bottom curtain */}
          <motion.div
            initial={{ scaleY: 0, transformOrigin: 'bottom' }}
            animate={{ scaleY: 0.5, transformOrigin: 'bottom' }}
            exit={{ scaleY: 0, transformOrigin: 'bottom' }}
            transition={{ duration: 0.5, ease: luxuryEasing }}
            className="fixed inset-x-0 bottom-0 h-screen bg-background z-[9999] pointer-events-none"
          />

          {/* Center golden line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: luxuryEasing }}
            className="fixed top-1/2 left-0 right-0 h-0.5 bg-primary z-[10000] pointer-events-none"
          />
        </>
      )}

      {/* Page content with fade and blur */}
      <motion.div
        key={location.pathname}
        initial={{ 
          opacity: 0, 
          y: 20,
          filter: 'blur(10px)',
          scale: 0.98,
        }}
        animate={{ 
          opacity: 1, 
          y: 0,
          filter: 'blur(0px)',
          scale: 1,
        }}
        exit={{ 
          opacity: 0, 
          y: -20,
          filter: 'blur(10px)',
          scale: 1.02,
        }}
        transition={{
          duration: 0.6,
          ease: luxuryEasing,
        }}
        onAnimationStart={() => setIsTransitioning(true)}
        onAnimationComplete={() => {
          setIsTransitioning(false);
          setDisplayLocation(location);
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Alternative simpler fade transition
export function SimpleFadeTransition({ children }: RouteTransitionProps) {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.4,
        ease: luxuryEasing,
      }}
    >
      {children}
    </motion.div>
  );
}

// Slide transition for drawer-like pages
export function SlideTransition({ children }: RouteTransitionProps) {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-100%', opacity: 0 }}
      transition={{
        duration: 0.5,
        ease: luxuryEasing,
      }}
    >
      {children}
    </motion.div>
  );
}

// Scale transition with blur
export function ScaleTransition({ children }: RouteTransitionProps) {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ 
        scale: 0.9, 
        opacity: 0,
        filter: 'blur(20px)',
      }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        filter: 'blur(0px)',
      }}
      exit={{ 
        scale: 1.1, 
        opacity: 0,
        filter: 'blur(20px)',
      }}
      transition={{
        duration: 0.7,
        ease: luxuryEasing,
      }}
    >
      {children}
    </motion.div>
  );
}
