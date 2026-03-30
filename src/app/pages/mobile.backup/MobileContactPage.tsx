import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  Headphones, 
  Clock,
  MapPin,
  Send,
  ChevronRight,
  Package,
  CreditCard,
  FileText,
  HelpCircle,
  MessageSquare
} from 'lucide-react';
import { MobileSubPageHeader } from '@/app/components/mobile/MobileSubPageHeader';
import { useState } from 'react';
import { toast } from 'sonner';
import { PH } from '@/app/lib/formPlaceholders';

const SUPPORT_CATEGORIES = [
  { 
    icon: Package, 
    label: 'Order Tracking', 
    description: 'Track your order status',
    color: 'bg-blue-50 text-blue-600 border-blue-200'
  },
  { 
    icon: CreditCard, 
    label: 'Payment Issues', 
    description: 'Help with payments',
    color: 'bg-green-50 text-green-600 border-green-200'
  },
  { 
    icon: FileText, 
    label: 'Returns & Refunds', 
    description: 'Return policy assistance',
    color: 'bg-purple-50 text-purple-600 border-purple-200'
  },
  { 
    icon: HelpCircle, 
    label: 'Product Questions', 
    description: 'Product information',
    color: 'bg-orange-50 text-orange-600 border-orange-200'
  },
];

const QUICK_ACTIONS = [
  {
    icon: MessageCircle,
    label: 'Live Chat',
    description: 'Chat with us now',
    badge: 'Available',
    badgeColor: 'bg-green-100 text-green-700',
    action: 'chat'
  },
  {
    icon: Phone,
    label: 'Call Us',
    description: '+1 (800) 756-2601',
    badge: 'Mon-Fri 9-6',
    badgeColor: 'bg-blue-100 text-blue-700',
    action: 'phone'
  },
  {
    icon: Mail,
    label: 'Email Support',
    description: 'support@rloco.com',
    badge: '24h response',
    badgeColor: 'bg-purple-100 text-purple-700',
    action: 'email'
  },
  {
    icon: Headphones,
    label: 'WhatsApp',
    description: 'Message us anytime',
    badge: 'Fast reply',
    badgeColor: 'bg-[#25D366]/10 text-[#25D366]',
    action: 'whatsapp'
  },
];

export function MobileContactPage() {
  const navigate = useNavigate();
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'chat':
        toast.success('Opening live chat...', {
          description: 'Our team is available now'
        });
        break;
      case 'phone':
        window.location.href = 'tel:+18007562601';
        break;
      case 'email':
        window.location.href = 'mailto:support@rloco.com';
        break;
      case 'whatsapp':
        window.open('https://wa.me/18007562601', '_blank');
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Message sent successfully!', {
      description: 'We\'ll respond within 24 hours'
    });
    
    setFormData({ name: '', email: '', phone: '', category: '', subject: '', message: '' });
    setIsSubmitting(false);
    setShowContactForm(false);
  };

  if (showContactForm) {
    return (
      <div className="min-h-screen bg-white dark:bg-background pb-20" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
        <MobileSubPageHeader 
          title="Contact Form" 
          onBack={() => setShowContactForm(false)}
        />

        <div className="px-4 py-6" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 56px + 24px)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground/70">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={PH.fullName}
                required
                className="w-full px-4 py-3 bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground/70">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={PH.email}
                required
                className="w-full px-4 py-3 bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground/70">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder={PH.phone}
                className="w-full px-4 py-3 bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground/70">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full px-4 py-3 bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              >
                <option value="">Select a category</option>
                <option value="Order Tracking">Order Tracking</option>
                <option value="Payment Issues">Payment Issues</option>
                <option value="Returns & Refunds">Returns & Refunds</option>
                <option value="Product Questions">Product Questions</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Feedback">Feedback & Suggestions</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground/70">
                Subject *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder={PH.subject}
                required
                className="w-full px-4 py-3 bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground/70">
                Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={PH.message}
                rows={6}
                required
                className="w-full px-4 py-3 bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="w-full bg-primary text-white py-4 rounded-full font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Send Message</span>
                </>
              )}
            </motion.button>

            <p className="text-xs text-foreground/50 text-center">
              We'll respond within 24 hours
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-20" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      <MobileSubPageHeader title="Contact Support" />

      <div className="px-4 py-6" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 56px + 24px)' }}>
        {/* Hero Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-medium mb-2">How can we help?</h1>
          <p className="text-sm text-foreground/60">
            Choose a contact method below or send us a message
          </p>
        </motion.div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-xs font-medium text-foreground/40 uppercase tracking-wider mb-3 px-1">
            Contact Methods
          </h2>
          <div className="space-y-3">
            {QUICK_ACTIONS.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleQuickAction(action.action)}
                className="w-full bg-foreground/5 border border-border/30 shadow-sm rounded-2xl p-4 flex items-center gap-4 active:bg-foreground/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-white border border-border/20 flex items-center justify-center flex-shrink-0">
                  <action.icon className="w-5 h-5 text-foreground/70" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h3 className="text-sm font-medium mb-0.5">{action.label}</h3>
                  <p className="text-xs text-foreground/60 truncate">{action.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${action.badgeColor}`}>
                    {action.badge}
                  </span>
                  <ChevronRight size={18} className="text-foreground/40" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Support Categories */}
        <div className="mb-6">
          <h2 className="text-xs font-medium text-foreground/40 uppercase tracking-wider mb-3 px-1">
            What do you need help with?
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {SUPPORT_CATEGORIES.map((category, index) => (
              <motion.button
                key={category.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setFormData({ ...formData, category: category.label });
                  setShowContactForm(true);
                }}
                className={`p-4 border rounded-2xl text-center ${category.color}`}
              >
                <category.icon className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium mb-1">{category.label}</p>
                <p className="text-xs opacity-70">{category.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Send Message Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowContactForm(true)}
          className="w-full bg-primary text-white py-4 rounded-full font-medium flex items-center justify-center gap-2 mb-6"
        >
          <MessageCircle size={20} />
          <span>Send us a Message</span>
        </motion.button>

        {/* Business Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-foreground/5 border border-border/30 shadow-sm rounded-2xl p-4 mb-6"
        >
          <div className="flex items-start gap-3 mb-4">
            <Clock className="w-5 h-5 text-foreground/70 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-2">Business Hours</h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-foreground/60">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Saturday</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground/60">Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
              </div>
              <p className="text-xs text-foreground/50 mt-2">*All times in EST</p>
            </div>
          </div>
        </motion.div>

        {/* Office Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white border border-border/30 shadow-sm rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-foreground/70 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium mb-2">Headquarters</h3>
              <p className="text-xs text-foreground/60 leading-relaxed">
                123 Fashion Avenue<br />
                New York, NY 10001<br />
                United States
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
