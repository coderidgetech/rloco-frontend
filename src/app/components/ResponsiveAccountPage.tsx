import { Navigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';
import { useUser } from '../context/UserContext';
import { MobileAccountPage } from '../pages/mobile/MobileAccountPage';
import { AccountPageStandalone } from './AccountPageStandalone';

export function ResponsiveAccountPage() {
  const isMobile = useIsMobile();
  const { isAuthenticated, isLoading } = useUser();

  if (isLoading) {
    return null; // or a small spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=/account" replace />;
  }

  if (isMobile) {
    return <MobileAccountPage />;
  }

  return <AccountPageStandalone />;
}
