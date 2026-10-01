import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { PLACEHOLDER_IMAGE } from '../../constants';
import { AddToBagPopover } from '../AddToBagPopover';
import { toast } from 'sonner';

export interface MobileProductCardData {
  id: string | number;
  name: string;
  price: number;
  price_inr?: number;
  priceINR?: number;
  images?: string[];
  image?: string;
  category?: string;
  gender?: string;
  originalPrice?: number;
  original_price?: number;
  sale?: boolean;
  isNew?: boolean;
  on_sale?: boolean;
  onSale?: boolean;
  new_arrival?: boolean;
  newArrival?: boolean;
  sizes?: string[];
  colors?: string[];
}

/**
 * In-cell image carousel: with >1 image the card image becomes a native
 * horizontal snap strip (swipeable) with dot indicators; a tap falls through
 * to the card's product link.
 */
function CardImages({ images, alt }: { images: string[]; alt: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  if (images.length <= 1) {
    return (
      <img src={images[0] ?? PLACEHOLDER_IMAGE} alt={alt} className="w-full h-full object-cover" loading="lazy" />
    );
  }

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== active) setActive(i);
  };

  return (
    <>
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide [scrollbar-width:none]"
        style={{ scrollbarWidth: 'none' }}
      >
        {images.map((src, i) => (
          <img
            key={i}
            src={src || PLACEHOLDER_IMAGE}
            alt={`${alt} ${i + 1}`}
            className="w-full h-full shrink-0 snap-center object-cover"
            loading="lazy"
            draggable={false}
          />
        ))}
      </div>
      <div className="absolute bottom-2 left-0 right-0 z-10 flex justify-center gap-1 pointer-events-none">
        {images.map((_, i) => (
          <span key={i} className={`h-1 rounded-full transition-all ${i === active ? 'w-3 bg-white' : 'w-1 bg-white/60'}`} />
        ))}
      </div>
    </>
  );
}

/** The home-style product card (used on the home grids and mobile listing grids). */
export function MobileProductCard({
  product,
  index = 0,
  wishlistView = false,
}: {
  product: MobileProductCardData;
  index?: number;
  /** On a wishlist listing, every card is already saved — show a remove (X)
   * control instead of the save/wishlist heart, matching standard fashion
   * e-commerce wishlist pages (Myntra, etc.). */
  wishlistView?: boolean;
}) {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart, items: cartItems } = useCart();
  const { formatPrice } = useCurrency();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  const images = (product.images ?? (product.image ? [product.image] : [])).filter(
    (s) => typeof s === 'string' && s.trim() !== '',
  );
  const isOnSale = product.sale ?? product.on_sale ?? product.onSale;
  const isNew = (product.isNew ?? product.new_arrival ?? product.newArrival) && !isOnSale;
  const original = product.originalPrice ?? product.original_price;
  const isInCart = cartItems.some((item) => String(item.id) === String(product.id));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInCart) {
      navigate('/cart');
      return;
    }
    setSelectedSize(product.sizes?.[0] || 'M');
    setSelectedColor(product.colors?.[0] || 'Default');
    setPopoverOpen(true);
  };

  const handleConfirmAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      priceINR: product.price_inr ?? product.priceINR,
      image: images[0] ?? PLACEHOLDER_IMAGE,
      size: selectedSize || product.sizes?.[0] || 'M',
    });
    toast.success('Added to cart');
    setPopoverOpen(false);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: images[0] ?? PLACEHOLDER_IMAGE,
        category: product.category ?? '',
        gender: (product.gender as string) ?? 'unisex',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/product/${product.id}`)}
      className="cursor-pointer"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        <CardImages images={images} alt={product.name} />

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={
            wishlistView
              ? (e) => {
                  e.stopPropagation();
                  removeFromWishlist(product.id);
                }
              : toggleWishlist
          }
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center z-10"
          aria-label={wishlistView ? 'Remove from wishlist' : 'Save'}
        >
          {wishlistView ? (
            <Trash2 size={18} className="text-white" strokeWidth={2} style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))' }} />
          ) : (
            <Heart
              size={19}
              className={`fill-current ${isInWishlist(product.id) ? 'text-red-500' : 'text-white'}`}
              style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))' }}
            />
          )}
        </motion.button>

        {isOnSale && (
          <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            Sale
          </span>
        )}
        {isNew && (
          <span className="absolute top-2 left-2 z-10 bg-foreground text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
            New
          </span>
        )}
      </div>

      <div className="pt-2.5">
        <h3 className="line-clamp-1 text-sm font-normal leading-tight text-foreground">{product.name}</h3>
        <div className="mt-1 flex items-center justify-between gap-1.5">
          <div className="flex min-w-0 items-center gap-1.5">
            <span className="text-sm font-normal leading-none text-foreground/60">
              {formatPrice(product.price, product.price_inr ?? product.priceINR)}
            </span>
            {original != null && original > product.price && (
              <span className="text-xs font-normal leading-none text-foreground/35 line-through">{formatPrice(original, undefined)}</span>
            )}
          </div>
          {wishlistView && (
            <div className="relative shrink-0">
            <AddToBagPopover
              isOpen={popoverOpen}
              product={product as any}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              onSizeChange={setSelectedSize}
              onColorChange={setSelectedColor}
              onConfirm={handleConfirmAddToCart}
              onCancel={() => setPopoverOpen(false)}
            />
            <button
              type="button"
              onClick={handleAddToCart}
              aria-label={isInCart ? 'View cart' : 'Add to cart'}
              className={`flex h-7 w-7 items-center justify-center rounded-full shadow-sm transition-colors ${
                isInCart
                  ? 'bg-green-500 text-white'
                  : 'bg-foreground text-background active:opacity-80'
              }`}
            >
              {isInCart ? <Check size={12} strokeWidth={2.5} /> : <ShoppingBag size={12} />}
            </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
