import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { AlertTriangle, Package, RefreshCw, Search } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { toast } from 'sonner';
import { getApiErrorMessage } from '../../lib/apiErrors';

interface LowStockItem {
  id: string;
  name: string;
  sku?: string;
  stock: number;
  category?: string;
  price?: number;
  image?: string;
}

interface StockAlert {
  product_id: string;
  product_name: string;
  stock: number;
  alert_type: string;
}

export function AdminInventoryPage() {
  const [lowStock, setLowStock] = useState<LowStockItem[]>([]);
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [threshold, setThreshold] = useState(10);
  const [thresholdInput, setThresholdInput] = useState('10');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [ls, al] = await Promise.all([
        adminService.getLowStock(threshold),
        adminService.getStockAlerts(),
      ]);
      setLowStock(ls ?? []);
      setAlerts(al ?? []);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to load inventory data'));
    } finally {
      setLoading(false);
    }
  }, [threshold]);

  useEffect(() => { load(); }, [load]);

  const applyThreshold = () => {
    const n = parseInt(thresholdInput, 10);
    if (!isNaN(n) && n >= 0) setThreshold(n);
  };

  const filtered = lowStock.filter((item) =>
    !search || item.name?.toLowerCase().includes(search.toLowerCase())
  );

  const stockLevel = (stock: number) => {
    if (stock === 0) return <Badge variant="destructive">Out of stock</Badge>;
    if (stock <= 3) return <Badge className="bg-red-100 text-red-700">Critical</Badge>;
    if (stock <= threshold) return <Badge className="bg-amber-100 text-amber-700">Low</Badge>;
    return <Badge className="bg-green-100 text-green-700">OK</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Inventory</h1>
            <p className="text-gray-500 mt-1">Monitor low-stock products and stock alerts</p>
          </div>
          <Button variant="outline" onClick={load} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'animate-spin mr-2' : 'mr-2'} />
            Refresh
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg"><AlertTriangle size={20} className="text-amber-600" /></div>
                <div>
                  <p className="text-sm text-gray-500">Low Stock Items</p>
                  <p className="text-2xl font-bold">{loading ? '—' : lowStock.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg"><Package size={20} className="text-red-600" /></div>
                <div>
                  <p className="text-sm text-gray-500">Out of Stock</p>
                  <p className="text-2xl font-bold">{loading ? '—' : lowStock.filter((i) => i.stock === 0).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg"><AlertTriangle size={20} className="text-blue-600" /></div>
                <div>
                  <p className="text-sm text-gray-500">Active Alerts</p>
                  <p className="text-2xl font-bold">{loading ? '—' : alerts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active alerts */}
        {alerts.length > 0 && (
          <Card>
            <CardHeader><CardTitle className="text-base">Stock Alerts</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {alerts.map((a, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg"
                  >
                    <span className="text-sm font-medium text-red-800">{a.product_name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-red-600">{a.alert_type}</span>
                      <Badge variant="destructive">{a.stock} left</Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Low-stock table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <CardTitle className="text-base">Low Stock Products</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
                  <Input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 h-8 w-44"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 whitespace-nowrap">Threshold:</span>
                  <Input
                    type="number"
                    min={0}
                    value={thresholdInput}
                    onChange={(e) => setThresholdInput(e.target.value)}
                    onBlur={applyThreshold}
                    onKeyDown={(e) => e.key === 'Enter' && applyThreshold()}
                    className="h-8 w-16"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12 text-gray-400">Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
                <Package size={32} />
                <p className="text-sm">{search ? 'No matches' : 'No low-stock items found'}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-8 h-8 rounded object-cover bg-gray-100" />
                          )}
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            {item.sku && <p className="text-xs text-gray-400">{item.sku}</p>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{item.category ?? '—'}</TableCell>
                      <TableCell className="text-sm">{item.price != null ? `$${item.price.toFixed(2)}` : '—'}</TableCell>
                      <TableCell className="text-right font-mono text-sm">{item.stock}</TableCell>
                      <TableCell className="text-right">{stockLevel(item.stock)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
