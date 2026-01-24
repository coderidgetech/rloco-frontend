import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Package, MapPin, Calendar, ChevronRight, Download, Home } from 'lucide-react';
import { BottomNavigation } from '@/app/components/mobile/BottomNavigation';
import { useEffect, useState } from 'react';
import { orderService } from '@/app/services/orderService';
import { Order } from '@/app/types/api';

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

export function MobileOrderConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Get order data from route state
  const state = location.state as OrderConfirmationPageProps;
  const orderNumber = state?.orderNumber || '';

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (orderNumber) {
      fetchOrderDetails();
    } else {
      setLoading(false);
    }
  }, [orderNumber]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const fetchedOrder = await orderService.getByOrderNumber(orderNumber);
      setOrder(fetchedOrder);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Use order data from API if available, otherwise fallback to state
  const orderData = order ? {
    id: order.order_number || orderNumber,
    date: new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    estimatedDelivery: order.tracking_number 
      ? new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
      : '',
    total: order.total,
    items: order.items?.length || 0,
    address: order.shipping_info ? {
      name: `${order.shipping_info.first_name} ${order.shipping_info.last_name}`,
      street: order.shipping_info.address,
      city: `${order.shipping_info.city}, ${order.shipping_info.state} ${order.shipping_info.zip_code}`,
    } : {
      name: 'Unknown',
      street: '',
      city: '',
    },
    payment: order.payment_method || 'Unknown',
  } : state ? {
    id: orderNumber || '#RL2024-00123',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
    total: state.subtotal || 0,
    items: state.orderItems?.length || 0,
    address: state.shippingInfo ? {
      name: `${state.shippingInfo.firstName} ${state.shippingInfo.lastName}`,
      street: state.shippingInfo.address,
      city: `${state.shippingInfo.city}, ${state.shippingInfo.state} ${state.shippingInfo.zipCode}`,
    } : {
      name: 'Unknown',
      street: '',
      city: '',
    },
    payment: state.paymentMethod || 'Unknown',
  } : {
    id: '#RL2024-00123',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
    total: 0,
    items: 0,
    address: {
      name: 'Unknown',
      street: '',
      city: '',
    },
    payment: 'Unknown',
  };

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Success Animation */}
      <div className="pt-12 pb-8 px-4 text-center" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 48px)' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 mx-auto mb-6 bg-green-50 rounded-full flex items-center justify-center"
        >
          <CheckCircle size={56} className="text-green-500" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-medium mb-2"
        >
          Order Confirmed!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-foreground/60 mb-2"
        >
          Thank you for shopping with Rloco
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm font-medium text-primary"
        >
          {loading ? 'Loading...' : `Order ${orderData.id}`}
        </motion.p>
      </div>

      {/* Order Summary Cards */}
      <div className="px-4 space-y-3">
        {/* Delivery Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-foreground/5 rounded-2xl p-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium">Estimated Delivery</h3>
              <p className="text-xs text-foreground/60 mt-0.5">{orderData.estimatedDelivery || 'TBD'}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 text-xs text-foreground/60">
            We'll send you shipping confirmation with tracking number
          </div>
        </motion.div>

        {/* Shipping Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-foreground/5 rounded-2xl p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
              <MapPin size={20} className="text-foreground/60" />
            </div>
            <h3 className="text-sm font-medium">Shipping Address</h3>
          </div>
          <div className="bg-white rounded-xl p-3">
            <p className="text-sm font-medium">{orderData.address.name}</p>
            <p className="text-sm text-foreground/60 mt-1">{orderData.address.street}</p>
            <p className="text-sm text-foreground/60">{orderData.address.city}</p>
          </div>
        </motion.div>

        {/* Order Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-foreground/5 rounded-2xl p-4"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
              <Package size={20} className="text-foreground/60" />
            </div>
            <h3 className="text-sm font-medium">Order Summary</h3>
          </div>
          <div className="bg-white rounded-xl p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Items ({orderData.items})</span>
              <span className="font-medium">${orderData.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Shipping</span>
              <span className="font-medium text-green-600">FREE</span>
            </div>
            <div className="pt-2 border-t border-border/30 flex justify-between">
              <span className="font-medium">Total Paid</span>
              <span className="font-semibold text-primary">${orderData.total.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-border/30 text-xs text-foreground/60">
              <span>Payment Method: {orderData.payment}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 mt-6 space-y-3">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/orders')}
          className="w-full bg-primary text-white py-4 rounded-full font-medium flex items-center justify-center gap-2"
        >
          <Package size={20} />
          Track Your Order
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          whileTap={{ scale: 0.98 }}
          className="w-full border-2 border-border py-4 rounded-full font-medium flex items-center justify-center gap-2"
        >
          <Download size={20} />
          Download Invoice
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/')}
          className="w-full border-2 border-border py-4 rounded-full font-medium flex items-center justify-center gap-2"
        >
          <Home size={20} />
          Continue Shopping
        </motion.button>
      </div>

      {/* Need Help */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="px-4 mt-8 mb-6"
      >
        <div className="bg-foreground/5 rounded-2xl p-4 text-center">
          <p className="text-sm text-foreground/60 mb-3">Need help with your order?</p>
          <button
            onClick={() => navigate('/contact')}
            className="text-sm text-primary font-medium flex items-center justify-center gap-1 mx-auto"
          >
            Contact Support
            <ChevronRight size={16} />
          </button>
        </div>
      </motion.div>

      <BottomNavigation />
    </div>
  );
}
