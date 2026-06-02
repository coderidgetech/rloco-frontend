import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { promotionService } from '../services/promotionService';

interface CategoryTile {
  id: number;
  title: string;
  image: string;
  category: string;
  gender: string;
}

interface PromotionalOffersProps {
  filterGender?: 'women' | 'men' | 'all';
  selectedCategory?: string;
}

// Category browsing tiles — images are curated stock photos for each category.
// Discount text is NOT displayed here; real active promotions are shown as a "Sale" badge
// when the backend reports at least one active on-sale promotion.
const tiles: CategoryTile[] = [
  // Women
  { id: 1, title: 'Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80', category: 'Dresses', gender: 'women' },
  { id: 2, title: 'Tops & Blouses', image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&q=80', category: 'Tops', gender: 'women' },
  { id: 3, title: 'Outerwear', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80', category: 'Outerwear', gender: 'women' },
  { id: 4, title: 'Jewelry', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80', category: 'Jewelry', gender: 'women' },
  { id: 5, title: 'Beauty', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80', category: 'Beauty', gender: 'women' },
  { id: 6, title: 'Footwear', image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&q=80', category: 'Footwear', gender: 'women' },
  { id: 7, title: 'Handbags', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80', category: 'Accessories', gender: 'women' },
  { id: 8, title: 'Pants', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80', category: 'Pants', gender: 'women' },
  { id: 9, title: 'Skirts', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80', category: 'Skirts', gender: 'women' },
  // Men
  { id: 10, title: 'T-Shirts', image: 'https://images.unsplash.com/photo-1759933318666-97a7e86c4d76?w=600&q=80', category: 'T-Shirts', gender: 'men' },
  { id: 11, title: 'Shirts', image: 'https://images.unsplash.com/photo-1657405592096-0eb9199a8634?w=600&q=80', category: 'Shirts', gender: 'men' },
  { id: 12, title: 'Jeans', image: 'https://images.unsplash.com/photo-1602585198422-d795fa9bfd6f?w=600&q=80', category: 'Jeans', gender: 'men' },
  { id: 13, title: 'Trousers', image: 'https://images.unsplash.com/photo-1765871903745-804b6d83324c?w=600&q=80', category: 'Trousers', gender: 'men' },
  { id: 14, title: 'Jackets', image: 'https://images.unsplash.com/photo-1589591990984-68a20755020d?w=600&q=80', category: 'Outerwear', gender: 'men' },
  { id: 15, title: 'Footwear', image: 'https://images.unsplash.com/photo-1760616172899-0681b97a2de3?w=600&q=80', category: 'Footwear', gender: 'men' },
  { id: 16, title: 'Watches', image: 'https://images.unsplash.com/photo-1751437797070-54ac95740dac?w=600&q=80', category: 'Accessories', gender: 'men' },
  { id: 17, title: 'Sportswear', image: 'https://images.unsplash.com/photo-1764698403474-de152b479d59?w=600&q=80', category: 'Activewear', gender: 'men' },
  { id: 18, title: 'Formal Wear', image: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=600&q=80', category: 'Formal Wear', gender: 'men' },
];

export function PromotionalOffers({ filterGender = 'all', selectedCategory }: PromotionalOffersProps) {
  const navigate = useNavigate();
  // True when the backend has at least one active promotion — drives the "Sale" badge.
  const [hasActiveSale, setHasActiveSale] = useState(false);

  useEffect(() => {
    promotionService.list().then((promos) => {
      const now = new Date();
      const active = (promos ?? []).some((p) => {
        if (!p.is_active) return false;
        try {
          return new Date(p.start_date) <= now && new Date(p.end_date) >= now;
        } catch { return false; }
      });
      setHasActiveSale(active);
    }).catch(() => { /* non-critical */ });
  }, []);

  const visible = tiles.filter(
    (t) => filterGender === 'all' || t.gender === filterGender,
  );

  return (
    <section className="py-3 bg-[#f5f3e8] relative overflow-hidden mb-4">
      <div className="page-container">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {visible.map((tile, index) => {
            const isActive =
              selectedCategory?.toLowerCase() === tile.category.toLowerCase();
            return (
              <motion.button
                key={tile.id}
                onClick={() =>
                  navigate(`/category/${tile.gender}/${tile.category.toLowerCase()}`)
                }
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.02 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex-shrink-0 w-[90px] sm:w-[100px] md:w-[110px]"
              >
                {isActive && (
                  <div className="absolute inset-0 border-2 border-primary z-10 pointer-events-none" />
                )}

                {/* Real "Sale" badge — only shown when active promotions exist */}
                {hasActiveSale && (
                  <div className="absolute top-1 right-1 z-20 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm leading-none">
                    SALE
                  </div>
                )}

                <div className="relative aspect-[3/4] overflow-hidden">
                  <motion.img
                    src={tile.image}
                    alt={tile.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-1.5 text-center z-20">
                  <h3 className="text-white font-semibold text-[9px] sm:text-[10px] mb-0.5 tracking-wide leading-tight">
                    {tile.title}
                  </h3>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
