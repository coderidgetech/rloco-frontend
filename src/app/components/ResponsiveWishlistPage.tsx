import { useIsMobile } from '../hooks/useIsMobile';
import { WishlistPage } from '../pages/WishlistPage';
import { MobileWishlistPage } from '../pages/mobile/MobileWishlistPage';

export function ResponsiveWishlistPage() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileWishlistPage /> : <WishlistPage />;
}
