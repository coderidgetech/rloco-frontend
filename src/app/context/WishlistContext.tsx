import { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { wishlistService } from '../services/wishlistService';
import { useUser } from './UserContext';
import { Product } from '../types/api';

interface WishlistItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  category: string;
  gender: 'women' | 'men' | 'unisex';
  colors?: string[];
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

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useUser();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

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
      const wishlist = await wishlistService.getWishlist();
      // Convert API wishlist items to local format
      // Note: Backend returns Wishlist[] with product_id, we'd need to fetch product details
      // For now, we'll keep a simple mapping
      setItems([]); // Will be populated when we fetch product details
    } catch (error) {
      console.error('Failed to sync wishlist:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

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
        console.error('Failed to add to wishlist:', error);
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
        console.error('Failed to remove from wishlist:', error);
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
          console.error('Failed to remove item from wishlist:', error);
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
