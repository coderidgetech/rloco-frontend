import { useState, useEffect } from 'react';
import { PH } from '../../lib/formPlaceholders';
import { PLACEHOLDER_IMAGE } from '../../constants';
import { motion } from 'motion/react';
import { AdminLayout } from '../../components/admin/AdminLayout';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Search,
  Eye,
  Download,
  Filter,
  CheckCircle,
  Clock,
  Truck,
  Package,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { Order } from '../../types/api';
import { toast } from 'sonner';

export const AdminOrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const params: any = {
          limit,
          skip: page * limit,
        };
        
        if (statusFilter !== 'all') {
          params.status = statusFilter;
        }

        const response = await orderService.list(params) as { orders?: Order[]; total?: number };
        setOrders(response?.orders || []);
        setTotal(response?.total ?? 0);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        toast.error('Failed to load orders');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, limit, statusFilter]);

  // Format orders for display
  const formattedOrders = (orders || []).map((order) => ({
    id: order.order_number || `#${order.id.slice(-4)}`,
    customer: {
      name: order.shipping_info.first_name && order.shipping_info.last_name
        ? `${order.shipping_info.first_name} ${order.shipping_info.last_name}`
        : 'Unknown',
      email: order.shipping_info.email,
      phone: order.shipping_info.phone,
    },
    items: order.items.length,
    total: order.total,
    status: order.status,
    date: new Date(order.created_at).toLocaleDateString(),
    paymentMethod: order.payment_method,
    shippingAddress: order.shipping_info
      ? `${order.shipping_info.address}, ${order.shipping_info.city}, ${order.shipping_info.state} ${order.shipping_info.zip_code}`
      : 'N/A',
    orderData: order, // Keep full order data for details
  }));


  const filteredOrders = formattedOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      case 'processing':
        return <Clock className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewOrder = (order: any) => {
    // Use the full order data from formattedOrders
    setSelectedOrder(order.orderData || order);
    setShowOrderDialog(true);
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (selectedOrder) {
      try {
        await orderService.updateStatus(selectedOrder.id, newStatus);
        toast.success(`Order ${selectedOrder.order_number || selectedOrder.id} status updated to ${newStatus}`);
        // Refresh orders
        const response = await orderService.list({ limit, skip: page * limit, status: statusFilter !== 'all' ? statusFilter : undefined }) as { orders?: Order[]; total?: number };
        const orderList = response?.orders || [];
        setOrders(orderList);
        setTotal(response?.total ?? 0);
        // Update selected order
        const updatedOrder = orderList.find(o => o.id === selectedOrder.id);
        if (updatedOrder) {
          setSelectedOrder(updatedOrder);
        }
      } catch (error: any) {
        console.error('Failed to update order status:', error);
        toast.error(error.message || 'Failed to update order status');
      }
    }
  };

  const handleExportOrders = () => {
    const headers = ['Order Number', 'Customer', 'Email', 'Items', 'Total', 'Status', 'Payment Method', 'Created At'];
    const rows = filteredOrders.map((order) => [
      order.id,
      order.customer.name,
      order.customer.email,
      String(order.items),
      order.total.toFixed(2),
      order.status,
      order.paymentMethod,
      order.date,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `orders-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Orders exported');
  };

  const handlePrintPackingSlip = () => {
    if (!selectedOrder) return;
    const html = `
      <html><head><title>Packing Slip</title></head><body>
      <h2>Packing Slip</h2>
      <p>Order: ${selectedOrder.order_number || selectedOrder.id}</p>
      <p>Customer: ${selectedOrder.shipping_info?.first_name || ''} ${selectedOrder.shipping_info?.last_name || ''}</p>
      <p>Address: ${selectedOrder.shipping_info?.address || ''}, ${selectedOrder.shipping_info?.city || ''}, ${selectedOrder.shipping_info?.state || ''} ${selectedOrder.shipping_info?.zip_code || ''}</p>
      <ul>${(selectedOrder.items || []).map((item: any) => `<li>${item.product_name} - ${item.size} x ${item.quantity}</li>`).join('')}</ul>
      </body></html>
    `;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.print();
  };

  const handleDownloadInvoice = () => {
    if (!selectedOrder) return;
    const lines = [
      `Invoice`,
      `Order: ${selectedOrder.order_number || selectedOrder.id}`,
      `Date: ${new Date(selectedOrder.created_at).toLocaleDateString()}`,
      '',
      ...selectedOrder.items.map((item: any) => `${item.product_name} (${item.size}) x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`),
      '',
      `Subtotal: $${selectedOrder.subtotal.toFixed(2)}`,
      `Shipping: $${selectedOrder.shipping_cost.toFixed(2)}`,
      `Tax: $${selectedOrder.tax.toFixed(2)}`,
      `Discount: $${selectedOrder.discount.toFixed(2)}`,
      `Total: $${selectedOrder.total.toFixed(2)}`,
    ].join('\n');
    const blob = new Blob([lines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${selectedOrder.order_number || selectedOrder.id}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const stats = [
    { label: 'Total Orders', value: orders.length, color: 'text-blue-600' },
    {
      label: 'Pending',
      value: orders.filter((o) => o.status === 'pending').length,
      color: 'text-yellow-600',
    },
    {
      label: 'Processing',
      value: orders.filter((o) => o.status === 'processing').length,
      color: 'text-blue-600',
    },
    {
      label: 'Shipped',
      value: orders.filter((o) => o.status === 'shipped').length,
      color: 'text-purple-600',
    },
    {
      label: 'Delivered',
      value: orders.filter((o) => o.status === 'delivered').length,
      color: 'text-green-600',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-gray-600 mt-1">
              Manage and track all customer orders ({filteredOrders.length} orders)
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportOrders}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={PH.adminSearchOrders}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <span className="font-semibold">{order.id}</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-sm text-gray-500">{order.customer.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{new Date(order.date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.date).toLocaleTimeString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{order.items} items</TableCell>
                    <TableCell>
                      <span className="font-semibold">${order.total.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(order.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={showOrderDialog} onOpenChange={setShowOrderDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.order_number || selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              View and manage order information
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 py-4">
              {/* Order Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Current Status</p>
                  <Badge className={`${getStatusColor(selectedOrder.status || 'pending')} mt-1`}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(selectedOrder.status || 'pending')}
                      <span className="capitalize">{selectedOrder.status || 'pending'}</span>
                    </span>
                  </Badge>
                </div>
                <Select
                  value={selectedOrder.status || 'pending'}
                  onValueChange={handleUpdateStatus}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="font-semibold mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">
                      {selectedOrder.shipping_info?.first_name && selectedOrder.shipping_info?.last_name
                        ? `${selectedOrder.shipping_info.first_name} ${selectedOrder.shipping_info.last_name}`
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedOrder.shipping_info.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{selectedOrder.shipping_info.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium">{selectedOrder.payment_method}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-semibold mb-3">Shipping Address</h3>
                <p className="text-gray-700">
                  {selectedOrder.shipping_info
                    ? `${selectedOrder.shipping_info.address}, ${selectedOrder.shipping_info.city}, ${selectedOrder.shipping_info.state} ${selectedOrder.shipping_info.zip_code}, ${selectedOrder.shipping_info.country}`
                    : 'N/A'}
                </p>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                        <img
                          src={item.image || PLACEHOLDER_IMAGE}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-gray-600">Size: {item.size} × {item.quantity}</p>
                        </div>
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No items found</p>
                  )}
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded mt-4">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  {selectedOrder.shipping_cost !== undefined && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">${selectedOrder.shipping_cost.toFixed(2)}</span>
                    </div>
                  )}
                  {selectedOrder.tax !== undefined && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${selectedOrder.tax.toFixed(2)}</span>
                    </div>
                  )}
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-green-600">-${selectedOrder.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center p-3 bg-gray-100 rounded font-semibold">
                    <span>Total</span>
                    <span>${selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handlePrintPackingSlip}>
                  <Package className="h-4 w-4 mr-2" />
                  Print Packing Slip
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleDownloadInvoice}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoice
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};
