import { motion } from 'motion/react';
import { Footer } from '../components/Footer';
import { Shield, Lock, Eye, UserX } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="min-h-screen w-full min-w-0 bg-background pt-page-nav pb-mobile-nav">
      {/* Hero Section */}
      <div className="border-b border-foreground/5">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Shield size={24} className="text-foreground/60" />
              <span className="text-xs uppercase tracking-[0.3em] text-foreground/60">Your Privacy Matters</span>
            </div>
            <h1 className="text-4xl md:text-5xl uppercase tracking-[0.2em] mb-6">
              Privacy Policy
            </h1>
            <p className="text-foreground/60">Last updated: January 4, 2026</p>
          </motion.div>
        </div>
      </div>

      {/* Quick Summary */}
      <div className="bg-foreground/[0.02] border-b border-foreground/5">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-xl uppercase tracking-[0.15em] mb-6 text-center">Key Points</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { icon: Lock, title: 'Secure', desc: 'Your data is encrypted and protected' },
                { icon: Eye, title: 'Transparent', desc: 'Clear about what we collect' },
                { icon: UserX, title: 'No Selling', desc: 'We never sell your data' },
                { icon: Shield, title: 'Your Rights', desc: 'You control your information' }
              ].map((item, index) => (
                <div key={item.title} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 border border-foreground/10 flex items-center justify-center">
                    <item.icon size={20} className="text-foreground/60" />
                  </div>
                  <h3 className="text-sm uppercase tracking-wider mb-2">{item.title}</h3>
                  <p className="text-xs text-foreground/60">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          {/* Introduction */}
          <section>
            <h2 className="text-2xl uppercase tracking-[0.15em] mb-4">Introduction</h2>
            <p className="text-foreground/70 leading-relaxed">
              At Rloco, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase. Please read this policy carefully.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl uppercase tracking-[0.15em] mb-4">Information We Collect</h2>
            <div className="space-y-4 text-foreground/70">
              <div>
                <h3 className="font-medium mb-2">Personal Information:</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Name, email address, phone number</li>
                  <li>Shipping and billing addresses</li>
                  <li>Payment information (processed securely)</li>
                  <li>Order history and preferences</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Automatically Collected Information:</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>IP address and browser type</li>
                  <li>Device information and operating system</li>
                  <li>Pages visited and time spent on site</li>
                  <li>Referring website and search terms</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl uppercase tracking-[0.15em] mb-4">How We Use Your Information</h2>
            <ul className="space-y-2 text-foreground/70 list-disc pl-6">
              <li>Process and fulfill your orders</li>
              <li>Send order confirmations and shipping updates</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Improve our website and user experience</li>
              <li>Prevent fraud and enhance security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl uppercase tracking-[0.15em] mb-4">Information Sharing</h2>
            <p className="text-foreground/70 leading-relaxed mb-4">
              We do not sell or rent your personal information. We may share your information with:
            </p>
            <ul className="space-y-2 text-foreground/70 list-disc pl-6">
              <li><strong>Service Providers:</strong> Payment processors, shipping companies, and email services</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale</li>
            </ul>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-2xl uppercase tracking-[0.15em] mb-4">Cookies and Tracking</h2>
            <p className="text-foreground/70 leading-relaxed mb-4">
              We use cookies and similar technologies to enhance your experience. You can control cookie preferences through your browser settings. Types of cookies we use:
            </p>
            <ul className="space-y-2 text-foreground/70 list-disc pl-6">
              <li><strong>Essential Cookies:</strong> Required for website functionality</li>
              <li><strong>Performance Cookies:</strong> Help us understand how visitors use our site</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Advertising Cookies:</strong> Deliver relevant ads (with your consent)</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl uppercase tracking-[0.15em] mb-4">Data Security</h2>
            <p className="text-foreground/70 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl uppercase tracking-[0.15em] mb-4">Your Rights</h2>
            <p className="text-foreground/70 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="space-y-2 text-foreground/70 list-disc pl-6">
              <li>Access your personal information</li>
              <li>Correct inaccurate or incomplete data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Withdraw consent at any time</li>
              <li>Opt-out of marketing communications</li>
            </ul>
            <p className="text-foreground/70 leading-relaxed mt-4">
              To exercise these rights, contact us at privacy@rloco.com
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl uppercase tracking-[0.15em] mb-4">Children's Privacy</h2>
            <p className="text-foreground/70 leading-relaxed">
              Our website is not intended for children under 16. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-2xl uppercase tracking-[0.15em] mb-4">Third-Party Links</h2>
            <p className="text-foreground/70 leading-relaxed">
              Our website may contain links to third-party websites. We are not responsible for the privacy practices of these sites. We encourage you to read their privacy policies.
            </p>
          </section>

          {/* International Transfers */}
          <section>
            <h2 className="text-2xl uppercase tracking-[0.15em] mb-4">International Transfers</h2>
            <p className="text-foreground/70 leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl uppercase tracking-[0.15em] mb-4">Changes to This Policy</h2>
            <p className="text-foreground/70 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on our website and updating the "Last updated" date.
            </p>
          </section>

          {/* Contact */}
          <section className="border-t border-foreground/10 pt-8">
            <h2 className="text-2xl uppercase tracking-[0.15em] mb-4">Contact Us</h2>
            <p className="text-foreground/70 leading-relaxed mb-4">
              If you have questions about this Privacy Policy, please contact us:
            </p>
            <div className="text-foreground/70 space-y-2">
              <p><strong>Email:</strong> privacy@rloco.com</p>
              <p><strong>Phone:</strong> +91 123 456 7890</p>
              <p><strong>Address:</strong> 123 Fashion Street, Bandra West, Mumbai, Maharashtra 400050, India</p>
            </div>
          </section>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
