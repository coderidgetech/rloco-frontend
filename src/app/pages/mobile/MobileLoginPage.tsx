import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, X, Phone, ChevronDown, Search, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { RlocoLogo } from '@/app/components/RlocoLogo';
import { useUser } from '@/app/context/UserContext';
import { GoogleSignInButton } from '@/app/components/GoogleSignInButton';

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

export function MobileLoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';
  const { syncFromStorage, loginWithGoogle } = useUser();
  const [phone, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[1]); // Default to India
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone) {
      toast.error('Please enter your phone number');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setOtpSent(true);
      setCountdown(60);
      toast.success(`OTP sent to your ${phone}`);
      setLoading(false);
    }, 1500);
  };

  const handleVerifyOTP = async () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', 'user@gmail.com');
      localStorage.setItem('userName', 'Google User');
      if (phone) localStorage.setItem('userPhone', phone);
      syncFromStorage();
      toast.success('Welcome back!');
      navigate(redirect, { replace: true });
    }, 1500);
  };

  const handleResendOTP = () => {
    if (countdown > 0) return;
    
    setCountdown(60);
    toast.success('OTP resent!');
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
      const nextInput = document.getElementById(`otp-mobile-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-mobile-${index - 1}`);
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
              className="text-center mb-8 mt-8"
            >
              <div className="mb-4">
                <RlocoLogo size="md" />
              </div>
              <h1 className="text-3xl mb-2">Welcome Back</h1>
              <p className="text-foreground/60">Sign in with your phone number</p>
            </motion.div>

            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              onSubmit={handleSendOTP}
              className="space-y-4 mb-6"
            >
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
                      className="h-[54px] px-3 bg-foreground/5 border border-border/30 shadow-sm rounded-xl hover:bg-foreground/10 transition-all flex items-center gap-2 min-w-[90px]"
                    >
                      <span className="text-2xl">{selectedCountry.flag}</span>
                      <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
                      <ChevronDown size={16} className={`text-foreground/40 transition-transform ${showCountryPicker ? 'rotate-180' : ''}`} />
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
                          className="absolute left-0 top-full mt-2 w-80 max-w-[calc(100vw-48px)] bg-white border border-border/30 shadow-2xl rounded-2xl overflow-hidden z-50"
                        >
                          {/* Search */}
                          <div className="p-3 border-b border-border/20 bg-muted/10">
                            <div className="relative">
                              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
                              <input
                                type="text"
                                value={countrySearch}
                                onChange={(e) => setCountrySearch(e.target.value)}
                                placeholder="Search country..."
                                className="w-full pl-10 pr-3 py-2.5 bg-white border border-border/30 shadow-sm rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B4770E]/20 focus:border-[#B4770E]"
                              />
                            </div>
                          </div>

                          {/* Country List */}
                          <div className="max-h-72 overflow-y-auto">
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
                                className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/30 transition-colors ${
                                  selectedCountry.code === country.code ? 'bg-[#B4770E]/10' : ''
                                }`}
                              >
                                <span className="text-2xl">{country.flag}</span>
                                <div className="flex-1 text-left">
                                  <div className="text-sm font-medium">{country.name}</div>
                                  <div className="text-xs text-foreground/50">{country.code}</div>
                                </div>
                                <span className="text-sm font-medium text-foreground/70">{country.dialCode}</span>
                              </button>
                            ))}
                            {COUNTRIES.filter(country => 
                              country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
                              country.dialCode.includes(countrySearch) ||
                              country.code.toLowerCase().includes(countrySearch.toLowerCase())
                            ).length === 0 && (
                              <div className="px-4 py-8 text-center text-sm text-foreground/40">
                                No countries found
                              </div>
                            )}
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
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="000-0000"
                      className="w-full pl-11 pr-4 py-3.5 bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-[54px]"
                    />
                  </div>
                </div>
              </div>

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

            {/* Google Sign In */}
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

            {/* Sign Up Link */}
            <p className="text-center mt-8 text-sm text-foreground/60">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-primary font-medium"
              >
                Sign up
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
              className="mt-8"
            >
              {/* Back Button */}
              <button
                onClick={() => setOtpSent(false)}
                className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft size={20} />
                <span className="text-sm">Back to phone number</span>
              </button>

              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone size={32} className="text-primary" />
                </div>
                <h2 className="text-3xl mb-2">Verify OTP</h2>
                <p className="text-foreground/60 px-4">
                  Enter the 6-digit code sent to<br />
                  <span className="font-medium text-foreground">
                    {selectedCountry.dialCode} {phone}
                  </span>
                </p>
              </div>

              <div className="flex gap-2 justify-center mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-mobile-${index}`}
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
                  'Verify & Continue'
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
                  onClick={() => setOtpSent(false)}
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