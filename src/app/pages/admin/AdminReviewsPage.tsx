import { useState, useEffect } from 'react';
import { PH } from '@/app/lib/formPlaceholders';
import { motion } from 'motion/react';
import { AdminLayout } from '@/app/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { 
  Star, 
  Search, 
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  MoreVertical,
  TrendingUp,
  MessageSquare,
  Award,
  AlertTriangle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { adminService } from '@/app/services/adminService';
import { toast } from 'sonner';

interface Review {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  helpful: number;
  reported: number;
}

export function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [filterRating, setFilterRating] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');

  useEffect(() => {
    fetchReviews();
  }, [filterStatus]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await adminService.listAllReviews({
        status: filterStatus === 'all' ? undefined : filterStatus,
        limit: 1000,
      });
      
      // Transform API response to match Review interface
      const transformedReviews: Review[] = (response.data || []).map((review: any) => ({
        id: review.id || review._id,
        productId: review.product_id || review.productId,
        productName: review.product?.name || review.product_name || 'Unknown Product',
        productImage: review.product?.images?.[0] || review.product_image || '',
        customerName: review.user?.first_name && review.user?.last_name 
          ? `${review.user.first_name} ${review.user.last_name}`
          : review.user?.email || review.customer_name || 'Anonymous',
        customerEmail: review.user?.email || review.customer_email || '',
        rating: review.rating || 0,
        title: review.title || '',
        comment: review.comment || review.body || '',
        date: review.created_at || review.date || new Date().toISOString(),
        verified: review.verified || false,
        status: (review.status || 'pending') as 'pending' | 'approved' | 'rejected',
        helpful: review.helpful_count || review.helpful || 0,
        reported: review.reported_count || review.reported || 0,
      }));
      
      setReviews(transformedReviews);
    } catch (error: any) {
      console.error('Failed to fetch reviews:', error);
      toast.error('Failed to load reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await adminService.updateReviewStatus(id, 'approved');
      toast.success('Review approved');
      await fetchReviews();
    } catch (error: any) {
      toast.error('Failed to approve review');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminService.updateReviewStatus(id, 'rejected');
      toast.success('Review rejected');
      await fetchReviews();
    } catch (error: any) {
      toast.error('Failed to reject review');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Note: There might not be a delete endpoint, but we can try to reject it
      await adminService.updateReviewStatus(id, 'rejected');
      toast.success('Review removed');
      await fetchReviews();
    } catch (error: any) {
      toast.error('Failed to delete review');
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || review.status === filterStatus;
    const matchesRating = filterRating === 'all' || review.rating === parseInt(filterRating);
    return matchesSearch && matchesStatus && matchesRating;
  });

  const stats = {
    total: reviews.length,
    pending: reviews.filter(r => r.status === 'pending').length,
    approved: reviews.filter(r => r.status === 'approved').length,
    avgRating: (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
    reported: reviews.filter(r => r.reported > 0).length,
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? 'fill-[#B4770E] text-[#B4770E]' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="page-container-lg p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-light tracking-wider mb-2">REVIEWS MANAGEMENT</h1>
          <p className="text-muted-foreground">Monitor and manage customer product reviews</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Reviews</p>
                  <p className="text-2xl font-light">{stats.total}</p>
                </div>
                <MessageSquare className="text-muted-foreground" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pending</p>
                  <p className="text-2xl font-light">{stats.pending}</p>
                </div>
                <AlertTriangle className="text-yellow-500" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Approved</p>
                  <p className="text-2xl font-light">{stats.approved}</p>
                </div>
                <CheckCircle className="text-green-500" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Rating</p>
                  <p className="text-2xl font-light">{stats.avgRating}</p>
                </div>
                <Award className="text-[#B4770E]" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Reported</p>
                  <p className="text-2xl font-light">{stats.reported}</p>
                </div>
                <AlertTriangle className="text-red-500" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  placeholder={PH.adminSearchReviews}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterRating} onValueChange={(value: any) => setFilterRating(value)}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">Loading reviews...</p>
              </CardContent>
            </Card>
          ) : (
            filteredReviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* Product Image */}
                    <img
                      src={review.productImage}
                      alt={review.productName}
                      className="w-full md:w-24 h-24 object-cover rounded-lg"
                    />

                    {/* Review Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-medium tracking-wide mb-1">{review.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{review.productName}</p>
                          {renderStars(review.rating)}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleApprove(review.id)}>
                              <CheckCircle size={16} className="mr-2" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReject(review.id)}>
                              <XCircle size={16} className="mr-2" />
                              Reject
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(review.id)} className="text-red-600">
                              <Trash2 size={16} className="mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">{review.comment}</p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="font-medium">{review.customerName}</span>
                        <span>{review.customerEmail}</span>
                        <span>{new Date(review.date).toLocaleDateString()}</span>
                        {review.verified && (
                          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle size={12} className="mr-1" />
                            Verified Purchase
                          </Badge>
                        )}
                        <Badge variant={
                          review.status === 'approved' ? 'default' :
                          review.status === 'pending' ? 'secondary' :
                          'destructive'
                        }>
                          {review.status}
                        </Badge>
                        {review.reported > 0 && (
                          <Badge variant="destructive">
                            <AlertTriangle size={12} className="mr-1" />
                            {review.reported} Reports
                          </Badge>
                        )}
                        <span className="flex items-center gap-1">
                          <TrendingUp size={12} />
                          {review.helpful} found helpful
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
          )}

          {!loading && filteredReviews.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageSquare className="mx-auto mb-4 text-muted-foreground" size={48} />
                <p className="text-muted-foreground">No reviews found matching your filters</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
