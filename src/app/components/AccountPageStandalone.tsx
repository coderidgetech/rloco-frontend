import { AccountPage } from './AccountPage';
import { useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Footer } from './Footer';

export function AccountPageStandalone() {
  const { isAuthenticated, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to home if not authenticated
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleClose = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      {/* Render AccountPage as standalone (Navigation is handled by AppLayout) */}
      <AccountPage 
        isOpen={true} 
        onClose={handleClose}
        onLogout={handleLogout}
      />
      <Footer />
    </div>
  );
}
