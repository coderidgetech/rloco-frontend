import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import svgPaths from '../../imports/svg-cbj800iajt';

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
          className="mb-12 relative w-40 h-40 mx-auto"
        >
          {/* Pulsing ring effect */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-primary/20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          {/* Crescent Symbol with R - Larger for loader */}
          <svg 
            viewBox="0 0 318.2 359.591" 
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient 
                id="loader-crescent-gradient" 
                x1="0" 
                y1="0" 
                x2="0" 
                y2="359.64" 
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#724B09" />
                <stop offset="1" stopColor="#F1B041" />
              </linearGradient>
            </defs>
            <path 
              d={svgPaths.p1b643980} 
              fill="url(#loader-crescent-gradient)" 
            />
          </svg>
          <svg 
            viewBox="0 0 170.176 173.346" 
            className="absolute inset-0 w-[53%] h-[48%] left-[27%] top-[26%]"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient 
                id="loader-r-gradient" 
                x1="-5.93637" 
                y1="-35.448" 
                x2="-5.93637" 
                y2="187.406" 
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#724B09" />
                <stop offset="1" stopColor="#F1B041" />
              </linearGradient>
            </defs>
            <path 
              d={svgPaths.p4c56680} 
              fill="url(#loader-r-gradient)" 
            />
          </svg>
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