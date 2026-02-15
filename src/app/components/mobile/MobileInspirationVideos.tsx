import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Volume2, VolumeX, ShoppingBag, Play, Pause } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Video {
  id: number;
  url: string;
  thumbnail: string;
  username: string;
  caption: string;
  likes: number;
  comments: number;
  products: Array<{
    id: number;
    name: string;
    price: number;
  }>;
}

// Mock video data
const videos: Video[] = [
  {
    id: 1,
    url: 'https://example.com/video1.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=700&fit=crop',
    username: 'fashionista_style',
    caption: 'Summer vibes ☀️ Perfect outfit for beach days!',
    likes: 1245,
    comments: 89,
    products: [
      { id: 1, name: 'Linen Dress', price: 89 },
      { id: 2, name: 'Straw Hat', price: 45 },
    ],
  },
  {
    id: 2,
    url: 'https://example.com/video2.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=700&fit=crop',
    username: 'style_insider',
    caption: 'How to style a classic white shirt 3 ways 👕',
    likes: 2156,
    comments: 145,
    products: [
      { id: 3, name: 'White Shirt', price: 69 },
      { id: 4, name: 'Black Pants', price: 99 },
    ],
  },
  {
    id: 3,
    url: 'https://example.com/video3.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=700&fit=crop',
    username: 'urban_looks',
    caption: 'Street style essentials 🔥 Tap to shop the look',
    likes: 3421,
    comments: 234,
    products: [
      { id: 5, name: 'Leather Jacket', price: 199 },
      { id: 6, name: 'Sneakers', price: 129 },
    ],
  },
  {
    id: 4,
    url: 'https://example.com/video4.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&h=700&fit=crop',
    username: 'minimal_chic',
    caption: 'Minimalist wardrobe essentials 🤍',
    likes: 1876,
    comments: 98,
    products: [
      { id: 7, name: 'Cashmere Sweater', price: 159 },
      { id: 8, name: 'Wool Pants', price: 119 },
    ],
  },
];

export function MobileInspirationVideos() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [showProducts, setShowProducts] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const navigate = useNavigate();

  const currentVideo = videos[currentIndex];

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > 50;
    const isDownSwipe = distance < -50;

    if (isUpSwipe && currentIndex < videos.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowProducts(false);
    }
    if (isDownSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowProducts(false);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleLike = () => {
    const newLiked = new Set(liked);
    if (liked.has(currentVideo.id)) {
      newLiked.delete(currentVideo.id);
    } else {
      newLiked.add(currentVideo.id);
    }
    setLiked(newLiked);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="bg-foreground/5 py-5">
      <div className="px-4 mb-3">
        <h2 className="text-xl font-medium mb-1">Style Inspiration</h2>
        <p className="text-sm text-foreground/60">Discover trends and styling tips</p>
      </div>

      {/* Video Container */}
      <div className="relative">
        <div
          className="relative bg-black rounded-2xl mx-4 overflow-hidden"
          style={{ aspectRatio: '9/16' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Video/Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentVideo.id}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <img
                src={currentVideo.thumbnail}
                alt={currentVideo.caption}
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
            </motion.div>
          </AnimatePresence>

          {/* Top Info */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 border-2 border-white" />
              <div>
                <p className="text-white text-sm font-medium">@{currentVideo.username}</p>
                <p className="text-white/80 text-xs">Follow</p>
              </div>
            </div>
            <button
              onClick={() => setMuted(!muted)}
              className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              {muted ? (
                <VolumeX size={18} className="text-white" />
              ) : (
                <Volume2 size={18} className="text-white" />
              )}
            </button>
          </div>

          {/* Bottom Info */}
          <div className="absolute bottom-4 left-4 right-20 z-10">
            <p className="text-white text-sm mb-3 line-clamp-2">{currentVideo.caption}</p>
            
            {/* Shop Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProducts(!showProducts)}
              className="bg-white text-foreground px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5"
            >
              <ShoppingBag size={14} />
              Shop This Look
            </motion.button>
          </div>

          {/* Right Actions */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-4 z-10">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className="flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-1">
                <Heart
                  size={22}
                  className={
                    liked.has(currentVideo.id)
                      ? 'text-red-500 fill-red-500'
                      : 'text-white'
                  }
                />
              </div>
              <span className="text-white text-xs font-medium">
                {formatNumber(
                  currentVideo.likes + (liked.has(currentVideo.id) ? 1 : 0)
                )}
              </span>
            </motion.button>

            <button className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-1">
                <MessageCircle size={22} className="text-white" />
              </div>
              <span className="text-white text-xs font-medium">
                {formatNumber(currentVideo.comments)}
              </span>
            </button>

            <button className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Share2 size={22} className="text-white" />
              </div>
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {videos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1 rounded-full transition-all ${
                  index === currentIndex ? 'w-6 bg-white' : 'w-1 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Products Bottom Sheet */}
        <AnimatePresence>
          {showProducts && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowProducts(false)}
                className="fixed inset-0 bg-black/40 z-40"
              />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl max-h-[70vh] overflow-auto"
                style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
              >
                <div className="p-4 border-b border-border/20">
                  <div className="w-12 h-1 bg-foreground/20 rounded-full mx-auto mb-4" />
                  <h3 className="text-lg font-medium">Shop This Look</h3>
                </div>
                <div className="p-4 space-y-3">
                  {currentVideo.products.map((product) => (
                    <motion.div
                      key={product.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        navigate(`/product/${product.id}`);
                        setShowProducts(false);
                      }}
                      className="flex items-center gap-3 p-3 bg-foreground/5 rounded-xl"
                    >
                      <div className="w-16 h-16 bg-muted rounded-lg" />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{product.name}</h4>
                        <p className="text-primary font-semibold mt-1">
                          ${product.price}
                        </p>
                      </div>
                      <button className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center">
                        <ShoppingBag size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Swipe Hint */}
      {currentIndex === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-center mt-4 px-4"
        >
          <p className="text-xs text-foreground/50">Swipe up for more ↑</p>
        </motion.div>
      )}
    </div>
  );
}