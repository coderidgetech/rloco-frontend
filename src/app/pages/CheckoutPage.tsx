import { motion, AnimatePresence } from 'motion/react';
import { Check, CreditCard, Truck, ArrowLeft, ShieldCheck, Smartphone, Wallet, Banknote, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useUser } from '../context/UserContext';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { LuxuryInput } from '../components/ui/luxury-input';
import { LuxurySelect } from '../components/ui/luxury-select';
import { LuxuryCheckbox } from '../components/ui/luxury-checkbox';
import { orderService } from '../services/orderService';
import { shippingService } from '../services/shippingService';
import { taxService } from '../services/taxService';
import { promotionService } from '../services/promotionService';
import { paymentService } from '../services/paymentService';
import { CreateOrderRequest } from '../types/api';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
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
}

interface UPIInfo {
  upiId: string;
}

const STEPS = ['Shipping', 'Payment', 'Review'];

export function CheckoutPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();
  const { items, total, clearCart, giftPackingCharge } = useCart();
  const { formatAmount, formatPrice, convertPrice, currency } = useCurrency();
  const giftPackingDisplay = currency === 'INR' ? giftPackingCharge : giftPackingCharge / 75;
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod' | 'wallet'>('card');

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const [upiInfo, setUpiInfo] = useState<UPIInfo>({
    upiId: '',
  });

  // Cost calculation states
  const [shippingCost, setShippingCost] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [promotionCode, setPromotionCode] = useState('');
  const [validatingPromotion, setValidatingPromotion] = useState(false);
  const [promotionError, setPromotionError] = useState('');
  const [appliedPromotion, setAppliedPromotion] = useState<any>(null);

  // Error states
  const [shippingErrors, setShippingErrors] = useState<Partial<Record<keyof ShippingInfo, string>>>({});
  const [paymentErrors, setPaymentErrors] = useState<Partial<Record<keyof PaymentInfo | 'upiId', string>>>({});

  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      navigate('/cart');
    }
  }, [items, navigate, orderComplete]);

  const subtotal = total;
  const finalTotal = subtotal + shippingCost + taxAmount - discount + giftPackingDisplay;

  // Validate promotion code
  const handleValidatePromotion = async () => {
    if (!promotionCode.trim()) {
      setPromotionError('Please enter a promotion code');
      return;
    }

    setValidatingPromotion(true);
    setPromotionError('');
    
    try {
      const result = await promotionService.validate(promotionCode.trim(), subtotal);
      if (result.valid && result.discount !== undefined) {
        setDiscount(result.discount);
        setAppliedPromotion(result.promotion);
        toast.success(`Promotion code "${promotionCode}" applied successfully!`);
      } else {
        setPromotionError('Invalid or expired promotion code');
        setDiscount(0);
        setAppliedPromotion(null);
      }
    } catch (error: any) {
      setPromotionError(error.message || 'Failed to validate promotion code');
      setDiscount(0);
      setAppliedPromotion(null);
    } finally {
      setValidatingPromotion(false);
    }
  };

  // Remove promotion
  const handleRemovePromotion = () => {
    setPromotionCode('');
    setDiscount(0);
    setAppliedPromotion(null);
    setPromotionError('');
    toast.success('Promotion code removed');
  };

  // Calculate shipping and tax when shipping info is available
  useEffect(() => {
    if (shippingInfo.country && currentStep >= 1) {
      const calculateCosts = async () => {
        try {
          // Calculate shipping
          const shippingMethods = await shippingService.calculate({
            country: shippingInfo.country,
            state: shippingInfo.state,
            subtotal: subtotal,
          });
          if (shippingMethods.length > 0) {
            setShippingCost(shippingMethods[0].base_cost || 0);
          }

          // Calculate tax
          const taxResult = await taxService.calculate({
            country: shippingInfo.country,
            state: shippingInfo.state,
            city: shippingInfo.city,
            postal_code: shippingInfo.zipCode,
            subtotal,
          });
          setTaxAmount(taxResult.tax);
        } catch (error) {
          console.error('Failed to calculate shipping/tax:', error);
          // Use defaults
          setShippingCost(0);
          setTaxAmount(subtotal * 0.08);
        }
      };
      calculateCosts();
    }
  }, [shippingInfo.country, shippingInfo.state, shippingInfo.city, shippingInfo.zipCode, subtotal, currentStep]);

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
    const errors: Partial<Record<keyof ShippingInfo, string>> = {};
    
    if (!shippingInfo.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!shippingInfo.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!shippingInfo.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!shippingInfo.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    
    if (!shippingInfo.address.trim()) {
      errors.address = 'Address is required';
    }
    
    if (!shippingInfo.city.trim()) {
      errors.city = 'City is required';
    }
    
    if (!shippingInfo.state.trim()) {
      errors.state = 'State is required';
    }
    
    if (!shippingInfo.zipCode.trim()) {
      errors.zipCode = 'ZIP code is required';
    }
    
    if (!shippingInfo.country.trim()) {
      errors.country = 'Country is required';
    }
    
    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePayment = () => {
    const errors: Partial<Record<keyof PaymentInfo | 'upiId', string>> = {};
    
    if (paymentMethod === 'card') {
      const cardNumberClean = paymentInfo.cardNumber.replace(/\s/g, '');
      
      if (!cardNumberClean) {
        errors.cardNumber = 'Card number is required';
      } else if (cardNumberClean.length !== 16) {
        errors.cardNumber = 'Card number must be 16 digits';
      }
      
      if (!paymentInfo.cardName.trim()) {
        errors.cardName = 'Cardholder name is required';
      }
      
      if (!paymentInfo.expiryDate) {
        errors.expiryDate = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
        errors.expiryDate = 'Invalid expiry date (MM/YY)';
      }
      
      if (!paymentInfo.cvv) {
        errors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(paymentInfo.cvv)) {
        errors.cvv = 'CVV must be 3-4 digits';
      }
    } else if (paymentMethod === 'upi') {
      if (!upiInfo.upiId.trim()) {
        errors.upiId = 'UPI ID is required';
      } else if (!upiInfo.upiId.includes('@')) {
        errors.upiId = 'Please enter a valid UPI ID';
      }
    }
    
    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 0 && !validateShipping()) return;
    if (currentStep === 1 && !validatePayment()) return;
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to place your order. You’ll return to checkout after signing in.');
      navigate('/login?redirect=/checkout');
      return;
    }

    if (!validateShipping() || !validatePayment()) {
      toast.error('Please fix the errors before placing your order');
      return;
    }

    setIsProcessing(true);

    try {
      // Convert cart items to order items format
      const orderItems = items.map((item) => ({
        product_id: String(item.id),
        product_name: item.name,
        image: item.image,
        price: item.price,
        size: item.size,
        quantity: item.quantity,
        ...(item.isGift && {
          is_gift: true,
          gift_wrap_color: item.giftWrapColor,
          gift_message: item.giftMessage,
        }),
      })) as any[];

      // Prepare payment info based on method
      const paymentInfoData: any = {};
      if (paymentMethod === 'card') {
        paymentInfoData.card_number = paymentInfo.cardNumber.replace(/\s/g, '');
        paymentInfoData.card_name = paymentInfo.cardName;
        paymentInfoData.expiry_date = paymentInfo.expiryDate;
        paymentInfoData.cvv = paymentInfo.cvv;
      } else if (paymentMethod === 'upi') {
        paymentInfoData.upi_id = upiInfo.upiId;
      }

      // Create order request (order must be created first for payment intent)
      const orderRequest: CreateOrderRequest = {
        items: orderItems,
        shipping_info: {
          first_name: shippingInfo.firstName,
          last_name: shippingInfo.lastName,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zip_code: shippingInfo.zipCode,
          country: shippingInfo.country,
        },
        payment_info: paymentInfoData,
        payment_method: paymentMethod === 'card' ? 'card' : 
                       paymentMethod === 'upi' ? 'upi' : 
                       paymentMethod === 'wallet' ? 'wallet' : 
                       'cod',
        promotion_code: promotionCode || undefined,
        ...(giftPackingCharge > 0 && { gift_packing_charge: giftPackingCharge }),
      };

      // Create order via API first (required for payment intent)
      const order = await orderService.create(orderRequest);
      
      // For non-COD methods, create payment intent and process payment
      if (paymentMethod !== 'cod') {
        try {
          const finalTotalAmount = subtotal + shippingCost + taxAmount - discount + giftPackingDisplay;
          const gateway = paymentMethod === 'card' || paymentMethod === 'wallet' ? 'stripe' : 'paypal';
          
          // Create payment intent with order_id
          const paymentIntent = await paymentService.createPaymentIntent({
            order_id: order.id,
            amount: finalTotalAmount,
            currency: 'USD',
            gateway,
          });

          // For Stripe/PayPal, redirect to payment URL if provided
          if (paymentIntent.payment_url) {
            // Redirect to payment gateway
            window.location.href = paymentIntent.payment_url;
            return;
          }

          // If no redirect URL, process payment directly (for testing/mock scenarios)
          // In production, this would typically be handled via webhooks after redirect
          try {
            await paymentService.processPayment({
              payment_intent_id: paymentIntent.id,
              payment_method_id: paymentMethod === 'card' ? paymentInfo.cardNumber.replace(/\s/g, '') : upiInfo.upiId,
              gateway,
            });
          } catch (paymentError: any) {
            console.error('Payment processing error:', paymentError);
            // Order is created but payment failed - user can retry payment
            toast.warning('Order created but payment processing failed. Please contact support.');
          }
        } catch (error: any) {
          console.error('Failed to create payment intent:', error);
          toast.error('Failed to initialize payment. Please try again.');
          setIsProcessing(false);
          return;
        }
      }
      
      setOrderNumber(order.order_number);
      setOrderComplete(true);
      
      toast.success('Order placed successfully!');
      
      // Navigate to order confirmation page
      setTimeout(() => {
        navigate(`/order-confirmation/${order.id}`, {
          state: {
            orderNumber: order.order_number,
            email: shippingInfo.email,
            paymentMethod: paymentMethod === 'card' ? 'Credit/Debit Card' : 
                          paymentMethod === 'upi' ? 'UPI' : 
                          paymentMethod === 'wallet' ? 'Wallet' : 
                          'Cash on Delivery',
            shippingInfo: shippingInfo,
            orderItems: orderItems,
            subtotal: order.subtotal,
            shippingCost: order.shipping_cost,
            tax: order.tax,
            discount: order.discount,
            total: order.total,
          }
        });
        
        // Clear cart after successful order
        clearCart();
      }, 1500);
    } catch (error: any) {
      console.error('Failed to place order:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="h-screen bg-background flex items-center justify-center px-4 pt-[72px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 mx-auto mb-6 bg-green-500/10 flex items-center justify-center"
          >
            <Check size={40} className="text-green-600" />
          </motion.div>
          
          <h1 className="text-3xl mb-3">Order Confirmed</h1>
          <p className="text-foreground/60 mb-6">Thank you for your purchase</p>
          
          <div className="bg-foreground/5 p-5 mb-6">
            <p className="text-xs text-foreground/60 mb-1 uppercase tracking-widest">Order Number</p>
            <p className="text-2xl font-mono">{orderNumber}</p>
          </div>

          <div className="space-y-2 text-sm text-foreground/60 mb-8">
            <p>✓ Confirmation sent to {shippingInfo.email}</p>
            <p>✓ Delivery in 5-7 business days</p>
            <p>✓ Payment via {paymentMethod === 'card' ? 'Credit/Debit Card' : paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'wallet' ? 'Wallet' : 'Cash on Delivery'}</p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 transition-all uppercase tracking-widest text-xs"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background pt-[72px] overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header with Steps */}
        <div className="border-b border-foreground/10 bg-background">
          <div className="w-full px-4 md:px-6 lg:px-12 xl:px-16 py-3">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => currentStep > 0 ? handleBack() : navigate('/cart')}
                className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors text-sm"
              >
                <ArrowLeft size={16} />
                <span className="hidden md:inline">Back</span>
              </button>
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-foreground/60" />
                <h1 className="text-sm md:text-base uppercase tracking-wider">Secure Checkout</h1>
              </div>
              <div className="text-xs text-foreground/40 uppercase tracking-wider">
                Step {currentStep + 1}/3
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 md:gap-4">
              {STEPS.map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={{
                        scale: index === currentStep ? 1.1 : 1,
                      }}
                      className={`w-7 h-7 md:w-8 md:h-8 flex items-center justify-center mb-1 transition-colors duration-300 ${
                        index <= currentStep 
                          ? 'bg-foreground text-background' 
                          : 'bg-foreground/10 text-foreground/40'
                      }`}
                    >
                      {index < currentStep ? (
                        <Check size={14} strokeWidth={3} />
                      ) : (
                        <span className="text-xs">{index + 1}</span>
                      )}
                    </motion.div>
                    <span className={`text-[10px] md:text-xs uppercase tracking-wider transition-colors ${
                      index === currentStep ? 'text-foreground' : 'text-foreground/40'
                    }`}>
                      {step}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className="w-8 md:w-16 h-px bg-foreground/10 mx-2 mb-4">
                      <motion.div
                        animate={{
                          width: index < currentStep ? '100%' : '0%',
                        }}
                        transition={{ duration: 0.3 }}
                        className="h-full bg-foreground"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full w-full px-4 md:px-6 lg:px-12 xl:px-16 py-4 md:py-6">
            <div className="grid lg:grid-cols-2 gap-4 md:gap-6 h-full">
              {/* Left: Step Content */}
              <div className="flex flex-col">
                <AnimatePresence mode="wait">
                  {/* Step 1: Shipping */}
                  {currentStep === 0 && (
                    <motion.div
                      key="shipping"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1 flex flex-col"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Truck size={18} className="text-foreground/60" />
                        <h2 className="text-sm uppercase tracking-widest">Shipping Details</h2>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 340px)' }}>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <LuxuryInput
                              label="First name"
                              type="text"
                              value={shippingInfo.firstName}
                              onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                              placeholder="Enter first name"
                              error={shippingErrors.firstName}
                            />
                            <LuxuryInput
                              label="Last name"
                              type="text"
                              value={shippingInfo.lastName}
                              onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                              placeholder="Enter last name"
                              error={shippingErrors.lastName}
                            />
                          </div>
                          
                          <LuxuryInput
                            label="Email"
                            type="email"
                            value={shippingInfo.email}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                            placeholder="Enter your email address"
                            error={shippingErrors.email}
                          />
                          
                          <LuxuryInput
                            label="Phone"
                            type="tel"
                            value={shippingInfo.phone}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                            placeholder="Enter your phone number"
                            error={shippingErrors.phone}
                          />
                          
                          <LuxuryInput
                            label="Address"
                            type="text"
                            value={shippingInfo.address}
                            onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                            placeholder="Enter your street address"
                            error={shippingErrors.address}
                          />
                          
                          <div className="grid grid-cols-2 gap-3">
                            <LuxuryInput
                              label="City"
                              type="text"
                              value={shippingInfo.city}
                              onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                              placeholder="Mumbai"
                              error={shippingErrors.city}
                            />
                            <LuxuryInput
                              label="State"
                              type="text"
                              value={shippingInfo.state}
                              onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                              placeholder="Maharashtra"
                              error={shippingErrors.state}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <LuxuryInput
                              label="ZIP code"
                              type="text"
                              value={shippingInfo.zipCode}
                              onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                              placeholder="400001"
                              error={shippingErrors.zipCode}
                            />
                            <div>
                              <label className="block text-xs mb-2 text-foreground/60 uppercase tracking-wider">Country</label>
                              <select
                                value={shippingInfo.country}
                                onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                                className="w-full h-11 px-3 bg-background border border-foreground/20 text-sm focus:border-foreground focus:outline-none transition-colors"
                              >
                                <option value="">Select Country</option>
                                <option value="India">India</option>
                                <option value="United States">United States</option>
                              </select>
                              {shippingErrors.country && <p className="text-xs text-red-500 mt-1">{shippingErrors.country}</p>}
                            </div>
                          </div>

                          <div className="bg-foreground/5 p-3 border border-foreground/10 mt-4">
                            <div className="flex items-center gap-2 text-xs text-foreground/60 mb-2">
                              <Truck size={14} />
                              <span className="uppercase tracking-wider">Free Shipping</span>
                            </div>
                            <p className="text-xs text-foreground/50">Delivery in 5-7 business days</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-foreground/10">
                        <button
                          onClick={handleNext}
                          className="w-full h-11 bg-foreground text-background hover:bg-foreground/90 transition-all uppercase tracking-widest text-xs"
                        >
                          Continue to Payment
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Payment */}
                  {currentStep === 1 && (
                    <motion.div
                      key="payment"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1 flex flex-col"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <CreditCard size={18} className="text-foreground/60" />
                        <h2 className="text-sm uppercase tracking-widest">Payment Method</h2>
                      </div>

                      <div className="flex-1 overflow-y-auto pr-2" style={{ maxHeight: 'calc(100vh - 340px)' }}>
                        <div className="space-y-3">
                          {/* Payment Method Selection */}
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            <button
                              onClick={() => setPaymentMethod('card')}
                              className={`h-16 border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                                paymentMethod === 'card'
                                  ? 'border-foreground bg-foreground/5'
                                  : 'border-foreground/20 hover:border-foreground/40'
                              }`}
                            >
                              <CreditCard size={18} className={paymentMethod === 'card' ? 'text-foreground' : 'text-foreground/40'} />
                              <span className="text-xs uppercase tracking-wider">Card</span>
                            </button>

                            <button
                              onClick={() => setPaymentMethod('upi')}
                              className={`h-16 border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                                paymentMethod === 'upi'
                                  ? 'border-foreground bg-foreground/5'
                                  : 'border-foreground/20 hover:border-foreground/40'
                              }`}
                            >
                              <Smartphone size={18} className={paymentMethod === 'upi' ? 'text-foreground' : 'text-foreground/40'} />
                              <span className="text-xs uppercase tracking-wider">UPI</span>
                            </button>

                            <button
                              onClick={() => setPaymentMethod('wallet')}
                              className={`h-16 border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                                paymentMethod === 'wallet'
                                  ? 'border-foreground bg-foreground/5'
                                  : 'border-foreground/20 hover:border-foreground/40'
                              }`}
                            >
                              <Wallet size={18} className={paymentMethod === 'wallet' ? 'text-foreground' : 'text-foreground/40'} />
                              <span className="text-xs uppercase tracking-wider">Wallet</span>
                            </button>

                            <button
                              onClick={() => setPaymentMethod('cod')}
                              className={`h-16 border-2 transition-all flex flex-col items-center justify-center gap-1 ${
                                paymentMethod === 'cod'
                                  ? 'border-foreground bg-foreground/5'
                                  : 'border-foreground/20 hover:border-foreground/40'
                              }`}
                            >
                              <Banknote size={18} className={paymentMethod === 'cod' ? 'text-foreground' : 'text-foreground/40'} />
                              <span className="text-xs uppercase tracking-wider">COD</span>
                            </button>
                          </div>

                          {/* Card Payment Form */}
                          {paymentMethod === 'card' && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="space-y-3"
                            >
                              <div>
                                <label className="block text-xs mb-1 text-foreground/60 uppercase tracking-wider">Card Number</label>
                                <LuxuryInput
                                  type="text"
                                  value={paymentInfo.cardNumber}
                                  onChange={(e) => {
                                    const formatted = formatCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16));
                                    setPaymentInfo({ ...paymentInfo, cardNumber: formatted });
                                  }}
                                  className="w-full h-10 px-3 bg-background border border-foreground/20 text-sm focus:border-foreground focus:outline-none transition-colors font-mono"
                                  placeholder="1234 5678 9012 3456"
                                />
                                {paymentErrors.cardNumber && <p className="text-xs text-red-500">{paymentErrors.cardNumber}</p>}
                              </div>

                              <div>
                                <label className="block text-xs mb-1 text-foreground/60 uppercase tracking-wider">Name on Card</label>
                                <LuxuryInput
                                  type="text"
                                  value={paymentInfo.cardName}
                                  onChange={(e) => setPaymentInfo({ ...paymentInfo, cardName: e.target.value })}
                                  className="w-full h-10 px-3 bg-background border border-foreground/20 text-sm focus:border-foreground focus:outline-none transition-colors"
                                  placeholder="Enter cardholder name"
                                />
                                {paymentErrors.cardName && <p className="text-xs text-red-500">{paymentErrors.cardName}</p>}
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs mb-1 text-foreground/60 uppercase tracking-wider">Expiry</label>
                                  <LuxuryInput
                                    type="text"
                                    value={paymentInfo.expiryDate}
                                    onChange={(e) => {
                                      const formatted = formatExpiryDate(e.target.value);
                                      setPaymentInfo({ ...paymentInfo, expiryDate: formatted });
                                    }}
                                    className="w-full h-10 px-3 bg-background border border-foreground/20 text-sm focus:border-foreground focus:outline-none transition-colors font-mono"
                                    placeholder="MM/YY"
                                    maxLength={5}
                                  />
                                  {paymentErrors.expiryDate && <p className="text-xs text-red-500">{paymentErrors.expiryDate}</p>}
                                </div>
                                <div>
                                  <label className="block text-xs mb-1 text-foreground/60 uppercase tracking-wider">CVV</label>
                                  <LuxuryInput
                                    type="text"
                                    value={paymentInfo.cvv}
                                    onChange={(e) => {
                                      const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                                      setPaymentInfo({ ...paymentInfo, cvv: value });
                                    }}
                                    className="w-full h-10 px-3 bg-background border border-foreground/20 text-sm focus:border-foreground focus:outline-none transition-colors font-mono"
                                    placeholder="123"
                                    maxLength={4}
                                  />
                                  {paymentErrors.cvv && <p className="text-xs text-red-500">{paymentErrors.cvv}</p>}
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* UPI Payment Form */}
                          {paymentMethod === 'upi' && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="space-y-3"
                            >
                              <div>
                                <label className="block text-xs mb-1 text-foreground/60 uppercase tracking-wider">UPI ID</label>
                                <LuxuryInput
                                  type="text"
                                  value={upiInfo.upiId}
                                  onChange={(e) => setUpiInfo({ upiId: e.target.value })}
                                  className="w-full h-10 px-3 bg-background border border-foreground/20 text-sm focus:border-foreground focus:outline-none transition-colors"
                                  placeholder="yourname@upi"
                                />
                                {paymentErrors.upiId && <p className="text-xs text-red-500">{paymentErrors.upiId}</p>}
                              </div>
                              <div className="bg-foreground/5 p-3 border border-foreground/10 text-xs text-foreground/60">
                                Enter your UPI ID to complete payment instantly
                              </div>
                            </motion.div>
                          )}

                          {/* Wallet Payment */}
                          {paymentMethod === 'wallet' && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="space-y-2"
                            >
                              <div className="bg-foreground/5 p-4 border border-foreground/10">
                                <p className="text-xs text-foreground/60 mb-3 uppercase tracking-wider">Select Wallet</p>
                                <div className="space-y-2">
                                  {['Paytm', 'PhonePe', 'Google Pay', 'Amazon Pay'].map((wallet) => (
                                    <label key={wallet} className="flex items-center gap-3 p-2 border border-foreground/10 hover:bg-foreground/5 cursor-pointer transition-colors">
                                      <input type="radio" name="wallet" className="w-4 h-4" />
                                      <span className="text-sm">{wallet}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* Cash on Delivery */}
                          {paymentMethod === 'cod' && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-foreground/5 p-4 border border-foreground/10"
                            >
                              <p className="text-xs text-foreground/60 mb-2 uppercase tracking-wider">Cash on Delivery</p>
                              <p className="text-xs text-foreground/50">Pay when you receive your order. Please keep exact change ready.</p>
                            </motion.div>
                          )}

                          <div className="bg-blue-500/10 border border-blue-500/20 p-3 flex items-start gap-2 mt-4">
                            <ShieldCheck size={14} className="text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-blue-600">
                              Your payment is secure and encrypted
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Promotion Code Section in Payment Step */}
                      <div className="pt-4 mt-4 border-t border-foreground/10">
                        <div className="mb-4">
                          <label className="block text-xs mb-2 text-foreground/60 uppercase tracking-wider">Promotion Code</label>
                          <div className="flex gap-2">
                            <LuxuryInput
                              type="text"
                              value={promotionCode}
                              onChange={(e) => {
                                setPromotionCode(e.target.value);
                                setPromotionError('');
                                if (appliedPromotion) {
                                  setDiscount(0);
                                  setAppliedPromotion(null);
                                }
                              }}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && !validatingPromotion) {
                                  handleValidatePromotion();
                                }
                              }}
                              className="flex-1 h-10 px-3 bg-background border border-foreground/20 text-sm focus:border-foreground focus:outline-none transition-colors uppercase"
                              placeholder="Enter code"
                              disabled={validatingPromotion || !!appliedPromotion}
                            />
                            {appliedPromotion ? (
                              <button
                                onClick={handleRemovePromotion}
                                className="px-4 h-10 border border-foreground/20 hover:bg-foreground/5 transition-colors text-xs uppercase tracking-wider"
                              >
                                Remove
                              </button>
                            ) : (
                              <button
                                onClick={handleValidatePromotion}
                                disabled={validatingPromotion || !promotionCode.trim()}
                                className="px-4 h-10 bg-foreground text-background hover:bg-foreground/90 transition-all text-xs uppercase tracking-wider disabled:opacity-50"
                              >
                                {validatingPromotion ? '...' : 'Apply'}
                              </button>
                            )}
                          </div>
                          {promotionError && (
                            <p className="text-xs text-red-600 mt-1">{promotionError}</p>
                          )}
                          {appliedPromotion && (
                            <p className="text-xs text-green-600 mt-1">
                              {appliedPromotion.name} applied - {appliedPromotion.type === 'percentage' 
                                ? `${appliedPromotion.value}% off` 
                                : appliedPromotion.type === 'fixed'
                                ? `$${appliedPromotion.value} off`
                                : 'Free shipping'}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={handleNext}
                          className="w-full h-11 bg-foreground text-background hover:bg-foreground/90 transition-all uppercase tracking-widest text-xs"
                        >
                          Review Order
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Review */}
                  {currentStep === 2 && (
                    <motion.div
                      key="review"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex-1 flex flex-col"
                    >
                      <h2 className="text-sm uppercase tracking-widest mb-4">Review Order</h2>

                      <div className="flex-1 overflow-y-auto pr-2 space-y-3" style={{ maxHeight: 'calc(100vh - 340px)' }}>
                        {/* Shipping Info */}
                        <div className="border border-foreground/10 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs uppercase tracking-wider text-foreground/60">Shipping To</p>
                            <button onClick={() => setCurrentStep(0)} className="text-xs underline text-foreground/60 hover:text-foreground">Edit</button>
                          </div>
                          <div className="text-sm space-y-0.5">
                            <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                            <p className="text-foreground/60">{shippingInfo.address}</p>
                            <p className="text-foreground/60">{shippingInfo.city}, {shippingInfo.state}, {shippingInfo.zipCode}</p>
                            <p className="text-foreground/60">{shippingInfo.email}</p>
                            <p className="text-foreground/60">{shippingInfo.phone}</p>
                          </div>
                        </div>

                        {/* Payment Method */}
                        <div className="border border-foreground/10 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs uppercase tracking-wider text-foreground/60">Payment Method</p>
                            <button onClick={() => setCurrentStep(1)} className="text-xs underline text-foreground/60 hover:text-foreground">Edit</button>
                          </div>
                          <div className="text-sm">
                            {paymentMethod === 'card' && <p>Credit/Debit Card ending in {paymentInfo.cardNumber.slice(-4)}</p>}
                            {paymentMethod === 'upi' && <p>UPI - {upiInfo.upiId}</p>}
                            {paymentMethod === 'wallet' && <p>Digital Wallet</p>}
                            {paymentMethod === 'cod' && <p>Cash on Delivery</p>}
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="border border-foreground/10 p-3">
                          <p className="text-xs uppercase tracking-wider text-foreground/60 mb-3">Order Items</p>
                          <div className="space-y-2">
                            {items.map((item) => (
                              <div key={`${item.id}-${item.size}`} className="flex gap-3 pb-2 border-b border-foreground/5 last:border-0">
                                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover" style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm truncate">{item.name}</p>
                                  <p className="text-xs text-foreground/50">Size: {item.size} × {item.quantity}</p>
                                </div>
                                <div className="text-sm whitespace-nowrap">
                                  {formatAmount(convertPrice(item.price, (item as any).priceINR) * item.quantity)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-foreground/10 space-y-3">
                        {!isAuthenticated && (
                          <p className="text-xs text-foreground/60 text-center">
                            Sign in required to place your order. You’ll return here after logging in.
                          </p>
                        )}
                        <button
                          onClick={handlePlaceOrder}
                          disabled={isProcessing}
                          className="w-full h-11 bg-foreground text-background hover:bg-foreground/90 transition-all uppercase tracking-widest text-xs disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {isProcessing ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full"
                              />
                              Processing...
                            </>
                          ) : (
                            `Place Order • ${formatAmount(finalTotal)}`
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right: Order Summary - Fixed */}
              <div className="hidden lg:flex flex-col border border-foreground/10 overflow-hidden">
                <div className="p-4 border-b border-foreground/10">
                  <h2 className="text-xs uppercase tracking-widest">Order Summary</h2>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 'calc(100vh - 340px)' }}>
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex gap-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{item.name}</p>
                        <p className="text-xs text-foreground/50">Size: {item.size} × {item.quantity}</p>
                      </div>
                      <div className="text-sm whitespace-nowrap">
                        {formatAmount(convertPrice(item.price, (item as any).priceINR) * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-foreground/10 bg-foreground/[0.02]">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-foreground/60">
                      <span>Subtotal</span>
                      <span>{formatAmount(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-foreground/60">
                      <span>Tax</span>
                      <span>{formatAmount(taxAmount)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-foreground/60">
                        <span>Discount</span>
                        <span className="text-green-600">-{formatAmount(discount)}</span>
                      </div>
                    )}
                    {giftPackingCharge > 0 && (
                      <div className="flex justify-between text-foreground/60">
                        <span>Gift packing</span>
                        <span>{formatAmount(giftPackingDisplay)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-foreground/60">
                      <span>Shipping</span>
                      <span>{shippingCost > 0 ? formatAmount(shippingCost) : <span className="text-green-600">FREE</span>}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-foreground/10">
                      <span className="uppercase tracking-wider">Total</span>
                      <span className="text-lg">{formatAmount(finalTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}