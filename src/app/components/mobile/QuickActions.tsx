import { motion } from 'motion/react';
import { Filter, SlidersHorizontal, ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';

interface QuickActionsProps {
  onFilterClick?: () => void;
  onSortClick?: () => void;
}

export function QuickActions({ onFilterClick, onSortClick }: QuickActionsProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Filter & Sort Actions */}
      <div className="fixed bottom-20 left-4 right-4 z-30 flex items-center gap-3">
        {/* Filter Button */}
        {onFilterClick && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onFilterClick}
            className="flex-1 bg-white text-foreground shadow-lg rounded-full py-3 px-4 flex items-center justify-center gap-2 font-medium text-sm border border-foreground/10 active:bg-foreground/5"
          >
            <Filter size={18} />
            <span>Filter</span>
          </motion.button>
        )}

        {/* Sort Button */}
        {onSortClick && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSortClick}
            className="flex-1 bg-white text-foreground shadow-lg rounded-full py-3 px-4 flex items-center justify-center gap-2 font-medium text-sm border border-foreground/10 active:bg-foreground/5"
          >
            <SlidersHorizontal size={18} />
            <span>Sort</span>
          </motion.button>
        )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 z-40 w-12 h-12 bg-primary text-white shadow-lg rounded-full flex items-center justify-center active:bg-primary/90"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </>
  );
}
