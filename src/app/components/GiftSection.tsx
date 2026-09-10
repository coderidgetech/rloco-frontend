import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

export function GiftSection() {
  const navigate = useNavigate();
  const { config } = useSiteConfig();
  const gs = config.homepage.giftSection;
  const items = gs?.items ?? [];

  if (items.length === 0) return null;

  return (
    <section className="py-6 md:py-8 bg-background">
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-5 md:mb-6 px-2 md:px-4"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '2.5rem' }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="h-0.5 bg-foreground mb-2.5"
          />
          <h2 className="text-xl md:text-2xl lg:text-3xl tracking-tight">{gs?.heading || 'Perfect Gifts'}</h2>
          {gs?.subheading && (
            <p className="text-sm text-foreground/60 mt-1">{gs.subheading}</p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 px-2 md:px-4">
          {items.map((gift, index) => (
            <motion.button
              key={index}
              type="button"
              onClick={() => navigate(gift.link)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="group relative aspect-[4/3] md:aspect-[16/10] overflow-hidden text-left"
            >
              <img
                src={gift.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" aria-hidden />
              <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6">
                <h3 className="text-white text-lg md:text-xl font-medium leading-tight">{gift.title}</h3>
                {gift.subtitle && (
                  <p className="text-white/80 text-sm mt-1">{gift.subtitle}</p>
                )}
                <span className="mt-3 inline-flex items-center gap-1.5 text-white text-xs font-medium uppercase tracking-wider">
                  Explore collection
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
