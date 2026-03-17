import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Footer } from '../components/Footer';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pt-24 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto"
        >
          {/* 404 Number */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <h1 className="text-[120px] md:text-[180px] leading-none tracking-tighter text-foreground/10">
              404
            </h1>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4 mb-12"
          >
            <h2 className="text-2xl md:text-4xl uppercase tracking-[0.2em]">
              Page Not Found
            </h2>
            <p className="text-foreground/60 text-lg">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background hover:bg-foreground/90 transition-all uppercase tracking-widest text-xs"
            >
              <Home size={16} />
              Back to Home
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-8 py-4 border border-foreground/20 hover:border-foreground transition-all uppercase tracking-widest text-xs"
            >
              <ArrowLeft size={16} />
              Go Back
            </motion.button>
          </motion.div>

          {/* Suggestions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-16 pt-12 border-t border-foreground/10"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-foreground/60 mb-6">
              Popular Pages
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Women', path: '/category/women' },
                { name: 'Men', path: '/category/men' },
                { name: 'New Arrivals', path: '/new-arrivals' },
                { name: 'Sale', path: '/sale' },
              ].map((link, index) => (
                <motion.button
                  key={link.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                  onClick={() => navigate(link.path)}
                  className="p-6 border border-foreground/10 hover:border-foreground transition-all text-sm uppercase tracking-wider"
                >
                  {link.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
