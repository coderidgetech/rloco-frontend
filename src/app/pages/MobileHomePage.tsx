import { MobileHomeHeader } from '../components/mobile/MobileHomeHeader';
import { MobileHero } from '../components/mobile/MobileHero';
import { CategoryGrid } from '../components/mobile/CategoryGrid';
import { MobileGiftSection } from '../components/mobile/MobileGiftSection';
import { MobileProductGrid } from '../components/mobile/MobileProductGrid';
import { MobileInspirationVideos } from '../components/mobile/MobileInspirationVideos';
import { MobileTestimonials } from '../components/mobile/MobileTestimonials';
import { MobileNewsletter } from '../components/mobile/MobileNewsletter';
import { MobileNewArrivals } from '../components/mobile/MobileNewArrivals';
import { Footer } from '../components/Footer';
import { useFeaturedProducts, useNewArrivals, useOnSaleProducts } from '../hooks/useProducts';
import { useSiteConfig } from '../context/SiteConfigContext';

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
        <MobileProductGrid
          products={featuredProducts}
          title="Latest Drop"
          seeAllLink="/all-products"
          className="py-4"
          maxItems={6}
        />
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
        <MobileProductGrid products={newArrivals} title="Top picks" seeAllLink="/new-arrivals" />
        <Divider />
      </>
    ),
    promotionalBanner: sections.promotionalBanner && saleProducts.length > 0 && (
      <>
        <MobileProductGrid products={saleProducts} title="On Sale" seeAllLink="/sale" />
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
        <MobileNewArrivals />
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

        {order.map((key) => {
          const node = sectionMap[key];
          return node ? <div key={key}>{node}</div> : null;
        })}

        <Footer />
      </div>
    </div>
  );
}
