import api from '../lib/api';

export interface VendorApplicationPayload {
  business_name: string;
  business_type: string;
  gst_number?: string;
  website?: string;
  instagram?: string;
  contact_name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pin_code: string;
  country: string;
  category: string;
  product_description: string;
  price_range: string;
  estimated_listings: string;
  how_did_you_hear?: string;
  message?: string;
}

export interface VendorApplication extends VendorApplicationPayload {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface VendorApplicationListResponse {
  applications: VendorApplication[];
  total: number;
  limit: number;
  skip: number;
}

export const vendorApplicationService = {
  submit(data: VendorApplicationPayload) {
    return api.post<{ message: string }>('/vendor/apply', data);
  },

  list(params?: { status?: string; limit?: number; skip?: number }) {
    return api.get<VendorApplicationListResponse>('/admin/vendor-applications', { params });
  },

  getOne(id: string) {
    return api.get<VendorApplication>(`/admin/vendor-applications/${id}`);
  },

  approve(id: string, adminNotes?: string) {
    return api.post(`/admin/vendor-applications/${id}/approve`, { admin_notes: adminNotes ?? '' });
  },

  reject(id: string, reason?: string) {
    return api.post(`/admin/vendor-applications/${id}/reject`, { reason: reason ?? '' });
  },
};
