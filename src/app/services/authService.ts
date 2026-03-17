import api from '../lib/api';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/api';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', { email, password } as LoginRequest);
    return response.data;
  },

  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', {
      email,
      password,
      name,
    } as RegisterRequest);
    return response.data;
  },

  async googleSignIn(idToken: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/google', { id_token: idToken });
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async getMe(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  async refresh(): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/refresh');
    return response.data;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/reset-password', { token, new_password: newPassword });
    return response.data;
  },

  async updateProfile(data: { phone?: string; birthday?: string }): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>('/auth/profile', data);
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const response = await api.put<{ message: string }>('/auth/password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  },

  async deactivateAccount(): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/auth/deactivate');
    return response.data;
  },

  async deleteAccount(): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>('/auth/me');
    return response.data;
  },
};
