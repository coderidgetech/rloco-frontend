import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search, Heart, ShoppingBag, MapPin, ChevronDown } from 'lucide-react';
import { useWishlist } from '@/app/context/WishlistContext';
import { useCart } from '@/app/context/CartContext';
import { RlocoLogo } from '../RlocoLogo';

interface MobileSubPageHeaderProps {
  showBackButton?: boolean;
  showDeliveryAddress?: boolean;
  onBack?: () => void;
}

export function MobileSubPageHeader({ 
  showBackButton = true, 
  showDeliveryAddress = true,
  onBack 
}: MobileSubPageHeaderProps) {
  const navigate = useNavigate();
  const { itemCount } = useWishlist();
  const { items } = useCart();

  const cartItemCount = items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border/10"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      {/* Top Bar: Back + Logo + Icons */}
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left: Back Button + Logo */}
        <div className="flex items-center gap-3">
          {showBackButton && (
            <button
              onClick={handleBackClick}
              className="w-9 h-9 flex items-center justify-center active:bg-foreground/5 rounded-full transition-colors touch-manipulation -ml-1"
              style={{ WebkitTapHighlightColor: 'transparent' }}
              aria-label="Go back"
            >
              <ChevronLeft size={28} className="text-foreground" />
            </button>
          )}
          
          <button
            onClick={() => navigate('/')}
            className="touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <RlocoLogo size="sm" />
          </button>
        </div>

        {/* Right: Search, Wishlist, Cart Icons */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button
            onClick={() => navigate('/search')}
            className="w-10 h-10 flex items-center justify-center active:bg-foreground/5 rounded-full transition-colors touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-label="Search"
          >
            <Search size={24} className="text-foreground/80" strokeWidth={2} />
          </button>

          {/* Wishlist */}
          <button
            onClick={() => navigate('/wishlist')}
            className="relative w-10 h-10 flex items-center justify-center active:bg-foreground/5 rounded-full transition-colors touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-label="Wishlist"
          >
            <Heart size={24} className="text-foreground/80" strokeWidth={2} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-[20px] px-1.5 bg-destructive text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {itemCount > 9 ? '9+' : itemCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={() => navigate('/cart')}
            className="relative w-10 h-10 flex items-center justify-center active:bg-foreground/5 rounded-full transition-colors touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
            aria-label="Shopping Bag"
          >
            <ShoppingBag size={24} className="text-foreground/80" strokeWidth={2} />
            {cartItemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-[20px] px-1.5 bg-destructive text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Delivery Address Bar */}
      {showDeliveryAddress && (
        <div className="px-4 py-3 bg-muted/20 border-t border-border/10">
          <button 
            className="flex items-center gap-3 w-full text-left touch-manipulation"
            style={{ WebkitTapHighlightColor: 'transparent' }}
            onClick={() => {
              // Navigate to delivery location selection
              navigate('/delivery-location');
            }}
          >
            <MapPin size={20} className="text-foreground/70 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                <span className="font-semibold">Praneeth</span> - 202 flat, 2nd floor, datta Krupa ho...
              </p>
            </div>
            <ChevronDown size={20} className="text-foreground/50 flex-shrink-0" />
          </button>
        </div>
      )}
    </header>
  );
}