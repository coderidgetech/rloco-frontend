import { motion } from 'motion/react';
import { Product } from '../types/product';
import { ProductCard } from './ProductCard';
import { MobileProductCard, MobileProductCardData } from './mobile/MobileProductCard';
import { useIsMobile } from '../hooks/useIsMobile';

interface ProductRecommendationSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  variant?: 'featured' | 'carousel' | 'minimal' | 'bold';
}

/** Matches the home grid card design on mobile, the fuller desktop card otherwise. */
function RecommendationCard({ product, index, isMobile }: { product: Product; index: number; isMobile: boolean }) {
  return isMobile ? (
    <MobileProductCard product={product as unknown as MobileProductCardData} index={index} />
  ) : (
    <ProductCard product={product} index={index} />
  );
}

export function ProductRecommendationSection({
  title,
  subtitle,
  products,
  variant = 'featured',
}: ProductRecommendationSectionProps) {
  const isMobile = useIsMobile();
  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative mt-6 md:mt-10 py-8 md:py-10 overflow-hidden bg-[#faf9f6] border-y-2 border-foreground/10"
      >
        {/* Enhanced Sophisticated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(180,119,14,0.08),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(0,0,0,0.01)_50%,transparent_52%)] bg-[length:60px_60px]" />

        <div className="relative w-full">
          <div className="flex items-center justify-between mb-5 md:mb-6 px-4 md:px-6">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-1.5 h-12 md:h-16 bg-gradient-to-b from-primary to-primary/50" />
                <h2 className="text-3xl md:text-5xl tracking-tight font-medium">{title}</h2>
              </div>
              <p className="text-sm md:text-base text-foreground/60 tracking-wide ml-10 uppercase">{subtitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6 px-4 md:px-6">
            {(products || []).map((item, index) => (
              <RecommendationCard key={`${item.id}-${index}`} product={item} index={index} isMobile={isMobile} />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'bold') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative mt-6 md:mt-10 py-8 md:py-10 bg-foreground text-background overflow-hidden"
      >
        {/* Luxury Dark Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.05),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.02)_50%,transparent_52%)] bg-[length:60px_60px]" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-foreground/[0.015] to-transparent rounded-full blur-3xl" />

        <div className="relative w-full">
          <div className="text-center mb-5 md:mb-6 px-4 md:px-6">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl tracking-tight mb-2"
            >
              {title}
            </motion.h2>
            <p className="text-background/60 tracking-wide">{subtitle}</p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-5 px-4 md:px-6">
            {(products || []).map((item, index) => (
              <RecommendationCard key={`${item.id}-${index}`} product={item} index={index} isMobile={isMobile} />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'minimal') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative mt-3 md:mt-4 border-t border-foreground/5 pt-4 md:pt-5 overflow-hidden"
      >
        {/* Minimalist Elegant Background */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-foreground/[0.015] rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-foreground/[0.02] rounded-full blur-3xl" />

        <div className="relative w-full">
          <div className="mb-3 md:mb-4 px-4 md:px-6">
            <h2 className="text-xl md:text-3xl tracking-tight">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-foreground/50 tracking-wide">{subtitle}</p>}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6 px-4 md:px-6">
            {(products || []).map((item, index) => (
              <RecommendationCard key={`${item.id}-${index}`} product={item} index={index} isMobile={isMobile} />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // Carousel variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative mt-6 md:mt-8 border-y border-foreground/10 py-8 md:py-10 overflow-hidden"
    >
      {/* Artistic Striped Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/[0.015] to-foreground/[0.005]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,foreground/0.01_50%,transparent_100%)] bg-[length:200px_100%]" />
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-foreground/[0.02] to-transparent" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-foreground/[0.015] to-transparent rounded-full blur-3xl" />

      <div className="relative w-full">
        <div className="mb-5 md:mb-6">
          <h2 className="text-2xl md:text-4xl tracking-tight mb-2">{title}</h2>
          <p className="text-sm text-foreground/50 tracking-wide">{subtitle}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 px-2 md:px-4">
          {(products || []).map((item, index) => (
            <RecommendationCard key={`${item.id}-${index}`} product={item} index={index} isMobile={isMobile} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
