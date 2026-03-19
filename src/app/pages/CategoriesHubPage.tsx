import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

const ROWS = [
  { title: 'Women', description: 'Shop women’s collection', path: '/category/women' },
  { title: 'Men', description: 'Shop men’s collection', path: '/category/men' },
  { title: 'All products', description: 'Browse everything', path: '/all-products' },
  { title: 'New arrivals', description: 'Latest styles', path: '/new-arrivals' },
  { title: 'Sale', description: 'Deals & offers', path: '/sale' },
];

/** Header provided by DesktopHeaderWrapper in routes. */
export function CategoriesHubPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-mobile-nav px-4 py-6 md:py-8 max-w-2xl mx-auto">
      <p className="text-sm text-muted-foreground mb-6">Choose where to shop</p>
      <div className="space-y-2">
        {ROWS.map((row, i) => (
          <motion.button
            key={row.path}
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => navigate(row.path)}
            className="w-full flex items-center justify-between p-4 min-h-[52px] rounded-xl border border-border bg-card hover:bg-muted/50 text-left transition-colors active:scale-[0.99]"
          >
            <div>
              <p className="font-medium">{row.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{row.description}</p>
            </div>
            <ChevronRight className="text-muted-foreground shrink-0" size={20} />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
