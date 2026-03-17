import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MobileSubPageHeader } from '@/app/components/mobile/MobileSubPageHeader';
import { useIsMobile } from '@/app/hooks/useIsMobile';

export function MobileNotificationsPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-20 md:pb-12" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      {isMobile && <MobileSubPageHeader onBack={() => navigate('/account')} />}

      <div className={isMobile ? 'pt-14' : 'pt-6 max-w-3xl mx-auto px-4'}>
        <div className="p-4 border-b border-border/20">
          <h1 className="text-2xl font-medium">Notifications</h1>
        </div>
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-4">
            <Bell size={32} className="text-foreground/40" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Notifications</h3>
          <p className="text-sm text-foreground/60 text-center">
            You're all caught up! Order updates and promotional alerts will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}