import { useIsMobile } from '../hooks/useIsMobile';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { MobileProductDetailPage } from '../pages/mobile/MobileProductDetailPage';

export function ResponsiveProductDetailPage() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileProductDetailPage /> : <ProductDetailPage />;
}
