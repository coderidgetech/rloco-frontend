import { motion } from 'motion/react';
import { ChevronLeft, RotateCcw, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export function MobileReturnsPage() {
  const navigate = useNavigate();

  const returnSteps = [
    {
      number: 1,
      title: 'Initiate Return',
      desc: 'Contact us within 30 days of delivery',
      icon: AlertCircle,
    },
    {
      number: 2,
      title: 'Ship It Back',
      desc: 'Pack items securely with original tags',
      icon: RotateCcw,
    },
    {
      number: 3,
      title: 'We Process',
      desc: 'Inspection within 3-5 business days',
      icon: Clock,
    },
    {
      number: 4,
      title: 'Get Refund',
      desc: 'Refund issued to original payment method',
      icon: CheckCircle,
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
          <h1 className="text-lg font-medium ml-3">Returns & Refunds</h1>
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
          <RotateCcw size={32} className="text-primary mx-auto mb-2" />
          <h2 className="text-2xl font-bold mb-2">Easy Returns</h2>
          <p className="text-sm text-foreground/60">
            30-day hassle-free return policy
          </p>
        </motion.div>

        {/* Return Steps */}
        <div className="space-y-3 mb-6">
          {returnSteps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-r from-primary/5 to-transparent rounded-2xl p-4 border border-border/10"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 font-bold">
                  {step.number}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-xs text-foreground/60">{step.desc}</p>
                </div>
                <step.icon size={20} className="text-primary flex-shrink-0" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Return Policy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-muted/30 rounded-2xl p-4 mb-6"
        >
          <h3 className="font-semibold mb-3">Return Policy</h3>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>Items must be unused and in original condition</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>Original tags and packaging must be intact</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>Return initiated within 30 days of delivery</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span>Proof of purchase required</span>
            </li>
          </ul>
        </motion.div>

        {/* Non-Returnable Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-red-500/5 rounded-2xl p-4 mb-6 border border-red-500/10"
        >
          <h3 className="font-semibold mb-3 text-red-600">Non-Returnable Items</h3>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li className="flex items-start gap-2">
              <XCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
              <span>Intimate apparel and swimwear</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
              <span>Earrings and pierced jewelry</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
              <span>Final sale items</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
              <span>Gift cards</span>
            </li>
          </ul>
        </motion.div>

        {/* Refund Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-primary/5 rounded-2xl p-4 mb-6"
        >
          <h3 className="font-semibold mb-3">Refund Timeline</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock size={16} className="text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Processing Time</h4>
                <p className="text-xs text-foreground/60">3-5 business days after we receive your return</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle size={16} className="text-primary" />
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Refund Arrival</h4>
                <p className="text-xs text-foreground/60">5-10 business days to appear in your account</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Exchange Policy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-muted/30 rounded-2xl p-4 mb-6"
        >
          <h3 className="font-semibold mb-3">Exchanges</h3>
          <p className="text-sm text-foreground/70 leading-relaxed mb-3">
            We currently don't offer direct exchanges. If you need a different size or color, please return your original item and place a new order.
          </p>
          <div className="bg-primary/10 rounded-xl p-3">
            <p className="text-xs font-medium text-primary">
              💡 Tip: Contact us first - we may be able to hold the item you want while processing your return!
            </p>
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-foreground/5 rounded-2xl p-4 text-center mb-6"
        >
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <p className="text-sm text-foreground/60 mb-4">
            Contact our customer service team for assistance with your return
          </p>
          <button
            onClick={() => navigate('/mobile/contact')}
            className="w-full bg-primary text-white font-medium py-3 rounded-xl"
          >
            Contact Support
          </button>
        </motion.div>
      </div>

    </div>
  );
}
