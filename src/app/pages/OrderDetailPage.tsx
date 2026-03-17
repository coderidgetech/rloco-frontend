import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, MapPin, CreditCard, CheckCircle, Truck, Clock, Phone, Download } from 'lucide-react';
import { ResponsivePageHeader } from '@/app/components/ResponsivePageHeader';
import { orderService } from '@/app/services/orderService';
import type { Order as APIOrder } from '@/app/types/api';
import { useIsMobile } from '@/app/hooks/useIsMobile';
import { useSiteConfig } from '@/app/context/SiteConfigContext';

type OrderStatus = 'delivered' | 'in-transit' | 'processing' | 'cancelled';

function mapStatus(api: string): OrderStatus {
  switch (api) {
    case 'delivered': return 'delivered';
    case 'shipped': return 'in-transit';
    case 'processing': return 'processing';
    case 'cancelled': return 'cancelled';
    default: return 'processing';
  }
}

function formatDate(s: string): string {
  try {
    return new Date(s).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return s;
  }
}

export function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { config } = useSiteConfig();
  const supportEmail = config.general?.supportEmail || '';
  const [order, setOrder] = useState<APIOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError(true);
      return;
    }
    let cancelled = false;
    orderService
      .getById(id)
      .then((o) => {
        if (!cancelled) setOrder(o);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center">
        <p className="text-foreground/60">Loading order…</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center p-4">
        <div className="text-center">
          <Package size={48} className="mx-auto text-foreground/20 mb-3" />
          <p className="text-foreground/60">Order not found</p>
          <button
            onClick={() => navigate('/orders')}
            className="mt-4 text-primary font-medium"
          >
            Back to orders
          </button>
        </div>
      </div>
    );
  }

  const status = mapStatus(order.status);
  const shipping = order.shipping_info;
  const name = shipping ? [shipping.first_name, shipping.last_name].filter(Boolean).join(' ') : '';
  const street = shipping?.address || '';
  const cityLine = shipping ? [shipping.city, shipping.state, shipping.zip_code].filter(Boolean).join(', ') : '';
  const paymentType = order.payment_method || 'Payment';
  const last4 = order.payment_info?.card_number?.slice(-4) || order.payment_info?.upi_id?.replace(/@.*/, '') || '****';
  const estimatedDelivery = order.status === 'shipped' || order.status === 'delivered'
    ? formatDate(order.updated_at || order.created_at)
    : '';

  const getStatusColor = (s: OrderStatus) => {
    switch (s) {
      case 'delivered': return 'text-green-600 bg-green-50 dark:bg-green-950/20';
      case 'in-transit': return 'text-blue-600 bg-blue-50 dark:bg-blue-950/20';
      case 'processing': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20';
      case 'cancelled': return 'text-red-600 bg-red-50 dark:bg-red-950/20';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (s: OrderStatus) => {
    switch (s) {
      case 'delivered': return <CheckCircle size={20} />;
      case 'in-transit': return <Truck size={20} />;
      case 'processing': return <Clock size={20} />;
      default: return <Package size={20} />;
    }
  };

  const topPadding = isMobile ? 'pt-[100px]' : 'pt-6';
  const bottomPadding = isMobile ? 'pb-20' : 'pb-12';
  const containerClass = isMobile ? 'px-4 pb-6' : 'max-w-2xl mx-auto px-4 md:px-8';

  return (
    <div className={`min-h-screen bg-muted/20 ${bottomPadding}`}>
      <ResponsivePageHeader title={order.order_number || `Order ${order.id}`} onBack={() => navigate('/orders')} />

      <div className={`${topPadding} ${containerClass} space-y-4`}>
        {/* Order Status Card - ref: bg-white rounded-2xl p-5 border border-border/30 shadow-sm */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5 border border-border/30 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-medium">{order.order_number}</h1>
              <p className="text-sm text-foreground/50 mt-0.5">Placed on {formatDate(order.created_at)}</p>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
              {getStatusIcon(status)}
              <span className="capitalize">{status.replace('-', ' ')}</span>
            </div>
          </div>

          {status === 'in-transit' && (
            <div className="bg-primary/5 rounded-xl p-3 border border-primary/20">
              <div className="flex items-center gap-2 text-primary mb-2">
                <Truck size={18} />
                <span className="text-sm font-medium">Estimated Delivery</span>
              </div>
              <p className="text-sm font-medium">{estimatedDelivery}</p>
              {order.tracking_number && (
                <p className="text-xs text-foreground/60 mt-1">Tracking: {order.tracking_number}</p>
              )}
            </div>
          )}

          {status === 'delivered' && estimatedDelivery && (
            <div className="bg-green-50 rounded-xl p-3 border border-green-200">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <CheckCircle size={18} />
                <span className="text-sm font-medium">Delivered</span>
              </div>
              <p className="text-xs text-foreground/60">Delivered on {estimatedDelivery}</p>
            </div>
          )}
        </motion.div>

        {/* Order Items - ref: bg-white rounded-2xl p-4 border border-border/30 shadow-sm */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-4 border border-border/30 shadow-sm"
        >
          <h2 className="font-medium mb-4 flex items-center gap-2">
            <Package size={18} />
            <span>Order Items ({order.items?.length ?? 0})</span>
          </h2>
          <div className="space-y-3">
            {(order.items || []).map((item, index) => (
              <div
                key={`${item.product_id}-${index}`}
                className={`flex gap-3 ${index !== (order.items?.length ?? 0) - 1 ? 'pb-3 border-b border-border/10' : ''}`}
              >
                <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-muted">
                  {item.image ? (
                    <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={24} className="text-foreground/30" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm line-clamp-1">{item.product_name}</h3>
                  <div className="flex gap-3 mt-1">
                    <p className="text-xs text-foreground/50">Size: {item.size}</p>
                    <p className="text-xs text-foreground/50">Color: {item.color ?? '—'}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-foreground/50">Qty: {item.quantity}</p>
                    <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Shipping Address - ref */}
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
            <p className="font-medium text-sm">{name || '—'}</p>
            <p className="text-sm text-foreground/60 mt-1">{street}</p>
            <p className="text-sm text-foreground/60">{cityLine}</p>
            {shipping?.phone && (
              <div className="flex items-center gap-2 mt-2 text-sm text-foreground/60">
                <Phone size={14} />
                <span>{shipping.phone}</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Payment Method - ref */}
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
              <p className="font-medium text-sm">{paymentType}</p>
              <p className="text-xs text-foreground/50 mt-0.5">
                {paymentType.toLowerCase().includes('upi') ? `UPI: ****@${last4}` : `**** **** **** ${last4}`}
              </p>
            </div>
            <CheckCircle size={18} className="text-green-600" />
          </div>
        </motion.div>

        {/* Order Summary - ref */}
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
              <span className="font-medium">₹{order.subtotal?.toLocaleString() ?? '0'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Shipping</span>
              <span className="font-medium text-green-600">
                {order.shipping_cost === 0 ? 'FREE' : `₹${order.shipping_cost}`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Tax</span>
              <span className="font-medium">₹{order.tax?.toLocaleString() ?? '0'}</span>
            </div>
            <div className="pt-2.5 border-t border-border/20">
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="text-lg font-semibold text-primary">₹{order.total?.toLocaleString() ?? '0'}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons - ref: Contact Support + Download Invoice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          {supportEmail ? (
            <a
              href={`mailto:${supportEmail}`}
              className="block w-full bg-primary text-white py-3.5 rounded-full font-medium flex items-center justify-center gap-2 text-center hover:opacity-90 transition-opacity"
            >
              <Phone size={18} />
              <span>Contact Support</span>
            </a>
          ) : (
            <button type="button" className="w-full bg-primary text-white py-3.5 rounded-full font-medium flex items-center justify-center gap-2">
              <Phone size={18} />
              <span>Contact Support</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              window.print();
              toast.success('Use "Save as PDF" in the print dialog to download the invoice.');
            }}
            className="w-full bg-white border border-border/30 shadow-sm py-3.5 rounded-full font-medium flex items-center justify-center gap-2"
          >
            <Download size={18} />
            <span>Download Invoice</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
