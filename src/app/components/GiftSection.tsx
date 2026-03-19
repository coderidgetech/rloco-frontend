import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Gift, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { BackgroundDecor } from './BackgroundDecor';

const giftCategories = [
  {
    title: 'Gift For Her',
    subtitle: "Thoughtful presents she'll treasure",
    description: 'Curated collection of elegant gifts for every special woman',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
    link: '/gift-for-her',
    icon: Heart,
    gradient: 'from-pink-500/25 via-rose-500/15 to-transparent',
    accentColor: 'text-pink-600 dark:text-pink-400',
    bgAccent: 'bg-pink-50/80 dark:bg-pink-950/20',
    items: 127,
  },
  {
    title: 'Gift For Him',
    subtitle: 'Perfect gifts for every gentleman',
    description: 'Sophisticated selection of premium gifts he\'ll love',
    image: 'https://images.unsplash.com/photo-1549298240-0d8e60513026?w=800&q=80',
    link: '/gift-for-him',
    icon: Gift,
    gradient: 'from-primary/20 via-cyan-500/10 to-transparent',
    accentColor: 'text-primary',
    bgAccent: 'bg-primary/5 dark:bg-primary/10',
    items: 94,
  },
];

export function GiftSection() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/30 py-12 sm:py-16 md:py-24">
      <BackgroundDecor variant="default" showOrbs showDots />

      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute right-12 top-16 hidden text-primary/20 lg:block xl:right-20"
      >
        <Sparkles size={40} />
      </motion.div>
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -5, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-24 left-12 hidden text-pink-500/20 lg:block xl:left-24"
      >
        <Sparkles size={32} />
      </motion.div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-center sm:mb-12 md:mb-16"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '3rem' }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mx-auto mb-5 h-0.5 bg-primary sm:mb-6"
          />
          <h2 className="mb-3 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
            Perfect Gifts
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-foreground/65 sm:text-base">
            Discover handpicked gifts that make every moment special
          </p>
        </motion.div>

        <ul className="mx-auto grid max-w-2xl grid-cols-1 gap-5 sm:gap-6 md:max-w-none md:grid-cols-2 md:gap-6 lg:gap-8">
          {giftCategories.map((gift, index) => {
            const IconComponent = gift.icon;
            return (
              <li key={gift.title} className="min-w-0 list-none">
                <motion.button
                  type="button"
                  onClick={() => navigate(gift.link)}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{
                    duration: 0.65,
                    ease: [0.22, 1, 0.36, 1],
                    delay: index * 0.12,
                  }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.99 }}
                  className="group flex w-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border/40 bg-card text-left shadow-md ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-xl dark:ring-white/10 md:flex-row md:items-stretch md:rounded-3xl"
                >
                  {/* Image: aspect box on mobile; fixed column width on md+ */}
                  <div className="relative aspect-[5/4] w-full shrink-0 overflow-hidden sm:aspect-[16/10] md:aspect-auto md:w-[42%] md:min-h-[272px] lg:min-h-[300px]">
                    <img
                      src={gift.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover object-center"
                    />
                    <div
                      className={`pointer-events-none absolute inset-0 bg-gradient-to-t ${gift.gradient} md:bg-gradient-to-r md:from-transparent md:to-black/10`}
                      aria-hidden
                    />
                    <div className="absolute left-3 top-3 z-10 sm:left-4 sm:top-4">
                      <span className="inline-flex items-center rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-foreground shadow-md backdrop-blur-sm sm:px-3 sm:py-1.5 sm:text-sm">
                        {gift.items} items
                      </span>
                    </div>
                    <div
                      className={`absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg sm:bottom-4 sm:right-4 sm:h-14 sm:w-14 md:bottom-auto md:right-4 md:top-4`}
                    >
                      <IconComponent
                        className={gift.accentColor}
                        size={26}
                        fill={gift.icon === Heart ? 'currentColor' : 'none'}
                        strokeWidth={gift.icon === Heart ? 0 : 2}
                      />
                    </div>
                  </div>

                  {/* Copy */}
                  <div
                    className={`flex min-w-0 flex-1 flex-col justify-center px-5 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8 ${gift.bgAccent}`}
                  >
                    <h3 className="mb-1.5 text-xl font-bold leading-tight tracking-tight sm:text-2xl lg:text-3xl">
                      {gift.title}
                    </h3>
                    <p
                      className={`mb-2 text-sm font-semibold sm:text-base ${gift.accentColor}`}
                    >
                      {gift.subtitle}
                    </p>
                    <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-foreground/70 sm:line-clamp-none sm:mb-6 sm:text-[15px]">
                      {gift.description}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-foreground sm:text-base">
                      Explore collection
                      <ArrowRight
                        size={18}
                        className="transition-transform group-hover:translate-x-1"
                        aria-hidden
                      />
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
