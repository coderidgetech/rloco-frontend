import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowLeft, Star, Truck, Smartphone, CreditCard, Clock, Wallet, Building2, Gift, ChevronRight, ChevronDown, Tag, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useOrder } from '../context/OrderContext';
import { useUser } from '../context/UserContext';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import { StripePaymentForm } from '../components/StripePaymentForm';
import { CreateOrderRequest } from '../types/api';
import { Product } from '../types/api';
import type { Order } from '../types/api';

interface Address {
  id: string;
  name: string;
  type: 'HOME' | 'OFFICE' | 'OTHER';
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  mobile: string;
  cashOnDelivery?: boolean;
  isDefault?: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: 'recommended' | 'cod' | 'upi' | 'card' | 'paylater' | 'wallet' | 'emi' | 'netbanking';
  icon: any;
  offers?: number;
  balance?: number;
  description?: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'recommended', name: 'Recommended', type: 'recommended', icon: Star },
  { id: 'cod', name: 'Cash On Delivery', type: 'cod', icon: Truck },
  { id: 'upi', name: 'UPI (Pay via any App)', type: 'upi', icon: Smartphone },
  { id: 'card', name: 'Credit/Debit Card', type: 'card', icon: CreditCard, offers: 3 },
  { id: 'paylater', name: 'Pay Later', type: 'paylater', icon: Clock },
  { id: 'wallets', name: 'Wallets', type: 'wallet', icon: Wallet },
  { id: 'emi', name: 'EMI', type: 'emi', icon: CreditCard, offers: 1 },
  { id: 'netbanking', name: 'Net Banking', type: 'netbanking', icon: Building2 },
];

const WALLET_OPTIONS = [
  { id: 'mobikwik', name: 'Mobikwik', balance: 11, logo: '💳' },
  { id: 'paytm', name: 'Paytm', balance: 0, logo: '💰' },
  { id: 'phonepe', name: 'PhonePe', balance: 0, logo: '📱' },
  { id: 'amazonpay', name: 'Amazon Pay', balance: 0, logo: '🛒' },
];

const UPI_APPS = [
  { id: 'googlepay', name: 'Google Pay', logo: '🅖' },
  { id: 'phonepe', name: 'PhonePe', logo: '📱' },
  { id: 'paytm', name: 'Paytm', logo: '💰' },
  { id: 'bhim', name: 'BHIM UPI', logo: '🏦' },
];

export function PaymentPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { items, clearCart, removeFromCart } = useCart();
  const { formatAmount, convertPrice, currency } = useCurrency();
  const { selectedAddress, setSelectedPaymentMethod: setOrderPaymentMethod } = useOrder();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('recommended');
  const [selectedWallet, setSelectedWallet] = useState<string>('mobikwik');
  const [selectedUPI, setSelectedUPI] = useState<string>('');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [showBankOffers, setShowBankOffers] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [productsMap, setProductsMap] = useState<Map<string, Product>>(new Map());
  const [pendingStripePayment, setPendingStripePayment] = useState<{ order: Order; clientSecret: string } | null>(null);
  const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // If no address selected, redirect to address selection
    if (!selectedAddress) {
      navigate('/address');
    }
  }, [selectedAddress, navigate]);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const deliveryAddress = selectedAddress;

  // Fetch products for price calculation; remove cart items whose product no longer exists (404)
  useEffect(() => {
    const fetchProducts = async () => {
      const productIds = items.map(item => String(item.id));
      if (productIds.length === 0) return;

      try {
        const productsData = await Promise.all(
          productIds.map(id => productService.getById(id).catch(() => null))
        );
        const map = new Map<string, Product>();
        productsData.forEach((product, index) => {
          if (product) {
            map.set(productIds[index], product);
          } else {
            const item = items[index];
            if (item) {
              removeFromCart(item.id, item.size);
              toast.info('A product in your cart is no longer available and was removed.');
            }
          }
        });
        setProductsMap(map);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, [items, removeFromCart]);

  // Calculate original MRP (before any product discounts)
  const originalMRP = items.reduce((sum, item) => {
    const product = productsMap.get(String(item.id));
    if (product) {
      const originalPrice = convertPrice(product.price, product.price_inr);
      return sum + (originalPrice * item.quantity);
    }
    return sum;
  }, 0);

  const subtotal = items.reduce((sum, item) => {
    const itemPrice = convertPrice(item.price, (item as any).priceINR);
    return sum + (itemPrice * item.quantity);
  }, 0);

  // Product discount (difference between MRP and selling price)
  const productDiscount = originalMRP - subtotal;

  // Maximum discount configuration (from admin/vendor - default 70%)
  const MAX_DISCOUNT_PERCENTAGE = 70;
  const maxAllowedDiscount = (originalMRP * MAX_DISCOUNT_PERCENTAGE) / 100;
  
  // Cap discount to maximum allowed
  const discount = Math.min(productDiscount, maxAllowedDiscount);

  const platformFee = currency === 'USD' ? 23 : 1725;
  
  // Final total should never be negative
  const calculatedTotal = originalMRP - discount + platformFee;
  const finalTotal = Math.max(platformFee, calculatedTotal);

  const handlePayment = async () => {
    if (!selectedPaymentMethod || selectedPaymentMethod === 'recommended') {
      toast.error('Please select a payment method');
      return;
    }

    if (selectedPaymentMethod === 'card') {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        toast.error('Please fill in all card details');
        return;
      }
    }

    if (selectedPaymentMethod === 'upi' && !selectedUPI && !upiId) {
      toast.error('Please select a UPI app or enter UPI ID');
      return;
    }

    if (!deliveryAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    setIsProcessing(true);
    try {
      const nameParts = deliveryAddress.name?.trim().split(/\s+/) || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const orderItems = items.map((item) => ({
        product_id: String(item.id),
        product_name: item.name,
        image: item.image,
        price: item.price,
        size: item.size,
        quantity: item.quantity,
      }));

      const paymentInfoData: Record<string, string> = {};
      if (selectedPaymentMethod === 'card') {
        paymentInfoData.card_number = cardNumber.replace(/\s/g, '');
        paymentInfoData.card_name = cardName;
        paymentInfoData.expiry_date = expiryDate;
        paymentInfoData.cvv = cvv;
      } else if (selectedPaymentMethod === 'upi') {
        paymentInfoData.upi_id = upiId || selectedUPI || '';
      } else if (selectedPaymentMethod === 'wallets') {
        paymentInfoData.wallet_name = selectedWallet || 'Wallet';
      }

      const paymentMethodApi = selectedPaymentMethod === 'cod' ? 'cod' : selectedPaymentMethod === 'card' ? 'card' : selectedPaymentMethod === 'upi' ? 'upi' : selectedPaymentMethod === 'wallets' ? 'wallet' : 'cod';

      const orderRequest: CreateOrderRequest = {
        items: orderItems,
        shipping_info: {
          first_name: firstName,
          last_name: lastName,
          email: user?.email || '',
          phone: deliveryAddress.mobile || '',
          address: deliveryAddress.addressLine || '',
          city: deliveryAddress.city || '',
          state: deliveryAddress.state || '',
          zip_code: deliveryAddress.pincode || '',
          country: currency === 'INR' ? 'India' : 'United States',
        },
        payment_info: paymentInfoData,
        payment_method: paymentMethodApi,
      };

      const order = await orderService.create(orderRequest);

      // COD, UPI, and Wallet complete immediately (no payment gateway)
      const completesOffline = paymentMethodApi === 'cod' || paymentMethodApi === 'upi' || paymentMethodApi === 'wallet';
      if (completesOffline) {
        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/order-confirmation/${order.id}`, { state: { order } });
        setIsProcessing(false);
        return;
      }

      // Card only: Stripe payment intent
      if (paymentMethodApi === 'card') {
        if (!stripePublishableKey) {
          toast.error('Card payments are not configured. Please use UPI, Wallet, or Cash on Delivery.');
          setIsProcessing(false);
          return;
        }
        try {
          const paymentIntent = await paymentService.createPaymentIntent({
            order_id: order.id,
            amount: finalTotal,
            currency: currency === 'INR' ? 'INR' : 'USD',
            gateway: 'stripe',
          });
          if (paymentIntent.payment_url) {
            window.location.href = paymentIntent.payment_url;
            return;
          }
          if (paymentIntent.client_secret) {
            setPendingStripePayment({ order, clientSecret: paymentIntent.client_secret });
            setIsProcessing(false);
            return;
          }
          toast.error('Payment could not be started. Please try again or use another method.');
        } catch (paymentErr: any) {
          console.error('Payment processing error:', paymentErr);
          const msg = paymentErr?.response?.data?.error ?? paymentErr?.message ?? 'Payment could not be completed.';
          toast.error(msg);
        }
        setIsProcessing(false);
        return;
      }

      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${order.id}`, { state: { order } });
    } catch (err: any) {
      console.error('Place order error:', err);
      toast.error(err?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStripePaymentSuccess = () => {
    if (!pendingStripePayment) return;
    const order = pendingStripePayment.order;
    setPendingStripePayment(null);
    clearCart();
    toast.success('Order placed successfully!');
    navigate(`/order-confirmation/${order.id}`, { state: { order } });
  };

  const renderPaymentContent = () => {
    switch (selectedPaymentMethod) {
      case 'recommended':
        return (
          <div>
            <h3 className="font-medium mb-4">Recommended Payment Options</h3>
            <div className="space-y-3">
              {WALLET_OPTIONS.map((wallet) => (
                <div
                  key={wallet.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedWallet === wallet.id ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => setSelectedWallet(wallet.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={selectedWallet === wallet.id}
                        onChange={() => setSelectedWallet(wallet.id)}
                        className="w-5 h-5 cursor-pointer accent-primary"
                      />
                      <span className="text-2xl">{wallet.logo}</span>
                      <span className="font-medium">{wallet.name}</span>
                    </div>
                  </div>
                  <div className="ml-11">
                    <p className="text-sm text-muted-foreground">
                      Balance: <span className="font-medium">{formatAmount(wallet.balance)}</span>
                    </p>
                    {wallet.balance < finalTotal && (
                      <p className="text-xs text-destructive mt-1">
                        Add {formatAmount(finalTotal - wallet.balance)} more. You can add money in the next step.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full mt-6 py-4 bg-[#FF3F6C] hover:bg-[#E6365F] text-white uppercase tracking-wider font-medium rounded transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Add Money & Pay'}
            </motion.button>
          </div>
        );

      case 'cod':
        return (
          <div>
            <h3 className="font-medium mb-4">Cash On Delivery</h3>
            <div className="border border-border rounded-lg p-6 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <Truck className="text-primary mt-1" size={24} />
                <div>
                  <h4 className="font-medium mb-2">Pay on delivery available</h4>
                  <p className="text-sm text-muted-foreground">
                    You can pay cash to the delivery partner when your order arrives.
                  </p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                ℹ️ Please keep exact change handy to help us serve you better
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-4 bg-[#FF3F6C] hover:bg-[#E6365F] text-white uppercase tracking-wider font-medium rounded transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Place Order'}
            </motion.button>
          </div>
        );

      case 'upi':
        return (
          <div>
            <h3 className="font-medium mb-4">UPI Payment</h3>
            
            {/* UPI Apps */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3">Choose an option</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {UPI_APPS.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => setSelectedUPI(app.id)}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedUPI === app.id ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={selectedUPI === app.id}
                        onChange={() => setSelectedUPI(app.id)}
                        className="w-4 h-4 cursor-pointer accent-primary"
                      />
                      <span className="text-xl">{app.logo}</span>
                      <span className="text-sm font-medium">{app.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Or Enter UPI ID */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-3">Or enter UPI ID</p>
              <input
                type="text"
                value={upiId}
                onChange={(e) => {
                  setUpiId(e.target.value);
                  setSelectedUPI('');
                }}
                placeholder="UPI ID"
                className="w-full px-4 py-3 border border-border rounded-lg outline-none focus:border-primary transition-colors"
              />
              <p className="text-xs text-muted-foreground mt-2">
                The UPI ID is in the format of name/phone number@bankname
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-4 bg-[#FF3F6C] hover:bg-[#E6365F] text-white uppercase tracking-wider font-medium rounded transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Verify & Pay'}
            </motion.button>
          </div>
        );

      case 'card':
        return (
          <div>
            <h3 className="font-medium mb-4">Credit/Debit Card</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Card Number</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, '');
                    if (value.length <= 16) {
                      const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                      setCardNumber(formatted);
                    }
                  }}
                  placeholder="Card number"
                  maxLength={19}
                  className="w-full px-4 py-3 border border-border rounded-lg outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Name on Card</label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  placeholder="Name on card"
                  className="w-full px-4 py-3 border border-border rounded-lg outline-none focus:border-primary transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Valid Thru</label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 4) {
                        const formatted = value.length >= 2 ? `${value.slice(0, 2)}/${value.slice(2)}` : value;
                        setExpiryDate(formatted);
                      }
                    }}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-4 py-3 border border-border rounded-lg outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVV</label>
                  <input
                    type="password"
                    value={cvv}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      if (value.length <= 3) {
                        setCvv(value);
                      }
                    }}
                    placeholder="CVV"
                    maxLength={3}
                    className="w-full px-4 py-3 border border-border rounded-lg outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-4 bg-[#FF3F6C] hover:bg-[#E6365F] text-white uppercase tracking-wider font-medium rounded transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </motion.button>
          </div>
        );

      case 'wallet':
        return (
          <div>
            <h3 className="font-medium mb-4">Wallets</h3>
            <div className="space-y-3">
              {WALLET_OPTIONS.map((wallet) => (
                <div
                  key={wallet.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedWallet === wallet.id ? 'border-primary bg-primary/5' : 'border-border'
                  }`}
                  onClick={() => setSelectedWallet(wallet.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        checked={selectedWallet === wallet.id}
                        onChange={() => setSelectedWallet(wallet.id)}
                        className="w-5 h-5 cursor-pointer accent-primary"
                      />
                      <span className="text-2xl">{wallet.logo}</span>
                      <span className="font-medium">{wallet.name}</span>
                    </div>
                    <ChevronRight size={20} className="text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full mt-6 py-4 bg-[#FF3F6C] hover:bg-[#E6365F] text-white uppercase tracking-wider font-medium rounded transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Continue'}
            </motion.button>
          </div>
        );

      case 'emi':
        return (
          <div>
            <h3 className="font-medium mb-4">EMI (Easy Installments)</h3>
            <div className="border border-border rounded-lg p-6 mb-6 text-center">
              <p className="text-muted-foreground">Select your bank to view EMI options</p>
            </div>
            <div className="space-y-3">
              {['HDFC Bank', 'ICICI Bank', 'SBI Bank', 'Axis Bank'].map((bank) => (
                <div key={bank} className="border-2 border-border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{bank}</span>
                    <ChevronRight size={20} className="text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'netbanking':
        return (
          <div>
            <h3 className="font-medium mb-4">Net Banking</h3>
            <div className="space-y-3 mb-6">
              {['HDFC Bank', 'ICICI Bank', 'SBI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'Yes Bank'].map((bank) => (
                <div key={bank} className="border-2 border-border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="netbanking"
                        className="w-5 h-5 cursor-pointer accent-primary"
                      />
                      <span className="font-medium">{bank}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-4 bg-[#FF3F6C] hover:bg-[#E6365F] text-white uppercase tracking-wider font-medium rounded transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Pay Securely'}
            </motion.button>
          </div>
        );

      default:
        return (
          <div className="text-center py-12 text-muted-foreground">
            Select a payment method
          </div>
        );
    }
  };

  if (pendingStripePayment) {
    return (
      <div className="min-h-screen bg-muted/20 pt-page-nav px-4 pb-12 pb-mobile-nav md:pb-12">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl font-semibold mb-2">Complete payment</h1>
          <p className="text-muted-foreground mb-6">
            Order {pendingStripePayment.order.order_number} — secure card payment via Stripe
          </p>
          <StripePaymentForm
            publishableKey={stripePublishableKey!}
            clientSecret={pendingStripePayment.clientSecret}
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

  return (
    <div className="min-h-screen bg-muted/20 pt-page-nav pb-mobile-nav md:pb-0">
      {/* Header with Progress Steps */}
      <div className="bg-background border-b border-border shadow-sm">
        <div className="w-full px-4 md:px-8 lg:px-16 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/address-selection')}
                className="p-2 hover:bg-muted rounded-full transition-colors mr-2"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="text-primary" size={16} />
              </div>
              <h1 className="text-lg md:text-xl font-medium">Payment</h1>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="uppercase tracking-wider">BAG</span>
            </div>
            <div className="h-px w-8 md:w-12 bg-border"></div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="uppercase tracking-wider">ADDRESS</span>
            </div>
            <div className="h-px w-8 md:w-12 bg-border"></div>
            <div className="flex items-center gap-2">
              <span className="uppercase tracking-wider font-medium text-primary">PAYMENT</span>
            </div>
            <div className="ml-auto hidden md:flex items-center gap-2 text-green-600">
              <Check size={16} />
              <span className="text-xs">100% SECURE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-4 md:px-8 lg:px-16 py-6 md:py-8">
        <div className="grid lg:grid-cols-[320px_1fr_380px] xl:grid-cols-[340px_1fr_420px] gap-6 md:gap-8">
          {/* Left Sidebar - Payment Methods */}
          <div className="space-y-4">
            {/* Bank Offers */}
            <div className="bg-white border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Tag size={16} className="text-foreground/70" />
                <span className="font-medium text-sm">Bank Offer</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                7.5% Assured Cashback* on a minimum spend of {currency === 'USD' ? '$100' : '₹100'}. T&C
              </p>
              <button
                onClick={() => setShowBankOffers(!showBankOffers)}
                className="text-primary text-xs font-medium hover:underline"
              >
                Show More ▼
              </button>
            </div>

            {/* Payment Methods */}
            <div className="bg-white border border-border rounded-lg p-4">
              <h3 className="font-medium mb-4 text-sm">Choose Payment Mode</h3>
              <div className="space-y-1">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors ${
                        selectedPaymentMethod === method.id
                          ? 'bg-primary/10 text-primary border-l-4 border-primary'
                          : 'hover:bg-muted border-l-4 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} />
                        <span className="text-sm font-medium">{method.name}</span>
                      </div>
                      {method.offers && (
                        <span className="text-xs text-green-600 font-medium">
                          {method.offers} Offer{method.offers > 1 ? 's' : ''}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gift Card */}
            <div className="bg-white border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift size={16} className="text-foreground/70" />
                  <span className="text-sm font-medium">Have a Gift Card?</span>
                </div>
                <button className="text-xs uppercase tracking-wider font-medium text-primary hover:underline">
                  Apply
                </button>
              </div>
            </div>
          </div>

          {/* Center - Payment Details */}
          <div className="space-y-4">
            {/* Delivery Address Section */}
            {deliveryAddress && (
              <div className="bg-white border border-border rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <MapPin size={20} className="text-foreground/60 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">Deliver to:</span>
                        <span className="font-bold">{deliveryAddress.name}, {deliveryAddress.pincode}</span>
                      </div>
                      <p className="text-sm text-foreground/70 leading-relaxed">
                        {deliveryAddress.addressLine}, {deliveryAddress.city}, {deliveryAddress.state}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/address-selection')}
                    className="px-4 py-2 border-2 border-[#B4770E] text-[#B4770E] hover:bg-[#B4770E] hover:text-white transition-colors font-medium text-sm tracking-wider whitespace-nowrap rounded"
                  >
                    CHANGE ADDRESS
                  </button>
                </div>
              </div>
            )}

            {/* Payment Details Card */}
            <div className="bg-white border border-border rounded-lg p-6">
              {renderPaymentContent()}
            </div>
          </div>

          {/* Right Sidebar - Price Details */}
          <div className="space-y-4 lg:sticky lg:top-36 self-start">
            {/* Price Details */}
            <div className="bg-white border border-border rounded-lg p-4">
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-4">
                Price Details ({items.length} Item{items.length !== 1 ? 's' : ''})
              </h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total MRP</span>
                  <span>{formatAmount(originalMRP)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount on MRP</span>
                  <span>-{formatAmount(discount)}</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-muted-foreground">Platform Fee</span>
                  <div className="flex items-center gap-2">
                    <button className="text-primary text-xs hover:underline">Know More</button>
                    <span>{formatAmount(platformFee)}</span>
                  </div>
                </div>
                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sm">Total Amount</span>
                    <span className="text-lg md:text-xl font-bold">{formatAmount(finalTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}