import api from '../lib/api';
import { Product, PaginatedResponse, ProductReview, CreateReviewRequest } from '../types/api';

export const productService = {
  async list(params?: {
    limit?: number;
    skip?: number;
    category?: string;
    gender?: string;
    on_sale?: boolean;
    featured?: boolean;
    new_arrival?: boolean;
    gift?: boolean;
    search?: string;
    min_price?: number;
    max_price?: number;
    sort?: string;
  }): Promise<PaginatedResponse<Product>> {
    const response = await api.get<PaginatedResponse<Product>>('/products', { params });
    return response.data;
  },

  async getById(id: string): Promise<Product> {
    const trimmed = (id || '').trim();
    if (!/^[0-9a-fA-F]{24}$/.test(trimmed)) {
      return Promise.reject(new Error('Invalid product ID'));
    }
    const response = await api.get<Product>(`/products/${trimmed}`);
    return response.data;
  },

  async getFeatured(limit: number = 10): Promise<Product[]> {
    const response = await api.get<Product[]>('/products/featured', {
      params: { limit },
    });
    return response.data ?? [];
  },

  async getNewArrivals(limit: number = 10): Promise<Product[]> {
    const response = await api.get<Product[]>('/products/new-arrivals', {
      params: { limit },
    });
    return response.data ?? [];
  },

  async getOnSale(limit: number = 10): Promise<Product[]> {
    const response = await api.get<Product[]>('/products/on-sale', {
      params: { limit },
    });
    return response.data ?? [];
  },

  async create(product: Partial<Product>): Promise<Product> {
    const response = await api.post<Product>('/products', product);
    return response.data;
  },

  async update(id: string, product: Partial<Product>): Promise<Product> {
    const response = await api.put<Product>(`/products/${id}`, product);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  async uploadImages(id: string, images: File[]): Promise<Product> {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });
    const response = await api.post<Product>(`/products/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getReviews(productId: string): Promise<ProductReview[]> {
    const response = await api.get<ProductReview[]>(`/products/${productId}/reviews`);
    return Array.isArray(response.data) ? response.data : [];
  },

  async createReview(productId: string, review: CreateReviewRequest): Promise<ProductReview> {
    const response = await api.post<ProductReview>(`/products/${productId}/reviews`, review);
    return response.data;
  },

  async updateReview(productId: string, reviewId: string, review: Partial<CreateReviewRequest>): Promise<ProductReview> {
    const response = await api.put<ProductReview>(`/products/${productId}/reviews/${reviewId}`, review);
    return response.data;
  },

  async deleteReview(productId: string, reviewId: string): Promise<void> {
    await api.delete(`/products/${productId}/reviews/${reviewId}`);
  },

  async markReviewHelpful(productId: string, reviewId: string): Promise<ProductReview> {
    const response = await api.post<ProductReview>(`/products/${productId}/reviews/${reviewId}/helpful`);
    return response.data;
  },
};
