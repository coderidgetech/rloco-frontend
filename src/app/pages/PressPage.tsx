import { motion } from 'motion/react';
import { ArrowLeft, Download, Mail, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';

export function PressPage() {
  const navigate = useNavigate();

  const pressReleases = [
    {
      date: 'January 10, 2026',
      title: 'Rloco Launches Spring/Summer 2026 Collection',
      excerpt: 'Introducing our most sustainable collection yet, featuring innovative fabrics and timeless designs inspired by contemporary art.',
      category: 'Product Launch',
    },
    {
      date: 'December 15, 2025',
      title: 'Rloco Achieves Carbon Neutral Milestone',
      excerpt: 'We\'re proud to announce that 100% of our shipping operations are now carbon neutral through verified offset programs.',
      category: 'Sustainability',
    },
    {
      date: 'November 5, 2025',
      title: 'New Flagship Store Opening in Los Angeles',
      excerpt: 'Experience Rloco\'s immersive retail concept at our new 5,000 square foot flagship location on Rodeo Drive.',
      category: 'Retail',
    },
    {
      date: 'October 20, 2025',
      title: 'Rloco Partners with Leading Sustainable Fabric Innovators',
      excerpt: 'Strategic partnership to develop next-generation eco-friendly materials for luxury fashion.',
      category: 'Partnership',
    },
    {
      date: 'September 8, 2025',
      title: 'Fall/Winter Collection Features Recycled Materials',
      excerpt: '75% of our Fall/Winter collection now incorporates recycled and upcycled materials without compromising quality or style.',
      category: 'Product Launch',
    },
  ];

  const mediaKitItems = [
    {
      name: 'Brand Guidelines',
      description: 'Logo usage, color palette, and brand voice guidelines',
      size: '2.5 MB',
    },
    {
      name: 'Product Images',
      description: 'High-resolution product photography and lifestyle images',
      size: '45 MB',
    },
    {
      name: 'Executive Bios',
      description: 'Leadership team biographies and headshots',
      size: '1.2 MB',
    },
    {
      name: 'Company Fact Sheet',
      description: 'Key statistics, milestones, and company information',
      size: '500 KB',
    },
  ];

  const features = [
    {
      publication: 'Vogue',
      title: 'The Future of Sustainable Luxury Fashion',
      date: 'December 2025',
      quote: '"Rloco is setting a new standard for what luxury fashion can be - beautiful, timeless, and responsible."',
    },
    {
      publication: 'Elle',
      title: '10 Brands Redefining Modern Elegance',
      date: 'November 2025',
      quote: '"With impeccable craftsmanship and a commitment to sustainability, Rloco is the brand to watch."',
    },
    {
      publication: 'GQ',
      title: 'Best New Menswear Brands of 2025',
      date: 'October 2025',
      quote: '"Rloco\'s menswear collection combines classic tailoring with contemporary sensibility."',
    },
    {
      publication: 'Business of Fashion',
      title: 'How Rloco Built a Sustainable Supply Chain',
      date: 'September 2025',
      quote: '"A case study in how luxury brands can scale sustainably without sacrificing quality or ethics."',
    },
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
            <h1 className="text-4xl md:text-6xl mb-6">Press & Media</h1>
            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-8">
              Get the latest news, press releases, and media resources from Rloco. 
              For press inquiries, please contact our media relations team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="default"
                onClick={() => navigate('/contact')}
                className="inline-flex items-center gap-2"
              >
                <Mail size={18} />
                Press Inquiries
              </Button>
              <Button
                variant="outline"
                className="inline-flex items-center gap-2"
              >
                <Download size={18} />
                Download Media Kit
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-20 md:py-24 border-b border-foreground/10">
        <div className="page-section">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <h2 className="text-3xl md:text-4xl mb-4">Press Releases</h2>
              <p className="text-lg text-foreground/60">
                Latest news and announcements
              </p>
            </motion.div>

            <div className="space-y-6">
              {pressReleases.map((release, index) => (
                <motion.article
                  key={release.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-foreground/10 p-6 md:p-8 hover:border-[#B4770E]/30 transition-all group cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm text-foreground/60">{release.date}</span>
                        <span className="px-3 py-1 bg-[#B4770E]/10 text-[#B4770E] text-xs rounded-full">
                          {release.category}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-medium mb-3 group-hover:text-[#B4770E] transition-colors">
                        {release.title}
                      </h3>
                      <p className="text-foreground/70 leading-relaxed">
                        {release.excerpt}
                      </p>
                    </div>
                    <ExternalLink 
                      size={20} 
                      className="flex-shrink-0 text-foreground/40 group-hover:text-[#B4770E] transition-colors"
                    />
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured In */}
      <section className="py-20 md:py-24 border-b border-foreground/10">
        <div className="page-section">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl mb-4">Featured In</h2>
              <p className="text-lg text-foreground/60">
                What the media is saying about Rloco
              </p>
            </motion.div>

            <div className="space-y-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="border-l-2 border-[#B4770E] pl-6 py-2"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium">{feature.publication}</span>
                    <span className="text-foreground/40">•</span>
                    <span className="text-sm text-foreground/60">{feature.date}</span>
                  </div>
                  <h3 className="text-lg font-medium mb-3">{feature.title}</h3>
                  <blockquote className="text-foreground/70 italic leading-relaxed">
                    {feature.quote}
                  </blockquote>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="py-20 md:py-24 border-b border-foreground/10">
        <div className="page-section">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl mb-4">Media Kit</h2>
              <p className="text-lg text-foreground/60">
                Download resources for editorial use
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mediaKitItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-foreground/10 p-6 hover:border-[#B4770E]/30 transition-all group cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium mb-2 group-hover:text-[#B4770E] transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-foreground/60 mb-3">
                        {item.description}
                      </p>
                      <span className="text-xs text-foreground/40">{item.size}</span>
                    </div>
                    <Download 
                      size={20} 
                      className="flex-shrink-0 text-foreground/40 group-hover:text-[#B4770E] transition-colors"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 md:py-24">
        <div className="page-section">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl mb-6">Press Contact</h2>
              <p className="text-lg text-foreground/70 mb-2">
                For all media inquiries, interviews, and press requests:
              </p>
              <p className="text-lg mb-8">
                <a href="mailto:press@rloco.com" className="text-[#B4770E] hover:underline">
                  press@rloco.com
                </a>
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/contact')}
              >
                Contact Us
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
