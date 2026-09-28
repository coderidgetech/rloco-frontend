import { RlocoLogo } from './RlocoLogo';
import { useNavigate } from 'react-router-dom';
import { useSiteConfig } from '../context/SiteConfigContext';

export function Footer() {
  const navigate = useNavigate();
  const { config } = useSiteConfig();

  const formatSocialUrl = (url: string) => {
    if (!url?.trim()) return '';
    const u = url.trim();
    if (u.startsWith('http')) return u;
    if (u.startsWith('@')) return `https://instagram.com/${u.slice(1)}`;
    return `https://${u}`;
  };

  const phone = config.general.phone?.trim();
  const phoneDigits = phone?.replace(/[^\d+]/g, '');

  const connectLinks = [
    phone && { name: 'Call', href: `tel:${phoneDigits}` },
    phone && { name: 'Text (WhatsApp)', href: `https://wa.me/${phoneDigits?.replace(/^\+/, '')}` },
    config.general.socialMedia?.instagram && { name: 'Instagram', href: formatSocialUrl(config.general.socialMedia.instagram) },
    config.general.socialMedia?.youtube && { name: 'YouTube', href: formatSocialUrl(config.general.socialMedia.youtube) },
    config.general.socialMedia?.facebook && { name: 'Facebook', href: formatSocialUrl(config.general.socialMedia.facebook) },
    config.general.socialMedia?.twitter && { name: 'Twitter', href: formatSocialUrl(config.general.socialMedia.twitter) },
  ].filter((item): item is { name: string; href: string } => Boolean(item));

  const weAreLinks = [
    { name: 'Our Story', path: '/about' },
    { name: 'Sell with us', path: '/vendor/apply' },
    { name: 'Careers', path: '/careers' },
    { name: 'Sustainability', path: '/sustainability' },
    { name: 'Press', path: '/press' },
  ];

  const orderSupportLinks = [
    { name: 'Track your order', path: '/orders' },
    { name: 'Make a return/Exchange', path: '/orders' },
    { name: 'Refund/Exchange policy', path: '/returns' },
    { name: 'Shipping policy', path: '/shipping' },
    { name: "FAQ's", path: '/faq' },
    { name: 'Terms', path: '/terms' },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-white via-neutral-50 to-neutral-100 dark:from-neutral-900 dark:via-neutral-950 dark:to-black rounded-t-[2rem] md:rounded-t-[2.5rem] overflow-hidden">
      <div className="page-container pb-28 pt-14 md:pb-14 md:pt-20">
        {/* Brand */}
        <div className="flex justify-center mb-12 md:mb-16 px-8">
          <RlocoLogo size="2xl" className="[&_svg]:h-10 md:[&_svg]:h-20" />
        </div>

        {/* Link groups */}
        <div className="mx-auto mb-10 grid max-w-md grid-cols-2 items-start gap-x-6 gap-y-10 md:mb-12 md:max-w-3xl md:grid-cols-3 md:gap-x-12">
          <div className="min-w-0">
            <h4 className="font-semibold mb-4">Connect with us</h4>
            <ul className="space-y-3">
              {connectLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="block w-fit text-left text-sm leading-5 text-foreground/60 transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-w-0">
            <h4 className="font-semibold mb-4">We are {config.general.siteName}</h4>
            <ul className="space-y-3">
              {weAreLinks.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.path)}
                    className="block w-fit text-left text-sm leading-5 text-foreground/60 transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 min-w-0 md:col-span-1">
            <h4 className="font-semibold mb-4">Order Support</h4>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 md:block md:space-y-3">
              {orderSupportLinks.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.path)}
                    className="block w-fit text-left text-sm leading-5 text-foreground/60 transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-[11px] text-foreground/40 tracking-widest uppercase">
            {config.navigation.footer.copyrightText || `© ${new Date().getFullYear()} ${config.general.siteName}. All Rights Reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
