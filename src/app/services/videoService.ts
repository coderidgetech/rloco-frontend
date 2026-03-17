import api from '../lib/api';

export interface InspirationVideo {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url: string;
  category: string;
  featured?: boolean;
  created_at: string;
  uploaded_by?: string;
  uploaded_by_name?: string;
}

export interface VideoListResponse {
  videos: InspirationVideo[];
  total: number;
  limit: number;
  skip: number;
}

export const videoService = {
  async list(params?: {
    limit?: number;
    skip?: number;
    category?: string;
    featured?: boolean;
  }): Promise<VideoListResponse> {
    const response = await api.get<VideoListResponse>('/videos', { params });
    return response.data;
  },

  async getById(id: string): Promise<InspirationVideo> {
    const response = await api.get<InspirationVideo>(`/videos/${id}`);
    return response.data;
  },

  async getFeatured(limit: number = 10): Promise<InspirationVideo[]> {
    const response = await api.get<InspirationVideo[]>('/videos/featured', {
      params: { limit },
    });
    return response.data ?? [];
  },

  async create(video: Partial<InspirationVideo>): Promise<InspirationVideo> {
    const response = await api.post<InspirationVideo>('/admin/videos', video);
    return response.data;
  },

  async update(id: string, video: Partial<InspirationVideo>): Promise<InspirationVideo> {
    const response = await api.put<InspirationVideo>(`/admin/videos/${id}`, video);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/admin/videos/${id}`);
  },
};
