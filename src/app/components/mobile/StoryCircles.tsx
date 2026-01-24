import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

interface Story {
  id: string;
  title: string;
  image: string;
  category?: string;
  isNew?: boolean;
}

const stories: Story[] = [
  {
    id: 'new',
    title: 'New',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200&q=80',
    isNew: true,
  },
  {
    id: 'dresses',
    title: 'Dresses',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200&q=80',
    category: 'Dresses',
  },
  {
    id: 'bags',
    title: 'Bags',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&q=80',
    category: 'Accessories',
  },
  {
    id: 'shoes',
    title: 'Shoes',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&q=80',
    category: 'Shoes',
  },
  {
    id: 'jewelry',
    title: 'Jewelry',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=200&q=80',
    category: 'Jewelry',
  },
  {
    id: 'sale',
    title: 'Sale',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&q=80',
  },
  {
    id: 'men',
    title: 'Men',
    image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=200&q=80',
    category: 'Men',
  },
];

export function StoryCircles() {
  const navigate = useNavigate();

  const handleStoryClick = (story: Story) => {
    if (story.id === 'new') {
      navigate('/new-arrivals');
    } else if (story.category) {
      navigate(`/category/${story.category.toLowerCase()}`);
    } else if (story.id === 'sale') {
      navigate('/sale');
    }
  };

  return (
    <div className="w-full bg-white py-3 border-b border-border/30">
      <div className="flex gap-4 px-4 overflow-x-auto scrollbar-hide">
        {stories.map((story, index) => (
          <motion.button
            key={story.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleStoryClick(story)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0"
          >
            {/* Story Circle */}
            <div className="relative">
              {/* Gradient Border */}
              <div className={`w-16 h-16 rounded-full p-[2px] ${
                story.isNew 
                  ? 'bg-gradient-to-tr from-primary via-primary/60 to-primary/40' 
                  : 'bg-gradient-to-tr from-foreground/20 to-foreground/5'
              }`}>
                <div className="w-full h-full rounded-full bg-white p-[2px]">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              
              {/* New Badge */}
              {story.isNew && (
                <div className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-white">
                  <Sparkles size={10} className="text-white fill-white" />
                </div>
              )}
            </div>

            {/* Title */}
            <span className="text-[11px] font-medium text-foreground/80 max-w-[64px] truncate">
              {story.title}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Custom scrollbar hide */}
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
