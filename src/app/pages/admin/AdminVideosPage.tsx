import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Video, Trash2, Edit, Eye, EyeOff, Calendar, User } from 'lucide-react';
import { AdminLayout } from '@/app/components/admin/AdminLayout';
import { LuxuryButton } from '@/app/components/LuxuryButton';
import { InspirationVideo } from '@/app/components/InspirationVideos';
import { easing } from '@/app/utils/luxuryAnimations';
import { toast } from 'sonner';
import { videoService, InspirationVideo as APIVideo } from '@/app/services/videoService';
import { PH } from '@/app/lib/formPlaceholders';

export function AdminVideosPage() {
  const [videos, setVideos] = useState<InspirationVideo[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<InspirationVideo | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '',
    thumbnailUrl: '',
    category: '',
    featured: false,
  });

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await videoService.list({ limit: 100 });
        // Transform API response to component format
        const transformedVideos: InspirationVideo[] = response.videos.map((v: APIVideo) => ({
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
        console.error('Failed to fetch videos:', err);
        toast.error('Failed to load videos');
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const handleAddVideo = async () => {
    if (!formData.title || !formData.videoUrl || !formData.thumbnailUrl || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const newVideo = await videoService.create({
        title: formData.title,
        video_url: formData.videoUrl,
        thumbnail_url: formData.thumbnailUrl,
        category: formData.category,
        featured: formData.featured,
      });

      // Transform and add to list
      const transformedVideo: InspirationVideo = {
        id: newVideo.id,
        title: newVideo.title,
        videoUrl: newVideo.video_url,
        thumbnailUrl: newVideo.thumbnail_url,
        category: newVideo.category,
        featured: newVideo.featured,
        createdAt: newVideo.created_at,
        uploadedBy: newVideo.uploaded_by_name,
      };

      setVideos([transformedVideo, ...videos]);
      toast.success('Video added successfully');
      resetForm();
      setIsAddModalOpen(false);
      setEditingVideo(null);
    } catch (err: any) {
      console.error('Failed to add video:', err);
      toast.error('Failed to add video');
    }
  };

  const handleEditVideo = async () => {
    if (!editingVideo) return;

    try {
      const updatedVideo = await videoService.update(editingVideo.id, {
        title: formData.title,
        video_url: formData.videoUrl,
        thumbnail_url: formData.thumbnailUrl,
        category: formData.category,
        featured: formData.featured,
      });

      // Transform and update in list
      const transformedVideo: InspirationVideo = {
        id: updatedVideo.id,
        title: updatedVideo.title,
        videoUrl: updatedVideo.video_url,
        thumbnailUrl: updatedVideo.thumbnail_url,
        category: updatedVideo.category,
        featured: updatedVideo.featured,
        createdAt: updatedVideo.created_at,
        uploadedBy: updatedVideo.uploaded_by_name,
      };

      setVideos(videos.map(v => 
        v.id === editingVideo.id ? transformedVideo : v
      ));
      toast.success('Video updated successfully');
      resetForm();
      setIsAddModalOpen(false);
      setEditingVideo(null);
    } catch (err: any) {
      console.error('Failed to update video:', err);
      toast.error('Failed to update video');
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      await videoService.delete(id);
      setVideos(videos.filter(v => v.id !== id));
      toast.success('Video deleted successfully');
    } catch (err: any) {
      console.error('Failed to delete video:', err);
      toast.error('Failed to delete video');
    }
  };

  const toggleFeatured = async (id: string) => {
    const video = videos.find(v => v.id === id);
    if (!video) return;

    try {
      const updatedVideo = await videoService.update(id, {
        featured: !video.featured,
      });

      // Transform and update in list
      const transformedVideo: InspirationVideo = {
        id: updatedVideo.id,
        title: updatedVideo.title,
        videoUrl: updatedVideo.video_url,
        thumbnailUrl: updatedVideo.thumbnail_url,
        category: updatedVideo.category,
        featured: updatedVideo.featured,
        createdAt: updatedVideo.created_at,
        uploadedBy: updatedVideo.uploaded_by_name,
      };

      setVideos(videos.map(v => 
        v.id === id ? transformedVideo : v
      ));
      toast.success('Video updated');
    } catch (err: any) {
      console.error('Failed to update video:', err);
      toast.error('Failed to update video');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      videoUrl: '',
      thumbnailUrl: '',
      category: '',
      featured: false,
    });
  };

  const openEditModal = (video: InspirationVideo) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      category: video.category,
      featured: video.featured || false,
    });
    setIsAddModalOpen(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading videos...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light tracking-wide">Inspiration Videos</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage videos displayed on the homepage inspiration section
            </p>
          </div>
          <LuxuryButton
            variant="brand"
            onClick={() => setIsAddModalOpen(true)}
            className="gap-2"
          >
            <Plus size={20} />
            Add Video
          </LuxuryButton>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#B4770E]/10 flex items-center justify-center">
                <Video className="text-[#B4770E]" size={24} />
              </div>
              <div>
                <p className="text-2xl font-light">{videos.length}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Videos</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Eye className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-light">{videos.filter(v => v.featured).length}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Featured</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <User className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-2xl font-light">
                  {videos.filter(v => v.uploadedBy?.includes('Vendor')).length}
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">By Vendors</p>
              </div>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05, ease: easing.luxury }}
                className="bg-white rounded-lg border border-border overflow-hidden group hover:shadow-lg transition-shadow"
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-[9/16] bg-muted overflow-hidden">
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {video.featured && (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-[#B4770E] text-white text-xs uppercase tracking-wider rounded-full">
                      Featured
                    </div>
                  )}
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleFeatured(video.id)}
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
                      title={video.featured ? 'Remove from featured' : 'Mark as featured'}
                    >
                      {video.featured ? <EyeOff size={18} /> : <Eye size={18} />}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => openEditModal(video)}
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
                    >
                      <Edit size={18} />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteVideo(video.id)}
                      className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center"
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-4 space-y-2">
                  <h3 className="font-medium text-base line-clamp-1">{video.title}</h3>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    {video.category}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={12} />
                      <span className="line-clamp-1">{video.uploadedBy}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {videos.length === 0 && (
          <div className="text-center py-20">
            <Video className="mx-auto text-muted-foreground mb-4" size={48} />
            <h3 className="text-xl font-light mb-2">No videos yet</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Add your first inspiration video to get started
            </p>
            <LuxuryButton variant="brand" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={20} className="mr-2" />
              Add Video
            </LuxuryButton>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {(isAddModalOpen || editingVideo) && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAddModalOpen(false);
                setEditingVideo(null);
                resetForm();
              }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: easing.luxury }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-border">
                  <h2 className="text-2xl font-light tracking-wide">
                    {editingVideo ? 'Edit Video' : 'Add New Video'}
                  </h2>
                </div>

                <div className="p-6 space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Video Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B4770E]"
                      placeholder={PH.videoTitle}
                    />
                  </div>

                  {/* Video URL */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Video URL *
                    </label>
                    <input
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B4770E]"
                      placeholder={PH.videoUrl}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Direct link to MP4 video file or streaming URL
                    </p>
                  </div>

                  {/* Thumbnail URL */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Thumbnail URL *
                    </label>
                    <input
                      type="url"
                      value={formData.thumbnailUrl}
                      onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B4770E]"
                      placeholder={PH.thumbnailUrl}
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B4770E]"
                    >
                      <option value="">Select category</option>
                      <option value="Street Style">Street Style</option>
                      <option value="Summer Collection">Summer Collection</option>
                      <option value="Casual Wear">Casual Wear</option>
                      <option value="Business">Business</option>
                      <option value="Evening Wear">Evening Wear</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Seasonal">Seasonal</option>
                    </select>
                  </div>

                  {/* Featured */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-5 h-5 rounded border-border text-[#B4770E] focus:ring-[#B4770E]"
                    />
                    <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                      Mark as featured video
                    </label>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingVideo(null);
                      resetForm();
                    }}
                    className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <LuxuryButton
                    variant="brand"
                    onClick={editingVideo ? handleEditVideo : handleAddVideo}
                  >
                    {editingVideo ? 'Update Video' : 'Add Video'}
                  </LuxuryButton>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}