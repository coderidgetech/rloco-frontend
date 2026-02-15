import { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { MobileSubPageHeader } from '@/app/components/mobile/MobileSubPageHeader';
import { EmptyState } from '@/app/components/mobile/EmptyState';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Review {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  images?: string[];
}

const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Elegant Silk Dress',
    productImage: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80',
    rating: 5,
    title: 'Absolutely beautiful!',
    comment: 'The quality is amazing and the fit is perfect. Highly recommend!',
    date: '2024-01-15',
  },
  {
    id: '2',
    productId: '2',
    productName: 'Classic Leather Handbag',
    productImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80',
    rating: 4,
    title: 'Great quality',
    comment: 'Love the design and leather quality. Slightly smaller than expected but still great.',
    date: '2024-01-10',
  },
];

export function MobileReviewsPage() {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const navigate = useNavigate();

  const handleDelete = (id: string) => {
    setReviews(reviews.filter((review) => review.id !== id));
    toast.success('Review deleted');
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            className={star <= rating ? 'fill-primary text-primary' : 'text-foreground/20'}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-20" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      <MobileSubPageHeader onBack={() => navigate('/account')} />

      <div className="pt-[100px]">{/* Header + safe area */}
        {/* Header */}
        <div className="bg-white p-4 border-b border-border/20">
          <h1 className="text-2xl font-medium mb-1">My Reviews</h1>
          <p className="text-sm text-foreground/60">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} written
          </p>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="pt-20">
            <EmptyState
              type="reviews"
              title="No reviews yet"
              description="Purchase products to leave reviews"
            />
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl border border-border/30 shadow-sm overflow-hidden"
              >
                {/* Product Info */}
                <div className="flex items-center gap-3 p-4 border-b border-border/10">
                  <img
                    src={review.productImage}
                    alt={review.productName}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{review.productName}</p>
                    <p className="text-xs text-foreground/50">{review.date}</p>
                  </div>
                </div>

                {/* Review Content */}
                <div className="p-4">
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(review.rating)}
                    <span className="text-sm font-medium">{review.rating}.0</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-medium mb-2">{review.title}</h3>

                  {/* Comment */}
                  <p className="text-sm text-foreground/70 mb-3">{review.comment}</p>

                  {/* Images if any */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
                      {review.images.map((image, idx) => (
                        <img
                          key={idx}
                          src={image}
                          alt={`Review ${idx + 1}`}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                        />
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-border/10">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-border/30 rounded-xl text-sm font-medium active:bg-foreground/5 transition-colors">
                      <Edit2 size={16} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-red-200 text-red-600 rounded-xl active:bg-red-50 transition-colors"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}