import { motion } from 'motion/react';
import { Footer } from '../components/Footer';

export function TermsPage() {
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
            <span className="text-xs uppercase tracking-[0.3em] text-foreground/60 mb-6 block">Legal</span>
            <h1 className="text-4xl md:text-5xl uppercase tracking-[0.2em] mb-6">
              Terms & Conditions
            </h1>
            <p className="text-foreground/60">Last updated: January 4, 2026</p>
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
          className="prose prose-sm md:prose-base max-w-none"
        >
          <div className="space-y-12">
            {/* Introduction */}
            <section>
              <h2 className="text-2xl uppercase tracking-[0.15em] mb-4">1. Introduction</h2>
              <p className="text-foreground/70 leading-relaxed mb-4">
                Welcome to Rloco. These Terms and Conditions ("Terms") govern your use of our website and the purchase of products from Rloco. By accessing our website or making a purchase, you agree to be bound by these Terms.
              </p>
              <p className="text-foreground/70 leading-relaxed">
                Please read these Terms carefully before using our services. If you do not agree with any part of these Terms, you should not use our website or services.
              </p>
            </section>

            {/* Definitions */}
            <section>
              <h2 className="text-2xl uppercase tracking-[0.15em] mb-4">2. Definitions</h2>
              <ul className="space-y-2 text-foreground/70">
                <li><strong>"We," "Us," "Our"</strong> refers to Rloco</li>
                <li><strong>"You," "Your"</strong> refers to the user or customer</li>
                <li><strong>"Website"</strong> refers to rloco.com</li>
                <li><strong>"Products"</strong> refers to all items available for purchase</li>
                <li><strong>"Services"</strong> refers to all services provided by Rloco</li>
              </ul>
            </section>

            {/* Account Registration */}
            <section>
              <h2 className="text-2xl uppercase tracking-[0.15em] mb-4">3. Account Registration</h2>
              <p className="text-foreground/70 leading-relaxed mb-4">
                To make a purchase, you may need to create an account. You are responsible for:
              </p>
              <ul className="space-y-2 text-foreground/70 list-disc pl-6">
                <li>Providing accurate and complete information</li>
                <li>Maintaining the security of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </section>

            {/* Orders and Payments */}
            <section>
              <h2 className="text-2xl uppercase tracking-[0.15em] mb-4">4. Orders and Payments</h2>
              <div className="space-y-4 text-foreground/70">
                <p>
                  <strong>4.1 Order Acceptance:</strong> All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason.
                </p>
                <p>
                  <strong>4.2 Pricing:</strong> All prices are listed in Indian Rupees (INR) and include applicable taxes. We reserve the right to change prices without notice.
                </p>
                <p>
                  <strong>4.3 Payment:</strong> Payment must be made at the time of purchase through our accepted payment methods. All transactions are processed securely.
                </p>
                <p>
                  <strong>4.4 Order Confirmation:</strong> You will receive an email confirmation once your order is placed and another when it ships.
                </p>
              </div>
            </section>

            {/* Shipping and Delivery */}
            <section>
              <h2 className="text-2xl uppercase tracking-[0.15em] mb-4">5. Shipping and Delivery</h2>
              <p className="text-foreground/70 leading-relaxed mb-4">
                We ship to addresses within India and selected international locations. Delivery times are estimates and not guaranteed. You are responsible for providing accurate shipping information.
              </p>
              <p className="text-foreground/70 leading-relaxed">
                Risk of loss and title for products pass to you upon delivery to the carrier. For more details, please see our Shipping & Returns policy.
              </p>
            </section>

            {/* Returns and Refunds */}
            <section>
              <h2 className="text-2xl uppercase tracking-[0.15em] mb-4">6. Returns and Refunds</h2>
              <p className="text-foreground/70 leading-relaxed mb-4">
                We accept returns within 30 days of delivery for most items in original condition with tags attached. Some exclusions apply:
              </p>
              <ul className="space-y-2 text-foreground/70 list-disc pl-6">
                <li>Final sale and clearance items</li>
                <li>Intimate apparel and swimwear</li>
                <li>Customized or personalized items</li>
                <li>Items showing signs of wear or damage</li>
              </ul>
              <p className="text-foreground/70 leading-relaxed mt-4">
                Refunds will be issued to the original payment method within 7-10 business days after we receive your return.
              </p>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl uppercase tracking-[0.15em] mb-4">7. Intellectual Property</h2>
              <p className="text-foreground/70 leading-relaxed">
                All content on this website, including text, images, logos, and designs, is the property of Rloco and protected by copyright and trademark laws. You may not use, reproduce, or distribute any content without our written permission.
              </p>
            </section>

            {/* User Conduct */}
            <section>
              <h2 className="text-2xl uppercase tracking-[0.15em] mb-4">8. User Conduct</h2>
              <p className="text-foreground/70 leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="space-y-2 text-foreground/70 list-disc pl-6">
                <li>Use the website for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of the website</li>
                <li>Transmit any harmful code or viruses</li>
                <li>Collect or store personal data about other users</li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl uppercase tracking-[0.15em] mb-4">9. Limitation of Liability</h2>
              <p className="text-foreground/70 leading-relaxed">
                To the maximum extent permitted by law, Rloco shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or products. Our total liability shall not exceed the amount paid by you for the product in question.
              </p>
            </section>

            {/* Disclaimer of Warranties */}
            <section>
              <h2 className="text-2xl uppercase tracking-[0.15em] mb-4">10. Disclaimer of Warranties</h2>
              <p className="text-foreground/70 leading-relaxed">
                Our website and products are provided "as is" without any warranties, express or implied. We do not guarantee that the website will be uninterrupted, error-free, or free from viruses or other harmful components.
              </p>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-2xl uppercase tracking-[0.15em] mb-4">11. Indemnification</h2>
              <p className="text-foreground/70 leading-relaxed">
                You agree to indemnify and hold harmless Rloco and its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your violation of these Terms or your use of the website.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl uppercase tracking-[0.15em] mb-4">12. Governing Law</h2>
              <p className="text-foreground/70 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl uppercase tracking-[0.15em] mb-4">13. Changes to Terms</h2>
              <p className="text-foreground/70 leading-relaxed">
                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the website after changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl uppercase tracking-[0.15em] mb-4">14. Contact Us</h2>
              <p className="text-foreground/70 leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="text-foreground/70 space-y-2">
                <p><strong>Email:</strong> legal@rloco.com</p>
                <p><strong>Phone:</strong> +91 123 456 7890</p>
                <p><strong>Address:</strong> 123 Fashion Street, Bandra West, Mumbai, Maharashtra 400050, India</p>
              </div>
            </section>

            {/* Acceptance */}
            <section className="border-t border-foreground/10 pt-8">
              <p className="text-foreground/70 leading-relaxed">
                By using our website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
              </p>
            </section>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
