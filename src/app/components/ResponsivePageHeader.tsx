import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

interface ResponsivePageHeaderProps {
  title: string;
  onBack?: () => void;
  /** On desktop, show a back link under the main nav. Default true when onBack provided. */
  showBack?: boolean;
}

export function ResponsivePageHeader({ title, onBack, showBack = !!onBack }: ResponsivePageHeaderProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  if (isMobile) {
    return (
      <header
        className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-background border-b border-border/10"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center h-14 px-2">
          {showBack && (
            <button
              onClick={handleBack}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted/50 active:bg-muted transition-colors -ml-1"
              aria-label="Go back"
            >
              <ChevronLeft size={24} className="text-foreground" />
            </button>
          )}
          <h1 className="flex-1 text-lg font-semibold text-center pr-10">{title}</h1>
        </div>
      </header>
    );
  }

  return (
    <div className="border-b border-border/20 bg-background">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-4">
        {showBack && onBack && (
          <button
            onClick={handleBack}
            className="text-sm text-foreground/60 hover:text-foreground mb-2 flex items-center gap-1"
          >
            <ChevronLeft size={18} /> Back
          </button>
        )}
        <h1 className="text-2xl font-semibold">{title}</h1>
      </div>
    </div>
  );
}
