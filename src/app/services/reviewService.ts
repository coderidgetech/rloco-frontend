import api from '../lib/api';
import { ProductReview, CreateReviewRequest } from '../types/api';

export interface MyReviewItem extends ProductReview {
  product_name?: string;
  product_image?: string;
}

export interface MyReviewsResponse {
  reviews: MyReviewItem[];
  total: number;
  limit: number;
  skip: number;
}

export const reviewService = {
  async getMyReviews(params?: { limit?: number; skip?: number }): Promise<MyReviewsResponse> {
    const response = await api.get<MyReviewsResponse>('/reviews/me', { params });
    return response.data;
  },

  async getByProduct(productId: string): Promise<ProductReview[]> {
    const response = await api.get<{ reviews: ProductReview[] }>(`/products/${productId}/reviews`);
    return Array.isArray(response.data.reviews) ? response.data.reviews : (response.data as unknown as ProductReview[]);
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
