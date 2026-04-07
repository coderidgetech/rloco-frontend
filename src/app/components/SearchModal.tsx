import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types/product';
import { ProductDetail } from './ProductDetail';
import { productService } from '../services/productService';
import { useCurrency } from '../context/CurrencyContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const RECENT_KEY = 'rloco_recent_searches_v1';
const MAX_RECENT = 10;

const TRENDING = [
  'Dresses',
  'Ethnic wear',
  'Sneakers',
  'Handbags',
  'Men shirts',
  'Winter jackets',
  'New arrivals',
  'Sale',
];

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function saveRecent(term: string) {
  const q = term.trim();
  if (!q) return;
  const prev = loadRecent().filter((x) => x.toLowerCase() !== q.toLowerCase());
  localStorage.setItem(RECENT_KEY, JSON.stringify([q, ...prev].slice(0, MAX_RECENT)));
}

export function SearchModal({ isOpen, onClose, initialQuery = '' }: SearchModalProps) {
  const navigate = useNavigate();
  const { formatPrice, market } = useCurrency();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 280);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;
    const q = debouncedQuery;
    if (q.length < 1) {
      setResults([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const response = await productService.list({ search: q, limit: 24, market });
        if (!cancelled) setResults((response.products || []).slice(0, 24));
      } catch (error) {
        console.error('Failed to fetch products:', error);
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isOpen, debouncedQuery, market]);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setDebouncedQuery('');
      setResults([]);
    } else {
      setRecent(loadRecent());
      const seed = (initialQuery ?? '').trim();
      if (seed) {
        setQuery(seed);
        setDebouncedQuery(seed);
      }
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen, initialQuery]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !selectedProduct) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, selectedProduct]);

  const goToResults = (q: string) => {
    const t = q.trim();
    if (t) saveRecent(t);
    const params = new URLSearchParams();
    params.set('from', 'search');
    params.set('q', t);
    navigate(`/all-products?${params.toString()}`);
    onClose();
  };

  const onPickRecentOrTrending = (term: string) => {
    setQuery(term);
    setDebouncedQuery(term.trim());
    goToResults(term);
  };

  const removeRecent = (term: string) => {
    const next = recent.filter((x) => x !== term);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    setRecent(next);
  };

  const showExplore = debouncedQuery.length < 1;
  const showResults = !showExplore;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[200] flex flex-col md:items-center md:justify-start md:pt-14 md:px-4 md:pb-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 hidden bg-black/50 md:block"
              onClick={onClose}
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative z-10 flex h-full max-h-[100dvh] w-full flex-col bg-background shadow-none md:mt-0 md:max-h-[min(680px,85vh)] md:max-w-2xl md:rounded-xl md:shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header — Myntra-style: back on mobile, search field */}
              <div
                className="flex shrink-0 items-center gap-2 border-b border-foreground/10 px-3 py-3 md:px-4"
                style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}
              >
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-10 w-10 shrink-0 items-center justify-center text-foreground md:hidden"
                  aria-label="Close search"
                >
                  <ChevronLeft size={24} strokeWidth={2} />
                </button>
                <div className="relative flex min-w-0 flex-1 items-center gap-2 rounded-md bg-muted/40 px-3 py-2 md:bg-muted/30">
                  <Search size={18} className="shrink-0 text-foreground/40" />
                  <input
                    ref={inputRef}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search"
                    enterKeyHint="search"
                    className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-foreground/40 md:text-sm"
                  />
                  {query ? (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="shrink-0 p-1 text-foreground/40 hover:text-foreground"
                      aria-label="Clear"
                    >
                      <X size={16} />
                    </button>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="hidden h-10 w-10 shrink-0 items-center justify-center text-foreground/60 hover:text-foreground md:flex"
                  aria-label="Close search"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                {showExplore && (
                  <div className="space-y-8">
                    {recent.length > 0 && (
                      <section>
                        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground/50">
                          Recent searches
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          {recent.map((term) => (
                            <div
                              key={term}
                              className="flex max-w-full items-center gap-1 rounded-full border border-foreground/15 bg-background pl-3 pr-1 py-1.5 text-sm text-foreground hover:border-foreground/30"
                            >
                              <button
                                type="button"
                                onClick={() => onPickRecentOrTrending(term)}
                                className="min-w-0 flex-1 truncate text-left"
                              >
                                {term}
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeRecent(term);
                                }}
                                className="shrink-0 rounded-full p-1.5 text-foreground/40 hover:bg-foreground/10 hover:text-foreground"
                                aria-label={`Remove ${term}`}
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                    <section>
                      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground/50">
                        Trending
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {TRENDING.map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => onPickRecentOrTrending(term)}
                            className="rounded-full border border-foreground/15 px-3 py-2 text-sm text-foreground hover:border-primary hover:text-primary"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </section>
                  </div>
                )}

                {showResults && (
                  <div className="space-y-4">
                    {loading ? (
                      <div className="flex flex-col items-center py-16 text-foreground/50">
                        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground/60" />
                        <p className="text-sm">Finding styles for you…</p>
                      </div>
                    ) : results.length === 0 ? (
                      <div className="py-16 text-center text-foreground/50">
                        <Search size={40} className="mx-auto mb-3 opacity-25" />
                        <p className="text-sm">No matches for &ldquo;{debouncedQuery}&rdquo;</p>
                        <button
                          type="button"
                          onClick={() => goToResults(debouncedQuery)}
                          className="mt-4 text-sm font-medium text-primary underline"
                        >
                          View all products
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs uppercase tracking-wider text-foreground/45">
                          Top matches
                        </p>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-2">
                          {results.map((product, index) => (
                            <motion.button
                              key={product.id}
                              type="button"
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.03 }}
                              onClick={() => {
                                if (debouncedQuery) saveRecent(debouncedQuery);
                                setSelectedProduct(product);
                              }}
                              className="flex flex-col overflow-hidden rounded-lg border border-foreground/10 bg-background text-left transition-colors hover:border-foreground/25"
                            >
                              <div className="aspect-[3/4] w-full overflow-hidden bg-muted">
                                <img
                                  src={product.images?.[0] || product.image || ''}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="p-2">
                                <p className="line-clamp-2 text-xs font-medium leading-snug text-foreground">
                                  {product.name}
                                </p>
                                <p className="mt-1 text-xs font-semibold text-foreground">
                                  {formatPrice(
                                    product.price,
                                    product.price_inr || (product as { priceINR?: number }).priceINR
                                  )}
                                </p>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => goToResults(debouncedQuery)}
                          className="w-full rounded-lg border border-foreground/20 py-3 text-center text-sm font-medium text-foreground hover:bg-foreground/5"
                        >
                          View all results
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ProductDetail
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
