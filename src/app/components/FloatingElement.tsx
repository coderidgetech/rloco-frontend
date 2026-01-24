import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface FloatingElementProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: 'vertical' | 'horizontal' | 'circular';
  className?: string;
}

export function FloatingElement({ 
  children, 
  delay = 0,
  duration = 6,
  distance = 20,
  direction = 'vertical',
  className = '',
}: FloatingElementProps) {
  const getAnimation = () => {
    switch (direction) {
      case 'vertical':
        return {
          y: [-distance, distance, -distance],
        };
      case 'horizontal':
        return {
          x: [-distance, distance, -distance],
        };
      case 'circular':
        return {
          x: [0, distance, 0, -distance, 0],
          y: [0, -distance, 0, distance, 0],
        };
      default:
        return { y: [-distance, distance, -distance] };
    }
  };

  return (
    <motion.div
      animate={getAnimation()}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FloatingBadge({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <FloatingElement duration={4} distance={10} direction="vertical">
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.19, 1.0, 0.22, 1.0] }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        className={`px-4 py-2 bg-white shadow-lg rounded-full backdrop-blur-md border border-border ${className}`}
      >
        {children}
      </motion.div>
    </FloatingElement>
  );
}
