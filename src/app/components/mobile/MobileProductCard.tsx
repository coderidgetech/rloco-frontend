import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCurrency } from '../../context/CurrencyContext';
import { PLACEHOLDER_IMAGE } from '../../constants';

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
export function MobileProductCard({ product, index = 0 }: { product: MobileProductCardData; index?: number }) {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  const images = (product.images ?? (product.image ? [product.image] : [])).filter(
    (s) => typeof s === 'string' && s.trim() !== '',
  );
  const isOnSale = product.sale ?? product.on_sale ?? product.onSale;
  const isNew = (product.isNew ?? product.new_arrival ?? product.newArrival) && !isOnSale;
  const original = product.originalPrice ?? product.original_price;

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
      <div className="relative aspect-[3/4] bg-muted overflow-hidden rounded-xl">
        <CardImages images={images} alt={product.name} />

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleWishlist}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm z-10"
          aria-label="Save"
        >
          <Heart size={15} className={isInWishlist(product.id) ? 'text-red-500 fill-red-500' : 'text-foreground/60'} />
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

      <div className="pt-2.5 px-0.5">
        <h3 className="text-sm text-foreground line-clamp-1">{product.name}</h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">
            {formatPrice(product.price, product.price_inr ?? product.priceINR)}
          </span>
          {original != null && original > product.price && (
            <span className="text-xs text-foreground/40 line-through">{formatPrice(original, undefined)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
