import api from '../lib/api';
import { Promotion } from '../types/api';

export const promotionService = {
  async list(): Promise<Promotion[]> {
    const response = await api.get<Promotion[]>('/promotions');
    return response.data;
  },

  async validate(code: string, subtotal: number): Promise<{ valid?: boolean; discount?: number; promotion?: Promotion }> {
    const response = await api.post<{ valid?: boolean; discount?: number; promotion?: Promotion }>('/promotions/validate', {
      code,
      subtotal,
    });
    return response.data;
  },
};
