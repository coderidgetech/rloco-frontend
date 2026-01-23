import api from '../lib/api';
import { Wishlist, Product } from '../types/api';

export const wishlistService = {
  async getWishlist(): Promise<Wishlist[]> {
    const response = await api.get<Wishlist[]>('/wishlist');
    return response.data;
  },

  async addToWishlist(productId: string): Promise<Wishlist> {
    const response = await api.post<Wishlist>('/wishlist/items', { product_id: productId });
    return response.data;
  },

  async removeFromWishlist(productId: string): Promise<void> {
    await api.delete(`/wishlist/items/${productId}`);
  },
};
