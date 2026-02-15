import { useIsMobile } from '@/app/hooks/useIsMobile';
import { SizeGuidePage } from '@/app/pages/SizeGuidePage';
import { MobileSizeGuidePage } from '@/app/pages/mobile/MobileSizeGuidePage';

export function ResponsiveSizeGuidePage() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileSizeGuidePage /> : <SizeGuidePage />;
}
