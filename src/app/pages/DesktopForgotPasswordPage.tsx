import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { RlocoLogo } from '@/app/components/RlocoLogo';

export function DesktopForgotPasswordPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    setIsLoading(true);
    
    // Simulate sending OTP
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('OTP sent to your phone');
    setIsLoading(false);
    
    // Navigate to OTP verification page
    navigate('/otp-verification', { state: { phone, returnTo: '/account', resetPassword: true } });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:p-8 pt-page-nav pb-mobile-nav lg:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="mb-12 flex justify-center">
            <RlocoLogo size="md" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl mb-3">Account Recovery</h1>
            <p className="text-foreground/60">Enter your phone number to receive a verification code</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Phone Input */}
            <div className="relative">
              <label className="block text-sm font-medium mb-2 text-foreground/70">
                Phone Number
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <p className="text-xs text-foreground/50 mt-2">We'll send you an OTP to verify your account</p>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-primary text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-border/30 shadow-sm"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Send Verification Code
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* Back to Login */}
          <div className="text-center mt-8">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-primary font-medium hover:underline flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Sign In
            </button>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-foreground/40 hover:text-foreground transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Image with Overlay */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 z-10" />
        <img
          src="https://images.unsplash.com/photo-1558769132-cb1aea3c9472?w=1200&q=80"
          alt="Fashion"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.9) contrast(1.1)' }}
        />
        
        {/* Overlay Content */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center max-w-md"
          >
            <h2 className="text-5xl mb-6 drop-shadow-lg">Account Recovery</h2>
            <p className="text-xl text-white/90 drop-shadow-md leading-relaxed">
              We'll help you get back to your Rloco account securely.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
