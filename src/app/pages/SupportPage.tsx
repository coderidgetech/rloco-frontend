import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Plus, Send, Paperclip, Clock, CheckCircle2, XCircle, AlertCircle, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useUser } from '../context/UserContext';
import { supportService, SupportTicket, TicketMessage } from '../services/supportService';
import { orderService } from '../services/orderService';
import { Order } from '../types/api';
import { Footer } from '../components/Footer';

export function SupportPage() {
  const { user } = useUser();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  // New ticket form
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    message: '',
    order_id: '',
  });

  // New message
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetchTickets();
      fetchOrders();
    }
  }, [user]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await supportService.listTickets({ limit: 50 });
      setTickets(response.data || []);
    } catch (error: any) {
      console.error('Failed to fetch tickets:', error);
      toast.error('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await orderService.list({ limit: 20 });
      setUserOrders(response.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchTicketDetails = async (ticketId: string) => {
    try {
      const ticket = await supportService.getTicket(ticketId);
      setSelectedTicket(ticket);
    } catch (error: any) {
      console.error('Failed to fetch ticket details:', error);
      toast.error('Failed to load ticket details');
    }
  };

  const handleCreateTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setSending(true);
      await supportService.createTicket({
        order_id: newTicket.order_id || undefined,
        subject: newTicket.subject,
        category: newTicket.category,
        priority: newTicket.priority,
        message: newTicket.message,
      });
      toast.success('Support ticket created successfully');
      setShowNewTicket(false);
      setNewTicket({
        subject: '',
        category: 'general',
        priority: 'medium',
        message: '',
        order_id: '',
      });
      fetchTickets();
    } catch (error: any) {
      console.error('Failed to create ticket:', error);
      toast.error(error.message || 'Failed to create support ticket');
    } finally {
      setSending(false);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedTicket || !newMessage.trim()) {
      return;
    }

    try {
      setSending(true);
      await supportService.addMessage(selectedTicket.id, newMessage);
      toast.success('Message sent');
      setNewMessage('');
      // Refresh ticket to get updated messages
      await fetchTicketDetails(selectedTicket.id);
    } catch (error: any) {
      console.error('Failed to send message:', error);
      toast.error(error.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'closed':
        return <XCircle className="h-4 w-4 text-gray-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      ticket.subject.toLowerCase().includes(query) ||
      ticket.category.toLowerCase().includes(query) ||
      ticket.id.toLowerCase().includes(query)
    );
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background pt-[72px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to access support</h2>
          <p className="text-foreground/60">You need to be logged in to view and create support tickets.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-[72px]">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Customer Support</h1>
          <p className="text-foreground/60">Get help with your orders, returns, and account</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Ticket List */}
          <div className="lg:col-span-1">
            <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Support Tickets</h2>
                <button
                  onClick={() => setShowNewTicket(true)}
                  className="px-3 py-1.5 bg-foreground text-background hover:bg-foreground/90 transition-colors text-sm uppercase tracking-wider flex items-center gap-2"
                >
                  <Plus size={16} />
                  New Ticket
                </button>
              </div>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tickets..."
                  className="w-full pl-10 pr-4 py-2 bg-background border border-foreground/20 text-sm focus:border-foreground focus:outline-none"
                />
              </div>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="text-center py-8 text-foreground/60">Loading tickets...</div>
                ) : filteredTickets.length === 0 ? (
                  <div className="text-center py-8 text-foreground/60">No tickets found</div>
                ) : (
                  filteredTickets.map((ticket) => (
                    <button
                      key={ticket.id}
                      onClick={() => {
                        setSelectedTicket(ticket);
                        fetchTicketDetails(ticket.id);
                      }}
                      className={`w-full text-left p-3 border rounded-lg transition-colors ${
                        selectedTicket?.id === ticket.id
                          ? 'border-foreground bg-foreground/5'
                          : 'border-foreground/10 hover:border-foreground/20'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-sm truncate flex-1">{ticket.subject}</p>
                        {getStatusIcon(ticket.status)}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 text-xs rounded ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <p className="text-xs text-foreground/50">
                        {new Date(ticket.created_at).toLocaleDateString()}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right: Ticket Details */}
          <div className="lg:col-span-2">
            {selectedTicket ? (
              <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{selectedTicket.subject}</h2>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 text-sm rounded ${getStatusColor(selectedTicket.status)}`}>
                        {selectedTicket.status}
                      </span>
                      <span className={`px-3 py-1 text-sm rounded ${getPriorityColor(selectedTicket.priority)}`}>
                        {selectedTicket.priority}
                      </span>
                      <span className="text-sm text-foreground/60">
                        {selectedTicket.category}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
                  {selectedTicket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg ${
                        message.is_admin
                          ? 'bg-blue-500/10 border border-blue-500/20'
                          : 'bg-foreground/5 border border-foreground/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">
                          {message.is_admin ? 'Support Team' : 'You'}
                        </span>
                        <span className="text-xs text-foreground/50">
                          {new Date(message.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80 whitespace-pre-wrap">{message.message}</p>
                    </div>
                  ))}
                </div>

                {/* Send Message */}
                <div className="border-t border-foreground/10 pt-4">
                  <div className="flex gap-2">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      rows={3}
                      className="flex-1 px-4 py-2 bg-background border border-foreground/20 text-sm focus:border-foreground focus:outline-none resize-none"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sending}
                      className="px-6 py-2 bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <Send size={16} />
                      Send
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-foreground/5 border border-foreground/10 rounded-lg p-12 text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-foreground/20" />
                <h3 className="text-xl font-semibold mb-2">Select a ticket to view details</h3>
                <p className="text-foreground/60">Choose a ticket from the list or create a new one</p>
              </div>
            )}
          </div>
        </div>

        {/* New Ticket Modal */}
        <AnimatePresence>
          {showNewTicket && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowNewTicket(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-background border border-foreground/10 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <h2 className="text-2xl font-bold mb-6">Create New Support Ticket</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject *</label>
                    <input
                      type="text"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                      placeholder="Brief description of your issue"
                      className="w-full px-4 py-2 bg-background border border-foreground/20 focus:border-foreground focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select
                        value={newTicket.category}
                        onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                        className="w-full px-4 py-2 bg-background border border-foreground/20 focus:border-foreground focus:outline-none"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="order">Order Issue</option>
                        <option value="return">Return/Refund</option>
                        <option value="shipping">Shipping</option>
                        <option value="payment">Payment</option>
                        <option value="account">Account</option>
                        <option value="product">Product Question</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Priority</label>
                      <select
                        value={newTicket.priority}
                        onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                        className="w-full px-4 py-2 bg-background border border-foreground/20 focus:border-foreground focus:outline-none"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  {userOrders.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Related Order (Optional)</label>
                      <select
                        value={newTicket.order_id}
                        onChange={(e) => setNewTicket({ ...newTicket, order_id: e.target.value })}
                        className="w-full px-4 py-2 bg-background border border-foreground/20 focus:border-foreground focus:outline-none"
                      >
                        <option value="">Select an order</option>
                        {userOrders.map((order) => (
                          <option key={order.id} value={order.id}>
                            Order #{order.order_number} - {new Date(order.created_at).toLocaleDateString()}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-2">Message *</label>
                    <textarea
                      value={newTicket.message}
                      onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                      placeholder="Describe your issue in detail..."
                      rows={6}
                      className="w-full px-4 py-2 bg-background border border-foreground/20 focus:border-foreground focus:outline-none resize-none"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleCreateTicket}
                      disabled={sending || !newTicket.subject.trim() || !newTicket.message.trim()}
                      className="flex-1 px-6 py-3 bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-50"
                    >
                      {sending ? 'Creating...' : 'Create Ticket'}
                    </button>
                    <button
                      onClick={() => setShowNewTicket(false)}
                      className="px-6 py-3 border border-foreground/20 hover:bg-foreground/5 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}
