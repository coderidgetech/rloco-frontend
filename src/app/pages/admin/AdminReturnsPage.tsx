import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { RotateCcw, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Return } from '../../types/api';
import { toast } from 'sonner';
import { getApiErrorMessage } from '../../lib/apiErrors';

const STATUS_COLORS: Record<string, string> = {
  requested: 'bg-blue-100 text-blue-700',
  approved: 'bg-amber-100 text-amber-700',
  rejected: 'bg-red-100 text-red-700',
  processing: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
};

const REFUND_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  processed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
};

function fmt(iso: string) {
  return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function AdminReturnsPage() {
  const [returns, setReturns] = useState<Return[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Return | null>(null);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [refundTarget, setRefundTarget] = useState<Return | null>(null);
  const [refundMethod, setRefundMethod] = useState('original');
  const [processing, setProcessing] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 50, skip: 0 };
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await adminService.listAllReturns(params);
      setReturns(res.data ?? []);
      setTotal(res.total ?? 0);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to load returns'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [statusFilter]);

  const updateStatus = async (ret: Return, status: string) => {
    try {
      await adminService.updateReturnStatus(ret.id, status);
      toast.success(`Return ${status}`);
      setReturns((prev) => prev.map((r) => r.id === ret.id ? { ...r, status: status as Return['status'] } : r));
      if (selected?.id === ret.id) setSelected((prev) => prev ? { ...prev, status: status as Return['status'] } : prev);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to update status'));
    }
  };

  const openRefundDialog = (ret: Return) => {
    setRefundTarget(ret);
    setRefundMethod(ret.refund_method || 'original');
    setRefundDialogOpen(true);
  };

  const submitRefund = async () => {
    if (!refundTarget) return;
    try {
      setProcessing(true);
      await adminService.processRefund(refundTarget.id, refundMethod);
      toast.success('Refund processed');
      setRefundDialogOpen(false);
      load();
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to process refund'));
    } finally {
      setProcessing(false);
    }
  };

  const pendingCount = returns.filter((r) => r.status === 'requested').length;
  const approvedCount = returns.filter((r) => r.status === 'approved').length;
  const refundPendingCount = returns.filter((r) => r.refund_status === 'pending' && r.status === 'approved').length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Returns & Refunds</h1>
          <p className="text-gray-500 mt-1">Review and process customer return requests</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg"><RotateCcw size={18} className="text-blue-600" /></div>
                <div>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-xs text-gray-500">Pending Review</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg"><CheckCircle size={18} className="text-amber-600" /></div>
                <div>
                  <p className="text-2xl font-bold">{approvedCount}</p>
                  <p className="text-xs text-gray-500">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg"><DollarSign size={18} className="text-green-600" /></div>
                <div>
                  <p className="text-2xl font-bold">{refundPendingCount}</p>
                  <p className="text-xs text-gray-500">Refunds Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Filter by status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Returns</SelectItem>
              <SelectItem value="requested">Requested</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500">{total} total</span>
        </div>

        <Card>
          <CardContent className="pt-0">
            {loading ? (
              <div className="text-center py-12 text-gray-400">Loading…</div>
            ) : returns.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-gray-400 gap-2">
                <RotateCcw size={32} />
                <p className="text-sm">No return requests found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Refund Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Refund Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {returns.map((ret) => (
                    <TableRow key={ret.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelected(ret)}>
                      <TableCell className="font-mono text-xs">#{ret.order_number || ret.order_id.slice(-8)}</TableCell>
                      <TableCell className="max-w-[160px] truncate text-sm">{ret.reason}</TableCell>
                      <TableCell className="text-sm text-gray-500">{ret.items?.length ?? 0} item(s)</TableCell>
                      <TableCell className="text-right font-medium">${(ret.refund_amount ?? 0).toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={STATUS_COLORS[ret.status] ?? 'bg-gray-100 text-gray-500'}>
                          {ret.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={REFUND_STATUS_COLORS[ret.refund_status] ?? 'bg-gray-100 text-gray-500'}>
                          {ret.refund_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-gray-500 whitespace-nowrap">{fmt(ret.created_at)}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1 justify-end">
                          {ret.status === 'requested' && (
                            <>
                              <Button size="sm" variant="outline" className="h-7 text-xs text-green-700 border-green-200 hover:bg-green-50"
                                onClick={() => updateStatus(ret, 'approved')}>
                                <CheckCircle size={12} className="mr-1" />Approve
                              </Button>
                              <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => updateStatus(ret, 'rejected')}>
                                <XCircle size={12} className="mr-1" />Reject
                              </Button>
                            </>
                          )}
                          {ret.status === 'approved' && ret.refund_status === 'pending' && (
                            <Button size="sm" variant="outline" className="h-7 text-xs text-blue-700 border-blue-200 hover:bg-blue-50"
                              onClick={() => openRefundDialog(ret)}>
                              <DollarSign size={12} className="mr-1" />Refund
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Return detail dialog */}
      <Dialog open={!!selected} onOpenChange={(v) => { if (!v) setSelected(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Return #{selected?.order_number || selected?.id.slice(-8)}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 py-2 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Status</p>
                  <Badge className={STATUS_COLORS[selected.status] ?? 'bg-gray-100 text-gray-500'}>{selected.status}</Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Refund Status</p>
                  <Badge className={REFUND_STATUS_COLORS[selected.refund_status] ?? 'bg-gray-100 text-gray-500'}>{selected.refund_status}</Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Reason</p>
                  <p className="font-medium">{selected.reason}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Refund Amount</p>
                  <p className="font-medium">${(selected.refund_amount ?? 0).toFixed(2)}</p>
                </div>
              </div>
              {selected.description && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Description</p>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{selected.description}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-400 mb-2">Items</p>
                <div className="space-y-1">
                  {(selected.items ?? []).map((item, i) => (
                    <div key={i} className="flex justify-between text-xs bg-gray-50 rounded px-3 py-2">
                      <span>{item.product_name ?? item.product_id}</span>
                      <span className="text-gray-500">×{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
              {selected.tracking_number && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">Tracking Number</p>
                  <p className="font-mono">{selected.tracking_number}</p>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                {selected.status === 'requested' && (
                  <>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => { updateStatus(selected, 'approved'); setSelected(null); }}>
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-200"
                      onClick={() => { updateStatus(selected, 'rejected'); setSelected(null); }}>
                      Reject
                    </Button>
                  </>
                )}
                {selected.status === 'approved' && selected.refund_status === 'pending' && (
                  <Button size="sm" onClick={() => { setSelected(null); openRefundDialog(selected); }}>
                    Process Refund
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Refund dialog */}
      <Dialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Process Refund</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-gray-500">
              Refund <span className="font-semibold text-gray-900">${(refundTarget?.refund_amount ?? 0).toFixed(2)}</span> for order #{refundTarget?.order_number || refundTarget?.id.slice(-8)}
            </p>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Refund Method</label>
              <Select value={refundMethod} onValueChange={setRefundMethod}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="original">Original Payment Method</SelectItem>
                  <SelectItem value="store_credit">Store Credit</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRefundDialogOpen(false)}>Cancel</Button>
            <Button onClick={submitRefund} disabled={processing}>{processing ? 'Processing…' : 'Process Refund'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
