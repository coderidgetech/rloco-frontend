import { motion } from 'motion/react';
import { ChevronLeft, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useWishlist } from '@/app/context/WishlistContext';
import { useCart } from '@/app/context/CartContext';
import { toast } from 'sonner';
import { productService } from '@/app/services/productService';
import { Product } from '@/app/types/api';
import { EmptyState } from '@/app/components/mobile/EmptyState';
import { MobileSubPageHeader } from '@/app/components/mobile/MobileSubPageHeader';
import { useCurrency } from '@/app/context/CurrencyContext';

export function MobileWishlistPage() {
  const { market } = useCurrency();
  const navigate = useNavigate();
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [productsMap, setProductsMap] = useState<Map<string, Product>>(new Map());

  useEffect(() => {
    if (items.length === 0) return;
    const ids = items.map(i => String(i.id)).filter(id => /^[0-9a-fA-F]{24}$/.test(id));
    Promise.all(ids.map(id => productService.getById(id, { market }).catch(() => null))).then(results => {
      const map = new Map<string, Product>();
      results.forEach((p, i) => { if (p) map.set(ids[i], p); });
      setProductsMap(map);
    });
  }, [items, market]);

  const handleAddToCart = (item: any) => {
    const product = productsMap.get(String(item.id));
    if (product?.sizes?.length) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || item.image,
        size: product.sizes[0],
        quantity: 1,
      });
      toast.success('Added to cart!');
    } else {
      toast.error('Product not available');
    }
  };

  const handleRemove = (id: string | number) => {
    removeItem(String(id));
    toast.success('Removed from wishlist');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white pb-20 flex flex-col">
        {/* Unified Header */}
        <MobileSubPageHeader />

        {/* Empty State */}
        <div className="flex-1 pt-[120px]">
          <EmptyState type="wishlist" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Unified Header */}
      <MobileSubPageHeader />

      {/* Wishlist Items */}
      <div className="pt-[145px] px-4"> {/* Header + delivery bar + safe area */}
        <div className="grid grid-cols-2 gap-3 py-4">
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl overflow-hidden border border-border/20"
            >
              {/* Product Image */}
              <div className="relative aspect-[3/4] bg-muted">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onClick={() => navigate(`/product/${String(item.id)}`)}
                />
                
                {/* Remove Button */}
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm"
                >
                  <Trash2 size={14} className="text-red-500" />
                </motion.button>
              </div>

              {/* Product Info */}
              <div className="p-3">
                <h3 className="text-sm font-medium line-clamp-2 mb-2 leading-snug">
                  {item.name}
                </h3>
                
                <p className="text-base font-semibold text-primary mb-3">
                  ${item.price}
                </p>

                {/* Add to Cart Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAddToCart(item)}
                  className="w-full bg-primary text-white py-2.5 rounded-full text-xs font-medium flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag size={14} />
                  Add to Cart
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
}