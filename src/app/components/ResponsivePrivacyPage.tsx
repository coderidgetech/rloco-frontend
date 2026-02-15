import { useIsMobile } from '@/app/hooks/useIsMobile';
import { PrivacyPage } from '@/app/pages/PrivacyPage';
import { MobilePrivacyPage } from '@/app/pages/mobile/MobilePrivacyPage';

export function ResponsivePrivacyPage() {
  const isMobile = useIsMobile();
  return isMobile ? <MobilePrivacyPage /> : <PrivacyPage />;
}
