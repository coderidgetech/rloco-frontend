import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Tag, Copy, Check, Clock } from 'lucide-react';
import { MobileSubPageHeader } from '@/app/components/mobile/MobileSubPageHeader';
import { useIsMobile } from '@/app/hooks/useIsMobile';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { promotionService } from '@/app/services/promotionService';
import { Promotion } from '@/app/types/api';

export function MobileCouponsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    let cancelled = false;
    promotionService
      .list()
      .then((data) => {
        if (!cancelled) setPromotions(data || []);
      })
      .catch(() => {
        if (!cancelled) setPromotions([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code "${code}" copied!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const isExpired = (p: Promotion) => {
    if (!p.end_date) return false;
    return new Date(p.end_date) < new Date();
  };

  const formatDiscount = (p: Promotion) => {
    if (p.type === 'percentage') return `${p.value}% OFF`;
    if (p.type === 'fixed') return `₹${p.value} OFF`;
    if (p.type === 'free_shipping') return 'FREE SHIPPING';
    return `${p.value} OFF`;
  };

  const formatExpiry = (date?: string) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const activeCoupons = promotions.filter((p) => p.active && !isExpired(p));
  const expiredCoupons = promotions.filter((p) => !p.active || isExpired(p));

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-20 md:pb-12" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      {isMobile && <MobileSubPageHeader onBack={() => navigate('/account')} />}

      <div className={isMobile ? 'pt-[100px]' : 'pt-6 max-w-3xl mx-auto px-4'}>
        {/* Header */}
        <div className="bg-white p-4 border-b border-border/20">
          <h1 className="text-2xl font-medium mb-1">Coupons & Offers</h1>
          <p className="text-sm text-foreground/60">
            {loading ? 'Loading...' : `${activeCoupons.length} active ${activeCoupons.length === 1 ? 'coupon' : 'coupons'} available`}
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-foreground/60">Loading coupons...</div>
        ) : activeCoupons.length === 0 && expiredCoupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mb-4">
              <Tag size={32} className="text-foreground/40" />
            </div>
            <h3 className="text-lg font-medium mb-2">No Coupons Available</h3>
            <p className="text-sm text-foreground/60 text-center">
              Check back soon for exclusive deals and offers.
            </p>
          </div>
        ) : (
          <>
            {/* Active Coupons */}
            {activeCoupons.length > 0 && (
              <div className="p-4">
                <h2 className="text-lg font-medium mb-3">Active Coupons</h2>
                <div className="space-y-3">
                  {activeCoupons.map((coupon, index) => (
                    <motion.div
                      key={coupon.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-2xl border-2 border-dashed border-primary/30 shadow-sm overflow-hidden"
                    >
                      <div className="bg-gradient-to-r from-primary to-primary/80 px-4 py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Tag size={20} className="text-white" />
                            <span className="text-white font-bold text-lg">{formatDiscount(coupon)}</span>
                          </div>
                          {coupon.end_date && (
                            <div className="flex items-center gap-1 text-white/90 text-xs">
                              <Clock size={14} />
                              <span>Expires {formatExpiry(coupon.end_date)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-1">{coupon.name}</h3>
                        <p className="text-sm text-foreground/70 mb-2">{coupon.description || `Use code ${coupon.code} at checkout`}</p>
                        {coupon.min_order_amount && coupon.min_order_amount > 0 && (
                          <p className="text-xs text-foreground/50 mb-3">
                            Min. order: ₹{coupon.min_order_amount}
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 px-4 py-3 bg-foreground/5 rounded-xl border border-dashed border-foreground/20">
                            <p className="text-center font-mono font-bold text-primary tracking-wider">
                              {coupon.code}
                            </p>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCopy(coupon.code)}
                            className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                              copiedCode === coupon.code
                                ? 'bg-green-500 text-white'
                                : 'bg-primary text-white'
                            }`}
                          >
                            {copiedCode === coupon.code ? <Check size={20} /> : <Copy size={20} />}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Expired Coupons */}
            {expiredCoupons.length > 0 && (
              <div className="p-4">
                <h2 className="text-lg font-medium mb-3">Expired Coupons</h2>
                <div className="space-y-3 opacity-50">
                  {expiredCoupons.map((coupon, index) => (
                    <motion.div
                      key={coupon.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white/50 rounded-2xl border border-border/20 overflow-hidden"
                    >
                      <div className="bg-foreground/5 px-4 py-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-foreground/60">{formatDiscount(coupon)}</span>
                          <span className="text-xs text-foreground/40">Expired</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-foreground/60 mb-1">{coupon.name}</h3>
                        <div className="px-4 py-3 bg-foreground/5 rounded-xl">
                          <p className="text-center font-mono font-bold text-foreground/40 tracking-wider line-through">
                            {coupon.code}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
