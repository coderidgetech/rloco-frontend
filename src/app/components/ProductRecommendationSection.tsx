import { motion } from 'motion/react';
import { ChevronRight, Heart, Star, Package, Award, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  priceINR?: number;
  originalPriceINR?: number;
  badge?: string;
}

interface ProductRecommendationSectionProps {
  title: string;
  subtitle: string;
  products: Product[];
  variant?: 'featured' | 'carousel' | 'minimal' | 'bold';
  icon?: 'heart' | 'star' | 'package' | 'award' | 'sparkles';
}

const iconMap = {
  heart: Heart,
  star: Star,
  package: Package,
  award: Award,
  sparkles: Sparkles,
};

export function ProductRecommendationSection({
  title,
  subtitle,
  products,
  variant = 'featured',
  icon = 'heart',
}: ProductRecommendationSectionProps) {
  const navigate = useNavigate();
  const IconComponent = iconMap[icon];
  const { formatPrice } = useCurrency();

  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative mt-12 md:mt-16 py-12 md:py-16 overflow-hidden bg-[#faf9f6] border-y-2 border-foreground/10"
      >
        {/* Enhanced Sophisticated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(180,119,14,0.08),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(0,0,0,0.01)_50%,transparent_52%)] bg-[length:60px_60px]" />
        
        <div className="relative w-full">
          <div className="flex items-center justify-between mb-8 md:mb-12 px-4 md:px-6">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-1.5 h-12 md:h-16 bg-gradient-to-b from-primary to-primary/50" />
                <h2 className="text-3xl md:text-5xl tracking-tight font-medium">{title}</h2>
                <div className="w-12 h-12 md:w-14 md:h-14 border-2 border-primary/30 flex items-center justify-center bg-white/80">
                  <IconComponent size={24} className="text-primary" />
                </div>
              </div>
              <p className="text-sm md:text-base text-foreground/60 tracking-wide ml-10 uppercase">{subtitle}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6 px-4 md:px-6">
            {products.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/product/${item.id}`)}
                className="cursor-pointer group bg-white border-2 border-transparent hover:border-primary transition-all duration-300 shadow-sm hover:shadow-xl"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-foreground/5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                  />
                  
                  {/* Badge */}
                  {item.badge && (
                    <div
                      className={`absolute top-2 left-2 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase z-10 ${
                        item.badge === 'Best Seller' ? 'bg-[#B4770E] text-white' :
                        item.badge === 'Trending' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' :
                        item.badge === 'Most Ordered' ? 'bg-blue-600 text-white' :
                        item.badge === 'New' ? 'bg-green-600 text-white' :
                        item.badge === 'Limited Edition' ? 'bg-black text-white' :
                        item.badge === 'Exclusive' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' :
                        item.badge === 'Hot' ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' :
                        item.badge === 'Popular' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' :
                        'bg-foreground text-background'
                      }`}
                    >
                      {item.badge}
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center justify-between text-white">
                        <span className="text-xs uppercase tracking-wider font-medium">Quick View</span>
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-br from-primary to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                </div>
                <div className="px-3 pb-3">
                  <p className="text-xs uppercase tracking-widest text-foreground/50 mb-1.5">RLOCO</p>
                  <p className="text-sm tracking-wide mb-2 line-clamp-2 min-h-[40px] font-medium">{item.name}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold">{formatPrice(item.price, item.priceINR)}</span>
                    {item.originalPrice && (
                      <span className="text-xs text-foreground/40 line-through">{formatPrice(item.originalPrice, item.originalPriceINR)}</span>
                    )}
                  </div>
                </div>
              </motion.div>
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
        className="relative mt-12 md:mt-16 py-12 md:py-16 bg-foreground text-background overflow-hidden"
      >
        {/* Luxury Dark Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.05),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.02)_50%,transparent_52%)] bg-[length:60px_60px]" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-foreground/[0.015] to-transparent rounded-full blur-3xl" />
        
        <div className="relative w-full">
          <div className="text-center mb-8 md:mb-12 px-4 md:px-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 mb-4"
            >
              <IconComponent size={24} className="text-background/80" />
              <h2 className="text-3xl md:text-5xl tracking-tight">{title}</h2>
            </motion.div>
            <p className="text-background/60 tracking-wide">{subtitle}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-8 px-4 md:px-6">
            {products.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                onClick={() => navigate(`/product/${item.id}`)}
                className="cursor-pointer group"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-4 border-2 border-background/10 group-hover:border-background/40 transition-colors">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                  />
                </div>
                <div className="px-1">
                  <p className="text-sm tracking-wide mb-2 line-clamp-2 text-background">{item.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-background">{formatPrice(item.price, item.priceINR)}</span>
                    {item.originalPrice && (
                      <span className="text-xs text-background/50 line-through">{formatPrice(item.originalPrice, item.originalPriceINR)}</span>
                    )}
                  </div>
                </div>
              </motion.div>
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
        className="relative mt-12 md:mt-16 border-t border-foreground/5 pt-12 md:pt-14 overflow-hidden"
      >
        {/* Minimalist Elegant Background */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-foreground/[0.015] rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-foreground/[0.02] rounded-full blur-3xl" />
        
        <div className="relative w-full">
          <div className="mb-10 md:mb-12 px-4 md:px-6">
            <div className="flex items-center gap-4 mb-3">
              <IconComponent size={20} className="text-foreground/60" />
              <h2 className="text-xl md:text-3xl tracking-tight">{title}</h2>
            </div>
            <p className="text-sm text-foreground/50 tracking-wide">{subtitle}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-10 px-4 md:px-6">
            {products.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -6 }}
                onClick={() => navigate(`/product/${item.id}`)}
                className="cursor-pointer group"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-3 md:mb-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                  />
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 bg-white/90 backdrop-blur-sm flex items-center justify-center">
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs tracking-wider uppercase text-foreground/40 mb-1">RLOCO</p>
                  <p className="text-sm tracking-wide mb-2 line-clamp-1">{item.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{formatPrice(item.price, item.priceINR)}</span>
                    {item.originalPrice && (
                      <span className="text-xs text-foreground/30 line-through">{formatPrice(item.originalPrice, item.originalPriceINR)}</span>
                    )}
                  </div>
                </div>
              </motion.div>
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
      className="relative mt-12 md:mt-16 border-y border-foreground/10 py-12 md:py-14 overflow-hidden"
    >
      {/* Artistic Striped Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/[0.015] to-foreground/[0.005]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,foreground/0.01_50%,transparent_100%)] bg-[length:200px_100%]" />
      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-foreground/[0.02] to-transparent" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-foreground/[0.015] to-transparent rounded-full blur-3xl" />
      
      <div className="relative w-full">
        <div className="flex items-end justify-between mb-8 md:mb-12">
          <div>
            <h2 className="text-2xl md:text-4xl tracking-tight mb-2">{title}</h2>
            <p className="text-sm text-foreground/50 tracking-wide">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 border border-foreground/10 flex items-center justify-center">
              <IconComponent size={18} className="text-foreground/40" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 px-2 md:px-4">
          {products.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.07 }}
              onClick={() => navigate(`/product/${item.id}`)}
              className="cursor-pointer group"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-3 md:mb-4 border border-foreground/10 group-hover:border-foreground/30 transition-colors">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                />
              </div>
              <div className="px-1">
                <p className="text-sm tracking-wide mb-2 line-clamp-2 min-h-[40px] group-hover:text-foreground/70 transition-colors">{item.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{formatPrice(item.price, item.priceINR)}</span>
                  {item.originalPrice && (
                    <span className="text-xs text-foreground/30 line-through">{formatPrice(item.originalPrice, item.originalPriceINR)}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}