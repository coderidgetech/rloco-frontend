import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import {
  Shield,
  ShoppingBag,
  Package,
  DollarSign,
  BarChart3,
  Users,
  Tag,
  Settings,
  MessageSquare,
  Check,
  X,
  Crown,
  Star,
  Zap,
} from 'lucide-react';
import { VendorRole, VendorTier, VendorPermissions, ROLE_PERMISSIONS, VENDOR_TIERS } from '../../types/vendor-permissions';

function normalizePrivilegeRole(role: string | undefined): VendorRole {
  if (role === 'owner' || role === 'manager' || role === 'staff' || role === 'readonly') {
    return role;
  }
  return 'owner';
}

function normalizeTier(tier: string | undefined): VendorTier {
  if (tier === 'basic' || tier === 'premium' || tier === 'enterprise') {
    return tier;
  }
  return 'basic';
}

function cloneRolePermissions(role: VendorRole): Partial<VendorPermissions> {
  return structuredClone(ROLE_PERMISSIONS[role]) as Partial<VendorPermissions>;
}

interface VendorPrivilegeDialogProps {
  open: boolean;
  onClose: () => void;
  vendor: {
    id: string;
    businessName: string;
    email: string;
    tier?: VendorTier | string;
    /** App user role is often `vendor`; privilege role is owner|manager|staff|readonly */
    role: string;
  };
  onSave: (
    vendorId: string,
    tier: VendorTier,
    role: VendorRole,
    permissions: Partial<VendorPermissions> & Record<string, unknown>
  ) => void;
}

export const VendorPrivilegeDialog = ({ open, onClose, vendor, onSave }: VendorPrivilegeDialogProps) => {
  const [selectedTier, setSelectedTier] = useState<VendorTier>('basic');
  const [selectedRole, setSelectedRole] = useState<VendorRole>('owner');
  const [customPermissions, setCustomPermissions] = useState<Partial<VendorPermissions>>(() =>
    cloneRolePermissions('owner')
  );

  useEffect(() => {
    if (!open) return;
    const r = normalizePrivilegeRole(vendor.role);
    const t = normalizeTier(vendor.tier);
    setSelectedTier(t);
    setSelectedRole(r);
    setCustomPermissions(cloneRolePermissions(r));
  }, [open, vendor.id, vendor.role, vendor.tier]);

  const tierInfo = VENDOR_TIERS[selectedTier];
  const rolePermissions = ROLE_PERMISSIONS[selectedRole];

  const handleSave = () => {
    onSave(vendor.id, selectedTier, selectedRole, {
      ...customPermissions,
      tier: selectedTier,
      vendorRole: selectedRole,
    });
    onClose();
  };

  const handleRoleChange = (role: VendorRole) => {
    setSelectedRole(role);
    setCustomPermissions(cloneRolePermissions(role));
  };

  const updatePermission = (category: keyof VendorPermissions, permission: string, value: boolean) => {
    setCustomPermissions((prev) => ({
      ...prev,
      [category]: {
        ...(prev[category] || {}),
        [permission]: value,
      },
    }));
  };

  const getTierIcon = (tier: VendorTier) => {
    switch (tier) {
      case 'basic':
        return <Star className="h-4 w-4" />;
      case 'premium':
        return <Crown className="h-4 w-4" />;
      case 'enterprise':
        return <Zap className="h-4 w-4" />;
    }
  };

  const getTierColor = (tier: VendorTier) => {
    switch (tier) {
      case 'basic':
        return 'bg-gray-100 text-gray-800';
      case 'premium':
        return 'bg-blue-100 text-blue-800';
      case 'enterprise':
        return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#B4770E]" />
            Manage Vendor Privileges - {vendor.businessName}
          </DialogTitle>
          <DialogDescription>
            Configure vendor tier, role, and granular permissions
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="tier" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tier">Vendor Tier</TabsTrigger>
            <TabsTrigger value="role">User Role</TabsTrigger>
            <TabsTrigger value="permissions">Custom Permissions</TabsTrigger>
          </TabsList>

          {/* Tier Selection */}
          <TabsContent value="tier" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Select Vendor Tier</CardTitle>
                <CardDescription>
                  Choose the subscription tier that determines features and commission rate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {(Object.keys(VENDOR_TIERS) as VendorTier[]).map((tier) => {
                    const tierData = VENDOR_TIERS[tier];
                    const isSelected = selectedTier === tier;
                    
                    return (
                      <div
                        key={tier}
                        onClick={() => setSelectedTier(tier)}
                        className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-[#B4770E] bg-[#B4770E]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-2 right-2">
                            <div className="bg-[#B4770E] text-white rounded-full p-1">
                              <Check className="h-3 w-3" />
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`p-2 rounded-lg ${getTierColor(tier)}`}>
                            {getTierIcon(tier)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{tierData.name}</h3>
                            <p className="text-xs text-gray-500">{tierData.description}</p>
                          </div>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="font-semibold text-2xl">${tierData.price.monthly}</span>
                            <span className="text-gray-500">/month</span>
                          </div>
                          <p className="text-xs text-gray-500">
                            ${tierData.price.yearly}/year (Save {Math.round((1 - tierData.price.yearly / (tierData.price.monthly * 12)) * 100)}%)
                          </p>
                        </div>

                        <div className="space-y-2 border-t pt-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Commission</span>
                            <span className="font-semibold text-[#B4770E]">{tierData.features.commission}%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Max Products</span>
                            <span className="font-semibold">
                              {tierData.features.maxProducts === 'unlimited' ? '∞' : tierData.features.maxProducts}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Team Members</span>
                            <span className="font-semibold">
                              {tierData.features.maxTeamMembers === 'unlimited' ? '∞' : tierData.features.maxTeamMembers}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t space-y-1">
                          {tierData.features.prioritySupport && (
                            <div className="flex items-center gap-1 text-xs text-green-600">
                              <Check className="h-3 w-3" /> Priority Support
                            </div>
                          )}
                          {tierData.features.advancedAnalytics && (
                            <div className="flex items-center gap-1 text-xs text-green-600">
                              <Check className="h-3 w-3" /> Advanced Analytics
                            </div>
                          )}
                          {tierData.features.apiAccess && (
                            <div className="flex items-center gap-1 text-xs text-green-600">
                              <Check className="h-3 w-3" /> API Access
                            </div>
                          )}
                          {tierData.features.customBranding && (
                            <div className="flex items-center gap-1 text-xs text-green-600">
                              <Check className="h-3 w-3" /> Custom Branding
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Role Selection */}
          <TabsContent value="role" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Select User Role</CardTitle>
                <CardDescription>
                  Choose the role that determines default permissions for this vendor user
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Owner */}
                  <div
                    onClick={() => handleRoleChange('owner')}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedRole === 'owner'
                        ? 'border-[#B4770E] bg-[#B4770E]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">Owner</h3>
                      <Badge variant="default" className="bg-[#B4770E]">Full Access</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Complete control over all vendor operations, settings, and team management
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1 text-green-600">
                        <Check className="h-3 w-3" /> All Product Operations
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <Check className="h-3 w-3" /> Financial Management
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <Check className="h-3 w-3" /> Team Management
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <Check className="h-3 w-3" /> All Analytics & Reports
                      </div>
                    </div>
                  </div>

                  {/* Manager */}
                  <div
                    onClick={() => handleRoleChange('manager')}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedRole === 'manager'
                        ? 'border-[#B4770E] bg-[#B4770E]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">Manager</h3>
                      <Badge variant="secondary">High Access</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Manage day-to-day operations, products, orders, and marketing
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1 text-green-600">
                        <Check className="h-3 w-3" /> Product Management
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <Check className="h-3 w-3" /> Order Management
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <Check className="h-3 w-3" /> Marketing Tools
                      </div>
                      <div className="flex items-center gap-1 text-red-600">
                        <X className="h-3 w-3" /> No Financial Access
                      </div>
                    </div>
                  </div>

                  {/* Staff */}
                  <div
                    onClick={() => handleRoleChange('staff')}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedRole === 'staff'
                        ? 'border-[#B4770E] bg-[#B4770E]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">Staff</h3>
                      <Badge variant="secondary">Limited Access</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Basic product and order management, ideal for support team
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1 text-green-600">
                        <Check className="h-3 w-3" /> Edit Products
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <Check className="h-3 w-3" /> Update Orders
                      </div>
                      <div className="flex items-center gap-1 text-red-600">
                        <X className="h-3 w-3" /> No Delete Permission
                      </div>
                      <div className="flex items-center gap-1 text-red-600">
                        <X className="h-3 w-3" /> No Analytics Access
                      </div>
                    </div>
                  </div>

                  {/* Read-Only */}
                  <div
                    onClick={() => handleRoleChange('readonly')}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedRole === 'readonly'
                        ? 'border-[#B4770E] bg-[#B4770E]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">Read-Only</h3>
                      <Badge variant="outline">View Only</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      View-only access for reporting and monitoring purposes
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1 text-green-600">
                        <Check className="h-3 w-3" /> View Products
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <Check className="h-3 w-3" /> View Orders
                      </div>
                      <div className="flex items-center gap-1 text-red-600">
                        <X className="h-3 w-3" /> No Edit Permission
                      </div>
                      <div className="flex items-center gap-1 text-red-600">
                        <X className="h-3 w-3" /> No Management Access
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Custom Permissions */}
          <TabsContent value="permissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Granular Permissions</CardTitle>
                <CardDescription>
                  Customize individual permissions beyond the default role settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Products */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <Package className="h-4 w-4 text-[#B4770E]" />
                    <h3 className="font-semibold">Product Management</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.keys(rolePermissions.products || {}).map((permission) => (
                      <div key={permission} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <Label className="text-sm capitalize cursor-pointer">
                          {permission.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                        <Switch
                          checked={customPermissions.products?.[permission as keyof typeof customPermissions.products] ?? false}
                          onCheckedChange={(checked) => updatePermission('products', permission, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Orders */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <ShoppingBag className="h-4 w-4 text-[#B4770E]" />
                    <h3 className="font-semibold">Order Management</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.keys(rolePermissions.orders || {}).map((permission) => (
                      <div key={permission} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <Label className="text-sm capitalize cursor-pointer">
                          {permission.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                        <Switch
                          checked={customPermissions.orders?.[permission as keyof typeof customPermissions.orders] ?? false}
                          onCheckedChange={(checked) => updatePermission('orders', permission, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Analytics */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <BarChart3 className="h-4 w-4 text-[#B4770E]" />
                    <h3 className="font-semibold">Analytics & Reports</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.keys(rolePermissions.analytics || {}).map((permission) => (
                      <div key={permission} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <Label className="text-sm capitalize cursor-pointer">
                          {permission.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                        <Switch
                          checked={customPermissions.analytics?.[permission as keyof typeof customPermissions.analytics] ?? false}
                          onCheckedChange={(checked) => updatePermission('analytics', permission, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <DollarSign className="h-4 w-4 text-[#B4770E]" />
                    <h3 className="font-semibold">Financial Access</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.keys(rolePermissions.financial || {}).map((permission) => (
                      <div key={permission} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <Label className="text-sm capitalize cursor-pointer">
                          {permission.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                        <Switch
                          checked={customPermissions.financial?.[permission as keyof typeof customPermissions.financial] ?? false}
                          onCheckedChange={(checked) => updatePermission('financial', permission, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Marketing */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <Tag className="h-4 w-4 text-[#B4770E]" />
                    <h3 className="font-semibold">Marketing & Promotions</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.keys(rolePermissions.marketing || {}).map((permission) => (
                      <div key={permission} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <Label className="text-sm capitalize cursor-pointer">
                          {permission.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                        <Switch
                          checked={customPermissions.marketing?.[permission as keyof typeof customPermissions.marketing] ?? false}
                          onCheckedChange={(checked) => updatePermission('marketing', permission, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Settings */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <Settings className="h-4 w-4 text-[#B4770E]" />
                    <h3 className="font-semibold">Store Settings</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.keys(rolePermissions.settings || {}).map((permission) => (
                      <div key={permission} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <Label className="text-sm capitalize cursor-pointer">
                          {permission.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                        <Switch
                          checked={customPermissions.settings?.[permission as keyof typeof customPermissions.settings] ?? false}
                          onCheckedChange={(checked) => updatePermission('settings', permission, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Badge className={getTierColor(selectedTier)}>
              {VENDOR_TIERS[selectedTier].name} Tier
            </Badge>
            <Badge variant="outline">{selectedRole.toUpperCase()}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-[#B4770E] hover:bg-[#8B5A0B]">
              <Shield className="h-4 w-4 mr-2" />
              Save Privileges
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
