import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useUser } from '../context/UserContext';
import { Button } from '../components/ui/button';
import { LuxuryInput } from '../components/ui/luxury-input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { AlertCircle, LogIn, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

export function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register, isAuthenticated, isLoading } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';
  const fromCheckout = redirect === '/checkout';

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(redirect, { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const success = await login(email, password);
        if (success) {
          toast.success('Welcome back!');
          navigate(redirect, { replace: true });
        } else {
          setError('Invalid email or password');
        }
      } else {
        const success = await register(email, password, name.trim());
        if (success) {
          toast.success('Account created successfully!');
          navigate(redirect, { replace: true });
        } else {
          setError('Registration failed. Email may already be in use.');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6] pt-24">
        <div className="animate-pulse text-foreground/50">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // useEffect will redirect
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#faf9f6] to-white px-4 py-16 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-foreground rounded-full mb-3">
            <LogIn className="w-7 h-7 text-background" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-foreground/60 text-sm">
            {mode === 'login'
              ? 'Sign in to your R-Loko account'
              : 'Register to shop and manage your orders'}
          </p>
          {fromCheckout && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-primary font-medium">
              <ShoppingBag size={18} />
              <span>Log in to place your order. You’ll return to checkout after signing in.</span>
            </div>
          )}
        </div>

        <Card className="border-2 border-foreground/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              {mode === 'login' ? 'Sign in' : 'Sign up'}
            </CardTitle>
            <CardDescription>
              {mode === 'login'
                ? 'Enter your email and password'
                : 'Enter your details to create an account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {mode === 'signup' && (
                <LuxuryInput
                  label="Name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              )}

              <LuxuryInput
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />

              <LuxuryInput
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading
                  ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
                  : mode === 'login'
                    ? 'Sign in'
                    : 'Create account'}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setError('');
                }}
                className="w-full text-center text-sm text-foreground/60 hover:text-foreground transition-colors"
              >
                {mode === 'login' ? (
                  <>
                    Don’t have an account? <span className="font-medium">Sign up</span>
                  </>
                ) : (
                  <>
                    Already have an account? <span className="font-medium">Sign in</span>
                  </>
                )}
              </button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate(redirect === '/checkout' ? '/cart' : '/')}
            className="text-foreground/60 hover:text-foreground"
          >
            ← {fromCheckout ? 'Back to cart' : 'Back to store'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
