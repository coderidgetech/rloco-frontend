import { useIsMobile } from '../hooks/useIsMobile';
import { MobileOTPVerificationPage } from '../pages/mobile/MobileOTPVerificationPage';
import { DesktopOTPVerificationPage } from '../pages/DesktopOTPVerificationPage';

export function ResponsiveOTPVerificationPage() {
  const isMobile = useIsMobile();
  
  return isMobile ? <MobileOTPVerificationPage /> : <DesktopOTPVerificationPage />;
}
