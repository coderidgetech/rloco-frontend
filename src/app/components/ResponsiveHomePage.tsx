import { HomePage } from '../pages/HomePage';
import { MobileHomePage } from '../pages/MobileHomePage';
import { useIsMobile } from '../hooks/useIsMobile';

export function ResponsiveHomePage() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileHomePage /> : <HomePage />;
}
