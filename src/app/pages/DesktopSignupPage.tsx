import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, User, ArrowRight, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { RlocoLogo } from '@/app/components/RlocoLogo';

export function DesktopSignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    setIsLoading(true);
    
    // Simulate sending OTP
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('OTP sent to your phone');
    setIsLoading(false);
    
    // Navigate to OTP verification page with signup data
    navigate('/otp-verification', { 
      state: { 
        phone: formData.phone, 
        name: formData.name,
        email: formData.email,
        returnTo: '/account',
        isSignup: true
      } 
    });
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    
    // Simulate Google auth
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Store auth state
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userName', 'Google User');
    localStorage.setItem('userEmail', 'user@gmail.com');
    
    toast.success('Successfully signed up with Google!');
    setIsLoading(false);
    navigate('/account');
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Image with Overlay */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 z-10" />
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80"
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
            <h2 className="text-5xl mb-6 drop-shadow-lg">Join Rloco</h2>
            <p className="text-xl text-white/90 drop-shadow-md leading-relaxed">
              Start your journey with exclusive access to luxury fashion and personalized style experiences.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <RlocoLogo size="md" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl mb-3">Create Account</h1>
            <p className="text-foreground/60">Join Rloco today</p>
          </div>

          {/* Google Sign Up - Primary Option */}
          <motion.button
            type="button"
            onClick={handleGoogleSignup}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white border-2 border-border/30 shadow-sm text-foreground py-4 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-foreground/5 transition-all mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M19.8 10.2273C19.8 9.51819 19.7364 8.83637 19.6182 8.18182H10.2V12.05H15.6091C15.3545 13.3 14.6182 14.3591 13.5273 15.0682V17.5773H16.7909C18.7091 15.8364 19.8 13.2727 19.8 10.2273Z" fill="#4285F4"/>
              <path d="M10.2 20C12.9 20 15.1727 19.1045 16.7909 17.5773L13.5273 15.0682C12.6182 15.6682 11.4909 16.0227 10.2 16.0227C7.59091 16.0227 5.37273 14.2636 4.56364 11.9H1.19091V14.4909C2.80909 17.7591 6.22727 20 10.2 20Z" fill="#34A853"/>
              <path d="M4.56364 11.9C4.34545 11.3 4.22727 10.6591 4.22727 10C4.22727 9.34091 4.34545 8.7 4.56364 8.1V5.50909H1.19091C0.527273 6.85909 0.136364 8.38636 0.136364 10C0.136364 11.6136 0.527273 13.1409 1.19091 14.4909L4.56364 11.9Z" fill="#FBBC05"/>
              <path d="M10.2 3.97727C11.6091 3.97727 12.8636 4.48182 13.8545 5.43182L16.7364 2.6C15.1682 1.13636 12.8955 0.136364 10.2 0.136364C6.22727 0.136364 2.80909 2.37727 1.19091 5.50909L4.56364 8.1C5.37273 5.73636 7.59091 3.97727 10.2 3.97727Z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-border/30" />
            <span className="text-sm text-foreground/40">OR</span>
            <div className="flex-1 h-px bg-border/30" />
          </div>

          {/* Signup Form with Phone OTP */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div className="relative">
              <label className="block text-sm font-medium mb-2 text-foreground/70">
                Full Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full name"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="relative">
              <label className="block text-sm font-medium mb-2 text-foreground/70">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email address"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Phone Input */}
            <div className="relative">
              <label className="block text-sm font-medium mb-2 text-foreground/70">
                Phone Number
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Phone number"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <p className="text-xs text-foreground/50 mt-2">We'll send you an OTP to verify your number</p>
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
                  Create Account
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-8 text-sm text-foreground/60">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </button>
          </p>

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
    </div>
  );
}
