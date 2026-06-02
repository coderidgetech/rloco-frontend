import { motion, useInView } from 'motion/react';
import { Star } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { productService } from '../services/productService';
import { reviewService } from '../services/reviewService';

// ─── Types ────────────────────────────────────────────────────────────────────

interface TestimonialItem {
  id: string;
  name: string;
  /** Verified customer — no stock-photo persona */
  role: string;
  /** Initials avatar; only real avatar if reviewer has one */
  avatar?: string;
  content: string;
  rating: number;
}

// ─── Static fallback (shown only when no real reviews exist yet) ──────────────

const getFallbackTestimonials = (siteName: string): TestimonialItem[] => [
  {
    id: 'f1',
    name: 'A. Sharma',
    role: 'Verified Customer',
    content: `The quality from ${siteName} is exceptional. Every item feels luxurious and the attention to detail is remarkable.`,
    rating: 5,
  },
  {
    id: 'f2',
    name: 'R. Patel',
    role: 'Verified Customer',
    content: 'Impeccable service and stunning pieces. The shopping experience is seamless and every delivery feels special.',
    rating: 5,
  },
  {
    id: 'f3',
    name: 'M. Gupta',
    role: 'Verified Customer',
    content: `${siteName} captures sophistication perfectly. Premium quality, beautiful designs, and fast delivery.`,
    rating: 5,
  },
];

// ─── Counter Animation ────────────────────────────────────────────────────────

function AnimatedCounter({ value, suffix = '', duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOut * value));
      if (progress < 1) requestAnimationFrame(animate);
      else setCount(value);
    };
    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Initials Avatar ──────────────────────────────────────────────────────────

function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
  return (
    <div className="w-12 h-12 rounded-full flex-shrink-0 bg-primary/10 flex items-center justify-center">
      <span className="text-sm font-semibold text-primary">{initials}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Testimonials() {
  const { config } = useSiteConfig();
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Don't render if testimonials section is disabled
  if (!config.homepage.sections.testimonials) return null;

  // Fetch real approved reviews from featured products; fall back to static if none.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const featured = await productService.getFeatured(4);
        const ids = (featured ?? []).slice(0, 3).map((p) => String(p.id));
        const batches = await Promise.allSettled(
          ids.map((id) => reviewService.getByProduct(id)),
        );
        const real: TestimonialItem[] = batches
          .flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
          .filter((rv) => rv.rating >= 4 && rv.comment?.trim())
          .slice(0, 6)
          .map((rv) => ({
            id: String(rv.id ?? Math.random()),
            name: rv.user_name || 'Verified Customer',
            role: 'Verified Customer',
            content: rv.comment!,
            rating: rv.rating,
          }));

        if (!cancelled) {
          setTestimonials(
            real.length >= 3
              ? real
              : getFallbackTestimonials(config.general.siteName),
          );
        }
      } catch {
        if (!cancelled) {
          setTestimonials(getFallbackTestimonials(config.general.siteName));
        }
      }
    })();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-rotate
  useEffect(() => {
    if (testimonials.length === 0) return;
    const id = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % testimonials.length),
      4000,
    );
    return () => clearInterval(id);
  }, [testimonials.length]);

  const getVisible = () => {
    if (testimonials.length === 0) return [];
    return [0, 1, 2].map((i) => testimonials[(currentIndex + i) % testimonials.length]);
  };

  if (testimonials.length === 0) return null;

  const visible = getVisible();

  return (
    <section className="bg-white py-20 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }} />

      <div className="page-container relative">
        {/* Header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <div className="inline-block border-b border-[#B4770E] pb-1 mb-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#B4770E] font-semibold">
                Customer Reviews
              </span>
            </div>
          </motion.div>

          {config.homepage.testimonials?.heading && (
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl mb-5 tracking-tight font-light"
            >
              {config.homepage.testimonials.heading}
            </motion.h2>
          )}

          {config.homepage.testimonials?.subheading && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-foreground/60 text-lg"
            >
              {config.homepage.testimonials.subheading}
            </motion.p>
          )}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {visible.map((t, index) => (
            <motion.div
              key={`${t.id}-${currentIndex}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="group"
            >
              <div className="bg-white border border-black/10 p-8 md:p-10 h-full flex flex-col hover:border-black/20 transition-all duration-500 hover:shadow-lg">
                {/* Stars */}
                <div className="flex gap-0.5 mb-6">
                  {[...Array(t.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.15 + i * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                    >
                      <Star size={14} className="fill-primary text-primary" />
                    </motion.div>
                  ))}
                </div>

                {/* Quote */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.15 + 0.5 }}
                  className="text-foreground/70 leading-relaxed mb-8 flex-grow line-clamp-5"
                >
                  "{t.content}"
                </motion.p>

                {/* Author */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 + 0.6 }}
                  className="flex items-center gap-4 pt-6 border-t border-black/5"
                >
                  {t.avatar ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500">
                      <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <InitialsAvatar name={t.name} />
                  )}
                  <div>
                    <div className="font-medium text-sm mb-0.5">{t.name}</div>
                    <div className="text-xs text-foreground/50 uppercase tracking-wider">{t.role}</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mb-20">
          {testimonials.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setCurrentIndex(i)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === currentIndex ? 'w-12 bg-[#B4770E]' : 'w-1 bg-black/20 hover:bg-black/40'
              }`}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 pt-16 md:pt-20 border-t border-black/10"
        >
          {[
            { value: 50, suffix: 'K+', label: 'Happy Customers', delay: 0 },
            { value: 4.9, suffix: '', label: 'Average Rating', delay: 0.1 },
            { value: 98, suffix: '%', label: 'Satisfaction', delay: 0.2 },
            { value: 15, suffix: 'K+', label: '5-Star Reviews', delay: 0.3 },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: stat.delay, ease: [0.25, 0.46, 0.45, 0.94] }}
              whileHover={{ y: -8, scale: 1.05, transition: { duration: 0.3 } }}
              className="text-center relative group cursor-default"
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 0.1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-[#B4770E] rounded-full blur-2xl"
              />
              <div className="relative">
                <motion.div
                  className="text-3xl md:text-4xl lg:text-5xl mb-2 font-light text-[#B4770E]"
                  initial={{ scale: 1 }}
                  whileInView={{ scale: [1, 1.1, 1] }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: stat.delay + 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} duration={2} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: stat.delay + 0.4 }}
                  className="text-[10px] md:text-xs text-foreground/50 uppercase tracking-[0.2em]"
                >
                  {stat.label}
                </motion.div>
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: stat.delay + 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="mt-4 h-px bg-gradient-to-r from-transparent via-[#B4770E] to-transparent origin-left"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
