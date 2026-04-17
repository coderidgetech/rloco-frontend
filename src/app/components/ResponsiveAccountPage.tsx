import { Navigate, useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { AccountPageStandalone } from './AccountPageStandalone';
import { ACCOUNT_DEFAULT_PATH, isAccountSection } from '../lib/accountRoutes';

export function ResponsiveAccountPage() {
  const { section } = useParams<{ section: string }>();
  const { isAuthenticated, isLoading } = useUser();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(ACCOUNT_DEFAULT_PATH)}`} replace />;
  }

  if (section && !isAccountSection(section)) {
    return <Navigate to={ACCOUNT_DEFAULT_PATH} replace />;
  }

  return <AccountPageStandalone />;
}
