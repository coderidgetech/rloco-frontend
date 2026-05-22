import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { DollarSign, ShoppingCart, Package, Users } from 'lucide-react';
import { vendorService } from '../../services/vendorService';
import { toast } from 'sonner';

export const VendorAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [revenue, setRevenue] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [s, r, p, o] = await Promise.all([
          vendorService.getAnalyticsSummary(),
          vendorService.getAnalyticsRevenue(),
          vendorService.getAnalyticsProducts(),
          vendorService.getAnalyticsOrders(),
        ]);
        setSummary(s);
        setRevenue(
          (r.data ?? []).map((d: any) => ({
            date: new Date(d.date ?? d._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            revenue: d.revenue ?? 0,
            orders: d.orders ?? 0,
          }))
        );
        setProducts(p.data ?? []);
        setOrders(o);
      } catch {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const kpis = [
    { label: 'Total Revenue', value: summary ? `$${(summary.total_revenue ?? 0).toLocaleString()}` : '—', icon: DollarSign },
    { label: 'Total Orders', value: summary?.total_orders?.toLocaleString() ?? '—', icon: ShoppingCart },
    { label: 'Total Products', value: summary?.total_products?.toLocaleString() ?? '—', icon: Package },
    { label: 'Customers', value: summary?.total_customers?.toLocaleString() ?? '—', icon: Users },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Analytics</h1>
          <p className="text-gray-600 mt-1">Your store performance — last 30 days</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
          </div>
        ) : (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((k) => {
                const Icon = k.icon;
                return (
                  <Card key={k.label}>
                    <CardContent className="p-5 flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">{k.label}</p>
                        <p className="text-2xl font-bold mt-1">{k.value}</p>
                      </div>
                      <div className="p-3 bg-gray-100 rounded-lg">
                        <Icon className="h-5 w-5 text-gray-600" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Revenue chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue & Orders</CardTitle>
                <CardDescription>Daily breakdown (last 30 days)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={revenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#000" strokeWidth={2} name="Revenue ($)" />
                    <Line type="monotone" dataKey="orders" stroke="#666" strokeWidth={2} name="Orders" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>By revenue</CardDescription>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No product data yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={products.slice(0, 10)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" stroke="#888" />
                      <YAxis dataKey="name" type="category" width={120} stroke="#888" tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#000" name="Revenue ($)" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Order status breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Orders by Status</CardTitle>
              </CardHeader>
              <CardContent>
                {!orders || Object.keys(orders).length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No order data yet</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {Object.entries(orders as Record<string, number>).map(([status, count]) => (
                      <div key={status} className="border rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold">{count as number}</p>
                        <p className="text-sm text-gray-500 capitalize mt-1">{status.replace('_', ' ')}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
};
