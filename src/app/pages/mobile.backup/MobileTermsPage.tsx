import { motion } from 'motion/react';
import { ChevronLeft, FileText, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export function MobileTermsPage() {
  const navigate = useNavigate();

  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: 'By accessing and using Rloco\'s website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.',
    },
    {
      title: '2. Use of Service',
      content: 'You may use our service only for lawful purposes and in accordance with these Terms. You agree not to use our service in any way that could damage, disable, or impair our website or interfere with any other party\'s use of the service.',
    },
    {
      title: '3. Account Registration',
      content: 'To access certain features, you may be required to register for an account. You must provide accurate and complete information and keep your account credentials secure. You are responsible for all activities under your account.',
    },
    {
      title: '4. Products and Pricing',
      content: 'All products are subject to availability. We reserve the right to discontinue any product at any time. Prices are subject to change without notice. We make every effort to display accurate colors and images, but cannot guarantee exact representations.',
    },
    {
      title: '5. Payment Terms',
      content: 'Payment is due at the time of purchase. We accept major credit cards and other payment methods as indicated on our website. All prices are in USD unless otherwise stated.',
    },
    {
      title: '6. Shipping and Delivery',
      content: 'Shipping times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers or customs. Risk of loss passes to you upon delivery to the carrier.',
    },
    {
      title: '7. Returns and Refunds',
      content: 'Returns must be initiated within 30 days of delivery. Items must be unused, in original condition with tags attached. Refunds will be processed to the original payment method within 5-10 business days of receiving the return.',
    },
    {
      title: '8. Intellectual Property',
      content: 'All content on this website, including text, graphics, logos, images, and software, is the property of Rloco and protected by copyright laws. You may not reproduce, distribute, or create derivative works without our express written permission.',
    },
    {
      title: '9. Limitation of Liability',
      content: 'To the fullest extent permitted by law, Rloco shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services or products.',
    },
    {
      title: '10. Changes to Terms',
      content: 'We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services constitutes acceptance of the modified Terms.',
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
          <h1 className="text-lg font-medium ml-3">Terms of Service</h1>
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
          <FileText size={32} className="text-primary mx-auto mb-2" />
          <h2 className="text-2xl font-bold mb-2">Terms of Service</h2>
          <p className="text-sm text-foreground/60">
            Last updated: January 23, 2026
          </p>
        </motion.div>

        {/* Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-primary/5 rounded-2xl p-4 mb-6 border border-primary/10"
        >
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-foreground/70">
              <p className="font-medium text-foreground mb-1">Important Notice</p>
              <p className="text-xs leading-relaxed">
                Please read these Terms of Service carefully before using our website or services. By using Rloco, you agree to these terms.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sections */}
        <div className="space-y-4 mb-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="bg-muted/20 rounded-2xl p-4"
            >
              <h3 className="font-semibold mb-2 text-sm">{section.title}</h3>
              <p className="text-xs text-foreground/70 leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-foreground/5 rounded-2xl p-4 text-center mb-6"
        >
          <h3 className="font-semibold mb-2">Questions About Our Terms?</h3>
          <p className="text-sm text-foreground/60 mb-4">
            Contact us if you have any questions about these Terms of Service
          </p>
          <button
            onClick={() => navigate('/mobile/contact')}
            className="w-full bg-primary text-white font-medium py-3 rounded-xl"
          >
            Contact Us
          </button>
        </motion.div>
      </div>

    </div>
  );
}
