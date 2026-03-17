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
      state: request.state,
      city: request.city,
      address: request.address,
      postal_code: request.postal_code,
      first_name: request.first_name,
      last_name: request.last_name,
      email: request.email,
      phone: request.phone,
      subtotal: request.subtotal,
      weight: request.weight,
    });
    const data = response.data;
    if (Array.isArray(data)) return data;
    return data?.methods ?? [];
  },
};
