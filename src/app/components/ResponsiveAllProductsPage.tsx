import { useIsMobile } from '../hooks/useIsMobile';
import { AllProductsPage } from '../pages/AllProductsPage';
import { MobileAllProductsPage } from '../pages/mobile/MobileAllProductsPage';

export function ResponsiveAllProductsPage() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileAllProductsPage /> : <AllProductsPage />;
}
