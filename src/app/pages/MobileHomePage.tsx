import { MobileHomeHeader } from '../components/mobile/MobileHomeHeader';
import { MobileHero } from '../components/mobile/MobileHero';
import { CategoryGrid } from '../components/mobile/CategoryGrid';
import { MobileGiftSection } from '../components/mobile/MobileGiftSection';
import { MobileProductGrid } from '../components/mobile/MobileProductGrid';
import { MobileInspirationVideos } from '../components/mobile/MobileInspirationVideos';
import { MobileTestimonials } from '../components/mobile/MobileTestimonials';
import { MobileNewsletter } from '../components/mobile/MobileNewsletter';
import { VideoShowcase } from '../components/VideoShowcase';
import { useFeaturedProducts, useNewArrivals, useOnSaleProducts } from '../hooks/useProducts';
import { useSiteConfig } from '../context/SiteConfigContext';
import { motion } from 'motion/react';
import { TrendingUp, Zap, Tag, Truck, RotateCcw, Shield } from 'lucide-react';

const DEFAULT_ORDER = [
  'featuredProducts','shopByCategory','editorialFeatures',
  'newArrivals','bestSellers','instagramFeed',
  'testimonials','newsletterSignup','promotionalBanner',
];

const Divider = () => <div className="h-2 bg-foreground/5" />;

export function MobileHomePage() {
  const { config } = useSiteConfig();
  const { sections, sectionOrder } = config.homepage;
  const order = sectionOrder?.length ? sectionOrder : DEFAULT_ORDER;

  const { products: featuredProducts } = useFeaturedProducts(10);
  const { products: newArrivals } = useNewArrivals(10);
  const { products: saleProducts } = useOnSaleProducts(10);

  const sectionMap: Record<string, React.ReactNode> = {
    featuredProducts: sections.featuredProducts && featuredProducts.length > 0 && (
      <>
        <MobileProductGrid products={featuredProducts} title="Top Collection" />
        <Divider />
      </>
    ),
    shopByCategory: sections.shopByCategory && (
      <>
        <CategoryGrid />
        <Divider />
      </>
    ),
    bestSellers: sections.bestSellers && (
      <>
        <MobileGiftSection />
        <Divider />
      </>
    ),
    newArrivals: sections.newArrivals && newArrivals.length > 0 && (
      <>
        <MobileProductGrid products={newArrivals} title="🆕 New Arrivals" />
        <Divider />
      </>
    ),
    promotionalBanner: sections.promotionalBanner && saleProducts.length > 0 && (
      <>
        <MobileProductGrid products={saleProducts} title="🔥 On Sale" />
        <Divider />
      </>
    ),
    instagramFeed: sections.instagramFeed && (
      <>
        <MobileInspirationVideos />
        <Divider />
      </>
    ),
    testimonials: sections.testimonials && <MobileTestimonials />,
    newsletterSignup: sections.newsletterSignup && <MobileNewsletter />,
    editorialFeatures: sections.editorialFeatures && (
      <>
        <VideoShowcase />
        <Divider />
      </>
    ),
    brandStory: null,
  };

  return (
    <div className="min-h-screen w-full min-w-0 bg-background pb-20">
      <MobileHomeHeader />

      <div className="pt-[110px]">
        {config.homepage.hero.enabled && <MobileHero />}

        {/* Quick stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-primary/5 py-3 px-4 mt-3"
        >
          <div className="flex items-center justify-around">
            {[
              { Icon: TrendingUp, label: 'Trending' },
              { Icon: Zap, label: 'New In' },
              { Icon: Tag, label: 'Sale' },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-1.5">
                  <Icon size={18} className="text-primary" />
                </div>
                <span className="text-xs font-medium">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {order.map((key) => {
          const node = sectionMap[key];
          return node ? <div key={key}>{node}</div> : null;
        })}

        {/* App download banner */}
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

        {/* Trust badges */}
        <div className="grid grid-cols-3 gap-4 px-4 py-4 border-t border-border/30">
          {[
            { Icon: Truck, label: 'Free Shipping', sub: 'On orders $50+' },
            { Icon: RotateCcw, label: 'Easy Returns', sub: '30-day policy' },
            { Icon: Shield, label: 'Secure Pay', sub: '100% protected' },
          ].map(({ Icon, label, sub }) => (
            <div key={label} className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Icon size={20} className="text-primary" />
              </div>
              <p className="text-xs font-medium">{label}</p>
              <p className="text-[10px] text-foreground/50">{sub}</p>
            </div>
          ))}
        </div>

        <div className="px-4 py-6 text-center border-t border-border/30">
          <p className="text-sm text-foreground/60 mb-2">© 2026 Rloko. All rights reserved.</p>
          <div className="flex items-center justify-center gap-4 text-xs text-foreground/50">
            <button>Privacy</button>
            <span>•</span>
            <button>Terms</button>
            <span>•</span>
            <button>Help</button>
          </div>
        </div>
      </div>
    </div>
  );
}
