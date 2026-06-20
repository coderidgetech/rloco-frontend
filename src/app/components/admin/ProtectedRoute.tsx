import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { ForcePasswordReset } from './ForcePasswordReset';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'vendor';
}

// Internal staff (first-party ops) may only reach the house catalog + orders.
const STAFF_ALLOWED_PREFIXES = ['/admin/products', '/admin/orders'];
const STAFF_HOME = '/admin/products';

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading, hasPermission } = useAdmin();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full min-w-0 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Storefront customer session cannot access staff portal (shared JWT would otherwise pass auth)
  if (user?.role === 'customer') {
    return <Navigate to="/" replace />;
  }

  // A vendor issued a temporary password must replace it before anything else.
  if (user?.must_reset_password) {
    return <ForcePasswordReset />;
  }

  // Staff are confined to the house catalog + orders; anything else → their home.
  if (user?.role === 'staff') {
    const allowed = STAFF_ALLOWED_PREFIXES.some((p) => location.pathname.startsWith(p));
    if (!allowed) {
      return <Navigate to={STAFF_HOME} replace />;
    }
  }

  if (requiredRole && !hasPermission(requiredRole)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};
