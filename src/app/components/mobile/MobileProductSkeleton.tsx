import { motion } from 'motion/react';

export function MobileProductSkeleton() {
  return (
    <div className="space-y-3">
      {/* Image Skeleton */}
      <div className="relative aspect-[3/4] bg-foreground/5 rounded-2xl overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Brand Skeleton */}
      <div className="h-3 bg-foreground/5 rounded w-16">
        <motion.div
          className="h-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent rounded"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Title Skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-foreground/5 rounded w-full">
          <motion.div
            className="h-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent rounded"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
              delay: 0.1,
            }}
          />
        </div>
        <div className="h-4 bg-foreground/5 rounded w-3/4">
          <motion.div
            className="h-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent rounded"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
              delay: 0.2,
            }}
          />
        </div>
      </div>

      {/* Price Skeleton */}
      <div className="h-5 bg-foreground/5 rounded w-20">
        <motion.div
          className="h-full bg-gradient-to-r from-transparent via-foreground/10 to-transparent rounded"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
            delay: 0.3,
          }}
        />
      </div>
    </div>
  );
}

export function MobileProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 px-4 py-4">
      {Array.from({ length: count }).map((_, i) => (
        <MobileProductSkeleton key={i} />
      ))}
    </div>
  );
}
