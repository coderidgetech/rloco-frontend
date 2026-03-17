import api from '../lib/api';
import { Wishlist, Product } from '../types/api';

export const wishlistService = {
  async getWishlist(): Promise<Wishlist[]> {
    const response = await api.get<Wishlist[]>('/wishlist');
    return response.data ?? [];
  },

  async addToWishlist(productId: string): Promise<Wishlist> {
    const response = await api.post<Wishlist>('/wishlist/items', { product_id: productId });
    return response.data;
  },

  async removeFromWishlist(productId: string): Promise<void> {
    await api.delete(`/wishlist/items/${productId}`);
  },

  async getProductAnalytics(productId: string): Promise<WishlistProductAnalytics> {
    const response = await api.get<WishlistProductAnalytics>('/admin/wishlist/analytics', {
      params: { product_id: productId },
    });
    return response.data;
  },

  async getUserAnalytics(): Promise<WishlistUserAnalytics> {
    const response = await api.get<WishlistUserAnalytics>('/admin/wishlist/analytics/users');
    return response.data;
  },
};

export interface WishlistProductAnalytics {
  product_id?: string;
  wishlist_count: number;
  unique_users: number;
  purchase_conversion: number;
  trend?: string;
  trend_percent?: number;
}

export interface WishlistUserAnalytics {
  total_wishlists: number;
  active_users?: number;
}
