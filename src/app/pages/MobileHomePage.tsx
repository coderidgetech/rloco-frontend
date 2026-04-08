import { MobileHomeHeader } from '../components/mobile/MobileHomeHeader';
import { MobileHero } from '../components/mobile/MobileHero';
import { CategoryGrid } from '../components/mobile/CategoryGrid';
import { MobileGiftSection } from '../components/mobile/MobileGiftSection';
import { MobileProductGrid } from '../components/mobile/MobileProductGrid';
import { MobileInspirationVideos } from '../components/mobile/MobileInspirationVideos';
import { MobileTestimonials } from '../components/mobile/MobileTestimonials';
import { MobileNewsletter } from '../components/mobile/MobileNewsletter';
import { useFeaturedProducts, useNewArrivals, useOnSaleProducts } from '../hooks/useProducts';
import { motion } from 'motion/react';
import { TrendingUp, Zap, Tag, Truck, RotateCcw, Shield } from 'lucide-react';

export function MobileHomePage() {
  const { products: featuredProducts } = useFeaturedProducts(10);
  const { products: newArrivals } = useNewArrivals(10);
  const { products: saleProducts } = useOnSaleProducts(10);

  return (
    <div className="min-h-screen w-full min-w-0 bg-background pb-20">
      <MobileHomeHeader />

      {/* Main Content - pt for header + delivery bar + safe area */}
      <div className="pt-[110px]">
        {/* Hero Carousel */}
        <MobileHero />

        {/* Quick Stats Banner - ref: py-3 px-4 mt-3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-primary/5 py-3 px-4 mt-3"
        >
          <div className="flex items-center justify-around">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-1.5">
                <TrendingUp size={18} className="text-primary" />
              </div>
              <span className="text-xs font-medium">Trending</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-1.5">
                <Zap size={18} className="text-primary" />
              </div>
              <span className="text-xs font-medium">New In</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-1.5">
                <Tag size={18} className="text-primary" />
              </div>
              <span className="text-xs font-medium">Sale</span>
            </div>
          </div>
        </motion.div>

        {featuredProducts.length > 0 && (
          <>
            <MobileProductGrid
              products={featuredProducts}
              title="Top Collection"
            />
            <div className="h-2 bg-foreground/5" />
          </>
        )}

        <CategoryGrid />

        <div className="h-2 bg-foreground/5" />

        <MobileGiftSection />

        <div className="h-2 bg-foreground/5" />

        {/* New Arrivals */}
        {newArrivals.length > 0 && (
          <>
            <MobileProductGrid
              products={newArrivals}
              title="🆕 New Arrivals"
            />
            <div className="h-2 bg-foreground/5" />
          </>
        )}

        {/* Sale Products */}
        {saleProducts.length > 0 && (
          <>
            <MobileProductGrid
              products={saleProducts}
              title="🔥 On Sale"
            />
            <div className="h-2 bg-foreground/5" />
          </>
        )}

        {/* Inspiration Videos - ref: after product sections */}
        <MobileInspirationVideos />
        <div className="h-2 bg-foreground/5" />

        {/* Testimonials - ref */}
        <MobileTestimonials />

        {/* Newsletter - ref */}
        <MobileNewsletter />

        {/* Promo Banner - ref: mx-4 my-4, p-5, mb-1.5, mb-3 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mx-4 my-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-5 text-center"
        >
          <h3 className="text-lg font-medium mb-1.5">Download Our App</h3>
          <p className="text-sm text-foreground/60 mb-3">
            Get exclusive deals and early access to sales
          </p>
          <button className="bg-foreground text-background px-6 py-2.5 rounded-full text-sm font-medium">
            Download Now
          </button>
        </motion.div>

        {/* Trust Badges - ref: Truck, RotateCcw, Shield in w-12 h-12 circles, py-4 */}
        <div className="grid grid-cols-3 gap-4 px-4 py-4 border-t border-border/30">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <Truck size={20} className="text-primary" />
            </div>
            <p className="text-xs font-medium">Free Shipping</p>
            <p className="text-[10px] text-foreground/50">On orders $50+</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <RotateCcw size={20} className="text-primary" />
            </div>
            <p className="text-xs font-medium">Easy Returns</p>
            <p className="text-[10px] text-foreground/50">30-day policy</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <Shield size={20} className="text-primary" />
            </div>
            <p className="text-xs font-medium">Secure Pay</p>
            <p className="text-[10px] text-foreground/50">100% protected</p>
          </div>
        </div>

        {/* Footer - ref: py-6 */}
        <div className="px-4 py-6 text-center border-t border-border/30">
          <p className="text-sm text-foreground/60 mb-2">
            © 2026 Rloco. All rights reserved.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-foreground/50">
            <button>Privacy</button>
            <span>•</span>
            <button>Terms</button>
            <span>•</span>
            <button>Help</button>
          </div>
        </div>
      </div>

      {/* Quick Actions - Only show on scroll */}
      {/* <QuickActions /> */}
    </div>
  );
}
