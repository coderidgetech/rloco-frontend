import { useState } from 'react';
import { motion } from 'motion/react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Eye,
  Star,
  AlertCircle,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { adminService } from '../../services/adminService';
import { categoryService } from '../../services/categoryService';
import { useEffect } from 'react';

export const AdminDashboardPage = () => {
  const { user } = useAdmin();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        if (timeRange === '7d') {
          startDate.setDate(endDate.getDate() - 7);
        } else if (timeRange === '30d') {
          startDate.setDate(endDate.getDate() - 30);
        } else {
          startDate.setDate(endDate.getDate() - 90);
        }

        // Fetch stats, sales, orders, products, and categories in parallel
        const [stats, sales, orders, products, categories] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getDashboardSales({
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
          }),
          adminService.getDashboardOrders({ limit: 5 }),
          adminService.getDashboardProducts({ limit: 5 }),
          categoryService.list().catch(() => []),
        ]);

        setDashboardStats(stats);
        setSalesData(sales?.data || []);
        setRecentOrders(orders?.data || []);
        setTopProducts(products?.data || []);

        // Build category chart from real categories
        const CHART_COLORS = ['#000000', '#3b3b3b', '#666666', '#999999', '#cccccc', '#aaaaaa', '#444444'];
        if (categories && categories.length > 0) {
          const chartCategories = categories.slice(0, 6).map((cat: any, i: number) => ({
            name: cat.name,
            value: Math.round(100 / Math.min(categories.length, 6)),
            color: CHART_COLORS[i % CHART_COLORS.length],
          }));
          setCategoryData(chartCategories);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Set empty data on error instead of mock data
        setSalesData([]);
        setRecentOrders([]);
        setTopProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange]);


  // Format recent orders for display
  const formattedRecentOrders = recentOrders.length > 0 ? recentOrders.map((order) => ({
    id: order.order_number || `#${order.id.slice(-4)}`,
    customer: order.shipping_info?.first_name && order.shipping_info?.last_name
      ? `${order.shipping_info.first_name} ${order.shipping_info.last_name}`
      : 'Unknown',
    amount: order.total,
    status: order.status || 'pending',
    date: new Date(order.created_at).toLocaleDateString(),
  })) : [];

  // Format top products for display
  const formattedTopProducts = topProducts.length > 0 ? topProducts.map((product) => ({
    name: product.name || 'Unknown Product',
    sales: (product as any).sales || 0,
    revenue: (product.price || 0) * ((product as any).sales || 0),
    trend: 'up' as const,
    change: 12.5,
  })) : [];

  // Format stats from API - show empty/zero values if no data
  const stats = dashboardStats ? [
    {
      title: 'Total Revenue',
      value: `$${dashboardStats.total_revenue?.toLocaleString() || '0'}`,
      change: dashboardStats.revenue_change ? `${dashboardStats.revenue_change >= 0 ? '+' : ''}${dashboardStats.revenue_change}%` : '+0%',
      trend: (dashboardStats.revenue_change || 0) >= 0 ? 'up' as const : 'down' as const,
      icon: DollarSign,
      description: 'vs last month',
    },
    {
      title: 'Total Orders',
      value: dashboardStats.total_orders?.toLocaleString() || '0',
      change: dashboardStats.orders_change ? `${dashboardStats.orders_change >= 0 ? '+' : ''}${dashboardStats.orders_change}%` : '+0%',
      trend: (dashboardStats.orders_change || 0) >= 0 ? 'up' as const : 'down' as const,
      icon: ShoppingCart,
      description: 'vs last month',
    },
    {
      title: 'Total Customers',
      value: dashboardStats.total_customers?.toLocaleString() || '0',
      change: dashboardStats.customers_change ? `${dashboardStats.customers_change >= 0 ? '+' : ''}${dashboardStats.customers_change}%` : '+0%',
      trend: (dashboardStats.customers_change || 0) >= 0 ? 'up' as const : 'down' as const,
      icon: Users,
      description: 'vs last month',
    },
    {
      title: 'Total Products',
      value: dashboardStats.total_products?.toLocaleString() || '0',
      change: dashboardStats.products_change ? `${dashboardStats.products_change >= 0 ? '+' : ''}${dashboardStats.products_change}%` : '+0%',
      trend: (dashboardStats.products_change || 0) >= 0 ? 'up' as const : 'down' as const,
      icon: Package,
      description: 'active listings',
    },
  ] : [
    {
      title: 'Total Revenue',
      value: '$0',
      change: '+0%',
      trend: 'up' as const,
      icon: DollarSign,
      description: 'vs last month',
    },
    {
      title: 'Total Orders',
      value: '0',
      change: '+0%',
      trend: 'up' as const,
      icon: ShoppingCart,
      description: 'vs last month',
    },
    {
      title: 'Total Customers',
      value: '0',
      change: '+0%',
      trend: 'up' as const,
      icon: Users,
      description: 'vs last month',
    },
    {
      title: 'Total Products',
      value: '0',
      change: '+0%',
      trend: 'up' as const,
      icon: Package,
      description: 'active listings',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-3 w-3" />;
      case 'processing':
        return <Clock className="h-3 w-3" />;
      case 'pending':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {user?.name}! Here's what's happening with your store.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={timeRange === '7d' ? 'default' : 'outline'}
              onClick={() => setTimeRange('7d')}
              size="sm"
            >
              7 Days
            </Button>
            <Button
              variant={timeRange === '30d' ? 'default' : 'outline'}
              onClick={() => setTimeRange('30d')}
              size="sm"
            >
              30 Days
            </Button>
            <Button
              variant={timeRange === '90d' ? 'default' : 'outline'}
              onClick={() => setTimeRange('90d')}
              size="sm"
            >
              90 Days
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">{stat.title}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                        <div className="flex items-center gap-2">
                          {stat.trend === 'up' ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {stat.change}
                          </span>
                          <span className="text-sm text-gray-500">
                            {stat.description}
                          </span>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-100 rounded-lg">
                        <Icon className="h-6 w-6 text-gray-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Daily sales and orders for the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#000000"
                    strokeWidth={2}
                    name="Sales ($)"
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

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>Sales breakdown by product category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
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
            </CardContent>
          </Card>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formattedRecentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <p className="font-semibold">{order.id}</p>
                        <Badge className={getStatusColor(order.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            {order.status}
                          </span>
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{order.customer}</p>
                      <p className="text-xs text-gray-400 mt-1">{order.date}</p>
                    </div>
                    <p className="font-bold text-lg">${order.amount.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Best performing products this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formattedTopProducts.map((product, index) => (
                  <div
                    key={product.name}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.sales} sales</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${product.revenue.toLocaleString()}</p>
                      <div className="flex items-center gap-1 justify-end mt-1">
                        {product.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-600" />
                        )}
                        <span
                          className={`text-xs ${
                            product.trend === 'up' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {product.change > 0 ? '+' : ''}
                          {product.change}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};
