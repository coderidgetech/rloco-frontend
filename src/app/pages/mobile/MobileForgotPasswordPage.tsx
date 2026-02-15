import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, X } from 'lucide-react';
import { toast } from 'sonner';
import { Logo } from '@/app/components/Logo';

export function MobileForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setEmailSent(true);
      toast.success('Reset link sent to your email!');
      setLoading(false);
    }, 1500);
  };

  return (
    <div 
      className="min-h-screen bg-white flex flex-col" 
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Header with Back Button */}
      <div className="flex-shrink-0 px-4 pt-4 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-foreground/5 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-foreground/70" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-8">
        {!emailSent ? (
          <>
            {/* Logo & Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8 mt-12"
            >
              <div className="mb-6">
                <Logo />
              </div>
              <h1 className="text-3xl mb-2">Forgot Password?</h1>
              <p className="text-foreground/60 px-4">
                Enter your email and we'll send you a reset link
              </p>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground/70">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-primary text-white py-4 rounded-full font-medium disabled:opacity-50 border border-border/30 shadow-sm"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                ) : (
                  'Send Reset Link'
                )}
              </motion.button>
            </motion.form>

            {/* Back to Login */}
            <div className="text-center mt-8">
              <button
                onClick={() => navigate('/login')}
                className="text-sm text-foreground/60 flex items-center gap-2 justify-center mx-auto"
              >
                <ArrowLeft size={16} />
                Back to Login
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Success State */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center mt-20"
            >
              <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <path d="M40 24L20 44L12 36" stroke="#22C55E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              <h2 className="text-3xl mb-3">Check Your Email</h2>
              <p className="text-foreground/60 px-6 mb-8">
                We've sent a password reset link to<br />
                <span className="font-medium text-foreground">{email}</span>
              </p>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login')}
                className="w-full bg-primary text-white py-4 rounded-full font-medium border border-border/30 shadow-sm"
              >
                Back to Login
              </motion.button>

              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
                className="text-sm text-foreground/60 mt-6 block mx-auto"
              >
                Didn't receive? Try again
              </button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
