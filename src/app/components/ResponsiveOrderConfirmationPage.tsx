import { useIsMobile } from '../hooks/useIsMobile';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';
import { MobileOrderConfirmationPage } from '../pages/mobile/MobileOrderConfirmationPage';

export function ResponsiveOrderConfirmationPage() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileOrderConfirmationPage /> : <OrderConfirmationPage />;
}
