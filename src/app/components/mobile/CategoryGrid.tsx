import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  image: string;
  link: string;
}

// Only Women + Men for now. With two categories a pair of large editorial
// tiles reads better than the multi-tile grid.
const categories: Category[] = [
  {
    id: 'women',
    name: 'Women',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
    link: '/category/women',
  },
  {
    id: 'men',
    name: 'Men',
    image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&q=80',
    link: '/category/men',
  },
];

export function CategoryGrid() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white py-6">
      <div className="px-4 mb-4">
        <h2 className="text-xl font-medium tracking-wide">Shop by Category</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4">
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.35 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(category.link)}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden active:opacity-90 transition-opacity"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <h3 className="text-white text-2xl font-light uppercase tracking-[0.08em]">
                {category.name}
              </h3>
              <span className="mt-1 text-white/85 text-xs uppercase tracking-[0.15em]">
                Shop now
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
