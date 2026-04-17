import api from '../lib/api';
import { Order, CreateOrderRequest, PaginatedResponse } from '../types/api';

export const orderService = {
  async list(params?: { limit?: number; skip?: number; status?: string }): Promise<PaginatedResponse<Order>> {
    const response = await api.get<PaginatedResponse<Order>>('/orders', { params });
    return response.data;
  },

  async getById(id: string): Promise<Order> {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  async getByOrderNumber(orderNumber: string): Promise<Order> {
    const response = await api.get<Order>(`/orders/tracking/${orderNumber}`);
    return response.data;
  },

  async create(order: CreateOrderRequest, opts?: { idempotencyKey?: string }): Promise<Order> {
    const headers: Record<string, string> = {};
    if (opts?.idempotencyKey) {
      headers['Idempotency-Key'] = opts.idempotencyKey;
    }
    const response = await api.post<Order>('/orders', order, { headers });
    return response.data;
  },

  async updateStatus(id: string, status: string): Promise<Order> {
    const response = await api.put<Order>(`/orders/${id}/status`, { status });
    return response.data;
  },

  async getTracking(orderId: string): Promise<{ updates: OrderTrackingUpdate[] }> {
    const response = await api.get<{ updates: OrderTrackingUpdate[] }>(`/orders/${orderId}/tracking`);
    const data = response.data ?? {};
    return { updates: data.updates ?? [] };
  },
};

export interface OrderTrackingUpdate {
  id?: string;
  order_id?: string;
  status: string;
  description?: string;
  location?: string;
  date?: string;
  created_at: string;
}
