import { useState, useEffect } from 'react';
import { PH } from '../../lib/formPlaceholders';
import { useNavigate } from 'react-router-dom';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Search,
  MoreVertical,
  Eye,
  Edit,
  Plus,
  Store,
  Package,
  DollarSign,
  TrendingUp,
  UserCheck,
  Ban,
  Shield,
  Trash2,
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { User } from '../../types/api';
import { toast } from 'sonner';
import { VendorPrivilegeDialog } from '../../components/admin/VendorPrivilegeDialog';
import { VendorTier, VendorRole, VendorPermissions } from '../../types/vendor-permissions';

export const AdminVendorsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<User | null>(null);
  const [showVendorDialog, setShowVendorDialog] = useState(false);
  const [showPrivilegeDialog, setShowPrivilegeDialog] = useState(false);
  const [privilegeVendor, setPrivilegeVendor] = useState<User | null>(null);
  const [vendors, setVendors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [vendorToDelete, setVendorToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch vendors from API
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const vendorList = await adminService.listVendors();
        setVendors(vendorList || []);
      } catch (error) {
        console.error('Failed to fetch vendors:', error);
        toast.error('Failed to load vendors');
        setVendors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);


  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const handleViewVendor = (vendor: User) => {
    setSelectedVendor(vendor);
    setShowVendorDialog(true);
  };

  const handleToggleStatus = async (vendor: User) => {
    try {
      const newActive = !(vendor.active ?? true);
      await adminService.updateCustomer(vendor.id, { active: newActive });
      toast.success(newActive ? 'Vendor activated' : 'Vendor deactivated');
      setVendors((prev) =>
        prev.map((v) => (v.id === vendor.id ? { ...v, active: newActive } : v))
      );
      if (selectedVendor?.id === vendor.id) {
        setSelectedVendor({ ...selectedVendor, active: newActive });
      }
    } catch (error: any) {
      console.error('Failed to update vendor status:', error);
      toast.error(error?.response?.data?.error || 'Failed to update vendor status');
    }
  };

  const handleDeleteVendor = async () => {
    if (!vendorToDelete) return;
    setDeleting(true);
    try {
      await adminService.deleteVendor(vendorToDelete.id);
      toast.success(`${vendorToDelete.name} was removed`);
      setVendors((prev) => prev.filter((v) => v.id !== vendorToDelete.id));
      if (selectedVendor?.id === vendorToDelete.id) {
        setShowVendorDialog(false);
        setSelectedVendor(null);
      }
      setVendorToDelete(null);
    } catch (error: unknown) {
      console.error('Failed to delete vendor:', error);
      const msg =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { error?: string } } }).response?.data?.error
          : undefined;
      toast.error(msg || 'Failed to delete vendor');
    } finally {
      setDeleting(false);
    }
  };

  const handleApproveVendor = async (vendor: User) => {
    try {
      await adminService.updateCustomer(vendor.id, { active: true });
      toast.success(`${vendor.name} has been approved`);
      setVendors((prev) =>
        prev.map((v) => (v.id === vendor.id ? { ...v, active: true } : v))
      );
      if (selectedVendor?.id === vendor.id) {
        setSelectedVendor({ ...selectedVendor, active: true });
      }
    } catch (error: any) {
      console.error('Failed to approve vendor:', error);
      toast.error(error?.response?.data?.error || 'Failed to approve vendor');
    }
  };

  const stats = [
    {
      label: 'Total Vendors',
      value: vendors.length,
      icon: Store,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Active Vendors',
      value: vendors.length, // All vendors are active by default
      icon: UserCheck,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Total Products',
      value: 'N/A', // Would need to calculate from products
      icon: Package,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Total Sales',
      value: 'N/A', // Would need to calculate from orders
      icon: DollarSign,
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Vendors</h1>
            <p className="text-gray-600 mt-1">
              Manage vendor partners and their stores ({filteredVendors.length} vendors)
            </p>
          </div>
          <Button onClick={() => navigate('/admin/vendors/add')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Vendor
          </Button>
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
            placeholder={PH.adminSearchVendors}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Vendors Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    Loading vendors...
                  </TableCell>
                </TableRow>
              ) : filteredVendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No vendors found
                  </TableCell>
                </TableRow>
              ) : (
                filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={vendor.avatar} alt={vendor.name} />
                          <AvatarFallback>{vendor.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{vendor.name}</p>
                          <p className="text-sm text-gray-500">ID: {vendor.id.slice(-8)}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{vendor.email}</p>
                        <p className="text-sm text-gray-500">{vendor.phone || '—'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">—</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">—</span>
                    </TableCell>
                    <TableCell>—</TableCell>
                    <TableCell>
                      <Badge className={vendor.active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {vendor.active !== false ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(vendor.created_at).toLocaleDateString()}
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
                          <DropdownMenuItem onClick={() => handleViewVendor(vendor)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate('/admin/vendors/add', { state: { vendor } })}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {/* Approve action - shown for pending vendors */}
                          <DropdownMenuItem onClick={() => handleApproveVendor(vendor)}>
                            <UserCheck className="h-4 w-4 mr-2" />
                            Approve Vendor
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleToggleStatus(vendor)}>
                            <Ban className="h-4 w-4 mr-2" />
                            Toggle Status
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => {
                            setPrivilegeVendor(vendor);
                            setShowPrivilegeDialog(true);
                          }}>
                            <Shield className="h-4 w-4 mr-2" />
                            Manage Privileges
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => setVendorToDelete(vendor)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete vendor
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

      {/* Vendor Details Dialog */}
      <Dialog open={showVendorDialog} onOpenChange={setShowVendorDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Vendor Details</DialogTitle>
            <DialogDescription>
              View comprehensive vendor information and performance
            </DialogDescription>
          </DialogHeader>

          {selectedVendor && (
            <div className="space-y-6 py-4">
              {/* Vendor Header */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedVendor.avatar} alt={selectedVendor.name} />
                  <AvatarFallback className="text-2xl">
                    {selectedVendor.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{selectedVendor.name}</h3>
                  <p className="text-gray-600">{selectedVendor.email}</p>
                  <Badge className="mt-2 bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>
              </div>

              {/* Vendor Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Role</p>
                  <p className="text-2xl font-bold capitalize">{selectedVendor.role || 'Vendor'}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">Vendor ID</p>
                  <p className="text-sm font-medium">{selectedVendor.vendor_id || selectedVendor.id}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg col-span-2">
                  <p className="text-sm text-gray-600">User ID</p>
                  <p className="text-sm font-medium">{selectedVendor.id}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg col-span-2">
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium">
                    {new Date(selectedVendor.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <p className="text-sm font-semibold mb-2">Contact Information</p>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-700">Email: {selectedVendor.email}</p>
                  <p className="text-gray-700">Phone: N/A</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Vendor Privilege Dialog */}
      {privilegeVendor && (
        <VendorPrivilegeDialog
          open={showPrivilegeDialog}
          onClose={() => {
            setShowPrivilegeDialog(false);
            setPrivilegeVendor(null);
          }}
          vendor={{
            id: privilegeVendor.id,
            businessName: privilegeVendor.name,
            email: privilegeVendor.email,
            tier: (privilegeVendor as User & { tier?: string }).tier,
            role: privilegeVendor.role,
          }}
          onSave={async (vendorId, _tier, _role, permissions) => {
            try {
              await adminService.updateVendorPermissions(vendorId, permissions as Record<string, unknown>);
              toast.success('Vendor privileges updated successfully');
              const vendorList = await adminService.listVendors();
              setVendors(vendorList || []);
              setShowPrivilegeDialog(false);
              setPrivilegeVendor(null);
            } catch (error: unknown) {
              console.error('Failed to update vendor privileges:', error);
              const msg = error instanceof Error ? error.message : 'Failed to update vendor privileges';
              toast.error(msg);
            }
          }}
        />
      )}

      <AlertDialog open={!!vendorToDelete} onOpenChange={(open) => !open && setVendorToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this vendor?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the vendor record and their portal login user. This cannot be undone. Existing products or
              orders that reference this vendor may need cleanup separately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                void handleDeleteVendor();
              }}
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};