import { motion, AnimatePresence } from 'motion/react';
import { Minus, Plus, Trash2, ChevronLeft, Tag, ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { BottomNavigation } from '@/app/components/mobile/BottomNavigation';

const COUPON_CODES = {
  'RLOCO10': 10,
  'SAVE20': 20,
  'WELCOME15': 15,
};

export function MobileCartPage() {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, moveToWishlist, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [showCouponInput, setShowCouponInput] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
  const total = subtotal - discount;

  const handleApplyCoupon = () => {
    const upperCode = couponCode.toUpperCase();
    if (COUPON_CODES[upperCode as keyof typeof COUPON_CODES]) {
      setAppliedCoupon({
        code: upperCode,
        discount: COUPON_CODES[upperCode as keyof typeof COUPON_CODES],
      });
      toast.success(`Coupon ${upperCode} applied! ${COUPON_CODES[upperCode as keyof typeof COUPON_CODES]}% off`);
      setShowCouponInput(false);
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.success('Coupon removed');
  };

  const handleMoveToWishlist = (item: any) => {
    moveToWishlist(item.id, item.size);
    toast.success('Moved to wishlist');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white pb-20">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border/20">
          <div className="flex items-center h-14 px-4" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/')}
              className="w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center"
            >
              <ChevronLeft size={20} />
            </motion.button>
            <h1 className="text-lg font-medium ml-3">Shopping Cart</h1>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 pt-14">
          <div className="w-24 h-24 rounded-full bg-foreground/5 flex items-center justify-center mb-4">
            <ShoppingBag size={40} className="text-foreground/30" />
          </div>
          <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
          <p className="text-sm text-foreground/60 mb-6 text-center">
            Add items to get started
          </p>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="bg-primary text-white px-8 py-3 rounded-full font-medium"
          >
            Start Shopping
          </motion.button>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border/20">
        <div className="flex items-center justify-between h-14 px-4" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className="flex items-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/')}
              className="w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center"
            >
              <ChevronLeft size={20} />
            </motion.button>
            <h1 className="text-lg font-medium ml-3">Cart ({items.length})</h1>
          </div>
          
          {items.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Clear all items from cart?')) {
                  clearCart();
                  toast.success('Cart cleared');
                }
              }}
              className="text-sm text-red-500"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Cart Items */}
      <div className="pt-14 px-4 pb-4">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={`${item.id}-${item.size}`}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex gap-3 py-4 border-b border-border/30"
            >
              {/* Product Image */}
              <div className="w-24 h-32 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm mb-1 line-clamp-2">{item.name}</h3>
                <p className="text-xs text-foreground/50 mb-2">Size: {item.size}</p>
                
                {/* Price */}
                <p className="text-base font-semibold text-primary mb-3">
                  ${item.price}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateQuantity(item.id, item.size, Math.max(1, item.quantity - 1))}
                      className="w-7 h-7 rounded-full border border-border flex items-center justify-center"
                    >
                      <Minus size={14} />
                    </motion.button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      className="w-7 h-7 rounded-full border border-border flex items-center justify-center"
                    >
                      <Plus size={14} />
                    </motion.button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-auto">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleMoveToWishlist(item)}
                      className="w-7 h-7 rounded-full bg-foreground/5 flex items-center justify-center"
                    >
                      <Heart size={14} className="text-foreground/60" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        removeFromCart(item.id, item.size);
                        toast.success('Removed from cart');
                      }}
                      className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Coupon Section */}
      <div className="px-4 py-4 border-t border-border/30">
        {appliedCoupon ? (
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
            <div className="flex items-center gap-2">
              <Tag size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-700">
                {appliedCoupon.code} Applied ({appliedCoupon.discount}% off)
              </span>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-xs text-red-500"
            >
              Remove
            </button>
          </div>
        ) : (
          <>
            {!showCouponInput ? (
              <button
                onClick={() => setShowCouponInput(true)}
                className="w-full flex items-center justify-between p-3 border-2 border-dashed border-border rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <Tag size={18} className="text-foreground/60" />
                  <span className="text-sm font-medium">Apply Coupon</span>
                </div>
                <ArrowRight size={18} className="text-foreground/40" />
              </button>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="flex-1 px-4 py-3 border border-border rounded-xl text-sm"
                />
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApplyCoupon}
                  className="px-6 bg-primary text-white rounded-xl font-medium text-sm"
                >
                  Apply
                </motion.button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Price Summary - Fixed Bottom */}
      <div className="fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-border/20" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 64px)' }}>
        <div className="px-4 py-4">
          {/* Summary Rows */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600">Discount</span>
                <span className="font-medium text-green-600">-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-semibold pt-2 border-t border-border/30">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/address-selection')}
            className="w-full bg-primary text-white py-4 rounded-full font-medium text-base flex items-center justify-center gap-2 shadow-lg active:bg-primary/90"
          >
            Proceed to Checkout
            <ArrowRight size={20} />
          </motion.button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
