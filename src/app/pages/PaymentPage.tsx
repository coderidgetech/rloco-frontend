import { motion } from 'motion/react';
import { ArrowLeft, Truck, CreditCard, Tag, MapPin, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useOrder } from '../context/OrderContext';
import { useUser } from '../context/UserContext';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Footer } from '../components/Footer';
import { CheckoutStepper } from '../components/CheckoutStepper';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import { StripePaymentForm } from '../components/StripePaymentForm';
import { CreateOrderRequest } from '../types/api';
import { Product } from '../types/api';
import type { Order } from '../types/api';
import { expectedCurrencyForCountry, isCountryCurrencyMatch, normalizeCountry } from '../lib/market';
import { getApiErrorMessage } from '../lib/apiErrors';
import { checkoutIdempotencyKey } from '../lib/checkoutIdempotency';

interface Address {
  id: string;
  name: string;
  type: 'HOME' | 'OFFICE' | 'OTHER';
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  mobile: string;
  country?: string;
  cashOnDelivery?: boolean;
  isDefault?: boolean;
}

type PaymentRail = 'cod' | 'stripe';

export function PaymentPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated } = useUser();
  const { items, clearCart, removeFromCart } = useCart();
  const { formatAmount, convertPrice, currency, country: storefrontCountry, market } = useCurrency();
  const { selectedAddress } = useOrder();
  const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;
  const [paymentRail, setPaymentRail] = useState<PaymentRail>(() =>
    (import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined) ? 'stripe' : 'cod'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [productsMap, setProductsMap] = useState<Map<string, Product>>(new Map());
  const [pendingStripePayment, setPendingStripePayment] = useState<{ order: Order; clientSecret: string } | null>(null);
  /** Stripe Elements layout hint; server enables card+UPI for INR via PaymentIntent. */
  const stripePreferredMethod: 'card' | 'upi' | 'wallet' = 'card';

  const stripeReturnUrl = useMemo(() => `${window.location.origin}/payment`, []);

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
          productIds.map(id => productService.getById(id, { market }).catch(() => null))
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
  }, [items, removeFromCart, market]);

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
    if (!isAuthenticated) {
      toast.error('Please log in to place your order.');
      navigate('/login?redirect=/payment');
      return;
    }

    const orderPaymentMethod: 'cod' | 'card' =
      paymentRail === 'cod' ? 'cod' : 'card';
    const stripeIntentMethod: 'card' | 'upi' | 'wallet' = 'card';

    if (orderPaymentMethod !== 'cod' && !stripePublishableKey) {
      toast.error('Online payments are not configured. Choose Cash on Delivery.');
      return;
    }

    if (!deliveryAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    const shippingCountry = normalizeCountry(deliveryAddress.country);
    if (!shippingCountry) {
      toast.error('Please use an address from India or United States');
      return;
    }
    if (!isCountryCurrencyMatch(shippingCountry, currency) || shippingCountry !== storefrontCountry) {
      toast.error(`Address country (${shippingCountry}) must match selected market (${storefrontCountry})`);
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
          country: shippingCountry,
        },
        payment_info: {},
        payment_method: orderPaymentMethod,
      };

      const order = await orderService.create(orderRequest, { idempotencyKey: checkoutIdempotencyKey() });

      if (orderPaymentMethod === 'cod') {
        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/order-confirmation/${order.id}`, { state: { order } });
        setIsProcessing(false);
        return;
      }

      try {
        const paymentCurrency = (expectedCurrencyForCountry(shippingCountry) ?? currency).toLowerCase();
        const paymentIntent = await paymentService.createPaymentIntent({
          order_id: order.id,
          amount: order.total,
          currency: paymentCurrency,
          gateway: 'stripe',
          payment_method: stripeIntentMethod,
        });
        if (paymentIntent.client_secret) {
          setPendingStripePayment({ order, clientSecret: paymentIntent.client_secret });
          setIsProcessing(false);
          return;
        }
        toast.error('Payment could not be started. Please try again or use Cash on Delivery.');
      } catch (paymentErr: unknown) {
        console.error('Payment processing error:', paymentErr);
        toast.error(getApiErrorMessage(paymentErr, 'Payment could not be completed.'));
      }
      setIsProcessing(false);
    } catch (err: unknown) {
      console.error('Place order error:', err);
      toast.error(getApiErrorMessage(err, 'Failed to place order. Please try again.'));
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
    if (paymentRail === 'cod') {
      return (
        <div>
          <h3 className="font-medium mb-4">Cash on delivery</h3>
          <div className="border border-border rounded-lg p-6 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <Truck className="text-primary mt-1" size={24} />
              <div>
                <h4 className="font-medium mb-2">Pay when your order arrives</h4>
                <p className="text-sm text-muted-foreground">
                  Pay the delivery partner in cash (or as they accept). No online payment is taken now.
                </p>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm text-blue-800 dark:text-blue-200">
              Keep close to the order total for smoother delivery.
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full py-4 bg-[#FF3F6C] hover:bg-[#E6365F] text-white uppercase tracking-wider font-medium rounded transition-colors disabled:opacity-50"
          >
            {isProcessing ? 'Processing...' : 'Place order (COD)'}
          </motion.button>
        </div>
      );
    }

    return (
      <div>
        <h3 className="font-medium mb-4">Pay online (Stripe)</h3>
        {stripePublishableKey ? (
          <>
            <div className="flex items-start gap-3 bg-foreground/5 p-4 border border-foreground/10 rounded-lg mb-6">
              <ShieldCheck size={16} className="text-foreground/60 mt-0.5 shrink-0" />
              <div className="text-xs text-foreground/60 leading-relaxed space-y-2">
                <p>
                  Card, UPI (INR), wallets, and other methods enabled in your Stripe Dashboard appear in the secure
                  payment step. We do not collect card numbers on this page.
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full py-4 bg-[#FF3F6C] hover:bg-[#E6365F] text-white uppercase tracking-wider font-medium rounded transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Continue to secure payment'}
            </motion.button>
          </>
        ) : (
          <p className="text-sm text-muted-foreground mb-4">
            Online payments are not configured. Choose <span className="font-medium">Cash on delivery</span> in the
            sidebar or set <code className="text-xs">VITE_STRIPE_PUBLISHABLE_KEY</code> and server Stripe keys.
          </p>
        )}
      </div>
    );
  };

  if (pendingStripePayment) {
    const stripeSubtitle = 'Complete payment with Stripe (card, UPI for INR, or other methods enabled in your Dashboard).';
    const isINR = currency === 'INR';
    const cancelStripe = () => {
      setPendingStripePayment(null);
      setIsProcessing(false);
      toast.info('Payment cancelled');
    };
    return (
      <div className="fixed inset-0 z-[200] flex flex-col bg-[#f6f9fc]">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#e3e8ee] bg-white px-4 shadow-sm">
          <button
            type="button"
            onClick={cancelStripe}
            className="text-sm font-medium text-[#635BFF] hover:underline"
          >
            ← Back
          </button>
          <span className="text-xs text-[#6a7383]">Secure payment</span>
          <span className="w-14" aria-hidden />
        </header>
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-6 pb-mobile-nav md:py-10">
          <div className="mx-auto w-full max-w-[480px]">
            <div className="rounded-2xl border border-[#e3e8ee] bg-white p-6 shadow-xl shadow-black/[0.04] md:p-8">
              <h1 className="text-xl font-semibold tracking-tight text-[#30313d] md:text-2xl">Complete payment</h1>
              <p className="mt-1 text-sm text-[#6a7383]">
                Order {pendingStripePayment.order.order_number} — {stripeSubtitle}
              </p>
              {isINR && (
                <p className="mt-4 rounded-lg border border-[#e3e8ee] bg-[#f6f9fc] p-3 text-xs text-[#6a7383]">
                  Paying in INR: Card and UPI should both appear below. If you only see Card, enable UPI in your Stripe
                  Dashboard (Settings → Payment methods → UPI).
                </p>
              )}
              <div className="mt-6">
                <StripePaymentForm
                  layout="checkout"
                  publishableKey={stripePublishableKey!}
                  clientSecret={pendingStripePayment.clientSecret}
                  returnUrl={stripeReturnUrl}
                  preferredPaymentMethod={stripePreferredMethod}
                  onSuccess={handleStripePaymentSuccess}
                  onCancel={cancelStripe}
                />
              </div>
            </div>
            <p className="mt-6 text-center text-[11px] text-[#6a7383]">Powered by Stripe</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full min-w-0 bg-muted/20 pt-page-nav pb-mobile-nav md:pb-0">
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

          <CheckoutStepper activeStep="payment" />
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-4 md:px-8 lg:px-16 py-6 md:py-8">
        <div className="grid lg:grid-cols-[320px_1fr_380px] xl:grid-cols-[340px_1fr_420px] gap-6 md:gap-8">
          {/* Left Sidebar - Payment Methods */}
          <div className="space-y-4">
            {/* Promotions — copy only until offers API exists */}
            <div className="bg-white border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Tag size={16} className="text-foreground/70" />
                <span className="font-medium text-sm">Offers</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Bank and wallet promotions will show here when connected to your promotions service. Final discounts
                appear on your order before you pay.
              </p>
            </div>

            {/* Payment rails: COD vs Stripe (non-Stripe gateways would be a third rail when integrated). */}
            <div className="bg-white border border-border rounded-lg p-4">
              <h3 className="font-medium mb-4 text-sm">Payment</h3>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setPaymentRail('cod')}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-left ${
                    paymentRail === 'cod'
                      ? 'bg-primary/10 text-primary border-l-4 border-primary'
                      : 'hover:bg-muted border-l-4 border-transparent'
                  }`}
                >
                  <Truck size={18} />
                  <span className="text-sm font-medium">Cash on delivery</span>
                </button>
                <button
                  type="button"
                  onClick={() => stripePublishableKey && setPaymentRail('stripe')}
                  disabled={!stripePublishableKey}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-left ${
                    paymentRail === 'stripe'
                      ? 'bg-primary/10 text-primary border-l-4 border-primary'
                      : 'hover:bg-muted border-l-4 border-transparent'
                  } ${!stripePublishableKey ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <CreditCard size={18} />
                  <span className="text-sm font-medium">Pay online (Stripe)</span>
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