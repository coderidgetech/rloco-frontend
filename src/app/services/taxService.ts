import api from '../lib/api';
import { TaxRate, CalculateTaxRequest } from '../types/api';

export const taxService = {
  async listRates(): Promise<TaxRate[]> {
    const response = await api.get<TaxRate[]>('/tax/rates');
    return response.data;
  },

  async calculate(request: CalculateTaxRequest): Promise<{ tax: number; rate: TaxRate }> {
    const response = await api.post<{ tax: number; rate: TaxRate }>('/tax/calculate', request);
    return response.data;
  },
};
