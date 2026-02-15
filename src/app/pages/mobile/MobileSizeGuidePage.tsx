import { motion } from 'motion/react';
import { ChevronLeft, Ruler, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export function MobileSizeGuidePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'women' | 'men'>('women');

  const womenSizes = [
    { size: 'XS', bust: '81-84', waist: '61-64', hips: '86-89' },
    { size: 'S', bust: '86-89', waist: '66-69', hips: '91-94' },
    { size: 'M', bust: '91-94', waist: '71-74', hips: '96-99' },
    { size: 'L', bust: '96-99', waist: '76-79', hips: '101-104' },
    { size: 'XL', bust: '101-104', waist: '81-84', hips: '106-109' },
  ];

  const menSizes = [
    { size: 'S', chest: '86-91', waist: '71-76', hips: '86-91' },
    { size: 'M', chest: '96-101', waist: '81-86', hips: '96-101' },
    { size: 'L', chest: '106-111', waist: '91-96', hips: '106-111' },
    { size: 'XL', chest: '116-121', waist: '101-106', hips: '116-121' },
    { size: 'XXL', chest: '126-131', waist: '111-116', hips: '126-131' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-20" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border/20">
        <div className="flex items-center h-14 px-4" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center"
          >
            <ChevronLeft size={20} />
          </motion.button>
          <h1 className="text-lg font-medium ml-3">Size Guide</h1>
        </div>
      </div>

      {/* Content */}
      <div className="pt-14 px-4">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6 mb-4"
        >
          <Ruler size={32} className="text-primary mx-auto mb-2" />
          <h2 className="text-2xl font-bold mb-2">Find Your Perfect Fit</h2>
          <p className="text-sm text-foreground/60">
            All measurements are in centimeters (cm)
          </p>
        </motion.div>

        {/* Category Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory('women')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              selectedCategory === 'women'
                ? 'bg-primary text-white'
                : 'bg-foreground/5 text-foreground/60'
            }`}
          >
            Women
          </button>
          <button
            onClick={() => setSelectedCategory('men')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              selectedCategory === 'men'
                ? 'bg-primary text-white'
                : 'bg-foreground/5 text-foreground/60'
            }`}
          >
            Men
          </button>
        </div>

        {/* Size Chart */}
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-muted/30 rounded-2xl p-4 mb-6 overflow-x-auto"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/20">
                <th className="text-left pb-3 font-semibold">Size</th>
                <th className="text-center pb-3 font-semibold">
                  {selectedCategory === 'women' ? 'Bust' : 'Chest'}
                </th>
                <th className="text-center pb-3 font-semibold">Waist</th>
                <th className="text-center pb-3 font-semibold">Hips</th>
              </tr>
            </thead>
            <tbody>
              {(selectedCategory === 'women' ? womenSizes : menSizes).map((item, index) => (
                <motion.tr
                  key={item.size}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-border/10 last:border-0"
                >
                  <td className="py-3 font-medium">{item.size}</td>
                  <td className="py-3 text-center text-foreground/70">
                    {selectedCategory === 'women' ? item.bust : (item as any).chest}
                  </td>
                  <td className="py-3 text-center text-foreground/70">{item.waist}</td>
                  <td className="py-3 text-center text-foreground/70">{item.hips}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* How to Measure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-primary/5 rounded-2xl p-4 mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Info size={20} className="text-primary" />
            <h3 className="font-semibold">How to Measure</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="font-medium mb-1">
                {selectedCategory === 'women' ? 'Bust' : 'Chest'}
              </h4>
              <p className="text-foreground/60 text-xs leading-relaxed">
                Measure around the fullest part of your {selectedCategory === 'women' ? 'bust' : 'chest'}, keeping the tape parallel to the floor.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Waist</h4>
              <p className="text-foreground/60 text-xs leading-relaxed">
                Measure around your natural waistline, keeping the tape comfortably loose.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Hips</h4>
              <p className="text-foreground/60 text-xs leading-relaxed">
                Measure around the fullest part of your hips, approximately 8 inches below your waist.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-muted/30 rounded-2xl p-4 mb-6"
        >
          <h3 className="font-semibold mb-3">Sizing Tips</h3>
          <ul className="space-y-2 text-sm text-foreground/70">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              <span>Use a soft measuring tape for accurate results</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              <span>Measure over your undergarments, not clothing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              <span>If between sizes, we recommend sizing up</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
              <span>Contact us if you need help choosing the right size</span>
            </li>
          </ul>
        </motion.div>
      </div>

    </div>
  );
}
