import { Hero } from '../components/Hero';
import { VideoShowcase } from '../components/VideoShowcase';
import { InspirationVideos } from '../components/InspirationVideos';
import { Categories } from '../components/Categories';
import { GiftSection } from '../components/GiftSection';
import { ProductsGrid } from '../components/ProductsGrid';
import { Featured } from '../components/Featured';
import { Testimonials } from '../components/Testimonials';
import { Newsletter } from '../components/Newsletter';
import { Footer } from '../components/Footer';
import { useSiteConfig } from '../context/SiteConfigContext';

const DEFAULT_ORDER = [
  'featuredProducts','shopByCategory','editorialFeatures',
  'newArrivals','bestSellers','instagramFeed',
  'testimonials','newsletterSignup',
];

export function HomePage() {
  const { config } = useSiteConfig();
  const { sections, sectionOrder } = config.homepage;
  const order = sectionOrder?.length ? sectionOrder : DEFAULT_ORDER;

  const sectionMap: Record<string, React.ReactNode> = {
    featuredProducts: sections.featuredProducts && (
      <div key="featuredProducts" className="snap-start bg-background">
        <ProductsGrid />
      </div>
    ),
    newArrivals: sections.newArrivals && (
      <div key="newArrivals" className="snap-start bg-background">
        <Featured />
      </div>
    ),
    shopByCategory: sections.shopByCategory && (
      <div key="shopByCategory" className="snap-start">
        <Categories />
      </div>
    ),
    bestSellers: sections.bestSellers && (
      <div key="bestSellers" className="snap-start">
        <GiftSection />
      </div>
    ),
    editorialFeatures: sections.editorialFeatures && (
      <div key="editorialFeatures" className="snap-start">
        <VideoShowcase />
      </div>
    ),
    instagramFeed: sections.instagramFeed && (
      <div key="instagramFeed" className="snap-start">
        <InspirationVideos />
      </div>
    ),
    testimonials: sections.testimonials && (
      <div key="testimonials" className="snap-start bg-background">
        <Testimonials />
      </div>
    ),
    newsletterSignup: sections.newsletterSignup && (
      <div key="newsletterSignup" className="snap-start bg-background">
        <Newsletter />
      </div>
    ),
  };

  return (
    <div className="relative snap-y snap-proximity md:snap-none">
      {config.homepage.hero.enabled && (
        <div className="snap-start">
          <Hero />
        </div>
      )}
      {order.map((key) => {
        const node = sectionMap[key];
        return node || null;
      })}
      <div className="snap-start bg-background">
        <Footer />
      </div>
    </div>
  );
}
