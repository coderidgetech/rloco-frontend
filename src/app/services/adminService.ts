import api from '../lib/api';
import { User, Product, Order, Category, Promotion, Return, ShippingMethod, TaxRate } from '../types/api';
import { PaginatedResponse } from '../types/api';

/** Response from POST /admin/vendors — vendor row plus portal login outcome. */
export type VendorCreateResponse = {
  vendor: Record<string, unknown>;
  temporary_password?: string;
  credentials_email_sent: boolean;
  /** Present when the server attempted to email credentials but delivery failed. */
  credentials_email_error?: string;
  login_url: string;
};

/** Backend GET /admin/vendors returns Vendor documents, not User — map for admin UI. */
function mapVendorApiToUser(v: Record<string, unknown>): User {
  const id = String(v.id ?? '');
  const status = String(v.status ?? 'pending');
  const perms = v.permissions as Record<string, unknown> | undefined;
  const tier = typeof perms?.tier === 'string' ? perms.tier : undefined;
  return {
    id,
    email: String(v.email ?? ''),
    name: String(v.name ?? ''),
    role: 'vendor',
    vendor_id: id,
    avatar: typeof v.logo === 'string' ? v.logo : undefined,
    active: status === 'active',
    created_at:
      typeof v.created_at === 'string' ? v.created_at : new Date().toISOString(),
    updated_at:
      typeof v.updated_at === 'string' ? v.updated_at : new Date().toISOString(),
    phone: typeof v.phone === 'string' ? v.phone : undefined,
    ...(tier ? { tier } : {}),
  } as User & { tier?: string };
}

export const adminService = {
  // Dashboard
  async getDashboardStats(): Promise<any> {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  async getDashboardSales(params?: { start_date?: string; end_date?: string }): Promise<any> {
    const response = await api.get('/admin/dashboard/sales', { params });
    return response.data;
  },

  async getDashboardOrders(params?: { limit?: number; skip?: number }): Promise<PaginatedResponse<Order>> {
    const response = await api.get<PaginatedResponse<Order>>('/admin/dashboard/orders', { params });
    return response.data;
  },

  async getDashboardProducts(params?: { limit?: number; skip?: number }): Promise<PaginatedResponse<Product>> {
    const response = await api.get<PaginatedResponse<Product>>('/admin/dashboard/products', { params });
    return response.data;
  },

  // Customers
  async listCustomers(params?: { limit?: number; skip?: number }): Promise<PaginatedResponse<User>> {
    const response = await api.get<PaginatedResponse<User>>('/admin/customers', { params });
    return response.data;
  },

  async getCustomer(id: string): Promise<User> {
    const response = await api.get<User>(`/admin/customers/${id}`);
    return response.data;
  },

  async updateCustomer(id: string, customer: Partial<User>): Promise<User> {
    const response = await api.put<User>(`/admin/customers/${id}`, customer);
    return response.data;
  },

  // Vendors
  async listVendors(params?: { limit?: number; skip?: number }): Promise<User[]> {
    const response = await api.get<{ vendors: Record<string, unknown>[]; total: number }>('/admin/vendors', {
      params: { limit: 100, skip: 0, ...params },
    });
    const rows = response.data.vendors ?? [];
    return rows.map(mapVendorApiToUser);
  },

  async getVendor(id: string): Promise<User> {
    const response = await api.get<Record<string, unknown>>(`/admin/vendors/${id}`);
    return mapVendorApiToUser(response.data);
  },

  async createVendor(
    vendor: Partial<User> & { initial_password?: string; metadata?: Record<string, unknown> }
  ): Promise<VendorCreateResponse> {
    const response = await api.post<VendorCreateResponse>('/admin/vendors', vendor);
    return response.data;
  },

  async updateVendor(id: string, vendor: Partial<User>): Promise<void> {
    await api.put(`/admin/vendors/${id}`, vendor);
  },

  async deleteVendor(id: string): Promise<void> {
    await api.delete(`/admin/vendors/${id}`);
  },

  async updateVendorPermissions(id: string, permissions: Record<string, unknown>): Promise<void> {
    await api.put(`/admin/vendors/${id}/permissions`, { permissions });
  },

  // Promotions
  async listPromotions(): Promise<Promotion[]> {
    const response = await api.get<Promotion[]>('/admin/promotions');
    return response.data;
  },

  async createPromotion(promotion: Partial<Promotion>): Promise<Promotion> {
    const response = await api.post<Promotion>('/admin/promotions', promotion);
    return response.data;
  },

  async updatePromotion(id: string, promotion: Partial<Promotion>): Promise<Promotion> {
    const response = await api.put<Promotion>(`/admin/promotions/${id}`, promotion);
    return response.data;
  },

  async deletePromotion(id: string): Promise<void> {
    await api.delete(`/admin/promotions/${id}`);
  },

  // Analytics
  async getRevenueAnalytics(params?: { start_date?: string; end_date?: string }): Promise<any> {
    const response = await api.get('/admin/analytics/revenue', { params });
    return response.data;
  },

  async getOrderAnalytics(params?: { start_date?: string; end_date?: string }): Promise<any> {
    const response = await api.get('/admin/analytics/orders', { params });
    return response.data;
  },

  async getProductAnalytics(params?: { start_date?: string; end_date?: string }): Promise<any> {
    const response = await api.get('/admin/analytics/products', { params });
    return response.data;
  },

  async getCustomerAnalytics(params?: { start_date?: string; end_date?: string }): Promise<any> {
    const response = await api.get('/admin/analytics/customers', { params });
    return response.data;
  },

  async getTrafficAnalytics(params?: { start_date?: string; end_date?: string }): Promise<any> {
    const response = await api.get('/admin/analytics/traffic', { params });
    return response.data;
  },

  // Content
  async getContent(): Promise<any> {
    const response = await api.get('/admin/content');
    return response.data;
  },

  async updateContent(content: Record<string, any>): Promise<any> {
    const response = await api.put('/admin/content', content);
    return response.data;
  },

  // Settings
  async getSettings(): Promise<any> {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  async updateSettings(settings: Record<string, any>): Promise<any> {
    const response = await api.put('/admin/settings', settings);
    return response.data;
  },

  // Configuration
  async getConfiguration(): Promise<any> {
    const response = await api.get('/admin/configuration');
    return response.data;
  },

  async updateConfiguration(config: Record<string, any>): Promise<any> {
    const response = await api.put('/admin/configuration', config);
    return response.data;
  },

  // Reviews Admin
  async listAllReviews(params?: { limit?: number; skip?: number; status?: string }): Promise<PaginatedResponse<any>> {
    const response = await api.get<PaginatedResponse<any>>('/admin/reviews', { params });
    return response.data;
  },

  async updateReviewStatus(reviewId: string, status: string): Promise<any> {
    const response = await api.put(`/admin/reviews/${reviewId}/status`, { status });
    return response.data;
  },

  // Returns Admin
  async listAllReturns(params?: { limit?: number; skip?: number; status?: string }): Promise<PaginatedResponse<Return>> {
    const response = await api.get<PaginatedResponse<Return>>('/admin/returns', { params });
    return response.data;
  },

  async updateReturnStatus(returnId: string, status: string): Promise<Return> {
    const response = await api.put<Return>(`/admin/returns/${returnId}/status`, { status });
    return response.data;
  },

  async processRefund(returnId: string, refundMethod: string): Promise<Return> {
    const response = await api.put<Return>(`/admin/returns/${returnId}/process-refund`, { refund_method: refundMethod });
    return response.data;
  },

  // Shipping Admin
  async createShippingMethod(method: Partial<ShippingMethod>): Promise<ShippingMethod> {
    const response = await api.post<ShippingMethod>('/admin/shipping/methods', method);
    return response.data;
  },

  async updateShippingMethod(id: string, method: Partial<ShippingMethod>): Promise<ShippingMethod> {
    const response = await api.put<ShippingMethod>(`/admin/shipping/methods/${id}`, method);
    return response.data;
  },

  async deleteShippingMethod(id: string): Promise<void> {
    await api.delete(`/admin/shipping/methods/${id}`);
  },

  // Tax Admin
  async createTaxRate(rate: Partial<TaxRate>): Promise<TaxRate> {
    const response = await api.post<TaxRate>('/admin/tax/rates', rate);
    return response.data;
  },

  async updateTaxRate(id: string, rate: Partial<TaxRate>): Promise<TaxRate> {
    const response = await api.put<TaxRate>(`/admin/tax/rates/${id}`, rate);
    return response.data;
  },

  async deleteTaxRate(id: string): Promise<void> {
    await api.delete(`/admin/tax/rates/${id}`);
  },

  // Inventory
  async getLowStock(threshold?: number): Promise<any[]> {
    const response = await api.get('/admin/inventory/low-stock', { params: { threshold } });
    return response.data;
  },

  async getStockAlerts(): Promise<any[]> {
    const response = await api.get('/admin/inventory/alerts');
    return response.data;
  },

  // Support
  async listSupportTickets(params?: { limit?: number; skip?: number; status?: string }): Promise<PaginatedResponse<any>> {
    const response = await api.get<PaginatedResponse<any>>('/admin/support/tickets', { params });
    return response.data;
  },

  async updateTicketStatus(ticketId: string, status: string): Promise<any> {
    const response = await api.put(`/admin/support/tickets/${ticketId}/status`, { status });
    return response.data;
  },

  async assignTicket(ticketId: string, assignedTo: string): Promise<any> {
    const response = await api.put(`/admin/support/tickets/${ticketId}/assign`, { assigned_to: assignedTo });
    return response.data;
  },
};
