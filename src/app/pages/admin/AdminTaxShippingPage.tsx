import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Plus, Pencil, Trash2, Truck, Percent } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { masterDataService } from '../../services/masterDataService';
import { ShippingMethod, TaxRate } from '../../types/api';
import { toast } from 'sonner';
import { getApiErrorMessage } from '../../lib/apiErrors';

// ─── Shipping ──────────────────────────────────────────────────────────────

const emptyShipping = (): Partial<ShippingMethod> => ({
  name: '', carrier: '', type: 'standard', base_cost: 0,
  estimated_days: 3, is_active: true, zones: [],
});

function ShippingTab() {
  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ShippingMethod | null>(null);
  const [form, setForm] = useState<Partial<ShippingMethod>>(emptyShipping());
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await adminService.listShippingMethods();
      setMethods(data);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to load shipping methods'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyShipping()); setOpen(true); };
  const openEdit = (m: ShippingMethod) => { setEditing(m); setForm({ ...m }); setOpen(true); };

  const save = async () => {
    if (!form.name?.trim()) { toast.error('Name is required'); return; }
    try {
      setSaving(true);
      if (editing) {
        await adminService.updateShippingMethod(editing.id, form);
        toast.success('Shipping method updated');
      } else {
        await adminService.createShippingMethod(form);
        toast.success('Shipping method created');
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to save'));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this shipping method?')) return;
    try {
      await adminService.deleteShippingMethod(id);
      toast.success('Deleted');
      setMethods((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to delete'));
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={openCreate}><Plus size={16} className="mr-2" />Add Method</Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading…</div>
      ) : methods.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-gray-400 gap-2">
          <Truck size={32} />
          <p className="text-sm">No shipping methods yet</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Carrier</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Base Cost</TableHead>
              <TableHead className="text-right">Est. Days</TableHead>
              <TableHead className="text-center">Active</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {methods.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{m.name}</TableCell>
                <TableCell className="text-gray-500">{m.carrier || '—'}</TableCell>
                <TableCell><Badge variant="outline">{m.type}</Badge></TableCell>
                <TableCell className="text-right">${(m.base_cost ?? 0).toFixed(2)}</TableCell>
                <TableCell className="text-right">{m.estimated_days}d</TableCell>
                <TableCell className="text-center">
                  <Badge className={m.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}>
                    {m.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 justify-end">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(m)}><Pencil size={13} /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => remove(m.id)}><Trash2 size={13} /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? 'Edit Shipping Method' : 'New Shipping Method'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Name *</Label>
                <Input value={form.name ?? ''} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Carrier</Label>
                <Input value={form.carrier ?? ''} onChange={(e) => setForm((p) => ({ ...p, carrier: e.target.value }))} placeholder="fedex, ups…" />
              </div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={form.type ?? 'standard'} onValueChange={(v) => setForm((p) => ({ ...p, type: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="express">Express</SelectItem>
                    <SelectItem value="overnight">Overnight</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Base Cost ($)</Label>
                <Input type="number" min={0} step={0.01} value={form.base_cost ?? 0} onChange={(e) => setForm((p) => ({ ...p, base_cost: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Estimated Days</Label>
                <Input type="number" min={1} value={form.estimated_days ?? 3} onChange={(e) => setForm((p) => ({ ...p, estimated_days: parseInt(e.target.value) || 1 }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Free Shipping ≥ ($)</Label>
                <Input type="number" min={0} step={0.01} value={form.free_shipping_threshold ?? ''} placeholder="none" onChange={(e) => setForm((p) => ({ ...p, free_shipping_threshold: e.target.value ? parseFloat(e.target.value) : undefined }))} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active ?? true} onCheckedChange={(v) => setForm((p) => ({ ...p, is_active: v }))} />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── Tax Rates ─────────────────────────────────────────────────────────────

const emptyTax = (): Partial<TaxRate> => ({
  country: '', state: undefined, rate: 0, tax_type: 'sales_tax', is_active: true,
});

function TaxTab() {
  const [rates, setRates] = useState<TaxRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TaxRate | null>(null);
  const [form, setForm] = useState<Partial<TaxRate>>(emptyTax());
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await adminService.listTaxRates();
      setRates(data);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to load tax rates'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyTax()); setOpen(true); };
  const openEdit = (r: TaxRate) => { setEditing(r); setForm({ ...r }); setOpen(true); };

  const save = async () => {
    if (!form.country?.trim()) { toast.error('Country is required'); return; }
    try {
      setSaving(true);
      if (editing) {
        await adminService.updateTaxRate(editing.id, form);
        toast.success('Tax rate updated');
      } else {
        await adminService.createTaxRate(form);
        toast.success('Tax rate created');
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to save'));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this tax rate?')) return;
    try {
      await adminService.deleteTaxRate(id);
      toast.success('Deleted');
      setRates((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to delete'));
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={openCreate}><Plus size={16} className="mr-2" />Add Rate</Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading…</div>
      ) : rates.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-gray-400 gap-2">
          <Percent size={32} />
          <p className="text-sm">No tax rates configured yet</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Rate (%)</TableHead>
              <TableHead className="text-center">Active</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rates.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.country}</TableCell>
                <TableCell className="text-gray-500">{r.state ?? '—'}</TableCell>
                <TableCell><Badge variant="outline">{r.tax_type}</Badge></TableCell>
                <TableCell className="text-right font-mono">{r.rate.toFixed(2)}%</TableCell>
                <TableCell className="text-center">
                  <Badge className={r.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}>
                    {r.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 justify-end">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(r)}><Pencil size={13} /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => remove(r.id)}><Trash2 size={13} /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? 'Edit Tax Rate' : 'New Tax Rate'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Country *</Label>
                <Input value={form.country ?? ''} placeholder="US, IN, GB…" onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>State / Province</Label>
                <Input value={form.state ?? ''} placeholder="CA, NY…" onChange={(e) => setForm((p) => ({ ...p, state: e.target.value || undefined }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Tax Type</Label>
                <Select value={form.tax_type ?? 'sales_tax'} onValueChange={(v) => setForm((p) => ({ ...p, tax_type: v as any }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales_tax">Sales Tax</SelectItem>
                    <SelectItem value="vat">VAT</SelectItem>
                    <SelectItem value="gst">GST</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Rate (%)</Label>
                <Input type="number" min={0} max={100} step={0.01} value={form.rate ?? 0} onChange={(e) => setForm((p) => ({ ...p, rate: parseFloat(e.target.value) || 0 }))} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active ?? true} onCheckedChange={(v) => setForm((p) => ({ ...p, is_active: v }))} />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export function AdminTaxShippingPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tax & Shipping</h1>
          <p className="text-gray-500 mt-1">Configure shipping methods and tax rates used at checkout</p>
        </div>
        <Tabs defaultValue="shipping">
          <TabsList>
            <TabsTrigger value="shipping">Shipping Methods</TabsTrigger>
            <TabsTrigger value="tax">Tax Rates</TabsTrigger>
          </TabsList>
          <TabsContent value="shipping" className="mt-4">
            <Card><CardContent className="pt-6"><ShippingTab /></CardContent></Card>
          </TabsContent>
          <TabsContent value="tax" className="mt-4">
            <Card><CardContent className="pt-6"><TaxTab /></CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
