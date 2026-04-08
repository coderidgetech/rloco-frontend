import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAdmin } from '../../context/AdminContext';
import { Button } from '../../components/ui/button';
import { LuxuryInput } from '../../components/ui/luxury-input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { PH } from '../../lib/formPlaceholders';

export const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, user, isLoading } = useAdmin();
  const navigate = useNavigate();

  if (!isLoading && user && (user.role === 'admin' || user.role === 'vendor')) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Successfully logged in!');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full min-w-0 items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full min-w-0 max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-4">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
          <p className="text-gray-600">Sign in to manage your store</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in with a staff or vendor account to manage the store.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <LuxuryInput
                label="Email"
                type="email"
                placeholder={PH.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <LuxuryInput
                label="Password"
                type="password"
                placeholder={PH.password}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button
            variant="link"
            onClick={() => navigate('/')}
            className="text-gray-600"
          >
            ← Back to Store
          </Button>
        </div>
      </motion.div>
    </div>
  );
};