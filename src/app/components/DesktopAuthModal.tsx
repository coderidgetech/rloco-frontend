import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, X, User, Phone, ArrowLeft, ChevronDown, Search } from 'lucide-react';
import { toast } from 'sonner';
import { RlocoLogo } from './RlocoLogo';
import { useUser } from '../context/UserContext';
import { GoogleSignInButton } from './GoogleSignInButton';
import { authService } from '../services/authService';
import { SIGNUP_OTP_DRAFT_KEY, type SignupOtpDraft } from '../lib/signupOtpDraft';
import { getApiErrorMessage } from '../lib/apiErrors';

const COUNTRIES = [
  { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
  { code: 'IN', name: 'India', dialCode: '+91', flag: '🇮🇳' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', dialCode: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', dialCode: '+61', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', dialCode: '+49', flag: '🇩🇪' },
  { code: 'FR', name: 'France', dialCode: '+33', flag: '🇫🇷' },
  { code: 'IT', name: 'Italy', dialCode: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', dialCode: '+34', flag: '🇪🇸' },
  { code: 'MX', name: 'Mexico', dialCode: '+52', flag: '🇲🇽' },
  { code: 'BR', name: 'Brazil', dialCode: '+55', flag: '🇧🇷' },
  { code: 'JP', name: 'Japan', dialCode: '+81', flag: '🇯🇵' },
  { code: 'CN', name: 'China', dialCode: '+86', flag: '🇨🇳' },
  { code: 'KR', name: 'South Korea', dialCode: '+82', flag: '🇰🇷' },
  { code: 'SG', name: 'Singapore', dialCode: '+65', flag: '🇸🇬' },
  { code: 'AE', name: 'UAE', dialCode: '+971', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966', flag: '🇸🇦' },
  { code: 'ZA', name: 'South Africa', dialCode: '+27', flag: '🇿🇦' },
  { code: 'NL', name: 'Netherlands', dialCode: '+31', flag: '🇳🇱' },
  { code: 'SE', name: 'Sweden', dialCode: '+46', flag: '🇸🇪' },
  { code: 'CH', name: 'Switzerland', dialCode: '+41', flag: '🇨🇭' },
  { code: 'BE', name: 'Belgium', dialCode: '+32', flag: '🇧🇪' },
  { code: 'AT', name: 'Austria', dialCode: '+43', flag: '🇦🇹' },
  { code: 'NO', name: 'Norway', dialCode: '+47', flag: '🇳🇴' },
  { code: 'DK', name: 'Denmark', dialCode: '+45', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', dialCode: '+358', flag: '🇫🇮' },
  { code: 'PL', name: 'Poland', dialCode: '+48', flag: '🇵🇱' },
  { code: 'RU', name: 'Russia', dialCode: '+7', flag: '🇷🇺' },
  { code: 'TR', name: 'Turkey', dialCode: '+90', flag: '🇹🇷' },
  { code: 'ID', name: 'Indonesia', dialCode: '+62', flag: '🇮🇩' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '🇲🇾' },
  { code: 'TH', name: 'Thailand', dialCode: '+66', flag: '🇹🇭' },
  { code: 'VN', name: 'Vietnam', dialCode: '+84', flag: '🇻🇳' },
  { code: 'PH', name: 'Philippines', dialCode: '+63', flag: '🇵🇭' },
  { code: 'NZ', name: 'New Zealand', dialCode: '+64', flag: '🇳🇿' },
  { code: 'AR', name: 'Argentina', dialCode: '+54', flag: '🇦🇷' },
  { code: 'CL', name: 'Chile', dialCode: '+56', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', dialCode: '+57', flag: '🇨🇴' },
  { code: 'PE', name: 'Peru', dialCode: '+51', flag: '🇵🇪' },
  { code: 'EG', name: 'Egypt', dialCode: '+20', flag: '🇪🇬' },
  { code: 'NG', name: 'Nigeria', dialCode: '+234', flag: '🇳🇬' },
  { code: 'KE', name: 'Kenya', dialCode: '+254', flag: '🇰🇪' },
  { code: 'GH', name: 'Ghana', dialCode: '+233', flag: '🇬🇭' },
  { code: 'IL', name: 'Israel', dialCode: '+972', flag: '🇮🇱' },
  { code: 'PK', name: 'Pakistan', dialCode: '+92', flag: '🇵🇰' },
  { code: 'BD', name: 'Bangladesh', dialCode: '+880', flag: '🇧🇩' },
  { code: 'LK', name: 'Sri Lanka', dialCode: '+94', flag: '🇱🇰' },
  { code: 'PT', name: 'Portugal', dialCode: '+351', flag: '🇵🇹' },
  { code: 'GR', name: 'Greece', dialCode: '+30', flag: '🇬🇷' },
  { code: 'IE', name: 'Ireland', dialCode: '+353', flag: '🇮🇪' },
];

interface DesktopAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'signup';
}

type ViewType = 'login' | 'signup' | 'otp-verification';

export function DesktopAuthModal({ isOpen, onClose, initialView = 'login' }: DesktopAuthModalProps) {
  const navigate = useNavigate();
  const { loginWithGoogle, refreshUser } = useUser();
  const [currentView, setCurrentView] = useState<ViewType>(initialView);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  /** Which flow produced the current OTP screen (login stays demo; signup uses Twilio Verify). */
  const [otpFlow, setOtpFlow] = useState<'login' | 'signup' | null>(null);
  
  // Country selector
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[1]); // Default to India
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setOtpFlow('login');
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setOtpSent(true);
      setCurrentView('otp-verification');
      startCountdown();
      toast.success('OTP sent to your phone');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendSignupOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.name.trim() || !signupData.email.trim() || !signupData.phone.trim()) {
      toast.error('Please fill in all fields');
      return;
    }
    if (signupData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    const phoneForApi = signupData.phone.trim();
    setIsLoading(true);
    try {
      await authService.sendRegistrationOtp(phoneForApi);
      sessionStorage.setItem(
        SIGNUP_OTP_DRAFT_KEY,
        JSON.stringify({
          phone: phoneForApi,
          email: signupData.email.trim(),
          name: signupData.name.trim(),
          password: signupData.password,
        } satisfies SignupOtpDraft)
      );
      setPhone(phoneForApi);
      setOtpFlow('signup');
      setOtpSent(true);
      setCurrentView('otp-verification');
      startCountdown();
      toast.success('OTP sent to your phone');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not send verification code'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    setIsLoading(true);
    try {
      if (otpFlow === 'signup') {
        const raw = sessionStorage.getItem(SIGNUP_OTP_DRAFT_KEY);
        if (!raw) {
          toast.error('Signup session expired. Please try again.');
          setCurrentView('signup');
          setOtpSent(false);
          setOtpFlow(null);
          return;
        }
        const draft = JSON.parse(raw) as SignupOtpDraft;
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
        resetAndClose();
        navigate('/account');
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 800));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', signupData.email || 'user@rloco.com');
      localStorage.setItem('userName', signupData.name || phone);
      localStorage.setItem('userPhone', phone || signupData.phone);
      toast.success('Successfully verified!');
      resetAndClose();
      navigate('/account');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Verification failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    try {
      if (otpFlow === 'signup') {
        const raw = sessionStorage.getItem(SIGNUP_OTP_DRAFT_KEY);
        if (!raw) {
          toast.error('Session expired');
          return;
        }
        const draft = JSON.parse(raw) as SignupOtpDraft;
        await authService.sendRegistrationOtp(draft.phone);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
      startCountdown();
      toast.success('OTP resent!');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not resend'));
    } finally {
      setIsLoading(false);
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
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleGoogleSuccess = async (idToken: string) => {
    const ok = await loginWithGoogle(idToken);
    if (ok) {
      toast.success('Signed in with Google!');
      resetAndClose();
      navigate('/account');
    } else {
      toast.error('Google sign-in failed. Please try again.');
    }
  };

  const resetAndClose = () => {
    setCurrentView(initialView);
    setPhone('');
    setOtp(['', '', '', '', '', '']);
    setOtpSent(false);
    setCountdown(0);
    setOtpFlow(null);
    setSignupData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative"
            >
              {/* Close Button */}
              <button
                onClick={resetAndClose}
                className="absolute top-4 right-4 p-2 hover:bg-foreground/5 rounded-full transition-colors z-10"
              >
                <X size={20} className="text-foreground/70" />
              </button>

              <div className="p-8">
                {/* Login View */}
                {currentView === 'login' && !otpSent && (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="text-center mb-8">
                      <div className="mb-6">
                        <RlocoLogo size="md" />
                      </div>
                      <h2 className="text-3xl mb-2">Welcome Back</h2>
                      <p className="text-foreground/60">Sign in with your phone number</p>
                    </div>

                    <form onSubmit={handleSendOTP} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-foreground/70">
                          Phone Number
                        </label>
                        <div className="flex gap-2">
                          {/* Country Selector */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setShowCountryPicker(!showCountryPicker)}
                              className="h-[52px] px-3 bg-white border border-border/30 shadow-sm hover:border-border/50 rounded-xl transition-all flex items-center gap-2 min-w-[110px]"
                            >
                              <span className="text-xl">{selectedCountry.flag}</span>
                              <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
                              <ChevronDown size={14} className={`text-foreground/40 transition-transform ${showCountryPicker ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Country Picker Dropdown */}
                            {showCountryPicker && (
                              <>
                                {/* Backdrop */}
                                <div 
                                  className="fixed inset-0 z-40" 
                                  onClick={() => setShowCountryPicker(false)}
                                />
                                
                                {/* Dropdown */}
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="absolute left-0 top-full mt-2 w-80 bg-white border border-border/30 shadow-2xl rounded-lg overflow-hidden z-50"
                                >
                                  {/* Search */}
                                  <div className="p-3 border-b border-border/20 bg-muted/10">
                                    <div className="relative">
                                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
                                      <input
                                        type="text"
                                        value={countrySearch}
                                        onChange={(e) => setCountrySearch(e.target.value)}
                                        placeholder="Search country..."
                                        className="w-full pl-9 pr-3 py-2 bg-white border border-border/30 shadow-sm text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B4770E]/20 focus:border-[#B4770E]"
                                      />
                                    </div>
                                  </div>

                                  {/* Country List */}
                                  <div className="max-h-64 overflow-y-auto">
                                    {COUNTRIES.filter(country => 
                                      country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
                                      country.dialCode.includes(countrySearch) ||
                                      country.code.toLowerCase().includes(countrySearch.toLowerCase())
                                    ).map((country) => (
                                      <button
                                        key={country.code}
                                        type="button"
                                        onClick={() => {
                                          setSelectedCountry(country);
                                          setShowCountryPicker(false);
                                          setCountrySearch('');
                                        }}
                                        className={`w-full px-4 py-2.5 flex items-center gap-3 hover:bg-muted/30 transition-colors ${selectedCountry.code === country.code ? 'bg-[#B4770E]/10' : ''}`}
                                      >
                                        <span className="text-xl">{country.flag}</span>
                                        <div className="flex-1 text-left">
                                          <div className="text-sm font-medium">{country.name}</div>
                                          <div className="text-xs text-foreground/50">{country.code}</div>
                                        </div>
                                        <span className="text-sm font-medium text-foreground/70">{country.dialCode}</span>
                                      </button>
                                    ))}
                                  </div>
                                </motion.div>
                              </>
                            )}
                          </div>

                          {/* Phone Input */}
                          <div className="flex-1 relative">
                            <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="Phone number"
                              required
                              className="w-full pl-11 pr-4 py-3 bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-primary text-white py-3 rounded-xl font-medium disabled:opacity-50 border border-border/30 shadow-sm"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                        ) : (
                          'Send OTP'
                        )}
                      </motion.button>
                    </form>

                    <div className="flex items-center gap-4 my-6">
                      <div className="flex-1 h-px bg-border/30" />
                      <span className="text-sm text-foreground/40">OR</span>
                      <div className="flex-1 h-px bg-border/30" />
                    </div>

                    <GoogleSignInButton
                      onSuccess={handleGoogleSuccess}
                      onError={(msg) => toast.error(msg)}
                    />

                    <p className="text-center mt-6 text-sm text-foreground/60">
                      Don't have an account?{' '}
                      <button
                        onClick={() => setCurrentView('signup')}
                        className="text-primary font-medium hover:underline"
                      >
                        Sign up
                      </button>
                    </p>
                  </motion.div>
                )}

                {/* Signup View */}
                {currentView === 'signup' && !otpSent && (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="text-center mb-6">
                      <div className="mb-4">
                        <RlocoLogo size="md" />
                      </div>
                      <h2 className="text-3xl mb-2">Create Account</h2>
                      <p className="text-foreground/60">Join Rloco today</p>
                    </div>

                    <form onSubmit={handleSendSignupOTP} className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-foreground/70">
                          Full Name
                        </label>
                        <div className="relative">
                          <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
                          <input
                            type="text"
                            value={signupData.name}
                            onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                            placeholder="Full name"
                            required
                            className="w-full pl-10 pr-4 py-2.5 bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-foreground/70">
                          Email
                        </label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
                          <input
                            type="email"
                            value={signupData.email}
                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                            placeholder="Email address"
                            required
                            className="w-full pl-10 pr-4 py-2.5 bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-foreground/70">
                          Phone
                        </label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
                          <input
                            type="tel"
                            value={signupData.phone}
                            onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                            placeholder="+91 9876543210 or 10-digit number"
                            required
                            className="w-full pl-10 pr-4 py-2.5 bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-foreground/70">
                          Password
                        </label>
                        <input
                          type="password"
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          placeholder="At least 6 characters"
                          required
                          minLength={6}
                          autoComplete="new-password"
                          className="w-full px-4 py-2.5 bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-foreground/70">
                          Confirm password
                        </label>
                        <input
                          type="password"
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                          placeholder="Confirm password"
                          required
                          minLength={6}
                          autoComplete="new-password"
                          className="w-full px-4 py-2.5 bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                        />
                      </div>

                      <label className="flex items-start gap-2 cursor-pointer text-xs pt-2">
                        <input type="checkbox" required className="mt-0.5 rounded border-border/30" />
                        <span className="text-foreground/60">
                          I agree to the{' '}
                          <button type="button" className="text-primary hover:underline">Terms</button>
                          {' '}and{' '}
                          <button type="button" className="text-primary hover:underline">Privacy Policy</button>
                        </span>
                      </label>

                      <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-primary text-white py-3 rounded-xl font-medium disabled:opacity-50 border border-border/30 shadow-sm mt-4"
                      >
                        {isLoading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                        ) : (
                          'Send OTP'
                        )}
                      </motion.button>
                    </form>

                    <div className="flex items-center gap-4 my-5">
                      <div className="flex-1 h-px bg-border/30" />
                      <span className="text-xs text-foreground/40">OR</span>
                      <div className="flex-1 h-px bg-border/30" />
                    </div>

                    <GoogleSignInButton
                      onSuccess={handleGoogleSuccess}
                      onError={(msg) => toast.error(msg)}
                      label="signup"
                    />

                    <p className="text-center mt-5 text-sm text-foreground/60">
                      Already have an account?{' '}
                      <button
                        onClick={() => setCurrentView('login')}
                        className="text-primary font-medium hover:underline"
                      >
                        Sign in
                      </button>
                    </p>
                  </motion.div>
                )}

                {/* OTP Verification View */}
                {currentView === 'otp-verification' && (
                  <motion.div
                    key="otp-verification"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <button
                      onClick={() => {
                        setCurrentView(signupData.name ? 'signup' : 'login');
                        setOtpSent(false);
                        setOtp(['', '', '', '', '', '']);
                      }}
                      className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground mb-6 transition-colors"
                    >
                      <ArrowLeft size={16} />
                      Back
                    </button>

                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Phone size={28} className="text-primary" />
                      </div>
                      <h2 className="text-3xl mb-2">Verify OTP</h2>
                      <p className="text-foreground/60">
                        Enter the 6-digit code sent to<br />
                        <span className="font-medium text-foreground">
                          {phone || signupData.phone}
                        </span>
                      </p>
                    </div>

                    <div className="flex gap-2 justify-center mb-6">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-12 h-12 text-center text-xl font-semibold bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                      ))}
                    </div>

                    <motion.button
                      onClick={handleVerifyOTP}
                      disabled={isLoading || otp.join('').length !== 6}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-primary text-white py-3 rounded-xl font-medium disabled:opacity-50 border border-border/30 shadow-sm mb-4"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                      ) : (
                        'Verify & Continue'
                      )}
                    </motion.button>

                    <div className="text-center">
                      <button
                        onClick={handleResendOTP}
                        disabled={countdown > 0}
                        className="text-sm text-foreground/60 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {countdown > 0 ? (
                          `Resend OTP in ${countdown}s`
                        ) : (
                          'Resend OTP'
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}