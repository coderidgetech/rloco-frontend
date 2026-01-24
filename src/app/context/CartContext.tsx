import { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback, useRef } from 'react';
import { cartService } from '../services/cartService';
import { useUser } from './UserContext';
import { CartItem as APICartItem } from '../types/api';

interface CartItem {
  id: number | string;
  name: string;
  price: number;
  priceINR?: number;
  image: string;
  size: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addToCart: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeFromCart: (id: number | string, size: string) => Promise<void>;
  updateQuantity: (id: number | string, size: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  total: number;
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'rloco_cart';
const CART_VERSION = '1.0'; // Increment when cart structure changes

// Load cart from localStorage
const loadCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate version compatibility
      if (parsed.version === CART_VERSION && Array.isArray(parsed.items)) {
        return parsed.items;
      }
    }
  } catch (error) {
    console.error('Failed to load cart from storage:', error);
    // Clear corrupted data
    localStorage.removeItem(CART_STORAGE_KEY);
  }
  return [];
};

// Save cart to localStorage with debouncing
let saveTimeout: ReturnType<typeof setTimeout> | null = null;
const saveCartToStorage = (items: CartItem[]) => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  
  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify({
          version: CART_VERSION,
          items,
          savedAt: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.error('Failed to save cart to storage:', error);
      // Handle quota exceeded error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded. Consider clearing old data.');
      }
    }
  }, 300); // Debounce: save 300ms after last change
};

export function CartProvider({ children }: { children: ReactNode }) {
  // Safely get user context - handle case where UserProvider might not be available
  let isAuthenticated = false;
  try {
    const userContext = useUser();
    isAuthenticated = userContext.isAuthenticated;
  } catch (error) {
    // UserProvider not available, continue with unauthenticated state
    isAuthenticated = false;
  }
  
  const [items, setItems] = useState<CartItem[]>(() => loadCartFromStorage());
  const [loading, setLoading] = useState(false);
  const prevAuthenticatedRef = useRef<boolean>(false);

  const syncCart = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const cart = await cartService.getCart();
      // Convert API cart items to local format
      const convertedItems: CartItem[] = cart.items.map((item) => ({
        id: item.product_id,
        name: item.product_name,
        price: item.price,
        priceINR: item.price_inr,
        image: item.image,
        size: item.size,
        quantity: item.quantity,
      }));
      setItems(convertedItems);
    } catch (error) {
      console.error('Failed to sync cart:', error);
      // Keep local cart on error
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Sync cart with backend when authenticated. On login, merge guest cart first.
  useEffect(() => {
    if (!isAuthenticated) {
      prevAuthenticatedRef.current = false;
      return;
    }

    const justLoggedIn = !prevAuthenticatedRef.current;
    prevAuthenticatedRef.current = true;

    const runSync = async () => {
      if (justLoggedIn) {
        const guestItems = loadCartFromStorage();
        if (guestItems.length > 0) {
          try {
            setLoading(true);
            for (const guest of guestItems) {
              try {
                await cartService.addItem({
                  product_id: String(guest.id),
                  product_name: guest.name,
                  image: guest.image,
                  price: guest.price,
                  price_inr: guest.priceINR,
                  size: guest.size,
                  quantity: guest.quantity,
                });
              } catch (err) {
                console.warn('Failed to merge guest cart item:', guest.id, guest.size, err);
              }
            }
            localStorage.removeItem(CART_STORAGE_KEY);
          } catch (error) {
            console.error('Failed to merge guest cart:', error);
          } finally {
            setLoading(false);
          }
        }
      }
      await syncCart();
    };

    runSync();
  }, [isAuthenticated, syncCart]);

  const addToCart = useCallback(async (item: Omit<CartItem, 'quantity'>) => {
    // Optimistic update
    setItems((prev) => {
      const existing = prev.find((i) => String(i.id) === String(item.id) && i.size === item.size);
      if (existing) {
        return prev.map((i) =>
          String(i.id) === String(item.id) && i.size === item.size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });

    // Sync with backend if authenticated
    if (isAuthenticated) {
      try {
        await cartService.addItem({
          product_id: String(item.id),
          product_name: item.name,
          image: item.image,
          price: item.price,
          price_inr: item.priceINR,
          size: item.size,
          quantity: 1,
        });
      } catch (error) {
        console.error('Failed to add item to cart:', error);
        // Revert optimistic update on error
        setItems((prev) => prev.filter((i) => !(String(i.id) === String(item.id) && i.size === item.size)));
      }
    } else {
      // Save to localStorage for unauthenticated users
      saveCartToStorage([...items, { ...item, quantity: 1 }]);
    }
  }, [isAuthenticated, items]);

  const removeFromCart = useCallback(async (id: number | string, size: string) => {
    // Optimistic update
    setItems((prev) => prev.filter((i) => !(String(i.id) === String(id) && i.size === size)));

    // Sync with backend if authenticated
    if (isAuthenticated) {
      try {
        await cartService.removeItem(String(id), size);
      } catch (error) {
        console.error('Failed to remove item from cart:', error);
        // Revert by syncing
        await syncCart();
      }
    } else {
      saveCartToStorage(items.filter((i) => !(String(i.id) === String(id) && i.size === size)));
    }
  }, [isAuthenticated, items, syncCart]);

  const updateQuantity = useCallback(async (id: number | string, size: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(id, size);
      return;
    }

    // Optimistic update
    setItems((prev) =>
      prev.map((i) =>
        String(i.id) === String(id) && i.size === size ? { ...i, quantity } : i
      )
    );

    // Sync with backend if authenticated
    if (isAuthenticated) {
      try {
        await cartService.updateItem(String(id), size, quantity);
      } catch (error) {
        console.error('Failed to update cart item:', error);
        await syncCart();
      }
    } else {
      saveCartToStorage(items.map((i) => (String(i.id) === String(id) && i.size === size ? { ...i, quantity } : i)));
    }
  }, [isAuthenticated, items, removeFromCart, syncCart]);

  const clearCart = useCallback(async () => {
    setItems([]);
    
    if (isAuthenticated) {
      try {
        await cartService.clearCart();
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [isAuthenticated]);

  // Memoize computed values to prevent unnecessary re-renders
  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  // Persist to localStorage for unauthenticated users
  useEffect(() => {
    if (!isAuthenticated) {
      saveCartToStorage(items);
    }
  }, [items, isAuthenticated]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      items,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      itemCount,
      total,
      syncCart,
    }),
    [items, loading, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, total, syncCart]
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}

// Export CartItem type for use in other components
export type { CartItem };

export default CartProvider;