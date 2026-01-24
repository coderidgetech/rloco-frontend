import { useIsMobile } from '../hooks/useIsMobile';
import { CategoryPage } from '../pages/CategoryPage';
import { MobileCategoryPage } from '../pages/mobile/MobileCategoryPage';

export function ResponsiveCategoryPage() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileCategoryPage /> : <CategoryPage />;
}
