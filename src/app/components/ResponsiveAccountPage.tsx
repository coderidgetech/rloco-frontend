import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { AccountPageStandalone } from './AccountPageStandalone';

export function ResponsiveAccountPage() {
  const { isAuthenticated, isLoading } = useUser();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=/account" replace />;
  }

  return <AccountPageStandalone />;
}
