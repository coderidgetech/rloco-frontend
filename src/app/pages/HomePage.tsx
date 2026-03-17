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

export function HomePage() {
  const { config } = useSiteConfig();

  return (
    <div className="snap-y snap-mandatory" style={{ position: 'relative' }}>
      {config.homepage.hero.enabled && (
        <div className="snap-start">
          <Hero />
        </div>
      )}
      {config.homepage.sections.shopByCategory && (
        <div className="snap-start">
          <Categories />
        </div>
      )}
      <div className="snap-start">
        <GiftSection />
      </div>
      {config.homepage.sections.editorialFeatures && (
        <VideoShowcase />
      )}
      <div className="relative bg-background snap-start">
        {config.homepage.sections.featuredProducts && (
          <>
            <ProductsGrid />
            <Featured />
          </>
        )}
      </div>
      <div className="snap-start">
        <InspirationVideos />
      </div>
      <div className="relative bg-background snap-start">
        {config.homepage.sections.testimonials && (
          <Testimonials />
        )}
        {config.homepage.sections.newsletterSignup && (
          <Newsletter />
        )}
        <Footer />
      </div>
    </div>
  );
}