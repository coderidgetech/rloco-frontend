import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ReactNode, useRef } from 'react';

interface LuxuryHoverCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  tiltEnabled?: boolean;
  glowEnabled?: boolean;
  scaleEnabled?: boolean;
}

// Luxury easing for smooth interactions
const luxurySpring = {
  damping: 20,
  stiffness: 300,
  mass: 0.5,
};

export function LuxuryHoverCard({
  children,
  className = '',
  intensity = 1,
  tiltEnabled = true,
  glowEnabled = true,
  scaleEnabled = true,
}: LuxuryHoverCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Motion values for mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring animations for smooth movement
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [10 * intensity, -10 * intensity]),
    luxurySpring
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-10 * intensity, 10 * intensity]),
    luxurySpring
  );

  // Handle mouse move for 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !tiltEnabled) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = e.clientX - rect.left;
    const mouseYPos = e.clientY - rect.top;
    const xPct = mouseXPos / width - 0.5;
    const yPct = mouseYPos / height - 0.5;

    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: tiltEnabled ? rotateX : 0,
        rotateY: tiltEnabled ? rotateY : 0,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{
        scale: scaleEnabled ? 1.05 : 1,
        boxShadow: glowEnabled
          ? '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(180, 119, 14, 0.2)'
          : undefined,
      }}
      transition={{
        duration: 0.4,
        ease: [0.19, 1.0, 0.22, 1.0],
      }}
      className={`relative ${className}`}
    >
      {/* Luxury shine effect */}
      {glowEnabled && (
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-lg"
          style={{
            background:
              'radial-gradient(circle at center, rgba(255,255,255,0.1), transparent 70%)',
            transform: useTransform(
              [mouseX, mouseY],
              ([x, y]) => `translate(${x * 100}px, ${y * 100}px)`
            ) as any,
          }}
        />
      )}

      {/* Content */}
      <div style={{ transform: 'translateZ(20px)' }}>{children}</div>
    </motion.div>
  );
}

interface LuxuryMagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

export function LuxuryMagneticButton({
  children,
  className = '',
  strength = 0.3,
}: LuxuryMagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, luxurySpring);
  const springY = useSpring(y, luxurySpring);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    x.set(distanceX * strength);
    y.set(distanceY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        duration: 0.4,
        ease: [0.19, 1.0, 0.22, 1.0],
      }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

interface LuxuryGlowTextProps {
  children: ReactNode;
  className?: string;
  color?: string;
}

export function LuxuryGlowText({
  children,
  className = '',
  color = 'rgba(180, 119, 14, 0.5)',
}: LuxuryGlowTextProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 1,
        ease: [0.19, 1.0, 0.22, 1.0],
      }}
      whileHover={{
        textShadow: `0 0 20px ${color}, 0 0 40px ${color}, 0 0 60px ${color}`,
        scale: 1.02,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface LuxuryFloatingElementProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  delay?: number;
}

export function LuxuryFloatingElement({
  children,
  className = '',
  duration = 3,
  delay = 0,
}: LuxuryFloatingElementProps) {
  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{
        y: [-10, 10, -10],
        rotate: [-2, 2, -2],
      }}
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

interface LuxuryPulseProps {
  children: ReactNode;
  className?: string;
  scale?: number;
  duration?: number;
}

export function LuxuryPulse({
  children,
  className = '',
  scale = 1.05,
  duration = 2,
}: LuxuryPulseProps) {
  return (
    <motion.div
      animate={{
        scale: [1, scale, 1],
        opacity: [1, 0.9, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
