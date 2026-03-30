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
  Package,
  RotateCcw,
  Ruler,
  Mail,
  Users,
  FileText,
  Shield
} from 'lucide-react';
import { MobileSubPageHeader } from '@/app/components/mobile/MobileSubPageHeader';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function MobileAccountPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is authenticated
    const authenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    
    setIsLoggedIn(authenticated);
    if (authenticated) {
      setUser({
        name: userName || 'User',
        email: userEmail || 'user@example.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
        memberSince: 'January 2024',
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUser(null);
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white dark:bg-background pb-20" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
        {/* Header */}
        <MobileSubPageHeader showBackButton={false} showDeliveryAddress={false} />

        {/* Not Logged In State */}
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 56px)' }}>
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <User size={40} className="text-primary" />
          </div>
          <h2 className="text-xl font-medium mb-2">Welcome to Rloco</h2>
          <p className="text-sm text-foreground/60 mb-6 text-center max-w-xs">
            Sign in to access your orders, wishlist, and personalized recommendations
          </p>
          
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/login')}
            className="w-full max-w-xs bg-primary text-white px-8 py-3.5 rounded-full font-medium mb-3"
          >
            Sign In
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/signup')}
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-20" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      {/* Header */}
      <MobileSubPageHeader showBackButton={false} showDeliveryAddress={false} />

      {/* Profile Section */}
      <div className="px-4 py-6" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 56px + 24px)' }}>
        <div className="flex items-center gap-4 mb-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full overflow-hidden bg-muted flex-shrink-0">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                <User size={32} className="text-primary" />
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-medium mb-1 truncate">{user.name}</h2>
            <p className="text-sm text-foreground/60 truncate">{user.email}</p>
            <p className="text-xs text-foreground/40 mt-1">Member since {user.memberSince}</p>
          </div>

          {/* Edit Button */}
          <button className="flex-shrink-0 w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center">
            <Settings size={18} className="text-foreground/70" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/orders')}
            className="bg-foreground/5 rounded-2xl p-4 text-center active:bg-foreground/10 transition-colors cursor-pointer"
          >
            <div className="text-2xl font-semibold text-primary mb-1">12</div>
            <div className="text-xs text-foreground/60">Orders</div>
          </motion.div>
          <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/wishlist')}
            className="bg-foreground/5 rounded-2xl p-4 text-center active:bg-foreground/10 transition-colors cursor-pointer"
          >
            <div className="text-2xl font-semibold text-primary mb-1">8</div>
            <div className="text-xs text-foreground/60">Wishlist</div>
          </motion.div>
          <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/rewards')}
            className="bg-foreground/5 rounded-2xl p-4 text-center active:bg-foreground/10 transition-colors cursor-pointer"
          >
            <div className="text-2xl font-semibold text-primary mb-1">450</div>
            <div className="text-xs text-foreground/60">Points</div>
          </motion.div>
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
              badge="2 Active"
              onClick={() => navigate('/orders')}
            />
            <MenuButton
              icon={<Heart size={20} />}
              label="Wishlist"
              badge="8"
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
              badge="450 pts"
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
            Support & Information
          </h3>
          <div className="space-y-1">
            <MenuButton
              icon={<HelpCircle size={20} />}
              label="Help Center"
              onClick={() => navigate('/help')}
            />
            <MenuButton
              icon={<Package size={20} />}
              label="Shipping Info"
              onClick={() => navigate('/shipping')}
            />
            <MenuButton
              icon={<RotateCcw size={20} />}
              label="Returns & Refunds"
              onClick={() => navigate('/returns')}
            />
            <MenuButton
              icon={<Ruler size={20} />}
              label="Size Guide"
              onClick={() => navigate('/size-guide')}
            />
            <MenuButton
              icon={<Mail size={20} />}
              label="Contact Us"
              onClick={() => navigate('/contact')}
            />
            <MenuButton
              icon={<Users size={20} />}
              label="About Rloco"
              onClick={() => navigate('/about')}
            />
            <MenuButton
              icon={<FileText size={20} />}
              label="Terms of Service"
              onClick={() => navigate('/terms')}
            />
            <MenuButton
              icon={<Shield size={20} />}
              label="Privacy Policy"
              onClick={() => navigate('/privacy')}
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