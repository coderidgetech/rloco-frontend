import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  ChevronRight, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  CreditCard, 
  Bell, 
  Settings, 
  HelpCircle, 
  LogOut,
  Gift,
  Tag,
  Star,
  Package
} from 'lucide-react';
import { BottomNavigation } from '@/app/components/mobile/BottomNavigation';
import { useUser } from '@/app/context/UserContext';
import { useEffect, useState } from 'react';
import { orderService } from '@/app/services/orderService';
import { wishlistService } from '@/app/services/wishlistService';

export function MobileAccountPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useUser();
  const [ordersCount, setOrdersCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserStats();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      // Fetch orders count
      const orders = await orderService.getOrders();
      setOrdersCount(orders.length || 0);

      // Fetch wishlist count
      const wishlist = await wishlistService.getWishlist();
      setWishlistCount(wishlist.length || 0);

      // Points would come from a rewards/loyalty API if available
      setPoints(0); // TODO: Implement rewards API
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    // Navigate to login page or open login modal
    navigate('/login');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white pb-20">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border/20">
          <div className="flex items-center justify-center h-14" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
            <h1 className="text-lg font-medium">Account</h1>
          </div>
        </div>

        {/* Not Logged In State */}
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 pt-14">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <User size={40} className="text-primary" />
          </div>
          <h2 className="text-xl font-medium mb-2">Welcome to Rloco</h2>
          <p className="text-sm text-foreground/60 mb-6 text-center max-w-xs">
            Sign in to access your orders, wishlist, and personalized recommendations
          </p>
          
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            className="w-full max-w-xs bg-primary text-white px-8 py-3.5 rounded-full font-medium mb-3"
          >
            Sign In
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleLogin}
            className="w-full max-w-xs border-2 border-border px-8 py-3.5 rounded-full font-medium"
          >
            Create Account
          </motion.button>

          {/* Guest Options */}
          <div className="mt-12 w-full max-w-xs">
            <p className="text-xs text-foreground/40 uppercase tracking-wider mb-4 text-center">
              Browse as Guest
            </p>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center justify-between p-4 bg-foreground/5 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag size={20} className="text-foreground/60" />
                  <span className="text-sm font-medium">Continue Shopping</span>
                </div>
                <ChevronRight size={18} className="text-foreground/40" />
              </button>
              
              <button
                onClick={() => navigate('/help')}
                className="w-full flex items-center justify-between p-4 bg-foreground/5 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle size={20} className="text-foreground/60" />
                  <span className="text-sm font-medium">Help Center</span>
                </div>
                <ChevronRight size={18} className="text-foreground/40" />
              </button>
            </div>
          </div>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border/20">
        <div className="flex items-center justify-center h-14" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <h1 className="text-lg font-medium">Account</h1>
        </div>
      </div>

      {/* Profile Section */}
      <div className="pt-14 px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full overflow-hidden bg-muted flex-shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name || 'User'} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                <User size={32} className="text-primary" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-medium mb-1 truncate">{user?.name || 'User'}</h2>
            <p className="text-sm text-foreground/60 truncate">{user?.email || ''}</p>
            {user?.created_at && (
              <p className="text-xs text-foreground/40 mt-1">
                Member since {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            )}
          </div>

          {/* Edit Button */}
          <button className="flex-shrink-0 w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center">
            <Settings size={18} className="text-foreground/70" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-foreground/5 rounded-2xl p-4 text-center">
            <div className="text-2xl font-semibold text-primary mb-1">
              {loading ? '...' : ordersCount}
            </div>
            <div className="text-xs text-foreground/60">Orders</div>
          </div>
          <div className="bg-foreground/5 rounded-2xl p-4 text-center">
            <div className="text-2xl font-semibold text-primary mb-1">
              {loading ? '...' : wishlistCount}
            </div>
            <div className="text-xs text-foreground/60">Wishlist</div>
          </div>
          <div className="bg-foreground/5 rounded-2xl p-4 text-center">
            <div className="text-2xl font-semibold text-primary mb-1">
              {loading ? '...' : points}
            </div>
            <div className="text-xs text-foreground/60">Points</div>
          </div>
        </div>

        {/* Menu Sections */}
        
        {/* Orders & Shopping */}
        <div className="mb-6">
          <h3 className="text-xs font-medium text-foreground/40 uppercase tracking-wider mb-3 px-2">
            Orders & Shopping
          </h3>
          <div className="space-y-1">
            <MenuButton
              icon={<Package size={20} />}
              label="My Orders"
              badge={ordersCount > 0 ? `${ordersCount}` : undefined}
              onClick={() => navigate('/orders')}
            />
            <MenuButton
              icon={<Heart size={20} />}
              label="Wishlist"
              badge={wishlistCount > 0 ? `${wishlistCount}` : undefined}
              onClick={() => navigate('/wishlist')}
            />
            <MenuButton
              icon={<Star size={20} />}
              label="Reviews"
              onClick={() => navigate('/reviews')}
            />
          </div>
        </div>

        {/* Account Settings */}
        <div className="mb-6">
          <h3 className="text-xs font-medium text-foreground/40 uppercase tracking-wider mb-3 px-2">
            Account Settings
          </h3>
          <div className="space-y-1">
            <MenuButton
              icon={<User size={20} />}
              label="Profile Information"
              onClick={() => navigate('/profile/edit')}
            />
            <MenuButton
              icon={<MapPin size={20} />}
              label="Addresses"
              badge="3"
              onClick={() => navigate('/addresses')}
            />
            <MenuButton
              icon={<CreditCard size={20} />}
              label="Payment Methods"
              onClick={() => navigate('/payment-methods')}
            />
            <MenuButton
              icon={<Bell size={20} />}
              label="Notifications"
              onClick={() => navigate('/notifications')}
            />
          </div>
        </div>

        {/* Rewards & Offers */}
        <div className="mb-6">
          <h3 className="text-xs font-medium text-foreground/40 uppercase tracking-wider mb-3 px-2">
            Rewards & Offers
          </h3>
          <div className="space-y-1">
            <MenuButton
              icon={<Gift size={20} />}
              label="Rloco Rewards"
              badge={points > 0 ? `${points} pts` : undefined}
              highlight
              onClick={() => navigate('/rewards')}
            />
            <MenuButton
              icon={<Tag size={20} />}
              label="Coupons & Offers"
              badge="3 Active"
              onClick={() => navigate('/coupons')}
            />
          </div>
        </div>

        {/* Support */}
        <div className="mb-6">
          <h3 className="text-xs font-medium text-foreground/40 uppercase tracking-wider mb-3 px-2">
            Support
          </h3>
          <div className="space-y-1">
            <MenuButton
              icon={<HelpCircle size={20} />}
              label="Help Center"
              onClick={() => navigate('/help')}
            />
            <MenuButton
              icon={<Settings size={20} />}
              label="Settings"
              onClick={() => navigate('/settings')}
            />
          </div>
        </div>

        {/* Logout */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-4 border border-red-200 text-red-500 rounded-xl font-medium"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </motion.button>

        {/* App Version */}
        <p className="text-xs text-foreground/40 text-center mt-6">
          Version 1.0.0
        </p>
      </div>

      <BottomNavigation />
    </div>
  );
}

// Menu Button Component
interface MenuButtonProps {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  highlight?: boolean;
  onClick: () => void;
}

function MenuButton({ icon, label, badge, highlight, onClick }: MenuButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
        highlight 
          ? 'bg-primary/10 border border-primary/20' 
          : 'bg-foreground/5 hover:bg-foreground/10'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`${highlight ? 'text-primary' : 'text-foreground/60'}`}>
          {icon}
        </div>
        <span className={`text-sm font-medium ${highlight ? 'text-primary' : ''}`}>
          {label}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        {badge && (
          <span className={`text-xs px-2 py-1 rounded-full ${
            highlight 
              ? 'bg-primary/20 text-primary font-medium' 
              : 'bg-foreground/10 text-foreground/60'
          }`}>
            {badge}
          </span>
        )}
        <ChevronRight size={18} className="text-foreground/40" />
      </div>
    </motion.button>
  );
}
