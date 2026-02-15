import { motion } from 'motion/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/app/components/Logo';

export function MobileSplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // Always go to home after splash
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 0.03 }}
        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/20"
      />

      {/* Logo */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10"
      >
        <Logo className="text-5xl" />
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="mt-6 text-foreground/60 text-sm tracking-wider uppercase relative z-10"
      >
        Luxury Fashion Redefined
      </motion.p>

      {/* Loading Indicator */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '120px' }}
        transition={{ delay: 1, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="h-1 bg-primary rounded-full mt-12 relative z-10"
      />

      {/* Bottom Decoration */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-12 text-xs text-foreground/40 tracking-widest"
      >
        EST. 2024
      </motion.div>
    </div>
  );
}