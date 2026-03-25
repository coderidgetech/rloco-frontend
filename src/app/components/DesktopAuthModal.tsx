import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, X, User, Phone, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { RlocoLogo } from './RlocoLogo';
import { useUser } from '../context/UserContext';
import { GoogleSignInButton } from './GoogleSignInButton';
import { authService } from '../services/authService';
import { SIGNUP_OTP_DRAFT_KEY, type SignupOtpDraft } from '../lib/signupOtpDraft';
import { getApiErrorMessage } from '../lib/apiErrors';
import { DIAL_COUNTRIES, buildPhoneDigitsForApi } from '../lib/dialCountries';
import { PH } from '../lib/formPlaceholders';
import { PhoneCountryRow } from './PhoneCountryRow';

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
  /** Full international digits for OTP verify / resend (set when code is sent). */
  const [phone, setPhone] = useState('');
  const [loginPhoneLocal, setLoginPhoneLocal] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  /** Which flow produced the current OTP screen (login stays demo; signup uses Twilio Verify). */
  const [otpFlow, setOtpFlow] = useState<'login' | 'signup' | null>(null);
  
  // Country selector
  const [selectedCountry, setSelectedCountry] = useState(DIAL_COUNTRIES[1]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const [signupSelectedCountry, setSignupSelectedCountry] = useState(DIAL_COUNTRIES[1]);
  const [signupShowCountryPicker, setSignupShowCountryPicker] = useState(false);
  const [signupCountrySearch, setSignupCountrySearch] = useState('');
  const [signupPhoneLocal, setSignupPhoneLocal] = useState('');

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
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
    const digits = buildPhoneDigitsForApi(selectedCountry.dialCode, loginPhoneLocal);
    if (digits.length < 11) {
      toast.error('Choose country and enter your full mobile number');
      return;
    }
    setIsLoading(true);
    setOtpFlow('login');
    try {
      await authService.sendLoginOtp(digits);
      setPhone(digits);
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

  const handleSendSignupOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.name.trim() || !signupData.email.trim() || !signupPhoneLocal.trim()) {
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
    const phoneForApi = buildPhoneDigitsForApi(signupSelectedCountry.dialCode, signupPhoneLocal);
    if (phoneForApi.length < 11) {
      toast.error('Choose country and enter your full mobile number');
      return;
    }
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

      await authService.completeLoginOtp(phone, otpValue);
      await refreshUser();
      toast.success('Successfully signed in!');
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
      } else if (phone) {
        await authService.sendLoginOtp(phone);
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
    setLoginPhoneLocal('');
    setOtp(['', '', '', '', '', '']);
    setOtpSent(false);
    setCountdown(0);
    setOtpFlow(null);
    setSignupData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setSignupPhoneLocal('');
    setSignupSelectedCountry(DIAL_COUNTRIES[1]);
    setSignupShowCountryPicker(false);
    setSignupCountrySearch('');
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
                        <PhoneCountryRow
                          variant="modal"
                          localPhone={loginPhoneLocal}
                          onLocalPhoneChange={setLoginPhoneLocal}
                          selectedCountry={selectedCountry}
                          onSelectCountry={setSelectedCountry}
                          showPicker={showCountryPicker}
                          setShowPicker={setShowCountryPicker}
                          countrySearch={countrySearch}
                          setCountrySearch={setCountrySearch}
                        />
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
                            placeholder={PH.fullName}
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
                            placeholder={PH.email}
                            required
                            className="w-full pl-10 pr-4 py-2.5 bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-foreground/70">
                          Phone
                        </label>
                        <PhoneCountryRow
                          variant="modal"
                          localPhone={signupPhoneLocal}
                          onLocalPhoneChange={setSignupPhoneLocal}
                          selectedCountry={signupSelectedCountry}
                          onSelectCountry={setSignupSelectedCountry}
                          showPicker={signupShowCountryPicker}
                          setShowPicker={setSignupShowCountryPicker}
                          countrySearch={signupCountrySearch}
                          setCountrySearch={setSignupCountrySearch}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1.5 text-foreground/70">
                          Password
                        </label>
                        <input
                          type="password"
                          value={signupData.password}
                          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                          placeholder={PH.password}
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
                          placeholder={PH.confirmPassword}
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
                        setCurrentView(otpFlow === 'signup' ? 'signup' : 'login');
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
                          {phone}
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