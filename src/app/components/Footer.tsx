import React from 'react';
import { Instagram, Facebook, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { RlocoLogo } from './RlocoLogo';
import Vector from '../../imports/Vector';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useState } from 'react';
import { toast } from 'sonner';
import { newsletterService } from '../services/newsletterService';
import { PH } from '../lib/formPlaceholders';

export function Footer() {
  const navigate = useNavigate();
  const { config } = useSiteConfig();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail?.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    setNewsletterLoading(true);
    try {
      await newsletterService.subscribe(newsletterEmail.trim());
      toast.success('Thank you for subscribing!', {
        description: `We've sent a confirmation to ${newsletterEmail}`,
      });
      setNewsletterEmail('');
    } catch (err: any) {
      toast.error(err?.message || 'Subscription failed. Please try again.');
    } finally {
      setNewsletterLoading(false);
    }
  };

  const formatSocialUrl = (url: string) => {
    if (!url?.trim()) return '';
    const u = url.trim();
    if (u.startsWith('http')) return u;
    if (u.startsWith('@')) return `https://instagram.com/${u.slice(1)}`;
    if (u.includes('instagram.com')) return u.startsWith('http') ? u : `https://${u}`;
    if (u.includes('facebook.com')) return u.startsWith('http') ? u : `https://${u}`;
    if (u.includes('twitter.com') || u.includes('x.com')) return u.startsWith('http') ? u : `https://${u}`;
    if (u.includes('youtube.com') || u.includes('youtu.be')) return u.startsWith('http') ? u : `https://${u}`;
    if (u.includes('pinterest.com')) return u.startsWith('http') ? u : `https://${u}`;
    return `https://${u}`;
  };

  return (
    <footer className="bg-white dark:bg-background border-t border-border/10" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      {/* Newsletter Section - when enabled */}
      {config.navigation.footer.showNewsletter && (
        <div className="border-b border-border/10">
          <div className="page-container py-12 md:py-16">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h3 className="text-2xl md:text-3xl font-light tracking-tight">
                Join Our Exclusive Circle
              </h3>
              <p className="text-foreground/60 text-sm md:text-base">
                Be the first to discover new collections, receive styling tips, and enjoy special offers
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder={PH.email}
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="border-border/30 shadow-sm h-12"
                />
                <Button type="submit" disabled={newsletterLoading} className="bg-[#B4770E] hover:bg-[#8B5A0B] h-12 px-8 whitespace-nowrap">
                  {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
                </Button>
              </form>
              <p className="text-xs text-foreground/40">
                By subscribing, you agree to our Privacy Policy and consent to receive updates
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top Section with CTA - when newsletter is disabled */}
      {!config.navigation.footer.showNewsletter && (
        <div className="border-y border-foreground/10">
          <div className="page-container py-12 md:py-16">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <div>
                <h3 className="text-3xl md:text-4xl mb-2 tracking-tight">Experience {config.general.siteName}</h3>
                <p className="text-foreground/60">{config.general.tagline}</p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" size="lg" onClick={() => navigate('/contact')}>
                  Find a Store
                </Button>
                <Button variant="default" size="lg" onClick={() => navigate('/all-products')}>
                  Shop Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Content */}
      <div className="page-container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
          {/* Brand & Contact */}
          <div className="md:col-span-4">
            <div className="mb-8">
              <RlocoLogo size="lg" />
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
                  { name: 'Gift Cards', path: '/gift-cards' },
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
                  { name: 'Contact Us', path: '/contact' },
                  { name: 'Shipping Info', path: '/shipping' },
                  { name: 'Returns & Exchanges', path: '/returns' },
                  { name: 'Size Guide', path: '/size-guide' },
                  { name: 'FAQ', path: '/faq' },
                  { name: 'Track Order', path: '/orders' },
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

        {/* Social Icons */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-12 border-b border-border/10">
          <div className="flex items-center gap-5">
            {[
              { Icon: Instagram, href: formatSocialUrl(config.general.socialMedia?.instagram ?? ''), label: 'Instagram' },
              { Icon: Facebook, href: formatSocialUrl(config.general.socialMedia?.facebook ?? ''), label: 'Facebook' },
              { Icon: Twitter, href: formatSocialUrl(config.general.socialMedia?.twitter ?? ''), label: 'Twitter' },
              { Icon: Youtube, href: formatSocialUrl(config.general.socialMedia?.youtube ?? ''), label: 'YouTube' },
            ].filter(item => item.href).map(({ Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ y: -2 }}
                className="text-foreground/50 hover:text-primary transition-colors"
              >
                <Icon size={20} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Vector Logo / Decorative Element */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="pt-12 pb-6"
        >
          <div className="mx-auto w-full min-w-0 max-w-6xl" style={{ aspectRatio: '250/44.8435' }}>
            <Vector />
          </div>
        </motion.div>

        {/* Copyright */}
        <div className="text-center pt-6">
          <p className="text-xs text-foreground/30 tracking-wide">
            {config.navigation.footer.copyrightText || `© ${new Date().getFullYear()} ${config.general.siteName}. All Rights Reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}