import { useIsMobile } from '@/app/hooks/useIsMobile';
import { ShippingPage } from '@/app/pages/ShippingPage';
import { MobileShippingPage } from '@/app/pages/mobile/MobileShippingPage';

export function ResponsiveShippingPage() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileShippingPage /> : <ShippingPage />;
}
