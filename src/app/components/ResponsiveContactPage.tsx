import { useIsMobile } from '@/app/hooks/useIsMobile';
import { ContactPage } from '@/app/pages/ContactPage';
import { MobileContactPage } from '@/app/pages/mobile/MobileContactPage';

export function ResponsiveContactPage() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileContactPage /> : <ContactPage />;
}
