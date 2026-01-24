import api from '../lib/api';
import { TaxRate, CalculateTaxRequest } from '../types/api';

export const taxService = {
  async listRates(): Promise<TaxRate[]> {
    const response = await api.get<TaxRate[]>('/tax/rates');
    return response.data;
  },

  async calculate(request: CalculateTaxRequest): Promise<{ tax: number; tax_amount?: number; rate: TaxRate }> {
    const { amount, subtotal, zip_code, ...rest } = request;
    const payload = {
      ...rest,
      subtotal: subtotal ?? amount ?? 0,
      postal_code: request.postal_code ?? zip_code,
    };
    const response = await api.post<{ tax?: number; tax_amount?: number; rate: TaxRate }>('/tax/calculate', payload);
    const data = response.data;
    const tax = data.tax ?? data.tax_amount ?? 0;
    return { tax, rate: data.rate! };
  },
};
