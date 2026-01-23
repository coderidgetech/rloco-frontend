import { motion, AnimatePresence } from 'motion/react';
import { Minus, Plus, Trash2, ShoppingBag, Tag, ArrowRight, ShieldCheck, Truck, RefreshCw, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useFeaturedProducts } from '../hooks/useProducts';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';

const COUPON_CODES = {
  'RLOCO10': 10,
  'SAVE20': 20,
  'WELCOME15': 15,
  'FREESHIP': 0, // Free shipping
};

export function CartPage() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const { formatPrice, formatAmount, convertPrice, currency } = useCurrency();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  
  // Fetch featured products for recommendations
  const { products: featuredProducts } = useFeaturedProducts(8);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Calculate cart total in the current currency
  const subtotal = items.reduce((sum, item) => {
    const itemPrice = convertPrice(item.price, (item as any).priceINR);
    return sum + (itemPrice * item.quantity);
  }, 0);
  
  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
  const shippingThreshold = currency === 'USD' ? 200 : 15000; // $200 or ₹15000
  const shippingCost = currency === 'USD' ? 15 : 1125; // $15 or ₹1125
  const shipping = appliedCoupon?.code === 'FREESHIP' ? 0 : subtotal > shippingThreshold ? 0 : shippingCost;
  const tax = (subtotal - discount) * 0.08; // 8% tax
  const finalTotal = subtotal - discount + shipping + tax;

  // Filter recommended products (exclude items already in cart)
  const recommendedProducts = (featuredProducts || [])
    .filter((p) => !items.some((item) => String(item.id) === String(p.id)))
    .slice(0, 4);

  const handleApplyCoupon = () => {
    const upperCode = couponCode.toUpperCase();
    if (COUPON_CODES[upperCode as keyof typeof COUPON_CODES] !== undefined) {
      setAppliedCoupon({
        code: upperCode,
        discount: COUPON_CODES[upperCode as keyof typeof COUPON_CODES],
      });
      toast.success(`Coupon "${upperCode}" applied successfully!`);
      setCouponCode('');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="w-full px-4 md:px-6 lg:px-12 xl:px-16 py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Continue Shopping
          </button>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ShoppingBag className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl">Shopping Cart</h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="flex flex-col items-center justify-center text-center py-12 md:py-20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted flex items-center justify-center mb-4 md:mb-6"
            >
              <ShoppingBag size={64} className="text-muted-foreground" />
            </motion.div>
            <h2 className="text-xl md:text-2xl mb-2 md:mb-3">Your cart is empty</h2>
            <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 max-w-md px-4">
              Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="px-6 md:px-8 py-3 md:py-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 text-sm md:text-base"
            >
              Start Shopping
              <ArrowRight size={20} />
            </motion.button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3 md:space-y-4">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-xl">Cart Items</h2>
                {items.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      clearCart();
                      toast.success('Cart cleared');
                    }}
                    className="text-xs md:text-sm text-destructive hover:underline flex items-center gap-1 md:gap-2"
                  >
                    <Trash2 size={16} />
                    Clear All
                  </motion.button>
                )}
              </div>

              <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                  <motion.div
                    key={`${item.id}-${item.size}`}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100, height: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-muted/30 rounded-xl p-4 md:p-6 flex flex-col sm:flex-row gap-4 md:gap-6 group hover:bg-muted/50 transition-colors"
                  >
                    {/* Product Image */}
                    <div 
                      onClick={() => navigate(`/product/${item.id}`)}
                      className="w-full sm:w-24 md:w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0 cursor-pointer"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0 pr-4">
                          <h3 
                            onClick={() => navigate(`/product/${item.id}`)}
                            className="font-medium text-base md:text-lg mb-1 line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                          >
                            {item.name}
                          </h3>
                          <p className="text-xs md:text-sm text-muted-foreground mb-2">Size: {item.size}</p>
                          <p className="font-medium text-base md:text-lg">{formatPrice(item.price, (item as any).priceINR)}</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            removeFromCart(item.id, item.size);
                            toast.success('Removed from cart');
                          }}
                          className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-xs md:text-sm text-muted-foreground">Qty:</span>
                          <div className="flex items-center gap-2 bg-background rounded-lg border border-border">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                              className="p-2 hover:bg-muted transition-colors rounded-l-lg"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={14} className={item.quantity <= 1 ? 'opacity-30' : ''} />
                            </motion.button>
                            <span className="w-10 text-center font-medium text-sm">{item.quantity}</span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                              className="p-2 hover:bg-muted transition-colors rounded-r-lg"
                            >
                              <Plus size={14} />
                            </motion.button>
                          </div>
                        </div>
                        <span className="text-xs md:text-sm text-muted-foreground sm:ml-auto">
                          Total: <span className="font-medium text-foreground">{formatAmount(convertPrice(item.price, (item as any).priceINR) * item.quantity)}</span>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Recommended Products */}
              {recommendedProducts.length > 0 && (
                <div className="mt-12 pt-8 border-t border-border">
                  <h2 className="text-xl mb-6">You Might Also Like</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {recommendedProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        whileHover={{ y: -4 }}
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="group cursor-pointer"
                      >
                        <div className="aspect-[3/4] rounded-lg overflow-hidden mb-3 bg-muted">
                          <img
                            src={product.images?.[0] || (product as any).image || ''}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                          />
                        </div>
                        <h3 className="font-medium text-sm mb-1 truncate">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{formatPrice(product.price, product.price_inr)}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Coupon Code */}
                <div className="bg-muted/30 rounded-xl p-6">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Tag size={18} />
                    Apply Coupon
                  </h3>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2 bg-background border border-border rounded-lg outline-none focus:border-primary transition-colors"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleApplyCoupon();
                        }
                      }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                      Apply
                    </motion.button>
                  </div>
                  {appliedCoupon && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between text-sm bg-green-500/10 text-green-600 px-3 py-2 rounded-lg"
                    >
                      <span>✓ {appliedCoupon.code} applied</span>
                      <button
                        onClick={() => {
                          setAppliedCoupon(null);
                          toast.info('Coupon removed');
                        }}
                        className="hover:underline"
                      >
                        Remove
                      </button>
                    </motion.div>
                  )}
                  <div className="mt-3 text-xs text-muted-foreground">
                    <p className="mb-1">Try these codes:</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(COUPON_CODES).map((code) => (
                        <button
                          key={code}
                          onClick={() => setCouponCode(code)}
                          className="px-2 py-1 bg-background border border-border rounded hover:border-primary transition-colors"
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-muted/30 rounded-xl p-6">
                  <h3 className="font-medium mb-4">Order Summary</h3>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatAmount(subtotal)}</span>
                    </div>
                    {appliedCoupon && appliedCoupon.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount ({appliedCoupon.discount}%)</span>
                        <span>-{formatAmount(discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className={shipping === 0 ? 'text-green-600' : ''}>
                        {shipping === 0 ? 'FREE' : formatAmount(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (8%)</span>
                      <span>{formatAmount(tax)}</span>
                    </div>
                    <div className="pt-3 border-t border-border">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total</span>
                        <span className="text-2xl font-bold">{formatAmount(finalTotal)}</span>
                      </div>
                    </div>
                  </div>

                  {shipping > 0 && subtotal < shippingThreshold && (
                    <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-600">
                      Add {formatAmount(shippingThreshold - subtotal)} more for free shipping!
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCheckout}
                    className="w-full py-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mb-3"
                  >
                    Proceed to Checkout
                    <ArrowRight size={20} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/')}
                    className="w-full py-3 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    Continue Shopping
                  </motion.button>
                </div>

                {/* Trust Badges */}
                <div className="bg-muted/30 rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <ShieldCheck size={20} className="text-green-600" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Truck size={20} className="text-blue-600" />
                    <span>Free shipping over $200</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <RefreshCw size={20} className="text-purple-600" />
                    <span>30-day return policy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}