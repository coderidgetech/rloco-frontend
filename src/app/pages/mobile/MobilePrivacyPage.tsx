import { motion } from 'motion/react';
import { ChevronLeft, Shield, Lock, Eye, Database, Bell, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export function MobilePrivacyPage() {
  const navigate = useNavigate();

  const privacyPoints = [
    {
      icon: Lock,
      title: 'Data Security',
      desc: 'Your data is encrypted and stored securely',
    },
    {
      icon: Eye,
      title: 'Transparency',
      desc: 'We\'re clear about what data we collect',
    },
    {
      icon: Users,
      title: 'No Selling',
      desc: 'We never sell your personal information',
    },
    {
      icon: Bell,
      title: 'Your Control',
      desc: 'Manage your privacy preferences anytime',
    },
  ];

  const sections = [
    {
      title: 'Information We Collect',
      content: 'We collect information you provide directly to us, such as your name, email address, postal address, phone number, and payment information when you create an account or make a purchase. We also collect information about your browsing behavior and preferences.',
    },
    {
      title: 'How We Use Your Information',
      content: 'We use the information we collect to process your orders, communicate with you about your account and orders, send you marketing communications (with your consent), improve our website and services, and comply with legal obligations.',
    },
    {
      title: 'Information Sharing',
      content: 'We do not sell your personal information. We may share your information with service providers who assist us in operating our business, such as payment processors and shipping companies. We may also share information when required by law or to protect our rights.',
    },
    {
      title: 'Cookies and Tracking',
      content: 'We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand where our visitors are coming from. You can control cookies through your browser settings.',
    },
    {
      title: 'Data Retention',
      content: 'We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. You may request deletion of your account and personal information at any time.',
    },
    {
      title: 'Your Rights',
      content: 'You have the right to access, correct, or delete your personal information. You can also object to or restrict certain processing of your data. To exercise these rights, please contact us using the information provided below.',
    },
    {
      title: 'Children\'s Privacy',
      content: 'Our services are not intended for children under 13. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.',
    },
    {
      title: 'International Data Transfers',
      content: 'Your information may be transferred to and processed in countries other than your own. We take steps to ensure your information receives adequate protection wherever it is processed.',
    },
    {
      title: 'Changes to Privacy Policy',
      content: 'We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last Updated" date.',
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
          <h1 className="text-lg font-medium ml-3">Privacy Policy</h1>
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
          <Shield size={32} className="text-primary mx-auto mb-2" />
          <h2 className="text-2xl font-bold mb-2">Privacy Policy</h2>
          <p className="text-sm text-foreground/60">
            Last updated: January 23, 2026
          </p>
        </motion.div>

        {/* Key Points */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {privacyPoints.map((point, index) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-4 border border-border/10"
            >
              <point.icon size={24} className="text-primary mb-2" />
              <h3 className="font-semibold text-sm mb-1">{point.title}</h3>
              <p className="text-xs text-foreground/60 leading-snug">{point.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-muted/30 rounded-2xl p-4 mb-6"
        >
          <p className="text-sm text-foreground/70 leading-relaxed">
            At Rloco, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this policy carefully.
          </p>
        </motion.div>

        {/* Sections */}
        <div className="space-y-4 mb-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              className="bg-white rounded-2xl p-4 border border-border/10"
            >
              <div className="flex items-start gap-2 mb-2">
                <Database size={16} className="text-primary flex-shrink-0 mt-0.5" />
                <h3 className="font-semibold text-sm">{section.title}</h3>
              </div>
              <p className="text-xs text-foreground/70 leading-relaxed pl-6">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-primary/5 rounded-2xl p-4 mb-6"
        >
          <h3 className="font-semibold mb-2">Contact Us About Privacy</h3>
          <p className="text-sm text-foreground/70 mb-3 leading-relaxed">
            If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs">📧</span>
              </div>
              <span className="text-foreground/70">privacy@rloco.com</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs">📍</span>
              </div>
              <span className="text-foreground/70">123 Fashion Ave, New York, NY 10001</span>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="bg-foreground/5 rounded-2xl p-4 text-center mb-6"
        >
          <h3 className="font-semibold mb-2">Manage Your Privacy</h3>
          <p className="text-sm text-foreground/60 mb-4">
            Update your privacy preferences in your account settings
          </p>
          <button
            onClick={() => navigate('/mobile/account')}
            className="w-full bg-primary text-white font-medium py-3 rounded-xl"
          >
            Go to Account Settings
          </button>
        </motion.div>
      </div>

    </div>
  );
}
