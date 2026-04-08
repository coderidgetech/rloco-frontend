import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categoryService } from '../services/categoryService';
import type { Category } from '../types/api';
import { Button } from './ui/button';

type ShowcaseCategory = {
  name: string;
  image: string;
  gender?: 'women' | 'men';
  category?: string;
  /** When set, navigate here directly (e.g. /new-arrivals). */
  to?: string;
};

const FALLBACK_CATEGORIES: ShowcaseCategory[] = [
  {
    name: 'Women',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80',
    gender: 'women',
    category: 'women',
  },
  {
    name: 'Men',
    image:
      'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80',
    gender: 'men',
    category: 'men',
  },
  {
    name: 'Dresses',
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80',
    gender: 'women',
    category: 'dresses',
  },
  {
    name: 'New Arrivals',
    image:
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80',
    to: '/new-arrivals',
  },
  {
    name: 'Sale',
    image:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80',
    to: '/sale',
  },
];

function mapApiToShowcase(list: Category[]): ShowcaseCategory[] {
  return list
    .filter((c) => c.name && c.image)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((c) => ({
      name: c.name,
      image: c.image,
      category: c.slug || c.name,
      gender: c.gender === 'women' ? 'women' : c.gender === 'men' ? 'men' : undefined,
    }));
}

export function VideoShowcase() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ShowcaseCategory[]>(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await categoryService.list();
        const mapped = mapApiToShowcase(list || []);
        if (!cancelled && mapped.length > 0) {
          setCategories(mapped);
          setActiveIndex(0);
        }
      } catch {
        /* keep FALLBACK_CATEGORIES */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const goToCategory = useCallback(
    (c: ShowcaseCategory) => {
      if (c.to) {
        navigate(c.to);
        return;
      }
      const normalized = c.category?.toLowerCase();
      const isTopLevelGender = !!c.gender && normalized === c.gender;
      if (isTopLevelGender && c.gender) {
        navigate(`/category/${c.gender}`);
      } else if (c.gender && c.category) {
        navigate(`/category/${c.gender}/${c.category.toLowerCase()}`);
      } else if (c.gender) {
        navigate(`/category/${c.gender}`);
      } else if (c.category) {
        navigate(`/all-products?category=${encodeURIComponent(c.category)}`);
      }
    },
    [navigate],
  );

  useEffect(() => {
    if (categories.length <= 1) return;
    const t = setInterval(() => {
      setActiveIndex((i) => (i + 1) % categories.length);
    }, 6000);
    return () => clearInterval(t);
  }, [categories.length]);

  const displayList = categories;
  const bg =
    displayList[activeIndex % Math.max(displayList.length, 1)]?.image ??
    FALLBACK_CATEGORIES[0].image;

  return (
    <section className="relative h-screen w-full snap-start snap-always overflow-hidden bg-neutral-950">
      <div className="absolute inset-0">
        <motion.img
          key={bg}
          src={bg}
          alt=""
          className="h-full w-full object-cover"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: loading ? 0.85 : 1, scale: 1 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/75"
          aria-hidden
        />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-end pb-10 pt-24 sm:pb-14 md:pb-16">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center sm:mb-10"
          >
            <Button
              type="button"
              size="lg"
              onClick={() => navigate('/all-products')}
              className="h-12 min-w-[200px] gap-2 rounded-full bg-white px-8 text-base font-semibold tracking-wide text-neutral-900 shadow-lg hover:bg-white/95 sm:h-14 sm:min-w-[240px] sm:text-lg"
            >
              Explore Now
              <ArrowRight className="h-5 w-5" strokeWidth={2} />
            </Button>
          </motion.div>

          <div className="w-full overflow-x-auto overflow-y-visible pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex min-w-min justify-center gap-5 px-2 sm:gap-7 md:gap-8">
              {displayList.map((cat, index) => {
                const isActive =
                  index === activeIndex % Math.max(displayList.length, 1);
                return (
                <motion.button
                  key={`${cat.name}-${index}`}
                  type="button"
                  onClick={() => {
                    setActiveIndex(index);
                    goToCategory(cat);
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className="group flex shrink-0 flex-col items-center gap-2 rounded-2xl px-1 py-1 focus:outline-none"
                >
                  <span
                    className={`relative box-border h-16 w-16 overflow-hidden rounded-full transition-[border-color,box-shadow] duration-200 sm:h-[72px] sm:w-[72px] md:h-20 md:w-20 ${
                      isActive
                        ? 'border-[3px] border-white shadow-[0_0_0_1px_rgba(0,0,0,0.2),0_0_20px_rgba(255,255,255,0.5)]'
                        : 'border-2 border-white/50 shadow-lg group-focus-visible:border-white group-focus-visible:shadow-[0_0_0_2px_rgba(255,255,255,0.85)]'
                    }`}
                  >
                    <img
                      src={cat.image}
                      alt=""
                      className={`h-full w-full object-cover transition-opacity duration-200 ${
                        isActive ? 'brightness-[1.02]' : 'opacity-[0.92] hover:opacity-100'
                      }`}
                      loading="lazy"
                    />
                    {isActive ? (
                      <span
                        className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_0_0_2px_rgba(255,255,255,0.35)]"
                        aria-hidden
                      />
                    ) : null}
                  </span>
                  <span
                    className={`max-w-[5.5rem] text-center text-[11px] font-medium uppercase tracking-wider sm:max-w-[6rem] sm:text-xs ${
                      isActive ? 'text-white' : 'text-white/90'
                    }`}
                  >
                    {cat.name}
                  </span>
                </motion.button>
              );
              })}
            </div>
          </div>

          {displayList.length > 1 && (
            <div className="mt-6 flex justify-center gap-2">
              {displayList.map((c, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Show ${c.name}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
