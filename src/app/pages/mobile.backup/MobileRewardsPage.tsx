import { Gift, Star, Award, TrendingUp } from 'lucide-react';
import { MobileSubPageHeader } from '@/app/components/mobile/MobileSubPageHeader';
import { useIsMobile } from '@/app/hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';

const REWARDS_ACTIVITIES = [
  { action: 'Make a purchase', points: '1 point per ₹100', icon: <TrendingUp size={18} /> },
  { action: 'Write a review', points: '50 points', icon: <Star size={18} /> },
  { action: 'Refer a friend', points: '500 points', icon: <Gift size={18} /> },
  { action: 'Complete profile', points: '100 points', icon: <Award size={18} /> },
];

export function MobileRewardsPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-20 md:pb-12" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      {isMobile && <MobileSubPageHeader onBack={() => navigate('/account')} />}

      <div className={isMobile ? 'pt-[100px]' : 'pt-6 max-w-3xl mx-auto px-4'}>
        {/* Header */}
        <div className="bg-white p-4 border-b border-border/20">
          <h1 className="text-2xl font-medium mb-1">Rewards</h1>
          <p className="text-sm text-foreground/60">Earn points on every purchase</p>
        </div>

        {/* Coming Soon Banner */}
        <div className="p-4">
          <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-3xl p-6 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Loyalty Program</h2>
            <p className="text-white/80 text-sm">
              Our rewards program is coming soon. Start shopping now — your purchases will count once it launches!
            </p>
          </div>
        </div>

        {/* How to Earn Points */}
        <div className="px-4 mb-6">
          <h2 className="text-lg font-medium mb-3">How to Earn Points</h2>
          <div className="space-y-2">
            {REWARDS_ACTIVITIES.map((activity, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-4 border border-border/30 shadow-sm flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.action}</p>
                  <p className="text-xs text-foreground/60">{activity.points}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loyalty Tiers Info */}
        <div className="p-4">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Award size={18} className="text-primary" />
              <span>Loyalty Tiers</span>
            </h3>
            <div className="space-y-2 text-sm text-foreground/70">
              <p>• <strong>Silver:</strong> 0–999 points — 1× earning rate</p>
              <p>• <strong>Gold:</strong> 1000–4999 points — 1.5× earning rate</p>
              <p>• <strong>Platinum:</strong> 5000+ points — 2× earning rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
