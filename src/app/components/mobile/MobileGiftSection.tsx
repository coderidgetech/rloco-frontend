import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useSiteConfig } from '../../context/SiteConfigContext';

export function MobileGiftSection() {
  const navigate = useNavigate();
  const { config } = useSiteConfig();
  const gs = config.homepage.giftSection;
  const items = gs?.items ?? [];

  if (items.length === 0) return null;

  return (
    <section className="w-full bg-white py-6">
      <div className="px-4 mb-4">
        <h2 className="text-xl font-medium tracking-wide">{gs?.heading || 'Perfect Gifts'}</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4">
        {items.map((gift, index) => (
          <motion.button
            key={index}
            type="button"
            onClick={() => navigate(gift.link)}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ delay: index * 0.06, duration: 0.35 }}
            whileTap={{ scale: 0.98 }}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden text-left active:opacity-90 transition-opacity"
          >
            <img src={gift.image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" aria-hidden />
            <div className="absolute inset-0 flex flex-col justify-end p-3">
              <h3 className="text-white text-base font-medium leading-tight line-clamp-2">{gift.title}</h3>
              {gift.subtitle && (
                <span className="mt-1 text-white/85 text-xs">{gift.subtitle}</span>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
