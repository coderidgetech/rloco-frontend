import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

export function VideoShowcase() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    productService
      .getNewArrivals(8)
      .then((data) => {
        const withImages = data.filter((product) => Boolean(product.images?.[0]));
        if (!cancelled && withImages.length > 0) {
          setProducts(withImages);
          setActiveIndex(0);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const show = useCallback(
    (index: number) => {
      setActiveIndex((index + products.length) % products.length);
    },
    [products.length],
  );

  useEffect(() => {
    if (paused || products.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % products.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [paused, products.length]);

  const activeProduct = products[activeIndex] ?? products[0];
  if (!activeProduct) return null;

  return (
    <section
      aria-label="New arrivals"
      className="relative h-[78svh] min-h-[560px] w-full overflow-hidden bg-neutral-950 md:h-screen"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current == null) return;
        const distance = event.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(distance) > 45) show(activeIndex + (distance < 0 ? 1 : -1));
      }}
    >
      <AnimatePresence mode="sync" initial={false}>
        <motion.img
          key={activeProduct.id}
          src={activeProduct.images[0]}
          alt={activeProduct.name}
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.025 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-black/45" aria-hidden />

      <div className="absolute inset-x-0 top-8 z-10 flex justify-center md:top-10">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white drop-shadow-md md:text-xs">
          New Arrivals
        </h2>
      </div>

      <div className="absolute inset-0 z-10 flex items-end justify-center pb-20 md:pb-24">
        <motion.button
          key={`shop-${activeProduct.id}`}
          type="button"
          onClick={() => navigate(`/product/${activeProduct.id}`)}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="min-w-36 border border-white bg-white px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-950 shadow-xl transition-colors hover:bg-neutral-950 hover:text-white md:min-w-40 md:px-10 md:py-4"
        >
          Shop Now
        </motion.button>
      </div>

      {products.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => show(activeIndex - 1)}
            aria-label="Previous new arrival"
            className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/15 text-white backdrop-blur-sm transition hover:bg-black/35 md:left-7 md:h-12 md:w-12"
          >
            <ChevronLeft size={22} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => show(activeIndex + 1)}
            aria-label="Next new arrival"
            className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/15 text-white backdrop-blur-sm transition hover:bg-black/35 md:right-7 md:h-12 md:w-12"
          >
            <ChevronRight size={22} strokeWidth={1.5} />
          </button>

          <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
            {products.map((product, index) => (
              <button
                key={product.id}
                type="button"
                onClick={() => show(index)}
                aria-label={`Show new arrival ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'w-7 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
