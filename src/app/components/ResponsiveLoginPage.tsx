import { DesktopLoginPage } from '@/app/pages/DesktopLoginPage';
import { MobileLoginPage } from '@/app/pages/mobile.backup/MobileLoginPage';
import { useIsMobile } from '@/app/hooks/useIsMobile';

export function ResponsiveLoginPage() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileLoginPage /> : <DesktopLoginPage />;
}
