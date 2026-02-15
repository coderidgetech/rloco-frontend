import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { useState } from 'react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  image: string;
  verified: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Fashion Blogger',
    content: 'Rloco has completely transformed my wardrobe! The quality is exceptional and the designs are timeless. Every piece I own from them gets compliments.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    verified: true,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Entrepreneur',
    content: 'Outstanding customer service and premium quality products. The attention to detail in every garment is remarkable. Highly recommend!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    verified: true,
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Designer',
    content: 'I love how Rloco combines luxury with sustainability. Beautiful pieces that make you feel confident and stylish. A must-have brand!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    verified: true,
  },
  {
    id: 4,
    name: 'David Park',
    role: 'Creative Director',
    content: 'The perfect blend of modern design and classic elegance. Every purchase has exceeded my expectations. Rloco is my go-to for premium fashion.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    verified: true,
  },
];

export function MobileTestimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < testimonials.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className="py-6 bg-gradient-to-br from-primary/5 via-white to-primary/5">
      <div className="px-4">
        {/* Header */}
        <div className="text-center mb-4">
          <h2 className="text-2xl font-medium mb-1.5">What Our Customers Say</h2>
          <p className="text-sm text-foreground/60">
            Trusted by thousands of fashion lovers
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div className="text-center p-3 bg-white rounded-xl border border-border/20">
            <div className="text-2xl font-bold text-primary mb-1">4.9</div>
            <div className="flex items-center justify-center gap-0.5 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="text-primary fill-primary" />
              ))}
            </div>
            <p className="text-[10px] text-foreground/60 uppercase tracking-wide">
              Rating
            </p>
          </div>
          <div className="text-center p-3 bg-white rounded-xl border border-border/20">
            <div className="text-2xl font-bold text-primary mb-1">12k+</div>
            <p className="text-xs text-foreground/60 mb-1">Reviews</p>
            <p className="text-[10px] text-foreground/60 uppercase tracking-wide">
              Verified
            </p>
          </div>
          <div className="text-center p-3 bg-white rounded-xl border border-border/20">
            <div className="text-2xl font-bold text-primary mb-1">98%</div>
            <p className="text-xs text-foreground/60 mb-1">Satisfaction</p>
            <p className="text-[10px] text-foreground/60 uppercase tracking-wide">
              Rate
            </p>
          </div>
        </div>

        {/* Testimonial Card */}
        <div
          className="relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white rounded-2xl p-6 border border-border/20 shadow-lg"
          >
            {/* Quote Icon */}
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Quote size={24} className="text-primary" />
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <Star key={i} size={16} className="text-primary fill-primary" />
              ))}
            </div>

            {/* Content */}
            <p className="text-sm text-foreground/80 leading-relaxed mb-4">
              "{testimonials[currentIndex].content}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-4 border-t border-border/30">
              <img
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].name}
                className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium">
                    {testimonials[currentIndex].name}
                  </h4>
                  {testimonials[currentIndex].verified && (
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                      <svg
                        width="10"
                        height="8"
                        viewBox="0 0 10 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-xs text-foreground/60">
                  {testimonials[currentIndex].role}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-foreground/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-border/20">
            <div className="text-2xl">✅</div>
            <div>
              <p className="text-xs font-medium">Verified Buyers</p>
              <p className="text-[10px] text-foreground/60">100% Authentic</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-border/20">
            <div className="text-2xl">🏆</div>
            <div>
              <p className="text-xs font-medium">Award Winning</p>
              <p className="text-[10px] text-foreground/60">Best Fashion 2024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}