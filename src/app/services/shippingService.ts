import api from '../lib/api';
import { ShippingMethod, CalculateShippingRequest } from '../types/api';

export const shippingService = {
  async listMethods(): Promise<ShippingMethod[]> {
    const response = await api.get<ShippingMethod[]>('/shipping/methods');
    return response.data;
  },

  async calculate(request: CalculateShippingRequest): Promise<ShippingMethod[]> {
    const response = await api.post<{ methods?: ShippingMethod[] } | ShippingMethod[]>('/shipping/calculate', {
      country: request.country,
      subtotal: request.subtotal,
      weight: (request as any).weight,
    });
    const data = response.data;
    if (Array.isArray(data)) return data;
    return data?.methods ?? [];
  },
};
