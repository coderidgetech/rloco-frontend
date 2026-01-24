import { useIsMobile } from '../hooks/useIsMobile';
import { CartPage } from '../pages/CartPage';
import { MobileCartPage } from '../pages/mobile/MobileCartPage';

export function ResponsiveCartPage() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileCartPage /> : <CartPage />;
}
