import { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { wishlistService } from '../services/wishlistService';
import { productService } from '../services/productService';
import { isUnauthorizedApiError } from '../lib/apiErrors';
import { useUser } from './UserContext';
import { useCurrency } from './CurrencyContext';
import { Product } from '../types/api';

interface WishlistItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  category: string;
  gender: 'women' | 'men' | 'unisex';
  colors?: string[];
  sizes?: string[];
  onSale?: boolean;
  newArrival?: boolean;
  featured?: boolean;
}

interface WishlistContextType {
  items: WishlistItem[];
  loading: boolean;
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (id: string | number) => Promise<void>;
  isInWishlist: (id: string | number) => boolean;
  clearWishlist: () => Promise<void>;
  syncWishlist: () => Promise<void>;
  itemCount: number;
}

const STORAGE_KEY = 'rloco_wishlist';

const loadFromStorage = (): WishlistItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (items: WishlistItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useUser();
  const { market } = useCurrency();
  const [items, setItems] = useState<WishlistItem[]>(() => loadFromStorage());
  const [loading, setLoading] = useState(false);

  // Persist to localStorage whenever items change
  useEffect(() => {
    saveToStorage(items);
  }, [items]);

  // Sync wishlist with backend when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      syncWishlist();
    }
  }, [isAuthenticated]);

  const syncWishlist = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const wishlistEntries = await wishlistService.getWishlist();
      if (!wishlistEntries || wishlistEntries.length === 0) {
        setItems([]);
        return;
      }

      // Fetch product details for each wishlist entry
      const productPromises = wishlistEntries.map((entry) =>
        productService.getById(entry.product_id, { market }).catch(() => null)
      );
      const products = await Promise.all(productPromises);

      const mappedItems: WishlistItem[] = products
        .filter((p): p is Product => p !== null)
        .map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.images?.[0] || '',
          category: p.category,
          gender: p.gender,
          colors: p.colors,
          sizes: p.sizes,
          onSale: p.on_sale,
          newArrival: p.new_arrival,
          featured: p.featured,
        }));

      // Merge: keep guest items not already on server, then upload them
      setItems((prev) => {
        const serverIds = new Set(mappedItems.map((i) => String(i.id)));
        const guestOnly = prev.filter((i) => !serverIds.has(String(i.id)));
        // Fire-and-forget: upload guest-only items to server
        guestOnly.forEach((item) => {
          wishlistService.addToWishlist(String(item.id)).catch(() => {});
        });
        return [...mappedItems, ...guestOnly];
      });
    } catch (error) {
      if (!isUnauthorizedApiError(error)) {
        console.error('Failed to sync wishlist:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, market]);

  const addToWishlist = useCallback(async (item: WishlistItem) => {
    // Optimistic update
    setItems((prev) => {
      const existing = prev.find((i) => String(i.id) === String(item.id));
      if (existing) {
        return prev;
      }
      return [...prev, item];
    });

    // Sync with backend if authenticated
    if (isAuthenticated) {
      try {
        await wishlistService.addToWishlist(String(item.id));
      } catch (error) {
        if (!isUnauthorizedApiError(error)) {
          console.error('Failed to add to wishlist:', error);
        }
        // Revert optimistic update
        setItems((prev) => prev.filter((i) => String(i.id) !== String(item.id)));
      }
    }
  }, [isAuthenticated]);

  const removeFromWishlist = useCallback(async (id: string | number) => {
    // Optimistic update
    setItems((prev) => prev.filter((i) => String(i.id) !== String(id)));

    // Sync with backend if authenticated
    if (isAuthenticated) {
      try {
        await wishlistService.removeFromWishlist(String(id));
      } catch (error) {
        if (!isUnauthorizedApiError(error)) {
          console.error('Failed to remove from wishlist:', error);
        }
        // Revert by syncing
        await syncWishlist();
      }
    }
  }, [isAuthenticated, syncWishlist]);

  const isInWishlist = useCallback((id: string | number) => {
    return items.some((i) => String(i.id) === String(id));
  }, [items]);

  const clearWishlist = useCallback(async () => {
    setItems([]);
    
    if (isAuthenticated) {
      // Backend doesn't have a clear all endpoint, so we remove items one by one
      // Or we can implement a bulk delete if needed
      const currentItems = [...items];
      for (const item of currentItems) {
        try {
          await wishlistService.removeFromWishlist(String(item.id));
        } catch (error) {
          if (!isUnauthorizedApiError(error)) {
            console.error('Failed to remove item from wishlist:', error);
          }
        }
      }
    }
  }, [isAuthenticated, items]);

  const itemCount = useMemo(() => items.length, [items]);

  const contextValue = useMemo(
    () => ({
      items,
      loading,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
      syncWishlist,
      itemCount,
    }),
    [items, loading, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist, syncWishlist, itemCount]
  );

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
