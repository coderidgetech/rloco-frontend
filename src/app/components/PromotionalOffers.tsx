import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface Offer {
  id: number;
  title: string;
  discount: string;
  image: string;
  category: string;
  gender: string;
}

interface PromotionalOffersProps {
  filterGender?: 'women' | 'men' | 'all';
  selectedCategory?: string;
}

const offers: Offer[] = [
  // WOMEN'S CATEGORIES
  {
    id: 1,
    title: 'Dresses',
    discount: '40-70% OFF',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80',
    category: 'Dresses',
    gender: 'women',
  },
  {
    id: 2,
    title: 'Tops & Blouses',
    discount: '50-80% OFF',
    image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&q=80',
    category: 'Tops',
    gender: 'women',
  },
  {
    id: 3,
    title: 'Outerwear',
    discount: '40-60% OFF',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
    category: 'Outerwear',
    gender: 'women',
  },
  {
    id: 4,
    title: 'Jewelry',
    discount: '50-70% OFF',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
    category: 'Jewelry',
    gender: 'women',
  },
  {
    id: 5,
    title: 'Beauty',
    discount: '30-60% OFF',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80',
    category: 'Beauty',
    gender: 'women',
  },
  {
    id: 6,
    title: 'Footwear',
    discount: '40-80% OFF',
    image: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&q=80',
    category: 'Footwear',
    gender: 'women',
  },
  {
    id: 7,
    title: 'Handbags',
    discount: '40-70% OFF',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80',
    category: 'Accessories',
    gender: 'women',
  },
  {
    id: 8,
    title: 'Pants & Trousers',
    discount: '40-70% OFF',
    image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80',
    category: 'Pants',
    gender: 'women',
  },
  {
    id: 9,
    title: 'Skirts',
    discount: '40-70% OFF',
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80',
    category: 'Skirts',
    gender: 'women',
  },
  
  // MEN'S CATEGORIES
  {
    id: 10,
    title: 'T-Shirts',
    discount: '40-80% OFF',
    image: 'https://images.unsplash.com/photo-1759933318666-97a7e86c4d76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJpcGVkJTIwdHNoaXJ0JTIwZmFzaGlvbnxlbnwxfHx8fDE3NjgwMzk2NjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'T-Shirts',
    gender: 'men',
  },
  {
    id: 11,
    title: 'Shirts',
    discount: '40-80% OFF',
    image: 'https://images.unsplash.com/photo-1657405592096-0eb9199a8634?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBzaGlydCUyMG1hbnxlbnwxfHx8fDE3NjgwMzk2NjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Shirts',
    gender: 'men',
  },
  {
    id: 12,
    title: 'Jeans',
    discount: '40-80% OFF',
    image: 'https://images.unsplash.com/photo-1602585198422-d795fa9bfd6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGplYW5zJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjgwMTMyMTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Jeans',
    gender: 'men',
  },
  {
    id: 13,
    title: 'Trousers',
    discount: '40-70% OFF',
    image: 'https://images.unsplash.com/photo-1765871903745-804b6d83324c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwZm9ybWFsJTIwcGFudHMlMjB0cm91c2Vyc3xlbnwxfHx8fDE3NjgwNDI1MDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Trousers',
    gender: 'men',
  },
  {
    id: 14,
    title: 'Jackets',
    discount: '40-60% OFF',
    image: 'https://images.unsplash.com/photo-1589591990984-68a20755020d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwbGVhdGhlciUyMGphY2tldHxlbnwxfHx8fDE3NjgwNDI1MTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Outerwear',
    gender: 'men',
  },
  {
    id: 15,
    title: 'Footwear',
    discount: '40-80% OFF',
    image: 'https://images.unsplash.com/photo-1760616172899-0681b97a2de3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwZHJlc3MlMjBzaG9lcyUyMGJsYWNrJTIwbGVhdGhlcnxlbnwxfHx8fDE3NjgwNDI1MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Footwear',
    gender: 'men',
  },
  {
    id: 16,
    title: 'Watches',
    discount: '30-50% OFF',
    image: 'https://images.unsplash.com/photo-1751437797070-54ac95740dac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwbHV4dXJ5JTIwd2F0Y2h8ZW58MXx8fHwxNzY4MDQyNTE2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Accessories',
    gender: 'men',
  },
  {
    id: 17,
    title: 'Sportswear',
    discount: 'UP TO 80% OFF',
    image: 'https://images.unsplash.com/photo-1764698403474-de152b479d59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBhdGhsZXRpYyUyMHNwb3J0c3dlYXJ8ZW58MXx8fHwxNzY4MDQyNTE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Activewear',
    gender: 'men',
  },
  {
    id: 18,
    title: 'Formal Wear',
    discount: '40-70% OFF',
    image: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=600&q=80',
    category: 'Formal Wear',
    gender: 'men',
  },
];

export function PromotionalOffers({ filterGender = 'all', selectedCategory }: PromotionalOffersProps) {
  const navigate = useNavigate();

  const handleOfferClick = (offer: Offer) => {
    navigate(`/category/${offer.gender}/${offer.category.toLowerCase()}`);
  };

  return (
    <section className="py-4 bg-[#f5f3e8] relative overflow-hidden mb-6">
      <div className="max-w-[1920px] mx-auto px-4 md:px-8">
        {/* Horizontal Scrollable Offers */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {offers
            .filter((offer) => filterGender === 'all' || offer.gender === filterGender)
            .map((offer, index) => {
              const isActive = selectedCategory?.toLowerCase() === offer.category.toLowerCase();
              return (
            <motion.button
              key={offer.id}
              onClick={() => handleOfferClick(offer)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.02 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex-shrink-0 w-[90px] sm:w-[100px] md:w-[110px]"
            >
              {/* Brand Border Frame - Only show on active category */}
              {isActive && (
                <div className="absolute inset-0 border-2 border-primary z-10 pointer-events-none" />
              )}

              {/* Image Container */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <motion.img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.6 }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              </div>

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-1.5 text-center z-20">
                {/* Title */}
                <h3 className="text-white font-semibold text-[9px] sm:text-[10px] mb-0.5 tracking-wide leading-tight">
                  {offer.title}
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