import { motion, AnimatePresence } from 'motion/react';
import { Check, CreditCard, Truck, ArrowLeft, ShieldCheck, Smartphone, Wallet, Banknote, AlertCircle, MapPin, Plus, Home, Briefcase } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useUser } from '../context/UserContext';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { LuxuryInput } from '../components/ui/luxury-input';
import { LuxurySelect } from '../components/ui/luxury-select';
import { LuxuryCheckbox } from '../components/ui/luxury-checkbox';
import { orderService } from '../services/orderService';
import { shippingService } from '../services/shippingService';
import { taxService } from '../services/taxService';
import { paymentService } from '../services/paymentService';
import { addressService, Address } from '../services/addressService';
import { StripePaymentForm } from '../components/StripePaymentForm';
import { AddressAutocompleteInput, lookupZipCode } from '../components/AddressAutocompleteInput';
import { CreateOrderRequest } from '../types/api';
import type { Order } from '../types/api';
import { PH } from '../lib/formPlaceholders';

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

const STEPS = ['Shipping', 'Payment', 'Review'];

export function CheckoutPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, user } = useUser();
  const { items, total, clearCart, giftPackingCharge } = useCart();
  const { formatAmount, formatPrice, convertPrice, currency } = useCurrency();
  const giftPackingDisplay = currency === 'INR' ? giftPackingCharge : giftPackingCharge / 75;
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod' | 'wallet'>('card');
  const [pendingStripePayment, setPendingStripePayment] = useState<{ order: Order; clientSecret: string } | null>(null);
  const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;

  const stripeReturnUrl = useMemo(
    () => `${window.location.origin}${window.location.pathname || '/checkout'}`,
    []
  );

  const walletAvailable = currency === 'INR';

  // When Wallet is not available (e.g. USD), switch off wallet if it was selected
  useEffect(() => {
    if (!walletAvailable && paymentMethod === 'wallet') {
      setPaymentMethod('card');
    }
  }, [walletAvailable, paymentMethod]);

  // Saved addresses
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const mapAddressToShipping = (addr: Address): ShippingInfo => {
    const parts = addr.name.trim().split(/\s+/);
    // Single-word names: use full name as firstName, '.' as lastName placeholder
    const firstName = parts[0] || addr.name.trim();
    const lastName = parts.length > 1 ? parts.slice(1).join(' ') : '.';
    return {
      firstName,
      lastName,
      email: user?.email || '',
      phone: addr.mobile,
      address: addr.address_line + (addr.address_line2 ? ', ' + addr.address_line2 : ''),
      city: addr.city,
      state: addr.state,
      zipCode: addr.pincode,
      country: addr.country,
    };
  };

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

  const [selectedWallet, setSelectedWallet] = useState('Paytm');

  // Cost calculation states
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingCostCurrency, setShippingCostCurrency] = useState<'USD' | 'INR'>('USD');
  const [taxAmount, setTaxAmount] = useState(0);

  // Error states
  const [shippingErrors, setShippingErrors] = useState<Partial<Record<keyof ShippingInfo, string>>>({});
  const [paymentErrors, setPaymentErrors] = useState<Partial<Record<keyof PaymentInfo, string>>>({});

  const shippingCountryCode =
    shippingInfo.country === 'United States'
      ? 'us'
      : shippingInfo.country === 'India'
        ? 'in'
        : undefined;

  // Handle return from Stripe redirect (e.g. UPI, bank redirect)
  useEffect(() => {
    const clientSecret = searchParams.get('payment_intent_client_secret');
    const redirectStatus = searchParams.get('redirect_status');
    if (!clientSecret || !redirectStatus || !stripePublishableKey) return;

    const handleReturn = async () => {
      try {
        const stripe = await loadStripe(stripePublishableKey);
        if (!stripe) return;
        const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
        if (!paymentIntent || paymentIntent.status !== 'succeeded') {
          if (paymentIntent?.status === 'processing') {
            toast.info('Payment is processing. You will receive confirmation shortly.');
          } else {
            toast.error('Payment could not be confirmed.');
          }
          setSearchParams((p) => {
            p.delete('payment_intent_client_secret');
            p.delete('redirect_status');
            return p;
          });
          return;
        }
        const orderId = paymentIntent.metadata?.order_id;
        if (!orderId) {
          toast.error('Order not found.');
          setSearchParams((p) => {
            p.delete('payment_intent_client_secret');
            p.delete('redirect_status');
            return p;
          });
          return;
        }
        toast.success('Payment confirmed!');
        clearCart();
        setSearchParams((p) => {
          p.delete('payment_intent_client_secret');
          p.delete('redirect_status');
          return p;
        });
        navigate(`/order-confirmation/${orderId}`, { replace: true });
      } catch (e) {
        console.error('Stripe return handling:', e);
        toast.error('Could not confirm payment.');
        setSearchParams((p) => {
          p.delete('payment_intent_client_secret');
          p.delete('redirect_status');
          return p;
        });
      }
    };

    handleReturn();
  }, [searchParams, stripePublishableKey, clearCart, navigate, setSearchParams]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout', { replace: true });
      return;
    }
    if (items.length === 0 && !orderComplete) {
      navigate('/cart');
    }
  }, [isAuthenticated, items, navigate, orderComplete]);

  // Fetch saved addresses and pre-select default
  useEffect(() => {
    if (!isAuthenticated) return;
    addressService.list().then((addrs) => {
      const safeAddrs = addrs ?? [];
      setSavedAddresses(safeAddrs);
      if (safeAddrs.length > 0) {
        const defaultAddr = safeAddrs.find((a) => a.is_default) || safeAddrs[0];
        setSelectedAddressId(defaultAddr.id);
        setShippingInfo(mapAddressToShipping(defaultAddr));
        setShowNewAddressForm(false);
      } else {
        setShowNewAddressForm(true);
      }
    }).catch(() => {
      setShowNewAddressForm(true);
    });
  }, [isAuthenticated]);

  // Subtotal in display currency (INR or USD) so order summary is correct when switching country/currency
  const subtotal = items.reduce(
    (sum, item) => sum + convertPrice(item.price, (item as any).priceINR) * item.quantity,
    0
  );
  // Backend returns shipping/tax in USD; convert to display currency for India (INR)
  const USD_TO_INR = 75;
  const convertBetweenCurrencies = (amount: number, fromCurrency: string, toCurrency: string) => {
    const from = fromCurrency.toUpperCase();
    const to = toCurrency.toUpperCase();
    if (from === to) return amount;
    if (from === 'USD' && to === 'INR') return amount * USD_TO_INR;
    if (from === 'INR' && to === 'USD') return amount / USD_TO_INR;
    return amount;
  };
  const shippingDisplay = convertBetweenCurrencies(shippingCost, shippingCostCurrency, currency);
  const taxDisplay = currency === 'INR' ? taxAmount * USD_TO_INR : taxAmount;
  const finalTotal = subtotal + shippingDisplay + taxDisplay + giftPackingDisplay;

  // USD subtotal for backend APIs (shipping/tax return USD amounts)
  const subtotalUSD = total;

  // Calculate shipping and tax when shipping info is available (backend uses USD)
  useEffect(() => {
    if (shippingInfo.country && currentStep >= 1) {
      const calculateCosts = async () => {
        try {
          const shippingMethods = await shippingService.calculate({
            country: shippingInfo.country,
            state: shippingInfo.state,
            city: shippingInfo.city,
            address: shippingInfo.address,
            postal_code: shippingInfo.zipCode,
            first_name: shippingInfo.firstName,
            last_name: shippingInfo.lastName,
            email: shippingInfo.email,
            phone: shippingInfo.phone,
            subtotal: subtotalUSD,
          });
          if (shippingMethods.length > 0) {
            setShippingCost(shippingMethods[0].base_cost || 0);
            setShippingCostCurrency((shippingMethods[0].currency?.toUpperCase() as 'USD' | 'INR') || 'USD');
          } else {
            setShippingCostCurrency('USD');
          }

          const taxResult = await taxService.calculate({
            country: shippingInfo.country,
            state: shippingInfo.state,
            city: shippingInfo.city,
            postal_code: shippingInfo.zipCode,
            subtotal: subtotalUSD,
          });
          setTaxAmount(taxResult.tax);
        } catch (error) {
          console.error('Failed to calculate shipping/tax:', error);
          setShippingCost(0);
          setShippingCostCurrency('USD');
          setTaxAmount(subtotalUSD * 0.08);
        }
      };
      calculateCosts();
    }
  }, [shippingInfo.country, shippingInfo.state, shippingInfo.city, shippingInfo.zipCode, subtotalUSD, currentStep]);

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

  const handleZipCodeChange = async (value: string) => {
    const normalized =
      shippingInfo.country === 'United States' || shippingInfo.country === 'India'
        ? value.replace(/\D/g, '')
        : value;

    setShippingInfo((prev) => ({ ...prev, zipCode: normalized }));

    const countryCode =
      shippingInfo.country === 'United States'
        ? 'us'
        : shippingInfo.country === 'India'
          ? 'in'
          : undefined;

    if (!countryCode) return;

    const requiredLength = countryCode === 'us' ? 5 : 6;
    if (normalized.length < requiredLength) return;

    const result = await lookupZipCode(normalized, countryCode);
    if (!result) return;

    setShippingInfo((prev) => ({
      ...prev,
      zipCode: normalized,
      city: result.city || prev.city,
      state: result.state || prev.state,
    }));
  };

  const validateShipping = () => {
    const errors: Partial<Record<keyof ShippingInfo, string>> = {};

    // When a saved address card is selected, only verify email (address data is trusted)
    if (selectedAddressId && !showNewAddressForm) {
      if (!shippingInfo.email.trim()) {
        errors.email = 'Email address is required to continue';
      } else if (!/\S+@\S+\.\S+/.test(shippingInfo.email)) {
        errors.email = 'Please enter a valid email address';
      }
      setShippingErrors(errors);
      return Object.keys(errors).length === 0;
    }

    // Full validation for manually entered address
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
    const errors: Partial<Record<keyof PaymentInfo, string>> = {};
    // Card, UPI, and Wallet all use Stripe Payment Element — no field validation needed on our form
    const usesStripePayment = (paymentMethod === 'card' || paymentMethod === 'upi' || paymentMethod === 'wallet') && !!stripePublishableKey;

    if (usesStripePayment) {
      setPaymentErrors(errors);
      return true;
    }

    if (paymentMethod === 'card') {
      const cardNumberClean = paymentInfo.cardNumber.replace(/\s/g, '');
      if (!cardNumberClean) errors.cardNumber = 'Card number is required';
      else if (cardNumberClean.length !== 16) errors.cardNumber = 'Card number must be 16 digits';
      if (!paymentInfo.cardName.trim()) errors.cardName = 'Cardholder name is required';
      if (!paymentInfo.expiryDate) errors.expiryDate = 'Expiry date is required';
      else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) errors.expiryDate = 'Invalid expiry date (MM/YY)';
      if (!paymentInfo.cvv) errors.cvv = 'CVV is required';
      else if (!/^\d{3,4}$/.test(paymentInfo.cvv)) errors.cvv = 'CVV must be 3-4 digits';
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

    // Card, UPI, and Wallet go through Stripe; only COD completes without a gateway
    const usesStripe = paymentMethod === 'card' || paymentMethod === 'upi' || paymentMethod === 'wallet';
    if (usesStripe && !stripePublishableKey) {
      toast.error('Online payments (Card, UPI, Wallet) are not configured. Please use Cash on Delivery.');
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

      // Never send raw card data to the server — Stripe Elements handles card capture securely
      const paymentInfoData: any = {};
      if (paymentMethod === 'wallet') {
        paymentInfoData.wallet_name = selectedWallet;
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
        ...(giftPackingCharge > 0 && { gift_packing_charge: giftPackingCharge }),
      };

      // Create order (gateway check already passed above — no dangling orders)
      const order = await orderService.create(orderRequest);

      // Card → Stripe Elements (secure card capture on next screen)
      if (usesStripe) {
        try {
          const paymentCurrency = currency === 'INR' ? 'inr' : 'usd';
          const paymentIntent = await paymentService.createPaymentIntent({
            order_id: order.id,
            amount: finalTotal,
            currency: paymentCurrency,
            gateway: 'stripe',
            payment_method: paymentMethod === 'card' ? 'card' : paymentMethod === 'upi' ? 'upi' : 'wallet',
          });

          if (paymentIntent.client_secret) {
            setPendingStripePayment({ order, clientSecret: paymentIntent.client_secret });
            setIsProcessing(false);
            return;
          }

          toast.error('Payment could not be started. Please try again or use Cash on Delivery.');
          setIsProcessing(false);
          return;
        } catch (error: any) {
          console.error('Failed to create payment intent:', error);
          const msg = error?.response?.data?.error ?? error?.message ?? 'Failed to initialize payment.';
          toast.error(msg);
          setIsProcessing(false);
          return;
        }
      }

      // COD only — complete immediately (no gateway)
      setOrderNumber(order.order_number);
      setOrderComplete(true);
      toast.success('Order placed successfully!');
      setTimeout(() => {
        navigate(`/order-confirmation/${order.id}`, {
          state: {
            orderNumber: order.order_number,
            email: shippingInfo.email,
            paymentMethod: 'Cash on Delivery',
            shippingInfo: shippingInfo,
            orderItems: orderItems,
            subtotal: order.subtotal,
            shippingCost: order.shipping_cost,
            tax: order.tax,
            discount: order.discount,
            total: order.total,
          },
        });
        clearCart();
      }, 1500);
    } catch (error: any) {
      console.error('Failed to place order:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStripePaymentSuccess = () => {
    if (!pendingStripePayment) return;
    const order = pendingStripePayment.order;
    setOrderNumber(order.order_number);
    setOrderComplete(true);
    setPendingStripePayment(null);
    toast.success('Order placed successfully!');
    const methodLabel = paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'wallet' ? 'Wallet' : 'Card';
    setTimeout(() => {
      navigate(`/order-confirmation/${order.id}`, {
        state: {
          orderNumber: order.order_number,
          email: shippingInfo.email,
          paymentMethod: methodLabel,
          shippingInfo: shippingInfo,
          orderItems: order.items,
          subtotal: order.subtotal,
          shippingCost: order.shipping_cost,
          tax: order.tax,
          discount: order.discount,
          total: order.total,
        },
      });
      clearCart();
    }, 1500);
  };

  if (pendingStripePayment) {
    const stripeSubtitle =
      paymentMethod === 'upi'
        ? 'Choose the UPI tab below to pay with your UPI app.'
        : paymentMethod === 'wallet'
          ? 'Choose UPI or your wallet in the options below.'
          : 'Pay securely with card, UPI, or wallet (Stripe).';
    const isINR = currency === 'INR';
    return (
      <div className="min-h-screen bg-background px-4 sm:px-6 pt-page-nav pb-mobile-nav md:pb-12">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-semibold mb-2">Complete payment</h1>
          <p className="text-muted-foreground mb-6">
            Order {pendingStripePayment.order.order_number} — {stripeSubtitle}
          </p>
          {isINR && (
            <p className="text-xs text-foreground/60 mb-4 p-3 bg-foreground/5 border border-foreground/10">
              Paying in INR: Card and UPI should both appear below. If you only see Card, enable UPI in your Stripe Dashboard (Settings → Payment methods → UPI).
            </p>
          )}
          <StripePaymentForm
            publishableKey={stripePublishableKey!}
            clientSecret={pendingStripePayment.clientSecret}
            returnUrl={stripeReturnUrl}
            preferredPaymentMethod={paymentMethod}
            onSuccess={handleStripePaymentSuccess}
            onCancel={() => {
              setPendingStripePayment(null);
              setIsProcessing(false);
              toast.info('Payment cancelled');
            }}
          />
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="h-screen bg-background flex items-center justify-center px-4 pt-page-nav">
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
    <div className="min-h-screen bg-background pt-page-nav pb-mobile-nav">
      <div className="flex flex-col">
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
        <div className="flex-1">
          <div className="w-full px-4 md:px-6 lg:px-12 xl:px-16 py-4 md:py-6">
            <div className="grid lg:grid-cols-2 gap-4 md:gap-6 lg:items-start">
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
                      className="flex flex-col"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <Truck size={18} className="text-foreground/60" />
                        <h2 className="text-sm uppercase tracking-widest">Delivery Address</h2>
                      </div>

                      <div className="overflow-y-auto pr-2">
                        <div className="space-y-3">

                          {/* Saved address cards */}
                          {savedAddresses.length > 0 && (
                            <>
                              {savedAddresses.map((addr) => {
                                const isSelected = selectedAddressId === addr.id && !showNewAddressForm;
                                return (
                                  <button
                                    key={addr.id}
                                    type="button"
                                    onClick={() => {
                                      setSelectedAddressId(addr.id);
                                      setShippingInfo(mapAddressToShipping(addr));
                                      setShowNewAddressForm(false);
                                      setShippingErrors({});
                                    }}
                                    className={`w-full text-left p-4 border-2 transition-all ${
                                      isSelected
                                        ? 'border-foreground bg-foreground/5'
                                        : 'border-foreground/20 hover:border-foreground/40'
                                    }`}
                                  >
                                    <div className="flex items-start gap-3">
                                      <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                                        isSelected ? 'border-foreground' : 'border-foreground/30'
                                      }`}>
                                        {isSelected && <div className="w-2 h-2 rounded-full bg-foreground" />}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          {addr.type === 'HOME' ? (
                                            <Home size={12} className="text-foreground/50" />
                                          ) : addr.type === 'OFFICE' ? (
                                            <Briefcase size={12} className="text-foreground/50" />
                                          ) : (
                                            <MapPin size={12} className="text-foreground/50" />
                                          )}
                                          <span className="text-xs uppercase tracking-wider text-foreground/60">{addr.type}</span>
                                          {addr.is_default && (
                                            <span className="text-[10px] uppercase tracking-wider bg-foreground text-background px-1.5 py-0.5">Default</span>
                                          )}
                                        </div>
                                        <p className="text-sm font-medium">{addr.name}</p>
                                        <p className="text-xs text-foreground/60 mt-0.5 truncate">
                                          {addr.address_line}{addr.address_line2 ? ', ' + addr.address_line2 : ''}
                                        </p>
                                        <p className="text-xs text-foreground/60">
                                          {addr.city}, {addr.state} – {addr.pincode}
                                        </p>
                                        <p className="text-xs text-foreground/50 mt-0.5">{addr.mobile}</p>
                                      </div>
                                    </div>
                                  </button>
                                );
                              })}

                              {/* Add new address toggle */}
                              <button
                                type="button"
                                onClick={() => {
                                  setShowNewAddressForm(true);
                                  setSelectedAddressId(null);
                                  setShippingInfo({ firstName: '', lastName: '', email: user?.email || '', phone: '', address: '', city: '', state: '', zipCode: '', country: '' });
                                  setShippingErrors({});
                                }}
                                className={`w-full text-left p-4 border-2 transition-all flex items-center gap-3 ${
                                  showNewAddressForm
                                    ? 'border-foreground bg-foreground/5'
                                    : 'border-foreground/20 hover:border-foreground/40 border-dashed'
                                }`}
                              >
                                <Plus size={16} className="text-foreground/50 flex-shrink-0" />
                                <span className="text-sm text-foreground/70">Use a different address</span>
                              </button>

                              {/* Show email error inline when saved address is selected but email is missing */}
                              {selectedAddressId && !showNewAddressForm && shippingErrors.email && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200">
                                  <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
                                  <p className="text-xs text-red-600">{shippingErrors.email}</p>
                                </div>
                              )}
                            </>
                          )}

                          {/* New address form */}
                          {showNewAddressForm && (
                            <div className="space-y-4 pt-2">
                              <div className="grid grid-cols-2 gap-3">
                                <LuxuryInput
                                  label="First name"
                                  type="text"
                                  value={shippingInfo.firstName}
                                  onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                                  placeholder={PH.firstName}
                                  error={shippingErrors.firstName}
                                />
                                <LuxuryInput
                                  label="Last name"
                                  type="text"
                                  value={shippingInfo.lastName}
                                  onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                                  placeholder={PH.lastName}
                                  error={shippingErrors.lastName}
                                />
                              </div>

                              <LuxuryInput
                                label="Email"
                                type="email"
                                value={shippingInfo.email}
                                onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                                placeholder={PH.email}
                                error={shippingErrors.email}
                              />

                              <LuxuryInput
                                label="Phone"
                                type="tel"
                                value={shippingInfo.phone}
                                onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                                placeholder={PH.phone}
                                error={shippingErrors.phone}
                              />

                              <div>
                                <label className="block text-sm text-foreground/90 mb-1.5">Address</label>
                                <AddressAutocompleteInput
                                  value={shippingInfo.address}
                                  onChange={(value) => setShippingInfo({ ...shippingInfo, address: value })}
                                  onAddressFill={(components) =>
                                    setShippingInfo((prev) => ({
                                      ...prev,
                                      address: components.addressLine || prev.address,
                                      city: components.city || prev.city,
                                      state: components.state || prev.state,
                                      zipCode: components.pincode || prev.zipCode,
                                      country:
                                        components.country === 'US'
                                          ? 'United States'
                                          : components.country === 'IN'
                                            ? 'India'
                                            : components.country || prev.country,
                                    }))
                                  }
                                  placeholder={PH.streetAddress}
                                  error={shippingErrors.address}
                                  countryCode={shippingCountryCode}
                                  className="rounded-sm px-3 py-2.5 border-foreground/15 bg-background text-foreground text-sm placeholder:text-foreground/40 focus:border-foreground/40 hover:border-foreground/25"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <LuxuryInput
                                  label="City"
                                  type="text"
                                  value={shippingInfo.city}
                                  onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                                  placeholder={PH.city}
                                  error={shippingErrors.city}
                                />
                                <LuxuryInput
                                  label="State"
                                  type="text"
                                  value={shippingInfo.state}
                                  onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                                  placeholder={PH.state}
                                  error={shippingErrors.state}
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <LuxuryInput
                                  label="ZIP code"
                                  type="text"
                                  value={shippingInfo.zipCode}
                                  onChange={(e) => void handleZipCodeChange(e.target.value)}
                                  placeholder={PH.zip}
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
                            </div>
                          )}

                          <div className="bg-foreground/5 p-3 border border-foreground/10 mt-2">
                            <div className="flex items-center gap-2 text-xs text-foreground/60 mb-1">
                              <Truck size={14} />
                              <span className="uppercase tracking-wider">Free Shipping</span>
                            </div>
                            <p className="text-xs text-foreground/50">Delivery in 5-7 business days</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 mt-4 border-t border-foreground/10">
                        <button
                          type="button"
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
                      className="flex flex-col"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <CreditCard size={18} className="text-foreground/60" />
                        <h2 className="text-sm uppercase tracking-widest">Payment Method</h2>
                      </div>

                      <div className="overflow-y-auto pr-2">
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

                            {walletAvailable && (
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
                            )}

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
                              {stripePublishableKey ? (
                                <div className="flex items-start gap-3 bg-foreground/5 p-4 border border-foreground/10">
                                  <ShieldCheck size={16} className="text-foreground/60 mt-0.5 shrink-0" />
                                  <p className="text-xs text-foreground/60 leading-relaxed">
                                    Your card details will be securely collected on the next screen via Stripe. No card data is stored on our servers.
                                  </p>
                                </div>
                              ) : (
                                <>
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
                                      placeholder={PH.cardNumber}
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
                                      placeholder={PH.nameOnCard}
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
                                        placeholder={PH.cardExpiry}
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
                                        placeholder={PH.cvv}
                                        maxLength={4}
                                      />
                                      {paymentErrors.cvv && <p className="text-xs text-red-500">{paymentErrors.cvv}</p>}
                                    </div>
                                  </div>
                                </>
                              )}
                            </motion.div>
                          )}

                          {/* UPI Payment Form */}
                          {paymentMethod === 'upi' && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="space-y-3"
                            >
                              <div className="bg-foreground/5 p-3 border border-foreground/10 text-xs text-foreground/60">
                                Your UPI details will be collected securely on the next screen via Stripe.
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
                                  {['Paytm', 'PhonePe', 'Google Pay', 'Amazon Pay'].map((w) => (
                                    <label key={w} className={`flex items-center gap-3 p-2 border cursor-pointer transition-colors ${selectedWallet === w ? 'border-foreground bg-foreground/5' : 'border-foreground/10 hover:bg-foreground/5'}`}>
                                      <input
                                        type="radio"
                                        name="wallet"
                                        value={w}
                                        checked={selectedWallet === w}
                                        onChange={() => setSelectedWallet(w)}
                                        className="w-4 h-4"
                                      />
                                      <span className="text-sm">{w}</span>
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

                      <div className="pt-4 mt-4 border-t border-foreground/10">
                        <button
                          type="button"
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
                      className="flex flex-col"
                    >
                      <h2 className="text-sm uppercase tracking-widest mb-4">Review Order</h2>

                      <div className="overflow-y-auto pr-2 space-y-3">
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
                            {paymentMethod === 'upi' && <p>UPI via Stripe</p>}
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

              {/* Right: Order Summary */}
              <div className="hidden lg:flex flex-col border border-foreground/10 lg:sticky lg:top-[104px] self-start">
                <div className="p-4 border-b border-foreground/10">
                  <h2 className="text-xs uppercase tracking-widest">Order Summary</h2>
                </div>
                
                <div className="overflow-y-auto p-4 space-y-3 max-h-[50vh]">
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
                      <span>{formatAmount(taxDisplay)}</span>
                    </div>
                    {giftPackingCharge > 0 && (
                      <div className="flex justify-between text-foreground/60">
                        <span>Gift packing</span>
                        <span>{formatAmount(giftPackingDisplay)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-foreground/60">
                      <span>Shipping</span>
                      <span>{shippingDisplay > 0 ? formatAmount(shippingDisplay) : <span className="text-green-600">FREE</span>}</span>
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