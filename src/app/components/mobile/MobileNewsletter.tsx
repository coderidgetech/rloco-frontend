import { motion } from 'motion/react';
import { Mail, Send, Sparkles, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { PH } from '@/app/lib/formPlaceholders';
import { useSiteConfig } from '@/app/context/SiteConfigContext';
import { newsletterService } from '@/app/services/newsletterService';
import { getApiErrorMessage } from '@/app/lib/apiErrors';

export function MobileNewsletter() {
  const { config } = useSiteConfig();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!config.homepage.sections.newsletterSignup) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email?.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    try {
      await newsletterService.subscribe(email.trim());
      setIsSubmitted(true);
      toast.success('Successfully subscribed!');
      setEmail('');
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Subscription failed. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-6 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10">
      <div className="px-4">
        {!isSubmitted ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3"
            >
              <Mail size={28} className="text-primary" />
            </motion.div>

            <div className="text-center mb-4">
              <h2 className="text-xl font-medium mb-1.5">Stay in the Loop</h2>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Subscribe to get exclusive deals, early access to sales, and style tips
              </p>
            </div>

            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={PH.email}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <motion.button
                type="submit"
                disabled={isLoading}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? 'Subscribing...' : (
                  <>
                    <Send size={16} />
                    Subscribe
                  </>
                )}
              </motion.button>
            </form>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-6"
          >
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
              <Check size={28} className="text-green-600" />
            </div>
            <h3 className="text-lg font-medium mb-1">You&apos;re subscribed!</h3>
            <p className="text-sm text-foreground/60 mb-4">Thanks for joining our list.</p>
            <Sparkles className="mx-auto text-primary/40" size={20} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
