import { useNavigate } from 'react-router-dom';

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

  const visible = tiles.filter(
    (t) => filterGender === 'all' || t.gender === filterGender,
  );

  return (
    <section className="border-b border-foreground/5 mb-3">
      <div className="page-container py-2.5">
        <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
          {visible.map((tile) => {
            const isActive =
              selectedCategory?.toLowerCase() === tile.category.toLowerCase();
            return (
              <button
                key={tile.id}
                type="button"
                onClick={() =>
                  navigate(`/category/${tile.gender}/${tile.category.toLowerCase()}`)
                }
                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition-all ${
                  isActive
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-foreground/15 text-foreground/70 hover:border-foreground/40 hover:text-foreground'
                }`}
              >
                {tile.title}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
