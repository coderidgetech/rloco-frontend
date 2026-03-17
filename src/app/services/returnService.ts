import api from '../lib/api';
import { Return, CreateReturnRequest, PaginatedResponse } from '../types/api';

export const returnService = {
  async list(params?: { limit?: number; skip?: number }): Promise<PaginatedResponse<Return>> {
    const response = await api.get<PaginatedResponse<Return>>('/returns', { params });
    return response.data;
  },

  async getById(id: string): Promise<Return> {
    const response = await api.get<Return>(`/returns/${id}`);
    return response.data;
  },

  async create(request: CreateReturnRequest): Promise<Return> {
    const { order_id, items, reason, description } = request;
    const response = await api.post<Return>(`/orders/${order_id}/return`, {
      items,
      reason,
      description,
    });
    return response.data;
  },
};
