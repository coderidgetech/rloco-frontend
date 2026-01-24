import { useIsMobile } from '../hooks/useIsMobile';
import { NotFoundPage } from '../pages/NotFoundPage';
import { MobileNotFoundPage } from '../pages/mobile/MobileNotFoundPage';

export function ResponsiveNotFoundPage() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileNotFoundPage /> : <NotFoundPage />;
}
