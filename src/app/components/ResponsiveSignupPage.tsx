import { useIsMobile } from '@/app/hooks/useIsMobile';
import { MobileSignupPage } from '@/app/pages/mobile/MobileSignupPage';
import { DesktopSignupPage } from '@/app/pages/DesktopSignupPage';

export function ResponsiveSignupPage() {
  const isMobile = useIsMobile();
  
  return isMobile ? <MobileSignupPage /> : <DesktopSignupPage />;
}
