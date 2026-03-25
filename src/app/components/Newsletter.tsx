import { motion } from 'motion/react';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useSiteConfig } from '../context/SiteConfigContext';
import { newsletterService } from '../services/newsletterService';
import { PH } from '../lib/formPlaceholders';

export function Newsletter() {
  const { config } = useSiteConfig();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Don't render if newsletter signup is disabled
  if (!config.homepage.sections.newsletterSignup) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email?.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    setLoading(true);
    try {
      await newsletterService.subscribe(email.trim());
      toast.success('Thank you for subscribing!', {
        description: `We've sent a confirmation to ${email}`,
      });
      setEmail('');
    } catch (err: any) {
      toast.error(err?.message || 'Subscription failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-32 px-6 bg-accent/20 relative">
      <div className="max-w-4xl mx-auto" style={{ position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '4rem' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-0.5 bg-foreground mx-auto mb-8"
          />
          <h2 className="text-5xl md:text-6xl mb-6 tracking-tighter">
            Stay in Style
          </h2>
          <p className="text-xl text-foreground/70 mb-12 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive access to new collections, styling tips, and special offers.
          </p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={PH.email}
              className="flex-1 px-6 py-4 border border-border bg-background focus:outline-none focus:border-foreground transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
              <Send size={18} />
            </motion.button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm text-foreground/50 mt-6"
          >
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}