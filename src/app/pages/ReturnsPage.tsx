import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Package, RefreshCcw, Clock, CheckCircle2, Plus, X, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useUser } from '../context/UserContext';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import { returnService } from '../services/returnService';
import { orderService } from '../services/orderService';
import { Return, Order, CreateReturnRequest } from '../types/api';
import { PH } from '../lib/formPlaceholders';

export function ReturnsPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [returns, setReturns] = useState<Return[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateReturn, setShowCreateReturn] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [returnReason, setReturnReason] = useState('');
  const [returnDescription, setReturnDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const returnSteps = [
    {
      icon: Package,
      title: '1. Initiate Return',
      description: 'Log into your account and select the items you wish to return from your order history.',
    },
    {
      icon: RefreshCcw,
      title: '2. Pack Items',
      description: 'Carefully pack items in original packaging with all tags attached and accessories included.',
    },
    {
      icon: Clock,
      title: '3. Ship Back',
      description: 'Use our prepaid return label and drop off at any authorized shipping location.',
    },
    {
      icon: CheckCircle2,
      title: '4. Receive Refund',
      description: 'Once we receive your return, we\'ll process your refund within 5-7 business days.',
    },
  ];

  useEffect(() => {
    if (user) {
      fetchReturns();
      fetchOrders();
    }
  }, [user]);

  const fetchReturns = async () => {
    try {
      setLoading(true);
      const response = await returnService.list({ limit: 50 });
      setReturns((response as { returns?: Return[] }).returns || []);
    } catch (error: any) {
      console.error('Failed to fetch returns:', error);
      toast.error('Failed to load returns');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await orderService.list({ limit: 50 });
      setOrders(response.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const handleCreateReturn = async () => {
    if (!selectedOrder || selectedItems.size === 0 || !returnReason.trim()) {
      toast.error('Please select items and provide a reason');
      return;
    }

    try {
      setSubmitting(true);
      const returnItems = selectedOrder.items
        .filter((item, index) => selectedItems.has(index.toString()))
        .map(item => ({
          order_item_id: item.product_id, // Assuming this is the order item ID
          product_id: item.product_id,
          product_name: item.product_name,
          image: item.image,
          price: item.price,
          size: item.size,
          quantity: item.quantity,
        }));

      const returnRequest: CreateReturnRequest = {
        order_id: selectedOrder.id,
        items: returnItems,
        reason: returnReason,
        description: returnDescription,
      };

      await returnService.create(returnRequest);
      toast.success('Return request created successfully');
      setShowCreateReturn(false);
      setSelectedOrder(null);
      setSelectedItems(new Set());
      setReturnReason('');
      setReturnDescription('');
      fetchReturns();
    } catch (error: any) {
      console.error('Failed to create return:', error);
      toast.error(error.message || 'Failed to create return request');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'approved':
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const policies = [
    {
      title: 'Return Window',
      content: 'You have 30 days from the delivery date to initiate a return.',
    },
    {
      title: 'Condition',
      content: 'Items must be unworn, unwashed, and in original condition with all tags attached.',
    },
    {
      title: 'Final Sale Items',
      content: 'Items marked as final sale, personalized items, and intimate apparel cannot be returned.',
    },
    {
      title: 'Refund Method',
      content: 'Refunds will be issued to the original payment method used for the purchase.',
    },
    {
      title: 'International Returns',
      content: 'International customers are responsible for return shipping costs and customs fees.',
    },
    {
      title: 'Exchanges',
      content: 'We currently do not offer direct exchanges. Please return the item and place a new order.',
    },
  ];

  return (
    <div className="min-h-screen w-full min-w-0 bg-background pt-page-nav pb-mobile-nav">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 md:py-32 border-b border-foreground/10">
        <div className="page-section">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl mb-6">Returns & Refunds</h1>
            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
              We want you to love your purchase. If you're not completely satisfied, 
              we offer a hassle-free return policy within 30 days of delivery.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Return Process */}
      <section className="py-20 md:py-24 border-b border-foreground/10">
        <div className="page-section">
          <div className="max-w-6xl mx-auto w-full min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl mb-4">How to Return</h2>
              <p className="text-lg text-foreground/60">
                Follow these simple steps to process your return
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {returnSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#B4770E]/10 text-[#B4770E] mb-6">
                    <step.icon size={28} />
                  </div>
                  <h3 className="text-lg font-medium mb-3">{step.title}</h3>
                  <p className="text-foreground/60 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Return Policy */}
      <section className="py-20 md:py-24 border-b border-foreground/10">
        <div className="page-section">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl mb-4">Return Policy</h2>
              <p className="text-lg text-foreground/60">
                Important information about our return process
              </p>
            </motion.div>

            <div className="space-y-8">
              {policies.map((policy, index) => (
                <motion.div
                  key={policy.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="border-l-2 border-[#B4770E] pl-6 py-2"
                >
                  <h3 className="text-xl font-medium mb-2">{policy.title}</h3>
                  <p className="text-foreground/70 leading-relaxed">
                    {policy.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* My Returns Section - Only show if user is logged in */}
      {user && (
        <section className="py-20 md:py-24 border-b border-foreground/10">
          <div className="page-section">
            <div className="max-w-6xl mx-auto w-full min-w-0">
              <div className="flex items-center justify-between mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl md:text-4xl mb-2">My Returns</h2>
                  <p className="text-lg text-foreground/60">
                    Track and manage your return requests
                  </p>
                </motion.div>
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => {
                    if (orders.length === 0) {
                      toast.error('No orders available for return');
                      return;
                    }
                    setShowCreateReturn(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <Plus size={20} />
                  Request Return
                </Button>
              </div>

              {loading ? (
                <div className="text-center py-12 text-foreground/60">Loading returns...</div>
              ) : returns.length === 0 ? (
                <div className="text-center py-12 border border-foreground/10 rounded-lg">
                  <Package className="h-16 w-16 mx-auto mb-4 text-foreground/20" />
                  <h3 className="text-xl font-semibold mb-2">No Returns Yet</h3>
                  <p className="text-foreground/60 mb-6">
                    You haven't initiated any returns. Start a return from your order history.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (orders.length === 0) {
                        toast.error('No orders available for return');
                        return;
                      }
                      setShowCreateReturn(true);
                    }}
                  >
                    Create Return Request
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {returns.map((returnItem) => (
                    <motion.div
                      key={returnItem.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="border border-foreground/10 rounded-lg p-6 hover:border-foreground/20 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusIcon(returnItem.status)}
                            <h3 className="text-lg font-semibold">Return #{returnItem.id.slice(-8).toUpperCase()}</h3>
                            <span className={`px-3 py-1 text-xs rounded-full ${getStatusColor(returnItem.status)}`}>
                              {returnItem.status}
                            </span>
                          </div>
                          <p className="text-sm text-foreground/60">
                            Order: {returnItem.order_number} • Created: {new Date(returnItem.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">₹{returnItem.refund_amount.toLocaleString()}</p>
                          <p className="text-xs text-foreground/50">Refund Amount</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-foreground/50 mb-1">Reason</p>
                          <p className="text-sm">{returnItem.reason}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-foreground/50 mb-1">Refund Status</p>
                          <p className="text-sm capitalize">{returnItem.refund_status}</p>
                        </div>
                      </div>
                      {returnItem.tracking_number && (
                        <div className="mt-4 pt-4 border-t border-foreground/10">
                          <p className="text-xs uppercase tracking-wider text-foreground/50 mb-1">Tracking Number</p>
                          <p className="text-sm font-mono">{returnItem.tracking_number}</p>
                        </div>
                      )}
                      <div className="mt-4 pt-4 border-t border-foreground/10">
                        <p className="text-xs uppercase tracking-wider text-foreground/50 mb-2">Items</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {returnItem.items.map((item, idx) => (
                            <div key={idx} className="flex gap-3">
                              <img src={item.image} alt={item.product_name} className="w-16 h-16 object-cover rounded" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{item.product_name}</p>
                                <p className="text-xs text-foreground/60">Size: {item.size} × {item.quantity}</p>
                                <p className="text-xs text-foreground/60">₹{item.price.toLocaleString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 md:py-24">
        <div className="page-section">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl mb-6">Need Help?</h2>
              <p className="text-lg text-foreground/60 mb-8">
                Our customer service team is here to assist you with any questions about returns or refunds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="default"
                  size="lg"
                  onClick={() => navigate('/support')}
                >
                  Contact Support
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/shipping')}
                >
                  Shipping Information
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Create Return Modal */}
      <AnimatePresence>
        {showCreateReturn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateReturn(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background border border-foreground/10 rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Create Return Request</h2>
                <button
                  onClick={() => setShowCreateReturn(false)}
                  className="p-2 hover:bg-foreground/5 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {!selectedOrder ? (
                <div>
                  <label className="block text-sm font-medium mb-2">Select Order</label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {orders.map((order) => (
                      <button
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className="w-full text-left p-4 border border-foreground/10 hover:border-foreground/20 rounded-lg transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Order #{order.order_number}</p>
                            <p className="text-sm text-foreground/60">
                              {new Date(order.created_at).toLocaleDateString()} • {order.items.length} items • ₹{order.total.toLocaleString()}
                            </p>
                          </div>
                          <ChevronRight size={20} className="text-foreground/40" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-foreground/5 rounded-lg">
                    <div>
                      <p className="font-medium">Order #{selectedOrder.order_number}</p>
                      <p className="text-sm text-foreground/60">
                        {new Date(selectedOrder.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedOrder(null);
                        setSelectedItems(new Set());
                      }}
                      className="text-sm text-foreground/60 hover:text-foreground"
                    >
                      Change Order
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Select Items to Return</label>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {selectedOrder.items.map((item, index) => (
                        <label
                          key={index}
                          className="flex items-center gap-3 p-3 border border-foreground/10 hover:border-foreground/20 rounded-lg cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedItems.has(index.toString())}
                            onChange={(e) => {
                              const newSet = new Set(selectedItems);
                              if (e.target.checked) {
                                newSet.add(index.toString());
                              } else {
                                newSet.delete(index.toString());
                              }
                              setSelectedItems(newSet);
                            }}
                            className="w-4 h-4"
                          />
                          <img src={item.image} alt={item.product_name} className="w-16 h-16 object-cover rounded" />
                          <div className="flex-1">
                            <p className="font-medium">{item.product_name}</p>
                            <p className="text-sm text-foreground/60">Size: {item.size} × {item.quantity}</p>
                            <p className="text-sm font-medium">₹{item.price.toLocaleString()}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Reason for Return *</label>
                    <select
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      className="w-full px-4 py-2 bg-background border border-foreground/20 focus:border-foreground focus:outline-none"
                    >
                      <option value="">Select a reason</option>
                      <option value="defective">Defective/Damaged</option>
                      <option value="wrong_item">Wrong Item Received</option>
                      <option value="size">Wrong Size</option>
                      <option value="not_as_described">Not as Described</option>
                      <option value="changed_mind">Changed My Mind</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Additional Details</label>
                    <textarea
                      value={returnDescription}
                      onChange={(e) => setReturnDescription(e.target.value)}
                      placeholder={PH.notesOptional}
                      rows={4}
                      className="w-full px-4 py-2 bg-background border border-foreground/20 focus:border-foreground focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleCreateReturn}
                      disabled={submitting || selectedItems.size === 0 || !returnReason.trim()}
                      className="flex-1"
                    >
                      {submitting ? 'Submitting...' : 'Submit Return Request'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateReturn(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
