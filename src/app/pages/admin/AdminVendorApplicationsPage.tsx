import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '../../components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '../../components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../components/ui/select';
import { CheckCircle, XCircle, Eye, Store } from 'lucide-react';
import { toast } from 'sonner';
import {
  vendorApplicationService,
  type VendorApplication,
} from '../../services/vendorApplicationService';
import { getApiErrorMessage } from '../../lib/apiErrors';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function AdminVendorApplicationsPage() {
  const [applications, setApplications] = useState<VendorApplication[]>([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<VendorApplication | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const [actionOpen, setActionOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [actionNote, setActionNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const load = async (status: string) => {
    setLoading(true);
    try {
      const res = await vendorApplicationService.list({ status: status === 'all' ? undefined : status, limit: 50 });
      setApplications(res.data.applications ?? []);
      setTotal(res.data.total);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(statusFilter); }, [statusFilter]);

  const openAction = (app: VendorApplication, type: 'approve' | 'reject') => {
    setSelected(app);
    setActionType(type);
    setActionNote('');
    setActionOpen(true);
  };

  const confirmAction = async () => {
    if (!selected) return;
    setActionLoading(true);
    try {
      if (actionType === 'approve') {
        await vendorApplicationService.approve(selected.id, actionNote);
      } else {
        await vendorApplicationService.reject(selected.id, actionNote);
      }
      setActionOpen(false);
      load(statusFilter);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Action failed'));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Store size={22} />
            <div>
              <h1 className="text-xl font-semibold">Vendor Applications</h1>
              <p className="text-sm text-muted-foreground">{total} total</p>
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">Loading…</TableCell>
                </TableRow>
              ) : applications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No applications found</TableCell>
                </TableRow>
              ) : applications.map(app => (
                <TableRow key={app.id}>
                  <TableCell>
                    <div className="font-medium">{app.business_name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{app.business_type}</div>
                  </TableCell>
                  <TableCell>
                    <div>{app.contact_name}</div>
                    <div className="text-xs text-muted-foreground">{app.email}</div>
                  </TableCell>
                  <TableCell className="text-sm">{app.category}</TableCell>
                  <TableCell className="text-sm">{app.city}, {app.state}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(app.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[app.status] ?? ''}`}>
                      {app.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => { setSelected(app); setDetailOpen(true); }}
                      >
                        <Eye size={14} />
                      </Button>
                      {app.status === 'pending' && (
                        <>
                          <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700"
                            onClick={() => openAction(app, 'approve')}>
                            <CheckCircle size={14} />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600"
                            onClick={() => openAction(app, 'reject')}>
                            <XCircle size={14} />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Detail dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selected?.business_name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div className="flex gap-2 items-center">
                <Badge variant="outline" className="capitalize">{selected.business_type}</Badge>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[selected.status] ?? ''}`}>
                  {selected.status}
                </span>
              </div>

              <Grid label="Contact" value={`${selected.contact_name} · ${selected.email} · ${selected.phone}`} />
              {selected.whatsapp && <Grid label="WhatsApp" value={selected.whatsapp} />}
              {selected.website && <Grid label="Website" value={selected.website} />}
              {selected.instagram && <Grid label="Instagram" value={selected.instagram} />}
              {selected.gst_number && <Grid label="GST" value={selected.gst_number} />}

              <hr />
              <Grid label="Address" value={[selected.address_line1, selected.address_line2, `${selected.city}, ${selected.state} ${selected.pin_code}`, selected.country].filter(Boolean).join(', ')} />

              <hr />
              <Grid label="Category" value={selected.category} />
              <Grid label="Price range" value={`₹${selected.price_range}`} />
              <Grid label="Listings/month" value={selected.estimated_listings} />
              <Grid label="Products" value={selected.product_description} />

              {selected.how_did_you_hear && <Grid label="Referral" value={selected.how_did_you_hear} />}
              {selected.message && <Grid label="Message" value={selected.message} />}
              {selected.admin_notes && (
                <>
                  <hr />
                  <Grid label="Admin notes" value={selected.admin_notes} />
                </>
              )}
            </div>
          )}
          {selected?.status === 'pending' && (
            <DialogFooter className="gap-2">
              <Button variant="outline" className="text-red-500 border-red-200"
                onClick={() => { setDetailOpen(false); openAction(selected, 'reject'); }}>
                Reject
              </Button>
              <Button onClick={() => { setDetailOpen(false); openAction(selected, 'approve'); }}>
                Approve
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve / Reject confirmation dialog */}
      <Dialog open={actionOpen} onOpenChange={setActionOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve application' : 'Reject application'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {actionType === 'approve'
                ? `This will create a vendor account for ${selected?.email} and send them login credentials.`
                : `${selected?.business_name} will be notified by email.`}
            </p>
            <div className="space-y-1.5">
              <Label>{actionType === 'approve' ? 'Notes (optional)' : 'Reason (optional)'}</Label>
              <Textarea
                value={actionNote}
                onChange={e => setActionNote(e.target.value)}
                rows={3}
                placeholder={actionType === 'approve' ? 'Internal notes…' : 'Let the applicant know why…'}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionOpen(false)}>Cancel</Button>
            <Button
              disabled={actionLoading}
              variant={actionType === 'reject' ? 'destructive' : 'default'}
              onClick={confirmAction}
            >
              {actionLoading ? 'Please wait…' : actionType === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

function Grid({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="col-span-2">{value}</span>
    </div>
  );
}
