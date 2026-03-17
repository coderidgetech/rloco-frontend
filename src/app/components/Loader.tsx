import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RlocoLogo } from './RlocoLogo';

export function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 20);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
          }}
          transition={{ 
            duration: 0.6,
            scale: {
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 1.5,
              ease: 'easeInOut',
            }
          }}
          className="mb-12 mx-auto flex justify-center"
        >
          {/* Dual-color Rloco logo */}
          <RlocoLogo size="3xl" />
        </motion.div>
        
        <div className="w-64 h-0.5 bg-border mx-auto overflow-hidden rounded-full">
          <motion.div
            className="h-full bg-gradient-to-r from-[#724B09] to-[#F1B041]"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>
    </motion.div>
  );
}