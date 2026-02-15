import { motion } from 'motion/react';
import { ChevronLeft, Package, Truck, Globe, Clock, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export function MobileShippingPage() {
  const navigate = useNavigate();

  const shippingOptions = [
    {
      icon: Truck,
      title: 'Standard Shipping',
      time: '5-7 Business Days',
      price: 'Free over $100',
      color: 'from-blue-500/10 to-blue-500/5',
    },
    {
      icon: Package,
      title: 'Express Shipping',
      time: '2-3 Business Days',
      price: '$15.00',
      color: 'from-primary/10 to-primary/5',
    },
    {
      icon: Globe,
      title: 'International',
      time: '10-15 Business Days',
      price: 'Calculated at checkout',
      color: 'from-purple-500/10 to-purple-500/5',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-20" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border/20">
        <div className="flex items-center h-14 px-4" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center"
          >
            <ChevronLeft size={20} />
          </motion.button>
          <h1 className="text-lg font-medium ml-3">Shipping Info</h1>
        </div>
      </div>

      {/* Content */}
      <div className="pt-14 px-4">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6 mb-4"
        >
          <Package size={32} className="text-primary mx-auto mb-2" />
          <h2 className="text-2xl font-bold mb-2">Shipping & Delivery</h2>
          <p className="text-sm text-foreground/60">
            Fast, reliable delivery worldwide
          </p>
        </motion.div>

        {/* Shipping Options */}
        <div className="space-y-3 mb-6">
          {shippingOptions.map((option, index) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-r ${option.color} rounded-2xl p-4 border border-border/10`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <option.icon size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{option.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-foreground/60 mb-1">
                    <Clock size={12} />
                    <span>{option.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-primary">
                    <DollarSign size={12} />
                    <span>{option.price}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tracking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-muted/30 rounded-2xl p-4 mb-6"
        >
          <h3 className="font-semibold mb-3">Order Tracking</h3>
          <p className="text-sm text-foreground/70 leading-relaxed mb-3">
            Track your order every step of the way. You'll receive a tracking number via email once your order ships.
          </p>
          <div className="bg-white rounded-xl p-3 border border-border/10">
            <p className="text-xs text-foreground/50 mb-1">Example tracking:</p>
            <code className="text-xs font-mono text-primary">TRK123456789</code>
          </div>
        </motion.div>

        {/* Shipping Regions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-primary/5 rounded-2xl p-4 mb-6"
        >
          <h3 className="font-semibold mb-3">Shipping Regions</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-xl p-3">
              <h4 className="font-medium text-sm mb-1">🇺🇸 United States</h4>
              <p className="text-xs text-foreground/60">Free shipping on orders over $100</p>
            </div>
            <div className="bg-white rounded-xl p-3">
              <h4 className="font-medium text-sm mb-1">🇨🇦 Canada</h4>
              <p className="text-xs text-foreground/60">Flat rate $20 shipping</p>
            </div>
            <div className="bg-white rounded-xl p-3">
              <h4 className="font-medium text-sm mb-1">🌍 International</h4>
              <p className="text-xs text-foreground/60">We ship to 40+ countries worldwide</p>
            </div>
          </div>
        </motion.div>

        {/* Processing Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-muted/30 rounded-2xl p-4 mb-6"
        >
          <h3 className="font-semibold mb-3">Processing Time</h3>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              <span>Orders are processed within 1-2 business days</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              <span>Orders placed on weekends/holidays are processed the next business day</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              <span>You'll receive a confirmation email when your order ships</span>
            </li>
          </ul>
        </motion.div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-foreground/5 rounded-2xl p-4 mb-6"
        >
          <h3 className="font-semibold mb-3">Important Notes</h3>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/50 mt-1.5 flex-shrink-0" />
              <span>We cannot deliver to P.O. boxes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/50 mt-1.5 flex-shrink-0" />
              <span>Signature may be required for high-value orders</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground/50 mt-1.5 flex-shrink-0" />
              <span>International orders may be subject to customs fees</span>
            </li>
          </ul>
        </motion.div>
      </div>

    </div>
  );
}
