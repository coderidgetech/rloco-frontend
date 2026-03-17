import { motion } from 'motion/react';
import { Footer } from '../components/Footer';
import { Truck, Package, RefreshCw, MapPin, Clock, CheckCircle } from 'lucide-react';

export function ShippingPage() {
  return (
    <div className="min-h-screen bg-background pt-24">
      {/* Hero Section */}
      <div className="border-b border-foreground/5">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Truck size={24} className="text-foreground/60" />
              <span className="text-xs uppercase tracking-[0.3em] text-foreground/60">Delivery Information</span>
            </div>
            <h1 className="text-4xl md:text-5xl uppercase tracking-[0.2em] mb-6">
              Shipping & Returns
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Fast, reliable shipping and hassle-free returns. Your satisfaction is our priority.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Quick Facts */}
      <div className="bg-foreground/[0.02] border-b border-foreground/5">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-12">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over ₹2000' },
              { icon: Clock, title: '5-7 Days', desc: 'Standard delivery' },
              { icon: RefreshCw, title: '30-Day Returns', desc: 'Easy returns policy' },
              { icon: CheckCircle, title: 'Secure Packaging', desc: 'Safe & protected' }
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
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-16"
        >
          {/* Shipping Information */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <Truck size={24} className="text-foreground/60" />
              <h2 className="text-2xl uppercase tracking-[0.15em]">Shipping Information</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2 text-lg">Shipping Methods</h3>
                <div className="space-y-4 text-foreground/70">
                  <div className="p-4 border border-foreground/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">Standard Shipping</span>
                      <span className="text-sm">5-7 Business Days</span>
                    </div>
                    <p className="text-sm">Free for orders over ₹2000, otherwise ₹150</p>
                  </div>
                  <div className="p-4 border border-foreground/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">Express Shipping</span>
                      <span className="text-sm">2-3 Business Days</span>
                    </div>
                    <p className="text-sm">₹300 flat rate</p>
                  </div>
                  <div className="p-4 border border-foreground/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">Same-Day Delivery</span>
                      <span className="text-sm">Within 24 Hours</span>
                    </div>
                    <p className="text-sm">₹500 - Available in Mumbai, Delhi, Bangalore</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-lg">Delivery Locations</h3>
                <div className="text-foreground/70 space-y-2">
                  <p>• We ship to all addresses within India</p>
                  <p>• International shipping available to select countries</p>
                  <p>• P.O. boxes and military addresses accepted</p>
                  <p>• Currently unavailable in remote areas (will be notified at checkout)</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-lg">Order Processing</h3>
                <div className="text-foreground/70 space-y-2">
                  <p>• Orders placed before 2 PM IST ship the same business day</p>
                  <p>• Orders placed after 2 PM ship the next business day</p>
                  <p>• No shipping on Sundays and public holidays</p>
                  <p>• You'll receive tracking information via email once shipped</p>
                </div>
              </div>
            </div>
          </section>

          {/* Returns & Exchanges */}
          <section className="border-t border-foreground/10 pt-16">
            <div className="flex items-center gap-3 mb-6">
              <RefreshCw size={24} className="text-foreground/60" />
              <h2 className="text-2xl uppercase tracking-[0.15em]">Returns & Exchanges</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3 text-lg">Return Policy</h3>
                <div className="text-foreground/70 space-y-2">
                  <p>We accept returns within <strong>30 days</strong> of delivery for most items.</p>
                  <p className="mt-4">Items must be:</p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>Unworn, unwashed, and in original condition</li>
                    <li>With all original tags attached</li>
                    <li>In original packaging when possible</li>
                    <li>Accompanied by proof of purchase</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-lg">Non-Returnable Items</h3>
                <ul className="text-foreground/70 list-disc pl-6 space-y-1">
                  <li>Intimate apparel and swimwear</li>
                  <li>Earrings and pierced jewelry</li>
                  <li>Final sale and clearance items</li>
                  <li>Personalized or custom-made items</li>
                  <li>Gift cards</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-lg">How to Return</h3>
                <div className="space-y-3 text-foreground/70">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center flex-shrink-0 text-xs">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Initiate Return</p>
                      <p className="text-sm">Log into your account and select the order you wish to return</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center flex-shrink-0 text-xs">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Print Return Label</p>
                      <p className="text-sm">Download and print the prepaid return shipping label</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center flex-shrink-0 text-xs">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Pack Your Items</p>
                      <p className="text-sm">Securely pack items in original packaging if possible</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center flex-shrink-0 text-xs">
                      4
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Ship Your Return</p>
                      <p className="text-sm">Drop off at any authorized courier location</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-lg">Refund Processing</h3>
                <div className="text-foreground/70 space-y-2">
                  <p>• Refunds processed within 7-10 business days of receiving your return</p>
                  <p>• Refunded to original payment method</p>
                  <p>• You'll receive an email confirmation once refund is issued</p>
                  <p>• Original shipping charges are non-refundable</p>
                  <p>• Return shipping is free for defective or incorrect items</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3 text-lg">Exchanges</h3>
                <div className="text-foreground/70 space-y-2">
                  <p>We currently don't offer direct exchanges. To exchange an item:</p>
                  <p className="mt-2">1. Return the unwanted item for a refund</p>
                  <p>2. Place a new order for the desired item</p>
                  <p className="mt-2">This ensures you receive your new item as quickly as possible.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Order Tracking */}
          <section className="border-t border-foreground/10 pt-16">
            <div className="flex items-center gap-3 mb-6">
              <Package size={24} className="text-foreground/60" />
              <h2 className="text-2xl uppercase tracking-[0.15em]">Order Tracking</h2>
            </div>
            
            <div className="text-foreground/70 space-y-4">
              <p>Track your order status at any time:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Log into your account and visit "My Orders"</li>
                <li>Click on the order number to view detailed tracking</li>
                <li>Use the tracking number provided in your shipping confirmation email</li>
              </ul>
              <p className="mt-4">
                Need help? Contact our customer service team at <a href="mailto:support@rloco.com" className="underline">support@rloco.com</a> or call +91 123 456 7890
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t border-foreground/10 pt-16">
            <h2 className="text-2xl uppercase tracking-[0.15em] mb-6">Questions?</h2>
            <div className="bg-foreground/[0.02] border border-foreground/10 p-6 md:p-8">
              <p className="text-foreground/70 mb-6">
                Have questions about shipping or returns? We're here to help.
              </p>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <p className="font-medium mb-1">Email Us</p>
                  <a href="mailto:support@rloco.com" className="text-foreground/70 hover:text-foreground">
                    support@rloco.com
                  </a>
                </div>
                <div>
                  <p className="font-medium mb-1">Call Us</p>
                  <a href="tel:+911234567890" className="text-foreground/70 hover:text-foreground">
                    +91 123 456 7890
                  </a>
                  <p className="text-xs text-foreground/50 mt-1">Mon-Fri, 9AM-6PM IST</p>
                </div>
              </div>
            </div>
          </section>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
