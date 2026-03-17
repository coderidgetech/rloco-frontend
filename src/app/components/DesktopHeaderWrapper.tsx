import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';
import { ResponsivePageHeader } from './ResponsivePageHeader';

interface DesktopHeaderWrapperProps {
  title: string;
  /** Path to navigate when back is clicked (e.g. '/account'). If not set, uses navigate(-1). */
  backPath?: string;
  children: React.ReactNode;
}

/**
 * On desktop, shows ResponsivePageHeader. On mobile, shows nothing (child typically has its own header).
 */
export function DesktopHeaderWrapper({ title, backPath, children }: DesktopHeaderWrapperProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const onBack = backPath != null ? () => navigate(backPath) : () => navigate(-1);
  return (
    <>
      {!isMobile && (
        <div className="pt-24">
          <ResponsivePageHeader title={title} onBack={onBack} />
        </div>
      )}
      {children}
    </>
  );
}
