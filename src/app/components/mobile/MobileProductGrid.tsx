import { useNavigate } from 'react-router-dom';
import { MobileProductCard, MobileProductCardData } from './MobileProductCard';

interface MobileProductGridProps {
  products: MobileProductCardData[];
  title?: string;
  /** Max items to show in the section (rest behind "Show more"). */
  maxItems?: number;
  /** Route the "Show more" link navigates to. */
  seeAllLink?: string;
  /** Override the default title classes (e.g. for a more compact heading). */
  titleClassName?: string;
  /** Override the default spacing below the title row. */
  headerClassName?: string;
  /** Override the default outer section padding. */
  className?: string;
}

export function MobileProductGrid({
  products = [],
  title,
  maxItems = 4,
  seeAllLink,
  titleClassName,
  headerClassName,
  className,
}: MobileProductGridProps) {
  const navigate = useNavigate();

  const shown = products.slice(0, maxItems);
  const hasMore = seeAllLink != null && products.length > maxItems;

  return (
    <div className={`w-full bg-white ${className || 'py-6'}`}>
      {title && (
        <div className={`px-4 flex items-center justify-between ${headerClassName || 'mb-2.5'}`}>
          <h2 className={titleClassName || 'text-base font-medium tracking-wide'}>{title}</h2>
          {hasMore && (
            <button
              onClick={() => navigate(seeAllLink!)}
              className="text-sm font-medium text-primary active:opacity-70"
            >
              Show more
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 px-4">
        {shown.map((product, index) => (
          <MobileProductCard key={`${product.id}-${index}`} product={product} index={index} />
        ))}
      </div>
    </div>
  );
}
