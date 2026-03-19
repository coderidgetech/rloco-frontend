import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Gift, Heart, Sparkles, ArrowRight } from 'lucide-react';

const giftCategories = [
  {
    title: 'Gift For Her',
    subtitle: "Thoughtful presents she'll treasure",
    description: 'Curated gifts for every special woman',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
    link: '/gift-for-her',
    icon: Heart,
    gradient: 'from-pink-500/25 via-transparent to-transparent',
    accentColor: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-50/90 dark:bg-pink-950/25',
    items: 127,
  },
  {
    title: 'Gift For Him',
    subtitle: 'Perfect gifts for every gentleman',
    description: 'Premium gifts he\'ll love',
    image: 'https://images.unsplash.com/photo-1549298240-0d8e60513026?w=600&q=80',
    link: '/gift-for-him',
    icon: Gift,
    gradient: 'from-primary/20 via-transparent to-transparent',
    accentColor: 'text-primary',
    bgColor: 'bg-primary/5 dark:bg-primary/15',
    items: 94,
  },
];

export function MobileGiftSection() {
  const navigate = useNavigate();

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
          <h2 className="mb-1 text-2xl font-semibold tracking-tight">Perfect Gifts</h2>
          <p className="text-sm text-foreground/60">Handpicked for every special moment</p>
        </div>

        <ul className="flex flex-col gap-4">
          {giftCategories.map((gift, index) => {
            const IconComponent = gift.icon;
            return (
              <li key={gift.title} className="list-none">
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
                    <img
                      src={gift.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${gift.gradient}`}
                      aria-hidden
                    />
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold shadow-md">
                      {gift.items} items
                    </span>
                    <div className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-lg">
                      <IconComponent
                        className={gift.accentColor}
                        size={22}
                        fill={gift.icon === Heart ? 'currentColor' : 'none'}
                        strokeWidth={gift.icon === Heart ? 0 : 2}
                      />
                    </div>
                  </div>
                  <div className={`px-4 py-4 ${gift.bgColor}`}>
                    <h3 className="mb-1 text-lg font-bold">{gift.title}</h3>
                    <p className={`mb-2 text-sm font-semibold ${gift.accentColor}`}>
                      {gift.subtitle}
                    </p>
                    <p className="mb-3 text-sm text-foreground/70">{gift.description}</p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                      Explore
                      <ArrowRight size={16} />
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
