import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

interface BackgroundDecorProps {
  variant?: 'default' | 'alternate' | 'minimal';
  showDots?: boolean;
  showLines?: boolean;
  showOrbs?: boolean;
  showGeometric?: boolean;
}

export function BackgroundDecor({ 
  variant = 'default',
  showDots = true,
  showLines = true,
  showOrbs = true,
  showGeometric = false
}: BackgroundDecorProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Orbs */}
      {showOrbs && (
        <>
          <motion.div
            style={{ y: y1 }}
            className={`absolute -left-32 top-20 w-96 h-96 rounded-full blur-3xl ${
              variant === 'alternate' ? 'bg-foreground/8' : 'bg-primary/10'
            }`}
          />
          <motion.div
            style={{ y: y2 }}
            className={`absolute -right-32 bottom-20 w-96 h-96 rounded-full blur-3xl ${
              variant === 'alternate' ? 'bg-primary/8' : 'bg-foreground/8'
            }`}
          />
        </>
      )}
      
      {/* Horizontal Decorative Lines */}
      {showLines && (
        <>
          <div className="absolute left-0 top-1/4 w-40 md:w-64 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
          <div className="absolute right-0 top-2/3 w-40 md:w-64 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
          <div className="absolute left-0 bottom-1/3 w-32 md:w-48 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent" />
          <div className="absolute right-0 top-1/3 w-32 md:w-48 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent" />
          
          {/* Vertical accent lines */}
          <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-foreground/10 to-transparent hidden lg:block" />
          <div className="absolute right-4 md:right-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-foreground/10 to-transparent hidden lg:block" />
        </>
      )}
      
      {/* Geometric Shapes */}
      {showGeometric && (
        <>
          <motion.div
            style={{ y: y1 }}
            className="absolute left-8 md:left-12 top-1/3 w-16 h-16 md:w-24 md:h-24 border border-foreground/10 rotate-45 hidden xl:block"
          />
          <motion.div
            style={{ y: y2 }}
            className="absolute right-8 md:right-12 bottom-1/3 w-20 h-20 md:w-32 md:h-32 border border-foreground/10 rounded-full hidden xl:block"
          />
          <div className="absolute left-16 bottom-1/4 w-12 h-12 border border-foreground/8 hidden 2xl:block" />
          <div className="absolute right-16 top-1/4 w-16 h-16 border border-foreground/8 rotate-12 hidden 2xl:block" />
        </>
      )}
      
      {/* Dot Patterns on Sides */}
      {showDots && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 hidden xl:block">
            <div 
              className="w-full h-full opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 hidden xl:block">
            <div 
              className="w-full h-full opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />
          </div>
        </>
      )}
      
      {/* Subtle texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}
