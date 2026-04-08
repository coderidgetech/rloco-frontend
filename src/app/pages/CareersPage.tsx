import { motion } from 'motion/react';
import { ArrowLeft, Heart, Users, TrendingUp, Award, MapPin, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';

export function CareersPage() {
  const navigate = useNavigate();

  const values = [
    {
      icon: Heart,
      title: 'Passion for Fashion',
      description: 'We love what we do and bring creativity and enthusiasm to every project.',
    },
    {
      icon: Users,
      title: 'Collaborative Culture',
      description: 'We believe in teamwork, open communication, and supporting each other.',
    },
    {
      icon: TrendingUp,
      title: 'Growth Mindset',
      description: 'We encourage continuous learning and provide opportunities for career development.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from products to customer service.',
    },
  ];

  const openPositions = [
    {
      title: 'Senior Fashion Designer',
      department: 'Design',
      location: 'New York, NY',
      type: 'Full-time',
      description: 'Lead the design of our seasonal collections, working closely with our creative team to bring innovative fashion concepts to life.',
    },
    {
      title: 'E-commerce Manager',
      department: 'Digital',
      location: 'Remote',
      type: 'Full-time',
      description: 'Drive our online presence and optimize the digital shopping experience for customers worldwide.',
    },
    {
      title: 'Sustainability Coordinator',
      department: 'Operations',
      location: 'Los Angeles, CA',
      type: 'Full-time',
      description: 'Help us achieve our sustainability goals by coordinating eco-friendly initiatives across our supply chain.',
    },
    {
      title: 'Customer Experience Specialist',
      department: 'Customer Service',
      location: 'New York, NY',
      type: 'Full-time',
      description: 'Provide exceptional service to our customers and ensure every interaction reflects our brand values.',
    },
    {
      title: 'Marketing Coordinator',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      description: 'Support marketing campaigns, social media strategy, and brand partnerships to grow our community.',
    },
    {
      title: 'Visual Merchandiser',
      department: 'Retail',
      location: 'Multiple Locations',
      type: 'Full-time',
      description: 'Create stunning in-store displays and visual experiences that showcase our products beautifully.',
    },
  ];

  const benefits = [
    'Competitive salary and performance bonuses',
    'Comprehensive health, dental, and vision insurance',
    'Generous employee discount on all Rloco products',
    '401(k) retirement plan with company match',
    'Flexible work arrangements and remote options',
    'Professional development and training programs',
    'Paid time off and holiday schedule',
    'Wellness programs and gym membership',
    'Commuter benefits',
    'Parental leave policy',
  ];

  return (
    <div className="min-h-screen w-full min-w-0 bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 border-b border-foreground/10">
        <div className="page-section">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl mb-6">Join Our Team</h1>
            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
              Be part of a passionate team that's redefining luxury fashion. 
              We're looking for creative, dedicated individuals who share our vision.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 md:py-24 border-b border-foreground/10">
        <div className="page-section">
          <div className="max-w-6xl mx-auto w-full min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl mb-4">Our Values</h2>
              <p className="text-lg text-foreground/60">
                What makes Rloco a great place to work
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#B4770E]/10 text-[#B4770E] mb-6">
                    <value.icon size={28} />
                  </div>
                  <h3 className="text-lg font-medium mb-3">{value.title}</h3>
                  <p className="text-foreground/60 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 md:py-24 border-b border-foreground/10">
        <div className="page-section">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl mb-4">Open Positions</h2>
              <p className="text-lg text-foreground/60">
                Explore opportunities to grow your career with us
              </p>
            </motion.div>

            <div className="space-y-6">
              {openPositions.map((position, index) => (
                <motion.div
                  key={position.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-foreground/10 p-6 md:p-8 hover:border-[#B4770E]/30 transition-all group"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl md:text-2xl font-medium mb-2 group-hover:text-[#B4770E] transition-colors">
                        {position.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/60">
                        <span className="flex items-center gap-1">
                          <Briefcase size={16} />
                          {position.department}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={16} />
                          {position.location}
                        </span>
                        <span className="px-3 py-1 bg-foreground/5 rounded-full">
                          {position.type}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/contact')}
                      className="self-start md:self-auto"
                    >
                      Apply Now
                    </Button>
                  </div>
                  <p className="text-foreground/70 leading-relaxed">
                    {position.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 md:py-24 border-b border-foreground/10">
        <div className="page-section">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl mb-4">Benefits & Perks</h2>
              <p className="text-lg text-foreground/60">
                We take care of our team members
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 p-4 rounded-lg hover:bg-foreground/5 transition-colors"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#B4770E] mt-2 flex-shrink-0" />
                  <span className="text-foreground/80">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24">
        <div className="page-section">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl mb-6">Don't See the Right Role?</h2>
              <p className="text-lg text-foreground/60 mb-8">
                We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
              </p>
              <Button
                variant="default"
                size="lg"
                onClick={() => navigate('/contact')}
              >
                Get in Touch
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
