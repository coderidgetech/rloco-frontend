import { motion } from 'motion/react';

export function MobileCategorySkeleton() {
  return (
    <div className="relative h-40 bg-foreground/5 rounded-2xl overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
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
  );
}

export function MobileCategoryGridSkeleton() {
  return (
    <div className="px-4 py-6 space-y-6">
      {/* Section Title Skeleton */}
      <div className="space-y-2">
        <div className="h-8 bg-foreground/5 rounded w-48">
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
        <div className="h-4 bg-foreground/5 rounded w-24">
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
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <MobileCategorySkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
