import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, animate } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import type { Product } from '../../types/api';

const FALLBACK_PRODUCTS: Product[] = [
  { id: 'fallback-1', name: 'Caramel Palazzo Pants', price: 60, images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1200&q=90&fit=crop'], category: 'Pants', new_arrival: true } as Product,
  { id: 'fallback-2', name: 'Blue Fitted Dress', price: 80, images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1200&q=90&fit=crop'], category: 'Dresses', new_arrival: true } as Product,
  { id: 'fallback-3', name: 'White Summer Top', price: 45, images: ['https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=1200&q=90&fit=crop'], category: 'Tops', new_arrival: true } as Product,
  { id: 'fallback-4', name: 'Black Leather Jacket', price: 120, images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&q=90&fit=crop'], category: 'Outerwear', new_arrival: true } as Product,
  { id: 'fallback-5', name: 'Silk Midi Skirt', price: 75, images: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=1200&q=90&fit=crop'], category: 'Skirts', new_arrival: true } as Product,
];

const CLONES = 2;
const GAP = 16;
const AUTOPLAY_MS = 8000;

export function MobileNewArrivals() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const n = products.length;
  const clones = Math.min(CLONES, n);

  const displayList = [
    ...products.slice(n - clones),
    ...products,
    ...products.slice(0, clones),
  ];

  const [pos, setPos] = useState(clones);
  const posRef = useRef(clones);
  const isAnimating = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dimsRef = useRef({ track: 0, card: 0, slot: 0 });
  const [card, setCard] = useState(0);
  const x = useMotionValue(0);

  const touchStartX = useRef<number | null>(null);
  const didSwipe = useRef(false);

  const getX = (p: number) => {
    const d = dimsRef.current;
    return d.track / 2 - p * d.slot - d.card / 2;
  };

  const slideTo = useCallback(
    (nextPos: number, instant = false) => {
      if (!instant && isAnimating.current) return;
      posRef.current = nextPos;
      setPos(nextPos);
      if (instant) { x.set(getX(nextPos)); return; }
      isAnimating.current = true;
      animate(x, getX(nextPos), {
        duration: 0.5,
        ease: [0.32, 0.72, 0, 1],
        onComplete: () => {
          isAnimating.current = false;
          if (nextPos >= n + clones) { const r = nextPos - n; posRef.current = r; setPos(r); x.set(getX(r)); }
          else if (nextPos < clones) { const r = nextPos + n; posRef.current = r; setPos(r); x.set(getX(r)); }
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [x, n, clones],
  );

  // Measure → responsive card width (72% of track, capped for larger screens).
  useEffect(() => {
    const update = () => {
      if (!trackRef.current) return;
      const track = trackRef.current.offsetWidth;
      const c = Math.round(Math.min(track * 0.72, 440));
      dimsRef.current = { track, card: c, slot: c + GAP };
      setCard(c);
      x.set(getX(posRef.current));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [x]);

  useEffect(() => {
    posRef.current = clones; setPos(clones); x.set(getX(clones));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, clones, x]);

  useEffect(() => {
    let cancelled = false;
    productService.getNewArrivals(8).then((data) => {
      if (!cancelled && data.length > 0) setProducts(data);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => slideTo(posRef.current + 1), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [n, slideTo]);

  const realIndex = ((pos - clones) % n + n) % n;
  const cardHeight = Math.round(card * (4 / 3));

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; didSwipe.current = false; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 40) { didSwipe.current = true; slideTo(posRef.current + (dx < 0 ? 1 : -1)); }
  };
  const handleCardClick = (index: number, product: Product) => {
    if (didSwipe.current) { didSwipe.current = false; return; }
    if (index === pos) navigate(`/product/${product.id}`);
    else slideTo(index);
  };

  return (
    <section className="w-full bg-background py-8 overflow-hidden">
      <div className="flex justify-center mb-5">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/70">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          New Arrivals
        </span>
      </div>

      <div ref={trackRef} className="w-full select-none" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {card > 0 && (
          <motion.div className="flex" style={{ x, gap: GAP }}>
            {displayList.map((product, index) => {
              const isActive = index === pos;
              return (
                <motion.div
                  key={`${product.id}-${index}`}
                  animate={{ scale: isActive ? 1 : 0.9, opacity: isActive ? 1 : 0.45 }}
                  transition={{ duration: 0.45 }}
                  onClick={() => handleCardClick(index, product)}
                  className={`relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer bg-muted ${
                    isActive ? 'shadow-[0_20px_50px_rgba(0,0,0,0.25)]' : 'shadow-lg'
                  }`}
                  style={{ width: card, height: cardHeight }}
                >
                  <img src={product.images?.[0]} alt={product.name} className="w-full h-full object-cover" draggable={false} />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pt-10 pb-5 px-4">
                    <h3 className="text-white text-center text-base font-semibold tracking-wide line-clamp-1 drop-shadow">
                      {product.name}
                    </h3>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {n > 1 && (
        <div className="flex justify-center gap-1.5 mt-6">
          {products.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to item ${index + 1}`}
              onClick={() => slideTo(clones + index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === realIndex ? 'w-5 bg-foreground' : 'w-1.5 bg-foreground/25 hover:bg-foreground/45'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
