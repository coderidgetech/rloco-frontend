import { motion, useInView } from 'motion/react';
import { useRef, ReactNode } from 'react';

interface AnimatedStaggerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  once?: boolean;
}

export function AnimatedStagger({
  children,
  className = '',
  staggerDelay = 0.1,
  once = true,
}: AnimatedStaggerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedStaggerItemProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedStaggerItem({
  children,
  className = '',
  delay = 0,
}: AnimatedStaggerItemProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.5,
            delay,
            ease: [0.25, 0.1, 0.25, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
