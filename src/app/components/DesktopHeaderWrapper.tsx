import { useNavigate } from 'react-router-dom';
import { ResponsivePageHeader } from './ResponsivePageHeader';
import { useIsMobile } from '../hooks/useIsMobile';

interface DesktopHeaderWrapperProps {
  title: string;
  backPath?: string;
  children: React.ReactNode;
}

/**
 * Sub-page title bar. On mobile, only ResponsivePageHeader (sits below global nav).
 * On lg+, sticky bar under the main nav.
 */
export function DesktopHeaderWrapper({ title, backPath, children }: DesktopHeaderWrapperProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const onBack = backPath != null ? () => navigate(backPath) : () => navigate(-1);

  if (isMobile) {
    return (
      <>
        <ResponsivePageHeader title={title} onBack={onBack} />
        {children}
      </>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-40 border-b border-border/30 bg-background/95 shadow-sm backdrop-blur-md dark:border-border/40 dark:bg-background/95">
        <ResponsivePageHeader title={title} onBack={onBack} />
      </div>
      {children}
    </>
  );
}
