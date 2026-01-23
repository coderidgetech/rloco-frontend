import { useEffect } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';

/**
 * This component applies the site configuration to the DOM
 * It runs in the background and updates CSS variables and document properties
 */
export const ConfigApplier = () => {
  const { config } = useSiteConfig();

  useEffect(() => {
    const root = document.documentElement;
    
    // Apply color variables
    root.style.setProperty('--primary', config.design.colors.primary);
    root.style.setProperty('--accent', config.design.colors.primary);
    root.style.setProperty('--color-primary', config.design.colors.primary);
    root.style.setProperty('--color-accent', config.design.colors.primary);
    root.style.setProperty('--primary-light', config.design.colors.primaryLight);
    root.style.setProperty('--primary-dark', config.design.colors.primaryDark);
    root.style.setProperty('--secondary', config.design.colors.secondary);
    root.style.setProperty('--ring', config.design.colors.primary);
    
    // Apply primary color to chart colors
    root.style.setProperty('--chart-1', config.design.colors.primary);
    
    // Apply typography
    root.style.setProperty('--font-family', config.design.typography.bodyFont);
    root.style.setProperty('--font-size', `${config.design.typography.baseFontSize}px`);
    
    // Apply layout
    root.style.setProperty('--radius', `${config.design.layout.borderRadius}px`);
    
    // Apply animation speed
    const speedMap: Record<string, string> = {
      slow: '800ms',
      normal: '500ms',
      fast: '300ms',
    };
    const animationSpeed = speedMap[config.design.animations.speed] || '500ms';
    root.style.setProperty('--animation-duration', animationSpeed);
    
    // Update document title
    document.title = `${config.general.siteName} - ${config.general.tagline}`;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', config.general.description);
    
    // Update favicon if needed (would need to implement file upload for this)
    // For now, we'll skip this as it requires more complex file handling
    
  }, [config]);

  // This component doesn't render anything
  return null;
};
