import { useIsMobile } from '@/app/hooks/useIsMobile';
import { AboutPage } from '@/app/pages/AboutPage';
import { MobileAboutPage } from '@/app/pages/mobile/MobileAboutPage';

export function ResponsiveAboutPage() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileAboutPage /> : <AboutPage />;
}
