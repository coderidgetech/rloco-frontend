import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  image: string;
  count: number;
  link: string;
}

const categories: Category[] = [
  {
    id: 'women',
    name: 'Women',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80',
    count: 234,
    link: '/category/women',
  },
  {
    id: 'men',
    name: 'Men',
    image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&q=80',
    count: 156,
    link: '/category/men',
  },
  {
    id: 'dresses',
    name: 'Dresses',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80',
    count: 89,
    link: '/category/women/dresses',
  },
  {
    id: 'shoes',
    name: 'Shoes',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80',
    count: 124,
    link: '/category/shoes',
  },
  {
    id: 'bags',
    name: 'Bags',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80',
    count: 67,
    link: '/category/accessories',
  },
  {
    id: 'jewelry',
    name: 'Jewelry',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80',
    count: 98,
    link: '/category/jewelry',
  },
];

export function CategoryGrid() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white py-6">
      {/* Section Header */}
      <div className="px-4 mb-4">
        <h2 className="text-xl font-medium tracking-wide">Shop by Category</h2>
        <p className="text-sm text-foreground/60 mt-1">
          Explore our collections
        </p>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-2 gap-3 px-4">
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(category.link)}
            className="relative aspect-square rounded-2xl overflow-hidden active:opacity-90 transition-opacity"
          >
            {/* Background Image */}
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <h3 className="text-white text-lg font-medium tracking-wide mb-1">
                {category.name}
              </h3>
              <p className="text-white/80 text-xs">
                {category.count} items
              </p>
            </div>

            {/* Shine Effect on Tap */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-active:translate-x-full transition-transform duration-1000" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
