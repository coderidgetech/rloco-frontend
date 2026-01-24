import { motion, AnimatePresence } from 'motion/react';
import { X, Check, CreditCard, Truck, MapPin, Mail, Phone, User, Lock, Calendar, ShieldCheck, ArrowLeft, ChevronRight, Package2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';

interface CheckoutPageProps {
  isOpen: boolean;
  onClose: () => void;
  appliedCoupon: { code: string; discount: number } | null;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
}

const STEPS = ['Shipping', 'Payment', 'Review'];

export function CheckoutPage({ isOpen, onClose, appliedCoupon }: CheckoutPageProps) {
  const { items, total, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
  });

  const [shippingMethod, setShippingMethod] = useState('standard');

  const subtotal = total;
  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
  const shippingCost = 
    appliedCoupon?.code === 'FREESHIP' ? 0 :
    subtotal > 200 ? 0 :
    shippingMethod === 'express' ? 25 :
    shippingMethod === 'overnight' ? 45 : 15;
  const tax = (subtotal - discount) * 0.08;
  const finalTotal = subtotal - discount + shippingCost + tax;

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const validateShipping = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    for (const field of required) {
      if (!shippingInfo[field as keyof ShippingInfo]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const validatePayment = () => {
    if (paymentInfo.cardNumber.replace(/\s/g, '').length !== 16) {
      toast.error('Please enter a valid card number');
      return false;
    }
    if (!paymentInfo.cardName) {
      toast.error('Please enter the cardholder name');
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
      toast.error('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    if (!/^\d{3,4}$/.test(paymentInfo.cvv)) {
      toast.error('Please enter a valid CVV');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 0 && !validateShipping()) return;
    if (currentStep === 1 && !validatePayment()) return;
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    const orderNum = 'RLC' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    setTimeout(() => {
      setOrderNumber(orderNum);
      setOrderComplete(true);
      setIsProcessing(false);
      clearCart();
      toast.success('Order placed successfully!');
    }, 2500);
  };

  const handleClose = () => {
    if (orderComplete) {
      // Reset everything on close after successful order
      setCurrentStep(0);
      setShippingInfo({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        apartment: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
      });
      setPaymentInfo({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        saveCard: false,
      });
      setOrderNumber('');
      setOrderComplete(false);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(60px)',
              WebkitBackdropFilter: 'blur(60px)',
            }}
            className="fixed inset-0 z-50"
            onClick={orderComplete ? handleClose : undefined}
          />

          {/* Checkout Modal - Fixed Height */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-8 lg:inset-12 z-50 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full h-full bg-background rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border/50">
              {orderComplete ? (
                /* Order Confirmation */
                <div className="flex-1 flex items-center justify-center p-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center max-w-md"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                      className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
                    >
                      <Check size={40} className="text-green-600" />
                    </motion.div>
                    
                    <h2 className="text-3xl md:text-4xl mb-4">Order Confirmed!</h2>
                    <p className="text-lg text-muted-foreground mb-6">
                      Thank you for your purchase
                    </p>
                    
                    <div className="bg-muted/30 rounded-xl p-6 mb-8">
                      <p className="text-sm text-muted-foreground mb-2">Order Number</p>
                      <p className="text-2xl font-mono font-bold">{orderNumber}</p>
                    </div>

                    <div className="space-y-3 text-sm text-muted-foreground mb-8">
                      <p>✓ Confirmation email sent to {shippingInfo.email}</p>
                      <p>✓ Estimated delivery: 5-7 business days</p>
                      <p>✓ You can track your order in your account</p>
                    </div>

                    <Button
                      onClick={handleClose}
                      className="w-full"
                      size="lg"
                    >
                      Continue Shopping
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <>
                  {/* Header - Fixed */}
                  <div className="flex-shrink-0 border-b border-border bg-background/95 backdrop-blur-sm">
                    <div className="px-6 md:px-8 py-5">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <ShieldCheck className="text-primary" size={20} />
                          </div>
                          <div>
                            <h1 className="text-xl md:text-2xl font-semibold">Secure Checkout</h1>
                            <p className="text-xs text-muted-foreground">SSL encrypted payment</p>
                          </div>
                        </div>
                        <button
                          onClick={handleClose}
                          className="p-2 hover:bg-muted rounded-full transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>

                      {/* Progress Steps */}
                      <div className="flex items-center justify-between max-w-md mx-auto">
                        {STEPS.map((step, index) => (
                          <div key={step} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                              <motion.div
                                initial={false}
                                animate={{
                                  scale: index === currentStep ? 1.1 : 1,
                                }}
                                transition={{ duration: 0.3 }}
                                className={`w-9 h-9 rounded-full flex items-center justify-center mb-2 transition-colors duration-300 ${
                                  index <= currentStep 
                                    ? 'bg-primary text-primary-foreground shadow-lg' 
                                    : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                {index < currentStep ? (
                                  <Check size={18} strokeWidth={3} />
                                ) : (
                                  <span className="text-sm font-semibold">{index + 1}</span>
                                )}
                              </motion.div>
                              <span className={`text-xs font-medium transition-colors duration-300 ${
                                index === currentStep ? 'text-foreground' : 'text-muted-foreground'
                              }`}>
                                {step}
                              </span>
                            </div>
                            {index < STEPS.length - 1 && (
                              <div className="flex-1 h-0.5 bg-muted mx-3 mb-7 overflow-hidden rounded-full">
                                <motion.div
                                  initial={false}
                                  animate={{
                                    width: index < currentStep ? '100%' : '0%',
                                  }}
                                  transition={{ duration: 0.4 }}
                                  className="h-full bg-primary"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Content - Scrollable with fixed height */}
                  <div className="flex-1 overflow-hidden flex">
                    <div className="flex-1 overflow-y-auto">
                      <div className="px-2 md:px-4 py-6">
                        <div className="w-full grid lg:grid-cols-3 gap-8">
                          {/* Main Content - 2 columns */}
                          <div className="lg:col-span-2">
                            <AnimatePresence mode="wait">
                              {/* Step 1: Shipping Information */}
                              {currentStep === 0 && (
                                <motion.div
                                  key="shipping"
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -20 }}
                                  transition={{ duration: 0.3 }}
                                  className="space-y-5"
                                >
                                  <div className="flex items-center gap-3 mb-6">
                                    <Truck size={24} className="text-primary" />
                                    <h2 className="text-2xl font-semibold">Shipping Details</h2>
                                  </div>

                                  <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium mb-2">First Name *</label>
                                      <div className="relative">
                                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                          type="text"
                                          value={shippingInfo.firstName}
                                          onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                                          className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                          placeholder="Enter first name"
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium mb-2">Last Name *</label>
                                      <div className="relative">
                                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                          type="text"
                                          value={shippingInfo.lastName}
                                          onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                                          className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                          placeholder="Enter last name"
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium mb-2">Email *</label>
                                      <div className="relative">
                                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                          type="email"
                                          value={shippingInfo.email}
                                          onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                                          className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                          placeholder="Enter your email address"
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium mb-2">Phone *</label>
                                      <div className="relative">
                                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                          type="tel"
                                          value={shippingInfo.phone}
                                          onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                                          className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                          placeholder="+1 (555) 000-0000"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium mb-2">Street Address *</label>
                                    <div className="relative">
                                      <MapPin size={16} className="absolute left-3 top-3 text-muted-foreground" />
                                      <input
                                        type="text"
                                        value={shippingInfo.address}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                          placeholder="Enter your street address"
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium mb-2">Apartment, suite, etc.</label>
                                    <input
                                      type="text"
                                      value={shippingInfo.apartment}
                                      onChange={(e) => setShippingInfo({ ...shippingInfo, apartment: e.target.value })}
                                      className="w-full px-4 py-2.5 bg-background border border-border rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                      placeholder="Apt 4B (Optional)"
                                    />
                                  </div>

                                  <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                      <label className="block text-sm font-medium mb-2">City *</label>
                                      <input
                                        type="text"
                                        value={shippingInfo.city}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="New York"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium mb-2">State *</label>
                                      <input
                                        type="text"
                                        value={shippingInfo.state}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="NY"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium mb-2">ZIP Code *</label>
                                      <input
                                        type="text"
                                        value={shippingInfo.zipCode}
                                        onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="10001"
                                      />
                                    </div>
                                  </div>

                                  <div className="bg-muted/30 rounded-xl p-5 border border-border/50">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                      <Package2 size={18} className="text-primary" />
                                      Shipping Method
                                    </h3>
                                    <div className="space-y-3">
                                      {[
                                        { id: 'standard', name: 'Standard', time: '5-7 business days', price: 15 },
                                        { id: 'express', name: 'Express', time: '2-3 business days', price: 25 },
                                        { id: 'overnight', name: 'Overnight', time: '1 business day', price: 45 },
                                      ].map((method) => (
                                        <label
                                          key={method.id}
                                          className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                                            shippingMethod === method.id
                                              ? 'border-primary bg-primary/5 shadow-sm'
                                              : 'border-border hover:border-primary/30'
                                          }`}
                                        >
                                          <div className="flex items-center gap-3">
                                            <input
                                              type="radio"
                                              name="shipping"
                                              value={method.id}
                                              checked={shippingMethod === method.id}
                                              onChange={(e) => setShippingMethod(e.target.value)}
                                              className="w-4 h-4 accent-primary"
                                            />
                                            <div>
                                              <div className="font-medium text-sm">{method.name}</div>
                                              <div className="text-xs text-muted-foreground">{method.time}</div>
                                            </div>
                                          </div>
                                          <div className="font-semibold text-sm">
                                            {subtotal > 200 && method.id === 'standard' ? (
                                              <span className="text-green-600">FREE</span>
                                            ) : (
                                              `$${method.price}`
                                            )}
                                          </div>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                </motion.div>
                              )}

                              {/* Step 2: Payment Information */}
                              {currentStep === 1 && (
                                <motion.div
                                  key="payment"
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -20 }}
                                  transition={{ duration: 0.3 }}
                                  className="space-y-5"
                                >
                                  <div className="flex items-center gap-3 mb-6">
                                    <CreditCard size={24} className="text-primary" />
                                    <h2 className="text-2xl font-semibold">Payment Details</h2>
                                  </div>

                                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3 mb-6">
                                    <ShieldCheck size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm">
                                      <p className="font-medium text-blue-600 mb-1">Secure Payment</p>
                                      <p className="text-blue-600/80 text-xs">
                                        Your payment is encrypted and secure. We never store your card details.
                                      </p>
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <div>
                                      <label className="block text-sm font-medium mb-2">Card Number *</label>
                                      <div className="relative">
                                        <CreditCard size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                          type="text"
                                          value={paymentInfo.cardNumber}
                                          onChange={(e) => {
                                            const formatted = formatCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16));
                                            setPaymentInfo({ ...paymentInfo, cardNumber: formatted });
                                          }}
                                          className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                                          placeholder="1234 5678 9012 3456"
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label className="block text-sm font-medium mb-2">Cardholder Name *</label>
                                      <div className="relative">
                                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <input
                                          type="text"
                                          value={paymentInfo.cardName}
                                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                                          className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                          placeholder="Enter cardholder name"
                                        />
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="block text-sm font-medium mb-2">Expiry Date *</label>
                                        <div className="relative">
                                          <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                          <input
                                            type="text"
                                            value={paymentInfo.expiryDate}
                                            onChange={(e) => {
                                              const formatted = formatExpiryDate(e.target.value);
                                              setPaymentInfo({ ...paymentInfo, expiryDate: formatted });
                                            }}
                                            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                                            placeholder="MM/YY"
                                          />
                                        </div>
                                      </div>

                                      <div>
                                        <label className="block text-sm font-medium mb-2">CVV *</label>
                                        <div className="relative">
                                          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                          <input
                                            type="text"
                                            value={paymentInfo.cvv}
                                            onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                                            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                                            placeholder="123"
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <label className="flex items-center gap-2 cursor-pointer pt-2">
                                      <input
                                        type="checkbox"
                                        checked={paymentInfo.saveCard}
                                        onChange={(e) => setPaymentInfo({ ...paymentInfo, saveCard: e.target.checked })}
                                        className="w-4 h-4 accent-primary"
                                      />
                                      <span className="text-sm">Save card for future purchases</span>
                                    </label>
                                  </div>

                                  {/* Billing Address Note */}
                                  <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                                    <p className="text-sm text-muted-foreground">
                                      <span className="font-medium text-foreground">Billing address:</span> Same as shipping address
                                    </p>
                                  </div>
                                </motion.div>
                              )}

                              {/* Step 3: Review Order */}
                              {currentStep === 2 && (
                                <motion.div
                                  key="review"
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -20 }}
                                  transition={{ duration: 0.3 }}
                                  className="space-y-5"
                                >
                                  <h2 className="text-2xl font-semibold mb-6">Review Your Order</h2>

                                  {/* Shipping Info Summary */}
                                  <div className="bg-muted/30 rounded-xl p-5 border border-border/50">
                                    <div className="flex items-center justify-between mb-4">
                                      <h3 className="font-semibold flex items-center gap-2">
                                        <Truck size={18} className="text-primary" />
                                        Shipping To
                                      </h3>
                                      <button
                                        onClick={() => setCurrentStep(0)}
                                        className="text-sm text-primary hover:underline"
                                      >
                                        Edit
                                      </button>
                                    </div>
                                    <div className="text-sm space-y-1 text-muted-foreground">
                                      <p className="font-medium text-foreground">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                                      <p>{shippingInfo.address} {shippingInfo.apartment}</p>
                                      <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                                      <p>{shippingInfo.email}</p>
                                      <p>{shippingInfo.phone}</p>
                                    </div>
                                  </div>

                                  {/* Payment Info Summary */}
                                  <div className="bg-muted/30 rounded-xl p-5 border border-border/50">
                                    <div className="flex items-center justify-between mb-4">
                                      <h3 className="font-semibold flex items-center gap-2">
                                        <CreditCard size={18} className="text-primary" />
                                        Payment Method
                                      </h3>
                                      <button
                                        onClick={() => setCurrentStep(1)}
                                        className="text-sm text-primary hover:underline"
                                      >
                                        Edit
                                      </button>
                                    </div>
                                    <div className="text-sm space-y-1 text-muted-foreground">
                                      <p className="font-medium text-foreground">{paymentInfo.cardName}</p>
                                      <p className="font-mono">•••• •••• •••• {paymentInfo.cardNumber.slice(-4)}</p>
                                      <p>Expires {paymentInfo.expiryDate}</p>
                                    </div>
                                  </div>

                                  {/* Order Items */}
                                  <div className="bg-muted/30 rounded-xl p-5 border border-border/50">
                                    <h3 className="font-semibold mb-4">Order Items ({items.length})</h3>
                                    <div className="space-y-3 max-h-40 overflow-y-auto">
                                      {items.slice(0, 3).map((item, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                          <div className="w-14 h-14 bg-accent rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }} />
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                                          </div>
                                          <p className="text-sm font-semibold">${item.price}</p>
                                        </div>
                                      ))}
                                      {items.length > 3 && (
                                        <p className="text-xs text-muted-foreground text-center pt-2">
                                          +{items.length - 3} more items
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Order Summary - 1 column - Sticky */}
                          <div className="lg:col-span-1">
                            <div className="bg-muted/30 rounded-xl p-6 border border-border/50 sticky top-0">
                              <h3 className="font-semibold mb-5 text-lg">Order Summary</h3>
                              
                              <div className="space-y-3 mb-5 pb-5 border-b border-border">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Subtotal</span>
                                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                                </div>
                                {discount > 0 && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Discount</span>
                                    <span className="font-medium text-green-600">-${discount.toFixed(2)}</span>
                                  </div>
                                )}
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Shipping</span>
                                  <span className="font-medium">
                                    {shippingCost === 0 ? (
                                      <span className="text-green-600">FREE</span>
                                    ) : (
                                      `$${shippingCost.toFixed(2)}`
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Tax</span>
                                  <span className="font-medium">${tax.toFixed(2)}</span>
                                </div>
                              </div>

                              <div className="flex justify-between mb-6">
                                <span className="font-semibold text-lg">Total</span>
                                <span className="font-bold text-2xl">${finalTotal.toFixed(2)}</span>
                              </div>

                              {/* Order Items Preview */}
                              <div className="mb-5">
                                <p className="text-sm text-muted-foreground mb-3">{items.length} items in cart</p>
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                  {items.slice(0, 2).map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <div className="w-10 h-10 bg-accent rounded-md overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium truncate">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">${item.price}</p>
                                      </div>
                                    </div>
                                  ))}
                                  {items.length > 2 && (
                                    <p className="text-xs text-muted-foreground text-center pt-1">
                                      +{items.length - 2} more
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-xs text-green-600">
                                <p className="font-medium mb-1">✓ Secure Checkout</p>
                                <p className="text-green-600/80">Your information is encrypted and protected</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer - Fixed Action Buttons */}
                  <div className="flex-shrink-0 border-t border-border bg-background/95 backdrop-blur-sm px-2 md:px-4 py-4">
                    <div className="w-full flex items-center justify-between gap-4">
                      {currentStep > 0 ? (
                        <Button variant="secondary" onClick={handleBack} className="flex items-center gap-2">
                          <ArrowLeft size={18} />
                          Back
                        </Button>
                      ) : (
                        <div></div>
                      )}

                      {currentStep < STEPS.length - 1 ? (
                        <Button onClick={handleNext} size="lg" className="flex items-center gap-2">
                          Continue
                          <ChevronRight size={18} />
                        </Button>
                      ) : (
                        <Button
                          onClick={handlePlaceOrder}
                          disabled={isProcessing}
                          size="lg"
                          className="flex items-center gap-2"
                        >
                          {isProcessing ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                              />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Check size={18} />
                              Place Order ${finalTotal.toFixed(2)}
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}