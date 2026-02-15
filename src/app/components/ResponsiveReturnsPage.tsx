import { useIsMobile } from '@/app/hooks/useIsMobile';
import { ReturnsPage } from '@/app/pages/ReturnsPage';
import { MobileReturnsPage } from '@/app/pages/mobile/MobileReturnsPage';

export function ResponsiveReturnsPage() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileReturnsPage /> : <ReturnsPage />;
}
