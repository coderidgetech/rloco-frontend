import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Eye } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { toast } from 'sonner';

export const AdminAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<any>(null);
  const [orderData, setOrderData] = useState<any>(null);
  const [productData, setProductData] = useState<any>(null);
  const [customerData, setCustomerData] = useState<any>(null);
  const [trafficData, setTrafficData] = useState<any>(null);
  const [metrics, setMetrics] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [trafficSources, setTrafficSources] = useState<any[]>([]);

  // Calculate date range
  const getDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    
    if (timeRange === '7d') {
      startDate.setDate(endDate.getDate() - 7);
    } else if (timeRange === '30d') {
      startDate.setDate(endDate.getDate() - 30);
    } else if (timeRange === '90d') {
      startDate.setDate(endDate.getDate() - 90);
    } else if (timeRange === '1y') {
      startDate.setFullYear(endDate.getFullYear() - 1);
    }
    
    return {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
    };
  };

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const dateRange = getDateRange();
        
        const [revenue, orders, products, customers, traffic] = await Promise.all([
          adminService.getRevenueAnalytics(dateRange),
          adminService.getOrderAnalytics(dateRange),
          adminService.getProductAnalytics(dateRange),
          adminService.getCustomerAnalytics(dateRange),
          adminService.getTrafficAnalytics(dateRange),
        ]);

        setRevenueData(revenue);
        setOrderData(orders);
        setProductData(products);
        setCustomerData(customers);
        setTrafficData(traffic);

        // Format metrics
        const formattedMetrics = [
          {
            title: 'Total Revenue',
            value: `$${revenue?.total_revenue?.toLocaleString() || '0'}`,
            change: revenue?.revenue_change ? `${revenue.revenue_change > 0 ? '+' : ''}${revenue.revenue_change.toFixed(1)}%` : '+0%',
            trend: (revenue?.revenue_change || 0) >= 0 ? 'up' as const : 'down' as const,
            icon: DollarSign,
          },
          {
            title: 'Total Orders',
            value: orders?.total_orders?.toLocaleString() || '0',
            change: orders?.orders_change ? `${orders.orders_change > 0 ? '+' : ''}${orders.orders_change.toFixed(1)}%` : '+0%',
            trend: (orders?.orders_change || 0) >= 0 ? 'up' as const : 'down' as const,
            icon: ShoppingCart,
          },
          {
            title: 'Total Visitors',
            value: traffic?.total_visitors?.toLocaleString() || '0',
            change: traffic?.visitors_change ? `${traffic.visitors_change > 0 ? '+' : ''}${traffic.visitors_change.toFixed(1)}%` : '+0%',
            trend: (traffic?.visitors_change || 0) >= 0 ? 'up' as const : 'down' as const,
            icon: Users,
          },
          {
            title: 'Conversion Rate',
            value: orders?.conversion_rate ? `${orders.conversion_rate.toFixed(1)}%` : '0%',
            change: orders?.conversion_change ? `${orders.conversion_change > 0 ? '+' : ''}${orders.conversion_change.toFixed(1)}%` : '+0%',
            trend: (orders?.conversion_change || 0) >= 0 ? 'up' as const : 'down' as const,
            icon: Eye,
          },
        ];
        setMetrics(formattedMetrics);

        // Format sales data for chart
        const formattedSalesData = revenue?.daily_data?.map((item: any) => ({
          date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: item.revenue || 0,
          orders: item.orders || 0,
        })) || [];
        setSalesData(formattedSalesData);

        // Format category data
        const formattedCategoryData = products?.category_sales?.map((item: any) => ({
          name: item.category || 'Unknown',
          sales: item.revenue || 0,
        })) || [];
        setCategoryData(formattedCategoryData);

        // Format top products
        const formattedTopProducts = products?.top_products?.slice(0, 4) || [];
        setTopProducts(formattedTopProducts);

        // Format traffic sources
        const formattedTrafficSources = traffic?.sources?.map((item: any) => ({
          source: item.source || 'Unknown',
          visitors: item.visitors || 0,
          percentage: traffic?.total_visitors ? Math.round((item.visitors / traffic.total_visitors) * 100) : 0,
        })) || [];
        setTrafficSources(formattedTrafficSources);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
        toast.error('Failed to load analytics data');
        // Set empty data on error
        setMetrics([]);
        setSalesData([]);
        setCategoryData([]);
        setTopProducts([]);
        setTrafficSources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-gray-600 mt-1">
              Track your store performance and insights
            </p>
          </div>
          <Select value={timeRange} onValueChange={(value: '7d' | '30d' | '90d' | '1y') => setTimeRange(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Metrics Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading analytics...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.title}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">{metric.title}</p>
                      <p className="text-3xl font-bold">{metric.value}</p>
                      <div className="flex items-center gap-1">
                        {metric.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {metric.change}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <Icon className="h-6 w-6 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Orders</CardTitle>
              <CardDescription>Daily revenue and order volume</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#000000"
                    strokeWidth={2}
                    name="Revenue ($)"
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#666666"
                    strokeWidth={2}
                    name="Orders"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Website Traffic</CardTitle>
              <CardDescription>Visitors and page views</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trafficData?.daily_data?.map((item: any) => ({
                  date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                  visitors: item.visitors || 0,
                  pageViews: item.page_views || 0,
                })) || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    stackId="1"
                    stroke="#000000"
                    fill="#000000"
                    fillOpacity={0.6}
                    name="Visitors"
                  />
                  <Area
                    type="monotone"
                    dataKey="pageViews"
                    stackId="2"
                    stroke="#666666"
                    fill="#666666"
                    fillOpacity={0.4}
                    name="Page Views"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Revenue breakdown by product category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Bar dataKey="sales" fill="#000000" name="Sales ($)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Best performing products this period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">No product data available</p>
                ) : (
                  topProducts.map((product: any, index: number) => (
                  <div
                    key={product.name}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.sales} sales</p>
                      </div>
                    </div>
                    <p className="font-bold">${(product.revenue || product.sales * product.price || 0).toLocaleString()}</p>
                  </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your visitors are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trafficSources.length === 0 ? (
                  <p className="text-center text-gray-600 py-8">No traffic data available</p>
                ) : (
                  trafficSources.map((source: any) => (
                  <div key={source.source} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{source.source}</span>
                      <span className="text-sm text-gray-600">
                        {source.visitors.toLocaleString()} ({source.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-black h-2 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                  </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};
