import api from '../lib/api';
import { Category } from '../types/api';

export const categoryService = {
  async list(): Promise<Category[]> {
    const response = await api.get<Category[]>('/categories');
    return response.data ?? [];
  },

  async getById(id: string): Promise<Category> {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },

  async create(category: Partial<Category>): Promise<Category> {
    const response = await api.post<Category>('/categories', category);
    return response.data;
  },

  async update(id: string, category: Partial<Category>): Promise<Category> {
    const response = await api.put<Category>(`/categories/${id}`, category);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
