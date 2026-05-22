import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle, Store } from 'lucide-react';
import { LuxuryInput } from '../components/ui/luxury-input';
import { LuxuryTextarea } from '../components/ui/luxury-textarea';
import { LuxurySelect } from '../components/ui/luxury-select';
import { Footer } from '../components/Footer';
import { vendorApplicationService, type VendorApplicationPayload } from '../services/vendorApplicationService';

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan',
  'Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh','Puducherry','Chandigarh',
];

const CATEGORIES = [
  "Women's Clothing","Men's Clothing","Kids' Clothing","Ethnic & Festive Wear",
  'Accessories','Footwear','Jewellery','Bags & Handbags','Home & Living',
  'Beauty & Wellness','Activewear','Vintage & Handmade','Other',
];

const empty: VendorApplicationPayload = {
  business_name: '', business_type: '', gst_number: '', website: '', instagram: '',
  contact_name: '', email: '', phone: '', whatsapp: '',
  address_line1: '', address_line2: '', city: '', state: '', pin_code: '', country: 'India',
  category: '', product_description: '', price_range: '', estimated_listings: '',
  how_did_you_hear: '', message: '',
};

export default function VendorApplyPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<VendorApplicationPayload>(empty);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const set = (field: keyof VendorApplicationPayload, value: string) =>
    setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await vendorApplicationService.submit(form);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 border border-foreground/10 flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={36} className="text-foreground/70" />
          </div>
          <span className="text-xs uppercase tracking-[0.3em] text-foreground/50 mb-4 block">Application received</span>
          <h1 className="text-3xl md:text-4xl mb-6">Thank you for applying</h1>
          <p className="text-foreground/60 leading-relaxed mb-10">
            We've received your application to sell on Rloko. Our team will review it and get back to you within 2–3 business days.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-10 py-3 border border-foreground/15 text-sm uppercase tracking-widest hover:bg-foreground/5 transition-colors"
          >
            Back to store
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full min-w-0 bg-background pt-page-nav pb-mobile-nav">

      <div className="page-container-lg">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="py-8 md:py-12 border-b border-foreground/5 max-w-2xl"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-foreground/50 mb-3 block">Become a seller</span>
          <h1 className="text-3xl md:text-4xl uppercase tracking-[0.15em] mb-3">Sell on Rloko</h1>
          <p className="text-sm text-foreground/60 leading-relaxed max-w-lg">
            Join our curated marketplace of independent brands and designers. Fill in the details below and our team will review your application.
          </p>
        </motion.div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-2xl">

          {/* Business Information */}
          <Section index={0} title="Business information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <LuxuryInput
                label="Business name"
                required
                value={form.business_name}
                onChange={e => set('business_name', e.target.value)}
              />
              <LuxurySelect
                label="Business type"
                required
                value={form.business_type}
                onChange={e => set('business_type', e.target.value)}
              >
                <option value="">Select type</option>
                <option value="individual">Individual / Sole proprietor</option>
                <option value="partnership">Partnership</option>
                <option value="company">Private / Public limited</option>
              </LuxurySelect>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <LuxuryInput
                label="GST number (optional)"
                value={form.gst_number}
                onChange={e => set('gst_number', e.target.value)}
                placeholder="22AAAAA0000A1Z5"
              />
              <LuxuryInput
                label="Website (optional)"
                value={form.website}
                onChange={e => set('website', e.target.value)}
                placeholder="https://yourbrand.com"
                type="url"
              />
            </div>

            <LuxuryInput
              label="Instagram handle (optional)"
              value={form.instagram}
              onChange={e => set('instagram', e.target.value)}
              placeholder="@yourbrand"
            />
          </Section>

          {/* Contact Details */}
          <Section index={1} title="Contact details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <LuxuryInput
                label="Contact person"
                required
                value={form.contact_name}
                onChange={e => set('contact_name', e.target.value)}
              />
              <LuxuryInput
                label="Email address"
                required
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <LuxuryInput
                label="Phone"
                required
                type="tel"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
              />
              <LuxuryInput
                label="WhatsApp (if different)"
                type="tel"
                value={form.whatsapp}
                onChange={e => set('whatsapp', e.target.value)}
              />
            </div>
          </Section>

          {/* Business Location */}
          <Section index={2} title="Business location">
            <LuxuryInput
              label="Address line 1"
              required
              value={form.address_line1}
              onChange={e => set('address_line1', e.target.value)}
            />
            <LuxuryInput
              label="Address line 2 (optional)"
              value={form.address_line2}
              onChange={e => set('address_line2', e.target.value)}
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <LuxuryInput
                label="City"
                required
                value={form.city}
                onChange={e => set('city', e.target.value)}
              />
              <LuxurySelect
                label="State"
                required
                value={form.state}
                onChange={e => set('state', e.target.value)}
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </LuxurySelect>
              <LuxuryInput
                label="PIN code"
                required
                value={form.pin_code}
                onChange={e => set('pin_code', e.target.value)}
                maxLength={6}
              />
            </div>
          </Section>

          {/* Your Products */}
          <Section index={3} title="Your products">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <LuxurySelect
                label="Primary category"
                required
                value={form.category}
                onChange={e => set('category', e.target.value)}
              >
                <option value="">Select category</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </LuxurySelect>
              <LuxurySelect
                label="Price range"
                required
                value={form.price_range}
                onChange={e => set('price_range', e.target.value)}
              >
                <option value="">Select range</option>
                <option value="0-500">₹0 – ₹500</option>
                <option value="500-2000">₹500 – ₹2,000</option>
                <option value="2000-10000">₹2,000 – ₹10,000</option>
                <option value="10000+">₹10,000+</option>
              </LuxurySelect>
            </div>

            <LuxuryTextarea
              label="What do you sell?"
              required
              value={form.product_description}
              onChange={e => set('product_description', e.target.value)}
              placeholder="Describe your products, materials, style, and what makes them unique."
              rows={4}
            />

            <LuxurySelect
              label="Estimated monthly listings"
              required
              value={form.estimated_listings}
              onChange={e => set('estimated_listings', e.target.value)}
            >
              <option value="">Select range</option>
              <option value="1-10">1 – 10 products</option>
              <option value="10-50">10 – 50 products</option>
              <option value="50-100">50 – 100 products</option>
              <option value="100+">100+ products</option>
            </LuxurySelect>
          </Section>

          {/* Anything else */}
          <Section index={4} title="Anything else?" last>
            <LuxuryInput
              label="How did you hear about us? (optional)"
              value={form.how_did_you_hear}
              onChange={e => set('how_did_you_hear', e.target.value)}
              placeholder="Instagram, friend, Google…"
            />
            <LuxuryTextarea
              label="Additional message (optional)"
              value={form.message}
              onChange={e => set('message', e.target.value)}
              placeholder="Anything you'd like us to know"
              rows={3}
            />
          </Section>

          {error && (
            <p className="text-sm text-destructive mb-8">{error}</p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="h-14 px-14 bg-foreground text-background hover:bg-foreground/90 transition-colors uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting…' : 'Submit application'}
          </motion.button>
        </form>
      </div>

      <Footer />
    </div>
  );
}

function Section({
  title,
  children,
  index,
  last,
}: {
  title: string;
  children: React.ReactNode;
  index: number;
  last?: boolean;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={`py-6 md:py-8 ${last ? '' : 'border-b border-foreground/5'}`}
    >
      <span className="text-xs uppercase tracking-[0.3em] text-foreground/40 block mb-8">{title}</span>
      <div className="space-y-6">{children}</div>
    </motion.section>
  );
}
