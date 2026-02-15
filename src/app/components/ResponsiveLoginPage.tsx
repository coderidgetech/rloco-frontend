import { useIsMobile } from '@/app/hooks/useIsMobile';
import { MobileLoginPage } from '@/app/pages/mobile/MobileLoginPage';
import { DesktopLoginPage } from '@/app/pages/DesktopLoginPage';

export function ResponsiveLoginPage() {
  const isMobile = useIsMobile();
  
  return isMobile ? <MobileLoginPage /> : <DesktopLoginPage />;
}
