import { motion } from 'motion/react';
import { Check, Package, Truck, MapPin, CreditCard, Mail, Phone, Calendar, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { orderService } from '../services/orderService';
import { Order } from '../types/api';
import { useCurrency } from '../context/CurrencyContext';

interface OrderConfirmationPageProps {
  orderNumber?: string;
  email?: string;
  paymentMethod?: string;
  shippingInfo?: any;
  orderItems?: any[];
  subtotal?: number;
  shippingCost?: number;
  tax?: number;
}

export function OrderConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { formatAmount, convertPrice } = useCurrency();
  const [showContent, setShowContent] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  // Get order data from route state
  const state = location.state as OrderConfirmationPageProps;
  const orderNumber = state?.orderNumber || '';

  // Fetch order details if orderNumber is provided
  useEffect(() => {
    if (orderNumber) {
      fetchOrderDetails();
    } else {
      setShowContent(true);
    }
  }, [orderNumber]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const fetchedOrder = await orderService.getByOrderNumber(orderNumber);
      setOrder(fetchedOrder);
      setShowContent(true);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      // Fallback to state data if API fails
      setShowContent(true);
    } finally {
      setLoading(false);
    }
  };

  // Use order data from API if available, otherwise fallback to state
  const orderData = order ? {
    orderNumber: order.order_number || orderNumber,
    email: order.shipping_info?.email || state?.email || '',
    paymentMethod: order.payment_method || state?.paymentMethod || 'UPI',
    shippingInfo: order.shipping_info ? {
      firstName: order.shipping_info.first_name,
      lastName: order.shipping_info.last_name,
      address: order.shipping_info.address,
      city: order.shipping_info.city,
      state: order.shipping_info.state,
      zipCode: order.shipping_info.zip_code,
      phone: order.shipping_info.phone,
      country: order.shipping_info.country,
    } : state?.shippingInfo || {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      country: ''
    },
    orderItems: order.items || state?.orderItems || [],
    subtotal: order.subtotal || state?.subtotal || 0,
    shippingCost: order.shipping_cost || state?.shippingCost || 0,
    tax: order.tax || state?.tax || 0,
    total: order.total || state?.subtotal || 0,
    trackingNumber: order.tracking_number,
    status: order.status,
  } : {
    orderNumber: orderNumber || '',
    email: state?.email || '',
    paymentMethod: state?.paymentMethod || '',
    shippingInfo: state?.shippingInfo || {
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      country: ''
    },
    orderItems: state?.orderItems || [],
    subtotal: state?.subtotal || 0,
    shippingCost: state?.shippingCost || 0,
    tax: state?.tax || 0,
    total: state?.subtotal || 0,
    trackingNumber: undefined,
    status: 'pending' as const,
  };

  const fullName = `${orderData.shippingInfo.firstName} ${orderData.shippingInfo.lastName}`;

  const orderDate = order?.created_at ? new Date(order.created_at) : new Date();
  const estimatedDelivery = new Date(orderDate);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-6 bg-green-500/10 rounded-full flex items-center justify-center"
            >
              <Check size={40} className="text-green-600" strokeWidth={3} />
            </motion.div>
            <h1 className="text-4xl md:text-5xl mb-3">Order Confirmed!</h1>
            <p className="text-lg text-foreground/60">Thank you for your purchase</p>
          </motion.div>

          {/* Order Number & Date */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-foreground/5 border border-foreground/10 p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs uppercase tracking-wider text-foreground/50 mb-2">Order Number</p>
                <p className="text-lg font-medium">{orderData.orderNumber}</p>
                {orderData.trackingNumber && (
                  <p className="text-sm text-foreground/50 mt-1">Tracking: {orderData.trackingNumber}</p>
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-foreground/50 mb-2">Order Date</p>
                <p className="text-lg font-medium">{formatDate(orderDate)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-foreground/50 mb-2">Total Amount</p>
                <p className="text-lg font-medium">{formatAmount(orderData.total)}</p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Left Column - Order Items & Summary */}
            <div className="lg:col-span-2 space-y-8">
              {/* Order Items */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Package size={20} className="text-foreground/60" />
                  <h2 className="text-xl">Order Items</h2>
                </div>
                <div className="border border-foreground/10 divide-y divide-foreground/10">
                  {orderData.orderItems.map((item: any, index: number) => (
                    <motion.div
                      key={`${item.id}-${item.size}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                      className="p-4 flex gap-4"
                    >
                      <div className="w-20 h-20 bg-foreground/5 flex-shrink-0 overflow-hidden">
                        <ImageWithFallback 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{item.name || item.product_name}</h3>
                        <div className="text-sm text-foreground/60 space-y-0.5">
                          {item.size && <p>Size: {item.size}</p>}
                          <p>Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {formatAmount(convertPrice(item.price || 0, (item as any).priceINR) * item.quantity)}
                        </p>
                        <p className="text-sm text-foreground/60">
                          {formatAmount(convertPrice(item.price || 0, (item as any).priceINR))} each
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard size={20} className="text-foreground/60" />
                  <h2 className="text-xl">Payment Summary</h2>
                </div>
                <div className="border border-foreground/10 p-6 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Subtotal</span>
                    <span>{formatAmount(orderData.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Shipping</span>
                    <span className="text-green-600">{orderData.shippingCost === 0 ? 'FREE' : formatAmount(orderData.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Tax (18% GST)</span>
                    <span>{formatAmount(orderData.tax)}</span>
                  </div>
                  <div className="border-t border-foreground/10 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-lg">Total</span>
                      <span className="font-medium text-lg">{formatAmount(orderData.total)}</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-foreground/10">
                    <p className="text-sm text-foreground/60">Payment Method: <span className="font-medium text-foreground">{orderData.paymentMethod}</span></p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Delivery & Contact Info */}
            <div className="space-y-8">
              {/* Delivery Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Truck size={20} className="text-foreground/60" />
                  <h2 className="text-xl">Delivery</h2>
                </div>
                <div className="border border-foreground/10 p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar size={18} className="text-foreground/40 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-foreground/50 mb-1">Estimated Delivery</p>
                      <p className="font-medium">{formatDate(estimatedDelivery)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-foreground/40 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-foreground/50 mb-1">Shipping Address</p>
                      <p className="font-medium">{fullName}</p>
                      <p className="text-sm text-foreground/70 mt-1">{orderData.shippingInfo.address}</p>
                      <p className="text-sm text-foreground/70">{orderData.shippingInfo.city}, {orderData.shippingInfo.state} {orderData.shippingInfo.zipCode}</p>
                      <p className="text-sm text-foreground/70">{orderData.shippingInfo.country}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone size={18} className="text-foreground/40 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs uppercase tracking-wider text-foreground/50 mb-1">Contact Phone</p>
                      <p className="font-medium">{orderData.shippingInfo.phone}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Email Confirmation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Mail size={20} className="text-foreground/60" />
                  <h2 className="text-xl">Confirmation</h2>
                </div>
                <div className="border border-foreground/10 p-6">
                  <p className="text-sm text-foreground/70 mb-3">
                    A confirmation email has been sent to:
                  </p>
                  <p className="font-medium mb-4">{orderData.email}</p>
                  <p className="text-xs text-foreground/60">
                    You will receive shipping updates and tracking information at this email address.
                  </p>
                </div>
              </motion.div>

              {/* Order Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="bg-green-500/10 border border-green-500/20 p-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Check size={18} className="text-green-600" />
                  <p className="font-medium text-green-700">Order Confirmed</p>
                </div>
                <p className="text-sm text-foreground/70">
                  Your order is being processed and will be shipped within 1-2 business days.
                </p>
              </motion.div>
            </div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/account')}
              className="py-4 border border-foreground text-foreground uppercase tracking-widest text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
            >
              Track Order
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/')}
              className="py-4 bg-foreground text-background uppercase tracking-widest text-sm font-medium transition-colors hover:bg-foreground/90"
            >
              Continue Shopping
            </motion.button>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="text-center mt-12 pt-8 border-t border-foreground/10"
          >
            <p className="text-foreground/60 mb-3">Need help with your order?</p>
            <button
              onClick={() => navigate('/contact')}
              className="text-sm underline hover:no-underline"
            >
              Contact Customer Support
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}