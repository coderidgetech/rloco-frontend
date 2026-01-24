import { motion } from 'motion/react';
import { X, Download, Printer, Mail } from 'lucide-react';
import { Logo } from './Logo';
import { toast } from 'sonner';

interface OrderProduct {
  id: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  image: string;
}

interface ShippingInfo {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
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
  shipping_info?: ShippingInfo;
}

interface InvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InvoiceModal({ order, isOpen, onClose }: InvoiceModalProps) {
  if (!isOpen || !order) return null;

  const handleDownload = () => {
    toast.success('Invoice downloaded successfully!');
  };

  const handlePrint = () => {
    window.print();
    toast.success('Opening print dialog...');
  };

  const handleEmail = () => {
    toast.success('Invoice sent to your email!');
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
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] bg-background z-[61] rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border z-10">
          <div className="flex items-center justify-between p-6">
            <div>
              <h2 className="text-2xl mb-1">Invoice</h2>
              <p className="text-sm text-muted-foreground">Order #{order.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEmail}
                className="p-3 hover:bg-muted rounded-lg transition-colors"
                title="Email Invoice"
              >
                <Mail size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrint}
                className="p-3 hover:bg-muted rounded-lg transition-colors"
                title="Print Invoice"
              >
                <Printer size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2"
              >
                <Download size={18} />
                Download
              </motion.button>
              <button
                onClick={onClose}
                className="p-3 hover:bg-muted rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-88px)]">
          <div className="p-8 md:p-12">
            {/* Invoice Header */}
            <div className="flex flex-col md:flex-row justify-between items-start mb-12 pb-8 border-b border-border">
              <div>
                <Logo className="mb-6" />
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>123 Fashion Avenue</p>
                  <p>New York, NY 10001</p>
                  <p>United States</p>
                  <p className="mt-2">info@rloco.com</p>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="mt-6 md:mt-0 text-left md:text-right">
                <h3 className="text-3xl font-medium mb-4">INVOICE</h3>
                <div className="text-sm space-y-2">
                  <div>
                    <span className="text-muted-foreground">Invoice Number:</span>
                    <p className="font-mono font-medium">INV-{order.id}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Invoice Date:</span>
                    <p className="font-medium">
                      {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Payment Status:</span>
                    <p className="font-medium text-green-600">Paid</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h4 className="font-medium mb-3 text-muted-foreground uppercase text-sm tracking-wider">Bill To</h4>
                {order.shipping_info ? (
                  <div className="space-y-1">
                    <p className="font-medium">{order.shipping_info.first_name} {order.shipping_info.last_name}</p>
                    <p className="text-sm text-muted-foreground">{order.shipping_info.address}</p>
                    <p className="text-sm text-muted-foreground">{order.shipping_info.city}, {order.shipping_info.state} {order.shipping_info.zip_code}</p>
                    <p className="text-sm text-muted-foreground">{order.shipping_info.country}</p>
                    <p className="text-sm text-muted-foreground mt-2">{order.shipping_info.email}</p>
                    <p className="text-sm text-muted-foreground">{order.shipping_info.phone}</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">No billing information available</p>
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-medium mb-3 text-muted-foreground uppercase text-sm tracking-wider">Ship To</h4>
                {order.shipping_info ? (
                  <div className="space-y-1">
                    <p className="font-medium">{order.shipping_info.first_name} {order.shipping_info.last_name}</p>
                    <p className="text-sm text-muted-foreground">{order.shipping_info.address}</p>
                    <p className="text-sm text-muted-foreground">{order.shipping_info.city}, {order.shipping_info.state} {order.shipping_info.zip_code}</p>
                    <p className="text-sm text-muted-foreground">{order.shipping_info.country}</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">No shipping information available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Invoice Table */}
            <div className="mb-8">
              <div className="bg-muted/30 rounded-t-xl px-6 py-4">
                <div className="grid grid-cols-12 gap-4 font-medium text-sm">
                  <div className="col-span-6">Item</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-2 text-right">Amount</div>
                </div>
              </div>
              <div className="border border-t-0 border-border rounded-b-xl">
                {order.products?.map((product, index) => (
                  <div
                    key={product.id}
                    className={`px-6 py-4 ${
                      index !== (order.products?.length ?? 0) - 1 ? 'border-b border-border' : ''
                    }`}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center text-sm">
                      <div className="col-span-6">
                        <p className="font-medium mb-1">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Size: {product.size} | Color: {product.color}
                        </p>
                      </div>
                      <div className="col-span-2 text-center">{product.quantity}</div>
                      <div className="col-span-2 text-right">${product.price.toFixed(2)}</div>
                      <div className="col-span-2 text-right font-medium">
                        ${(product.price * product.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-12">
              <div className="w-full md:w-80 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${order.subtotal?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">${order.shipping?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (5%)</span>
                  <span className="font-medium">${order.tax?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="pt-3 border-t-2 border-border">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Amount</span>
                    <span className="text-2xl font-medium text-primary">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Amount Paid</span>
                    <span className="font-medium text-green-600">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Balance Due</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-muted/20 rounded-xl p-6 mb-8">
              <h4 className="font-medium mb-3 text-sm">Payment Method</h4>
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 bg-background rounded flex items-center justify-center border border-border">
                  <span className="font-medium text-xs">VISA</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Visa ending in 4242</p>
                  <p className="text-xs text-muted-foreground">
                    Processed on {new Date(order.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-medium text-foreground">Notes:</p>
              <p>Thank you for shopping with Rloco! We appreciate your business.</p>
              <p>If you have any questions about this invoice, please contact our customer service team.</p>
            </div>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
              <p>This is a computer-generated invoice and does not require a signature.</p>
              <p className="mt-2">© 2025 Rloco. All rights reserved.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
