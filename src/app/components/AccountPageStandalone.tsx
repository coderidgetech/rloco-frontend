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
    <div className="min-h-screen bg-white dark:bg-background pb-mobile-nav md:pb-0" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      <AccountPage 
        isOpen={true} 
        onClose={handleClose}
        onLogout={handleLogout}
      />
      <Footer />
    </div>
  );
}
