import api from '../lib/api';

export type RewardsSummary = {
  order_count: number;
  lifetime_spend: number;
  reward_points: number;
  balance: number;
  points_value_usd: number;
  points_rule: string;
};

export type RewardsTransaction = {
  id: string;
  type: 'earned' | 'redeemed';
  points: number;
  reference: string;
  description: string;
  created_at: string;
};

export type RedeemResult = {
  redeemed_points: number;
  discount_usd: number;
  new_balance: number;
  message: string;
};

export const rewardService = {
  async getSummary(): Promise<RewardsSummary> {
    const { data } = await api.get<RewardsSummary>('/rewards/summary');
    return data;
  },

  async getTransactions(params?: { limit?: number; skip?: number }): Promise<{ transactions: RewardsTransaction[]; total: number; limit: number; skip: number }> {
    const { data } = await api.get('/rewards/transactions', { params });
    return data;
  },

  async redeemPoints(points: number): Promise<RedeemResult> {
    const { data } = await api.post<RedeemResult>('/rewards/redeem', { points });
    return data;
  },
};
