import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Package, MapPin, CreditCard, CheckCircle, Truck, Clock, Phone, Mail, Download } from 'lucide-react';
import { MobileSubPageHeader } from '@/app/components/mobile/MobileSubPageHeader';

interface OrderItem {
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
  orderNumber: string;
  date: string;
  status: 'delivered' | 'in-transit' | 'processing' | 'cancelled';
  estimatedDelivery: string;
  trackingNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
  };
  paymentMethod: {
    type: string;
    last4: string;
  };
}

// Mock data
const MOCK_ORDERS: Record<string, Order> = {
  '1': {
    id: '1',
    orderNumber: 'ORD-2024-001',
    date: 'Jan 20, 2024',
    status: 'in-transit',
    estimatedDelivery: 'Jan 25, 2024',
    trackingNumber: 'TRK123456789',
    items: [
      {
        id: '1',
        name: 'Classic Leather Jacket',
        size: 'M',
        color: 'Black',
        quantity: 1,
        price: 1499,
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80',
      },
      {
        id: '2',
        name: 'Designer Handbag',
        size: 'One Size',
        color: 'Brown',
        quantity: 1,
        price: 1000,
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80',
      },
    ],
    subtotal: 2499,
    shipping: 0,
    tax: 250,
    total: 2749,
    shippingAddress: {
      name: 'Praneeth Kumar',
      street: '123 Fashion Street, Banjara Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      zip: '500034',
      phone: '+91 98765 43210',
    },
    paymentMethod: {
      type: 'Credit Card',
      last4: '4532',
    },
  },
  '2': {
    id: '2',
    orderNumber: 'ORD-2024-002',
    date: 'Jan 15, 2024',
    status: 'delivered',
    estimatedDelivery: 'Jan 18, 2024',
    trackingNumber: 'TRK987654321',
    items: [
      {
        id: '3',
        name: 'Silk Evening Dress',
        size: 'S',
        color: 'Navy Blue',
        quantity: 1,
        price: 1899,
        image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&q=80',
      },
    ],
    subtotal: 1899,
    shipping: 0,
    tax: 190,
    total: 2089,
    shippingAddress: {
      name: 'Praneeth Kumar',
      street: '123 Fashion Street, Banjara Hills',
      city: 'Hyderabad',
      state: 'Telangana',
      zip: '500034',
      phone: '+91 98765 43210',
    },
    paymentMethod: {
      type: 'UPI',
      last4: 'paytm',
    },
  },
};

export function MobileOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = id ? MOCK_ORDERS[id] : null;

  if (!order) {
    return (
      <div className="min-h-screen bg-white dark:bg-background flex items-center justify-center" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
        <div className="text-center">
          <Package size={48} className="mx-auto text-foreground/20 mb-3" />
          <p className="text-foreground/60">Order not found</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'in-transit':
        return 'text-blue-600 bg-blue-50';
      case 'processing':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-foreground/60 bg-foreground/5';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={20} />;
      case 'in-transit':
        return <Truck size={20} />;
      case 'processing':
        return <Clock size={20} />;
      default:
        return <Package size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-20" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      <MobileSubPageHeader />

      <div className="pt-[100px] px-4 pb-6 space-y-4">{/* Header + safe area */}
        {/* Order Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 border border-border/30 shadow-sm"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-medium">{order.orderNumber}</h1>
              <p className="text-sm text-foreground/50 mt-0.5">Placed on {order.date}</p>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="capitalize">{order.status.replace('-', ' ')}</span>
            </div>
          </div>

          {order.status === 'in-transit' && (
            <div className="bg-primary/5 rounded-xl p-3 border border-primary/20">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Truck size={18} />
                <span className="text-sm font-medium">Estimated Delivery</span>
              </div>
              <p className="text-sm font-medium">{order.estimatedDelivery}</p>
              <p className="text-xs text-foreground/60 mt-1">Tracking: {order.trackingNumber}</p>
            </div>
          )}

          {order.status === 'delivered' && (
            <div className="bg-green-50 rounded-xl p-3 border border-green-200">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <CheckCircle size={18} />
                <span className="text-sm font-medium">Delivered</span>
              </div>
              <p className="text-xs text-foreground/60">Delivered on {order.estimatedDelivery}</p>
            </div>
          )}
        </motion.div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-4 border border-border/30 shadow-sm"
        >
          <h2 className="font-medium mb-4 flex items-center gap-2">
            <Package size={18} />
            <span>Order Items ({order.items.length})</span>
          </h2>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div
                key={item.id}
                className={`flex gap-3 ${index !== order.items.length - 1 ? 'pb-3 border-b border-border/10' : ''}`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
                  <div className="flex gap-3 mt-1">
                    <p className="text-xs text-foreground/50">Size: {item.size}</p>
                    <p className="text-xs text-foreground/50">Color: {item.color}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-foreground/50">Qty: {item.quantity}</p>
                    <p className="font-medium">₹{item.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Shipping Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-4 border border-border/30 shadow-sm"
        >
          <h2 className="font-medium mb-3 flex items-center gap-2">
            <MapPin size={18} />
            <span>Shipping Address</span>
          </h2>
          <div className="bg-muted/30 rounded-xl p-3">
            <p className="font-medium text-sm">{order.shippingAddress.name}</p>
            <p className="text-sm text-foreground/60 mt-1">{order.shippingAddress.street}</p>
            <p className="text-sm text-foreground/60">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
            </p>
            <div className="flex items-center gap-2 mt-2 text-sm text-foreground/60">
              <Phone size={14} />
              <span>{order.shippingAddress.phone}</span>
            </div>
          </div>
        </motion.div>

        {/* Payment Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-4 border border-border/30 shadow-sm"
        >
          <h2 className="font-medium mb-3 flex items-center gap-2">
            <CreditCard size={18} />
            <span>Payment Method</span>
          </h2>
          <div className="bg-muted/30 rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">{order.paymentMethod.type}</p>
              <p className="text-xs text-foreground/50 mt-0.5">
                {order.paymentMethod.type === 'UPI' 
                  ? `UPI: ****@${order.paymentMethod.last4}`
                  : `**** **** **** ${order.paymentMethod.last4}`
                }
              </p>
            </div>
            <CheckCircle size={18} className="text-green-600" />
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-4 border border-border/30 shadow-sm"
        >
          <h2 className="font-medium mb-4">Order Summary</h2>
          <div className="space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Subtotal</span>
              <span className="font-medium">₹{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Shipping</span>
              <span className="font-medium text-green-600">
                {order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Tax</span>
              <span className="font-medium">₹{order.tax.toLocaleString()}</span>
            </div>
            <div className="pt-2.5 border-t border-border/20">
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="text-lg font-semibold text-primary">
                  ₹{order.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <button className="w-full bg-primary text-white py-3.5 rounded-full font-medium flex items-center justify-center gap-2">
            <Phone size={18} />
            <span>Contact Support</span>
          </button>
          
          <button className="w-full bg-white border border-border/30 shadow-sm py-3.5 rounded-full font-medium flex items-center justify-center gap-2">
            <Download size={18} />
            <span>Download Invoice</span>
          </button>
        </motion.div>
      </div>

    </div>
  );
}