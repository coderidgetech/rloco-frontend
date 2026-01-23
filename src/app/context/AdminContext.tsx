import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { User } from '../types/api';

export type UserRole = 'admin' | 'vendor' | 'customer' | null;

interface AdminContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasPermission: (requiredRole: 'admin' | 'vendor') => boolean;
  refreshUser: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const currentUser = await authService.getMe();
      setUser(currentUser);
    } catch (error) {
      // Not authenticated or token expired
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getMe();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      setUser(response.user);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  }, []);

  const hasPermission = useCallback((requiredRole: 'admin' | 'vendor'): boolean => {
    if (!user) return false;
    if (requiredRole === 'vendor') {
      return user.role === 'admin' || user.role === 'vendor';
    }
    return user.role === 'admin';
  }, [user]);

  return (
    <AdminContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasPermission,
        refreshUser,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};
