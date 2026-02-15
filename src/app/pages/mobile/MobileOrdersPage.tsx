import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Package, ChevronRight, MapPin, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { MobileSubPageHeader } from '@/app/components/mobile/MobileSubPageHeader';
import { EmptyState } from '@/app/components/mobile/EmptyState';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'delivered' | 'in-transit' | 'processing' | 'cancelled';
  total: number;
  items: number;
  image: string;
  deliveryDate?: string;
}

const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    date: '2024-01-20',
    status: 'in-transit',
    total: 2499,
    items: 2,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80',
    deliveryDate: 'Jan 25, 2024',
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    date: '2024-01-15',
    status: 'delivered',
    total: 1899,
    items: 1,
    image: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&q=80',
    deliveryDate: 'Jan 18, 2024',
  },
];

export function MobileOrdersPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('active');

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
        return <CheckCircle size={16} />;
      case 'in-transit':
        return <Truck size={16} />;
      case 'processing':
        return <Clock size={16} />;
      case 'cancelled':
        return <XCircle size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  const filteredOrders = MOCK_ORDERS.filter((order) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return order.status === 'in-transit' || order.status === 'processing';
    if (activeTab === 'completed') return order.status === 'delivered';
    return true;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-20" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      <MobileSubPageHeader onBack={() => navigate('/account')} />

      <div className="pt-[100px]">{/* Header + safe area */}
        {/* Tabs */}
        <div className="bg-white px-4 py-3 border-b border-border/20 sticky top-24 z-10">
          <div className="flex gap-2">
            {(['active', 'completed', 'all'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-primary text-white'
                    : 'bg-foreground/5 text-foreground/60'
                }`}
              >
                {tab === 'active' && 'Active'}
                {tab === 'completed' && 'Completed'}
                {tab === 'all' && 'All Orders'}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="p-4 space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="pt-20">
              <EmptyState
                type="orders"
                title="No orders yet"
                description="Start shopping to see your orders here"
              />
            </div>
          ) : (
            filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => navigate(`/order/${order.id}`)}
                  className="w-full bg-white rounded-2xl p-4 border border-border/30 shadow-sm active:bg-foreground/5 transition-colors"
                >
                  {/* Order Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-foreground/50 mt-0.5">{order.date}</p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status.replace('-', ' ')}</span>
                    </div>
                  </div>

                  {/* Product Image and Info */}
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={order.image}
                      alt="Order item"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1 text-left">
                      <p className="text-sm text-foreground/70">
                        {order.items} {order.items === 1 ? 'item' : 'items'}
                      </p>
                      <p className="text-lg font-medium mt-0.5">₹{order.total.toLocaleString()}</p>
                    </div>
                    <ChevronRight size={20} className="text-foreground/40" />
                  </div>

                  {/* Delivery Info */}
                  {order.status === 'in-transit' && order.deliveryDate && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 rounded-lg">
                      <Truck size={16} className="text-primary" />
                      <p className="text-xs text-foreground/70">
                        Expected delivery: <span className="font-medium text-foreground">{order.deliveryDate}</span>
                      </p>
                    </div>
                  )}

                  {order.status === 'delivered' && order.deliveryDate && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-lg">
                      <CheckCircle size={16} className="text-green-600" />
                      <p className="text-xs text-foreground/70">
                        Delivered on <span className="font-medium text-foreground">{order.deliveryDate}</span>
                      </p>
                    </div>
                  )}
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}