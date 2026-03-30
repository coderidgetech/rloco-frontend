import { motion } from 'motion/react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { useState } from 'react';

export function FAQPage() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqCategories = [
    {
      category: 'Orders & Shipping',
      questions: [
        {
          question: 'How long does shipping take?',
          answer: 'Standard shipping typically takes 3-5 business days within the continental US. Express shipping (1-2 business days) and international shipping options are also available at checkout.',
        },
        {
          question: 'Do you ship internationally?',
          answer: 'Yes! We ship to over 100 countries worldwide. International shipping times vary by location but typically range from 7-14 business days. Customs fees and duties may apply.',
        },
        {
          question: 'Can I track my order?',
          answer: 'Absolutely! Once your order ships, you\'ll receive a tracking number via email. You can also track your order status by logging into your account.',
        },
        {
          question: 'Can I change or cancel my order?',
          answer: 'Orders can be modified or cancelled within 1 hour of placement. After that, our system automatically begins processing. Please contact customer service immediately if you need assistance.',
        },
      ],
    },
    {
      category: 'Returns & Exchanges',
      questions: [
        {
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy from the date of delivery. Items must be unworn, unwashed, and in original condition with all tags attached.',
        },
        {
          question: 'How do I initiate a return?',
          answer: 'Log into your account, go to order history, and select the items you wish to return. You\'ll receive a prepaid return label via email.',
        },
        {
          question: 'Do you offer exchanges?',
          answer: 'We currently don\'t offer direct exchanges. Please return the item for a refund and place a new order for the item you\'d like instead.',
        },
        {
          question: 'When will I receive my refund?',
          answer: 'Refunds are processed within 5-7 business days after we receive your return. The refund will be issued to your original payment method.',
        },
      ],
    },
    {
      category: 'Products & Sizing',
      questions: [
        {
          question: 'How do I find my size?',
          answer: 'Visit our Size Guide page for detailed measurements and fitting tips. Each product page also includes specific sizing information for that item.',
        },
        {
          question: 'Are your products true to size?',
          answer: 'Yes, our products generally fit true to size. However, we recommend checking the Size Guide and product descriptions, as some items may have a specific fit (e.g., oversized, slim fit).',
        },
        {
          question: 'What materials are your products made from?',
          answer: 'We use premium materials including organic cotton, silk, cashmere, and sustainable fabrics. Detailed material information is listed on each product page.',
        },
        {
          question: 'How do I care for my items?',
          answer: 'Care instructions are included on the product tags and on each product page. We recommend following these guidelines to maintain the quality of your garments.',
        },
      ],
    },
    {
      category: 'Account & Payment',
      questions: [
        {
          question: 'Do I need an account to place an order?',
          answer: 'No, you can checkout as a guest. However, creating an account allows you to track orders, save items to your wishlist, and enjoy a faster checkout experience.',
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), Apple Pay, and Google Pay (processed securely via Stripe).',
        },
        {
          question: 'Is my payment information secure?',
          answer: 'Yes, we use industry-standard SSL encryption to protect your payment information. We never store your complete credit card details on our servers.',
        },
        {
          question: 'Can I save multiple addresses?',
          answer: 'Yes! Once you create an account, you can save multiple shipping and billing addresses for convenient checkout.',
        },
      ],
    },
    {
      category: 'Sustainability & Ethics',
      questions: [
        {
          question: 'Are your products sustainably made?',
          answer: 'Yes, sustainability is core to our brand. We use eco-friendly materials, ethical manufacturing practices, and work with certified suppliers who share our values.',
        },
        {
          question: 'Do you use ethical labor practices?',
          answer: 'Absolutely. We partner only with manufacturers who adhere to fair labor standards and provide safe working conditions. We regularly audit our supply chain.',
        },
        {
          question: 'What is your packaging made from?',
          answer: 'Our packaging is made from recycled and recyclable materials. We\'re constantly working to reduce our environmental impact throughout the entire customer experience.',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-page-nav pb-mobile-nav">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 border-b border-foreground/10">
        <div className="w-full px-2 md:px-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl mb-6">Frequently Asked Questions</h1>
            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
              Find answers to common questions about orders, shipping, returns, and more.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 md:py-24">
        <div className="w-full px-2 md:px-4">
          <div className="max-w-4xl mx-auto">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="mb-12"
              >
                <h2 className="text-2xl md:text-3xl font-medium mb-6 pb-4 border-b border-foreground/10">
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.questions.map((faq, index) => {
                    const globalIndex = categoryIndex * 100 + index;
                    const isOpen = openIndex === globalIndex;

                    return (
                      <div
                        key={index}
                        className="border border-foreground/10 overflow-hidden transition-all"
                      >
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                          className="w-full flex items-center justify-between p-6 text-left hover:bg-foreground/5 transition-colors"
                        >
                          <span className="font-medium pr-4">{faq.question}</span>
                          <ChevronDown
                            className={`flex-shrink-0 transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                            size={20}
                          />
                        </button>
                        <motion.div
                          initial={false}
                          animate={{
                            height: isOpen ? 'auto' : 0,
                            opacity: isOpen ? 1 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 pt-0 text-foreground/70 leading-relaxed">
                            {faq.answer}
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-20 md:py-24 border-t border-foreground/10">
        <div className="w-full px-2 md:px-4">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl mb-6">Still Have Questions?</h2>
              <p className="text-lg text-foreground/60 mb-8">
                Can't find what you're looking for? Our customer service team is here to help.
              </p>
              <button
                onClick={() => navigate('/contact')}
                className="px-8 py-3 bg-foreground text-background hover:bg-foreground/90 transition-colors"
              >
                Contact Us
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
