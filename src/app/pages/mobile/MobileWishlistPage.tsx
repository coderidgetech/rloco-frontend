import { motion } from 'motion/react';
import { ChevronLeft, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '@/app/context/WishlistContext';
import { useCart } from '@/app/context/CartContext';
import { toast } from 'sonner';
import { BottomNavigation } from '@/app/components/mobile/BottomNavigation';
import { productService } from '@/app/services/productService';
import { useState, useEffect } from 'react';

export function MobileWishlistPage() {
  const navigate = useNavigate();
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [productsMap, setProductsMap] = useState<Map<string, any>>(new Map());

  // Fetch product details for sizes
  useEffect(() => {
    const fetchProducts = async () => {
      const productIds = items.map(item => String(item.id));
      if (productIds.length === 0) return;

      try {
        const productsData = await Promise.all(
          productIds.map(id => productService.getById(id).catch(() => null))
        );
        const map = new Map();
        productsData.forEach((product, index) => {
          if (product) {
            map.set(productIds[index], product);
          }
        });
        setProductsMap(map);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, [items]);

  const handleAddToCart = (item: any) => {
    const product = productsMap.get(String(item.id));
    if (product && product.sizes && product.sizes.length > 0) {
      addToCart({
        ...item,
        size: product.sizes[0],
        quantity: 1,
      });
      toast.success('Added to cart!');
    } else {
      addToCart({
        ...item,
        size: 'M', // Default size if not available
        quantity: 1,
      });
      toast.success('Added to cart!');
    }
  };

  const handleRemove = (id: number) => {
    removeItem(id);
    toast.success('Removed from wishlist');
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
            <h1 className="text-lg font-medium ml-3">Wishlist</h1>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 pt-14">
          <div className="w-24 h-24 rounded-full bg-foreground/5 flex items-center justify-center mb-4">
            <Heart size={40} className="text-foreground/30" />
          </div>
          <h2 className="text-xl font-medium mb-2">Your wishlist is empty</h2>
          <p className="text-sm text-foreground/60 mb-6 text-center">
            Save items you love for later
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
    <div className="min-h-screen bg-white pb-20">
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
            <h1 className="text-lg font-medium ml-3">Wishlist ({items.length})</h1>
          </div>
          
          {items.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Clear all items from wishlist?')) {
                  clearWishlist();
                  toast.success('Wishlist cleared');
                }
              }}
              className="text-sm text-red-500"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Wishlist Items */}
      <div className="pt-14 px-4">
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
                  onClick={() => navigate(`/product/${item.id}`)}
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

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
