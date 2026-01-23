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

  async create(order: CreateOrderRequest): Promise<Order> {
    const response = await api.post<Order>('/orders', order);
    return response.data;
  },

  async updateStatus(id: string, status: string): Promise<Order> {
    const response = await api.put<Order>(`/orders/${id}/status`, { status });
    return response.data;
  },
};
