import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { RlocoLogo } from '@/app/components/RlocoLogo';
import { useUser } from '@/app/context/UserContext';
import { GoogleSignInButton } from '@/app/components/GoogleSignInButton';
import { authService } from '@/app/services/authService';
import { getApiErrorMessage } from '@/app/lib/apiErrors';
import { LOGIN_OTP_SESSION_KEY, SIGNUP_OTP_DRAFT_KEY, type LoginOtpSession } from '@/app/lib/signupOtpDraft';
import { DIAL_COUNTRIES, buildPhoneDigitsForApi } from '@/app/lib/dialCountries';
import { PhoneCountryRow } from '@/app/components/PhoneCountryRow';

export function DesktopLoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';
  const { loginWithGoogle } = useUser();
  const [phoneLocal, setPhoneLocal] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(DIAL_COUNTRIES[1]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const digits = buildPhoneDigitsForApi(selectedCountry.dialCode, phoneLocal);
    if (digits.length < 11) {
      toast.error('Choose country and enter your full mobile number');
      return;
    }

    setIsLoading(true);
    try {
      await authService.sendLoginOtp(digits);
      try {
        sessionStorage.removeItem(SIGNUP_OTP_DRAFT_KEY);
      } catch {
        /* ignore */
      }
      const session: LoginOtpSession = {
        phone: digits,
        returnTo: redirect,
        isSignup: false,
      };
      try {
        sessionStorage.setItem(LOGIN_OTP_SESSION_KEY, JSON.stringify(session));
      } catch {
        /* ignore quota / private mode */
      }
      toast.success('OTP sent to your phone');
      navigate('/otp-verification', { state: session });
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Could not send verification code'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (idToken: string) => {
    setIsLoading(true);
    const ok = await loginWithGoogle(idToken);
    setIsLoading(false);
    if (ok) {
      toast.success('Signed in with Google!');
      navigate(redirect, { replace: true });
    } else {
      toast.error('Google sign-in failed. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col bg-white lg:flex-row">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 pt-page-nav pb-10 lg:pb-8 lg:pt-32 min-h-[50vh] lg:min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="mb-8 sm:mb-12 flex justify-center">
            <RlocoLogo size="md" />
          </div>

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-4xl mb-2 sm:mb-3">Welcome Back</h1>
            <p className="text-foreground/60">Sign in to your Rloco account</p>
          </div>

          {/* Google Sign In - Primary Option */}
          <div className="mb-6">
            <GoogleSignInButton
              onSuccess={handleGoogleSuccess}
              onError={(msg) => toast.error(msg)}
              shape="rectangular"
              theme="outline"
              size="large"
              className="rounded-xl"
              customContent={
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-white border-2 border-border/30 shadow-sm text-foreground py-4 rounded-xl font-medium flex items-center justify-center gap-3 hover:bg-foreground/5 transition-all"
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
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-border/30" />
            <span className="text-sm text-foreground/40">OR</span>
            <div className="flex-1 h-px bg-border/30" />
          </div>

          {/* Phone OTP Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Phone Input */}
            <div className="relative">
              <label className="block text-sm font-medium mb-2 text-foreground/70">
                Phone Number
              </label>
              <PhoneCountryRow
                variant="desktop"
                localPhone={phoneLocal}
                onLocalPhoneChange={setPhoneLocal}
                selectedCountry={selectedCountry}
                onSelectCountry={setSelectedCountry}
                showPicker={showCountryPicker}
                setShowPicker={setShowCountryPicker}
                countrySearch={countrySearch}
                setCountrySearch={setCountrySearch}
              />
              <p className="text-xs text-foreground/50 mt-2">
                Select your country, then enter your number — we send a full international format to the server (no default country on the API).
              </p>
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
                  Continue with Phone
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center mt-8 text-sm text-foreground/60">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() =>
                navigate(redirect !== '/account' ? `/signup?redirect=${encodeURIComponent(redirect)}` : '/signup')
              }
              className="text-primary font-medium hover:underline"
            >
              Sign up
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

      {/* Right Side - Image with Overlay */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 z-10" />
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80"
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
            <h2 className="text-5xl mb-6 drop-shadow-lg">Welcome to Rloco</h2>
            <p className="text-xl text-white/90 drop-shadow-md leading-relaxed">
              Discover luxury fashion, timeless elegance, and curated collections just for you.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
