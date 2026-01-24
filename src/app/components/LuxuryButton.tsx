import { motion, HTMLMotionProps } from 'motion/react';
import { ReactNode } from 'react';
import { easing } from '../utils/luxuryAnimations';

interface LuxuryButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'brand';
  size?: 'sm' | 'md' | 'lg';
  shimmer?: boolean;
}

export function LuxuryButton({ 
  children, 
  variant = 'primary', 
  size = 'md',
  shimmer = true,
  className = '',
  ...props 
}: LuxuryButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  const variantClasses = {
    primary: 'bg-foreground text-background hover:bg-foreground/90',
    secondary: 'bg-muted text-foreground hover:bg-muted/80',
    outline: 'border-2 border-foreground text-foreground hover:bg-foreground hover:text-background',
    brand: 'bg-[#B4770E] text-white hover:bg-[#9A6308]',
  };

  return (
    <motion.button
      whileHover={{ 
        scale: 1.05,
        y: -2,
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.3, ease: easing.premium }}
      className={`relative overflow-hidden uppercase tracking-wider font-medium transition-all duration-500 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {/* Shimmer effect */}
      {shimmer && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      )}
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
