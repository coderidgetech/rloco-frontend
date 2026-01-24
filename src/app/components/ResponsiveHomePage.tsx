import { useIsMobile } from '../hooks/useIsMobile';
import { HomePage } from '../pages/HomePage';
import { MobileHomePage } from '../pages/MobileHomePage';

export function ResponsiveHomePage() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileHomePage /> : <HomePage />;
}
