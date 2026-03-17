import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { easing } from '../utils/luxuryAnimations';
import { videoService, InspirationVideo } from '@/app/services/videoService';

interface InspirationVideosProps {
  videos?: InspirationVideo[];
}

export function InspirationVideos({ videos: propVideos }: InspirationVideosProps) {
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
  const itemsToShow = 5;
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

  // Calculate which videos to show - 5 items (-2, -1, 0, +1, +2)
  const getVisibleVideos = () => {
    const visible = [];
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + totalVideos) % totalVideos;
      visible.push({ ...videos[index], position: i, originalIndex: index });
    }
    return visible;
  };

  const visibleVideos = getVisibleVideos();

  return (
    <section className="relative h-screen flex items-center justify-center bg-background overflow-hidden">
      <div className="w-full px-3 sm:px-4 md:px-6 flex flex-col items-center justify-center h-full max-h-screen">
        {/* Header */}
        <ScrollReveal direction="up" className="text-center mb-4 md:mb-8">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[10px] md:text-xs tracking-[0.3em] text-muted-foreground mb-1 uppercase"
          >
            Tik Tok
          </motion.p>
          <h2 className="text-xl md:text-2xl lg:text-3xl tracking-wider uppercase font-light">
            INSPIRATION
          </h2>
        </ScrollReveal>

        {/* Video Carousel */}
        <div className="relative w-full max-w-7xl mx-auto flex-1 flex items-center justify-center max-h-[75vh]">
          {/* Navigation Buttons */}
          <motion.button
            whileHover={{ scale: 1.1, x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            className="absolute left-2 md:left-0 lg:-left-16 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 shadow-lg flex items-center justify-center hover:bg-gray-300 hover:shadow-xl transition-all group"
            aria-label="Previous video"
          >
            <ChevronLeft size={20} className="md:hidden text-gray-600 group-hover:text-gray-800" />
            <ChevronLeft size={24} className="hidden md:block text-gray-600 group-hover:text-gray-800" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, x: 4 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="absolute right-2 md:right-0 lg:-right-16 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 shadow-lg flex items-center justify-center hover:bg-gray-300 hover:shadow-xl transition-all group"
            aria-label="Next video"
          >
            <ChevronRight size={20} className="md:hidden text-gray-600 group-hover:text-gray-800" />
            <ChevronRight size={24} className="hidden md:block text-gray-600 group-hover:text-gray-800" />
          </motion.button>

          {/* Videos Grid */}
          <div className="flex items-center justify-center gap-2 md:gap-4 lg:gap-6 px-12 md:px-10 lg:px-0 overflow-hidden h-full">
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
                      x: direction > 0 ? 300 : -300,
                      opacity: 0,
                      scale: 0.8 
                    }}
                    animate={{ 
                      x: 0,
                      opacity: isCenterVideo ? 1 : (isAdjacentVideo ? 0.7 : 0.5),
                      scale: isCenterVideo ? 1 : (isAdjacentVideo ? 0.8 : 0.65),
                    }}
                    exit={{ 
                      x: direction > 0 ? -300 : 300,
                      opacity: 0,
                      scale: 0.8 
                    }}
                    transition={{ 
                      duration: 0.6, 
                      ease: easing.luxury,
                      x: { type: "spring", stiffness: 300, damping: 30 }
                    }}
                    className={`relative aspect-[9/16] rounded-2xl overflow-hidden bg-muted ${
                      isCenterVideo 
                        ? 'h-[60vh] md:h-[65vh] shadow-2xl' 
                        : (isAdjacentVideo ? 'h-[45vh] md:h-[48vh] shadow-lg' : 'h-[35vh] md:h-[38vh] shadow-md')
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
                        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white pointer-events-none">
                          <h3 className="text-base md:text-lg font-medium tracking-wide mb-1">
                            {video.title}
                          </h3>
                          <p className="text-[10px] md:text-xs text-white/80 uppercase tracking-wider">
                            {video.category}
                          </p>
                        </div>

                        {/* Play/Pause Button - Top Left */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePlay();
                          }}
                          className="absolute top-3 left-3 md:top-4 md:left-4 w-10 h-10 md:w-11 md:h-11 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/50 transition-all z-10"
                        >
                          {isPlaying ? (
                            <Pause className="text-white" size={18} />
                          ) : (
                            <Play className="text-white ml-0.5" size={18} />
                          )}
                        </motion.button>

                        {/* Mute Button - Bottom Right */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMute();
                          }}
                          className="absolute bottom-[72px] md:bottom-20 right-3 md:right-4 w-10 h-10 md:w-11 md:h-11 rounded-xl bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/50 transition-all z-10"
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
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {videos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx);
                setIsPlaying(false);
              }}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex 
                  ? 'w-8 bg-[#B4770E]' 
                  : 'w-2 bg-border hover:bg-muted-foreground'
              }`}
              aria-label={`Go to video ${idx + 1}`}
            />
          ))}
        </div>

        {/* Bottom Text */}
        <ScrollReveal direction="up" delay={0.2} className="text-center mt-4">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Discover the latest trends and styling inspiration from our community. 
            Get inspired by real fashion moments and elevate your style.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}