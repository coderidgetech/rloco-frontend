import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function MobileTwoFactorPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-20 md:pb-12 flex flex-col items-center justify-center px-4" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Shield size={40} className="text-primary" />
      </div>
      <h1 className="text-xl font-semibold text-center mb-2">Two-Factor Authentication</h1>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-8">
        Add an extra layer of security to your account. This feature will be available in a future update.
      </p>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="px-6 py-3 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium"
      >
        Back
      </button>
    </div>
  );
}
