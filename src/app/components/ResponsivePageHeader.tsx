import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

/** Top offset = main nav row below safe area */
const NAV_OFFSET = 'calc(env(safe-area-inset-top, 0px) + 3.5rem)';

interface ResponsivePageHeaderProps {
  title: string;
  onBack?: () => void;
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
        className="sticky z-30 border-b border-border/40 bg-background/98 shadow-[0_1px_0_rgba(0,0,0,0.04)] backdrop-blur-md dark:border-border/50 dark:bg-background/95 dark:shadow-[0_1px_0_rgba(255,255,255,0.06)]"
        style={{ top: NAV_OFFSET }}
      >
        <div className="mx-auto grid max-w-lg grid-cols-[48px_1fr_48px] items-center gap-1 px-2 py-2 sm:grid-cols-[52px_1fr_52px] sm:px-3 sm:py-2.5">
          <div className="flex justify-start">
            {showBack ? (
              <button
                onClick={handleBack}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-transparent text-foreground transition-colors hover:bg-muted/70 active:scale-[0.98] active:bg-muted dark:hover:bg-muted/50"
                aria-label="Go back"
                type="button"
              >
                <ChevronLeft size={22} strokeWidth={2.25} className="-ml-0.5" />
              </button>
            ) : (
              <span className="w-11" aria-hidden />
            )}
          </div>
          <h1 className="min-w-0 text-center text-[15px] font-semibold leading-tight tracking-tight text-foreground sm:text-lg">
            <span className="line-clamp-2">{title}</span>
          </h1>
          <div className="w-11 justify-self-end sm:w-[52px]" aria-hidden />
        </div>
      </header>
    );
  }

  return (
    <div className="bg-transparent">
      <div className="mx-auto max-w-5xl px-4 py-3 md:px-8 md:py-4">
        {showBack && onBack && (
          <button
            onClick={handleBack}
            className="mb-3 flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            type="button"
          >
            <ChevronLeft size={18} strokeWidth={2} />
            Back
          </button>
        )}
        <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl md:tracking-tight">{title}</h1>
      </div>
    </div>
  );
}
