import { Check, X } from 'lucide-react';
import { Product } from '../types/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface AddToBagDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  selectedSize: string;
  selectedColor: string;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
  onConfirm: () => void;
}

export function AddToBagDialog({
  open,
  onOpenChange,
  product,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange,
  onConfirm,
}: AddToBagDialogProps) {
  if (!product) return null;

  const sizes = product.sizes?.length ? product.sizes : ['M'];
  const colors = product.colors?.length ? product.colors : ['Default'];

  const handleConfirm = () => {
    if (!selectedSize && sizes.length > 0) {
      onSizeChange(sizes[0]);
    }
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[340px]">
        <DialogHeader>
          <DialogTitle className="text-base">Select Size & Color</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {sizes.length > 0 && (
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Size</label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => onSizeChange(size)}
                    className={`px-3 py-2 text-sm border rounded transition-all ${
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
          {colors.length > 0 && (
            <div>
              <label className="text-xs text-muted-foreground mb-2 block">Color</label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => onColorChange(color)}
                    className={`px-3 py-2 text-sm border rounded transition-all ${
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
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 bg-primary text-primary-foreground px-4 py-2.5 rounded text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Check size={16} />
              Add to Bag
            </button>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="p-2.5 hover:bg-muted rounded transition-colors"
              title="Cancel"
              aria-label="Cancel"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
