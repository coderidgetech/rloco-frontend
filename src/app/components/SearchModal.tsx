import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, ChevronLeft, ChevronRight, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types/product';
import { productService } from '../services/productService';
import { useCurrency } from '../context/CurrencyContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const RECENT_KEY = 'rloco_recent_searches_v1';
const MAX_RECENT = 8;

const TRENDING = ['Dresses', 'Ethnic wear', 'Sneakers', 'Handbags', 'Men shirts', 'Winter jackets', 'New arrivals', 'Sale'];

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch { return []; }
}

function saveRecent(term: string) {
  const q = term.trim();
  if (!q) return;
  const prev = loadRecent().filter((x) => x.toLowerCase() !== q.toLowerCase());
  localStorage.setItem(RECENT_KEY, JSON.stringify([q, ...prev].slice(0, MAX_RECENT)));
}

function clearRecent() {
  localStorage.removeItem(RECENT_KEY);
}

export function SearchModal({ isOpen, onClose, initialQuery = '' }: SearchModalProps) {
  const navigate = useNavigate();
  const { formatPrice, market } = useCurrency();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  // Fetch results
  useEffect(() => {
    if (!isOpen) return;
    const q = debouncedQuery;
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      setHasError(false);
      setActiveCategory('All');
      return;
    }
    const controller = new AbortController();
    (async () => {
      setLoading(true);
      setHasError(false);
      setActiveCategory('All');
      try {
        const response = await productService.list({ search: q, limit: 30, market });
        if (!controller.signal.aborted) setResults(response.products || []);
      } catch (err) {
        if (!controller.signal.aborted) { setResults([]); setHasError(true); }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();
    return () => controller.abort();
  }, [isOpen, debouncedQuery, market]);

  // Reset on open/close
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setDebouncedQuery('');
      setResults([]);
      setHasError(false);
    } else {
      setRecent(loadRecent());
      const seed = (initialQuery ?? '').trim();
      if (seed) { setQuery(seed); setDebouncedQuery(seed); }
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen, initialQuery]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const goToResults = (q: string) => {
    const t = q.trim();
    if (t) saveRecent(t);
    navigate(`/all-products?from=search&q=${encodeURIComponent(t)}`);
    onClose();
  };

  const goToProduct = (product: Product) => {
    if (debouncedQuery) saveRecent(debouncedQuery);
    navigate(`/product/${product.id}`);
    onClose();
  };

  const onPickSuggestion = (term: string) => {
    setQuery(term);
    setDebouncedQuery(term.trim());
    goToResults(term);
  };

  const handleClearAll = () => {
    clearRecent();
    setRecent([]);
  };

  const removeRecent = (term: string) => {
    const next = recent.filter((x) => x !== term);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    setRecent(next);
  };

  // Category chips from results
  const categories = useMemo(() => {
    const cats = [...new Set(results.map((r) => r.category).filter(Boolean))];
    return cats.slice(0, 6);
  }, [results]);

  const filtered = activeCategory === 'All' ? results : results.filter((r) => r.category === activeCategory);

  const showExplore = debouncedQuery.length < 2;
  const showResults = !showExplore;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col md:items-center md:justify-start md:pt-14 md:px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 hidden md:block"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="relative z-10 flex h-full max-h-[100dvh] w-full flex-col bg-background md:max-h-[min(640px,88vh)] md:max-w-xl md:rounded-2xl md:shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search bar */}
            <div
              className="flex shrink-0 items-center gap-2 px-3 py-3 md:px-4"
              style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
            >
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center text-foreground md:hidden"
                aria-label="Back"
              >
                <ChevronLeft size={22} strokeWidth={2} />
              </button>

              <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl bg-muted/50 px-3 py-2.5 ring-1 ring-transparent focus-within:ring-foreground/20 transition-all">
                <Search size={16} className="shrink-0 text-foreground/40" />
                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && query.trim()) goToResults(query); }}
                  placeholder="Search products, styles, brands…"
                  enterKeyHint="search"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-foreground/35"
                />
                {query && (
                  <button type="button" onClick={() => setQuery('')} className="shrink-0 text-foreground/40 hover:text-foreground transition-colors">
                    <X size={15} />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full text-foreground/50 hover:bg-muted hover:text-foreground transition-colors md:flex"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-foreground/8 shrink-0" />

            {/* Body */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[max(1rem,env(safe-area-inset-bottom))]">

              {/* ── Explore state ── */}
              {showExplore && (
                <div className="px-4 py-4 space-y-6">
                  {recent.length > 0 && (
                    <section>
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-foreground/40">Recent</h2>
                        <button
                          type="button"
                          onClick={handleClearAll}
                          className="text-[11px] text-foreground/40 hover:text-foreground transition-colors"
                        >
                          Clear all
                        </button>
                      </div>
                      <div className="space-y-0.5">
                        {recent.map((term) => (
                          <div key={term} className="group flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-muted/50 transition-colors">
                            <Clock size={14} className="shrink-0 text-foreground/30" />
                            <button
                              type="button"
                              onClick={() => onPickSuggestion(term)}
                              className="min-w-0 flex-1 text-left text-sm text-foreground/80 truncate"
                            >
                              {term}
                            </button>
                            <button
                              type="button"
                              onClick={() => removeRecent(term)}
                              className="shrink-0 opacity-0 group-hover:opacity-100 text-foreground/30 hover:text-foreground transition-all"
                              aria-label={`Remove ${term}`}
                            >
                              <X size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  <section>
                    <div className="flex items-center gap-1.5 mb-3">
                      <TrendingUp size={12} className="text-foreground/40" />
                      <h2 className="text-[11px] font-semibold uppercase tracking-widest text-foreground/40">Trending</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => onPickSuggestion(term)}
                          className="rounded-full border border-foreground/12 bg-muted/30 px-3 py-1.5 text-sm text-foreground/70 hover:border-foreground/30 hover:text-foreground hover:bg-muted transition-all"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {/* ── Results state ── */}
              {showResults && (
                <div>
                  {/* Loading skeleton */}
                  {loading && (
                    <div className="px-4 py-3 space-y-1">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 px-2 py-2.5 animate-pulse">
                          <div className="w-11 h-13 rounded-lg bg-muted shrink-0" style={{ height: 52 }} />
                          <div className="flex-1 space-y-1.5">
                            <div className="h-3 bg-muted rounded w-1/3" />
                            <div className="h-3.5 bg-muted rounded w-3/4" />
                            <div className="h-3 bg-muted rounded w-1/4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Error */}
                  {!loading && hasError && (
                    <div className="flex flex-col items-center py-16 text-center text-foreground/50 px-4">
                      <Search size={36} className="mb-3 opacity-20" />
                      <p className="text-sm">Something went wrong.</p>
                      <button type="button" onClick={() => setQuery('')} className="mt-3 text-sm font-medium text-primary">
                        Clear search
                      </button>
                    </div>
                  )}

                  {/* No results */}
                  {!loading && !hasError && results.length === 0 && (
                    <div className="flex flex-col items-center py-16 text-center text-foreground/50 px-4">
                      <Search size={36} className="mb-3 opacity-20" />
                      <p className="text-sm font-medium text-foreground/70 mb-1">No results for &ldquo;{debouncedQuery}&rdquo;</p>
                      <p className="text-xs text-foreground/40 mb-4">Try different keywords or browse categories</p>
                      <button
                        type="button"
                        onClick={() => goToResults(debouncedQuery)}
                        className="flex items-center gap-1.5 text-sm font-medium text-primary"
                      >
                        Browse all products <ArrowRight size={14} />
                      </button>
                    </div>
                  )}

                  {/* Results */}
                  {!loading && !hasError && results.length > 0 && (
                    <>
                      {/* Summary + category chips */}
                      <div className="px-4 pt-3 pb-2">
                        <p className="text-[11px] text-foreground/40 uppercase tracking-wider mb-2.5">
                          {results.length} results for &ldquo;{debouncedQuery}&rdquo;
                        </p>
                        {categories.length > 1 && (
                          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-0.5">
                            {['All', ...categories].map((cat) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => setActiveCategory(cat)}
                                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                                  activeCategory === cat
                                    ? 'bg-foreground text-background'
                                    : 'bg-muted/50 text-foreground/60 hover:bg-muted hover:text-foreground'
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* List */}
                      <div className="px-2">
                        {filtered.map((product, index) => (
                          <motion.button
                            key={product.id}
                            type="button"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.025, duration: 0.2 }}
                            onClick={() => goToProduct(product)}
                            className="group w-full flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-muted/50 transition-colors text-left"
                          >
                            {/* Thumbnail */}
                            <div className="w-11 shrink-0 overflow-hidden rounded-lg bg-muted" style={{ height: 52 }}>
                              <img
                                src={product.images?.[0] || product.image || ''}
                                alt={product.name}
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            </div>

                            {/* Info */}
                            <div className="min-w-0 flex-1">
                              {product.category && (
                                <p className="text-[10px] uppercase tracking-wider text-foreground/40 mb-0.5">{product.category}</p>
                              )}
                              <p className="text-sm font-medium text-foreground truncate leading-snug">{product.name}</p>
                              <p className="text-sm text-foreground/60 mt-0.5">
                                {formatPrice(product.price, product.price_inr || product.priceINR)}
                                {(product.on_sale || (product as { onSale?: boolean }).onSale) && (
                                  <span className="ml-2 text-[10px] font-semibold uppercase text-red-500">Sale</span>
                                )}
                              </p>
                            </div>

                            <ChevronRight size={14} className="shrink-0 text-foreground/20 group-hover:text-foreground/50 transition-colors" />
                          </motion.button>
                        ))}
                      </div>

                      {/* See all */}
                      <div className="px-4 pt-2 pb-2">
                        <button
                          type="button"
                          onClick={() => goToResults(debouncedQuery)}
                          className="group flex w-full items-center justify-between rounded-xl border border-foreground/10 px-4 py-3 text-sm font-medium text-foreground/70 hover:border-foreground/25 hover:text-foreground transition-all"
                        >
                          <span>See all results for &ldquo;{debouncedQuery}&rdquo;</span>
                          <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
