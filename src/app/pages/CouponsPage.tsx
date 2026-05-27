import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Tag, Copy, Check, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { promotionService } from '../services/promotionService';
import { ResponsivePageHeader } from '../components/ResponsivePageHeader';
import type { Promotion } from '../types/api';

export function CouponsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    promotionService
      .list()
      .then((data) => { if (!cancelled) setPromotions(data || []); })
      .catch(() => { if (!cancelled) setPromotions([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Code "${code}" copied!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const isExpired = (p: Promotion) => p.end_date ? new Date(p.end_date) < new Date() : false;

  const formatDiscount = (p: Promotion) => {
    if (p.type === 'percentage') return `${p.value}% OFF`;
    if (p.type === 'fixed') return `$${p.value} OFF`;
    if (p.type === 'free_shipping') return 'FREE SHIPPING';
    return `${p.value} OFF`;
  };

  const formatExpiry = (date?: string) =>
    date ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null;

  const activeCoupons = promotions.filter((p) => p.active && !isExpired(p));
  const expiredCoupons = promotions.filter((p) => !p.active || isExpired(p));

  return (
    <div className="min-h-screen bg-muted/20">
      <ResponsivePageHeader title="Coupons & Offers" onBack={() => navigate(-1)} />

      <div className="max-w-2xl mx-auto px-4 pt-6 pb-20">
        <p className="text-sm text-foreground/60 mb-6">
          {loading ? 'Loading…' : `${activeCoupons.length} active ${activeCoupons.length === 1 ? 'coupon' : 'coupons'} available`}
        </p>

        {loading ? (
          <div className="py-20 text-center text-foreground/60">Loading coupons…</div>
        ) : activeCoupons.length === 0 && expiredCoupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-full bg-muted/40 flex items-center justify-center mb-4">
              <Tag size={32} className="text-foreground/40" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Coupons Available</h3>
            <p className="text-sm text-foreground/60 text-center max-w-xs">
              Check back soon for exclusive deals and offers.
            </p>
          </div>
        ) : (
          <>
            {activeCoupons.length > 0 && (
              <section className="mb-8">
                <h2 className="text-base font-semibold mb-3">Active Coupons</h2>
                <div className="space-y-3">
                  {activeCoupons.map((coupon, index) => (
                    <motion.div
                      key={coupon.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-2xl border-2 border-dashed border-primary/30 shadow-sm overflow-hidden"
                    >
                      <div className="bg-gradient-to-r from-primary to-primary/80 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Tag size={18} className="text-white" />
                          <span className="text-white font-bold text-lg">{formatDiscount(coupon)}</span>
                        </div>
                        {coupon.end_date && (
                          <div className="flex items-center gap-1 text-white/90 text-xs">
                            <Clock size={13} />
                            <span>Expires {formatExpiry(coupon.end_date)}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-1">{coupon.name}</h3>
                        <p className="text-sm text-foreground/70 mb-2">
                          {coupon.description || `Use code ${coupon.code} at checkout`}
                        </p>
                        {coupon.min_order_amount != null && coupon.min_order_amount > 0 && (
                          <p className="text-xs text-foreground/50 mb-3">
                            Min. order: ${coupon.min_order_amount}
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 px-4 py-3 bg-foreground/5 rounded-xl border border-dashed border-foreground/20 text-center font-mono font-bold text-primary tracking-widest text-sm">
                            {coupon.code}
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopy(coupon.code)}
                            className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                              copiedCode === coupon.code
                                ? 'bg-green-500 text-white'
                                : 'bg-primary text-white hover:opacity-90'
                            }`}
                          >
                            {copiedCode === coupon.code ? <Check size={20} /> : <Copy size={20} />}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {expiredCoupons.length > 0 && (
              <section>
                <h2 className="text-base font-semibold mb-3">Expired Coupons</h2>
                <div className="space-y-3 opacity-50">
                  {expiredCoupons.map((coupon, index) => (
                    <motion.div
                      key={coupon.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white/70 rounded-2xl border border-border/20 overflow-hidden"
                    >
                      <div className="bg-foreground/5 px-4 py-3 flex items-center justify-between">
                        <span className="font-bold text-foreground/60">{formatDiscount(coupon)}</span>
                        <span className="text-xs text-red-600">Expired</span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-foreground/60 mb-2">{coupon.name}</h3>
                        <div className="px-4 py-3 bg-foreground/5 rounded-xl text-center font-mono font-bold text-foreground/40 tracking-widest line-through text-sm">
                          {coupon.code}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            <div className="mt-8 p-4 rounded-2xl bg-blue-50 border border-blue-200">
              <p className="text-sm font-medium mb-2">💡 How to use coupons</p>
              <p className="text-sm text-foreground/70 leading-relaxed">
                Copy a coupon code · Add items to your cart · Paste the code at checkout · Enjoy your discount!
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
