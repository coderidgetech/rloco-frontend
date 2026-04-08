import { motion } from 'motion/react';
import { ArrowLeft, Cookie, Shield, Settings, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';

export function CookiesPage() {
  const navigate = useNavigate();

  const cookieTypes = [
    {
      icon: Shield,
      title: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility.',
      examples: ['Session management', 'Security authentication', 'Load balancing'],
      canDisable: false,
    },
    {
      icon: Settings,
      title: 'Functional Cookies',
      description: 'These cookies enable the website to provide enhanced functionality and personalization based on your interactions.',
      examples: ['Language preferences', 'Region selection', 'Currency settings'],
      canDisable: true,
    },
    {
      icon: Eye,
      title: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
      examples: ['Page views', 'User behavior', 'Traffic sources'],
      canDisable: true,
    },
    {
      icon: Cookie,
      title: 'Marketing Cookies',
      description: 'These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad.',
      examples: ['Ad targeting', 'Conversion tracking', 'Social media integration'],
      canDisable: true,
    },
  ];

  const specificCookies = [
    {
      name: 'session_id',
      purpose: 'Maintains user session state',
      duration: 'Session',
      type: 'Essential',
    },
    {
      name: 'auth_token',
      purpose: 'User authentication',
      duration: '30 days',
      type: 'Essential',
    },
    {
      name: 'cart_items',
      purpose: 'Stores shopping cart contents',
      duration: '7 days',
      type: 'Functional',
    },
    {
      name: 'currency_preference',
      purpose: 'Remembers selected currency',
      duration: '1 year',
      type: 'Functional',
    },
    {
      name: '_ga',
      purpose: 'Google Analytics tracking',
      duration: '2 years',
      type: 'Analytics',
    },
    {
      name: '_fbp',
      purpose: 'Facebook pixel tracking',
      duration: '3 months',
      type: 'Marketing',
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
            <h1 className="text-4xl md:text-6xl mb-6">Cookie Policy</h1>
            <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
              This Cookie Policy explains how Rloco uses cookies and similar technologies 
              to recognize you when you visit our website. It explains what these technologies 
              are and why we use them, as well as your rights to control our use of them.
            </p>
            <p className="text-sm text-foreground/60 mt-4">
              Last updated: January 14, 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* What Are Cookies */}
      <section className="py-20 md:py-24 border-b border-foreground/10">
        <div className="page-section">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl md:text-4xl mb-6">What Are Cookies?</h2>
              <div className="space-y-4 text-foreground/70 leading-relaxed">
                <p>
                  Cookies are small text files that are placed on your computer or mobile device 
                  when you visit a website. They are widely used to make websites work more efficiently, 
                  provide a better user experience, and provide information to website owners.
                </p>
                <p>
                  Cookies set by the website owner (in this case, Rloco) are called "first party cookies". 
                  Cookies set by parties other than the website owner are called "third party cookies". 
                  Third party cookies enable third party features or functionality to be provided on or 
                  through the website (e.g., advertising, interactive content, and analytics).
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cookie Types */}
      <section className="py-20 md:py-24 border-b border-foreground/10">
        <div className="page-section">
          <div className="max-w-6xl mx-auto w-full min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl mb-4">Types of Cookies We Use</h2>
              <p className="text-lg text-foreground/60">
                Understanding how we use different types of cookies
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {cookieTypes.map((type, index) => (
                <motion.div
                  key={type.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-foreground/10 p-6 md:p-8"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#B4770E]/10 flex items-center justify-center text-[#B4770E]">
                      <type.icon size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-medium">{type.title}</h3>
                        {type.canDisable && (
                          <span className="px-2 py-1 bg-foreground/5 text-xs rounded">
                            Optional
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-foreground/70 leading-relaxed mb-4">
                    {type.description}
                  </p>
                  <div>
                    <p className="text-sm font-medium mb-2">Examples:</p>
                    <ul className="space-y-1">
                      {type.examples.map((example) => (
                        <li key={example} className="text-sm text-foreground/60 flex items-start gap-2">
                          <span className="text-[#B4770E] mt-1">•</span>
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Specific Cookies */}
      <section className="py-20 md:py-24 border-b border-foreground/10">
        <div className="page-section">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl md:text-4xl mb-4">Specific Cookies We Use</h2>
              <p className="text-lg text-foreground/60">
                Detailed information about individual cookies
              </p>
            </motion.div>

            <div className="overflow-x-auto">
              <table className="w-full border border-foreground/10">
                <thead className="bg-foreground/5">
                  <tr>
                    <th className="text-left p-4 border-b border-foreground/10">Cookie Name</th>
                    <th className="text-left p-4 border-b border-foreground/10">Purpose</th>
                    <th className="text-left p-4 border-b border-foreground/10">Duration</th>
                    <th className="text-left p-4 border-b border-foreground/10">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {specificCookies.map((cookie, index) => (
                    <motion.tr
                      key={cookie.name}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-foreground/10 hover:bg-foreground/5"
                    >
                      <td className="p-4 font-mono text-sm">{cookie.name}</td>
                      <td className="p-4 text-sm text-foreground/70">{cookie.purpose}</td>
                      <td className="p-4 text-sm text-foreground/70">{cookie.duration}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-[#B4770E]/10 text-[#B4770E] text-xs rounded-full">
                          {cookie.type}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Your Choices */}
      <section className="py-20 md:py-24 border-b border-foreground/10">
        <div className="page-section">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl mb-6">Your Choices</h2>
              <div className="space-y-6 text-foreground/70 leading-relaxed">
                <p>
                  You have the right to decide whether to accept or reject cookies. You can exercise 
                  your cookie rights by setting your preferences in our cookie consent manager, which 
                  appears when you first visit our website.
                </p>
                <p>
                  You can also set or amend your web browser controls to accept or refuse cookies. 
                  If you choose to reject cookies, you may still use our website though your access 
                  to some functionality and areas may be restricted.
                </p>
                <div className="bg-foreground/5 p-6 rounded-lg">
                  <h3 className="font-medium text-foreground mb-3">How to Control Cookies:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-[#B4770E] mt-1">•</span>
                      <span>
                        <strong>Browser Settings:</strong> Most browsers allow you to refuse to accept cookies 
                        and to delete cookies. Check your browser's Help menu for instructions.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#B4770E] mt-1">•</span>
                      <span>
                        <strong>Cookie Preferences:</strong> Use our cookie preference center to manage 
                        your cookie settings.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#B4770E] mt-1">•</span>
                      <span>
                        <strong>Opt-Out Tools:</strong> Visit third-party opt-out pages like 
                        aboutads.info or youronlinechoices.com
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
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
              <h2 className="text-3xl md:text-4xl mb-6">Questions About Cookies?</h2>
              <p className="text-lg text-foreground/60 mb-8">
                If you have any questions about our use of cookies, please contact us at{' '}
                <a href="mailto:privacy@rloco.com" className="text-[#B4770E] hover:underline">
                  privacy@rloco.com
                </a>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/privacy')}
                  className="px-6 py-3 border border-foreground/20 hover:bg-foreground hover:text-background transition-colors"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="px-6 py-3 bg-foreground text-background hover:bg-foreground/90 transition-colors"
                >
                  Contact Us
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
