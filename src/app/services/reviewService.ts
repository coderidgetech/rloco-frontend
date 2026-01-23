import api from '../lib/api';
import { ProductReview, CreateReviewRequest } from '../types/api';

export const reviewService = {
  async getByProduct(productId: string): Promise<ProductReview[]> {
    const response = await api.get<ProductReview[]>(`/products/${productId}/reviews`);
    return response.data;
  },

  async create(productId: string, review: CreateReviewRequest): Promise<ProductReview> {
    const response = await api.post<ProductReview>(`/products/${productId}/reviews`, review);
    return response.data;
  },

  async update(productId: string, reviewId: string, review: Partial<CreateReviewRequest>): Promise<ProductReview> {
    const response = await api.put<ProductReview>(`/products/${productId}/reviews/${reviewId}`, review);
    return response.data;
  },

  async delete(productId: string, reviewId: string): Promise<void> {
    await api.delete(`/products/${productId}/reviews/${reviewId}`);
  },

  async markHelpful(productId: string, reviewId: string): Promise<ProductReview> {
    const response = await api.post<ProductReview>(`/products/${productId}/reviews/${reviewId}/helpful`);
    return response.data;
  },
};
