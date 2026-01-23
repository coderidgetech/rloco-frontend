import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'vendor';
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, hasPermission } = useAdmin();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requiredRole && !hasPermission(requiredRole)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};
