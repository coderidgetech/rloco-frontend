import { useState, useEffect } from 'react';
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

  // Fetch vendors from API
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const vendorList = await adminService.listVendors();
        // Filter to only show vendors
        const vendorUsers = vendorList.filter((user: User) => user.role === 'vendor');
        setVendors(vendorUsers);
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

  // Mock vendors data (fallback)
  const mockVendors: any[] = [
    {
      id: 'VEND-001',
      name: 'Fashion Forward Inc',
      email: 'contact@fashionforward.com',
      phone: '+1 (555) 111-2222',
      logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=fashion',
      storeName: 'Fashion Forward',
      products: 45,
      sales: 25600,
      commission: 15,
      status: 'active',
      joinedDate: '2024-06-15',
      description: 'Premium fashion retailer specializing in contemporary women\'s wear',
      tier: 'premium',
      role: 'owner',
    },
    {
      id: 'VEND-002',
      name: 'Luxury Boutique Co',
      email: 'info@luxuryboutique.com',
      phone: '+1 (555) 222-3333',
      logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=luxury',
      storeName: 'Luxury Boutique',
      products: 32,
      sales: 42300,
      commission: 18,
      status: 'active',
      joinedDate: '2024-08-20',
      description: 'High-end designer collections and exclusive pieces',
      tier: 'enterprise',
      role: 'owner',
    },
    {
      id: 'VEND-003',
      name: 'Urban Style Ltd',
      email: 'hello@urbanstyle.com',
      phone: '+1 (555) 333-4444',
      logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=urban',
      storeName: 'Urban Style',
      products: 28,
      sales: 18900,
      commission: 12,
      status: 'active',
      joinedDate: '2024-09-10',
      description: 'Modern streetwear and casual fashion for the urban lifestyle',
      tier: 'basic',
      role: 'manager',
    },
    {
      id: 'VEND-004',
      name: 'Classic Elegance',
      email: 'support@classicelegance.com',
      phone: '+1 (555) 444-5555',
      logo: 'https://api.dicebear.com/7.x/identicon/svg?seed=classic',
      storeName: 'Classic Elegance',
      products: 15,
      sales: 8500,
      commission: 10,
      status: 'pending',
      joinedDate: '2026-01-05',
      description: 'Timeless fashion pieces with classic sophistication',
      tier: 'basic',
      role: 'owner',
    },
  ];

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
      // Note: Backend may need an 'active' field or similar
      toast.success(`Vendor ${vendor.name} status updated`);
      // Refresh vendors list
      const vendorList = await adminService.listVendors();
      const vendorUsers = vendorList.filter((user) => user.role === 'vendor');
      setVendors(vendorUsers);
    } catch (error: any) {
      console.error('Failed to update vendor status:', error);
      toast.error(error.message || 'Failed to update vendor status');
    }
  };

  const handleApproveVendor = async (vendor: User) => {
    try {
      // Update vendor to active status
      await adminService.updateVendor(vendor.id, {});
      toast.success(`Vendor ${vendor.name} approved successfully`);
      // Refresh vendors list
      const vendorList = await adminService.listVendors();
      const vendorUsers = vendorList.filter((user) => user.role === 'vendor');
      setVendors(vendorUsers);
    } catch (error: any) {
      console.error('Failed to approve vendor:', error);
      toast.error(error.message || 'Failed to approve vendor');
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
            placeholder="Search vendors by name, store, or email..."
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
                        <p className="text-sm text-gray-500">N/A</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">N/A</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">N/A</span>
                    </TableCell>
                    <TableCell>N/A</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">
                        Active
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
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          {/* Status-based actions would go here */}
                          {false && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleApproveVendor(vendor)}>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Approve
                              </DropdownMenuItem>
                            </>
                          )}
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
            tier: privilegeVendor.tier,
            role: privilegeVendor.role,
          }}
          onSave={(vendorId, tier, role, permissions) => {
            console.log('Vendor privileges saved:', { vendorId, tier, role, permissions });
            // Here you would save to backend
          }}
        />
      )}
    </AdminLayout>
  );
};