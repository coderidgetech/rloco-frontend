import { Variants } from 'motion/react';

// ============================================
// LUXURY EASING CURVES
// ============================================

export const easing = {
  // Smooth luxury easing for elegant animations
  luxury: [0.19, 1.0, 0.22, 1.0] as const,
  
  // Premium smooth easing
  premium: [0.22, 1, 0.36, 1] as const,
  
  // Elastic bounce for playful luxury
  elastic: [0.68, -0.55, 0.265, 1.55] as const,
  
  // Sharp professional easing
  sharp: [0.4, 0, 0.2, 1] as const,
  
  // Smooth acceleration
  accelerate: [0.4, 0, 1, 1] as const,
  
  // Smooth deceleration
  decelerate: [0, 0, 0.2, 1] as const,
  
  // Material design standard
  standard: [0.4, 0, 0.2, 1] as const,
};

// ============================================
// SPRING CONFIGURATIONS
// ============================================

export const springs = {
  // Gentle luxury spring
  gentle: {
    type: 'spring' as const,
    stiffness: 100,
    damping: 15,
    mass: 1,
  },
  
  // Bouncy playful spring
  bouncy: {
    type: 'spring' as const,
    stiffness: 300,
    damping: 20,
    mass: 1,
  },
  
  // Smooth professional spring
  smooth: {
    type: 'spring' as const,
    stiffness: 150,
    damping: 25,
    mass: 1,
  },
  
  // Snappy responsive spring
  snappy: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 30,
    mass: 0.8,
  },
  
  // Soft elastic spring
  soft: {
    type: 'spring' as const,
    stiffness: 80,
    damping: 12,
    mass: 1.2,
  },
};

// ============================================
// PAGE TRANSITION VARIANTS
// ============================================

export const pageTransitions: Record<string, Variants> = {
  // Fade transition
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  // Slide from bottom (luxury reveal)
  slideUp: {
    initial: { opacity: 0, y: 100 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: easing.luxury },
    },
    exit: { 
      opacity: 0, 
      y: -50,
      transition: { duration: 0.5, ease: easing.premium },
    },
  },
  
  // Scale fade (zoom effect)
  scaleFade: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: easing.luxury },
    },
    exit: { 
      opacity: 0, 
      scale: 1.05,
      transition: { duration: 0.4, ease: easing.premium },
    },
  },
  
  // Curtain reveal (professional)
  curtain: {
    initial: { scaleY: 0, transformOrigin: 'top' },
    animate: { 
      scaleY: 1,
      transition: { duration: 0.8, ease: easing.luxury },
    },
    exit: { 
      scaleY: 0,
      transformOrigin: 'bottom',
      transition: { duration: 0.6, ease: easing.premium },
    },
  },
};

// ============================================
// SCROLL ANIMATION VARIANTS
// ============================================

export const scrollAnimations: Record<string, Variants> = {
  // Fade in from bottom
  fadeInUp: {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: easing.luxury },
    },
  },
  
  // Fade in from left
  fadeInLeft: {
    hidden: { opacity: 0, x: -60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: easing.luxury },
    },
  },
  
  // Fade in from right
  fadeInRight: {
    hidden: { opacity: 0, x: 60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8, ease: easing.luxury },
    },
  },
  
  // Scale fade in
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: easing.luxury },
    },
  },
  
  // Zoom in with rotation
  zoomRotate: {
    hidden: { opacity: 0, scale: 0.5, rotate: -10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      transition: { duration: 0.8, ease: easing.luxury },
    },
  },
};

// ============================================
// STAGGER CONFIGURATIONS
// ============================================

export const staggerConfig = {
  // Gentle sequential stagger
  gentle: {
    staggerChildren: 0.1,
    delayChildren: 0.2,
  },
  
  // Quick responsive stagger
  quick: {
    staggerChildren: 0.05,
    delayChildren: 0.1,
  },
  
  // Slow luxury stagger
  slow: {
    staggerChildren: 0.15,
    delayChildren: 0.3,
  },
  
  // No delay stagger
  immediate: {
    staggerChildren: 0.08,
    delayChildren: 0,
  },
};

// ============================================
// HOVER EFFECTS
// ============================================

export const hoverEffects = {
  // Lift with shadow
  lift: {
    scale: 1.05,
    y: -8,
    transition: { duration: 0.3, ease: easing.premium },
  },
  
  // Subtle lift
  subtleLift: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.3, ease: easing.premium },
  },
  
  // Scale only
  scale: {
    scale: 1.05,
    transition: { duration: 0.3, ease: easing.premium },
  },
  
  // Shimmer effect (for overlays)
  shimmer: {
    backgroundPosition: '200% center',
    transition: { duration: 1.5, ease: 'linear', repeat: Infinity },
  },
  
  // Glow effect
  glow: {
    boxShadow: '0 0 20px rgba(180, 119, 14, 0.4)',
    transition: { duration: 0.3 },
  },
  
  // 3D tilt effect
  tilt3D: {
    rotateY: 5,
    rotateX: -5,
    scale: 1.05,
    transition: { duration: 0.4, ease: easing.premium },
  },
};

// ============================================
// BUTTON ANIMATIONS
// ============================================

export const buttonAnimations = {
  // Tap animation
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },
  
  // Hover with slight scale
  hover: {
    scale: 1.05,
    transition: { duration: 0.2, ease: easing.premium },
  },
  
  // Pulse effect
  pulse: {
    scale: [1, 1.05, 1],
    transition: { 
      duration: 2, 
      repeat: Infinity,
      ease: easing.luxury,
    },
  },
  
  // Shimmer sweep
  shimmerSweep: {
    backgroundPosition: ['0% center', '200% center'],
    transition: { 
      duration: 2,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

// ============================================
// IMAGE REVEAL ANIMATIONS
// ============================================

export const imageAnimations = {
  // Zoom on hover
  zoomHover: {
    scale: 1.15,
    rotate: 2,
    transition: { duration: 1.2, ease: easing.premium },
  },
  
  // Parallax effect
  parallax: (offset: number) => ({
    y: offset * 0.5,
    transition: { duration: 0 },
  }),
  
  // Ken Burns effect
  kenBurns: {
    scale: [1, 1.1],
    transition: { 
      duration: 10,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'reverse' as const,
    },
  },
};

// ============================================
// TEXT ANIMATIONS
// ============================================

export const textAnimations: Record<string, Variants> = {
  // Character stagger
  charStagger: {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.03,
        duration: 0.3,
        ease: easing.luxury,
      },
    }),
  },
  
  // Word fade in
  wordFadeIn: {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: easing.luxury,
      },
    }),
  },
  
  // Gradient text shine
  gradientShine: {
    backgroundPosition: ['0% center', '200% center'],
    transition: { 
      duration: 3,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

// ============================================
// FLOATING ANIMATIONS
// ============================================

export const floatingAnimations = {
  // Gentle float
  gentle: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  
  // Horizontal drift
  drift: {
    x: [-20, 20, -20],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  
  // Circular motion
  circular: {
    x: [0, 15, 0, -15, 0],
    y: [0, -15, 0, 15, 0],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
  
  // Pulse scale
  pulseScale: {
    scale: [1, 1.1, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ============================================
// LOADING ANIMATIONS
// ============================================

export const loadingAnimations = {
  // Spinner rotation
  spinner: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
  
  // Pulse
  pulse: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: easing.luxury,
    },
  },
  
  // Shimmer wave
  shimmer: {
    x: ['-100%', '100%'],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    },
  },
  
  // Dots sequence
  dotSequence: (i: number) => ({
    y: [0, -20, 0],
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      repeat: Infinity,
      ease: easing.luxury,
    },
  }),
};

// ============================================
// MODAL ANIMATIONS
// ============================================

export const modalAnimations: Record<string, Variants> = {
  // Scale fade
  scaleFade: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3, ease: easing.premium },
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.2, ease: easing.sharp },
    },
  },
  
  // Slide from bottom
  slideUp: {
    hidden: { opacity: 0, y: 100 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: easing.premium },
    },
    exit: { 
      opacity: 0, 
      y: 50,
      transition: { duration: 0.3, ease: easing.sharp },
    },
  },
  
  // Backdrop
  backdrop: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.2 },
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 },
    },
  },
};

// ============================================
// CARD ANIMATIONS
// ============================================

export const cardAnimations = {
  // Magnetic attraction effect
  magnetic: (x: number, y: number) => ({
    x: x * 0.3,
    y: y * 0.3,
    transition: { duration: 0.3, ease: easing.premium },
  }),
  
  // 3D tilt based on mouse position
  tilt3D: (rotateX: number, rotateY: number) => ({
    rotateX,
    rotateY,
    transformPerspective: 1000,
    transition: { duration: 0.3, ease: easing.premium },
  }),
  
  // Hover lift with shadow
  liftHover: {
    y: -12,
    scale: 1.03,
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    transition: { duration: 0.4, ease: easing.premium },
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Create a staggered container variant
 */
export function createStaggerContainer(config = staggerConfig.gentle): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: config,
    },
  };
}

/**
 * Create a parallax effect based on scroll position
 */
export function createParallaxEffect(scrollY: number, speed = 0.5) {
  return {
    y: scrollY * speed,
  };
}

/**
 * Create a 3D tilt effect based on mouse position
 */
export function calculate3DTilt(
  mouseX: number, 
  mouseY: number, 
  rect: DOMRect,
  intensity = 15
) {
  const x = mouseX - rect.left;
  const y = mouseY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const rotateX = ((y - centerY) / centerY) * intensity;
  const rotateY = ((x - centerX) / centerX) * intensity;
  
  return {
    rotateX: -rotateX,
    rotateY: rotateY,
  };
}

/**
 * Create magnetic effect based on mouse position
 */
export function calculateMagneticEffect(
  mouseX: number,
  mouseY: number,
  rect: DOMRect,
  strength = 0.3
) {
  const x = mouseX - rect.left;
  const y = mouseY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const deltaX = (x - centerX) * strength;
  const deltaY = (y - centerY) * strength;
  
  return { x: deltaX, y: deltaY };
}
