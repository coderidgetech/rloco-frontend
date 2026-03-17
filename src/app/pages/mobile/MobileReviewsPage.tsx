import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Edit2, Trash2, X } from 'lucide-react';
import { MobileSubPageHeader } from '@/app/components/mobile/MobileSubPageHeader';
import { useIsMobile } from '@/app/hooks/useIsMobile';
import { EmptyState } from '@/app/components/mobile/EmptyState';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { reviewService, type MyReviewItem } from '@/app/services/reviewService';

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

function mapApiReview(r: MyReviewItem): Review {
  return {
    id: r.id,
    productId: r.product_id,
    productName: r.product_name ?? 'Product',
    productImage: r.product_image ?? '',
    rating: r.rating,
    title: r.title ?? '',
    comment: r.comment ?? '',
    date: r.created_at ? new Date(r.created_at).toISOString().slice(0, 10) : '',
    images: r.images,
  };
}

export function MobileReviewsPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editForm, setEditForm] = useState({ rating: 5, title: '', comment: '' });
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    reviewService
      .getMyReviews({ limit: 50 })
      .then((res) => {
        if (!cancelled) setReviews((res.reviews ?? []).map(mapApiReview));
      })
      .catch(() => {
        if (!cancelled) setReviews([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handleDelete = async (productId: string, reviewId: string) => {
    try {
      await reviewService.delete(productId, reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      toast.success('Review deleted');
    } catch {
      toast.error('Failed to delete review');
    }
  };

  const handleEditOpen = (review: Review) => {
    setEditingReview(review);
    setEditForm({ rating: review.rating, title: review.title, comment: review.comment });
  };

  const handleEditSave = async () => {
    if (!editingReview) return;
    try {
      setEditSaving(true);
      await reviewService.update(editingReview.productId, editingReview.id, {
        rating: editForm.rating,
        title: editForm.title,
        comment: editForm.comment,
      });
      setReviews((prev) =>
        prev.map((r) =>
          r.id === editingReview.id
            ? { ...r, rating: editForm.rating, title: editForm.title, comment: editForm.comment }
            : r
        )
      );
      toast.success('Review updated');
      setEditingReview(null);
    } catch {
      toast.error('Failed to update review');
    } finally {
      setEditSaving(false);
    }
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
    <div className="min-h-screen bg-white dark:bg-background pb-20 md:pb-12" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      {isMobile && <MobileSubPageHeader onBack={() => navigate('/account')} />}

      <div className={isMobile ? 'pt-[100px]' : 'pt-6 max-w-3xl mx-auto px-4'}>{/* Header + safe area */}
        {/* Header */}
        <div className="bg-white p-4 border-b border-border/20">
          <h1 className="text-2xl font-medium mb-1">My Reviews</h1>
          <p className="text-sm text-foreground/60">
            {loading ? 'Loading...' : `${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'} written`}
          </p>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="p-8 text-center text-foreground/60">Loading reviews...</div>
        ) : reviews.length === 0 ? (
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
                  {review.productImage ? (
                    <img
                      src={review.productImage}
                      alt={review.productName}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <Star size={20} className="text-foreground/30" />
                    </div>
                  )}
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
                    <button
                      onClick={() => handleEditOpen(review)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-border/30 rounded-xl text-sm font-medium active:bg-foreground/5 transition-colors"
                    >
                      <Edit2 size={16} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(review.productId, review.id)}
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

      {/* Edit Review Modal */}
      <AnimatePresence>
        {editingReview && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setEditingReview(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Edit Review</h2>
                <button onClick={() => setEditingReview(null)} className="p-2 rounded-full hover:bg-muted">
                  <X size={20} />
                </button>
              </div>
              {/* Star rating selector */}
              <div>
                <p className="text-sm font-medium mb-2">Rating</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setEditForm((f) => ({ ...f, rating: star }))}>
                      <Star
                        size={28}
                        className={star <= editForm.rating ? 'fill-primary text-primary' : 'text-foreground/20'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Title</p>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Title"
                />
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Comment</p>
                <textarea
                  value={editForm.comment}
                  onChange={(e) => setEditForm((f) => ({ ...f, comment: e.target.value }))}
                  rows={4}
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  placeholder="Your review"
                />
              </div>
              <button
                onClick={handleEditSave}
                disabled={editSaving}
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium disabled:opacity-60"
              >
                {editSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}