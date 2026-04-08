import { motion } from 'motion/react';
import { Footer } from '../components/Footer';
import { Ruler } from 'lucide-react';

export function SizeGuidePage() {
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
              <Ruler size={24} className="text-foreground/60" />
              <span className="text-xs uppercase tracking-[0.3em] text-foreground/60">Find Your Perfect Fit</span>
            </div>
            <h1 className="text-4xl md:text-5xl uppercase tracking-[0.2em] mb-6">
              Size Guide
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Use our comprehensive size charts to find the perfect fit for all our products.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-container-md py-16 md:py-20">
        {/* How to Measure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl uppercase tracking-[0.15em] mb-8 text-center">How to Measure</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Chest', desc: 'Measure around the fullest part of your chest, keeping the tape horizontal' },
              { title: 'Waist', desc: 'Measure around your natural waistline, keeping the tape comfortably loose' },
              { title: 'Hips', desc: 'Measure around the fullest part of your hips, about 8 inches below your waist' }
            ].map((item, index) => (
              <div key={item.title} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 border border-foreground/10 flex items-center justify-center">
                  <span className="text-2xl text-foreground/40">{index + 1}</span>
                </div>
                <h3 className="text-sm uppercase tracking-wider mb-2">{item.title}</h3>
                <p className="text-sm text-foreground/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Women's Clothing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl uppercase tracking-[0.15em] mb-8">Women's Clothing</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-foreground/10">
              <thead>
                <tr className="bg-foreground/5">
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider border-b border-foreground/10">Size</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider border-b border-foreground/10">US</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider border-b border-foreground/10">UK</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider border-b border-foreground/10">EU</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider border-b border-foreground/10">Bust (in)</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider border-b border-foreground/10">Waist (in)</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider border-b border-foreground/10">Hips (in)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { size: 'XS', us: '0-2', uk: '4-6', eu: '32-34', bust: '31-33', waist: '24-26', hips: '34-36' },
                  { size: 'S', us: '4-6', uk: '8-10', eu: '36-38', bust: '33-35', waist: '26-28', hips: '36-38' },
                  { size: 'M', us: '8-10', uk: '12-14', eu: '40-42', bust: '35-37', waist: '28-30', hips: '38-40' },
                  { size: 'L', us: '12-14', uk: '16-18', eu: '44-46', bust: '37-40', waist: '30-33', hips: '40-43' },
                  { size: 'XL', us: '16-18', uk: '20-22', eu: '48-50', bust: '40-43', waist: '33-36', hips: '43-46' }
                ].map((row) => (
                  <tr key={row.size} className="border-b border-foreground/5 hover:bg-foreground/[0.02]">
                    <td className="px-4 py-3 font-medium">{row.size}</td>
                    <td className="px-4 py-3 text-foreground/70">{row.us}</td>
                    <td className="px-4 py-3 text-foreground/70">{row.uk}</td>
                    <td className="px-4 py-3 text-foreground/70">{row.eu}</td>
                    <td className="px-4 py-3 text-foreground/70">{row.bust}</td>
                    <td className="px-4 py-3 text-foreground/70">{row.waist}</td>
                    <td className="px-4 py-3 text-foreground/70">{row.hips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Men's Clothing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-2xl uppercase tracking-[0.15em] mb-8">Men's Clothing</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-foreground/10">
              <thead>
                <tr className="bg-foreground/5">
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider border-b border-foreground/10">Size</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider border-b border-foreground/10">US</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider border-b border-foreground/10">UK</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider border-b border-foreground/10">EU</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider border-b border-foreground/10">Chest (in)</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider border-b border-foreground/10">Waist (in)</th>
                  <th className="px-4 py-3 text-left text-xs uppercase tracking-wider border-b border-foreground/10">Sleeve (in)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { size: 'XS', us: '34', uk: '34', eu: '44', chest: '33-35', waist: '27-29', sleeve: '32-33' },
                  { size: 'S', us: '36', uk: '36', eu: '46', chest: '35-37', waist: '29-31', sleeve: '32.5-33.5' },
                  { size: 'M', us: '38-40', uk: '38-40', eu: '48-50', chest: '37-40', waist: '31-34', sleeve: '33-34' },
                  { size: 'L', us: '42-44', uk: '42-44', eu: '52-54', chest: '40-43', waist: '34-37', sleeve: '34-35' },
                  { size: 'XL', us: '46-48', uk: '46-48', eu: '56-58', chest: '43-46', waist: '37-40', sleeve: '35-36' }
                ].map((row) => (
                  <tr key={row.size} className="border-b border-foreground/5 hover:bg-foreground/[0.02]">
                    <td className="px-4 py-3 font-medium">{row.size}</td>
                    <td className="px-4 py-3 text-foreground/70">{row.us}</td>
                    <td className="px-4 py-3 text-foreground/70">{row.uk}</td>
                    <td className="px-4 py-3 text-foreground/70">{row.eu}</td>
                    <td className="px-4 py-3 text-foreground/70">{row.chest}</td>
                    <td className="px-4 py-3 text-foreground/70">{row.waist}</td>
                    <td className="px-4 py-3 text-foreground/70">{row.sleeve}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Shoes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-12 mb-16"
        >
          {/* Women's Shoes */}
          <div>
            <h2 className="text-xl uppercase tracking-[0.15em] mb-6">Women's Shoes</h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-foreground/10 text-sm">
                <thead>
                  <tr className="bg-foreground/5">
                    <th className="px-3 py-2 text-left text-xs uppercase border-b border-foreground/10">US</th>
                    <th className="px-3 py-2 text-left text-xs uppercase border-b border-foreground/10">UK</th>
                    <th className="px-3 py-2 text-left text-xs uppercase border-b border-foreground/10">EU</th>
                    <th className="px-3 py-2 text-left text-xs uppercase border-b border-foreground/10">CM</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { us: '5', uk: '3', eu: '36', cm: '22.5' },
                    { us: '6', uk: '4', eu: '37', cm: '23' },
                    { us: '7', uk: '5', eu: '38', cm: '24' },
                    { us: '8', uk: '6', eu: '39', cm: '25' },
                    { us: '9', uk: '7', eu: '40', cm: '26' },
                    { us: '10', uk: '8', eu: '41', cm: '27' }
                  ].map((row) => (
                    <tr key={row.us} className="border-b border-foreground/5">
                      <td className="px-3 py-2 text-foreground/70">{row.us}</td>
                      <td className="px-3 py-2 text-foreground/70">{row.uk}</td>
                      <td className="px-3 py-2 text-foreground/70">{row.eu}</td>
                      <td className="px-3 py-2 text-foreground/70">{row.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Men's Shoes */}
          <div>
            <h2 className="text-xl uppercase tracking-[0.15em] mb-6">Men's Shoes</h2>
            <div className="overflow-x-auto">
              <table className="w-full border border-foreground/10 text-sm">
                <thead>
                  <tr className="bg-foreground/5">
                    <th className="px-3 py-2 text-left text-xs uppercase border-b border-foreground/10">US</th>
                    <th className="px-3 py-2 text-left text-xs uppercase border-b border-foreground/10">UK</th>
                    <th className="px-3 py-2 text-left text-xs uppercase border-b border-foreground/10">EU</th>
                    <th className="px-3 py-2 text-left text-xs uppercase border-b border-foreground/10">CM</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { us: '7', uk: '6', eu: '40', cm: '25' },
                    { us: '8', uk: '7', eu: '41', cm: '26' },
                    { us: '9', uk: '8', eu: '42', cm: '27' },
                    { us: '10', uk: '9', eu: '43', cm: '28' },
                    { us: '11', uk: '10', eu: '44', cm: '29' },
                    { us: '12', uk: '11', eu: '45', cm: '30' }
                  ].map((row) => (
                    <tr key={row.us} className="border-b border-foreground/5">
                      <td className="px-3 py-2 text-foreground/70">{row.us}</td>
                      <td className="px-3 py-2 text-foreground/70">{row.uk}</td>
                      <td className="px-3 py-2 text-foreground/70">{row.eu}</td>
                      <td className="px-3 py-2 text-foreground/70">{row.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-foreground/[0.02] border border-foreground/10 p-8"
        >
          <h2 className="text-xl uppercase tracking-[0.15em] mb-6">Sizing Tips</h2>
          <ul className="space-y-3 text-foreground/70">
            <li>• All measurements are in inches unless otherwise stated</li>
            <li>• If you're between sizes, we recommend sizing up</li>
            <li>• For the most accurate fit, measure yourself wearing undergarments</li>
            <li>• Size charts may vary slightly between different product categories</li>
            <li>• Still unsure? Contact our customer service team for personalized assistance</li>
          </ul>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
