import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';

export function MobileOnboardingRedirect({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Only redirect once on initial page load, not on navigation
    if (hasRedirected.current) return;
    
    // Check if we're coming from onboarding (user clicked Get Started)
    const isNavigatingFromOnboarding = sessionStorage.getItem('completedOnboarding');
    
    // Always redirect mobile users to onboarding from homepage on initial load
    // BUT don't redirect if they just completed onboarding
    if (isMobile && location.pathname === '/' && !isNavigatingFromOnboarding) {
      hasRedirected.current = true;
      navigate('/onboarding', { replace: true });
    }
    
    // Clear the flag after checking
    if (isNavigatingFromOnboarding) {
      sessionStorage.removeItem('completedOnboarding');
    }
  }, [isMobile, location.pathname, navigate]);

  return <>{children}</>;
}