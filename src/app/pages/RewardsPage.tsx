import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { rewardService, RewardsSummary, RewardsTransaction } from '../services/rewardService';
import { toast } from 'sonner';

export const RewardsPage = () => {
  const [summary, setSummary] = useState<RewardsSummary | null>(null);
  const [transactions, setTransactions] = useState<RewardsTransaction[]>([]);
  const [redeemPoints, setRedeemPoints] = useState('');
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [s, t] = await Promise.all([
        rewardService.getSummary(),
        rewardService.getTransactions({ limit: 20 }),
      ]);
      setSummary(s);
      setTransactions(t.transactions ?? []);
    } catch {
      toast.error('Failed to load rewards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleRedeem = async () => {
    const pts = parseInt(redeemPoints, 10);
    if (!pts || pts < 100) {
      toast.error('Minimum redemption is 100 points');
      return;
    }
    try {
      setRedeeming(true);
      const result = await rewardService.redeemPoints(pts);
      toast.success(`Redeemed ${result.redeemed_points} pts — $${result.discount_usd.toFixed(2)} discount!`);
      setRedeemPoints('');
      loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.error ?? 'Failed to redeem points');
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">My Rewards</h1>

      {/* Balance card */}
      <Card>
        <CardHeader>
          <CardTitle>Points Balance</CardTitle>
          <CardDescription>{summary?.points_rule}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Available Balance</p>
            <p className="text-3xl font-bold">{summary?.balance ?? 0}</p>
            <p className="text-sm text-gray-500">${((summary?.balance ?? 0) / 100).toFixed(2)} value</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Lifetime Earned</p>
            <p className="text-3xl font-bold">{summary?.reward_points ?? 0}</p>
            <p className="text-sm text-gray-500">{summary?.order_count ?? 0} orders</p>
          </div>
        </CardContent>
      </Card>

      {/* Redeem */}
      <Card>
        <CardHeader>
          <CardTitle>Redeem Points</CardTitle>
          <CardDescription>100 points = $1.00 discount. Minimum 100 points.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Input
            type="number"
            min={100}
            step={100}
            placeholder="Points to redeem"
            value={redeemPoints}
            onChange={(e) => setRedeemPoints(e.target.value)}
            className="max-w-[160px]"
          />
          {redeemPoints && parseInt(redeemPoints) >= 100 && (
            <span className="flex items-center text-sm text-gray-600">
              = ${(parseInt(redeemPoints) / 100).toFixed(2)} discount
            </span>
          )}
          <Button onClick={handleRedeem} disabled={redeeming}>
            {redeeming ? 'Redeeming…' : 'Redeem'}
          </Button>
        </CardContent>
      </Card>

      {/* Transaction history */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500 py-6">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{tx.description}</p>
                    <p className="text-xs text-gray-500">{new Date(tx.created_at).toLocaleDateString()}</p>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      tx.type === 'earned' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {tx.type === 'earned' ? '+' : '-'}{tx.points} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
