import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, User, Phone, X, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { RlocoLogo } from '@/app/components/RlocoLogo';
import { authService } from '@/app/services/authService';
import { SIGNUP_OTP_DRAFT_KEY } from '@/app/lib/signupOtpDraft';
import { getApiErrorMessage } from '@/app/lib/apiErrors';
import { useUser } from '@/app/context/UserContext';
import { GoogleSignInButton } from '@/app/components/GoogleSignInButton';

export function MobileSignupPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';
  const { refreshUser, loginWithGoogle } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all fields');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const phone = formData.phone.trim();
    setLoading(true);
    try {
      await authService.sendRegistrationOtp(phone);
      sessionStorage.setItem(
        SIGNUP_OTP_DRAFT_KEY,
        JSON.stringify({
          phone,
          email: formData.email.trim(),
          name: formData.name.trim(),
          password: formData.password,
        })
      );
      setOtpSent(true);
      setCountdown(60);
      toast.success('OTP sent to your phone');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not send verification code'));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    const raw = sessionStorage.getItem(SIGNUP_OTP_DRAFT_KEY);
    if (!raw) {
      toast.error('Session expired. Please start again.');
      setOtpSent(false);
      return;
    }
    let draft: { phone: string; email: string; name: string; password: string };
    try {
      draft = JSON.parse(raw) as typeof draft;
    } catch {
      toast.error('Session expired. Please start again.');
      setOtpSent(false);
      return;
    }

    setLoading(true);
    try {
      await authService.completeRegistrationOtp({
        phone: draft.phone,
        code: otpValue,
        email: draft.email,
        password: draft.password,
        name: draft.name,
      });
      sessionStorage.removeItem(SIGNUP_OTP_DRAFT_KEY);
      await refreshUser();
      toast.success('Account created successfully!');
      navigate(redirect, { replace: true });
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Verification failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    const raw = sessionStorage.getItem(SIGNUP_OTP_DRAFT_KEY);
    if (!raw) {
      toast.error('Session expired');
      setOtpSent(false);
      return;
    }
    try {
      const draft = JSON.parse(raw) as { phone: string };
      setLoading(true);
      await authService.sendRegistrationOtp(draft.phone);
      setCountdown(60);
      toast.success('OTP resent!');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not resend'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (idToken: string) => {
    const ok = await loginWithGoogle(idToken);
    if (ok) {
      toast.success('Signed in with Google!');
      navigate(redirect, { replace: true });
    } else {
      toast.error('Google sign-in failed. Please try again.');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-signup-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-signup-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div 
      className="min-h-screen bg-white flex flex-col" 
      style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Header with Close Button */}
      <div className="flex-shrink-0 px-4 pt-4 pb-2">
        <button
          onClick={() => navigate('/')}
          className="p-2 -ml-2 hover:bg-foreground/5 rounded-full transition-colors"
        >
          <X size={24} className="text-foreground/70" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-8">
        {!otpSent ? (
          <>
            {/* Logo & Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8 mt-4"
            >
              <div className="mb-4">
                <RlocoLogo size="md" />
              </div>
              <h1 className="text-3xl mb-2">Create Account</h1>
              <p className="text-foreground/60">Join Rloco today</p>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onSubmit={handleSendOTP}
              className="space-y-4 mb-6"
            >
              {/* Name Input */}
              <div>
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
                    className="w-full pl-11 pr-4 py-3.5 bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground/70">
                  Email
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email address"
                    className="w-full pl-11 pr-4 py-3.5 bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground/70">
                  Phone
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9876543210 or 10-digit"
                    className="w-full pl-11 pr-4 py-3.5 bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground/70">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="At least 6 characters"
                    minLength={6}
                    autoComplete="new-password"
                    className="w-full pl-11 pr-4 py-3.5 bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground/70">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm password"
                    minLength={6}
                    autoComplete="new-password"
                    className="w-full pl-11 pr-4 py-3.5 bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer text-sm pt-2">
                <input type="checkbox" required className="mt-1 rounded border-border/30" />
                <span className="text-foreground/60">
                  I agree to the{' '}
                  <button type="button" onClick={() => navigate('/terms')} className="text-primary">
                    Terms
                  </button>{' '}
                  and{' '}
                  <button type="button" onClick={() => navigate('/privacy')} className="text-primary">
                    Privacy Policy
                  </button>
                </span>
              </label>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-primary text-white py-4 rounded-full font-medium disabled:opacity-50 border border-border/30 shadow-sm mt-6"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                ) : (
                  'Send OTP'
                )}
              </motion.button>
            </motion.form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-border/30" />
              <span className="text-sm text-foreground/40">OR</span>
              <div className="flex-1 h-px bg-border/30" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <GoogleSignInButton
                onSuccess={handleGoogleSuccess}
                onError={(msg) => toast.error(msg)}
                shape="pill"
                theme="outline"
                size="large"
                className="rounded-full"
                customContent={
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-white border-2 border-border/30 shadow-sm py-4 rounded-full font-medium flex items-center justify-center gap-3"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M19.8 10.2273C19.8 9.51819 19.7364 8.83637 19.6182 8.18182H10.2V12.05H15.6091C15.3545 13.3 14.6182 14.3591 13.5273 15.0682V17.5773H16.7909C18.7091 15.8364 19.8 13.2727 19.8 10.2273Z" fill="#4285F4"/>
                      <path d="M10.2 20C12.9 20 15.1727 19.1045 16.7909 17.5773L13.5273 15.0682C12.6182 15.6682 11.4909 16.0227 10.2 16.0227C7.59091 16.0227 5.37273 14.2636 4.56364 11.9H1.19091V14.4909C2.80909 17.7591 6.22727 20 10.2 20Z" fill="#34A853"/>
                      <path d="M4.56364 11.9C4.34545 11.3 4.22727 10.6591 4.22727 10C4.22727 9.34091 4.34545 8.7 4.56364 8.1V5.50909H1.19091C0.527273 6.85909 0.136364 8.38636 0.136364 10C0.136364 11.6136 0.527273 13.1409 1.19091 14.4909L4.56364 11.9Z" fill="#FBBC05"/>
                      <path d="M10.2 3.97727C11.6091 3.97727 12.8636 4.48182 13.8545 5.43182L16.7364 2.6C15.1682 1.13636 12.8955 0.136364 10.2 0.136364C6.22727 0.136364 2.80909 2.37727 1.19091 5.50909L4.56364 8.1C5.37273 5.73636 7.59091 3.97727 10.2 3.97727Z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </motion.div>
                }
              />
            </motion.div>

            {/* Sign In Link */}
            <p className="text-center mt-6 text-sm text-foreground/60">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() =>
                  navigate(redirect !== '/account' ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login')
                }
                className="text-primary font-medium"
              >
                Sign in
              </button>
            </p>
          </>
        ) : (
          <>
            {/* OTP Verification */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-12"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone size={32} className="text-primary" />
                </div>
                <h2 className="text-3xl mb-2">Verify OTP</h2>
                <p className="text-foreground/60 px-4">
                  Enter the 6-digit code sent to<br />
                  <span className="font-medium text-foreground">{formData.phone}</span>
                </p>
              </div>

              <div className="flex gap-2 justify-center mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-signup-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-semibold bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                ))}
              </div>

              <motion.button
                onClick={handleVerifyOTP}
                disabled={loading || otp.join('').length !== 6}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-primary text-white py-4 rounded-full font-medium disabled:opacity-50 border border-border/30 shadow-sm mb-4"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                ) : (
                  'Verify & Create Account'
                )}
              </motion.button>

              <div className="text-center space-y-3">
                <button
                  onClick={handleResendOTP}
                  disabled={countdown > 0}
                  className="text-sm text-foreground/60 hover:text-primary transition-colors disabled:opacity-50"
                >
                  {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
                </button>

                <button
                  onClick={() => {
                    sessionStorage.removeItem(SIGNUP_OTP_DRAFT_KEY);
                    setOtpSent(false);
                  }}
                  className="text-sm text-foreground/60 hover:text-foreground block mx-auto"
                >
                  Change phone number
                </button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}