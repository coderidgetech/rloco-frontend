import { motion } from 'motion/react';
import { Heart, Users, Award, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MobileSubPageHeader } from '@/app/components/mobile/MobileSubPageHeader';

export function MobileAboutPage() {
  const navigate = useNavigate();

  const stats = [
    { icon: Users, label: 'Customers', value: '50K+' },
    { icon: Award, label: 'Awards', value: '25+' },
    { icon: Globe, label: 'Countries', value: '40+' },
    { icon: Heart, label: 'Reviews', value: '4.8/5' },
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <MobileSubPageHeader showBackButton={true} showDeliveryAddress={false} />

      {/* Content */}
      <div style={{ paddingTop: 'calc(env(safe-area-inset-top) + 56px)' }}>
        {/* Hero Image */}
        <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
          <div className="text-center px-6">
            <h2 className="text-3xl font-bold text-foreground mb-2">Rloco</h2>
            <p className="text-sm text-foreground/60">Luxury Fashion Since 2020</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-3 px-4 -mt-8 mb-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-3 shadow-lg border border-border/10 text-center"
            >
              <stat.icon size={20} className="text-primary mx-auto mb-1" />
              <p className="text-xs font-bold text-foreground mb-0.5">{stat.value}</p>
              <p className="text-[10px] text-foreground/50">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Story Section */}
        <div className="px-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-muted/30 rounded-2xl p-5"
          >
            <h3 className="text-lg font-semibold mb-3">Our Story</h3>
            <p className="text-sm text-foreground/70 leading-relaxed mb-3">
              Founded in 2020, Rloco has become a trusted destination for luxury fashion enthusiasts worldwide. We curate the finest collection of clothing, accessories, and jewelry for the modern individual.
            </p>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Our mission is to deliver exceptional quality, timeless style, and an unparalleled shopping experience that celebrates individuality and elegance.
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <div className="px-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Our Values</h3>
          <div className="space-y-3">
            {[
              { title: 'Quality First', desc: 'Every product meets our strict quality standards' },
              { title: 'Sustainable Fashion', desc: 'Committed to eco-friendly practices' },
              { title: 'Customer Focused', desc: 'Your satisfaction is our priority' },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-start gap-3 bg-white rounded-xl p-4 border border-border/10"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">{value.title}</h4>
                  <p className="text-xs text-foreground/60">{value.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="px-4 mb-6">
          <h3 className="text-lg font-semibold mb-3">Leadership Team</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Sarah Johnson', role: 'Founder & CEO' },
              { name: 'Michael Chen', role: 'Creative Director' },
            ].map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="bg-muted/30 rounded-xl p-4 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-2 flex items-center justify-center">
                  <Users size={24} className="text-primary" />
                </div>
                <h4 className="font-medium text-sm mb-0.5">{member.name}</h4>
                <p className="text-xs text-foreground/50">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}