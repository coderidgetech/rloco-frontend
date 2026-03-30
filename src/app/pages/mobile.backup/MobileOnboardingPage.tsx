import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Sparkles, ShoppingBag, Lock, Truck } from 'lucide-react';

interface OnboardingSlide {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  image: string;
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    icon: <Sparkles size={40} />,
    title: 'Discover Luxury Fashion',
    description: 'Explore curated collections of premium clothing, accessories, and jewelry from top designers',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
  },
  {
    id: 2,
    icon: <ShoppingBag size={40} />,
    title: 'Personalized Shopping',
    description: 'Get tailored recommendations, exclusive deals, and early access to new arrivals just for you',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
  },
  {
    id: 3,
    icon: <Lock size={40} />,
    title: 'Secure & Easy Checkout',
    description: 'Shop with confidence using secure payments, multiple payment options, and buyer protection',
    image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&q=80',
  },
  {
    id: 4,
    icon: <Truck size={40} />,
    title: 'Fast & Free Delivery',
    description: 'Enjoy complimentary shipping on orders over $100 and easy returns within 30 days',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea1f1d6c?w=800&q=80',
  },
];

export function MobileOnboardingPage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(currentSlide + 1);
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    sessionStorage.setItem('completedOnboarding', 'true');
    navigate('/', { replace: true });
  };

  const handleGetStarted = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    sessionStorage.setItem('completedOnboarding', 'true');
    navigate('/', { replace: true });
  };

  const handleDotClick = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold && currentSlide > 0) {
      // Swipe right - go to previous slide
      setDirection(-1);
      setCurrentSlide(currentSlide - 1);
    } else if (info.offset.x < -threshold && currentSlide < slides.length - 1) {
      // Swipe left - go to next slide
      setDirection(1);
      setCurrentSlide(currentSlide + 1);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col overflow-hidden" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      {/* Skip Button */}
      {currentSlide < slides.length - 1 && (
        <div className="flex-shrink-0 px-6 pt-4 flex justify-end relative z-10">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSkip}
            type="button"
            className="text-sm text-foreground/60 font-medium cursor-pointer px-4 py-2"
          >
            Skip
          </motion.button>
        </div>
      )}

      {/* Slides Container */}
      <div className="flex-1 relative overflow-hidden touch-pan-y">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            {/* Image */}
            <div className="w-full max-w-sm aspect-square rounded-3xl overflow-hidden mb-8 relative">
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6"
            >
              {slides[currentSlide].icon}
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-semibold mb-4 text-center"
            >
              {slides[currentSlide].title}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center text-foreground/60 max-w-sm leading-relaxed"
            >
              {slides[currentSlide].description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Section */}
      <div className="flex-shrink-0 px-6 pb-8 relative z-10" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 2rem)' }}>
        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className="group cursor-pointer p-2"
              type="button"
              aria-label={`Go to slide ${index + 1}`}
            >
              <motion.div
                initial={false}
                animate={{
                  width: currentSlide === index ? 32 : 8,
                  backgroundColor: currentSlide === index ? '#B4770E' : '#E5E5E5',
                }}
                transition={{ duration: 0.3 }}
                className="h-2 rounded-full pointer-events-none"
              />
            </button>
          ))}
        </div>

        {/* Next/Get Started Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          type="button"
          className="w-full bg-primary text-white py-4 rounded-full font-medium flex items-center justify-center gap-2 cursor-pointer"
        >
          {currentSlide < slides.length - 1 ? (
            <>
              Next
              <ChevronRight size={20} />
            </>
          ) : (
            'Get Started'
          )}
        </motion.button>

        {/* Sign In Link - Only on last slide */}
        {currentSlide === slides.length - 1 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mt-4 text-sm text-foreground/60"
          >
            Already have an account?{' '}
            <button
              onClick={() => {
                localStorage.setItem('hasSeenOnboarding', 'true');
                navigate('/login', { replace: true });
              }}
              type="button"
              className="text-primary font-medium cursor-pointer"
            >
              Sign In
            </button>
          </motion.p>
        )}
      </div>
    </div>
  );
}