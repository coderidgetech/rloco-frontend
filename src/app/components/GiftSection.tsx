import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { Gift, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { BackgroundDecor } from './BackgroundDecor';

const giftCategories = [
  {
    title: 'Gift For Her',
    subtitle: 'Thoughtful presents she\'ll treasure',
    description: 'Curated collection of elegant gifts for every special woman',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',
    link: '/gift-for-her',
    icon: Heart,
    gradient: 'from-pink-500/20 via-rose-500/20 to-purple-500/20',
    accentColor: 'text-pink-600',
    bgAccent: 'bg-pink-50',
    items: 127,
  },
  {
    title: 'Gift For Him',
    subtitle: 'Perfect gifts for every gentleman',
    description: 'Sophisticated selection of premium gifts he\'ll love',
    image: 'https://images.unsplash.com/photo-1549298240-0d8e60513026?w=800&q=80',
    link: '/gift-for-him',
    icon: Gift,
    gradient: 'from-blue-500/20 via-cyan-500/20 to-teal-500/20',
    accentColor: 'text-primary',
    bgAccent: 'bg-primary/5',
    items: 94,
  },
];

export function GiftSection() {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-br from-background via-background to-background/95">
      <BackgroundDecor
        variant="default"
        showOrbs={true}
        showDots={true}
      />

      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 right-20 text-primary/20 hidden lg:block"
      >
        <Sparkles size={40} />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-32 left-24 text-pink-500/20 hidden lg:block"
      >
        <Sparkles size={32} />
      </motion.div>

      <div className="relative z-10 w-full px-2 md:px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '3rem' }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-0.5 bg-primary mx-auto mb-6"
          />
          <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tight mb-3">
            Perfect Gifts
          </h2>
          <p className="text-foreground/60 text-sm md:text-base max-w-2xl mx-auto">
            Discover handpicked gifts that make every moment special
          </p>
        </motion.div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6 lg:gap-8">
          {giftCategories.map((gift, index) => {
            const IconComponent = gift.icon;
            return (
              <motion.button
                key={gift.title}
                onClick={() => navigate(gift.link)}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                  delay: index * 0.2
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden rounded-2xl bg-white border border-border/30 shadow-lg hover:shadow-2xl transition-all duration-500 text-left"
              >
                <div className="relative h-[400px] lg:h-[450px] flex flex-col">
                  <div className="relative h-1/2 overflow-hidden">
                    <motion.img
                      src={gift.image}
                      alt={gift.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-b ${gift.gradient}`} />
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: index * 0.2 + 0.3,
                        type: 'spring',
                        stiffness: 200
                      }}
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      className="absolute top-6 right-6 w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center z-10"
                    >
                      <IconComponent
                        className={gift.accentColor}
                        size={32}
                        fill={gift.icon === Heart ? 'currentColor' : 'none'}
                        strokeWidth={gift.icon === Heart ? 0 : 2}
                      />
                    </motion.div>
                    <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
                      <span className="text-sm font-bold text-foreground">{gift.items} items</span>
                    </div>
                    <motion.div
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"
                    />
                  </div>

                  <div className={`relative h-1/2 p-8 ${gift.bgAccent} flex flex-col justify-center`}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.4 }}
                      className={`absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 ${gift.accentColor} opacity-20 rounded-tl-2xl`}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + 0.5 }}
                    >
                      <motion.h3
                        className="text-3xl lg:text-4xl font-bold tracking-tight mb-3"
                        whileHover={{ x: 4 }}
                      >
                        {gift.title}
                      </motion.h3>
                      <motion.p
                        className={`text-lg font-medium mb-3 ${gift.accentColor}`}
                        whileHover={{ x: 4 }}
                      >
                        {gift.subtitle}
                      </motion.p>
                      <motion.p
                        className="text-foreground/70 text-sm mb-6"
                        whileHover={{ x: 4 }}
                      >
                        {gift.description}
                      </motion.p>
                      <motion.div
                        className="flex items-center gap-2 text-foreground font-medium"
                        whileHover={{ x: 8 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span>Explore Collection</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </motion.div>
                    </motion.div>
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary to-transparent origin-left"
                    />
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    boxShadow: `0 0 40px ${gift.icon === Heart ? 'rgba(236, 72, 153, 0.3)' : 'rgba(180, 119, 14, 0.3)'} inset`,
                  }}
                />
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
