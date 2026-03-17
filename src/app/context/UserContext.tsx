import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { User } from '../types/api';

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  loginWithGoogle: (idToken: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  /** Sync user from localStorage (demo/OTP login). Call after setting isAuthenticated in storage, then navigate. */
  syncFromStorage: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const getDemoUserFromStorage = useCallback((): User | null => {
    if (typeof window === 'undefined') return null;
    if (localStorage.getItem('isAuthenticated') !== 'true') return null;
    return {
      id: 'demo',
      email: localStorage.getItem('userEmail') || 'user@example.com',
      name: localStorage.getItem('userName') || 'User',
      role: 'customer',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }, []);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const currentUser = await authService.getMe();
      setUser(currentUser);
    } catch {
      // Backend not authenticated; allow demo auth from OTP/phone login (localStorage)
      const demoUser = getDemoUserFromStorage();
      setUser(demoUser);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getMe();
      setUser(currentUser);
    } catch {
      const demoUser = getDemoUserFromStorage();
      setUser(demoUser);
    }
  };

  const syncFromStorage = useCallback(() => {
    const demoUser = getDemoUserFromStorage();
    setUser(demoUser);
  }, [getDemoUserFromStorage]);

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

  const loginWithGoogle = async (idToken: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.googleSignIn(idToken);
      setUser(response.user);
      return true;
    } catch (error: any) {
      console.error('Google login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authService.register(email, password, name);
      setUser(response.user);
      return true;
    } catch (error: any) {
      console.error('Register error:', error);
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
      // Clear demo auth so next checkAuth doesn't restore from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userPhone');
      }
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
        refreshUser,
        syncFromStorage,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
