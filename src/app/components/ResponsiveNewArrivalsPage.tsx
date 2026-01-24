import { useIsMobile } from '../hooks/useIsMobile';
import { NewArrivalsPage } from '../pages/NewArrivalsPage';
import { MobileNewArrivalsPage } from '../pages/mobile/MobileNewArrivalsPage';

export function ResponsiveNewArrivalsPage() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileNewArrivalsPage /> : <NewArrivalsPage />;
}
