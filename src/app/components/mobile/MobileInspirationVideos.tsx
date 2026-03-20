import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Heart, Share2, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { videoService, InspirationVideo } from '@/app/services/videoService';

export function MobileInspirationVideos() {
  const [videos, setVideos] = useState<InspirationVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await videoService.list({ limit: 20 });
        const list = response?.videos || [];
        setVideos(list);
        if (list.length > 0) setCurrentIndex(0);
      } catch (err) {
        console.error('Failed to fetch inspiration videos:', err);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="bg-foreground/5 py-5">
        <div className="px-4 mb-3">
          <h2 className="text-xl font-medium mb-1">Style Inspiration</h2>
          <p className="text-sm text-foreground/60">Discover trends and styling tips</p>
        </div>
        <div className="h-80 mx-4 rounded-2xl bg-muted animate-pulse flex items-center justify-center">
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  const currentVideo = videos[currentIndex];

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
    }
    if (isDownSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
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

  const handleBrowseCategory = () => {
    navigate(`/all-products?category=${encodeURIComponent(currentVideo.category)}`);
  };

  return (
    <div className="bg-foreground/5 py-4 sm:py-5">
      <div className="px-4 mb-3">
        <h2 className="text-lg sm:text-xl font-medium mb-0.5 sm:mb-1">Style Inspiration</h2>
        <p className="text-xs sm:text-sm text-foreground/60">Discover trends and styling tips</p>
      </div>

      <div className="relative px-4">
        <div
          className="relative bg-black rounded-xl sm:rounded-2xl overflow-hidden mx-auto max-h-[70vh] w-full max-w-[280px] sm:max-w-[320px]"
          style={{ aspectRatio: '9/16' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
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
                src={currentVideo.thumbnail_url}
                alt={currentVideo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
            </motion.div>
          </AnimatePresence>

          <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex items-start justify-between z-10">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full bg-gradient-to-br from-primary to-primary/60 border-2 border-white" />
              <div className="min-w-0">
                <p className="text-white text-xs sm:text-sm font-medium truncate">
                  @{currentVideo.uploaded_by_name || currentVideo.category?.toLowerCase().replace(/\s/g, '_') || 'rloco'}
                </p>
                <p className="text-white/80 text-[10px] sm:text-xs truncate">{currentVideo.category}</p>
              </div>
            </div>
            <button
              onClick={() => setMuted(!muted)}
              className="w-10 h-10 sm:w-9 sm:h-9 shrink-0 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center touch-manipulation"
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? (
                <VolumeX size={18} className="text-white" />
              ) : (
                <Volume2 size={18} className="text-white" />
              )}
            </button>
          </div>

          <div className="absolute bottom-3 left-3 right-16 sm:bottom-4 sm:left-4 sm:right-20 z-10">
            <p className="text-white text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">{currentVideo.title}</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleBrowseCategory}
              className="bg-white text-foreground px-3 py-2 sm:px-4 rounded-full text-[11px] sm:text-xs font-medium flex items-center gap-1.5 touch-manipulation min-h-[40px]"
            >
              Shop {currentVideo.category}
            </motion.button>
          </div>

          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex flex-col gap-3 sm:gap-4 z-10">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className="flex flex-col items-center touch-manipulation"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-0.5 sm:mb-1">
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
                {liked.has(currentVideo.id) ? '1' : '0'}
              </span>
            </motion.button>

            <button className="flex flex-col items-center touch-manipulation" aria-label="Share">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Share2 size={20} className="sm:w-[22px] sm:h-[22px] text-white" />
              </div>
            </button>
          </div>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5 z-10 flex-wrap justify-center max-w-[90%]">
            {videos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`shrink-0 h-1 sm:h-1.5 rounded-full transition-all touch-manipulation ${
                  index === currentIndex ? 'w-5 sm:w-6 bg-white' : 'w-1 bg-white/40'
                }`}
                aria-label={`Video ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {currentIndex === 0 && videos.length > 1 && (
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
