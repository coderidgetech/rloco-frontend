import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, ChevronDown, ChevronUp, MessageCircle, Phone, Mail, HelpCircle } from 'lucide-react';
import { MobileSubPageHeader } from '@/app/components/mobile/MobileSubPageHeader';
import { useIsMobile } from '@/app/hooks/useIsMobile';
import { useNavigate } from 'react-router-dom';
import { PH } from '@/app/lib/formPlaceholders';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQ[] = [
  {
    id: '1',
    category: 'Orders',
    question: 'How can I track my order?',
    answer: 'You can track your order from the "My Orders" section in your account. Click on any order to see real-time tracking updates.',
  },
  {
    id: '2',
    category: 'Orders',
    question: 'Can I cancel my order?',
    answer: 'Yes, you can cancel your order within 24 hours of placing it. Go to "My Orders" and click on the order you want to cancel.',
  },
  {
    id: '3',
    category: 'Shipping',
    question: 'What are the delivery charges?',
    answer: 'We offer free delivery on all orders above ₹999. For orders below ₹999, a delivery charge of ₹99 applies.',
  },
  {
    id: '4',
    category: 'Shipping',
    question: 'How long does delivery take?',
    answer: 'Standard delivery takes 3-5 business days. Express delivery (1-2 days) is available at checkout for an additional fee.',
  },
  {
    id: '5',
    category: 'Returns',
    question: 'What is your return policy?',
    answer: 'We offer a 30-day return policy. Items must be unused, unwashed, and in original packaging with tags attached.',
  },
  {
    id: '6',
    category: 'Returns',
    question: 'How do I return an item?',
    answer: 'Go to "My Orders", select the item you want to return, and click "Return Item". We\'ll arrange a free pickup from your address.',
  },
  {
    id: '7',
    category: 'Payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept credit/debit cards, UPI, net banking, and cash on delivery (COD) for eligible orders.',
  },
  {
    id: '8',
    category: 'Payment',
    question: 'Is it safe to use my card?',
    answer: 'Yes, all transactions are secured with 256-bit encryption. We never store your CVV or complete card details.',
  },
];

export function MobileHelpPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(FAQS.map((faq) => faq.category)))];

  const filteredFAQs = FAQS.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-20 md:pb-12" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      {isMobile && <MobileSubPageHeader onBack={() => navigate('/account')} />}

      <div className={isMobile ? 'pt-[100px]' : 'pt-6 max-w-3xl mx-auto px-4'}>{/* Header + safe area */}
        {/* Header */}
        <div className="bg-white p-4 border-b border-border/20">
          <h1 className="text-2xl font-medium mb-1">Help Center</h1>
          <p className="text-sm text-foreground/60">
            Find answers to your questions
          </p>
        </div>

        {/* Search */}
        <div className="bg-white p-4 border-b border-border/20">
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={PH.searchHelp}
              className="w-full pl-12 pr-4 py-3 bg-muted/30 rounded-xl border border-border/20 focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-white px-4 py-3 border-b border-border/20">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-foreground/5 text-foreground/70'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="p-4 space-y-2">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle size={48} className="mx-auto text-foreground/20 mb-3" />
              <p className="text-foreground/60">No results found</p>
              <p className="text-sm text-foreground/40 mt-1">Try a different search term</p>
            </div>
          ) : (
            filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-white rounded-2xl border border-border/30 shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full p-4 flex items-start justify-between gap-3 text-left active:bg-foreground/5 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-xs text-primary font-medium mb-1">{faq.category}</p>
                    <p className="font-medium">{faq.question}</p>
                  </div>
                  {expandedIndex === index ? (
                    <ChevronUp size={20} className="text-foreground/40 flex-shrink-0 mt-1" />
                  ) : (
                    <ChevronDown size={20} className="text-foreground/40 flex-shrink-0 mt-1" />
                  )}
                </button>

                {expandedIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-4 pb-4"
                  >
                    <p className="text-sm text-foreground/70 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </div>

        {/* Contact Support */}
        <div className="p-4">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-4 border border-primary/20">
            <h3 className="font-medium mb-3">Still need help?</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-border/20 active:bg-foreground/5 transition-colors">
                <MessageCircle size={20} className="text-primary" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm">Live Chat</p>
                  <p className="text-xs text-foreground/60">Chat with our support team</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-border/20 active:bg-foreground/5 transition-colors">
                <Phone size={20} className="text-primary" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm">Call Us</p>
                  <p className="text-xs text-foreground/60">1800-123-4567</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-border/20 active:bg-foreground/5 transition-colors">
                <Mail size={20} className="text-primary" />
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm">Email Support</p>
                  <p className="text-xs text-foreground/60">support@rloco.com</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}