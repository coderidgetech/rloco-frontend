import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { categoryService } from '../services/categoryService';
import type { Category } from '../types/api';

interface MegaMenuProps {
  isOpen: boolean;
  gender: 'women' | 'men';
  onClose: () => void;
  onCategoryClick?: (gender: 'women' | 'men', category?: string) => void;
}

const ACCENT = '#B4770E';

export function MegaMenu({ isOpen, gender, onClose, onCategoryClick }: MegaMenuProps) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const list = await categoryService.list();
        if (!cancelled) setCategories(list);
      } catch {
        if (!cancelled) setCategories([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const filtered = useMemo(() => {
    return categories
      .filter((c) => c.gender === gender || c.gender === 'unisex')
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [categories, gender]);

  const handleCategoryClick = (cat: Category) => {
    const seg = (cat.slug || cat.name || '').toLowerCase();
    if (!seg) return;
    if (onCategoryClick) {
      onCategoryClick(gender, seg);
    } else {
      navigate(`/category/${gender}/${seg}`);
    }
    onClose();
  };

  const handleViewAll = () => {
    if (onCategoryClick) {
      onCategoryClick(gender);
    } else {
      navigate(`/category/${gender}`);
    }
    onClose();
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="hidden md:block fixed inset-0 z-30"
            style={{
              top: '56px',
              left: 0,
              right: 0,
              background: 'radial-gradient(circle at center, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.7) 100%)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              pointerEvents: 'auto',
            }}
            onClick={onClose}
          />

          <motion.div
            key={gender}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed z-40 hidden w-full min-w-0 md:block"
            style={{
              top: '56px',
              left: 0,
              right: 0,
              maxHeight: 'min(42vh, 520px)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
              pointerEvents: 'auto',
            }}
            onMouseLeave={onClose}
          >
            <div className="w-full h-full overflow-y-auto px-6 md:px-12 lg:px-16 xl:px-20 py-5 md:py-6 flex flex-col">
              <div
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 pb-4"
                style={{ borderBottom: `1px solid rgba(180, 119, 14, 0.15)` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-1 h-8" style={{ backgroundColor: ACCENT }} />
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] font-semibold mb-0.5" style={{ color: ACCENT }}>
                      Premium Collection
                    </p>
                    <h2 className="text-xl md:text-2xl tracking-tight font-light text-black">
                      {gender === 'women' ? "Women's Luxury" : "Men's Luxury"}
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleViewAll}
                  className="px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] font-semibold border-2 transition-all duration-300 hover:bg-black hover:text-white hover:border-black shrink-0"
                  style={{ borderColor: ACCENT, color: ACCENT, backgroundColor: 'transparent' }}
                >
                  Explore All
                </button>
              </div>

              {loading ? (
                <div className="flex flex-1 min-h-[120px] items-center justify-center text-sm text-black/50">
                  Loading categories…
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-1 min-h-[120px] items-center justify-center text-sm text-black/50">
                  No categories available yet.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-5 xl:grid-cols-9 gap-3 md:gap-4 flex-1 min-h-0">
                  {filtered.map((cat, index) => (
                    <motion.button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryClick(cat)}
                      initial={{ opacity: 0, y: 30, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                      className="group relative text-left h-full"
                    >
                      <div
                        className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-2 shadow-md group-hover:shadow-2xl transition-all duration-700"
                        style={{ border: '1px solid rgba(0, 0, 0, 0.08)' }}
                      >
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt=""
                            className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-[1.15] group-hover:brightness-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-wider text-neutral-400">
                            {cat.name}
                          </div>
                        )}
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                          style={{
                            background:
                              'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 70%, rgba(180, 119, 14, 0.4) 100%)',
                          }}
                        />
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                          style={{ boxShadow: `inset 0 0 0 2px ${ACCENT}` }}
                        />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-100 scale-75">
                          <div
                            className="px-2 py-1 text-[8px] uppercase tracking-[0.2em] font-bold backdrop-blur-sm"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.95)',
                              color: ACCENT,
                              boxShadow: '0 2px 8px rgba(180, 119, 14, 0.3)',
                            }}
                          >
                            Shop
                          </div>
                        </div>
                        <div
                          className="absolute bottom-0 left-0 right-0 h-1.5 translate-y-1.5 group-hover:translate-y-0 transition-transform duration-500"
                          style={{ background: 'linear-gradient(90deg, #B4770E 0%, #D4A84E 50%, #B4770E 100%)' }}
                        />
                      </div>
                      <div className="space-y-1 px-0.5">
                        <h3 className="text-[10px] xl:text-[11px] uppercase tracking-[0.15em] font-semibold text-black/70 group-hover:text-[#B4770E] transition-all duration-300 text-center leading-tight group-hover:tracking-[0.2em]">
                          {cat.name}
                        </h3>
                        <div className="flex justify-center">
                          <div
                            className="h-[2px] w-0 group-hover:w-8 transition-all duration-700"
                            style={{
                              background: 'linear-gradient(90deg, transparent 0%, #B4770E 50%, transparent 100%)',
                            }}
                          />
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-4 flex items-center justify-center gap-2 text-center shrink-0"
              >
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-black/10" />
                <p className="text-[9px] uppercase tracking-[0.25em] font-semibold" style={{ color: ACCENT }}>
                  Handpicked for You
                </p>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-black/10" />
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
