import api from '../lib/api';

export interface Address {
  id: string;
  user_id: string;
  name: string;
  type: 'HOME' | 'OFFICE' | 'OTHER';
  address_line: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  mobile: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export const addressService = {
  async list(): Promise<Address[]> {
    const response = await api.get<Address[]>('/addresses');
    return response.data;
  },

  async getById(id: string): Promise<Address> {
    const response = await api.get<Address>(`/addresses/${id}`);
    return response.data;
  },

  async create(address: Partial<Address>): Promise<Address> {
    const response = await api.post<Address>('/addresses', address);
    return response.data;
  },

  async update(id: string, address: Partial<Address>): Promise<Address> {
    const response = await api.put<Address>(`/addresses/${id}`, address);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/addresses/${id}`);
  },

  async setDefault(id: string): Promise<void> {
    await api.put(`/addresses/${id}/default`);
  },
};
