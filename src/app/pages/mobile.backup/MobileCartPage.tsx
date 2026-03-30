import { motion, AnimatePresence } from 'motion/react';
import { Minus, Plus, Trash2, ChevronLeft, Tag, ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '@/app/components/mobile/EmptyState';
import { MobileSubPageHeader } from '@/app/components/mobile/MobileSubPageHeader';
import { PH } from '@/app/lib/formPlaceholders';

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
      <div className="min-h-screen bg-white pb-20 flex flex-col">
        {/* Unified Header */}
        <MobileSubPageHeader showBackButton={false} />

        {/* Empty State */}
        <div className="flex-1 pt-[120px]">{/* Adjusted for header + delivery bar */}
          <EmptyState type="cart" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Unified Header */}
      <MobileSubPageHeader showBackButton={false} />

      {/* Cart Items */}
      <div className="pt-[145px] px-4 pb-4"> {/* Header + delivery bar + safe area */}
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
                  placeholder={PH.promoCode}
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
      <div className="fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-border/20">
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
    </div>
  );
}