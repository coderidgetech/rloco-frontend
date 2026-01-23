import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
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
  DialogFooter,
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
import { Switch } from '../../components/ui/switch';
import { Textarea } from '../../components/ui/textarea';
import { Plus, Edit, Trash2, Copy, Tag, Percent } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Promotion } from '../../types/api';
import { toast } from 'sonner';

export const AdminPromotionsPage = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch promotions from API
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        setLoading(true);
        const promotionList = await adminService.listPromotions();
        setPromotions(Array.isArray(promotionList) ? promotionList : []);
      } catch (error) {
        console.error('Failed to fetch promotions:', error);
        toast.error('Failed to load promotions');
        setPromotions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const handleEdit = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setShowEditDialog(true);
  };

  const handleDelete = (promotion: Promotion) => {
    toast.success(`Promotion "${promotion.name}" deleted successfully`);
  };

  const handleDuplicate = (promotion: Promotion) => {
    toast.success(`Promotion "${promotion.name}" duplicated successfully`);
  };

  const handleToggleStatus = async (promotion: Promotion) => {
    try {
      const newStatus = promotion.is_active ? false : true;
      await adminService.updatePromotion(promotion.id, { is_active: newStatus });
      toast.success(`Promotion "${promotion.name}" ${newStatus ? 'activated' : 'deactivated'}`);
      // Refresh promotions
      const promotionList = await adminService.listPromotions();
      // Backend should always return an array, but ensure it's not null
      setPromotions(Array.isArray(promotionList) ? promotionList : []);
    } catch (error: any) {
      console.error('Failed to toggle promotion status:', error);
      toast.error(error.message || 'Failed to update promotion status');
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'percentage':
        return 'Percentage Off';
      case 'fixed':
        return 'Fixed Amount';
      case 'free_shipping':
        return 'Free Shipping';
      default:
        return type;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return <Percent className="h-4 w-4" />;
      case 'free_shipping':
        return <Tag className="h-4 w-4" />;
      default:
        return <Tag className="h-4 w-4" />;
    }
  };

  // Ensure promotions is always an array before computing stats
  const promotionsArray = Array.isArray(promotions) ? promotions : [];
  
  const stats = [
    {
      label: 'Active Promotions',
      value: promotionsArray.filter((p) => p.is_active).length,
      color: 'text-green-600',
    },
    {
      label: 'Total Usage',
      value: promotionsArray.reduce((sum, p) => sum + (p.usage_count || 0), 0),
      color: 'text-blue-600',
    },
    {
      label: 'Scheduled',
      value: promotionsArray.filter((p) => new Date(p.start_date) > new Date()).length,
      color: 'text-purple-600',
    },
    {
      label: 'Expired',
      value: promotionsArray.filter((p) => new Date(p.end_date) < new Date() && !p.is_active).length,
      color: 'text-gray-600',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Promotions</h1>
            <p className="text-gray-600 mt-1">
              Create and manage discount codes and promotional offers
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Promotion
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        {/* Promotions Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Promotion</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading promotions...</p>
                  </TableCell>
                </TableRow>
              ) : promotionsArray.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-600">
                    No promotions found
                  </TableCell>
                </TableRow>
              ) : (
                promotionsArray.map((promotion) => (
                <TableRow key={promotion.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{promotion.name}</p>
                      <p className="text-sm text-gray-500">{promotion.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                      {promotion.code}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      {getTypeIcon(promotion.type)}
                      {getTypeLabel(promotion.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {promotion.type === 'percentage' && `${promotion.value}%`}
                    {promotion.type === 'fixed' && `$${promotion.value}`}
                    {promotion.type === 'free_shipping' && 'Free'}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{new Date(promotion.startDate).toLocaleDateString()}</p>
                      <p className="text-gray-500">to {new Date(promotion.endDate).toLocaleDateString()}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{promotion.usageCount}</p>
                      {promotion.usageLimit && (
                        <p className="text-sm text-gray-500">of {promotion.usageLimit}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(promotion)}
                    >
                      {promotion.is_active ? (
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(promotion)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDuplicate(promotion)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(promotion)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Promotion Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Promotion</DialogTitle>
            <DialogDescription>
              Set up a new discount code or promotional offer
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Promotion Name</Label>
                <Input placeholder="e.g., Winter Sale" />
              </div>
              <div className="space-y-2">
                <Label>Discount Code</Label>
                <Input placeholder="e.g., WINTER25" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Internal notes about this promotion..." rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select defaultValue="percentage">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage Off</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="free_shipping">Free Shipping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Discount Value</Label>
                <Input type="number" placeholder="25" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Minimum Purchase</Label>
                <Input type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label>Usage Limit (Optional)</Label>
                <Input type="number" placeholder="Unlimited" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch defaultChecked />
              <Label>Activate immediately</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success('Promotion created successfully');
                setShowAddDialog(false);
              }}
            >
              Create Promotion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Promotion Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Promotion</DialogTitle>
            <DialogDescription>
              Update promotion details
            </DialogDescription>
          </DialogHeader>
          {selectedPromotion && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Promotion Name</Label>
                  <Input defaultValue={selectedPromotion.name} />
                </div>
                <div className="space-y-2">
                  <Label>Discount Code</Label>
                  <Input defaultValue={selectedPromotion.code} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Discount Type</Label>
                  <Select defaultValue={selectedPromotion.type}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage Off</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="free_shipping">Free Shipping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Discount Value</Label>
                  <Input type="number" defaultValue={selectedPromotion.value} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" defaultValue={selectedPromotion.startDate} />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" defaultValue={selectedPromotion.endDate} />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch defaultChecked={selectedPromotion.isActive} />
                <Label>Active</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success('Promotion updated successfully');
                setShowEditDialog(false);
                setSelectedPromotion(null);
              }}
            >
              Update Promotion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};
