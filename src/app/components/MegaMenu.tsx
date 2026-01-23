import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useSiteConfig } from '../context/SiteConfigContext';

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

const categoryOffers = {
  women: [
    {
      id: 1,
      title: 'Dresses',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
      category: 'Dresses',
    },
    {
      id: 2,
      title: 'Tops & Blouses',
      image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&q=80',
      category: 'Tops',
    },
    {
      id: 3,
      title: 'Outerwear',
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
      category: 'Outerwear',
    },
    {
      id: 4,
      title: 'Jewelry',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
      category: 'Jewelry',
    },
    {
      id: 5,
      title: 'Beauty',
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80',
      category: 'Beauty',
    },
    {
      id: 6,
      title: 'Footwear',
      image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&q=80',
      category: 'Footwear',
    },
    {
      id: 7,
      title: 'Handbags',
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80',
      category: 'Accessories',
    },
    {
      id: 8,
      title: 'Pants & Trousers',
      image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80',
      category: 'Pants',
    },
    {
      id: 9,
      title: 'Skirts',
      image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80',
      category: 'Skirts',
    },
  ],
  men: [
    {
      id: 1,
      title: 'T-Shirts',
      image: 'https://images.unsplash.com/photo-1759933318666-97a7e86c4d76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJpcGVkJTIwdHNoaXJ0JTIwZmFzaGlvbnxlbnwxfHx8fDE3NjgwMzk2NjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'T-Shirts',
    },
    {
      id: 2,
      title: 'Shirts',
      image: 'https://images.unsplash.com/photo-1657405592096-0eb9199a8634?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBzaGlydCUyMG1hbnxlbnwxfHx8fDE3NjgwMzk2NjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Shirts',
    },
    {
      id: 3,
      title: 'Jeans',
      image: 'https://images.unsplash.com/photo-1602585198422-d795fa9bfd6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGplYW5zJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjgwMTMyMTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Jeans',
    },
    {
      id: 4,
      title: 'Trousers',
      image: 'https://images.unsplash.com/photo-1719736444029-614f46b6b435?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWlnZSUyMHRyb3VzZXJzJTIwcGFudHN8ZW58MXx8fHwxNzY4MDM5NjYzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Trousers',
    },
    {
      id: 5,
      title: 'Jackets',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',
      category: 'Outerwear',
    },
    {
      id: 6,
      title: 'Footwear',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80',
      category: 'Footwear',
    },
    {
      id: 7,
      title: 'Watches',
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80',
      category: 'Accessories',
    },
    {
      id: 8,
      title: 'Sportswear',
      image: 'https://images.unsplash.com/photo-1760736534441-4d14bf11103e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFjayUyMHBhbnRzJTIwYWN0aXZld2VhcnxlbnwxfHx8fDE3NjgwMzk2NjN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      category: 'Activewear',
    },
    {
      id: 9,
      title: 'Formal Wear',
      image: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=600&q=80',
      category: 'Formal Wear',
    },
  ],
};

export function MegaMenu({ isOpen, gender, onClose, onCategoryClick }: MegaMenuProps) {
  const navigate = useNavigate();
  const offers = categoryOffers[gender];

  const handleOfferClick = (offer: CategoryOffer) => {
    if (onCategoryClick) {
      onCategoryClick(gender, offer.category);
    }
    onClose();
  };

  const handleViewAll = () => {
    if (onCategoryClick) {
      onCategoryClick(gender);
    }
    onClose();
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Overlay - Only covers below navigation, hidden on mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden md:block fixed inset-0 z-30"
            style={{
              top: '72px',
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(50px)',
              WebkitBackdropFilter: 'blur(50px)',
              pointerEvents: 'auto'
            }}
            onClick={onClose}
          />
          
          {/* Mega Menu - Enhanced Glass Morphism Design */}
          <motion.div
            key={gender}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block fixed z-40"
            style={{
              top: '72px',
              left: 0,
              right: 0,
              width: '100vw',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(80px) saturate(200%)',
              WebkitBackdropFilter: 'blur(80px) saturate(200%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.6)',
              pointerEvents: 'auto'
            }}
            onMouseLeave={onClose}
          >
            <div className="w-full px-8 md:px-12 lg:px-16 xl:px-20 py-4 md:py-5">
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <p className="text-[9px] uppercase tracking-[0.3em] text-foreground/50 mb-1">Explore</p>
                  <h2 className="text-xl md:text-2xl tracking-tight font-light">
                    {gender === 'women' ? "Women's Collection" : "Men's Collection"}
                  </h2>
                </motion.div>
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  onClick={handleViewAll}
                  className="text-[10px] uppercase tracking-[0.2em] text-foreground/70 hover:text-foreground transition-colors flex items-center gap-2 group pb-0.5 border-b border-foreground/20 hover:border-foreground"
                >
                  <span>View All</span>
                  <svg 
                    width="12" 
                    height="12" 
                    viewBox="0 0 16 16" 
                    fill="none"
                    className="group-hover:translate-x-1 transition-transform duration-300"
                  >
                    <path
                      d="M6 3L11 8L6 13"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.button>
              </div>

              {/* Category Grid */}
              <div className="grid grid-cols-4 lg:grid-cols-6 gap-x-3 gap-y-4">
                {offers.map((offer, index) => (
                  <motion.button
                    key={offer.id}
                    onClick={() => handleOfferClick(offer)}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: 0.05 + (index * 0.03),
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="group relative text-left"
                  >
                    {/* Image Container - Professional Design */}
                    <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-white mb-2 border border-black/10 group-hover:border-black/30 transition-all duration-500 shadow-sm group-hover:shadow-lg">
                      <img
                        src={offer.image}
                        alt={offer.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      
                      {/* Gradient Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* View Button - appears on hover */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <span className="bg-white text-black px-3 py-1.5 text-[9px] uppercase tracking-[0.25em] font-semibold shadow-xl border border-black/5">
                          View
                        </span>
                      </div>
                    </div>

                    {/* Category Title */}
                    <div className="space-y-0.5">
                      <h3 className="text-[10px] uppercase tracking-[0.16em] font-semibold text-black/70 group-hover:text-black transition-colors duration-300">
                        {offer.title}
                      </h3>
                      <div className="h-[1px] bg-gradient-to-r from-black/15 to-transparent w-0 group-hover:w-full transition-all duration-700" />
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Bottom Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="mt-4 pt-4 border-t border-foreground/10 flex items-center justify-center gap-6 text-center"
              >
                <div className="flex items-center gap-1.5 text-[10px] text-foreground/60 uppercase tracking-wider">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>Free Shipping Over $100</span>
                </div>
                <div className="w-px h-3 bg-foreground/10" />
                <div className="flex items-center gap-1.5 text-[10px] text-foreground/60 uppercase tracking-wider">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 11 12 14 22 4"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                  <span>30-Day Returns</span>
                </div>
                <div className="w-px h-3 bg-foreground/10" />
                <div className="flex items-center gap-1.5 text-[10px] text-foreground/60 uppercase tracking-wider">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <span>Secure Checkout</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}