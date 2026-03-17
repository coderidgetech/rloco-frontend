import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Smartphone, ChevronRight, Lock, Check } from 'lucide-react';
import { MobileSubPageHeader } from '@/app/components/mobile/MobileSubPageHeader';
import { useIsMobile } from '@/app/hooks/useIsMobile';
import { toast } from 'sonner';

type PaymentType = 'card' | 'upi';

export function MobileAddPaymentMethodPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedType, setSelectedType] = useState<PaymentType>('card');
  const [isLoading, setIsLoading] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  // UPI form state
  const [upiId, setUpiId] = useState('');

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 3);
    setCvv(value);
  };

  const validateCardForm = () => {
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      toast.error('Please enter a valid 16-digit card number');
      return false;
    }
    if (!cardName.trim()) {
      toast.error('Please enter cardholder name');
      return false;
    }
    if (expiryDate.length !== 5) {
      toast.error('Please enter valid expiry date (MM/YY)');
      return false;
    }
    if (cvv.length !== 3) {
      toast.error('Please enter valid CVV');
      return false;
    }
    return true;
  };

  const validateUpiForm = () => {
    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    if (!upiRegex.test(upiId)) {
      toast.error('Please enter a valid UPI ID');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedType === 'card' && !validateCardForm()) {
      return;
    }

    if (selectedType === 'upi' && !validateUpiForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Payment method added successfully!');
      navigate('/payment-methods');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-28 md:pb-12" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      {isMobile && <MobileSubPageHeader />}

      <div className={isMobile ? 'pt-20 px-4 pb-6' : 'pt-6 px-4 pb-6 max-w-2xl mx-auto'}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <h1 className="text-xl font-semibold">Add Payment Method</h1>
          <p className="text-xs text-foreground/60 mt-0.5">
            Choose your preferred payment method
          </p>
        </motion.div>

        {/* Payment Type Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-2 mb-4"
        >
          <button
            type="button"
            onClick={() => setSelectedType('card')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
              selectedType === 'card'
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border/30 bg-white shadow-sm'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                selectedType === 'card' ? 'bg-primary text-white' : 'bg-muted/50'
              }`}
            >
              <CreditCard size={16} />
            </div>
            <span className="text-sm font-medium">Card</span>
            {selectedType === 'card' && (
              <Check size={16} className="text-primary ml-auto" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setSelectedType('upi')}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
              selectedType === 'upi'
                ? 'border-primary bg-primary/5 shadow-sm'
                : 'border-border/30 bg-white shadow-sm'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                selectedType === 'upi' ? 'bg-primary text-white' : 'bg-muted/50'
              }`}
            >
              <Smartphone size={16} />
            </div>
            <span className="text-sm font-medium">UPI</span>
            {selectedType === 'upi' && (
              <Check size={16} className="text-primary ml-auto" />
            )}
          </button>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {selectedType === 'card' && (
              <motion.div
                key="card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {/* Card Number */}
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-foreground/70">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="Card number"
                    className="w-full px-4 py-3 bg-white border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                    inputMode="numeric"
                  />
                </div>

                {/* Cardholder Name */}
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-foreground/70">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    placeholder="Name on card"
                    className="w-full px-4 py-3 bg-white border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all uppercase text-sm"
                  />
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-foreground/70">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={expiryDate}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 bg-white border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                      inputMode="numeric"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-foreground/70">
                      CVV
                    </label>
                    <input
                      type="password"
                      value={cvv}
                      onChange={handleCvvChange}
                      placeholder="CVV"
                      maxLength={3}
                      className="w-full px-4 py-3 bg-white border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                      inputMode="numeric"
                    />
                  </div>
                </div>

                {/* Card Preview - Compact */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 rounded-xl p-4 text-white shadow-lg mt-4"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-7 bg-white/20 rounded"></div>
                    <CreditCard size={24} className="opacity-50" />
                  </div>
                  <div className="mb-4">
                    <p className="text-base tracking-wider font-mono">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </p>
                  </div>
                  <div className="flex justify-between items-end text-xs">
                    <div>
                      <p className="opacity-60 mb-0.5">Cardholder</p>
                      <p className="font-medium text-sm">
                        {cardName || 'YOUR NAME'}
                      </p>
                    </div>
                    <div>
                      <p className="opacity-60 mb-0.5">Expires</p>
                      <p className="font-medium text-sm">
                        {expiryDate || 'MM/YY'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {selectedType === 'upi' && (
              <motion.div
                key="upi"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {/* UPI ID */}
                <div>
                  <label className="block text-xs font-medium mb-1.5 text-foreground/70">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value.toLowerCase())}
                    placeholder="UPI ID"
                    className="w-full px-4 py-3 bg-white border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  />
                </div>

                {/* UPI Info */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-blue-50 rounded-xl p-3 border border-blue-200"
                >
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Smartphone size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm mb-1">How to find your UPI ID?</h3>
                      <ul className="text-xs text-foreground/70 space-y-0.5">
                        <li>• Open your UPI app</li>
                        <li>• Go to Profile or Settings</li>
                        <li>• Copy your UPI ID</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>

                {/* Common UPI Apps */}
                <div className="bg-white rounded-xl p-3 border border-border/30 shadow-sm">
                  <p className="text-xs font-medium mb-2 text-foreground/70">Popular UPI Apps</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: 'Google Pay', color: 'bg-blue-50' },
                      { name: 'PhonePe', color: 'bg-purple-50' },
                      { name: 'Paytm', color: 'bg-cyan-50' },
                    ].map((app) => (
                      <div
                        key={app.name}
                        className={`flex flex-col items-center gap-1.5 p-2 ${app.color} rounded-lg`}
                      >
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-border/20">
                          <Smartphone size={14} />
                        </div>
                        <span className="text-[10px] text-center font-medium">{app.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-green-50 rounded-xl p-3 border border-green-200 mt-4"
          >
            <div className="flex items-start gap-2">
              <Lock size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-green-900 font-medium mb-0.5">
                  100% Secure & Encrypted
                </p>
                <p className="text-[11px] text-green-700 leading-relaxed">
                  CVV is never stored. All transactions are protected with bank-grade security.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 bg-primary text-white py-3.5 rounded-full font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-sm">Adding...</span>
              </>
            ) : (
              <>
                <span className="text-sm">Add Payment Method</span>
                <ChevronRight size={18} />
              </>
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
}
