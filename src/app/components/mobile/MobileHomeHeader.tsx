import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronDown, Search, Bell, Heart, User } from 'lucide-react';
import { useWishlist } from '@/app/context/WishlistContext';
import { useSearchOverlay } from '@/app/context/SearchOverlayContext';
import { useDeliveryAddressPreview } from '@/app/hooks/useDeliveryAddressPreview';
import { RlocoLogo } from '../RlocoLogo';

interface MobileHomeHeaderProps {
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export function MobileHomeHeader(_props: MobileHomeHeaderProps = {}) {
  const navigate = useNavigate();
  const { openSearch } = useSearchOverlay();
  const { itemCount } = useWishlist();
  const { line: deliveryLine, loading: deliveryLoading, isAuthenticated } = useDeliveryAddressPreview();
  const [notificationCount] = useState(3); // Mock notification count

  const deliveryText = !isAuthenticated
    ? 'Add a delivery address'
    : deliveryLoading
      ? 'Loading address…'
      : deliveryLine
        ? `Deliver to ${deliveryLine}`
        : 'Select delivery location';

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border/10"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      {/* Logo and Action Icons Section */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-border/10">
        {/* Logo */}
        <RlocoLogo size="sm" />

        {/* Action Icons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openSearch()}
            className="w-10 h-10 rounded-full flex items-center justify-center active:bg-foreground/5 transition-colors touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-label="Search products"
          >
            <Search size={24} className="text-foreground/80" />
          </button>
          {/* Notification Icon */}
          <button
            onClick={() => navigate('/notifications')}
            className="relative w-10 h-10 rounded-full flex items-center justify-center active:bg-foreground/5 transition-colors touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-label="Notifications"
          >
            <Bell size={24} className="text-foreground/80" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          {/* Wishlist Icon */}
          <button
            onClick={() => navigate('/wishlist')}
            className="relative w-10 h-10 rounded-full flex items-center justify-center active:bg-foreground/5 transition-colors touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-label="Wishlist"
          >
            <Heart size={24} className="text-foreground/80" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-destructive text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>

          {/* Account Icon */}
          <button
            onClick={() => navigate('/account')}
            className="w-10 h-10 rounded-full flex items-center justify-center active:bg-foreground/5 transition-colors touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-label="Account"
          >
            <User size={24} className="text-foreground/80" />
          </button>
        </div>
      </div>

      {/* Delivery Address Section */}
      <div className="px-4 py-2.5 border-t border-border/10">
        <button 
          className="flex items-center gap-2 w-full text-left touch-manipulation"
          style={{ WebkitTapHighlightColor: 'transparent' }}
          onClick={() => navigate('/addresses')}
        >
          <MapPin size={20} className="text-foreground/70 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{deliveryText}</p>
          </div>
          <ChevronDown size={20} className="text-foreground/50 flex-shrink-0" />
        </button>
      </div>
    </header>
  );
}