import { MobileHeader } from '../components/mobile/MobileHeader';
import { MobileHero } from '../components/mobile/MobileHero';
import { StoryCircles } from '../components/mobile/StoryCircles';
import { CategoryGrid } from '../components/mobile/CategoryGrid';
import { MobileProductGrid } from '../components/mobile/MobileProductGrid';
import { BottomNavigation } from '../components/mobile/BottomNavigation';
import { QuickActions } from '../components/mobile/QuickActions';
import { InspirationVideos } from '../components/InspirationVideos';
import { useFeaturedProducts, useNewArrivals, useOnSaleProducts } from '../hooks/useProducts';
import { motion } from 'motion/react';
import { TrendingUp, Zap, Tag } from 'lucide-react';

export function MobileHomePage() {
  // Get featured products from API
  const { products: featuredProducts } = useFeaturedProducts(10);
  const { products: newArrivals } = useNewArrivals(10);
  const { products: saleProducts } = useOnSaleProducts(10);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Mobile Header */}
      <MobileHeader />

      {/* Main Content */}
      <div className="pt-14">
        {/* Hero Carousel */}
        <MobileHero />

        {/* Story Circles */}
        <StoryCircles />

        {/* Inspiration Videos */}
        <div className="my-6">
          <InspirationVideos />
        </div>

        {/* Quick Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-primary/5 py-4 px-4 mt-4"
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

        {/* Category Grid */}
        <CategoryGrid />

        {/* Divider */}
        <div className="h-2 bg-foreground/5" />

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <>
            <MobileProductGrid
              products={featuredProducts}
              title="✨ Featured"
            />
            <div className="h-2 bg-foreground/5" />
          </>
        )}

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
          </>
        )}

        {/* Promo Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mx-4 my-6 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-6 text-center"
        >
          <h3 className="text-lg font-medium mb-2">Download Our App</h3>
          <p className="text-sm text-foreground/60 mb-4">
            Get exclusive deals and early access to sales
          </p>
          <button className="bg-foreground text-background px-6 py-2.5 rounded-full text-sm font-medium">
            Download Now
          </button>
        </motion.div>

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-4 px-4 py-6 border-t border-border/30">
          <div className="text-center">
            <div className="text-2xl mb-1">🚚</div>
            <p className="text-xs font-medium">Free Shipping</p>
            <p className="text-[10px] text-foreground/50">On orders $50+</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">↩️</div>
            <p className="text-xs font-medium">Easy Returns</p>
            <p className="text-[10px] text-foreground/50">30-day policy</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🔒</div>
            <p className="text-xs font-medium">Secure Pay</p>
            <p className="text-[10px] text-foreground/50">100% protected</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-8 text-center border-t border-border/30">
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

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Quick Actions - Only show on scroll */}
      {/* <QuickActions /> */}
    </div>
  );
}
