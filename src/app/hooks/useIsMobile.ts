import { useState, useEffect } from 'react';

function isCapacitorNative(): boolean {
  if (typeof window === 'undefined') return false;
  const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
  return !!(cap?.isNativePlatform?.());
}

export function useIsMobile(breakpoint: number = 768): boolean {
  // In Capacitor native app, always treat as mobile from first paint to avoid layout flash and glitches
  const [isMobile, setIsMobile] = useState(() =>
    isCapacitorNative() ? true : (typeof window !== 'undefined' && window.innerWidth < breakpoint)
  );

  useEffect(() => {
    // In native app, no need to listen for resize (always mobile)
    if (isCapacitorNative()) return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}
