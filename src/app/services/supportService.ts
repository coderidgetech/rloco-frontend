import api from '../lib/api';
import { PaginatedResponse } from '../types/api';

export interface SupportTicket {
  id: string;
  user_id: string;
  order_id?: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  messages: TicketMessage[];
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

export interface TicketMessage {
  id: string;
  user_id: string;
  is_admin: boolean;
  message: string;
  attachments?: string[];
  created_at: string;
}

export const supportService = {
  async listTickets(params?: { limit?: number; skip?: number }): Promise<PaginatedResponse<SupportTicket>> {
    const response = await api.get<PaginatedResponse<SupportTicket>>('/support/tickets', { params });
    return response.data;
  },

  async getTicket(id: string): Promise<SupportTicket> {
    const response = await api.get<SupportTicket>(`/support/tickets/${id}`);
    return response.data;
  },

  async createTicket(ticket: {
    order_id?: string;
    subject: string;
    category: string;
    priority: string;
    message: string;
  }): Promise<SupportTicket> {
    const response = await api.post<SupportTicket>('/support/tickets', ticket);
    return response.data;
  },

  async addMessage(ticketId: string, message: string, attachments?: string[]): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(`/support/tickets/${ticketId}/messages`, {
      message,
      attachments,
    });
    return response.data;
  },
};
