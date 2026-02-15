import { motion } from 'motion/react';
import { Gift, Star, Award, TrendingUp, ChevronRight } from 'lucide-react';
import { MobileSubPageHeader } from '@/app/components/mobile/MobileSubPageHeader';
import { useNavigate } from 'react-router-dom';

const REWARDS_ACTIVITIES = [
  { action: 'Make a purchase', points: '1 point per ₹100', icon: <TrendingUp size={18} /> },
  { action: 'Write a review', points: '50 points', icon: <Star size={18} /> },
  { action: 'Refer a friend', points: '500 points', icon: <Gift size={18} /> },
  { action: 'Complete profile', points: '100 points', icon: <Award size={18} /> },
];

const REWARDS_HISTORY = [
  { date: '2024-01-20', description: 'Purchase reward', points: '+120', balance: 450 },
  { date: '2024-01-15', description: 'Review bonus', points: '+50', balance: 330 },
  { date: '2024-01-10', description: 'Welcome bonus', points: '+280', balance: 280 },
];

export function MobileRewardsPage() {
  const currentPoints = 450;
  const nextTierPoints = 1000;
  const progress = (currentPoints / nextTierPoints) * 100;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-20" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      <MobileSubPageHeader onBack={() => navigate('/account')} />

      <div className="pt-[100px]">{/* Header + safe area */}
        {/* Points Card */}
        <div className="p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-3xl p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/80 text-sm mb-1">Your Points</p>
                <p className="text-4xl font-bold">{currentPoints}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Star size={32} className="text-white" />
              </div>
            </div>

            {/* Progress to Next Tier */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/80">Silver Tier</span>
                <span className="text-white/80">{nextTierPoints} pts to Gold</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-white rounded-full"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Redeem Points */}
        <div className="px-4 mb-6">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white border border-primary/30 text-primary py-4 rounded-2xl font-medium flex items-center justify-center gap-2"
          >
            <Gift size={20} />
            <span>Redeem Points</span>
            <ChevronRight size={20} />
          </motion.button>
        </div>

        {/* How to Earn Points */}
        <div className="px-4 mb-6">
          <h2 className="text-lg font-medium mb-3">Earn More Points</h2>
          <div className="space-y-2">
            {REWARDS_ACTIVITIES.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-4 border border-border/30 shadow-sm flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.action}</p>
                  <p className="text-xs text-foreground/60">{activity.points}</p>
                </div>
                <ChevronRight size={18} className="text-foreground/30" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Points History */}
        <div className="px-4">
          <h2 className="text-lg font-medium mb-3">Points History</h2>
          <div className="bg-white rounded-2xl border border-border/30 shadow-sm overflow-hidden">
            {REWARDS_HISTORY.map((item, index) => (
              <div
                key={index}
                className={`p-4 flex items-center justify-between ${
                  index !== REWARDS_HISTORY.length - 1 ? 'border-b border-border/10' : ''
                }`}
              >
                <div>
                  <p className="font-medium text-sm">{item.description}</p>
                  <p className="text-xs text-foreground/50">{item.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">{item.points}</p>
                  <p className="text-xs text-foreground/50">Bal: {item.balance}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="p-4 mt-6">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Award size={18} className="text-primary" />
              <span>Loyalty Tiers</span>
            </h3>
            <div className="space-y-2 text-sm text-foreground/70">
              <p>• <strong>Silver:</strong> 0-999 points - 1x earning rate</p>
              <p>• <strong>Gold:</strong> 1000-4999 points - 1.5x earning rate</p>
              <p>• <strong>Platinum:</strong> 5000+ points - 2x earning rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}