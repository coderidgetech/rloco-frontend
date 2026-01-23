import { motion, useInView } from 'motion/react';
import { Star } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';

const getTestimonials = (siteName: string) => [
  {
    id: 1,
    name: 'Emma Richardson',
    role: 'Fashion Blogger',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    content: `The quality of the pieces from ${siteName} is absolutely exceptional. Every item feels luxurious and the attention to detail is remarkable.`,
    rating: 5,
  },
  {
    id: 2,
    name: 'James Mitchell',
    role: 'Creative Director',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    content: 'Finally found a brand that understands modern elegance. The fits are perfect, the materials are premium, and the designs are timeless.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Sophia Chen',
    role: 'Entrepreneur',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    content: 'Impeccable service and stunning pieces. The shopping experience is seamless, and every delivery feels like unwrapping a luxury gift.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Michael Torres',
    role: 'Architect',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    content: `${siteName} captures sophistication perfectly. The minimalist aesthetic combined with premium quality makes every piece a statement.`,
    rating: 5,
  },
  {
    id: 5,
    name: 'Isabella Martinez',
    role: 'Interior Designer',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    content: `The craftsmanship is extraordinary. Each garment is thoughtfully designed and beautifully made. ${siteName} has transformed my style.`,
    rating: 5,
  },
  {
    id: 6,
    name: 'David Kim',
    role: 'Photographer',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    content: 'From browsing to delivery, everything is world-class. The attention to customer experience matches the quality of the products.',
    rating: 5,
  },
];

// Counter Animation Component
function AnimatedCounter({ value, suffix = '', duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export function Testimonials() {
  const { config } = useSiteConfig();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Don't render if testimonials section is disabled
  if (!config.homepage.sections.testimonials) {
    return null;
  }

  const testimonials = getTestimonials(config.general.siteName);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <section className="bg-white py-20 md:py-32 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="max-w-[1920px] mx-auto px-8 md:px-12 lg:px-16 xl:px-20 relative">
        {/* Header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <div className="inline-block border-b border-[#B4770E] pb-1 mb-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#B4770E] font-semibold">
                Client Reviews
              </span>
            </div>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl mb-5 tracking-tight font-light"
          >
            What They Say
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-foreground/60 text-lg"
          >
            Trusted by fashion enthusiasts worldwide
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {getVisibleTestimonials().map((testimonial, index) => (
            <motion.div
              key={`${testimonial.id}-${currentIndex}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: index * 0.15,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="group"
            >
              <div className="bg-white border border-black/10 p-8 md:p-10 h-full flex flex-col hover:border-black/20 transition-all duration-500 hover:shadow-lg">
                {/* Stars */}
                <div className="flex gap-0.5 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.15 + i * 0.1,
                        ease: [0.34, 1.56, 0.64, 1]
                      }}
                    >
                      <Star
                        size={14}
                        className="fill-primary text-primary"
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Quote */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.15 + 0.5 }}
                  className="text-foreground/70 leading-relaxed mb-8 flex-grow"
                >
                  "{testimonial.content}"
                </motion.p>

                {/* Author */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.6 }}
                  className="flex items-center gap-4 pt-6 border-t border-black/5"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-sm mb-0.5">{testimonial.name}</div>
                    <div className="text-xs text-foreground/50 uppercase tracking-wider">{testimonial.role}</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mb-20">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`h-1 rounded-full transition-all duration-500 ${
                index === currentIndex
                  ? 'w-12 bg-[#B4770E]'
                  : 'w-1 bg-black/20 hover:bg-black/40'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Stats with Counter Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-16 md:pt-20 border-t border-black/10"
        >
          {[
            { value: 50, suffix: 'K+', label: 'Happy Customers', delay: 0 },
            { value: 4.9, suffix: '', label: 'Average Rating', delay: 0.1 },
            { value: 98, suffix: '%', label: 'Satisfaction', delay: 0.2 },
            { value: 15, suffix: 'K+', label: '5-Star Reviews', delay: 0.3 },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: stat.delay,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              whileHover={{ 
                y: -8, 
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
              className="text-center relative group cursor-default"
            >
              {/* Hover Effect Circle */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 0.1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-[#B4770E] rounded-full blur-2xl"
              />
              
              <div className="relative">
                <motion.div 
                  className="text-3xl md:text-4xl lg:text-5xl mb-2 font-light text-[#B4770E]"
                  initial={{ scale: 1 }}
                  whileInView={{ scale: [1, 1.1, 1] }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: stat.delay + 0.3,
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2} />
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: stat.delay + 0.4 }}
                  className="text-[10px] md:text-xs text-foreground/50 uppercase tracking-[0.2em]"
                >
                  {stat.label}
                </motion.div>
                
                {/* Progress bar */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 1.5, 
                    delay: stat.delay + 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  className="mt-4 h-px bg-gradient-to-r from-transparent via-[#B4770E] to-transparent origin-left"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
