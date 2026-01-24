import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { BottomNavigation } from '@/app/components/mobile/BottomNavigation';

const CATEGORIES = [
  {
    id: 'women',
    name: 'Women',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
    subcategories: ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Shoes', 'Bags', 'Jewelry'],
    link: '/category/women',
  },
  {
    id: 'men',
    name: 'Men',
    image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&q=80',
    subcategories: ['Shirts', 'Pants', 'Outerwear', 'Shoes', 'Accessories'],
    link: '/category/men',
  },
  {
    id: 'new',
    name: 'New Arrivals',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
    subcategories: ['This Week', 'This Month', 'Coming Soon'],
    link: '/new-arrivals',
  },
  {
    id: 'sale',
    name: 'Sale',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80',
    subcategories: ['Up to 30%', 'Up to 50%', 'Up to 70%', 'Final Sale'],
    link: '/sale',
  },
  {
    id: 'dresses',
    name: 'Dresses',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
    subcategories: ['Casual', 'Evening', 'Cocktail', 'Maxi', 'Mini'],
    link: '/category/women/dresses',
  },
  {
    id: 'shoes',
    name: 'Shoes',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
    subcategories: ['Sneakers', 'Heels', 'Boots', 'Sandals', 'Flats'],
    link: '/category/shoes',
  },
  {
    id: 'bags',
    name: 'Bags & Accessories',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80',
    subcategories: ['Handbags', 'Backpacks', 'Clutches', 'Wallets', 'Belts'],
    link: '/category/accessories',
  },
  {
    id: 'jewelry',
    name: 'Jewelry',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
    subcategories: ['Necklaces', 'Earrings', 'Bracelets', 'Rings', 'Watches'],
    link: '/category/jewelry',
  },
];

export function MobileCategoriesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border/20">
        <div className="flex items-center justify-center h-14" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <h1 className="text-lg font-medium">Categories</h1>
        </div>
      </div>

      {/* Categories List */}
      <div className="pt-14">
        {CATEGORIES.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {/* Main Category */}
            <button
              onClick={() => navigate(category.link)}
              className="w-full"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-medium text-white tracking-wide">
                      {category.name}
                    </h2>
                    <ChevronRight size={24} className="text-white" />
                  </div>
                </div>
              </div>
            </button>

            {/* Subcategories */}
            <div className="px-4 py-3 bg-foreground/5 border-b border-border/20">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                {category.subcategories.map((sub, subIndex) => (
                  <button
                    key={subIndex}
                    onClick={() => navigate(category.link)}
                    className="flex-shrink-0 px-4 py-2 bg-white rounded-full text-xs font-medium border border-border/30"
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Promo Banner */}
      <div className="p-4 m-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl text-center">
        <h3 className="text-lg font-medium mb-2">Can't find what you're looking for?</h3>
        <p className="text-sm text-foreground/60 mb-4">
          Try our search to discover more products
        </p>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/search')}
          className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-medium"
        >
          Search Products
        </motion.button>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
