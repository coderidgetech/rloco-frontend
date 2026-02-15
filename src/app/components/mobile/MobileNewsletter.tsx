import { motion } from 'motion/react';
import { Mail, Send, Sparkles, Check } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function MobileNewsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
      toast.success('Successfully subscribed!');
    }, 1000);
  };

  return (
    <div className="py-6 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10">
      <div className="px-4">
        {!isSubmitted ? (
          <>
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3"
            >
              <Mail size={28} className="text-primary" />
            </motion.div>

            {/* Header */}
            <div className="text-center mb-4">
              <h2 className="text-xl font-medium mb-1.5">Stay in the Loop</h2>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Subscribe to get exclusive deals, early access to sales, and style tips
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-2 mb-4">
              {[
                '10% off your first order',
                'Early access to new collections',
                'Exclusive member-only sales',
                'Style tips & fashion trends',
              ].map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-white" />
                  </div>
                  <p className="text-sm text-foreground/70">{benefit}</p>
                </motion.div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mb-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-4 pr-14 rounded-full border-2 border-border bg-white text-sm focus:outline-none focus:border-primary transition-colors"
                />
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-5 bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-50"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles size={18} />
                    </motion.div>
                  ) : (
                    <Send size={18} />
                  )}
                </motion.button>
              </div>
            </form>

            {/* Privacy Note */}
            <p className="text-xs text-center text-foreground/50">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </>
        ) : (
          // Success State
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4"
            >
              <Check size={40} className="text-white" />
            </motion.div>
            <h3 className="text-xl font-medium mb-2">You're All Set!</h3>
            <p className="text-sm text-foreground/60 mb-4">
              Check your inbox for your welcome gift 🎁
            </p>
            <p className="text-xs text-foreground/50">
              Subscribed with: {email}
            </p>
          </motion.div>
        )}

        {/* Social Proof */}
        {!isSubmitted && (
          <div className="mt-6 pt-6 border-t border-border/30 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex -space-x-2">
                {[
                  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop',
                  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop',
                ].map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    className="w-8 h-8 rounded-full border-2 border-white"
                  />
                ))}
              </div>
              <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-white flex items-center justify-center">
                <span className="text-xs font-bold text-primary">5k+</span>
              </div>
            </div>
            <p className="text-xs text-foreground/60">
              Join 5,000+ subscribers getting exclusive benefits
            </p>
          </div>
        )}
      </div>
    </div>
  );
}