import { motion, AnimatePresence } from 'motion/react';
import { Check, X } from 'lucide-react';
import { Product } from '../data/products';

interface AddToBagTooltipProps {
  isOpen: boolean;
  product: Product;
  selectedSize: string;
  selectedColor: string;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
  onConfirm: () => void;
  onCancel: (e?: React.MouseEvent) => void;
}

export function AddToBagTooltip({
  isOpen,
  product,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange,
  onConfirm,
  onCancel
}: AddToBagTooltipProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-background border border-border rounded-lg shadow-2xl p-4 w-72 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Arrow pointing down */}
          <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-border" />
          <div className="absolute bottom-[-7px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-background" />
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium mb-3">Select Size & Color</h4>
            
            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Size</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => onSizeChange(size)}
                      className={`px-3 py-1.5 text-xs border rounded transition-all ${
                        selectedSize === size
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-foreground/30'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Color</label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => onColorChange(color)}
                      className={`px-3 py-1.5 text-xs border rounded transition-all ${
                        selectedColor === color
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-foreground/30'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Confirm Button */}
            <div className="flex gap-2 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded text-xs font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <Check size={14} />
                Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCancel}
                className="p-2 hover:bg-muted rounded transition-colors"
                title="Cancel"
              >
                <X size={14} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}