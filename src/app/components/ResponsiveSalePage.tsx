import { useIsMobile } from '../hooks/useIsMobile';
import { SalePage } from '../pages/SalePage';
import { MobileSalePage } from '../pages/mobile/MobileSalePage';

export function ResponsiveSalePage() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileSalePage /> : <SalePage />;
}
