import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { Button } from './ui/button';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, total, itemCount } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);

  const handleCheckout = () => {
    setCheckingOut(true);
    // Simulate checkout process
    setTimeout(() => {
      alert('Checkout functionality would be implemented here!');
      setCheckingOut(false);
    }, 1500);
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
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(60px)',
              WebkitBackdropFilter: 'blur(60px)',
            }}
            className="fixed inset-0 z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag size={24} />
                <div>
                  <h2 className="text-xl">Shopping Cart</h2>
                  <p className="text-sm text-foreground/60">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20"
                >
                  <ShoppingBag size={64} className="mx-auto text-foreground/20 mb-4" />
                  <h3 className="text-xl mb-2">Your cart is empty</h3>
                  <p className="text-foreground/60 mb-6">
                    Start adding some items to your cart
                  </p>
                  <Button onClick={onClose}>
                    Continue Shopping
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={`${item.id}-${item.size}`}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8, x: 100 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-4 group"
                      >
                        <div className="w-24 h-32 bg-accent overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                          />
                        </div>

                        <div className="flex-1 flex flex-col">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-medium mb-1">{item.name}</h3>
                              <p className="text-sm text-foreground/60">Size: {item.size}</p>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeFromCart(item.id, item.size)}
                              className="text-foreground/40 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={18} />
                            </motion.button>
                          </div>

                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center gap-3 border border-border">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  updateQuantity(item.id, item.size, item.quantity - 1)
                                }
                                className="w-8 h-8 flex items-center justify-center hover:bg-accent transition-colors"
                              >
                                <Minus size={14} />
                              </motion.button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() =>
                                  updateQuantity(item.id, item.size, item.quantity + 1)
                                }
                                className="w-8 h-8 flex items-center justify-center hover:bg-accent transition-colors"
                              >
                                <Plus size={14} />
                              </motion.button>
                            </div>

                            <div className="text-lg">₹{((item as any).priceINR || item.price * 75) * item.quantity}</div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border px-6 py-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-foreground/60">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-foreground/60">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex items-center justify-between text-xl">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="w-full"
                >
                  {checkingOut ? 'Processing...' : 'Proceed to Checkout'}
                </Button>

                <Button
                  variant="secondary"
                  onClick={onClose}
                  className="w-full"
                >
                  Continue Shopping
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}