import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'vendor';
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading, hasPermission } = useAdmin();

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

  if (requiredRole && !hasPermission(requiredRole)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};
