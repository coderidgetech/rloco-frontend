import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { videoService, InspirationVideo } from '@/app/services/videoService';

export function MobileInspirationVideos() {
  const [videos, setVideos] = useState<InspirationVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const didSwipe = useRef(false);
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
          <h2 className="text-lg font-medium mb-0.5">Style Inspiration</h2>
          <p className="text-xs text-foreground/60">Discover trends and styling tips</p>
        </div>
        <div
          className="mx-auto w-full max-w-[320px] rounded-2xl bg-muted animate-pulse"
          style={{ height: 'min(68svh, 540px)' }}
        />
      </div>
    );
  }

  if (videos.length === 0) return null;

  const currentVideo = videos[currentIndex];

  // Horizontal swipe: the card lives inside a vertically-scrolling feed, so a vertical
  // swipe belongs to the page (scroll). We capture LEFT/RIGHT to change reels and leave
  // vertical panning to the page (via touch-action: pan-y on the card).
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX;
    didSwipe.current = false;
  };
  const handleTouchMove = (e: React.TouchEvent) => { touchEndX.current = e.targetTouches[0].clientX; };
  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    if (Math.abs(distance) > 40) {
      didSwipe.current = true;
      if (distance > 0) setCurrentIndex((i) => (i + 1) % videos.length); // swipe left → next
      else setCurrentIndex((i) => (i - 1 + videos.length) % videos.length); // swipe right → prev
    }
  };

  // Tapping the video (not a control) opens the relevant category page.
  const handleCardTap = () => {
    if (didSwipe.current) { didSwipe.current = false; return; }
    handleBrowseCategory();
  };

  const handleBrowseCategory = () =>
    navigate(`/all-products?category=${encodeURIComponent(currentVideo.category)}`);

  const handle =
    currentVideo.uploaded_by_name ||
    currentVideo.category?.toLowerCase().replace(/\s/g, '_') ||
    'rloko';

  return (
    <div className="bg-foreground/5 py-5">
      <div className="px-4 mb-3">
        <h2 className="text-lg font-medium mb-0.5">Style Inspiration</h2>
        <p className="text-xs text-foreground/60">Discover trends and styling tips</p>
      </div>

      <div className="px-4">
        <div
          className="relative mx-auto w-full max-w-[320px] overflow-hidden rounded-2xl bg-black select-none"
          style={{ height: 'min(68svh, 540px)', touchAction: 'pan-y' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Media — autoplaying video; tap opens the relevant category page */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentVideo.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
              onClick={handleCardTap}
            >
              {currentVideo.video_url ? (
                <video
                  src={currentVideo.video_url}
                  poster={currentVideo.thumbnail_url}
                  className="h-full w-full object-cover"
                  autoPlay
                  loop
                  muted={muted}
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img src={currentVideo.thumbnail_url} alt={currentVideo.title} className="h-full w-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/45 pointer-events-none" />
            </motion.div>
          </AnimatePresence>

          {/* Progress segments (story-style) — top, no longer colliding with the caption */}
          <div className="absolute inset-x-3 top-2.5 z-20 flex gap-1">
            {videos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to video ${i + 1}`}
                className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30"
              >
                <span className={`block h-full w-full rounded-full ${i <= currentIndex ? 'bg-white' : 'bg-transparent'}`} />
              </button>
            ))}
          </div>

          {/* Uploader + mute */}
          <div className="absolute inset-x-3 top-6 z-10 flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <div className="h-8 w-8 shrink-0 rounded-full border border-white/70 bg-gradient-to-br from-primary to-primary/60" />
              <div className="min-w-0 leading-tight">
                <p className="truncate text-xs font-medium text-white">@{handle}</p>
                <p className="truncate text-[10px] text-white/75">{currentVideo.category}</p>
              </div>
            </div>
            <button
              onClick={() => setMuted(!muted)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm"
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
              {muted ? <VolumeX size={17} className="text-white" /> : <Volume2 size={17} className="text-white" />}
            </button>
          </div>

          {/* Caption + CTA */}
          <div className="absolute inset-x-3 bottom-4 z-10">
            <p className="mb-2 line-clamp-2 text-sm text-white">{currentVideo.title}</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleBrowseCategory}
              className="inline-flex items-center rounded-full bg-white px-4 py-2 text-xs font-medium text-foreground"
            >
              Shop {currentVideo.category}
            </motion.button>
          </div>
        </div>

        {videos.length > 1 && (
          <p className="mt-3 text-center text-xs text-foreground/50">← Swipe to explore more →</p>
        )}
      </div>
    </div>
  );
}
