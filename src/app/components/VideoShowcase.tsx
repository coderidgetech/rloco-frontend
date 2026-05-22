import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, animate } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { productService } from '../services/productService';
import type { Product } from '../types/api';

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'fallback-1',
    name: 'Caramel Palazzo Pants',
    price: 60,
    images: ['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1920&h=1080&q=90&fit=crop'],
    category: 'Pants',
    new_arrival: true,
  } as Product,
  {
    id: 'fallback-2',
    name: 'Blue Fitted Dress',
    price: 80,
    images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=1920&h=1080&q=90&fit=crop'],
    category: 'Dresses',
    new_arrival: true,
  } as Product,
  {
    id: 'fallback-3',
    name: 'White Summer Top',
    price: 45,
    images: ['https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=1920&h=1080&q=90&fit=crop'],
    category: 'Tops',
    new_arrival: true,
  } as Product,
  {
    id: 'fallback-4',
    name: 'Black Leather Jacket',
    price: 120,
    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1920&h=1080&q=90&fit=crop'],
    category: 'Outerwear',
    new_arrival: true,
  } as Product,
  {
    id: 'fallback-5',
    name: 'Silk Midi Skirt',
    price: 75,
    images: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=1920&h=1080&q=90&fit=crop'],
    category: 'Skirts',
    new_arrival: true,
  } as Product,
];

const CARD_WIDTH = 148;
const CARD_GAP = 14;
const SLOT = CARD_WIDTH + CARD_GAP;
const CLONES = 3;

export function VideoShowcase() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const n = products.length;
  const clones = Math.min(CLONES, n);

  // displayList: [tail clones] + [real items] + [head clones]
  const displayList = [
    ...products.slice(n - clones),
    ...products,
    ...products.slice(0, clones),
  ];

  // pos = index within displayList; real items live at [clones, clones+n-1]
  const [pos, setPos] = useState(clones);
  const posRef = useRef(clones);
  const isAnimating = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const trackWidthRef = useRef(0);
  const x = useMotionValue(0);

  const getX = (p: number) => trackWidthRef.current / 2 - p * SLOT - CARD_WIDTH / 2;

  const slideTo = useCallback(
    (nextPos: number, instant = false) => {
      if (!instant && isAnimating.current) return;
      posRef.current = nextPos;
      setPos(nextPos);

      if (instant) {
        x.set(getX(nextPos));
        return;
      }

      isAnimating.current = true;
      animate(x, getX(nextPos), {
        duration: 0.55,
        ease: [0.32, 0.72, 0, 1],
        onComplete: () => {
          isAnimating.current = false;
          // Snap back from clone to real equivalent — invisible because position is identical
          if (nextPos >= n + clones) {
            const r = nextPos - n;
            posRef.current = r;
            setPos(r);
            x.set(getX(r));
          } else if (nextPos < clones) {
            const r = nextPos + n;
            posRef.current = r;
            setPos(r);
            x.set(getX(r));
          }
        },
      });
    },
    // getX only touches refs so no dep needed; x is stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [x, n, clones],
  );

  // Measure track and re-position on resize
  useEffect(() => {
    const update = () => {
      if (!trackRef.current) return;
      trackWidthRef.current = trackRef.current.offsetWidth;
      x.set(getX(posRef.current));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [x]);

  // Reset position when product list changes (API load)
  useEffect(() => {
    posRef.current = clones;
    setPos(clones);
    x.set(getX(clones));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, clones, x]);

  useEffect(() => {
    let cancelled = false;
    productService.getNewArrivals(8).then((data) => {
      if (!cancelled && data.length > 0) setProducts(data);
    }).catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Auto-advance
  useEffect(() => {
    if (n <= 1) return;
    const t = setInterval(() => slideTo(posRef.current + 1), 6000);
    return () => clearInterval(t);
  }, [n, slideTo]);

  const realIndex = ((pos - clones) % n + n) % n;
  const bg = products[realIndex]?.images?.[0] ?? FALLBACK_PRODUCTS[0].images[0];

  return (
    <section className="relative h-screen w-full snap-start snap-always overflow-hidden bg-neutral-950">
      {/* Background synced to active product */}
      <div className="absolute inset-0">
        <motion.img
          key={bg}
          src={bg}
          alt=""
          className="h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/10 to-black/70" aria-hidden />
      </div>

      {/* Label */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-10">
        <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-[11px] font-semibold uppercase tracking-[0.22em] px-4 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          New Arrivals
        </span>
      </div>

      {/* Infinite carousel */}
      <div className="absolute bottom-10 left-0 right-0 z-10">
        <div ref={trackRef} className="overflow-hidden w-full">
          <motion.div className="flex" style={{ x, gap: CARD_GAP }}>
            {displayList.map((product, index) => {
              const dist = Math.abs(index - pos);
              const isActive = dist === 0;
              return (
                <motion.div
                  key={`${product.id}-${index}`}
                  animate={{
                    scale: isActive ? 1 : dist === 1 ? 0.88 : 0.78,
                    opacity: isActive ? 1 : dist === 1 ? 0.65 : dist === 2 ? 0.38 : 0.15,
                  }}
                  transition={{ duration: 0.45 }}
                  className={`relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer ${
                    isActive
                      ? 'shadow-[0_0_0_2px_white,0_24px_48px_rgba(0,0,0,0.55)]'
                      : 'shadow-[0_8px_24px_rgba(0,0,0,0.4)]'
                  }`}
                  style={{ width: CARD_WIDTH, height: 218 }}
                  onClick={() =>
                    isActive ? navigate(`/product/${product.id}`) : slideTo(index)
                  }
                >
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* NEW badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="bg-primary text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                      NEW
                    </span>
                  </div>

                  {/* Shop button */}
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }}
                    className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30"
                  >
                    <ShoppingBag size={12} className="text-white" strokeWidth={1.8} />
                  </motion.button>

                  {/* Product info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white/60 text-[9px] uppercase tracking-widest mb-0.5 truncate">
                      {product.category}
                    </p>
                    <h3 className="text-white text-[11px] font-semibold leading-tight line-clamp-2 mb-1.5">
                      {product.name}
                    </h3>
                    <p className="text-white font-bold text-sm">${product.price.toFixed(2)}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Dot indicators (map over real products only) */}
        {n > 1 && (
          <div className="flex justify-center gap-1.5 mt-5">
            {products.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => slideTo(clones + index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === realIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/35 hover:bg-white/55'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
