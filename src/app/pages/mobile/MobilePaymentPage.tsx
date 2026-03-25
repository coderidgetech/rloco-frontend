import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, CreditCard, Smartphone, Wallet, Check, Lock, Shield } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useCurrency } from '@/app/context/CurrencyContext';
import { toast } from 'sonner';
import { PH } from '@/app/lib/formPlaceholders';

interface PaymentMethod {
  id: string;
  name: string;
  icon: typeof CreditCard;
  description: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Credit/Debit Card',
    icon: CreditCard,
    description: 'Pay securely with your card',
  },
  {
    id: 'wallet',
    name: 'Digital Wallet',
    icon: Wallet,
    description: 'Apple Pay, Google Pay',
  },
  {
    id: 'mobile',
    name: 'Mobile Payment',
    icon: Smartphone,
    description: 'PayPal, Venmo',
  },
];

export function MobilePaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, clearCart } = useCart();
  const { convertPrice } = useCurrency();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePlaceOrder = async () => {
    if (!selectedMethod) return;

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // Calculate totals
      const subtotal = items.reduce((sum, item) => {
        const itemPrice = convertPrice(item.price, (item as any).priceINR);
        return sum + (itemPrice * item.quantity);
      }, 0);
      
      // Prepare order data with product images
      const orderData = {
        orderNumber: `RLC${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
        email: 'customer@example.com',
        paymentMethod: selectedMethod === 'card' ? 'Credit/Debit Card' :
                       selectedMethod === 'wallet' ? 'Digital Wallet' : 'Mobile Payment',
        shippingInfo: {
          firstName: 'Customer',
          lastName: '',
          address: '123 Main Street, Apartment 4B',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          phone: '+91 98765 43210',
          country: 'India'
        },
        orderItems: items.map(item => ({
          id: item.id,
          name: item.name,
          price: convertPrice(item.price, (item as any).priceINR),
          quantity: item.quantity,
          size: item.size,
          image: item.image,
        })),
        subtotal: subtotal,
        shippingCost: 0,
        tax: Math.round(subtotal * 0.18)
      };
      
      clearCart();
      toast.success('Payment successful!');
      navigate('/order-confirmation', { state: orderData });
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const totalPrice = items.reduce((sum, item) => {
    const itemPrice = convertPrice(item.price, (item as any).priceINR);
    return sum + (itemPrice * item.quantity);
  }, 0);
  const shippingCost = totalPrice > 200 ? 0 : 0;
  const tax = totalPrice * 0.18; // 18% GST
  const finalTotal = totalPrice + shippingCost + tax;

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-32" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border/20">
        <div className="flex items-center justify-between h-14 px-4" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center"
          >
            <ChevronLeft size={20} />
          </motion.button>

          <h1 className="text-base font-medium">Payment</h1>

          <div className="w-9" /> {/* Spacer */}
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-14 px-4 pb-6">
        {/* Order Summary */}
        <div className="py-4">
          <h2 className="text-lg font-medium mb-4">Order Summary</h2>
          
          <div className="space-y-2 p-4 bg-white rounded-2xl border border-border/20">
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Subtotal ({items?.length ?? 0} items)</span>
              <span className="font-medium">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Shipping</span>
              <span className="font-medium">
                {shippingCost === 0 ? (
                  <span className="text-green-600">FREE</span>
                ) : (
                  `$${shippingCost.toFixed(2)}`
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Tax</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-border/20">
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-primary">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Payment Method</h2>

          <div className="space-y-3">
            {paymentMethods.map((method, index) => {
              const Icon = method.icon;
              const isSelected = selectedMethod === method.id;

              return (
                <motion.button
                  key={method.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isSelected ? 'bg-primary/10' : 'bg-foreground/5'
                      }`}>
                        <Icon size={20} className={isSelected ? 'text-primary' : 'text-foreground/60'} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{method.name}</p>
                        <p className="text-xs text-foreground/60">{method.description}</p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-primary bg-primary'
                          : 'border-foreground/20'
                      }`}
                    >
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Card Details Form (shown when card payment is selected) */}
        {selectedMethod === 'card' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <h2 className="text-lg font-medium mb-4">Card Details</h2>

            <div className="space-y-4 p-4 bg-white rounded-2xl border border-border/20">
              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Card Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder={PH.cardNumber}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-foreground/20 bg-white text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30" size={20} />
                </div>
                <p className="text-xs text-foreground/50 mt-1.5">Enter 16-digit card number</p>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">
                  Cardholder Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder={PH.nameOnCard}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-foreground/20 bg-white text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <p className="text-xs text-foreground/50 mt-1.5">Name as shown on card</p>
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    placeholder={PH.cardExpiry}
                    maxLength={5}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-foreground/20 bg-white text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <p className="text-xs text-foreground/50 mt-1.5">MM/YY format</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">
                    CVV <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder={PH.cvv}
                    maxLength={4}
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-foreground/20 bg-white text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <p className="text-xs text-foreground/50 mt-1.5">3-4 digits</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Security Notice */}
        <div className="p-4 bg-green-50 rounded-2xl flex items-start gap-3">
          <Shield size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-sm mb-1 text-green-900">
              <Lock size={14} className="inline mr-1" />
              Secure Payment
            </h3>
            <p className="text-xs text-green-800">
              Your payment information is encrypted and secure. We never store your card details.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border/20 p-4"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 4px)', marginBottom: '64px' }}
      >
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handlePlaceOrder}
          disabled={isProcessing || !selectedMethod}
          className="w-full bg-primary text-white py-4 rounded-full font-medium text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Lock size={18} />
              Place Order - ${finalTotal.toFixed(2)}
            </>
          )}
        </motion.button>
      </div>

    </div>
  );
}