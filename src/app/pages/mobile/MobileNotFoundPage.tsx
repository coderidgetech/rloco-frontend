import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';
export function MobileNotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-20 flex flex-col">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border/20">
        <div className="flex items-center h-14 px-4" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center"
          >
            <ArrowLeft size={20} />
          </motion.button>
          <h1 className="text-lg font-medium ml-3">Page Not Found</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-14">
        {/* 404 Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="mb-8"
        >
          <div className="relative">
            {/* Background Circle */}
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              {/* 404 Text */}
              <div className="text-center">
                <div className="text-7xl font-bold text-primary opacity-20">404</div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-0 right-0 w-12 h-12 bg-primary/20 rounded-full"
            />
            <motion.div
              animate={{ 
                y: [0, 10, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
              className="absolute bottom-4 left-0 w-8 h-8 bg-primary/15 rounded-full"
            />
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl font-medium mb-3">Oops! Page Not Found</h1>
          <p className="text-sm text-foreground/60 max-w-xs mx-auto leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <div className="w-full max-w-xs space-y-3">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="w-full bg-primary text-white py-4 rounded-full font-medium flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Go to Home
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/search')}
            className="w-full border-2 border-border py-4 rounded-full font-medium flex items-center justify-center gap-2"
          >
            <Search size={20} />
            Search Products
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            className="w-full py-4 text-foreground/70 font-medium"
          >
            Go Back
          </motion.button>
        </div>

        {/* Popular Categories */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 w-full max-w-xs"
        >
          <p className="text-xs text-foreground/40 uppercase tracking-wider mb-4 text-center">
            Browse Popular Categories
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: 'Women', link: '/category/women' },
              { name: 'Men', link: '/category/men' },
              { name: 'New Arrivals', link: '/new-arrivals' },
              { name: 'Sale', link: '/sale' },
            ].map((category, index) => (
              <motion.button
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(category.link)}
                className="py-3 bg-foreground/5 rounded-xl text-sm font-medium"
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
