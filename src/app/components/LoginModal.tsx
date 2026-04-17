import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Eye, EyeOff, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LuxuryInput } from './ui/luxury-input';
import { PH } from '../lib/formPlaceholders';
import { useUser } from '../context/UserContext';
import { GoogleSignInButton } from './GoogleSignInButton';
import { getApiErrorMessage } from '../lib/apiErrors';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const navigate = useNavigate();
  const { login, register, loginWithGoogle } = useUser();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        newErrors.name = 'Name is required';
      }

      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (confirmPassword !== password) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
    setErrors({});
    setShowPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (mode === 'login') {
        const ok = await login(email.trim(), password);
        if (!ok) {
          toast.error('Invalid email or password');
          return;
        }
        toast.success('Welcome back!');
      } else {
        const ok = await register(email.trim(), password, name.trim());
        if (!ok) {
          toast.error('Could not create account. Try a different email or use Sign up with phone on the full sign-up page.');
          return;
        }
        toast.success('Account created successfully!');
      }
      resetForm();
      onClose();
      onLoginSuccess();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Something went wrong'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (idToken: string) => {
    setIsLoading(true);
    try {
      const ok = await loginWithGoogle(idToken);
      if (!ok) {
        toast.error('Google sign-in failed');
        return;
      }
      toast.success('Signed in with Google');
      resetForm();
      onClose();
      onLoginSuccess();
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Google sign-in failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    resetForm();
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md mx-4 bg-background shadow-2xl overflow-hidden"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-foreground/40 hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>

          <div className="bg-foreground text-background px-6 py-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3 mb-2"
            >
              <LogIn size={24} />
              <h2 className="text-2xl uppercase tracking-wider">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
            </motion.div>
            <p className="text-background/70 text-sm">
              {mode === 'login' ? 'Sign in to access your account' : 'Join us for exclusive benefits'}
            </p>
          </div>

          <form onSubmit={(e) => void handleSubmit(e)} className="px-6 py-8">
            <div className="space-y-4">
              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <LuxuryInput
                    label="Full Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={PH.fullName}
                    error={errors.name}
                    icon={<User size={16} />}
                  />
                </motion.div>
              )}

              <LuxuryInput
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={PH.email}
                error={errors.email}
                icon={<Mail size={16} />}
              />

              <div className="relative">
                <LuxuryInput
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={PH.password}
                  error={errors.password}
                  icon={<Lock size={16} />}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[34px] text-foreground/40 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <LuxuryInput
                    label="Confirm Password"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={PH.confirmPassword}
                    error={errors.confirmPassword}
                    icon={<Lock size={16} />}
                  />
                </motion.div>
              )}

              {mode === 'login' && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/forgot-password');
                    }}
                    className="text-xs text-foreground/60 hover:text-foreground transition-colors uppercase tracking-wider"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 transition-all uppercase tracking-widest text-sm disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full"
                    />
                    Processing...
                  </>
                ) : mode === 'login' ? (
                  'Sign In'
                ) : (
                  'Create Account'
                )}
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-foreground/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-4 text-foreground/40 tracking-wider">Or</span>
              </div>
            </div>

            <div className="space-y-3 [&_iframe]:!mx-auto">
              <GoogleSignInButton
                onSuccess={(credential) => void handleGoogleSuccess(credential)}
                onError={(msg) => toast.error(msg)}
                shape="rectangular"
                theme="outline"
                size="large"
                className="w-full flex justify-center"
              />
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-foreground/60">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
              </span>{' '}
              <button
                type="button"
                onClick={switchMode}
                className="text-foreground hover:underline uppercase tracking-wider font-medium"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
