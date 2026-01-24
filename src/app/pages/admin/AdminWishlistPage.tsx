import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AdminLayout } from '@/app/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { 
  Heart, 
  Search, 
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Eye,
  BarChart3,
  AlertCircle,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { productService } from '@/app/services/productService';
import { Product } from '@/app/types/api';
import { toast } from 'sonner';

interface WishlistProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
  wishlistCount: number;
  purchaseConversion: number;
  trend: 'up' | 'down' | 'stable';
  trendPercent: number;
}

export function AdminWishlistPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fetch all products - wishlist analytics would need a backend endpoint
      // For now, we'll show products with placeholder wishlist data
      const response = await productService.list({ limit: 1000 });
      const allProducts = response.products || [];
      
      // Transform products - note: wishlist count and conversion require backend analytics endpoint
      const transformedProducts: WishlistProduct[] = allProducts.map((product: Product) => ({
        id: product.id,
        name: product.name,
        image: product.images?.[0] || '',
        price: product.price,
        category: product.category,
        wishlistCount: 0, // TODO: Requires backend endpoint /admin/wishlist/analytics
        purchaseConversion: 0, // TODO: Requires backend endpoint
        trend: 'stable' as const,
        trendPercent: 0,
      }));
      
      setProducts(transformedProducts);
    } catch (error: any) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalWishlists = products.reduce((sum, p) => sum + p.wishlistCount, 0);
  const avgConversion = products.length > 0 
    ? (products.reduce((sum, p) => sum + p.purchaseConversion, 0) / products.length).toFixed(1)
    : '0.0';
  // Note: Unique users calculation requires backend analytics
  const uniqueUsers = 0; // TODO: Backend endpoint needed: GET /admin/wishlist/analytics/users

  // Calculate category data from actual products
  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + p.wishlistCount;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryCounts).map(([name, value], index) => ({
    name,
    value,
    color: ['#000000', '#B4770E', '#3b3b3b', '#666666', '#999999'][index % 5],
  }));

  // Trend data would require historical data from backend
  const trendData: { month: string; items: number }[] = []; // TODO: Backend endpoint needed: GET /admin/wishlist/analytics/trends?start_date={date}&end_date={date}

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-light tracking-wider mb-2">WISHLIST ANALYTICS</h1>
          <p className="text-muted-foreground">Track customer wishlists and product demand</p>
        </motion.div>

        {/* API Endpoint Notice */}
        {products.length > 0 && products[0].wishlistCount === 0 && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800 mb-1">
                    Backend Endpoint Required
                  </p>
                  <p className="text-xs text-yellow-700">
                    Wishlist analytics requires a backend endpoint (e.g., GET /admin/wishlist/analytics) 
                    to provide wishlist counts, conversion rates, and trend data. Currently showing products only.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Wishlists</p>
                  <p className="text-2xl font-light">{totalWishlists.toLocaleString()}</p>
                </div>
                <Heart className="text-red-500" size={24} />
              </div>
              <div className="mt-2 flex items-center text-xs text-green-600">
                <TrendingUp size={14} className="mr-1" />
                +12.5% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Unique Users</p>
                  <p className="text-2xl font-light">{uniqueUsers.toLocaleString()}</p>
                </div>
                <Users className="text-[#B4770E]" size={24} />
              </div>
              <div className="mt-2 flex items-center text-xs text-green-600">
                <TrendingUp size={14} className="mr-1" />
                +8.3% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Avg Conversion</p>
                  <p className="text-2xl font-light">{avgConversion}%</p>
                </div>
                <ShoppingCart className="text-green-500" size={24} />
              </div>
              <div className="mt-2 flex items-center text-xs text-green-600">
                <TrendingUp size={14} className="mr-1" />
                +3.2% from last month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Potential Revenue</p>
                  <p className="text-2xl font-light">${(totalWishlists * 0.25 * 250).toLocaleString()}</p>
                </div>
                <DollarSign className="text-blue-500" size={24} />
              </div>
              <div className="mt-2 flex items-center text-xs text-muted-foreground">
                Est. from conversion
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-light">Wishlist Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="items" fill="#B4770E" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
                  Trend data requires backend analytics endpoint
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-light">By Category</CardTitle>
            </CardHeader>
            <CardContent>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => entry.name}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center text-muted-foreground text-sm">
                  No category data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Products List */}
        <div className="grid grid-cols-1 gap-4">
          {loading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">Loading products...</p>
              </CardContent>
            </Card>
          ) : filteredProducts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Heart className="mx-auto mb-4 text-muted-foreground" size={48} />
                <p className="text-muted-foreground">No products found</p>
              </CardContent>
            </Card>
          ) : (
            filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-medium tracking-wide mb-1">{product.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{product.category}</span>
                        <span>${product.price.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="text-center px-4 border-l">
                      <div className="flex items-center gap-2 mb-1">
                        <Heart className="text-red-500" size={20} />
                        <span className="text-2xl font-light">{product.wishlistCount}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Wishlists</p>
                    </div>

                    <div className="text-center px-4 border-l">
                      <div className="flex items-center gap-2 mb-1">
                        <ShoppingCart className="text-green-500" size={20} />
                        <span className="text-2xl font-light">{product.purchaseConversion}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Conversion</p>
                    </div>

                    <div className="text-center px-4 border-l">
                      <div className="flex items-center gap-2 mb-1">
                        {product.trend === 'up' && <TrendingUp className="text-green-500" size={20} />}
                        {product.trend === 'down' && <TrendingUp className="text-red-500 rotate-180" size={20} />}
                        {product.trend === 'stable' && <BarChart3 className="text-muted-foreground" size={20} />}
                        <span className={`text-lg font-light ${
                          product.trend === 'up' ? 'text-green-600' :
                          product.trend === 'down' ? 'text-red-600' :
                          'text-muted-foreground'
                        }`}>
                          {product.trendPercent > 0 ? '+' : ''}{product.trendPercent}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Trend</p>
                    </div>

                    <Button variant="outline" size="sm">
                      <Eye size={16} className="mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
