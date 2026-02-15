import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useSiteConfig } from '../context/SiteConfigContext';

export function Footer() {
  const navigate = useNavigate();
  const { config } = useSiteConfig();

  return (
    <footer className="bg-white dark:bg-background" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      {/* Top Section with CTA */}
      <div className="border-y border-foreground/10">
        <div className="max-w-[1920px] mx-auto px-8 md:px-12 lg:px-16 xl:px-20 py-12 md:py-16">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h3 className="text-3xl md:text-4xl mb-2 tracking-tight">Experience {config.general.siteName}</h3>
              <p className="text-foreground/60">{config.general.tagline}</p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/contact')}
              >
                Find a Store
              </Button>
              <Button
                variant="default"
                size="lg"
                onClick={() => navigate('/all-products')}
              >
                Shop Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-[1920px] mx-auto px-8 md:px-12 lg:px-16 xl:px-20 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
          {/* Brand & Contact */}
          <div className="md:col-span-4">
            <div className="mb-8">
              <Logo />
            </div>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 text-sm">
                <MapPin size={18} className="text-foreground/60 mt-0.5 flex-shrink-0" />
                <span className="text-foreground/70">
                  {config.general.address}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={18} className="text-foreground/60 flex-shrink-0" />
                <span className="text-foreground/70">{config.general.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail size={18} className="text-foreground/60 flex-shrink-0" />
                <span className="text-foreground/70">{config.general.email}</span>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Shop */}
            <div>
              <h4 className="text-sm font-semibold mb-5 tracking-wide">SHOP</h4>
              <ul className="space-y-3">
                {[
                  { name: 'Women', path: '/category/women' },
                  { name: 'Men', path: '/category/men' },
                  { name: 'New Arrivals', path: '/new-arrivals' },
                  { name: 'Sale', path: '/sale' },
                  { name: 'All Products', path: '/all-products' },
                ].map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.path)}
                      className="text-sm text-foreground/60 hover:text-foreground transition-colors"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help */}
            <div>
              <h4 className="text-sm font-semibold mb-5 tracking-wide">HELP</h4>
              <ul className="space-y-3">
                {[
                  { name: 'Contact', path: '/contact' },
                  { name: 'Shipping', path: '/shipping' },
                  { name: 'Returns', path: '/returns' },
                  { name: 'Size Guide', path: '/size-guide' },
                  { name: 'FAQ', path: '/faq' },
                ].map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.path)}
                      className="text-sm text-foreground/60 hover:text-foreground transition-colors"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* About */}
            <div>
              <h4 className="text-sm font-semibold mb-5 tracking-wide">ABOUT</h4>
              <ul className="space-y-3">
                {[
                  { name: 'Our Story', path: '/about' },
                  { name: 'Careers', path: '/careers' },
                  { name: 'Sustainability', path: '/sustainability' },
                  { name: 'Press', path: '/press' },
                ].map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.path)}
                      className="text-sm text-foreground/60 hover:text-foreground transition-colors"
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-semibold mb-5 tracking-wide">LEGAL</h4>
              <ul className="space-y-3">
                {[
                  { name: 'Privacy', path: '/privacy' },
                  { name: 'Terms', path: '/terms' },
                  { name: 'Cookies', path: '/cookies' },
                  { name: 'Admin Portal', path: '/admin/login' },
                ].map((item) => (
                  <li key={item.name}>
                    <button
                      onClick={() => navigate(item.path)}
                      className={`text-sm ${
                        item.name === 'Admin Portal'
                          ? 'text-primary hover:text-primary/80'
                          : 'text-foreground/60 hover:text-foreground'
                      } transition-colors`}
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="pt-8 border-t border-foreground/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-foreground/50">
            {config.navigation.footer.copyrightText || `© ${new Date().getFullYear()} ${config.general.siteName}. All rights reserved.`}
          </p>
          
          <div className="flex items-center gap-5">
            {[
              { Icon: Instagram, href: config.general.socialMedia.instagram, label: 'Instagram' },
              { Icon: Facebook, href: config.general.socialMedia.facebook, label: 'Facebook' },
              { Icon: Twitter, href: config.general.socialMedia.twitter, label: 'Twitter' },
            ].filter(item => item.href).map(({ Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                whileHover={{ y: -3 }}
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                <Icon size={20} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}