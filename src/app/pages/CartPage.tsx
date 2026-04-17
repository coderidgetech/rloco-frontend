import { motion, AnimatePresence } from 'motion/react';
import {
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RefreshCw,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  MapPin,
  Gift,
  X,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useUser } from '../context/UserContext';
import { useOrder } from '../context/OrderContext';
import { useWishlist } from '../context/WishlistContext';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import { toast } from 'sonner';
import { getApiErrorMessage } from '../lib/apiErrors';
import { useFeaturedProducts, useProducts } from '../hooks/useProducts';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { promotionService } from '../services/promotionService';
import { productService } from '../services/productService';
import { Promotion, Product } from '../types/api';
import { PH } from '../lib/formPlaceholders';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { CheckoutStepper } from '../components/CheckoutStepper';
import { cn } from '../components/ui/utils';

/** Matches RLOKO cart design (gold accent) */
const GOLD = '#B8860B';
const GOLD_HOVER = '#9a7310';
/** Keep in sync with CartContext GIFT_PACKING_PER_ITEM */
const GIFT_PACKING_PER_ITEM_INR = 50;

function cartItemKey(id: string | number, size: string) {
  return `${String(id)}::${size}`;
}

function parseCartItemKey(key: string): { id: string | number; size: string } {
  const i = key.indexOf('::');
  if (i === -1) return { id: key, size: '' };
  return { id: key.slice(0, i), size: key.slice(i + 2) };
}

function isValidProductId(id: string | number): boolean {
  return /^[0-9a-fA-F]{24}$/.test(String(id).trim());
}

function colorSwatchCss(name: string): string {
  const n = name.toLowerCase().replace(/\s+/g, '');
  const map: Record<string, string> = {
    red: '#ef4444',
    navy: '#1e3a5f',
    gold: '#d4af37',
    silver: '#94a3b8',
    black: '#171717',
    white: '#fafafa',
    blue: '#2563eb',
    green: '#16a34a',
    pink: '#ec4899',
    purple: '#9333ea',
    beige: '#d4c4a8',
    brown: '#78350f',
    grey: '#64748b',
    gray: '#64748b',
    maroon: '#7f1d1d',
    olive: '#3f6212',
    yellow: '#eab308',
    orange: '#ea580c',
  };
  return map[n] ?? '#e5e5e5';
}

export function CartPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isAuthenticated } = useUser();
  const { selectedAddress, donationAmount, setDonationAmount } = useOrder();
  const { addToWishlist } = useWishlist();
  const { items, removeFromCart, updateQuantity, updateGiftOptions, addToCart } = useCart();
  const { formatPrice, formatAmount, convertPrice, currency, market } = useCurrency();
  const [giftMessageDrafts, setGiftMessageDrafts] = useState<Record<string, string>>({});
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; promotion?: Promotion } | null>(
    null
  );
  const [availablePromotions, setAvailablePromotions] = useState<Promotion[]>([]);
  const [loadingPromotions, setLoadingPromotions] = useState(false);
  const [offersOpen, setOffersOpen] = useState(true);
  const [productMap, setProductMap] = useState<Record<string, Product | null>>({});
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [removeDialog, setRemoveDialog] = useState<{ mode: 'one' | 'bulk'; key?: string } | null>(null);
  const [donatePledge, setDonatePledge] = useState(false);
  const selectAllRef = useRef<HTMLInputElement>(null);

  const { products: featuredProducts } = useFeaturedProducts(12);
  const { products: trendingProducts } = useProducts({ limit: 8, sort: 'newest' });

  const trendingRow = useMemo(() => {
    const t = trendingProducts || [];
    return t.filter((p) => !items.some((item) => String(item.id) === String(p.id))).slice(0, 4);
  }, [trendingProducts, items]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAvailablePromotions();
  }, []);

  useEffect(() => {
    if (donationAmount > 0) setDonatePledge(true);
  }, []);

  useEffect(() => {
    const ids = [...new Set(items.map((i) => String(i.id)).filter(isValidProductId))];
    if (ids.length === 0) {
      setProductMap({});
      return;
    }
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        ids.map(async (id) => {
          try {
            const p = await productService.getById(id, { market });
            return [id, p] as const;
          } catch {
            return [id, null] as const;
          }
        })
      );
      if (!cancelled) {
        setProductMap(Object.fromEntries(entries));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [items, market]);

  useEffect(() => {
    setSelectedItems((prev) => {
      const valid = new Set(items.map((i) => cartItemKey(i.id, i.size)));
      const next = new Set<string>();
      prev.forEach((k) => {
        if (valid.has(k)) next.add(k);
      });
      valid.forEach((k) => {
        if (!prev.has(k)) next.add(k);
      });
      return next;
    });
  }, [items]);

  const fetchAvailablePromotions = async () => {
    try {
      setLoadingPromotions(true);
      const promotions = await promotionService.list();
      const list = Array.isArray(promotions) ? promotions : [];
      const now = new Date();
      const activePromotions = list.filter((p) => {
        if (!p?.start_date || !p?.end_date) return false;
        const startDate = new Date(p.start_date);
        const endDate = new Date(p.end_date);
        return p.is_active && now >= startDate && now <= endDate;
      });
      setAvailablePromotions(activePromotions);
    } catch (error) {
      console.error('Failed to fetch promotions:', error);
      setAvailablePromotions([]);
    } finally {
      setLoadingPromotions(false);
    }
  };

  const selectedLineItems = useMemo(
    () => items.filter((item) => selectedItems.has(cartItemKey(item.id, item.size))),
    [items, selectedItems]
  );

  const subtotal = useMemo(() => {
    return selectedLineItems.reduce((sum, item) => {
      const itemPrice = convertPrice(item.price, (item as { priceINR?: number }).priceINR);
      return sum + itemPrice * item.quantity;
    }, 0);
  }, [selectedLineItems, convertPrice]);

  const totalMRP = useMemo(() => {
    return selectedLineItems.reduce((sum, item) => {
      const p = productMap[String(item.id)];
      const unit =
        p?.original_price != null && p.original_price > 0
          ? convertPrice(p.original_price, p.original_price_inr)
          : convertPrice(item.price, (item as { priceINR?: number }).priceINR);
      return sum + unit * item.quantity;
    }, 0);
  }, [selectedLineItems, productMap, convertPrice]);

  const savingsOnMRP = Math.max(0, totalMRP - subtotal);

  const discount = Math.min(
    appliedCoupon && appliedCoupon.promotion
      ? appliedCoupon.promotion.type === 'percentage'
        ? Math.min(
            (subtotal * appliedCoupon.promotion.value) / 100,
            appliedCoupon.promotion.max_discount ?? Infinity
          )
        : appliedCoupon.promotion.type === 'fixed'
          ? appliedCoupon.promotion.value
          : 0
      : appliedCoupon
        ? (subtotal * appliedCoupon.discount) / 100
        : 0,
    subtotal
  );

  const shippingThreshold = currency === 'USD' ? 200 : 15000;
  const shippingCost = currency === 'USD' ? 15 : 1125;
  const hasSelection = selectedLineItems.length > 0;
  const shipping =
    !hasSelection
      ? 0
      : appliedCoupon?.promotion?.type === 'free_shipping' || appliedCoupon?.code === 'FREESHIP'
        ? 0
        : subtotal > shippingThreshold
          ? 0
          : shippingCost;
  const tax = hasSelection ? (subtotal - discount) * 0.08 : 0;

  const selectedGiftPackingChargeINR = useMemo(
    () =>
      selectedLineItems.reduce(
        (sum, item) => sum + (item.isGift ? item.quantity * GIFT_PACKING_PER_ITEM_INR : 0),
        0
      ),
    [selectedLineItems]
  );
  const giftPackingDisplay = !hasSelection
    ? 0
    : currency === 'INR'
      ? selectedGiftPackingChargeINR
      : selectedGiftPackingChargeINR / 75;
  /** Design: single “Platform fee” line = tax + shipping + gift packing */
  const platformFeeBundle = tax + shipping + giftPackingDisplay;
  const finalTotal = Math.max(
    0,
    subtotal - discount + platformFeeBundle + donationAmount
  );

  const deliveryByDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  })();

  const selectedCount = selectedItems.size;
  const allSelected = items.length > 0 && selectedCount === items.length;

  useEffect(() => {
    const el = selectAllRef.current;
    if (!el) return;
    el.indeterminate = selectedCount > 0 && selectedCount < items.length;
  }, [selectedCount, items.length]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a promotion code');
      return;
    }
    try {
      const result = await promotionService.validate(couponCode.trim().toUpperCase(), subtotal);
      if (result.promotion) {
        let discountAmount = 0;
        if (result.promotion.type === 'percentage') {
          discountAmount = (subtotal * result.promotion.value) / 100;
          if (result.promotion.max_discount) {
            discountAmount = Math.min(discountAmount, result.promotion.max_discount);
          }
        } else if (result.promotion.type === 'fixed') {
          discountAmount = result.promotion.value;
        } else if (result.promotion.type === 'free_shipping') {
          discountAmount = 0;
        }
        setAppliedCoupon({
          code: result.promotion.code,
          discount:
            result.promotion.type === 'percentage'
              ? result.promotion.value
              : (discountAmount / subtotal) * 100,
          promotion: result.promotion,
        });
        toast.success(`Promotion "${result.promotion.code}" applied successfully!`);
        setCouponCode('');
      } else {
        toast.error('Invalid or expired promotion code');
        setAppliedCoupon(null);
      }
    } catch (error: unknown) {
      console.error('Failed to validate promotion:', error);
      toast.error(getApiErrorMessage(error, 'Failed to validate promotion code'));
      setAppliedCoupon(null);
    }
  };

  const handleRemovePromotion = () => {
    setAppliedCoupon(null);
    toast.info('Coupon removed');
  };

  const recommendedProducts = (featuredProducts || [])
    .filter((p) => !items.some((item) => String(item.id) === String(p.id)))
    .slice(0, 4);

  const completeTheLook = (featuredProducts || [])
    .filter((p) => !items.some((item) => String(item.id) === String(p.id)))
    .slice(4, 8);

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    if (selectedItems.size === 0) {
      toast.error('Select at least one item to place order');
      return;
    }
    if (!isAuthenticated) {
      navigate('/login?redirect=/address-selection');
      return;
    }
    navigate('/address-selection');
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map((i) => cartItemKey(i.id, i.size))));
    }
  };

  const toggleLine = (key: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSizeChange = async (item: (typeof items)[0], newSize: string) => {
    if (newSize === item.size) return;
    const dup = items.find((i) => String(i.id) === String(item.id) && i.size === newSize);
    if (dup) {
      toast.error('This size is already in your bag');
      return;
    }
    await removeFromCart(item.id, item.size);
    await addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      priceINR: (item as { priceINR?: number }).priceINR,
      image: item.image,
      size: newSize,
      quantity: item.quantity,
      isGift: item.isGift,
      giftWrapColor: item.giftWrapColor,
      giftMessage: item.giftMessage,
    });
    toast.success(`Size updated to ${newSize}`);
  };

  const confirmRemoveAction = async () => {
    if (!removeDialog) return;
    if (removeDialog.mode === 'one' && removeDialog.key) {
      const { id, size } = parseCartItemKey(removeDialog.key);
      await removeFromCart(id, size);
      toast.success('Removed from bag');
    } else if (removeDialog.mode === 'bulk') {
      for (const key of selectedItems) {
        const { id, size } = parseCartItemKey(key);
        await removeFromCart(id, size);
      }
      toast.success('Selected items removed');
      setSelectedItems(new Set());
    }
    setRemoveDialog(null);
  };

  const handleMoveSelectedToWishlist = async () => {
    if (selectedItems.size === 0) {
      toast.error('Select items to move');
      return;
    }
    if (!isAuthenticated) {
      navigate('/login?redirect=/cart');
      return;
    }
    const keys = [...selectedItems];
    for (const key of keys) {
      const item = items.find((i) => cartItemKey(i.id, i.size) === key);
      if (!item) continue;
      const p = productMap[String(item.id)];
      await addToWishlist({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: p?.category ?? 'General',
        gender: p?.gender ?? 'unisex',
        colors: p?.colors,
      });
      await removeFromCart(item.id, item.size);
    }
    toast.success('Moved to wishlist');
    setSelectedItems(new Set());
  };

  const donationPresets = currency === 'USD' ? [10, 20, 50, 100] : [99, 199, 499, 999];

  const couponHints =
    availablePromotions.length > 0
      ? availablePromotions
          .slice(0, 3)
          .map((p) => p.code)
          .join(', ')
      : 'RLOCO10, SAVE20, WELCOME15';

  return (
    <div className="min-h-screen w-full min-w-0 bg-muted/20 pt-page-nav pb-mobile-nav dark:bg-background">
      <div className="bg-background border-b border-border shadow-sm">
        <div className="page-container py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 min-w-0">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-muted rounded-full transition-colors mr-2 shrink-0"
                aria-label="Back"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <ShoppingBag className="text-primary" size={16} />
              </div>
              <h1 className="text-lg md:text-xl font-medium truncate">Your Bag</h1>
            </div>
          </div>
          <CheckoutStepper activeStep="bag" />
        </div>
      </div>

      <div
        className={cn(
          'page-container-lg py-4 md:py-8',
          items.length > 0 && isMobile && 'pb-28'
        )}
      >
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 md:py-24">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted flex items-center justify-center mb-6"
            >
              <ShoppingBag size={56} className="text-muted-foreground" />
            </motion.div>
            <h2 className="text-xl md:text-2xl font-medium mb-2">Your bag is empty</h2>
            <p className="text-sm text-muted-foreground mb-8 max-w-md px-4">
              Add something you love — your picks will show up here.
            </p>
            <Button onClick={() => navigate('/')} className="gap-2">
              Start shopping
              <ArrowRight size={18} />
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_min(100%,400px)] gap-6 lg:gap-8 xl:gap-10 items-start">
            <div className="space-y-4 md:space-y-5 min-w-0">
              {/* Delivery */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 md:p-5 rounded-lg bg-white border border-neutral-200 shadow-sm dark:border-border dark:bg-card">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-neutral-100 dark:bg-muted">
                  <MapPin className="text-neutral-700 dark:text-foreground" size={22} style={{ color: GOLD }} />
                </div>
                <div className="flex-1 min-w-0 text-sm">
                  {selectedAddress ? (
                    <>
                      <p className="font-medium text-neutral-900 dark:text-foreground">
                        Deliver to: {selectedAddress.name}, {selectedAddress.pincode}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-muted-foreground mt-0.5 line-clamp-2">
                        {selectedAddress.addressLine}, {selectedAddress.city}, {selectedAddress.state}
                      </p>
                    </>
                  ) : (
                    <p className="text-neutral-600 dark:text-muted-foreground">Add a delivery address to continue.</p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="shrink-0 uppercase text-[11px] font-bold tracking-wide border-2 bg-white hover:bg-amber-50/50 dark:bg-transparent dark:hover:bg-transparent"
                  style={{ borderColor: GOLD, color: GOLD }}
                  onClick={() => navigate('/address-selection')}
                >
                  {selectedAddress ? 'CHANGE ADDRESS' : 'ADD ADDRESS'}
                </Button>
              </div>

              {/* Offers */}
              <div className="rounded-lg border border-neutral-200 bg-white overflow-hidden shadow-sm dark:border-border dark:bg-card">
                <button
                  type="button"
                  onClick={() => setOffersOpen((o) => !o)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-neutral-50/80 transition-colors dark:hover:bg-muted/30"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-foreground">
                    <Gift size={18} style={{ color: GOLD }} />
                    Available Offers
                  </span>
                  {offersOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                <AnimatePresence initial={false}>
                  {offersOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-neutral-200 dark:border-border"
                    >
                      <div className="p-4 flex flex-wrap gap-2">
                        {availablePromotions.length === 0 ? (
                          <p className="text-xs text-muted-foreground">No offers available right now.</p>
                        ) : (
                          availablePromotions.slice(0, 8).map((promo) => (
                            <button
                              key={promo.id}
                              type="button"
                              onClick={() => setCouponCode(promo.code)}
                              className="px-3 py-1.5 text-xs rounded-md border border-neutral-200 bg-neutral-50 hover:border-[#B8860B]/50 transition-colors dark:border-border dark:bg-background"
                            >
                              {promo.code}
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Toolbar */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-3 px-4 rounded-lg bg-white border border-neutral-200 shadow-sm dark:border-border dark:bg-card">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="size-4 rounded border-neutral-300"
                    style={{ accentColor: GOLD }}
                  />
                  <span className="text-[11px] font-bold uppercase tracking-wide text-neutral-800 dark:text-foreground">
                    {selectedCount}/{items.length} ITEMS SELECTED
                  </span>
                </label>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <button
                    type="button"
                    disabled={selectedCount === 0}
                    onClick={() => selectedCount && setRemoveDialog({ mode: 'bulk' })}
                    className="text-[11px] font-bold uppercase tracking-wide disabled:opacity-40 hover:underline"
                    style={{ color: GOLD }}
                  >
                    REMOVE
                  </button>
                  <button
                    type="button"
                    disabled={selectedCount === 0}
                    onClick={handleMoveSelectedToWishlist}
                    className="text-[11px] font-bold uppercase tracking-wide disabled:opacity-40 hover:underline"
                    style={{ color: GOLD }}
                  >
                    MOVE TO WISHLIST
                  </button>
                </div>
              </div>

              {/* Line items */}
              <AnimatePresence mode="popLayout">
                {items.map((item, index) => {
                  const key = cartItemKey(item.id, item.size);
                  const p = productMap[String(item.id)];
                  const baseSizes = p?.sizes?.length ? [...p.sizes] : item.size ? [item.size] : ['One size'];
                  const sizeOptions = item.size && !baseSizes.includes(item.size) ? [...baseSizes, item.size] : baseSizes;
                  return (
                    <motion.div
                      key={key}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="rounded-lg bg-white dark:bg-card border border-neutral-200 p-4 md:p-5 shadow-sm dark:border-border"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:gap-5">
                        <div className="flex gap-3 md:gap-4 flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={selectedItems.has(key)}
                            onChange={() => toggleLine(key)}
                            className="mt-1 size-4 rounded border-neutral-300 shrink-0"
                            style={{ accentColor: GOLD }}
                            aria-label={`Select ${item.name}`}
                          />
                          <button
                            type="button"
                            onClick={() => navigate(`/product/${item.id}`)}
                            className="w-[104px] h-[132px] md:w-[120px] md:h-[152px] rounded-lg overflow-hidden bg-muted shrink-0 ring-1 ring-black/5"
                          >
                            <img
                              src={item.image}
                              alt=""
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </button>
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 pr-2">
                                <button
                                  type="button"
                                  onClick={() => navigate(`/product/${item.id}`)}
                                  className="font-semibold text-sm md:text-base text-left line-clamp-2 hover:text-primary transition-colors leading-snug"
                                >
                                  {item.name}
                                </button>
                                <p className="text-[11px] text-neutral-600 dark:text-muted-foreground mt-1">
                                  Sold by: RLOCO APPARELS
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => setRemoveDialog({ mode: 'one', key })}
                                className="p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive shrink-0 md:hidden"
                                aria-label="Remove item"
                              >
                                <X size={18} />
                              </button>
                            </div>

                            <div className="flex flex-wrap items-end gap-3 md:gap-4">
                              <div>
                                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                                  Size
                                </label>
                                <select
                                  value={item.size}
                                  onChange={(e) => handleSizeChange(item, e.target.value)}
                                  className="text-sm border border-border rounded-md px-2.5 py-1.5 bg-background min-w-[5rem] shadow-sm"
                                >
                                  {sizeOptions.map((s) => (
                                    <option key={s} value={s}>
                                      {s}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              {p?.colors && p.colors.length > 0 && (
                                <div>
                                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                                    Color
                                  </span>
                                  <div className="flex flex-wrap gap-1.5">
                                    <span
                                      title={p.colors[0]}
                                      className="size-7 rounded-full border-2 border-white shadow-md ring-1 ring-border"
                                      style={{ background: colorSwatchCss(p.colors[0]) }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 md:hidden">
                              <div>
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                                  Qty
                                </span>
                                <div className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-50 p-0.5 dark:border-border dark:bg-muted/40">
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                                  className="p-2 rounded-md hover:bg-background disabled:opacity-40"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="min-w-[2rem] text-center text-sm font-semibold tabular-nums">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                  className="p-2 rounded-md hover:bg-background"
                                >
                                  <Plus size={14} />
                                </button>
                                </div>
                              </div>
                              <div className="text-right">
                                {p?.original_price != null && p.original_price > item.price && (
                                    <p className="text-xs text-muted-foreground line-through">
                                      {formatPrice(p.original_price, p.original_price_inr)}
                                    </p>
                                  )}
                                <p className="font-semibold">
                                  {formatPrice(item.price, (item as { priceINR?: number }).priceINR)}
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                  Line{' '}
                                  {formatAmount(
                                    convertPrice(item.price, (item as { priceINR?: number }).priceINR) *
                                      item.quantity
                                  )}
                                </p>
                              </div>
                            </div>

                            <p className="text-[11px] text-neutral-600 dark:text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 pt-1">
                              <span className="inline-flex items-center gap-1">
                                <Clock size={12} className="shrink-0" />
                                7 days return available
                              </span>
                              <span className="inline-flex items-center gap-1 text-green-700 dark:text-green-400">
                                <CheckCircle2 size={12} className="shrink-0" />
                                Delivery by {deliveryByDate}
                              </span>
                            </p>

                          {item.isGift && (
                            <div className="mt-3 pt-3 border-t border-border space-y-2">
                              <p className="text-xs font-medium flex items-center gap-1.5 text-muted-foreground">
                                <Gift size={14} /> Gift options
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {['Gold', 'Silver', 'Red', 'Navy'].map((color) => (
                                  <button
                                    key={color}
                                    type="button"
                                    onClick={() => updateGiftOptions(item.id, item.size, color, item.giftMessage ?? '')}
                                    className={cn(
                                      'px-2.5 py-1 rounded-md text-xs border transition-colors',
                                      (item.giftWrapColor ?? 'Gold') === color
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-border hover:border-primary/50'
                                    )}
                                  >
                                    {color}
                                  </button>
                                ))}
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground block mb-1">Gift message (optional)</label>
                                <textarea
                                  placeholder={PH.giftMessage}
                                  value={giftMessageDrafts[key] ?? item.giftMessage ?? ''}
                                  onChange={(e) =>
                                    setGiftMessageDrafts((prev) => ({ ...prev, [key]: e.target.value }))
                                  }
                                  onBlur={(e) => {
                                    const msg = e.target.value;
                                    updateGiftOptions(item.id, item.size, item.giftWrapColor ?? 'Gold', msg);
                                    setGiftMessageDrafts((prev) => {
                                      const next = { ...prev };
                                      delete next[key];
                                      return next;
                                    });
                                  }}
                                  className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg resize-none"
                                  rows={2}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Desktop: price column */}
                      <div className="hidden md:flex flex-col items-end justify-start gap-3 shrink-0 min-w-[176px] border-t md:border-t-0 md:border-l border-border/60 md:pl-6 pt-4 md:pt-0">
                        <button
                          type="button"
                          onClick={() => setRemoveDialog({ mode: 'one', key })}
                          className="p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                          aria-label="Remove item"
                        >
                          <X size={18} />
                        </button>
                        <div className="text-right space-y-0.5">
                          {p?.original_price != null && p.original_price > item.price && (
                            <p className="text-sm text-muted-foreground line-through">
                              {formatPrice(p.original_price, p.original_price_inr)}
                            </p>
                          )}
                          <p className="text-lg font-semibold tabular-nums">
                            {formatPrice(item.price, (item as { priceINR?: number }).priceINR)}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            Line{' '}
                            {formatAmount(
                              convertPrice(item.price, (item as { priceINR?: number }).priceINR) * item.quantity
                            )}
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-1 text-right">
                            Qty
                          </span>
                          <div className="flex items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-50 p-0.5 dark:border-border dark:bg-muted/40">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                              className="p-2 rounded-md hover:bg-background disabled:opacity-40"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="min-w-[2rem] text-center text-sm font-semibold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                              className="p-2 rounded-md hover:bg-background"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Recommendations */}
              {recommendedProducts.length > 0 && (
                <div className="pt-8 border-t border-border/80">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
                    You may also like
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {recommendedProducts.map((product) => (
                      <motion.button
                        type="button"
                        key={product.id}
                        whileHover={{ y: -2 }}
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="text-left group"
                      >
                        <div className="aspect-[3/4] rounded-lg overflow-hidden mb-2 bg-muted">
                          <img
                            src={product.images?.[0] || ''}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <p className="font-medium text-sm line-clamp-2">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{formatPrice(product.price, product.price_inr)}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {completeTheLook.length > 0 && (
                <div className="pt-8 border-t border-border/80">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
                    Complete the look
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {completeTheLook.map((product) => (
                      <motion.button
                        type="button"
                        key={product.id}
                        whileHover={{ y: -2 }}
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="text-left group"
                      >
                        <div className="aspect-[3/4] rounded-lg overflow-hidden mb-2 bg-muted">
                          <img
                            src={product.images?.[0] || ''}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <p className="font-medium text-sm line-clamp-2">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{formatPrice(product.price, product.price_inr)}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {trendingRow.length > 0 && (
                <div className="pt-8 border-t border-border/80">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
                    Trending
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {trendingRow.map((product) => (
                      <motion.button
                        type="button"
                        key={product.id}
                        whileHover={{ y: -2 }}
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="text-left group"
                      >
                        <div className="aspect-[3/4] rounded-lg overflow-hidden mb-2 bg-muted">
                          <img
                            src={product.images?.[0] || ''}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <p className="font-medium text-sm line-clamp-2">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{formatPrice(product.price, product.price_inr)}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            <aside className={cn('lg:sticky lg:top-24 space-y-4', isMobile && 'hidden')}>
              <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-border dark:bg-card">
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-800 dark:text-foreground mb-4">
                  COUPONS
                </h3>
                <div className="flex gap-2 mb-2">
                  <div className="relative flex-1">
                    <Tag
                      className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none"
                      strokeWidth={2}
                    />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-neutral-200 rounded-lg outline-none focus:border-[#B8860B] uppercase dark:bg-background dark:border-border"
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    />
                  </div>
                  {appliedCoupon ? (
                    <Button type="button" variant="outline" size="sm" onClick={handleRemovePromotion}>
                      Remove
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="shrink-0 px-5 font-bold uppercase border-2 bg-white hover:bg-amber-50/40 dark:bg-background"
                      style={{ borderColor: GOLD, color: GOLD }}
                      onClick={handleApplyCoupon}
                    >
                      Apply
                    </Button>
                  )}
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-muted-foreground mb-1">
                  Try: {couponHints}
                </p>
                {appliedCoupon && (
                  <p className="text-xs text-green-600 dark:text-green-400">✓ {appliedCoupon.code} applied</p>
                )}
                {loadingPromotions && <p className="text-xs text-muted-foreground">Loading promotions…</p>}
              </div>

              <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm dark:border-border dark:bg-card">
                <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-800 dark:text-foreground mb-3">
                  SUPPORT SOCIAL WORK
                </h3>
                <label className="flex items-start gap-2 cursor-pointer text-sm text-neutral-700 dark:text-foreground mb-4">
                  <input
                    type="checkbox"
                    checked={donatePledge}
                    onChange={(e) => {
                      const on = e.target.checked;
                      setDonatePledge(on);
                      if (!on) setDonationAmount(0);
                      else if (donationAmount === 0) setDonationAmount(donationPresets[0] ?? 10);
                    }}
                    className="mt-0.5 size-4 rounded border-neutral-300"
                    style={{ accentColor: GOLD }}
                  />
                  <span>Donate and make a difference</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {donationPresets.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      disabled={!donatePledge}
                      onClick={() => setDonationAmount(amt)}
                      className={cn(
                        'px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors disabled:opacity-40',
                        donationAmount === amt && donatePledge
                          ? 'text-white border-transparent'
                          : 'border-neutral-200 bg-neutral-50 hover:border-[#B8860B]/40 dark:border-border dark:bg-background'
                      )}
                      style={
                        donationAmount === amt && donatePledge
                          ? { backgroundColor: GOLD, borderColor: GOLD }
                          : undefined
                      }
                    >
                      {formatAmount(amt)}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="text-xs font-semibold hover:underline"
                  style={{ color: GOLD }}
                  onClick={() => navigate('/about')}
                >
                  Know More
                </button>
              </div>

              <div className="rounded-lg border border-neutral-200 bg-white p-5 space-y-3 shadow-sm dark:border-border dark:bg-card">
                <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-800 dark:text-foreground">
                  PRICE DETAILS (
                  {selectedCount === 0
                    ? 'NO ITEMS SELECTED'
                    : `${selectedCount} OF ${items.length} SELECTED`}
                  )
                </h3>
                <div className="flex justify-between text-sm gap-4">
                  <span className="text-neutral-600 dark:text-muted-foreground">Total MRP:</span>
                  <span className="tabular-nums font-medium">{formatAmount(totalMRP)}</span>
                </div>
                {savingsOnMRP > 0 && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                    <span>Discount on MRP</span>
                    <span className="tabular-nums">-{formatAmount(savingsOnMRP)}</span>
                  </div>
                )}
                {appliedCoupon && discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span className="tabular-nums">-{formatAmount(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm gap-4">
                  <span className="text-neutral-600 dark:text-muted-foreground">Platform fee:</span>
                  <span className="tabular-nums font-medium">{formatAmount(platformFeeBundle)}</span>
                </div>
                {donationAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600 dark:text-muted-foreground">Donation</span>
                    <span className="tabular-nums">{formatAmount(donationAmount)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-neutral-200 dark:border-border flex justify-between items-baseline gap-4">
                  <span className="text-sm font-bold text-neutral-900 dark:text-foreground">Total Amount:</span>
                  <span className="text-xl font-bold tabular-nums">{formatAmount(finalTotal)}</span>
                </div>
              </div>

              {hasSelection && shipping > 0 && subtotal < shippingThreshold && (
                <div className="p-3 rounded-lg border border-blue-500/20 bg-blue-500/10 text-sm text-blue-700 dark:text-blue-300">
                  Add {formatAmount(shippingThreshold - subtotal)} more for free shipping.
                </div>
              )}

              <Button
                className="w-full gap-2 py-6 text-base font-bold uppercase tracking-wide text-white shadow-md hover:opacity-95 disabled:opacity-50"
                style={{ backgroundColor: GOLD }}
                disabled={selectedCount === 0}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = GOLD_HOVER)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = GOLD)}
                onClick={handleCheckout}
              >
                PLACE ORDER
                <ArrowRight size={18} />
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => navigate('/')}>
                Continue shopping
              </Button>

              <div className="rounded-xl border border-border/60 bg-white/80 dark:bg-muted/30 p-4 space-y-3 text-sm shadow-sm">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-green-600 shrink-0" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={18} className="text-blue-600 shrink-0" />
                  <span>{currency === 'USD' ? 'Free shipping over $200' : 'Free shipping over ₹15,000'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw size={18} className="text-purple-600 shrink-0" />
                  <span>30-day return policy</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>

      {items.length > 0 && isMobile && (
        <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center gap-3 border-t border-border bg-background/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md shadow-[0_-8px_24px_rgba(0,0,0,0.08)] lg:hidden">
          <div className="min-w-0 shrink">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Total</p>
            <p className="text-lg font-bold leading-tight tabular-nums truncate">{formatAmount(finalTotal)}</p>
          </div>
          <Button
            className="ml-auto min-h-[48px] flex-1 max-w-[min(100%,280px)] gap-2 font-bold uppercase text-white hover:opacity-95 disabled:opacity-50"
            style={{ backgroundColor: GOLD }}
            disabled={selectedCount === 0}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = GOLD_HOVER)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = GOLD)}
            onClick={handleCheckout}
          >
            PLACE ORDER
            <ArrowRight size={18} />
          </Button>
        </div>
      )}

      <Dialog open={removeDialog !== null} onOpenChange={(o) => !o && setRemoveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove from bag?</DialogTitle>
            <DialogDescription>
              {removeDialog?.mode === 'bulk'
                ? `Remove ${selectedCount} selected item${selectedCount === 1 ? '' : 's'}?`
                : 'This item will be removed from your bag.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setRemoveDialog(null)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={confirmRemoveAction}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
