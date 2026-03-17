import { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, Lock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/app/hooks/useIsMobile';
import { toast } from 'sonner';
import { authService } from '@/app/services/authService';

export function MobileChangePasswordPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully');
      navigate('/account');
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err && typeof (err as { response?: { data?: { error?: string } } }).response?.data?.error === 'string'
        ? (err as { response: { data: { error: string } } }).response.data.error
        : 'Failed to change password';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-20 md:pb-12" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-white border-b border-border/20 z-40">
          <div className="flex items-center justify-between px-4 py-4" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
            <button
              onClick={() => navigate('/settings')}
              className="p-2 -ml-2 active:bg-foreground/5 rounded-full transition-colors"
            >
              <ArrowLeft size={24} className="text-foreground" />
            </button>
            <h1 className="text-lg font-medium">Change Password</h1>
            <div className="w-10" />
          </div>
        </div>
      )}

      <div className={isMobile ? 'pt-24 pb-8 px-4' : 'pt-6 pb-8 px-4 max-w-md mx-auto'}>
        {/* Security Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#B4770E]/10 flex items-center justify-center">
            <Lock size={36} className="text-[#B4770E]" />
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-8">
          <p className="text-sm text-foreground/60">
            Choose a strong password to keep your account secure
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                className="w-full px-4 py-3 pr-12 bg-white border border-border/30 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B4770E]/20 focus:border-[#B4770E] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40"
              >
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password"
                className="w-full px-4 py-3 pr-12 bg-white border border-border/30 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B4770E]/20 focus:border-[#B4770E] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="text-xs text-foreground/50 mt-2">
              Must be at least 8 characters
            </p>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-4 py-3 pr-12 bg-white border border-border/30 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B4770E]/20 focus:border-[#B4770E] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <p className="text-sm font-medium text-blue-900 mb-2">Password Requirements:</p>
            <ul className="space-y-1 text-xs text-blue-800">
              <li className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-blue-300'}`} />
                At least 8 characters
              </li>
              <li className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(newPassword) ? 'bg-green-500' : 'bg-blue-300'}`} />
                One uppercase letter
              </li>
              <li className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(newPassword) ? 'bg-green-500' : 'bg-blue-300'}`} />
                One lowercase letter
              </li>
              <li className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-blue-300'}`} />
                One number
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 px-6 py-4 bg-[#B4770E] text-white rounded-2xl font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Updating...
              </div>
            ) : (
              'Change Password'
            )}
          </motion.button>
        </form>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-white border border-border/30 rounded-2xl shadow-sm">
          <div className="flex gap-3">
            <div className="text-xl">💡</div>
            <div>
              <p className="text-sm font-medium mb-1">Security Tip</p>
              <p className="text-xs text-foreground/60">
                Use a unique password that you don't use for other accounts. Consider using a password manager to keep track of your passwords.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
