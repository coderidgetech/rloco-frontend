import { motion, AnimatePresence } from 'motion/react';
import { X, Minus, Plus, Trash2, ShoppingBag, Tag, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { toast } from 'sonner';
import { CheckoutPage } from './CheckoutPage';
import { Button } from './ui/button';
import { useFeaturedProducts } from '../hooks/useProducts';

interface CartPageProps {
  isOpen: boolean;
  onClose: () => void;
}

const COUPON_CODES = {
  'RLOCO10': 10,
  'SAVE20': 20,
  'WELCOME15': 15,
  'FREESHIP': 0, // Free shipping
};

export function CartPage({ isOpen, onClose }: CartPageProps) {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const subtotal = total;
  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
  const shipping = appliedCoupon?.code === 'FREESHIP' ? 0 : subtotal > 200 ? 0 : 15;
  const tax = (subtotal - discount) * 0.08; // 8% tax
  const finalTotal = subtotal - discount + shipping + tax;

  const { products: featuredProducts } = useFeaturedProducts(8);
  const recommendedProducts = (featuredProducts || [])
    .filter((p) => p.featured && !items.some((item) => item.id === p.id))
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
    setShowCheckout(true);
  };

  return (
    <>
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(60px)',
              WebkitBackdropFilter: 'blur(60px)',
            }}
            className="fixed inset-0 z-50"
          />

          {/* Full Screen Cart */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full bg-background flex flex-col">
              {/* Header */}
              <div className="border-b border-border bg-background sticky top-0 z-10">
                <div className="w-full px-2 md:px-4 py-4 md:py-6 flex items-center justify-between">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <ShoppingBag className="text-primary" size={20} />
                    </div>
                    <div>
                      <h1 className="text-xl md:text-2xl lg:text-3xl">Shopping Cart</h1>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {items.length} {items.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 md:p-3 hover:bg-muted rounded-full transition-colors"
                  >
                    <X size={20} className="md:hidden" />
                    <X size={24} className="hidden md:block" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="w-full px-2 md:px-4 py-6 md:py-8">
                  {items.length === 0 ? (
                    /* Empty Cart State */
                    <div className="h-full flex flex-col items-center justify-center text-center py-12 md:py-20">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 15 }}
                        className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted flex items-center justify-center mb-4 md:mb-6"
                      >
                        <ShoppingBag size={48} className="md:hidden text-muted-foreground" />
                        <ShoppingBag size={64} className="hidden md:block text-muted-foreground" />
                      </motion.div>
                      <h2 className="text-xl md:text-2xl mb-2 md:mb-3">Your cart is empty</h2>
                      <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 max-w-md px-4">
                        Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
                      </p>
                      <Button onClick={onClose} size="lg" className="flex items-center gap-2">
                        Continue Shopping
                        <ArrowRight size={18} className="md:hidden" />
                        <ArrowRight size={20} className="hidden md:block" />
                      </Button>
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
                              <Trash2 size={14} className="md:hidden" />
                              <Trash2 size={16} className="hidden md:block" />
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
                              <div className="w-full sm:w-24 md:w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
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
                                    <h3 className="font-medium text-base md:text-lg mb-1 line-clamp-2">{item.name}</h3>
                                    <p className="text-xs md:text-sm text-muted-foreground mb-2">Size: {item.size}</p>
                                    <p className="font-medium text-base md:text-lg">${item.price}</p>
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
                                    <Trash2 size={16} className="md:hidden" />
                                    <Trash2 size={18} className="hidden md:block" />
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
                                    Total: <span className="font-medium text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
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
                                  className="group cursor-pointer"
                                >
                                  <div className="aspect-[3/4] rounded-lg overflow-hidden mb-3 bg-muted">
                                    <img
                                      src={product.images?.[0] || product.image || ''}
                                      alt={product.name}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                      style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                                    />
                                  </div>
                                  <h3 className="font-medium text-sm mb-1 truncate">{product.name}</h3>
                                  <p className="text-sm text-muted-foreground">${product.price}</p>
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
                              <Button onClick={handleApplyCoupon} size="sm">
                                Apply
                              </Button>
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
                                <span>${subtotal.toFixed(2)}</span>
                              </div>
                              {appliedCoupon && appliedCoupon.discount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                  <span>Discount ({appliedCoupon.discount}%)</span>
                                  <span>-${discount.toFixed(2)}</span>
                                </div>
                              )}
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className={shipping === 0 ? 'text-green-600' : ''}>
                                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Tax (8%)</span>
                                <span>${tax.toFixed(2)}</span>
                              </div>
                              <div className="pt-3 border-t border-border">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">Total</span>
                                  <span className="text-2xl font-bold">${finalTotal.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>

                            {shipping > 0 && subtotal < 200 && (
                              <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-600">
                                Add ${(200 - subtotal).toFixed(2)} more for free shipping!
                              </div>
                            )}

                            <Button
                              onClick={handleCheckout}
                              className="w-full flex items-center justify-center gap-2 mb-3"
                            >
                              Proceed to Checkout
                              <ArrowRight size={20} />
                            </Button>

                            <Button
                              variant="secondary"
                              onClick={onClose}
                              className="w-full"
                            >
                              Continue Shopping
                            </Button>
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
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

    {/* Checkout Page */}
    <CheckoutPage
      isOpen={showCheckout}
      onClose={() => {
        setShowCheckout(false);
        onClose();
      }}
      appliedCoupon={appliedCoupon}
    />
  </>
  );
}