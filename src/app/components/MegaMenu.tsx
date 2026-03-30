import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface MegaMenuProps {
  isOpen: boolean;
  gender: 'women' | 'men';
  onClose: () => void;
  onCategoryClick?: (gender: 'women' | 'men', category?: string) => void;
}

interface CategoryOffer {
  id: number;
  title: string;
  image: string;
  category: string;
}

const ACCENT = '#B4770E';

const categoryOffers = {
  women: [
    { id: 1, title: 'Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80', category: 'Dresses' },
    { id: 2, title: 'Tops & Blouses', image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&q=80', category: 'Tops' },
    { id: 3, title: 'Outerwear', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80', category: 'Outerwear' },
    { id: 4, title: 'Jewelry', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80', category: 'Jewelry' },
    { id: 5, title: 'Beauty', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80', category: 'Beauty' },
    { id: 6, title: 'Footwear', image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&q=80', category: 'Footwear' },
    { id: 7, title: 'Handbags', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80', category: 'Accessories' },
    { id: 8, title: 'Pants & Trousers', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80', category: 'Pants' },
    { id: 9, title: 'Skirts', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80', category: 'Skirts' },
  ],
  men: [
    { id: 1, title: 'T-Shirts', image: 'https://images.unsplash.com/photo-1759933318666-97a7e86c4d76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', category: 'T-Shirts' },
    { id: 2, title: 'Shirts', image: 'https://images.unsplash.com/photo-1657405592096-0eb9199a8634?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', category: 'Shirts' },
    { id: 3, title: 'Jeans', image: 'https://images.unsplash.com/photo-1602585198422-d795fa9bfd6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', category: 'Jeans' },
    { id: 4, title: 'Trousers', image: 'https://images.unsplash.com/photo-1719736444029-614f46b6b435?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', category: 'Trousers' },
    { id: 5, title: 'Jackets', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80', category: 'Outerwear' },
    { id: 6, title: 'Footwear', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80', category: 'Footwear' },
    { id: 7, title: 'Watches', image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80', category: 'Accessories' },
    { id: 8, title: 'Sportswear', image: 'https://images.unsplash.com/photo-1760736534441-4d14bf11103e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', category: 'Activewear' },
    { id: 9, title: 'Formal Wear', image: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=600&q=80', category: 'Formal Wear' },
  ],
};

export function MegaMenu({ isOpen, gender, onClose, onCategoryClick }: MegaMenuProps) {
  const navigate = useNavigate();
  const offers = categoryOffers[gender];

  const handleOfferClick = (offer: CategoryOffer) => {
    if (onCategoryClick) {
      onCategoryClick(gender, offer.category);
    } else {
      navigate(`/category/${gender}/${offer.category.toLowerCase()}`);
    }
    onClose();
  };

  const handleViewAll = () => {
    if (onCategoryClick) {
      onCategoryClick(gender);
    } else {
      navigate(`/category/${gender}`);
    }
    onClose();
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="hidden md:block fixed inset-0 z-30"
            style={{
              top: '72px',
              left: 0,
              right: 0,
              background: 'radial-gradient(circle at center, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.7) 100%)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              pointerEvents: 'auto',
            }}
            onClick={onClose}
          />

          <motion.div
            key={gender}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block fixed z-40"
            style={{
              top: '72px',
              left: 0,
              right: 0,
              width: '100vw',
              maxHeight: 'min(42vh, 520px)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
              pointerEvents: 'auto',
            }}
            onMouseLeave={onClose}
          >
            <div className="w-full h-full overflow-y-auto px-6 md:px-12 lg:px-16 xl:px-20 py-5 md:py-6 flex flex-col">
              <div
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 pb-4"
                style={{ borderBottom: `1px solid rgba(180, 119, 14, 0.15)` }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-1 h-8" style={{ backgroundColor: ACCENT }} />
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] font-semibold mb-0.5" style={{ color: ACCENT }}>
                      Premium Collection
                    </p>
                    <h2 className="text-xl md:text-2xl tracking-tight font-light text-black">
                      {gender === 'women' ? "Women's Luxury" : "Men's Luxury"}
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleViewAll}
                  className="px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] font-semibold border-2 transition-all duration-300 hover:bg-black hover:text-white hover:border-black shrink-0"
                  style={{ borderColor: ACCENT, color: ACCENT, backgroundColor: 'transparent' }}
                >
                  Explore All
                </button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 xl:grid-cols-9 gap-3 md:gap-4 flex-1 min-h-0">
                {offers.map((offer, index) => (
                  <motion.button
                    key={offer.id}
                    type="button"
                    onClick={() => handleOfferClick(offer)}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative text-left h-full"
                  >
                    <div
                      className="relative aspect-[3/4] overflow-hidden bg-white mb-2 shadow-md group-hover:shadow-2xl transition-all duration-700"
                      style={{ border: '1px solid rgba(0, 0, 0, 0.08)' }}
                    >
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-full object-cover transition-all duration-1000 ease-out group-hover:scale-[1.15] group-hover:brightness-105"
                      />
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                        style={{
                          background:
                            'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 70%, rgba(180, 119, 14, 0.4) 100%)',
                        }}
                      />
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                        style={{ boxShadow: `inset 0 0 0 2px ${ACCENT}` }}
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-100 scale-75">
                        <div
                          className="px-2 py-1 text-[8px] uppercase tracking-[0.2em] font-bold backdrop-blur-sm"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            color: ACCENT,
                            boxShadow: '0 2px 8px rgba(180, 119, 14, 0.3)',
                          }}
                        >
                          Shop
                        </div>
                      </div>
                      <div
                        className="absolute bottom-0 left-0 right-0 h-1.5 translate-y-1.5 group-hover:translate-y-0 transition-transform duration-500"
                        style={{ background: 'linear-gradient(90deg, #B4770E 0%, #D4A84E 50%, #B4770E 100%)' }}
                      />
                    </div>
                    <div className="space-y-1 px-0.5">
                      <h3
                        className="text-[10px] xl:text-[11px] uppercase tracking-[0.15em] font-semibold text-black/70 group-hover:text-[#B4770E] transition-all duration-300 text-center leading-tight group-hover:tracking-[0.2em]"
                      >
                        {offer.title}
                      </h3>
                      <div className="flex justify-center">
                        <div
                          className="h-[2px] w-0 group-hover:w-8 transition-all duration-700"
                          style={{
                            background: 'linear-gradient(90deg, transparent 0%, #B4770E 50%, transparent 100%)',
                          }}
                        />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-4 flex items-center justify-center gap-2 text-center shrink-0"
              >
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-black/10" />
                <p className="text-[9px] uppercase tracking-[0.25em] font-semibold" style={{ color: ACCENT }}>
                  Handpicked for You
                </p>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-black/10" />
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
