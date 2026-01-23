import api from '../lib/api';
import { ShippingMethod, CalculateShippingRequest } from '../types/api';

export const shippingService = {
  async listMethods(): Promise<ShippingMethod[]> {
    const response = await api.get<ShippingMethod[]>('/shipping/methods');
    return response.data;
  },

  async calculate(request: CalculateShippingRequest): Promise<ShippingMethod[]> {
    const response = await api.post<ShippingMethod[]>('/shipping/calculate', request);
    return response.data;
  },
};
