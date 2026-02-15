import { useIsMobile } from '@/app/hooks/useIsMobile';
import { TermsPage } from '@/app/pages/TermsPage';
import { MobileTermsPage } from '@/app/pages/mobile/MobileTermsPage';

export function ResponsiveTermsPage() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileTermsPage /> : <TermsPage />;
}
