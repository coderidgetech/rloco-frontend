import { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Lock, Globe, Moon, Sun, ChevronRight, Trash2, Download, MapPin } from 'lucide-react';
import { MobileSubPageHeader } from '@/app/components/mobile/MobileSubPageHeader';
import { toast } from 'sonner';
import { useCurrency } from '@/app/context/CurrencyContext';
import { useNavigate } from 'react-router-dom';

export function MobileSettingsPage() {
  const navigate = useNavigate();
  const { country, setCountry } = useCurrency();
  const [notifications, setNotifications] = useState({
    orders: true,
    offers: true,
    updates: false,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('English');
  const [showCountryModal, setShowCountryModal] = useState(false);

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
    toast.success(`${key.charAt(0).toUpperCase() + key.slice(1)} notifications ${!notifications[key] ? 'enabled' : 'disabled'}`);
  };

  const handleClearCache = () => {
    toast.success('Cache cleared successfully');
  };

  const handleDownloadData = () => {
    toast.success('Your data download has started');
  };

  const handleCountryChange = (newCountry: 'India' | 'United States') => {
    setCountry(newCountry);
    setShowCountryModal(false);
    toast.success(`Region changed to ${newCountry}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-20" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      <MobileSubPageHeader onBack={() => navigate('/account')} />

      <div className="pt-[100px]">{/* Header + safe area */}
        {/* Header */}
        <div className="bg-white p-4 border-b border-border/20">
          <h1 className="text-2xl font-medium mb-1">Settings</h1>
          <p className="text-sm text-foreground/60">
            Manage your app preferences
          </p>
        </div>

        {/* Notifications */}
        <div className="p-4">
          <h2 className="text-sm font-medium text-foreground/60 mb-3">NOTIFICATIONS</h2>
          <div className="bg-white rounded-2xl border border-border/30 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-foreground/70" />
                  <div>
                    <p className="font-medium text-sm">Order Updates</p>
                    <p className="text-xs text-foreground/50">Get notified about your orders</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationToggle('orders')}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    notifications.orders ? 'bg-[#B4770E]' : 'bg-foreground/20'
                  }`}
                >
                  <motion.div
                    animate={{ x: notifications.orders ? 20 : 2 }}
                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>
            </div>

            <div className="p-4 border-b border-border/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-foreground/70" />
                  <div>
                    <p className="font-medium text-sm">Offers & Promotions</p>
                    <p className="text-xs text-foreground/50">Get the latest deals</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationToggle('offers')}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    notifications.offers ? 'bg-[#B4770E]' : 'bg-foreground/20'
                  }`}
                >
                  <motion.div
                    animate={{ x: notifications.offers ? 20 : 2 }}
                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-foreground/70" />
                  <div>
                    <p className="font-medium text-sm">App Updates</p>
                    <p className="text-xs text-foreground/50">New features & improvements</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationToggle('updates')}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    notifications.updates ? 'bg-[#B4770E]' : 'bg-foreground/20'
                  }`}
                >
                  <motion.div
                    animate={{ x: notifications.updates ? 20 : 2 }}
                    className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="px-4 pb-4">
          <h2 className="text-sm font-medium text-foreground/60 mb-3">APPEARANCE</h2>
          <div className="bg-white rounded-2xl border border-border/30 shadow-sm overflow-hidden">
            <div className="w-full p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <Moon size={20} className="text-foreground/70" />
                ) : (
                  <Sun size={20} className="text-foreground/70" />
                )}
                <div className="text-left">
                  <p className="font-medium text-sm">Dark Mode</p>
                  <p className="text-xs text-foreground/50">Switch theme</p>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  darkMode ? 'bg-[#B4770E]' : 'bg-foreground/20'
                }`}
              >
                <motion.div
                  animate={{ x: darkMode ? 20 : 2 }}
                  className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="px-4 pb-4">
          <h2 className="text-sm font-medium text-foreground/60 mb-3">LANGUAGE</h2>
          <button 
            onClick={() => navigate('/language')}
            className="w-full bg-white rounded-2xl border border-border/30 shadow-sm p-4 flex items-center justify-between active:bg-foreground/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-foreground/70" />
              <div className="text-left">
                <p className="font-medium text-sm">Language</p>
                <p className="text-xs text-foreground/50">{language}</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-foreground/40" />
          </button>
        </div>

        {/* Country/Region */}
        <div className="px-4 pb-4">
          <h2 className="text-sm font-medium text-foreground/60 mb-3">REGION & CURRENCY</h2>
          <button 
            onClick={() => setShowCountryModal(true)}
            className="w-full bg-white rounded-2xl border border-border/30 shadow-sm p-4 flex items-center justify-between active:bg-foreground/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-foreground/70" />
              <div className="text-left">
                <p className="font-medium text-sm">Country / Region</p>
                <p className="text-xs text-foreground/50">{country} • {country === 'India' ? '₹ INR' : '$ USD'}</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-foreground/40" />
          </button>
        </div>

        {/* Security */}
        <div className="px-4 pb-4">
          <h2 className="text-sm font-medium text-foreground/60 mb-3">SECURITY</h2>
          <button 
            onClick={() => navigate('/change-password')}
            className="w-full bg-white rounded-2xl border border-border/30 shadow-sm p-4 flex items-center justify-between active:bg-foreground/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Lock size={20} className="text-foreground/70" />
              <div className="text-left">
                <p className="font-medium text-sm">Change Password</p>
                <p className="text-xs text-foreground/50">Update your password</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-foreground/40" />
          </button>
        </div>

        {/* Data & Storage */}
        <div className="px-4 pb-4">
          <h2 className="text-sm font-medium text-foreground/60 mb-3">DATA & STORAGE</h2>
          <div className="bg-white rounded-2xl border border-border/30 shadow-sm overflow-hidden">
            <button
              onClick={handleClearCache}
              className="w-full p-4 flex items-center justify-between border-b border-border/10 active:bg-foreground/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Trash2 size={20} className="text-foreground/70" />
                <div className="text-left">
                  <p className="font-medium text-sm">Clear Cache</p>
                  <p className="text-xs text-foreground/50">Free up storage space</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-foreground/40" />
            </button>

            <button
              onClick={handleDownloadData}
              className="w-full p-4 flex items-center justify-between active:bg-foreground/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Download size={20} className="text-foreground/70" />
                <div className="text-left">
                  <p className="font-medium text-sm">Download My Data</p>
                  <p className="text-xs text-foreground/50">Export your information</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-foreground/40" />
            </button>
          </div>
        </div>

        {/* App Version */}
        <div className="px-4 pb-4">
          <div className="text-center">
            <p className="text-xs text-foreground/40">Rloco Fashion</p>
            <p className="text-xs text-foreground/40">Version 1.0.0</p>
          </div>
        </div>
      </div>

      {/* Country Selection Modal */}
      {showCountryModal && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCountryModal(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[100] max-h-[80vh] overflow-y-auto pb-24"
          >
            {/* Handle Bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-foreground/20 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-6 py-4 border-b border-border/20">
              <h2 className="text-xl font-medium">Select Country / Region</h2>
              <p className="text-sm text-foreground/60 mt-1">
                Prices and currency will update based on your selection
              </p>
            </div>

            {/* Countries List */}
            <div className="p-4 space-y-2">
              {/* United States */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCountryChange('United States')}
                className={`w-full p-4 rounded-2xl border transition-all ${
                  country === 'United States'
                    ? 'border-[#B4770E] bg-[#B4770E]/10'
                    : 'border-border/30 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🇺🇸</div>
                    <div className="text-left">
                      <p className="font-medium text-sm">United States</p>
                      <p className="text-xs text-foreground/60">US Dollar (USD) • $</p>
                    </div>
                  </div>
                  {country === 'United States' && (
                    <div className="w-6 h-6 rounded-full bg-[#B4770E] flex items-center justify-center">
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </motion.svg>
                    </div>
                  )}
                </div>
              </motion.button>

              {/* India */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCountryChange('India')}
                className={`w-full p-4 rounded-2xl border transition-all ${
                  country === 'India'
                    ? 'border-[#B4770E] bg-[#B4770E]/10'
                    : 'border-border/30 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🇮🇳</div>
                    <div className="text-left">
                      <p className="font-medium text-sm">India</p>
                      <p className="text-xs text-foreground/60">Indian Rupee (INR) • ₹</p>
                    </div>
                  </div>
                  {country === 'India' && (
                    <div className="w-6 h-6 rounded-full bg-[#B4770E] flex items-center justify-center">
                      <motion.svg
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </motion.svg>
                    </div>
                  )}
                </div>
              </motion.button>
            </div>

            {/* Info Banner */}
            <div className="mx-4 mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
              <div className="flex gap-3">
                <div className="text-xl">ℹ️</div>
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Currency Auto-Update</p>
                  <p className="text-xs text-blue-800">
                    All prices throughout the app will automatically update to match your selected region and currency.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}