import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { Logo } from './Logo';

interface LuxuryPageLoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
}

export function LuxuryPageLoader({ isLoading, onComplete }: LuxuryPageLoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onComplete?.();
            }, 300);
            return 100;
          }
          return prev + 10;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isLoading, onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] pointer-events-none"
        >
          {/* Curtain Effect - Top */}
          <motion.div
            initial={{ scaleY: 0, transformOrigin: 'top' }}
            animate={{ scaleY: 1, transformOrigin: 'top' }}
            exit={{ scaleY: 0, transformOrigin: 'bottom' }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
            className="absolute inset-0 bg-background"
          >
            {/* Golden shimmer effect */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(180, 119, 14, 0.1), transparent)',
              }}
            />

            {/* Center Logo with glow */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.2, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.19, 1.0, 0.22, 1.0] }}
                className="mb-8"
              >
                <motion.div
                  animate={{
                    filter: [
                      'drop-shadow(0 0 20px rgba(180, 119, 14, 0.3))',
                      'drop-shadow(0 0 40px rgba(180, 119, 14, 0.6))',
                      'drop-shadow(0 0 20px rgba(180, 119, 14, 0.3))',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Logo />
                </motion.div>
              </motion.div>

              {/* Loading Text */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center"
              >
                <p className="text-sm tracking-[0.3em] uppercase text-foreground/60 mb-6">
                  Loading Excellence
                </p>

                {/* Progress Bar */}
                <div className="w-64 h-0.5 bg-foreground/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary rounded-full relative"
                  >
                    {/* Shimmer on progress bar */}
                    <motion.div
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Corner decorative elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary/30" />
              <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-primary/30" />
              <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-primary/30" />
              <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-primary/30" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Simpler ripple effect component for category cards
interface RippleEffectProps {
  x: number;
  y: number;
  onComplete: () => void;
}

export function RippleEffect({ x, y, onComplete }: RippleEffectProps) {
  return (
    <motion.div
      initial={{
        scale: 0,
        opacity: 0.6,
      }}
      animate={{
        scale: 3,
        opacity: 0,
      }}
      transition={{
        duration: 0.8,
        ease: [0.19, 1.0, 0.22, 1.0],
      }}
      onAnimationComplete={onComplete}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 100,
        height: 100,
        marginLeft: -50,
        marginTop: -50,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(180, 119, 14, 0.4), transparent 70%)',
        pointerEvents: 'none',
      }}
    />
  );
}
