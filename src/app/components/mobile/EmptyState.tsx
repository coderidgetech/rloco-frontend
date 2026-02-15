import { motion } from 'motion/react';
import { ShoppingBag, Search, Heart, Package, AlertCircle, Wifi } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  type: 'cart' | 'wishlist' | 'search' | 'category' | 'orders' | 'error' | 'network';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({
  type,
  title,
  description,
  actionText,
  onAction,
}: EmptyStateProps) {
  const navigate = useNavigate();

  const configs = {
    cart: {
      icon: ShoppingBag,
      defaultTitle: 'Your cart is empty',
      defaultDescription: 'Start shopping and add items to your cart',
      defaultActionText: 'Start Shopping',
      defaultAction: () => navigate('/'),
    },
    wishlist: {
      icon: Heart,
      defaultTitle: 'Your wishlist is empty',
      defaultDescription: 'Save your favorite items for later',
      defaultActionText: 'Explore Products',
      defaultAction: () => navigate('/'),
    },
    search: {
      icon: Search,
      defaultTitle: 'No results found',
      defaultDescription: 'Try adjusting your search or browse our categories',
      defaultActionText: 'Browse Categories',
      defaultAction: () => navigate('/categories'),
    },
    category: {
      icon: Package,
      defaultTitle: 'No products found',
      defaultDescription: 'Try adjusting your filters or browse other categories',
      defaultActionText: 'Clear Filters',
      defaultAction: () => window.location.reload(),
    },
    orders: {
      icon: Package,
      defaultTitle: 'No orders yet',
      defaultDescription: 'Start shopping to see your orders here',
      defaultActionText: 'Start Shopping',
      defaultAction: () => navigate('/'),
    },
    error: {
      icon: AlertCircle,
      defaultTitle: 'Something went wrong',
      defaultDescription: 'We encountered an error. Please try again.',
      defaultActionText: 'Try Again',
      defaultAction: () => window.location.reload(),
    },
    network: {
      icon: Wifi,
      defaultTitle: 'Connection issue',
      defaultDescription: 'Please check your internet connection and try again',
      defaultActionText: 'Retry',
      defaultAction: () => window.location.reload(),
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center px-6 py-16 text-center"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-20 h-20 rounded-full bg-foreground/5 flex items-center justify-center mb-6"
      >
        <Icon size={32} className="text-foreground/40" />
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xl font-medium text-foreground mb-2"
      >
        {title || config.defaultTitle}
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-sm text-foreground/60 mb-8 max-w-xs"
      >
        {description || config.defaultDescription}
      </motion.p>

      {/* Action Button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileTap={{ scale: 0.95 }}
        onClick={onAction || config.defaultAction}
        className="px-8 py-3 bg-primary text-white rounded-full font-medium transition-all hover:bg-primary/90"
      >
        {actionText || config.defaultActionText}
      </motion.button>
    </motion.div>
  );
}
