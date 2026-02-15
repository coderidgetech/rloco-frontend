import { motion } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Logo } from '@/app/components/Logo';

export function DesktopOTPVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Get data from navigation state
  const phone = location.state?.phone || '+1 (555) 000-0000';
  const returnTo = location.state?.returnTo || '/';
  const name = location.state?.name || '';
  const email = location.state?.email || '';
  const isSignup = location.state?.isSignup || false;

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();

    // Countdown timer for resend
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (index === 5 && value && newOtp.every(digit => digit !== '')) {
      handleVerify(newOtp);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (otpToVerify = otp) => {
    const otpString = otpToVerify.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Store auth data
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userPhone', phone);
    if (name) localStorage.setItem('userName', name);
    if (email) localStorage.setItem('userEmail', email);

    toast.success(isSignup ? 'Account created successfully!' : 'Phone verified successfully!');
    setLoading(false);
    navigate(returnTo, { replace: true });
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setResendTimer(60);
    toast.success('OTP resent successfully');
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - OTP Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="mb-12 flex justify-center">
            <Logo />
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl mb-3">Verify Your Number</h1>
            <p className="text-foreground/60">
              Enter the 6-digit code sent to{' '}
              <span className="font-medium text-foreground">{phone}</span>
            </p>
          </div>

          {/* OTP Input Grid */}
          <div className="flex gap-3 justify-center mb-8">
            {otp.map((digit, index) => (
              <motion.input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="w-14 h-14 text-center text-2xl font-medium bg-foreground/5 border-2 border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            ))}
          </div>

          {/* Resend Timer */}
          <div className="text-center mb-8">
            {resendTimer > 0 ? (
              <p className="text-sm text-foreground/60">
                Resend code in <span className="font-medium text-foreground">{resendTimer}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={loading}
                className="text-sm text-primary font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Resend Code
              </button>
            )}
          </div>

          {/* Verify Button */}
          <motion.button
            onClick={() => handleVerify()}
            disabled={loading || otp.some(digit => digit === '')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary text-white py-4 rounded-xl font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-border/30 shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Verify & Continue'
            )}
          </motion.button>

          {/* Back Button */}
          <div className="text-center mt-8">
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-foreground/40 hover:text-foreground transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Image with Overlay */}
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
            <div className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h2 className="text-4xl mb-4 drop-shadow-lg">Secure Verification</h2>
            <p className="text-lg text-white/90 drop-shadow-md leading-relaxed">
              We've sent a verification code to your phone for added security.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
