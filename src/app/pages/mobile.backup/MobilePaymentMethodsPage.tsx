import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CreditCard, Plus, Trash2, Check } from 'lucide-react';
import { MobileSubPageHeader } from '@/app/components/mobile/MobileSubPageHeader';
import { useIsMobile } from '@/app/hooks/useIsMobile';
import { toast } from 'sonner';

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi';
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  upiId?: string;
  isDefault: boolean;
}

// No backend API for saved payment methods yet; show empty state. Users can add at checkout.
const INITIAL_PAYMENT_METHODS: PaymentMethod[] = [];

export function MobilePaymentMethodsPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(INITIAL_PAYMENT_METHODS);

  const handleDelete = (id: string) => {
    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
    toast.success('Payment method removed');
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => ({
        ...pm,
        isDefault: pm.id === id,
      }))
    );
    toast.success('Default payment method updated');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-20 md:pb-12" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      {isMobile && <MobileSubPageHeader onBack={() => navigate('/account')} />}

      <div className={isMobile ? 'pt-[100px] p-4' : 'pt-6 p-4 max-w-2xl mx-auto'}>{/* Header + safe area */}
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-medium">Payment Methods</h1>
          <p className="text-sm text-foreground/60 mt-1">
            Manage your saved payment options
          </p>
        </div>

        {/* Add New Payment Method Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/add-payment-method')}
          className="w-full bg-primary text-white p-4 rounded-2xl flex items-center justify-center gap-2 mb-4"
        >
          <Plus size={20} />
          <span className="font-medium">Add Payment Method</span>
        </motion.button>

        {/* Payment Methods List */}
        <div className="space-y-3">
          {paymentMethods.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard size={48} className="mx-auto text-foreground/20 mb-3" />
              <p className="text-foreground/60">No payment methods saved</p>
            </div>
          ) : (
            paymentMethods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-4 border border-border/30 shadow-sm"
              >
                {method.type === 'card' ? (
                  <>
                    {/* Card */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-xl flex items-center justify-center">
                          <CreditCard size={24} className="text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{method.cardNumber}</p>
                          <p className="text-sm text-foreground/60">{method.cardHolder}</p>
                          <p className="text-xs text-foreground/50 mt-0.5">
                            Expires {method.expiryDate}
                          </p>
                        </div>
                      </div>
                      {method.isDefault && (
                        <div className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                          <Check size={12} />
                          <span>Default</span>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    {/* UPI */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold text-sm">UPI</span>
                        </div>
                        <div>
                          <p className="font-medium">UPI Payment</p>
                          <p className="text-sm text-foreground/60">{method.upiId}</p>
                        </div>
                      </div>
                      {method.isDefault && (
                        <div className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                          <Check size={12} />
                          <span>Default</span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {!method.isDefault && (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      className="flex-1 py-2.5 bg-primary/10 text-primary rounded-xl text-sm font-medium active:bg-primary/20 transition-colors"
                    >
                      Set as Default
                    </button>
                  )}

                  {!method.isDefault && (
                    <button
                      onClick={() => handleDelete(method.id)}
                      className="px-4 py-2.5 border border-red-200 text-red-600 rounded-xl active:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
          <p className="text-sm text-blue-900">
            💳 Your payment information is encrypted and secure. We never store your CVV.
          </p>
        </div>
      </div>
    </div>
  );
}