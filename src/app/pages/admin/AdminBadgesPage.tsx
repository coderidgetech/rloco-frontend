import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AdminLayout } from '@/app/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Award, Search, Tag, X } from 'lucide-react';
import { productService } from '@/app/services/productService';
import { Product } from '@/app/types/api';
import { toast } from 'sonner';
import { getApiErrorMessage } from '@/app/lib/apiErrors';

const BADGE_OPTIONS = [
  'New',
  'Trending',
  'Best Seller',
  'Hot',
  'Limited Edition',
  'Sale',
  'Exclusive',
  'Featured',
];

const BADGE_COLORS: Record<string, string> = {
  New: 'bg-blue-100 text-blue-700',
  Trending: 'bg-purple-100 text-purple-700',
  'Best Seller': 'bg-green-100 text-green-700',
  Hot: 'bg-orange-100 text-orange-700',
  'Limited Edition': 'bg-amber-100 text-amber-700',
  Sale: 'bg-red-100 text-red-700',
  Exclusive: 'bg-gray-800 text-white',
  Featured: 'bg-indigo-100 text-indigo-700',
};

export function AdminBadgesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterBadge, setFilterBadge] = useState('all');
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [newBadge, setNewBadge] = useState('');
  const [customBadge, setCustomBadge] = useState('');
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await productService.list({ limit: 200, skip: 0 });
      setProducts((res as any).products ?? res ?? []);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to load products'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setNewBadge(p.badge ?? '');
    setCustomBadge('');
  };

  const saveBadge = async () => {
    if (!editProduct) return;
    const badge = newBadge === '__custom__' ? customBadge.trim() : newBadge;
    try {
      setSaving(true);
      await productService.update(editProduct.id, { badge: badge || undefined });
      setProducts((prev) =>
        prev.map((p) => p.id === editProduct.id ? { ...p, badge: badge || undefined } : p)
      );
      toast.success(badge ? `Badge set to "${badge}"` : 'Badge removed');
      setEditProduct(null);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update badge'));
    } finally {
      setSaving(false);
    }
  };

  const removeBadge = async (p: Product) => {
    try {
      await productService.update(p.id, { badge: undefined });
      setProducts((prev) => prev.map((pp) => pp.id === p.id ? { ...pp, badge: undefined } : pp));
      toast.success('Badge removed');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to remove badge'));
    }
  };

  const badgeCounts = products.reduce<Record<string, number>>((acc, p) => {
    if (p.badge) acc[p.badge] = (acc[p.badge] ?? 0) + 1;
    return acc;
  }, {});
  const tagged = products.filter((p) => p.badge).length;

  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name?.toLowerCase().includes(search.toLowerCase());
    const matchBadge = filterBadge === 'all' ? true :
      filterBadge === 'none' ? !p.badge :
      p.badge === filterBadge;
    return matchSearch && matchBadge;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Product Badges</h1>
          <p className="text-gray-500 mt-1">Assign and manage badge labels on products</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg"><Award size={18} className="text-amber-600" /></div>
                <div>
                  <p className="text-xs text-gray-500">Badged Products</p>
                  <p className="text-xl font-bold">{tagged}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          {Object.entries(badgeCounts).slice(0, 3).map(([badge, count]) => (
            <Card key={badge}>
              <CardContent className="pt-5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg"><Tag size={18} className="text-gray-600" /></div>
                  <div>
                    <p className="text-xs text-gray-500">{badge}</p>
                    <p className="text-xl font-bold">{count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
              <CardTitle className="text-base">All Products</CardTitle>
              <div className="flex gap-2">
                <div className="relative">
                  <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
                  <Input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8 w-44" />
                </div>
                <Select value={filterBadge} onValueChange={setFilterBadge}>
                  <SelectTrigger className="h-8 w-36"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All badges</SelectItem>
                    <SelectItem value="none">No badge</SelectItem>
                    {BADGE_OPTIONS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-10 text-gray-400">Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">No products match</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Badge</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {(p.images?.[0] ?? p.image) && (
                            <img src={p.images?.[0] ?? p.image} alt={p.name} className="w-8 h-8 rounded object-cover bg-gray-100 flex-shrink-0" />
                          )}
                          <span className="font-medium text-sm line-clamp-1">{p.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{p.category ?? '—'}</TableCell>
                      <TableCell className="text-sm">${(p.price ?? 0).toFixed(2)}</TableCell>
                      <TableCell>
                        {p.badge ? (
                          <div className="flex items-center gap-1.5">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${BADGE_COLORS[p.badge] ?? 'bg-gray-100 text-gray-700'}`}>
                              {p.badge}
                            </span>
                            <button
                              onClick={() => removeBadge(p)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                              title="Remove badge"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => openEdit(p)}>
                          {p.badge ? 'Change' : 'Add Badge'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!editProduct} onOpenChange={(o) => !o && setEditProduct(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Set Badge</DialogTitle>
            <p className="text-sm text-gray-500 truncate">{editProduct?.name}</p>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Select value={newBadge} onValueChange={setNewBadge}>
              <SelectTrigger><SelectValue placeholder="Select badge…" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">No badge</SelectItem>
                {BADGE_OPTIONS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                <SelectItem value="__custom__">Custom…</SelectItem>
              </SelectContent>
            </Select>
            {newBadge === '__custom__' && (
              <Input
                placeholder="Enter custom badge text"
                value={customBadge}
                onChange={(e) => setCustomBadge(e.target.value)}
                maxLength={30}
              />
            )}
            {newBadge && newBadge !== '__custom__' && (
              <div className="p-3 bg-gray-50 rounded-lg flex items-center justify-center">
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${BADGE_COLORS[newBadge] ?? 'bg-gray-100 text-gray-700'}`}>
                  {newBadge}
                </span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProduct(null)}>Cancel</Button>
            <Button onClick={saveBadge} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
