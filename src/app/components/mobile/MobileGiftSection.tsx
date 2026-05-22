import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Gift, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { useSiteConfig } from '../../context/SiteConfigContext';

const CARD_STYLES = [
  { icon: Heart, gradient: 'from-pink-500/25 via-transparent to-transparent', accentColor: 'text-pink-600 dark:text-pink-400', bgColor: 'bg-pink-50/90 dark:bg-pink-950/25',   iconFill: true },
  { icon: Gift,  gradient: 'from-primary/20 via-transparent to-transparent',   accentColor: 'text-primary',                        bgColor: 'bg-primary/5 dark:bg-primary/15',    iconFill: false },
  { icon: Gift,  gradient: 'from-amber-500/20 via-transparent to-transparent', accentColor: 'text-amber-600 dark:text-amber-400',   bgColor: 'bg-amber-50/90 dark:bg-amber-950/25', iconFill: false },
  { icon: Heart, gradient: 'from-purple-500/20 via-transparent to-transparent',accentColor: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-50/90 dark:bg-purple-950/25', iconFill: true },
];

export function MobileGiftSection() {
  const navigate = useNavigate();
  const { config } = useSiteConfig();
  const gs = config.homepage.giftSection;

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-background to-muted/20 py-8">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-6 top-10 text-primary/15"
      >
        <Sparkles size={22} />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-lg px-4">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 h-0.5 w-12 bg-primary" />
          <h2 className="mb-1 text-2xl font-semibold tracking-tight">{gs?.heading || 'Perfect Gifts'}</h2>
          <p className="text-sm text-foreground/60">{gs?.subheading || 'Handpicked for every special moment'}</p>
        </div>

        <ul className="flex flex-col gap-4">
          {(gs?.items ?? []).map((gift, index) => {
            const style = CARD_STYLES[index % CARD_STYLES.length];
            const IconComponent = style.icon;
            return (
              <li key={index} className="list-none">
                <motion.button
                  type="button"
                  onClick={() => navigate(gift.link)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full overflow-hidden rounded-2xl border border-border/40 bg-card text-left shadow-md ring-1 ring-black/5 dark:ring-white/10"
                >
                  <div className="relative aspect-[5/4] w-full overflow-hidden">
                    <img src={gift.image} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${style.gradient}`} aria-hidden />
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold shadow-md">
                      {gift.itemCount} items
                    </span>
                    <div className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg">
                      <IconComponent className={style.accentColor} size={22} fill={style.iconFill ? 'currentColor' : 'none'} strokeWidth={style.iconFill ? 0 : 2} />
                    </div>
                  </div>
                  <div className={`px-4 py-4 ${style.bgColor}`}>
                    <h3 className="mb-1 text-lg font-bold">{gift.title}</h3>
                    <p className={`mb-2 text-sm font-semibold ${style.accentColor}`}>{gift.subtitle}</p>
                    <p className="mb-3 text-sm text-foreground/70">{gift.description}</p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                      Explore <ArrowRight size={16} />
                    </span>
                  </div>
                </motion.button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
