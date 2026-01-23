import api from '../lib/api';
import { Cart, CartItem } from '../types/api';

export const cartService = {
  async getCart(): Promise<Cart> {
    const response = await api.get<Cart>('/cart');
    return response.data;
  },

  async addItem(item: Omit<CartItem, 'product_id'> & { product_id: string }): Promise<Cart> {
    const response = await api.post<Cart>('/cart/items', item);
    return response.data;
  },

  async updateItem(productId: string, size: string, quantity: number): Promise<Cart> {
    const response = await api.put<Cart>(`/cart/items/${productId}`, { quantity, size });
    return response.data;
  },

  async removeItem(productId: string, size: string): Promise<Cart> {
    // DELETE with body - axios doesn't support body in DELETE by default, so we use POST to a delete endpoint
    // Or we can use a workaround with config
    const response = await api.request<Cart>({
      method: 'DELETE',
      url: `/cart/items/${productId}`,
      data: { size },
    });
    return response.data;
  },

  async clearCart(): Promise<void> {
    await api.delete('/cart');
  },
};
