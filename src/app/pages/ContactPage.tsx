import { motion } from 'motion/react';
import { Footer } from '../components/Footer';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { LuxuryInput } from '../components/ui/luxury-input';
import { LuxuryTextarea } from '../components/ui/luxury-textarea';
import { LuxurySelect } from '../components/ui/luxury-select';
import { useSiteConfig } from '../context/SiteConfigContext';

export function ContactPage() {
  const { config } = useSiteConfig();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    toast.success('Message sent! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-background pt-[72px]">
      {/* Hero Section */}
      <div className="border-b border-foreground/5">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs uppercase tracking-[0.3em] text-foreground/60 mb-6 block">Get in Touch</span>
            <h1 className="text-4xl md:text-6xl uppercase tracking-[0.2em] mb-8">
              Contact Us
            </h1>
            <p className="text-lg text-foreground/70 leading-relaxed max-w-2xl mx-auto">
              Have a question or feedback? We'd love to hear from you. Reach out to our team and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl uppercase tracking-[0.15em] mb-8">Get in Touch</h2>
            
            <div className="space-y-8">
              {/* Email */}
              <div className="flex gap-4">
                <div className="w-12 h-12 border border-foreground/10 flex items-center justify-center flex-shrink-0">
                  <Mail size={20} className="text-foreground/60" />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-[0.3em] mb-2">Email Us</h3>
                  <a href={`mailto:${config.general.supportEmail}`} className="text-foreground/70 hover:text-foreground transition-colors">
                    {config.general.supportEmail}
                  </a>
                  <p className="text-sm text-foreground/50 mt-1">For general inquiries</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4">
                <div className="w-12 h-12 border border-foreground/10 flex items-center justify-center flex-shrink-0">
                  <Phone size={20} className="text-foreground/60" />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-[0.3em] mb-2">Call Us</h3>
                  <a href={`tel:${config.general.phone.replace(/\s/g, '')}`} className="text-foreground/70 hover:text-foreground transition-colors">
                    {config.general.phone}
                  </a>
                  <p className="text-sm text-foreground/50 mt-1">Mon-Fri, 9AM-6PM</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex gap-4">
                <div className="w-12 h-12 border border-foreground/10 flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-foreground/60" />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-[0.3em] mb-2">Visit Us</h3>
                  <p className="text-foreground/70">
                    {config.general.address.split(',').map((line, i) => (
                      <span key={i}>
                        {line.trim()}
                        {i < config.general.address.split(',').length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex gap-4">
                <div className="w-12 h-12 border border-foreground/10 flex items-center justify-center flex-shrink-0">
                  <Clock size={20} className="text-foreground/60" />
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-[0.3em] mb-2">Business Hours</h3>
                  <div className="text-foreground/70 space-y-1 text-sm">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Link */}
            <div className="mt-12 p-6 border border-foreground/10 bg-foreground/[0.02]">
              <h3 className="text-sm uppercase tracking-[0.3em] mb-3">Quick Help</h3>
              <p className="text-sm text-foreground/60 mb-4">
                Looking for quick answers? Check out our FAQ section for common questions about orders, shipping, and returns.
              </p>
              <a 
                href="/faq" 
                className="text-sm underline hover:no-underline transition-all"
              >
                Visit FAQ →
              </a>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl uppercase tracking-[0.15em] mb-8">Send a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <LuxuryInput
                label="Full Name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
              />

              <LuxuryInput
                label="Email Address"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email address"
              />

              <LuxuryInput
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
              />

              <LuxurySelect
                label="Subject"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              >
                <option value="">Select a subject</option>
                <option value="order">Order Inquiry</option>
                <option value="product">Product Question</option>
                <option value="shipping">Shipping & Delivery</option>
                <option value="return">Returns & Exchanges</option>
                <option value="wholesale">Wholesale Inquiry</option>
                <option value="other">Other</option>
              </LuxurySelect>

              <LuxuryTextarea
                label="Message"
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                placeholder="Tell us how we can help you..."
              />

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-14 bg-foreground text-background hover:bg-foreground/90 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                <Send size={16} />
                Send Message
              </motion.button>

              <p className="text-xs text-foreground/50 text-center">
                We typically respond within 24 hours during business days
              </p>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Map Section (Placeholder) */}
      <div className="border-t border-foreground/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="aspect-[16/9] md:aspect-[21/9] bg-foreground/5 flex items-center justify-center"
          >
            <div className="text-center">
              <MapPin size={48} className="mx-auto mb-4 text-foreground/20" />
              <p className="text-sm uppercase tracking-[0.3em] text-foreground/40">Store Location Map</p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}