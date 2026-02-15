import { motion } from 'motion/react';
import { useState } from 'react';
import { Check, ShoppingBag, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/app/context/CartContext';
import { toast } from 'sonner';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
}

interface Props {
  currentProduct: Product;
  products: Product[];
}

export function MobileCompleteTheLook({ currentProduct, products }: Props) {
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(
    new Set([currentProduct.id])
  );
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const toggleProduct = (productId: number) => {
    if (productId === currentProduct.id) return; // Can't deselect main product

    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const allProducts = [currentProduct, ...products].slice(0, 4);

  const calculateTotal = () => {
    return allProducts
      .filter((p) => selectedProducts.has(p.id))
      .reduce((sum, p) => sum + p.price, 0);
  };

  const calculateSavings = () => {
    const total = calculateTotal();
    const discount = total * 0.1; // 10% bundle discount
    return discount;
  };

  const finalPrice = calculateTotal() - calculateSavings();

  const handleAddBundle = () => {
    const selectedItems = allProducts.filter((p) => selectedProducts.has(p.id));
    
    selectedItems.forEach((product) => {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        size: 'M', // Default size
      });
    });

    toast.success(`Added ${selectedItems.length} items to cart!`);
  };

  if (products.length === 0) return null;

  return (
    <div className="py-6 bg-gradient-to-br from-primary/5 via-white to-primary/5">
      <div className="px-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={20} className="text-primary" />
          <h3 className="text-xl font-medium">Complete the Look</h3>
        </div>
        <p className="text-sm text-foreground/60 mb-4">
          Bundle and save 10% on your purchase
        </p>

        {/* Products Grid */}
        <div className="space-y-3 mb-4">
          {allProducts.map((product, index) => {
            const isSelected = selectedProducts.has(product.id);
            const isMainProduct = product.id === currentProduct.id;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileTap={!isMainProduct ? { scale: 0.98 } : {}}
                onClick={() => !isMainProduct && toggleProduct(product.id)}
                className={`relative bg-white rounded-2xl p-3 border-2 transition-all ${
                  isSelected
                    ? 'border-primary shadow-lg shadow-primary/10'
                    : 'border-border/30'
                } ${!isMainProduct && 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-3">
                  {/* Checkbox */}
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-primary border-primary'
                        : 'border-border bg-white'
                    }`}
                  >
                    {isSelected && <Check size={14} className="text-white" />}
                  </div>

                  {/* Product Image */}
                  <div className="w-20 h-20 bg-muted rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium mb-1 line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="text-xs text-foreground/50 mb-2">
                      {product.category}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold text-primary">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-foreground/40 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Main Product Badge */}
                  {isMainProduct && (
                    <div className="absolute top-2 right-2 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                      SELECTED
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Price Summary */}
        <div className="bg-white rounded-2xl p-4 border-2 border-primary/20 mb-4">
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm">
              <span className="text-foreground/60">Subtotal ({selectedProducts.size} items)</span>
              <span className="font-medium">${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-600 font-medium">Bundle Discount (10%)</span>
              <span className="text-green-600 font-semibold">
                -${calculateSavings().toFixed(2)}
              </span>
            </div>
            <div className="pt-2 border-t border-border/30 flex justify-between">
              <span className="font-semibold">Total</span>
              <div className="text-right">
                <div className="text-xl font-bold text-primary">
                  ${finalPrice.toFixed(2)}
                </div>
                <div className="text-xs text-green-600 font-medium">
                  You save ${calculateSavings().toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleAddBundle}
            disabled={selectedProducts.size === 0}
            className="w-full bg-primary text-white py-3.5 rounded-full font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={20} />
            Add Bundle to Cart
          </motion.button>
        </div>

        {/* Trust Badge */}
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <p className="text-xs text-green-700 font-medium">
            ✨ Free shipping on orders over $50
          </p>
        </div>
      </div>
    </div>
  );
}
