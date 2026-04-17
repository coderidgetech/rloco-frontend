import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { easing } from '../utils/luxuryAnimations';
import { videoService, InspirationVideo } from '@/app/services/videoService';
import { useIsMobile } from '@/app/hooks/useIsMobile';

interface InspirationVideosProps {
  videos?: InspirationVideo[];
}

export function InspirationVideos({ videos: propVideos }: InspirationVideosProps) {
  const isMobile = useIsMobile(768);
  const [videos, setVideos] = useState<InspirationVideo[]>(propVideos || []);
  const [loading, setLoading] = useState(!propVideos);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch videos from API if not provided
  useEffect(() => {
    if (!propVideos) {
      const fetchVideos = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await videoService.list({ limit: 20 });
          // Transform API response to component format
          const transformedVideos = (response?.videos || []).map(v => ({
            id: v.id,
            title: v.title,
            videoUrl: v.video_url,
            thumbnailUrl: v.thumbnail_url,
            category: v.category,
            featured: v.featured,
            createdAt: v.created_at,
            uploadedBy: v.uploaded_by_name,
          }));
          setVideos(transformedVideos);
        } catch (err: any) {
          console.error('Failed to fetch inspiration videos:', err);
          setError('Failed to load videos');
          setVideos([]);
        } finally {
          setLoading(false);
        }
      };
      fetchVideos();
    }
  }, [propVideos]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [direction, setDirection] = useState(0); // Track animation direction
  const videoRef = useRef<HTMLVideoElement>(null);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const totalVideos = videos.length;
  const peekCount = isMobile ? 1 : 2; // mobile: 3 cards (1 each side), desktop: 5 cards
  const MAX_VIDEO_DURATION = 10;

  // Video playback effect - MUST be before any conditional return (Rules of Hooks)
  useEffect(() => {
    if (loading || totalVideos === 0) return;
    setIsPlaying(false);
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        autoAdvanceTimerRef.current = setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % totalVideos);
        }, MAX_VIDEO_DURATION * 1000);
      }).catch(() => setIsPlaying(false));
    }
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
        autoAdvanceTimerRef.current = null;
      }
    };
  }, [loading, currentIndex, totalVideos]);

  // Show loading state
  if (loading) {
    return (
      <div className="w-full py-12 flex items-center justify-center">
        <div className="text-muted-foreground">Loading videos...</div>
      </div>
    );
  }

  // Don't render section when no videos (API data only)
  if (videos.length === 0) {
    return null;
  }

  const handlePrevious = () => {
    setDirection(-1); // Moving backward
    setCurrentIndex((prev) => (prev === 0 ? totalVideos - 1 : prev - 1));
    setIsPlaying(false);
    // Clear auto-advance timer when manually navigating
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  };

  const handleNext = () => {
    setDirection(1); // Moving forward
    setCurrentIndex((prev) => (prev + 1) % totalVideos); // Infinite loop
    setIsPlaying(false);
    // Clear auto-advance timer when manually navigating
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const getVisibleVideos = () => {
    const visible = [];
    for (let i = -peekCount; i <= peekCount; i++) {
      const index = (currentIndex + i + totalVideos) % totalVideos;
      visible.push({ ...videos[index], position: i, originalIndex: index });
    }
    return visible;
  };
  const slideOffset = isMobile ? 120 : 300;

  const visibleVideos = getVisibleVideos();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden py-6 sm:py-8 md:py-12">
      <div className="w-full px-3 sm:px-4 md:px-6 flex flex-col items-center justify-center min-h-0 flex-1">
        {/* Header */}
        <ScrollReveal direction="up" className="text-center mb-3 sm:mb-4 md:mb-6 shrink-0">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[10px] md:text-xs tracking-[0.3em] text-muted-foreground mb-1 uppercase"
          >
            Style
          </motion.p>
          <h2 className="text-xl md:text-2xl lg:text-3xl tracking-wider uppercase font-light">
            INSPIRATION
          </h2>
        </ScrollReveal>

        {/* Video Carousel */}
        <div className="relative w-full max-w-7xl mx-auto flex-1 flex items-center justify-center min-h-0 max-h-[68vh] sm:max-h-[72vh] md:max-h-[75vh]">
          {/* Navigation - larger touch targets on mobile */}
          <motion.button
            whileHover={{ scale: 1.1, x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            className="absolute left-1 sm:left-2 md:left-0 lg:-left-16 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/95 dark:bg-gray-800/95 shadow-lg border border-gray-200/80 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-all touch-manipulation"
            aria-label="Previous video"
          >
            <ChevronLeft size={22} className="text-gray-600 dark:text-gray-300" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, x: 4 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="absolute right-1 sm:right-2 md:right-0 lg:-right-16 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-white/95 dark:bg-gray-800/95 shadow-lg border border-gray-200/80 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-all touch-manipulation"
            aria-label="Next video"
          >
            <ChevronRight size={22} className="text-gray-600 dark:text-gray-300" />
          </motion.button>

          {/* Videos Grid - tighter on mobile */}
          <div className={`flex items-center justify-center overflow-hidden h-full w-full ${isMobile ? 'gap-1.5 px-14 sm:px-16' : 'gap-2 md:gap-4 lg:gap-6 px-12 md:px-10 lg:px-0'}`}>
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              {visibleVideos.map((video) => {
                const isCenterVideo = video.position === 0;
                const isAdjacentVideo = Math.abs(video.position) === 1;
                const isEdgeVideo = Math.abs(video.position) === 2;
                
                return (
                  <motion.div
                    key={`${video.id}-${video.position}`}
                    custom={direction}
                    initial={{ 
                      x: direction > 0 ? slideOffset : -slideOffset,
                      opacity: 0,
                      scale: 0.8 
                    }}
                    animate={{ 
                      x: 0,
                      opacity: isCenterVideo ? 1 : (isAdjacentVideo ? 0.7 : 0.5),
                      scale: isCenterVideo ? 1 : (isAdjacentVideo ? 0.8 : 0.65),
                    }}
                    exit={{ 
                      x: direction > 0 ? -slideOffset : slideOffset,
                      opacity: 0,
                      scale: 0.8 
                    }}
                    transition={{ 
                      duration: 0.6, 
                      ease: easing.luxury,
                      x: { type: "spring", stiffness: 300, damping: 30 }
                    }}
                    className={`relative aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden bg-muted shrink-0 ${
                      isCenterVideo 
                        ? 'h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] shadow-2xl' 
                        : (isAdjacentVideo ? 'h-[34vh] sm:h-[38vh] md:h-[45vh] lg:h-[48vh] shadow-lg' : 'h-[26vh] sm:h-[30vh] md:h-[35vh] lg:h-[38vh] shadow-md')
                    }`}
                    onClick={() => {
                      if (!isCenterVideo) {
                        setCurrentIndex(video.originalIndex);
                      }
                    }}
                    style={{ cursor: !isCenterVideo ? 'pointer' : 'default' }}
                  >
                    {isCenterVideo ? (
                      <>
                        {/* Video Element */}
                        <video
                          ref={videoRef}
                          src={video.videoUrl}
                          poster={video.thumbnailUrl}
                          className="absolute inset-0 w-full h-full object-cover"
                          playsInline
                          muted={isMuted}
                          onClick={togglePlay}
                          onError={(e) => {
                            // Fallback to thumbnail if video fails to load
                            console.error('Video failed to load:', video.videoUrl);
                            e.currentTarget.style.display = 'none';
                          }}
                          onEnded={() => {
                            // Auto-scroll to next video when current video ends
                            const nextIndex = (currentIndex + 1) % videos.length;
                            setCurrentIndex(nextIndex);
                          }}
                        />

                        {/* Fallback Thumbnail */}
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          style={{ zIndex: -1 }}
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                        {/* Video Title */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 text-white pointer-events-none">
                          <h3 className="text-sm sm:text-base md:text-lg font-medium tracking-wide mb-0.5 sm:mb-1 line-clamp-2">
                            {video.title}
                          </h3>
                          <p className="text-[10px] md:text-xs text-white/80 uppercase tracking-wider">
                            {video.category}
                          </p>
                        </div>

                        {/* Play/Pause - Top Left */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePlay();
                          }}
                          className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg sm:rounded-xl bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/50 transition-all z-10 touch-manipulation"
                        >
                          {isPlaying ? (
                            <Pause className="text-white" size={18} />
                          ) : (
                            <Play className="text-white ml-0.5" size={18} />
                          )}
                        </motion.button>

                        {/* Mute - Bottom Right */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMute();
                          }}
                          className="absolute bottom-14 sm:bottom-[72px] md:bottom-20 right-2 sm:right-3 md:right-4 w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-lg sm:rounded-xl bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/50 transition-all z-10 touch-manipulation"
                        >
                          {isMuted ? (
                            <VolumeX className="text-white" size={16} />
                          ) : (
                            <Volume2 className="text-white" size={16} />
                          )}
                        </motion.button>
                      </>
                    ) : (
                      <>
                        {/* Thumbnail for side videos */}
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Dots - scrollable on mobile when many */}
        <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6 w-full max-w-2xl overflow-x-auto overflow-y-hidden py-2 px-2 scrollbar-hide">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 min-w-max mx-auto">
            {videos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsPlaying(false);
                }}
                className={`shrink-0 rounded-full transition-all touch-manipulation ${
                  idx === currentIndex 
                    ? 'h-2 w-6 sm:w-8 bg-[#B4770E]' 
                    : 'h-1.5 w-1.5 sm:h-2 sm:w-2 bg-border hover:bg-muted-foreground'
                }`}
                aria-label={`Go to video ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Text */}
        <ScrollReveal direction="up" delay={0.2} className="text-center mt-3 sm:mt-4 px-2">
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto">
            Discover the latest trends and styling inspiration from our community. 
            Get inspired by real fashion moments and elevate your style.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}