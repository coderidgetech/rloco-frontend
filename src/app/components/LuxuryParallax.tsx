import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, ReactNode } from 'react';

interface LuxuryParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: 'up' | 'down';
  scale?: boolean;
  opacity?: boolean;
  blur?: boolean;
}

export function LuxuryParallax({
  children,
  className = '',
  speed = 0.5,
  direction = 'up',
  scale = false,
  opacity = false,
  blur = false,
}: LuxuryParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Calculate movement based on direction
  const yRange = direction === 'up' ? [100 * speed, -100 * speed] : [-100 * speed, 100 * speed];
  const y = useTransform(scrollYProgress, [0, 1], yRange);

  // Optional scale effect
  const scaleValue = scale 
    ? useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9])
    : 1;

  // Optional opacity effect
  const opacityValue = opacity
    ? useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
    : 1;

  // Optional blur effect
  const blurValue = blur
    ? useTransform(scrollYProgress, [0, 0.5, 1], ['blur(10px)', 'blur(0px)', 'blur(10px)'])
    : 'blur(0px)';

  return (
    <motion.div
      ref={ref}
      style={{
        y,
        scale: scaleValue,
        opacity: opacityValue,
        filter: blurValue,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface LuxuryScrollRevealProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
}

export function LuxuryScrollReveal({
  children,
  className = '',
  threshold = 0.2,
}: LuxuryScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, threshold, 1 - threshold, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, threshold, 1 - threshold, 1], [0.9, 1, 1, 0.9]);
  const y = useTransform(scrollYProgress, [0, threshold, 1 - threshold, 1], [60, 0, 0, -60]);
  const blur = useTransform(
    scrollYProgress,
    [0, threshold, 1 - threshold, 1],
    ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(10px)']
  );

  return (
    <motion.div
      ref={ref}
      style={{
        opacity,
        scale,
        y,
        filter: blur,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface LuxuryZoomProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
}

export function LuxuryZoom({
  children,
  className = '',
  intensity = 0.2,
}: LuxuryZoomProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1 - intensity, 1, 1 + intensity]
  );

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5]);

  return (
    <motion.div
      ref={ref}
      style={{
        scale,
        opacity,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface LuxuryRotateProps {
  children: ReactNode;
  className?: string;
  degrees?: number;
}

export function LuxuryRotate({
  children,
  className = '',
  degrees = 5,
}: LuxuryRotateProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [-degrees, 0, degrees]);
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <motion.div
      ref={ref}
      style={{
        rotate,
        y,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
