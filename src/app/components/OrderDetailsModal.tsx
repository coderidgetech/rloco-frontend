import { motion, AnimatePresence } from 'motion/react';
import { X, Package, Truck, Check, Clock, MapPin, Phone, Mail, Star, MessageCircle, Send, AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { LuxuryInput } from './ui/luxury-input';
import { LuxuryTextarea } from './ui/luxury-textarea';
import { LuxurySelect } from './ui/luxury-select';

interface OrderProduct {
  id: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled';
  total: number;
  items: number;
  image: string;
  products?: OrderProduct[];
  trackingNumber?: string;
  estimatedDelivery?: string;
  subtotal?: number;
  shipping?: number;
  tax?: number;
}

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  if (!isOpen || !order) return null;

  const [view, setView] = useState<'details' | 'track' | 'support'>('details');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportSubject, setSupportSubject] = useState('');

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-500/10 border-green-500/20';
      case 'shipped':
        return 'text-blue-600 bg-blue-500/10 border-blue-500/20';
      case 'processing':
        return 'text-orange-600 bg-orange-500/10 border-orange-500/20';
      case 'cancelled':
        return 'text-red-600 bg-red-500/10 border-red-500/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { id: 1, label: 'Order Placed', icon: Package, completed: true },
      { id: 2, label: 'Processing', icon: Clock, completed: order.status !== 'cancelled' },
      { id: 3, label: 'Shipped', icon: Truck, completed: order.status === 'shipped' || order.status === 'delivered' },
      { id: 4, label: 'Delivered', icon: Check, completed: order.status === 'delivered' },
    ];
    return steps;
  };

  const handleReviewSubmit = () => {
    if (review.trim() === '' || rating === 0) {
      toast.error('Please provide both a rating and a review.');
      return;
    }
    toast.success('Review submitted successfully! Thank you for your feedback.');
    setReview('');
    setRating(0);
  };

  const handleSupportSubmit = () => {
    if (supportMessage.trim() === '' || supportSubject.trim() === '') {
      toast.error('Please fill in both subject and message.');
      return;
    }
    toast.success('Support request submitted! Our team will get back to you within 24 hours.');
    setSupportMessage('');
    setSupportSubject('');
    setView('details');
  };

  // Mock tracking updates
  const trackingUpdates = [
    {
      date: '2026-01-10',
      time: '10:30 AM',
      location: 'New York, NY',
      status: 'Delivered',
      description: 'Package delivered to recipient',
      completed: order.status === 'delivered'
    },
    {
      date: '2026-01-09',
      time: '03:15 PM',
      location: 'Newark, NJ',
      status: 'Out for Delivery',
      description: 'Package is out for delivery',
      completed: order.status === 'delivered' || order.status === 'shipped'
    },
    {
      date: '2026-01-08',
      time: '08:20 AM',
      location: 'Philadelphia, PA',
      status: 'In Transit',
      description: 'Package arrived at sorting facility',
      completed: order.status === 'delivered' || order.status === 'shipped'
    },
    {
      date: '2026-01-07',
      time: '02:45 PM',
      location: 'Los Angeles, CA',
      status: 'Picked Up',
      description: 'Package picked up by carrier',
      completed: true
    }
  ];

  const handleClose = () => {
    setView('details');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(60px)',
          WebkitBackdropFilter: 'blur(60px)',
        }}
        className="fixed inset-0 z-[60]"
        onClick={handleClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full md:w-[600px] lg:w-[700px] bg-background z-[61] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border z-10">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              {view !== 'details' && (
                <button
                  onClick={() => setView('details')}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <div>
                <h2 className="text-2xl">
                  {view === 'details' && 'Order Details'}
                  {view === 'track' && 'Track Order'}
                  {view === 'support' && 'Contact Support'}
                </h2>
                <p className="text-sm text-muted-foreground font-mono">#{order.id}</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-3 hover:bg-muted rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {view === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-6 space-y-6"
            >
              {/* Order Status */}
              <div className={`border rounded-xl p-6 ${getStatusColor(order.status)}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium mb-1">Order Status</h3>
                    <p className="text-sm opacity-80 capitalize">{order.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm opacity-80 mb-1">Order Date</p>
                    <p className="font-medium">
                      {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                {/* Order Timeline */}
                <div className="relative">
                  <div className="flex justify-between">
                    {getStatusSteps().map((step, index) => {
                      const Icon = step.icon;
                      return (
                        <div key={step.id} className="flex flex-col items-center relative z-10">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${
                            step.completed 
                              ? 'bg-current/20 text-current' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            <Icon size={20} />
                          </div>
                          <p className="text-xs text-center max-w-[70px]">{step.label}</p>
                          {index < getStatusSteps().length - 1 && (
                            <div className={`absolute top-6 left-[50%] w-full h-0.5 ${
                              step.completed && getStatusSteps()[index + 1].completed
                                ? 'bg-current/30'
                                : 'bg-muted'
                            }`} style={{ marginLeft: '24px' }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Tracking Information */}
              {order.trackingNumber && (
                <div className="bg-muted/30 rounded-xl p-6">
                  <h3 className="font-medium mb-4">Shipping Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tracking Number</span>
                      <span className="font-mono text-sm font-medium">{order.trackingNumber}</span>
                    </div>
                    {order.estimatedDelivery && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Estimated Delivery</span>
                        <span className="text-sm font-medium">
                          {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Shipping Address */}
              <div className="bg-muted/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Shipping Address</h3>
                    <p className="text-sm text-muted-foreground">John Doe</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground space-y-1 pl-15">
                  <p>123 Fashion Street, Apt 4B</p>
                  <p>New York, NY 10001</p>
                  <p>United States</p>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Phone size={16} />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      <span>john.doe@example.com</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-muted/30 rounded-xl p-6">
                <h3 className="font-medium mb-4">Order Items ({order.items})</h3>
                <div className="space-y-4">
                  {order.products?.map((product) => (
                    <div key={product.id} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium mb-1 truncate">{product.name}</h4>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-2">
                          <span>Size: {product.size}</span>
                          <span>Color: {product.color}</span>
                          <span>Qty: {product.quantity}</span>
                        </div>
                        <p className="font-medium text-primary">${product.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-muted/30 rounded-xl p-6">
                <h3 className="font-medium mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${order.subtotal?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">${order.shipping?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">${order.tax?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Total</span>
                      <span className="text-xl font-medium text-primary">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-3 bg-foreground text-background rounded-lg font-medium flex items-center justify-center gap-2"
                  onClick={() => setView('track')}
                >
                  <Truck size={18} />
                  Track Order
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-3 border border-border rounded-lg font-medium flex items-center justify-center gap-2"
                  onClick={() => setView('support')}
                >
                  <MessageCircle size={18} />
                  Contact Support
                </motion.button>
              </div>

              {/* Review Section - Only show for delivered orders */}
              {order.status === 'delivered' && (
                <div className="bg-muted/30 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                      <Star size={24} className="text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="font-medium">Leave a Review</h3>
                      <p className="text-sm text-muted-foreground">Share your experience with this order</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Star Rating */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Rating</label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <motion.button
                            key={star}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(0)}
                            className="transition-all cursor-pointer"
                          >
                            <Star
                              size={28}
                              className={`${
                                star <= (hoveredStar || rating)
                                  ? 'fill-yellow-500 text-yellow-500'
                                  : 'text-foreground/20'
                              } transition-colors`}
                            />
                          </motion.button>
                        ))}
                        {rating > 0 && (
                          <span className="ml-2 text-sm text-muted-foreground">
                            {rating} out of 5 stars
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Review Text */}
                    <LuxuryTextarea
                      label="Your review"
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      className="h-32"
                      placeholder="Tell us about your experience with this product..."
                    />

                    {/* Submit Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2"
                      onClick={handleReviewSubmit}
                    >
                      <Send size={18} />
                      Submit Review
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {view === 'track' && (
            <motion.div
              key="track"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-6"
            >
              {/* Tracking Header */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <Package size={32} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">
                      {order.status === 'delivered' ? 'Package Delivered!' : 'Your Package is on the Way'}
                    </h3>
                    <p className="text-sm text-muted-foreground">Tracking #{order.trackingNumber}</p>
                  </div>
                </div>

                {order.estimatedDelivery && order.status !== 'delivered' && (
                  <div className="bg-background/50 rounded-lg p-4 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Estimated Delivery</span>
                      <span className="font-medium">
                        {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Tracking Timeline */}
              <div className="bg-muted/30 rounded-xl p-6">
                <h3 className="font-medium mb-6">Tracking Updates</h3>
                <div className="space-y-6">
                  {trackingUpdates.map((update, index) => (
                    <div key={index} className="relative">
                      <div className="flex gap-4">
                        {/* Timeline dot */}
                        <div className="relative flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            update.completed
                              ? 'bg-green-500/20 text-green-600'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {update.completed ? <CheckCircle size={20} /> : <Clock size={20} />}
                          </div>
                          {index < trackingUpdates.length - 1 && (
                            <div className={`w-0.5 h-12 mt-2 ${
                              update.completed ? 'bg-green-500/30' : 'bg-muted'
                            }`} />
                          )}
                        </div>

                        {/* Update details */}
                        <div className="flex-1 pb-8">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className={`font-medium ${update.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {update.status}
                            </h4>
                            <span className="text-xs text-muted-foreground">{update.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{update.description}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin size={12} />
                            {update.location} • {update.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Help Card */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-600 mb-1">Need Help?</h4>
                    <p className="text-sm text-blue-600/80 mb-3">
                      If you have any questions about your delivery, our support team is here to help.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                      onClick={() => setView('support')}
                    >
                      Contact Support
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'support' && (
            <motion.div
              key="support"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-6"
            >
              {/* Support Header */}
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <MessageCircle size={32} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium mb-1">How Can We Help?</h3>
                    <p className="text-sm text-muted-foreground">
                      Our support team typically responds within 24 hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-muted/30 rounded-xl p-6">
                <h3 className="font-medium mb-4">Send Us a Message</h3>
                <div className="space-y-4">
                  {/* Order Reference */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-muted-foreground">
                      Order Reference
                    </label>
                    <input
                      type="text"
                      value={`#${order.id}`}
                      disabled
                      className="w-full p-3 border border-border rounded-lg bg-muted/50 text-muted-foreground font-mono"
                    />
                  </div>

                  <LuxurySelect
                    label="Subject"
                    value={supportSubject}
                    onChange={(e) => setSupportSubject(e.target.value)}
                  >
                    <option value="">Select a topic...</option>
                    <option value="delivery">Delivery Issue</option>
                    <option value="product">Product Question</option>
                    <option value="return">Return/Exchange</option>
                    <option value="payment">Payment Issue</option>
                    <option value="other">Other</option>
                  </LuxurySelect>

                  <LuxuryTextarea
                    label="Message"
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    className="h-40"
                    placeholder="Please describe your issue in detail..."
                  />

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium flex items-center justify-center gap-2"
                    onClick={handleSupportSubmit}
                  >
                    <Send size={18} />
                    Send Message
                  </motion.button>
                </div>
              </div>

              {/* Quick Help */}
              <div className="bg-muted/30 rounded-xl p-6">
                <h3 className="font-medium mb-4">Quick Help</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <Phone size={20} className="text-primary" />
                    <div>
                      <p className="font-medium text-sm">Call Us</p>
                      <p className="text-xs text-muted-foreground">1-800-FASHION (24/7)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <Mail size={20} className="text-primary" />
                    <div>
                      <p className="font-medium text-sm">Email Support</p>
                      <p className="text-xs text-muted-foreground">support@rloco.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <MessageCircle size={20} className="text-primary" />
                    <div>
                      <p className="font-medium text-sm">Live Chat</p>
                      <p className="text-xs text-muted-foreground">Available 9 AM - 9 PM EST</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
