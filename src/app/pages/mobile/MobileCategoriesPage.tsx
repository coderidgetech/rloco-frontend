import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Sparkles, ArrowRight } from 'lucide-react';
import { MobileSubPageHeader } from '@/app/components/mobile/MobileSubPageHeader';
import { useState } from 'react';

const CATEGORIES = [
  {
    id: 'women',
    name: 'Women',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
    description: 'Explore the latest trends in women\'s fashion',
    itemCount: '2,450+ Items',
    subcategories: [
      { name: 'Dresses', count: '450+', link: '/category/women/dresses' },
      { name: 'Tops & Blouses', count: '380+', link: '/category/women/tops' },
      { name: 'Bottoms', count: '320+', link: '/category/women/bottoms' },
      { name: 'Outerwear & Jackets', count: '280+', link: '/category/women/outerwear' },
      { name: 'Activewear', count: '240+', link: '/category/women/activewear' },
      { name: 'Lingerie & Sleepwear', count: '190+', link: '/category/women/lingerie' },
      { name: 'Shoes', count: '520+', link: '/category/women/shoes' },
      { name: 'Bags & Handbags', count: '340+', link: '/category/women/bags' },
      { name: 'Jewelry', count: '230+', link: '/category/women/jewelry' },
    ],
    link: '/category/women',
  },
  {
    id: 'men',
    name: 'Men',
    image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&q=80',
    description: 'Discover sophisticated men\'s styles',
    itemCount: '1,850+ Items',
    subcategories: [
      { name: 'Shirts & T-Shirts', count: '420+', link: '/category/men/shirts' },
      { name: 'Pants & Jeans', count: '350+', link: '/category/men/pants' },
      { name: 'Suits & Blazers', count: '180+', link: '/category/men/suits' },
      { name: 'Outerwear', count: '220+', link: '/category/men/outerwear' },
      { name: 'Activewear', count: '190+', link: '/category/men/activewear' },
      { name: 'Shoes', count: '380+', link: '/category/men/shoes' },
      { name: 'Accessories', count: '110+', link: '/category/men/accessories' },
    ],
    link: '/category/men',
  },
  {
    id: 'new',
    name: 'New Arrivals',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
    description: 'Fresh styles just landed',
    itemCount: '580+ Items',
    badge: 'New',
    subcategories: [
      { name: 'This Week', count: '120+', link: '/new-arrivals/week', badge: 'Hot' },
      { name: 'This Month', count: '280+', link: '/new-arrivals/month' },
      { name: 'Women\'s New', count: '340+', link: '/new-arrivals/women' },
      { name: 'Men\'s New', count: '240+', link: '/new-arrivals/men' },
      { name: 'Coming Soon', count: '95+', link: '/new-arrivals/soon', badge: 'Soon' },
    ],
    link: '/new-arrivals',
  },
  {
    id: 'sale',
    name: 'Sale',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
    description: 'Amazing deals up to 70% off',
    itemCount: '920+ Items',
    badge: 'Up to 70% Off',
    subcategories: [
      { name: 'Up to 30% Off', count: '280+', link: '/sale/30', badge: '30%' },
      { name: 'Up to 50% Off', count: '340+', link: '/sale/50', badge: '50%' },
      { name: 'Up to 70% Off', count: '180+', link: '/sale/70', badge: '70%' },
      { name: 'Final Sale', count: '120+', link: '/sale/final', badge: 'Final' },
      { name: 'Women\'s Sale', count: '520+', link: '/sale/women' },
      { name: 'Men\'s Sale', count: '400+', link: '/sale/men' },
    ],
    link: '/sale',
  },
  {
    id: 'dresses',
    name: 'Dresses',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
    description: 'Perfect dresses for every occasion',
    itemCount: '680+ Items',
    subcategories: [
      { name: 'Casual Dresses', count: '180+', link: '/category/dresses/casual' },
      { name: 'Evening Dresses', count: '140+', link: '/category/dresses/evening' },
      { name: 'Cocktail Dresses', count: '120+', link: '/category/dresses/cocktail' },
      { name: 'Maxi Dresses', count: '95+', link: '/category/dresses/maxi' },
      { name: 'Mini Dresses', count: '85+', link: '/category/dresses/mini' },
      { name: 'Midi Dresses', count: '60+', link: '/category/dresses/midi' },
    ],
    link: '/category/women/dresses',
  },
  {
    id: 'shoes',
    name: 'Shoes',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
    description: 'Step into style and comfort',
    itemCount: '920+ Items',
    subcategories: [
      { name: 'Sneakers & Athletic', count: '280+', link: '/category/shoes/sneakers' },
      { name: 'Heels & Pumps', count: '190+', link: '/category/shoes/heels' },
      { name: 'Boots & Booties', count: '220+', link: '/category/shoes/boots' },
      { name: 'Sandals & Slides', count: '140+', link: '/category/shoes/sandals' },
      { name: 'Flats & Loafers', count: '90+', link: '/category/shoes/flats' },
    ],
    link: '/category/shoes',
  },
  {
    id: 'bags',
    name: 'Bags & Accessories',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80',
    description: 'Complete your look with perfect accessories',
    itemCount: '540+ Items',
    subcategories: [
      { name: 'Handbags & Totes', count: '180+', link: '/category/bags/handbags' },
      { name: 'Backpacks', count: '95+', link: '/category/bags/backpacks' },
      { name: 'Clutches & Evening Bags', count: '80+', link: '/category/bags/clutches' },
      { name: 'Wallets & Cardholders', count: '120+', link: '/category/bags/wallets' },
      { name: 'Belts', count: '65+', link: '/category/bags/belts' },
    ],
    link: '/category/accessories',
  },
  {
    id: 'jewelry',
    name: 'Jewelry',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
    description: 'Elegant pieces to elevate any outfit',
    itemCount: '450+ Items',
    subcategories: [
      { name: 'Necklaces & Pendants', count: '120+', link: '/category/jewelry/necklaces' },
      { name: 'Earrings', count: '140+', link: '/category/jewelry/earrings' },
      { name: 'Bracelets & Bangles', count: '90+', link: '/category/jewelry/bracelets' },
      { name: 'Rings', count: '75+', link: '/category/jewelry/rings' },
      { name: 'Watches', count: '25+', link: '/category/jewelry/watches' },
    ],
    link: '/category/jewelry',
  },
  {
    id: 'cosmetics',
    name: 'Cosmetics & Beauty',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
    description: 'Premium beauty and skincare essentials',
    itemCount: '620+ Items',
    subcategories: [
      { name: 'Makeup', count: '220+', link: '/category/beauty/makeup' },
      { name: 'Skincare', count: '180+', link: '/category/beauty/skincare' },
      { name: 'Fragrance', count: '95+', link: '/category/beauty/fragrance' },
      { name: 'Haircare', count: '85+', link: '/category/beauty/haircare' },
      { name: 'Beauty Tools', count: '40+', link: '/category/beauty/tools' },
    ],
    link: '/category/beauty',
  },
];

export function MobileCategoriesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Unified Header */}
      <MobileSubPageHeader showBackButton={false} />

      {/* Categories List */}
      <div className="pt-[145px] pb-6">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 mb-8"
        >
          <h1 className="text-3xl font-medium mb-2">Browse</h1>
          <p className="text-sm text-foreground/60">Discover our curated collections</p>
        </motion.div>

        {/* All Categories */}
        <div>
          {CATEGORIES.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="mb-8"
            >
              {/* Category Header with Image */}
              <div className="relative mb-5">
                <motion.button
                  whileTap={{ scale: 0.995 }}
                  onClick={() => navigate(category.link)}
                  className="w-full relative overflow-hidden group"
                >
                  {/* Full Width Image */}
                  <div className="relative h-48 w-full">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    
                    {/* Category Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 px-4 pb-5">
                      <div className="flex items-end justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-2xl font-medium text-white">
                              {category.name}
                            </h2>
                            {category.badge && (
                              <div className="bg-primary/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1">
                                <Sparkles size={11} className="text-white" />
                                <span className="text-[10px] font-medium text-white">{category.badge}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-white/90 mb-1.5">
                            {category.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-white/80">{category.itemCount}</span>
                            <span className="text-xs text-white/60">•</span>
                            <span className="text-xs text-white/60">{category.subcategories.length} types</span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-active:bg-white/30 transition-colors">
                            <ArrowRight size={16} className="text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.button>
              </div>

              {/* Subcategories List */}
              <div className="px-4">
                <div className="space-y-2">
                  {category.subcategories.map((sub, subIndex) => (
                    <motion.button
                      key={subIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.06 + subIndex * 0.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate(sub.link)}
                      className="w-full group"
                    >
                      <div className="flex items-center justify-between py-3 border-b border-border/20 group-active:border-primary/20 transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-1 h-1 rounded-full bg-primary/50" />
                          <span className="text-sm font-medium text-left group-active:text-primary transition-colors">
                            {sub.name}
                          </span>
                          {sub.badge && (
                            <span className="px-2 py-0.5 bg-primary/10 rounded-full text-[10px] font-medium text-primary">
                              {sub.badge}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-foreground/40">
                            {sub.count}
                          </span>
                          <ChevronRight size={16} className="text-foreground/30 group-active:text-primary group-active:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Divider between categories */}
              {index < CATEGORIES.length - 1 && (
                <div className="mt-8 px-4">
                  <div className="h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats & CTA Section */}
        <div className="px-4 mt-8 space-y-4">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-primary/5 to-transparent p-6 rounded-2xl border border-primary/10"
          >
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-medium text-primary mb-1">9</div>
                <div className="text-[11px] text-foreground/60 leading-tight">Main<br/>Categories</div>
              </div>
              <div className="text-center border-l border-r border-border/30">
                <div className="text-2xl font-medium text-primary mb-1">54</div>
                <div className="text-[11px] text-foreground/60 leading-tight">Sub<br/>Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-medium text-primary mb-1">8K+</div>
                <div className="text-[11px] text-foreground/60 leading-tight">Total<br/>Products</div>
              </div>
            </div>
          </motion.div>

          {/* Search CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-center py-8"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="font-medium mb-2">Looking for something specific?</h3>
            <p className="text-sm text-foreground/60 mb-5 max-w-[280px] mx-auto">
              Search our entire catalog to find exactly what you need
            </p>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/search')}
              className="bg-primary text-white px-8 py-3 rounded-full text-sm font-medium border border-border/30 shadow-sm"
            >
              Search All Products
            </motion.button>
          </motion.div>
        </div>
      </div>

    </div>
  );
}