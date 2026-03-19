import { motion } from 'motion/react';
import { Footer } from '../components/Footer';
import { Award, Heart, Users, Sparkles } from 'lucide-react';
import { useSiteConfig } from '../context/SiteConfigContext';

export function AboutPage() {
  const { config } = useSiteConfig();
  return (
    <div className="min-h-screen bg-background pt-page-nav pb-mobile-nav">
      {/* Hero Section */}
      <div className="border-b border-foreground/5">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs uppercase tracking-[0.3em] text-foreground/60 mb-6 block">About {config.general.siteName}</span>
            <h1 className="text-4xl md:text-6xl uppercase tracking-[0.2em] mb-8">
              Our Story
            </h1>
            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
              Contemporary fashion for the modern wardrobe. We believe in creating timeless pieces that blend quality craftsmanship with minimalist design.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs uppercase tracking-[0.3em] text-foreground/60 mb-4 block">Our Mission</span>
            <h2 className="text-3xl md:text-4xl uppercase tracking-[0.15em] mb-6">
              Redefining Modern Fashion
            </h2>
            <div className="space-y-4 text-foreground/70 leading-relaxed">
              <p>
                Founded in 2020, Rloco emerged from a simple idea: fashion should be effortless, elegant, and accessible. We create pieces that transcend seasonal trends, focusing on timeless design and exceptional quality.
              </p>
              <p>
                Our collections are thoughtfully curated to offer versatile wardrobe essentials that work seamlessly from day to night, season to season. Each piece is designed with meticulous attention to detail and crafted from premium materials.
              </p>
              <p>
                We're committed to sustainable practices, ethical manufacturing, and creating a positive impact in the fashion industry. Every purchase supports our mission to build a more conscious and connected fashion community.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="aspect-[3/4] bg-foreground/5 flex items-center justify-center"
          >
            <div className="text-center p-8">
              <Sparkles size={48} className="mx-auto mb-4 text-foreground/20" />
              <p className="text-sm uppercase tracking-[0.3em] text-foreground/40">Est. 2020</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-foreground/[0.02] border-y border-foreground/5">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-foreground/60 mb-4 block">Our Values</span>
            <h2 className="text-3xl md:text-4xl uppercase tracking-[0.15em]">
              What We Stand For
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Award,
                title: 'Quality First',
                description: 'Premium materials and expert craftsmanship in every piece'
              },
              {
                icon: Heart,
                title: 'Sustainable',
                description: 'Ethical practices and conscious manufacturing processes'
              },
              {
                icon: Users,
                title: 'Community',
                description: 'Building connections through shared style and values'
              },
              {
                icon: Sparkles,
                title: 'Timeless',
                description: 'Designs that transcend trends and seasons'
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 border border-foreground/10 flex items-center justify-center">
                  <value.icon size={24} className="text-foreground/60" />
                </div>
                <h3 className="text-sm uppercase tracking-[0.3em] mb-3">{value.title}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {[
            { value: '50K+', label: 'Happy Customers' },
            { value: '1000+', label: 'Products' },
            { value: '25+', label: 'Countries' },
            { value: '4.9', label: 'Average Rating' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl mb-2">{stat.value}</div>
              <p className="text-xs uppercase tracking-[0.3em] text-foreground/60">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-foreground/[0.02] border-t border-foreground/5">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-xs uppercase tracking-[0.3em] text-foreground/60 mb-4 block">The Team</span>
            <h2 className="text-3xl md:text-4xl uppercase tracking-[0.15em] mb-6">
              Meet Our Founders
            </h2>
            <p className="text-foreground/60 max-w-2xl mx-auto">
              A passionate team of designers, stylists, and fashion enthusiasts dedicated to bringing you the best in contemporary fashion.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Priya Sharma', role: 'Creative Director', initials: 'PS' },
              { name: 'Rahul Patel', role: 'CEO & Founder', initials: 'RP' },
              { name: 'Ananya Singh', role: 'Head of Design', initials: 'AS' }
            ].map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="aspect-square bg-foreground/5 mb-6 flex items-center justify-center">
                  <div className="text-4xl text-foreground/20 font-light">{member.initials}</div>
                </div>
                <h3 className="text-lg mb-1">{member.name}</h3>
                <p className="text-xs uppercase tracking-[0.3em] text-foreground/60">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl uppercase tracking-[0.15em] mb-6">
            Join Our Community
          </h2>
          <p className="text-foreground/60 mb-8 max-w-2xl mx-auto">
            Be part of a movement that values quality, sustainability, and timeless style. Follow us on social media and stay updated with our latest collections.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-foreground text-background hover:bg-foreground/90 transition-all uppercase tracking-widest text-xs"
            >
              Shop Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 border border-foreground/20 hover:border-foreground transition-all uppercase tracking-widest text-xs"
            >
              Contact Us
            </motion.button>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
