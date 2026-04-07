import { motion } from 'motion/react';
import { Search, Bell } from 'lucide-react';
import { RlocoLogo } from '../RlocoLogo';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchOverlay } from '@/app/context/SearchOverlayContext';

export function MobileHeader() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { openSearch } = useSearchOverlay();

  // Handle scroll effect
  useState(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-sm' 
          : 'bg-white/80 backdrop-blur-md'
      }`}
      style={{
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <div className="flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="flex-1"
        >
          <RlocoLogo size="sm" />
        </motion.div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => openSearch()}
            className="w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center active:bg-foreground/10 transition-colors"
            aria-label="Search"
          >
            <Search size={18} className="text-foreground/70" />
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center active:bg-foreground/10 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={18} className="text-foreground/70" />
            {/* Notification badge */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full border-2 border-white" />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
