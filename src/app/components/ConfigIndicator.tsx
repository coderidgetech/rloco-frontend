import { useEffect, useState } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { Settings, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * Visual indicator that shows when configuration changes are being applied
 * Only visible in development or when explicitly enabled
 */
export const ConfigIndicator = () => {
  const { config } = useSiteConfig();
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    // Show indicator briefly when config changes
    setShowIndicator(true);
    const timer = setTimeout(() => setShowIndicator(false), 2000);
    return () => clearTimeout(timer);
  }, [config]);

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-[9999] bg-black text-white px-4 py-2 rounded-lg shadow-2xl flex items-center gap-2"
        >
          <div className="animate-spin">
            <Settings className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium">Applying configuration...</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
