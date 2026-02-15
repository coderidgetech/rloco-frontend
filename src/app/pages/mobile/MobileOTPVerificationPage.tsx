import { motion } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

export function MobileOTPVerificationPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
    setTimeout(() => {
      // For demo, accept any 6-digit code
      toast.success('Phone verified successfully!');
      navigate('/', { replace: true });
    }, 1500);
  };

  const handleResend = () => {
    if (resendTimer > 0) return;

    setResendTimer(60);
    toast.success('OTP resent successfully');
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-4 pb-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center mb-6"
        >
          <ChevronLeft size={20} />
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-2xl font-medium mb-2">Verify Your Number</h1>
          <p className="text-sm text-foreground/60">
            Enter the 6-digit code sent to{' '}
            <span className="font-medium text-foreground">+1 (555) 123-4567</span>
          </p>
        </motion.div>
      </div>

      {/* OTP Input */}
      <div className="flex-1 px-6 pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Illustration */}
          <div className="flex justify-center mb-12">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" strokeWidth="2" />
                <path d="M12 18h.01" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* OTP Input Fields */}
          <div className="flex gap-3 justify-center mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl font-semibold bg-foreground/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            ))}
          </div>

          {/* Verify Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => handleVerify()}
            disabled={loading || otp.some(digit => !digit)}
            className="w-full bg-primary text-white py-4 rounded-full font-medium text-sm disabled:opacity-50 transition-all mb-6"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                Verifying...
              </span>
            ) : (
              'Verify OTP'
            )}
          </motion.button>

          {/* Resend */}
          <div className="text-center">
            <p className="text-sm text-foreground/60 mb-2">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResend}
              disabled={resendTimer > 0}
              className="text-sm font-medium text-primary disabled:text-foreground/40 disabled:cursor-not-allowed"
            >
              {resendTimer > 0 ? (
                `Resend in ${resendTimer}s`
              ) : (
                'Resend Code'
              )}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Help Text */}
      <div className="flex-shrink-0 px-6 py-6 text-center bg-foreground/5" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <p className="text-xs text-foreground/50">
          Having trouble? Contact our support team
        </p>
      </div>
    </div>
  );
}
