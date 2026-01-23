import { motion } from 'motion/react';
import { ArrowLeft, Leaf, Recycle, Heart, Globe, Sun, Droplet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';

export function SustainabilityPage() {
  const navigate = useNavigate();

  const commitments = [
    {
      icon: Leaf,
      title: 'Sustainable Materials',
      description: 'We prioritize organic cotton, recycled fabrics, and innovative eco-friendly materials in our collections.',
      percentage: '75%',
      stat: 'of our products use sustainable materials',
    },
    {
      icon: Recycle,
      title: 'Circular Fashion',
      description: 'Our recycling program and repair services extend the life of garments and reduce waste.',
      percentage: '10K+',
      stat: 'garments recycled annually',
    },
    {
      icon: Globe,
      title: 'Carbon Neutral Shipping',
      description: 'We offset 100% of our shipping emissions through certified carbon reduction projects.',
      percentage: '100%',
      stat: 'carbon neutral deliveries',
    },
    {
      icon: Heart,
      title: 'Ethical Production',
      description: 'Fair wages, safe working conditions, and regular audits across our entire supply chain.',
      percentage: '50+',
      stat: 'vetted partner factories',
    },
  ];

  const initiatives = [
    {
      icon: Sun,
      title: 'Renewable Energy',
      description: 'Our facilities are powered by 100% renewable energy sources, including solar and wind power.',
    },
    {
      icon: Droplet,
      title: 'Water Conservation',
      description: 'We use water-saving dyeing techniques and partner with suppliers who prioritize water stewardship.',
    },
    {
      icon: Recycle,
      title: 'Packaging Innovation',
      description: 'All packaging is made from recycled materials and is 100% recyclable or compostable.',
    },
  ];

  const timeline = [
    {
      year: '2020',
      milestone: 'Launched sustainability initiative',
      description: 'Committed to reducing environmental impact across all operations.',
    },
    {
      year: '2021',
      milestone: 'Achieved carbon neutral shipping',
      description: 'Offset 100% of delivery emissions through verified carbon credits.',
    },
    {
      year: '2022',
      milestone: 'Introduced recycling program',
      description: 'Launched garment take-back and recycling initiative.',
    },
    {
      year: '2023',
      milestone: 'Renewable energy transition',
      description: 'All facilities now powered by renewable energy sources.',
    },
    {
      year: '2024',
      milestone: '75% sustainable materials',
      description: 'Three-quarters of our collection made with eco-friendly fabrics.',
    },
    {
      year: '2025',
      milestone: 'Supply chain transparency',
      description: 'Full traceability of materials from source to store.',
    },
    {
      year: '2026',
      milestone: 'Zero waste goal',
      description: 'Working toward zero waste across all operations.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 border-b border-foreground/10">
        <div className="w-full px-2 md:px-4">
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
            <h1 className="text-4xl md:text-6xl mb-6">Sustainability</h1>
            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
              Fashion that doesn't cost the Earth. We're committed to creating beautiful, 
              timeless pieces while protecting our planet for future generations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Commitments */}
      <section className="py-20 md:py-24 border-b border-foreground/10">
        <div className="w-full px-2 md:px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl mb-4">Our Commitments</h2>
              <p className="text-lg text-foreground/60">
                How we're making a positive impact
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {commitments.map((commitment, index) => (
                <motion.div
                  key={commitment.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-foreground/10 p-8"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#B4770E]/10 flex items-center justify-center text-[#B4770E]">
                      <commitment.icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-medium mb-2">{commitment.title}</h3>
                      <p className="text-foreground/70 leading-relaxed mb-4">
                        {commitment.description}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-light text-[#B4770E]">
                          {commitment.percentage}
                        </span>
                        <span className="text-sm text-foreground/60">
                          {commitment.stat}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Initiatives */}
      <section className="py-20 md:py-24 border-b border-foreground/10">
        <div className="w-full px-2 md:px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl mb-4">Key Initiatives</h2>
              <p className="text-lg text-foreground/60">
                Specific actions we're taking today
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {initiatives.map((initiative, index) => (
                <motion.div
                  key={initiative.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#B4770E]/10 text-[#B4770E] mb-6">
                    <initiative.icon size={28} />
                  </div>
                  <h3 className="text-lg font-medium mb-3">{initiative.title}</h3>
                  <p className="text-foreground/60 leading-relaxed">
                    {initiative.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 md:py-24 border-b border-foreground/10">
        <div className="w-full px-2 md:px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl mb-4">Our Journey</h2>
              <p className="text-lg text-foreground/60">
                Milestones on our path to sustainability
              </p>
            </motion.div>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-foreground/10" />

              <div className="space-y-12">
                {timeline.map((item, index) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`relative flex items-start gap-8 ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Year Badge */}
                    <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-16 h-16 rounded-full bg-[#B4770E] text-background flex items-center justify-center font-medium z-10">
                      {item.year}
                    </div>

                    {/* Content */}
                    <div className={`flex-1 ml-24 md:ml-0 ${index % 2 === 0 ? 'md:text-right md:pr-16' : 'md:pl-16'}`}>
                      <h3 className="text-xl font-medium mb-2">{item.milestone}</h3>
                      <p className="text-foreground/70 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Spacer for desktop */}
                    <div className="hidden md:block flex-1" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-24">
        <div className="w-full px-2 md:px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl mb-6">Join Us in Making a Difference</h2>
              <p className="text-lg text-foreground/60 mb-8">
                Every purchase supports our mission to create a more sustainable fashion industry. 
                Together, we can make fashion better for people and the planet.
              </p>
              <button
                onClick={() => navigate('/all-products')}
                className="px-8 py-3 bg-foreground text-background hover:bg-foreground/90 transition-colors"
              >
                Shop Sustainably
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
