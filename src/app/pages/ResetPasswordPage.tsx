import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { RlocoLogo } from '@/app/components/RlocoLogo';
import { authService } from '@/app/services/authService';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { PH } from '@/app/lib/formPlaceholders';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('Invalid or missing reset link. Please request a new password reset.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authService.resetPassword(token, newPassword);
      setSuccess(true);
      toast.success('Password updated. You can now sign in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen w-full min-w-0 flex-col items-center justify-center p-6">
        <RlocoLogo size="md" className="mb-6" />
        <p className="text-foreground/80">Password updated successfully. Redirecting to login...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex min-h-screen w-full min-w-0 flex-col items-center justify-center p-6">
        <RlocoLogo size="md" className="mb-6" />
        <p className="text-foreground/80 text-center mb-4">Invalid or missing reset link.</p>
        <Button variant="outline" onClick={() => navigate('/forgot-password')}>
          Request new link
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full min-w-0 max-w-md flex-col items-center justify-center p-6">
      <RlocoLogo size="md" className="mb-8" />
      <h1 className="text-2xl font-semibold mb-2">Set new password</h1>
      <p className="text-foreground/60 text-sm mb-6">Enter your new password below.</p>
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">New password</label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={PH.newPassword}
            minLength={6}
            required
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Confirm password</label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={PH.confirmPassword}
            minLength={6}
            required
            className="w-full"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Updating...' : 'Update password'}
        </Button>
      </form>
      <button
        type="button"
        onClick={() => navigate('/login')}
        className="mt-4 text-sm text-foreground/60 hover:underline"
      >
        Back to login
      </button>
    </div>
  );
}
