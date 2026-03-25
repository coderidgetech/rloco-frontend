import { useState, useEffect } from 'react';
import { PH } from '../../lib/formPlaceholders';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  Search,
  MoreVertical,
  Eye,
  Mail,
  Ban,
  Download,
  UserCheck,
  ShoppingBag,
  DollarSign,
  Plus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { User } from '../../types/api';
import { toast } from 'sonner';

export const AdminCustomersPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);

  // Fetch customers from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await adminService.listCustomers({
          limit,
          skip: page * limit,
        });
        const list = Array.isArray(response) ? response : (response as any)?.data ?? [];
        const customerList = list.filter((user: User) => user.role === 'customer');
        setCustomers(customerList);
        const totalCount = typeof (response as any)?.total === 'number' ? (response as any).total : customerList.length;
        setTotal(totalCount);
      } catch (error) {
        console.error('Failed to fetch customers:', error);
        toast.error('Failed to load customers');
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [page, limit]);


  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const handleViewCustomer = (customer: User) => {
    setSelectedCustomer(customer);
    setShowCustomerDialog(true);
  };

  const handleSendEmail = (customer: User) => {
    window.location.href = `mailto:${customer.email}`;
  };

  const handleToggleStatus = async (customer: User) => {
    try {
      const newActive = !(customer.active ?? true);
      await adminService.updateCustomer(customer.id, { active: newActive });
      toast.success(newActive ? 'Customer activated' : 'Customer deactivated');
      setCustomers((prev) =>
        prev.map((c) => (c.id === customer.id ? { ...c, active: newActive } : c))
      );
      if (selectedCustomer?.id === customer.id) {
        setSelectedCustomer({ ...selectedCustomer, active: newActive });
      }
    } catch (error: any) {
      console.error('Failed to update customer status:', error);
      toast.error(error?.message || 'Failed to update customer status');
    }
  };

  const [dashboardStats, setDashboardStats] = useState<any>(null);

  useEffect(() => {
    adminService.getDashboardStats().then(setDashboardStats).catch(() => setDashboardStats(null));
  }, []);

  const activeCount = customers.filter((c) => c.active !== false).length;
  const stats = [
    {
      label: 'Total Customers',
      value: total > 0 ? total : customers.length,
      icon: UserCheck,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Active',
      value: activeCount,
      icon: UserCheck,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Total Orders',
      value: dashboardStats?.total_orders != null ? dashboardStats.total_orders : '—',
      icon: ShoppingBag,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Total Revenue',
      value: dashboardStats?.total_revenue != null ? `$${Number(dashboardStats.total_revenue).toLocaleString()}` : '—',
      icon: DollarSign,
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Customers</h1>
            <p className="text-gray-600 mt-1">
              Manage your customer base ({filteredCustomers.length} customers)
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => navigate('/admin/users/add')}>
              <Plus className="h-4 w-4 mr-2" />
              Create User
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={PH.adminSearchCustomers}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Customers Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    Loading customers...
                  </TableCell>
                </TableRow>
              ) : filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={customer.avatar} alt={customer.name} />
                          <AvatarFallback>{customer.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-gray-500">ID: {customer.id.slice(-8)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{customer.email}</p>
                        <p className="text-sm text-gray-500">{customer.phone || '—'}</p>
                      </div>
                    </TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>
                      <span className="font-semibold">—</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">—</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={customer.active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {customer.active !== false ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(customer.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewCustomer(customer)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSendEmail(customer)}>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleToggleStatus(customer)}>
                            <Ban className="h-4 w-4 mr-2" />
                            {customer.status === 'active' ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Customer Details Dialog */}
      <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>
              View comprehensive customer information and activity
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-6 py-4">
              {/* Customer Header */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedCustomer.avatar} alt={selectedCustomer.name} />
                  <AvatarFallback className="text-2xl">
                    {selectedCustomer.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{selectedCustomer.name}</h3>
                  <p className="text-gray-600">{selectedCustomer.email}</p>
                  <Badge className="mt-2 bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>
              </div>

              {/* Customer Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="text-2xl font-bold capitalize">{selectedCustomer.role || 'Customer'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">User ID</p>
                  <p className="text-sm font-medium">{selectedCustomer.id}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg col-span-2">
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{selectedCustomer.email}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg col-span-2">
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium">
                    {new Date(selectedCustomer.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleSendEmail(selectedCustomer)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  View Orders
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};
