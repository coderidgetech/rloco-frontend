import { motion } from 'motion/react';
import { easing } from '../utils/luxuryAnimations';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  variant?: 'char' | 'word' | 'line';
  gradient?: boolean;
}

export function AnimatedText({ 
  text, 
  className = '',
  delay = 0,
  stagger = 0.03,
  duration = 0.6,
  variant = 'char',
  gradient = false,
}: AnimatedTextProps) {
  const splitText = () => {
    if (variant === 'char') {
      return text.split('');
    } else if (variant === 'word') {
      return text.split(' ');
    }
    return [text];
  };

  const elements = splitText();

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const child = {
    hidden: { 
      opacity: 0, 
      y: 20,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration,
        ease: easing.luxury,
      },
    },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={`inline-flex flex-wrap ${gradient ? 'bg-gradient-to-r from-foreground via-[#B4770E] to-foreground bg-clip-text text-transparent' : ''} ${className}`}
    >
      {elements.map((element, index) => (
        <motion.span
          key={index}
          variants={child}
          className="inline-block"
          style={{ 
            transformOrigin: 'bottom center',
            marginRight: variant === 'word' && index < elements.length - 1 ? '0.25em' : undefined,
          }}
        >
          {element === ' ' ? '\u00A0' : element}
        </motion.span>
      ))}
    </motion.div>
  );
}

interface AnimatedHeadingProps {
  children: string;
  className?: string;
  delay?: number;
  gradient?: boolean;
}

export function AnimatedHeading({ children, className = '', delay = 0, gradient = false }: AnimatedHeadingProps) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: easing.luxury,
      }}
      className={`${gradient ? 'bg-gradient-to-r from-foreground via-[#B4770E] to-foreground bg-clip-text text-transparent' : ''} ${className}`}
    >
      {children}
    </motion.h1>
  );
}
