import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Gift, Heart, Sparkles } from 'lucide-react';

const giftCategories = [
  {
    title: 'Gift For Her',
    subtitle: 'Thoughtful presents she\'ll treasure',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
    link: '/gift-for-her',
    icon: Heart,
    gradient: 'from-pink-500/70 via-pink-500/50 to-purple-600/70',
    accentColor: 'text-pink-600',
    bgColor: 'bg-pink-50',
    items: 127,
  },
  {
    title: 'Gift For Him',
    subtitle: 'Perfect gifts for every gentleman',
    image: 'https://images.unsplash.com/photo-1549298240-0d8e60513026?w=600&q=80',
    link: '/gift-for-him',
    icon: Gift,
    gradient: 'from-blue-500/70 via-blue-500/50 to-cyan-600/70',
    accentColor: 'text-primary',
    bgColor: 'bg-primary/5',
    items: 94,
  },
];

export function MobileGiftSection() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-gradient-to-br from-background via-background to-background/95 py-6 relative overflow-hidden">
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-8 right-8 text-primary/10"
      >
        <Sparkles size={24} />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 10, 0],
          rotate: [0, -5, 5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-8 left-8 text-pink-500/10"
      >
        <Sparkles size={20} />
      </motion.div>

      <div className="px-4 mb-5 text-center relative z-10">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-12 h-0.5 bg-primary mx-auto mb-3"
        />
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold tracking-tight mb-1"
        >
          Perfect Gifts
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-sm text-foreground/60"
        >
          Handpicked for every special moment
        </motion.p>
      </div>

      <div className="px-4 grid grid-cols-1 gap-4 relative z-10">
        {giftCategories.map((gift, index) => {
          const IconComponent = gift.icon;
          return (
            <motion.button
              key={gift.title}
              onClick={() => navigate(gift.link)}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1]
              }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-2xl bg-white border border-border/30 shadow-lg active:shadow-xl transition-shadow text-left"
            >
              <div className="relative h-[280px] flex flex-col">
                <div className="relative h-[160px] overflow-hidden">
                  <motion.img
                    src={gift.image}
                    alt={gift.title}
                    className="w-full h-full object-cover"
                    whileTap={{ scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${gift.gradient}`} />
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.15 + 0.2,
                      type: 'spring',
                      stiffness: 200
                    }}
                    className="absolute top-4 right-4 w-14 h-14 rounded-full bg-white shadow-xl flex items-center justify-center z-10"
                  >
                    <IconComponent
                      className={gift.accentColor}
                      size={26}
                      fill={gift.icon === Heart ? 'currentColor' : 'none'}
                      strokeWidth={gift.icon === Heart ? 0 : 2.5}
                    />
                  </motion.div>
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md">
                    <span className="text-xs font-bold text-foreground">{gift.items} items</span>
                  </div>
                  <motion.div
                    initial={{ x: '-100%' }}
                    whileTap={{ x: '100%' }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
                  />
                </div>

                <div className={`relative flex-1 p-5 ${gift.bgColor} flex flex-col justify-center`}>
                  <div className={`absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 ${gift.accentColor} opacity-20 rounded-tl-2xl`} />
                  <motion.h3
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.3 }}
                    className="text-2xl font-bold tracking-tight mb-1.5"
                  >
                    {gift.title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.4 }}
                    className={`text-sm font-medium ${gift.accentColor} mb-3`}
                  >
                    {gift.subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.5 }}
                    className="flex items-center gap-2 text-foreground text-sm font-medium"
                  >
                    <span>Explore Now</span>
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </motion.div>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.6, duration: 0.6 }}
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-transparent origin-left"
                  />
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileTap={{ opacity: 1 }}
                className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity"
                style={{
                  boxShadow: `0 0 30px ${gift.icon === Heart ? 'rgba(236, 72, 153, 0.4)' : 'rgba(180, 119, 14, 0.4)'} inset`,
                }}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
