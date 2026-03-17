import api from '../lib/api';

export const newsletterService = {
  async subscribe(email: string, name?: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/newsletter/subscribe', {
      email,
      name,
    });
    return response.data;
  },

  async unsubscribe(email: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/newsletter/unsubscribe', {
      email,
    });
    return response.data;
  },
};
