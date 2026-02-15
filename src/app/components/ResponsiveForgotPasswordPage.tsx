import { useIsMobile } from '@/app/hooks/useIsMobile';
import { MobileForgotPasswordPage } from '@/app/pages/mobile/MobileForgotPasswordPage';
import { DesktopForgotPasswordPage } from '@/app/pages/DesktopForgotPasswordPage';

export function ResponsiveForgotPasswordPage() {
  const isMobile = useIsMobile();
  
  return isMobile ? <MobileForgotPasswordPage /> : <DesktopForgotPasswordPage />;
}
