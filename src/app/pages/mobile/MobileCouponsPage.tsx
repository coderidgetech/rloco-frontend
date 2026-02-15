import { useState } from 'react';
import { motion } from 'motion/react';
import { Tag, Copy, Check, Clock } from 'lucide-react';
import { MobileSubPageHeader } from '@/app/components/mobile/MobileSubPageHeader';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Coupon {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: string;
  minOrder?: string;
  expiryDate: string;
  isActive: boolean;
}

const COUPONS: Coupon[] = [
  {
    id: '1',
    code: 'RLOCO10',
    title: '10% Off',
    description: 'Get 10% off on all products',
    discount: '10% OFF',
    minOrder: '₹999',
    expiryDate: 'Jan 31, 2024',
    isActive: true,
  },
  {
    id: '2',
    code: 'SAVE20',
    title: '20% Off',
    description: 'Save 20% on orders above ₹2999',
    discount: '20% OFF',
    minOrder: '₹2999',
    expiryDate: 'Feb 15, 2024',
    isActive: true,
  },
  {
    id: '3',
    code: 'WELCOME15',
    title: 'Welcome Offer',
    description: 'Special 15% off for new users',
    discount: '15% OFF',
    minOrder: '₹1499',
    expiryDate: 'Feb 28, 2024',
    isActive: true,
  },
  {
    id: '4',
    code: 'FLAT500',
    title: 'Flat ₹500 Off',
    description: 'Get flat ₹500 off on premium collection',
    discount: '₹500 OFF',
    minOrder: '₹5999',
    expiryDate: 'Jan 25, 2024',
    isActive: false,
  },
];

export function MobileCouponsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Coupon code "${code}" copied!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const activeCoupons = COUPONS.filter((c) => c.isActive);
  const expiredCoupons = COUPONS.filter((c) => !c.isActive);

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-20" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      <MobileSubPageHeader onBack={() => navigate('/account')} />

      <div className="pt-[100px]">{/* Header + safe area */}
        {/* Header */}
        <div className="bg-white p-4 border-b border-border/20">
          <h1 className="text-2xl font-medium mb-1">Coupons & Offers</h1>
          <p className="text-sm text-foreground/60">
            {activeCoupons.length} active {activeCoupons.length === 1 ? 'coupon' : 'coupons'} available
          </p>
        </div>

        {/* Active Coupons */}
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
                {/* Discount Badge */}
                <div className="bg-gradient-to-r from-primary to-primary/80 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag size={20} className="text-white" />
                      <span className="text-white font-bold text-lg">{coupon.discount}</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/90 text-xs">
                      <Clock size={14} />
                      <span>Expires {coupon.expiryDate}</span>
                    </div>
                  </div>
                </div>

                {/* Coupon Details */}
                <div className="p-4">
                  <h3 className="font-medium mb-1">{coupon.title}</h3>
                  <p className="text-sm text-foreground/70 mb-2">{coupon.description}</p>
                  {coupon.minOrder && (
                    <p className="text-xs text-foreground/50 mb-3">
                      Min. order: {coupon.minOrder}
                    </p>
                  )}

                  {/* Code and Copy Button */}
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
                      {copiedCode === coupon.code ? (
                        <Check size={20} />
                      ) : (
                        <Copy size={20} />
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Expired Coupons */}
        {expiredCoupons.length > 0 && (
          <div className="p-4">
            <h2 className="text-lg font-medium mb-3">Expired Coupons</h2>
            <div className="space-y-3">
              {expiredCoupons.map((coupon, index) => (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/50 rounded-2xl border border-border/20 overflow-hidden opacity-50"
                >
                  <div className="bg-foreground/5 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tag size={20} className="text-foreground/40" />
                        <span className="text-foreground/60 font-bold">{coupon.discount}</span>
                      </div>
                      <span className="text-xs text-red-600 font-medium">Expired</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-medium text-foreground/60 mb-1">{coupon.title}</h3>
                    <p className="text-sm text-foreground/50 mb-2">{coupon.description}</p>
                    <div className="px-4 py-3 bg-foreground/5 rounded-xl border border-dashed border-foreground/10">
                      <p className="text-center font-mono text-foreground/40 tracking-wider line-through">
                        {coupon.code}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="p-4 mt-4">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
            <h3 className="font-medium mb-2">💡 How to use coupons</h3>
            <ul className="space-y-1 text-sm text-foreground/70">
              <li>• Copy the coupon code</li>
              <li>• Add items to cart</li>
              <li>• Apply code at checkout</li>
              <li>• Enjoy your discount!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}