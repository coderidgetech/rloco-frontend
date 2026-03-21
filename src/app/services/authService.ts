import api from '../lib/api';
import { LoginRequest, RegisterRequest, AuthResponse, User, OtpSendResponse } from '../types/api';

export const authService = {
  async sendRegistrationOtp(phone: string): Promise<OtpSendResponse> {
    const response = await api.post<OtpSendResponse>('/auth/register-otp/send', { phone });
    return response.data;
  },

  /** Login OTP: SMS via Twilio Verify for existing customers with phone on file. */
  async sendLoginOtp(phone: string): Promise<OtpSendResponse> {
    const response = await api.post<OtpSendResponse>('/auth/login-otp/send', { phone });
    return response.data;
  },

  async completeLoginOtp(phone: string, code: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login-otp/complete', { phone, code });
    return response.data;
  },

  async completeRegistrationOtp(payload: {
    phone: string;
    code: string;
    email: string;
    password: string;
    name: string;
  }): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register-otp/complete', {
      phone: payload.phone,
      code: payload.code,
      email: payload.email,
      password: payload.password,
      name: payload.name,
    });
    return response.data;
  },

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

  async updateProfile(data: {
    name?: string;
    email?: string;
    phone?: string;
    birthday?: string;
  }): Promise<{ message: string }> {
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
