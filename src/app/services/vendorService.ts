import api from '../lib/api';

export type VendorProfile = {
  id: string;
  name: string;
  email: string;
  logo: string;
  subscription_plan?: string;
  permissions?: Record<string, unknown>;
  preferences?: Record<string, unknown>;
  status?: string;
};

export const vendorService = {
  async getMe(): Promise<VendorProfile> {
    const { data } = await api.get<VendorProfile>('/vendor/me');
    return data;
  },

  async updateMe(patch: Partial<Pick<VendorProfile, 'name' | 'email' | 'logo'>> & { preferences?: Record<string, unknown> }): Promise<VendorProfile> {
    const { data } = await api.put<VendorProfile>('/vendor/me', patch);
    return data;
  },

  async getAnalyticsSummary(): Promise<any> {
    const { data } = await api.get('/vendor/analytics/summary');
    return data;
  },

  async getAnalyticsRevenue(): Promise<any> {
    const { data } = await api.get('/vendor/analytics/revenue');
    return data;
  },

  async getAnalyticsProducts(): Promise<any> {
    const { data } = await api.get('/vendor/analytics/products');
    return data;
  },

  async getAnalyticsOrders(): Promise<any> {
    const { data } = await api.get('/vendor/analytics/orders');
    return data;
  },
};
