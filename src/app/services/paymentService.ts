import api from '../lib/api';
import { PaymentIntent, PaymentTransaction, CreatePaymentIntentRequest, ProcessPaymentRequest } from '../types/api';

export const paymentService = {
  async createPaymentIntent(request: CreatePaymentIntentRequest): Promise<PaymentIntent> {
    const response = await api.post<PaymentIntent>('/payments/intent', request);
    return response.data;
  },

  async processPayment(request: ProcessPaymentRequest): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/payments/process', request);
    return response.data;
  },

  async getTransaction(id: string): Promise<PaymentTransaction> {
    const response = await api.get<PaymentTransaction>(`/payments/transactions/${id}`);
    return response.data;
  },

  async refund(transactionId: string, amount?: number): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(`/payments/refund/${transactionId}`, {
      amount,
    });
    return response.data;
  },
};
