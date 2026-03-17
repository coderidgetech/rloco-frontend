import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Package, ChevronRight, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { ResponsivePageHeader } from '@/app/components/ResponsivePageHeader';
import { EmptyState } from '@/app/components/mobile/EmptyState';
import { orderService } from '@/app/services/orderService';
import type { Order as APIOrder } from '@/app/types/api';
import { useIsMobile } from '@/app/hooks/useIsMobile';

type OrderStatus = 'delivered' | 'in-transit' | 'processing' | 'cancelled';

interface OrderListItem {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: number;
  image: string;
  deliveryDate?: string;
}

function mapStatus(api: string): OrderStatus {
  switch (api) {
    case 'delivered': return 'delivered';
    case 'shipped': return 'in-transit';
    case 'processing': return 'processing';
    case 'cancelled': return 'cancelled';
    default: return 'processing';
  }
}

function formatOrderDate(createdAt: string): string {
  try {
    const d = new Date(createdAt);
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

export function OrdersPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('active');
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await orderService.list({ limit: 100 });
        const list: OrderListItem[] = (res.orders || []).map((o: APIOrder) => {
          const firstImage = o.items?.[0]?.image ?? '';
          const estDelivery = o.status === 'shipped' || o.status === 'delivered'
            ? formatOrderDate(o.updated_at || o.created_at)
            : undefined;
          return {
            id: o.id,
            orderNumber: o.order_number || `#${o.id}`,
            date: formatOrderDate(o.created_at),
            status: mapStatus(o.status),
            total: o.total ?? 0,
            items: o.items?.length ?? 0,
            image: firstImage,
            deliveryDate: estDelivery,
          };
        });
        if (!cancelled) setOrders(list);
      } catch {
        if (!cancelled) setOrders([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-50';
      case 'in-transit': return 'text-blue-600 bg-blue-50';
      case 'processing': return 'text-yellow-600 bg-yellow-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      default: return 'text-foreground/60 bg-foreground/5';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'delivered': return <CheckCircle size={16} />;
      case 'in-transit': return <Truck size={16} />;
      case 'processing': return <Clock size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      default: return <Package size={16} />;
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return order.status === 'in-transit' || order.status === 'processing';
    if (activeTab === 'completed') return order.status === 'delivered';
    return true;
  });

  const topPadding = isMobile ? 'pt-[calc(env(safe-area-inset-top)+56px+8px)]' : 'pt-8';
  const bottomPadding = isMobile ? 'pb-20' : 'pb-12';

  return (
    <div className={`min-h-screen bg-background ${bottomPadding}`}>
      <ResponsivePageHeader title="My Orders" onBack={() => navigate('/account')} />

      <div className={isMobile ? '' : 'max-w-3xl mx-auto px-4 md:px-8'}>
        <div className={`${topPadding} ${isMobile ? 'sticky top-[calc(env(safe-area-inset-top)+56px)] z-10 bg-background border-b border-border/20' : 'mb-6'}`}>
          <div className="flex gap-2 py-3">
            {(['active', 'completed', 'all'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  activeTab === tab ? 'bg-primary text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {tab === 'active' && 'Active'}
                {tab === 'completed' && 'Completed'}
                {tab === 'all' && 'All Orders'}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 md:p-0 space-y-3 md:space-y-4">
          {loading ? (
            <div className="py-20 text-center text-muted-foreground text-sm">Loading orders…</div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-12 md:py-20">
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
                transition={{ delay: index * 0.03 }}
              >
                <button
                  onClick={() => navigate(`/order/${order.id}`)}
                  className="w-full bg-card rounded-2xl p-4 border border-border/30 shadow-sm hover:border-primary/30 transition-colors text-left"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{order.date}</p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status.replace('-', ' ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-16 h-16 rounded-lg bg-muted overflow-hidden flex items-center justify-center shrink-0">
                      {order.image ? (
                        <img src={order.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Package size={24} className="text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground">
                        {order.items} {order.items === 1 ? 'item' : 'items'}
                      </p>
                      <p className="text-lg font-medium mt-0.5">₹{order.total.toLocaleString()}</p>
                    </div>
                    <ChevronRight size={20} className="text-muted-foreground shrink-0" />
                  </div>

                  {order.status === 'in-transit' && order.deliveryDate && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 rounded-lg">
                      <Truck size={16} className="text-primary" />
                      <p className="text-xs text-muted-foreground">
                        Expected delivery: <span className="font-medium text-foreground">{order.deliveryDate}</span>
                      </p>
                    </div>
                  )}

                  {order.status === 'delivered' && order.deliveryDate && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <CheckCircle size={16} className="text-green-600" />
                      <p className="text-xs text-muted-foreground">
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
