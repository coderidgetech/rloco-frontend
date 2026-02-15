import { ChevronLeft, ShoppingBag, Heart, Truck, Tag, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MobileSubPageHeader } from '@/app/components/mobile/MobileSubPageHeader';

export function MobileNotificationsPage() {
  const navigate = useNavigate();

  const notifications = [
    {
      id: 1,
      icon: Tag,
      title: 'Flash Sale Alert!',
      message: 'Up to 70% off on selected items. Hurry, limited time only!',
      time: '2 hours ago',
      unread: true,
      color: 'bg-red-500',
    },
    {
      id: 2,
      icon: Truck,
      title: 'Order Delivered',
      message: 'Your order #RT12345 has been delivered successfully.',
      time: '1 day ago',
      unread: true,
      color: 'bg-green-500',
    },
    {
      id: 3,
      icon: Heart,
      title: 'Wishlist Item on Sale',
      message: 'Premium Italian Handcrafted Classic Shirt is now 20% off!',
      time: '2 days ago',
      unread: true,
      color: 'bg-destructive',
    },
    {
      id: 4,
      icon: ShoppingBag,
      title: 'Order Confirmed',
      message: 'Your order has been confirmed and will be shipped soon.',
      time: '3 days ago',
      unread: false,
      color: 'bg-primary',
    },
    {
      id: 5,
      icon: Tag,
      title: 'New Arrivals',
      message: 'Check out our latest collection of summer dresses!',
      time: '4 days ago',
      unread: false,
      color: 'bg-blue-500',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-20" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      <MobileSubPageHeader onBack={() => navigate('/account')} />

      {/* Content */}
      <div className="pt-14">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-4">
              <Bell size={32} className="text-foreground/40" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Notifications</h3>
            <p className="text-sm text-foreground/60 text-center">
              You're all caught up! Check back later for updates.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/10">
            {notifications.map((notification, index) => (
              <motion.button
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  // Handle notification click
                  console.log('Notification clicked:', notification.id);
                }}
                className={`w-full flex items-start gap-3 px-4 py-4 text-left active:bg-foreground/5 transition-colors touch-manipulation ${
                  notification.unread ? 'bg-primary/5' : 'bg-white'
                }`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {/* Icon */}
                <div className={`w-10 h-10 rounded-full ${notification.color} flex items-center justify-center flex-shrink-0`}>
                  <notification.icon size={18} className="text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="text-sm font-medium text-foreground pr-2">{notification.title}</h4>
                    {notification.unread && (
                      <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-sm text-foreground/60 leading-relaxed mb-1.5">
                    {notification.message}
                  </p>
                  <p className="text-xs text-foreground/40">{notification.time}</p>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}