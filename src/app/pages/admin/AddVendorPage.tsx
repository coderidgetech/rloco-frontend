import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  ArrowLeft,
  Store,
  Mail,
  Phone,
  Globe,
  MapPin,
  User,
  Shield,
  Star,
  Crown,
  Zap,
  Check,
  X,
  Save,
  Package,
  ShoppingBag,
  DollarSign,
  BarChart3,
  Users,
  Tag,
  Settings,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';
import { VendorTier, VendorRole, VendorPermissions, ROLE_PERMISSIONS, VENDOR_TIERS } from '../../types/vendor-permissions';
import { adminService } from '../../services/adminService';
import { PH } from '../../lib/formPlaceholders';

export const AddVendorPage = () => {
  const navigate = useNavigate();

  // Available subscription plans (in a real app, fetch from API or context)
  const subscriptionPlans = [
    {
      id: 1,
      name: 'Starter',
      description: 'Perfect for new vendors',
      monthlyPrice: 19,
      yearlyPrice: 190,
      commission: 20,
      maxProducts: 50,
      maxTeamMembers: 2,
      maxOrders: 300,
      active: true,
      isDefault: false,
      color: '#10B981',
    },
    {
      id: 2,
      name: 'Basic',
      description: 'Essential features',
      monthlyPrice: 29,
      yearlyPrice: 290,
      commission: 15,
      maxProducts: 100,
      maxTeamMembers: 3,
      maxOrders: 500,
      active: true,
      isDefault: true,
      color: '#6B7280',
    },
    {
      id: 3,
      name: 'Professional',
      description: 'For growing businesses',
      monthlyPrice: 59,
      yearlyPrice: 590,
      commission: 12,
      maxProducts: 500,
      maxTeamMembers: 7,
      maxOrders: 1500,
      active: true,
      isDefault: false,
      color: '#3B82F6',
    },
    {
      id: 4,
      name: 'Premium',
      description: 'Advanced features',
      monthlyPrice: 79,
      yearlyPrice: 790,
      commission: 10,
      maxProducts: 1000,
      maxTeamMembers: 10,
      maxOrders: 2000,
      active: true,
      isDefault: false,
      color: '#8B5CF6',
    },
    {
      id: 5,
      name: 'Enterprise',
      description: 'Unlimited access',
      monthlyPrice: 199,
      yearlyPrice: 1990,
      commission: 5,
      maxProducts: 'unlimited',
      maxTeamMembers: 'unlimited',
      maxOrders: 'unlimited',
      active: true,
      isDefault: false,
      color: '#A855F7',
    },
    {
      id: 6,
      name: 'Custom VIP',
      description: 'Tailored for high-volume',
      monthlyPrice: 149,
      yearlyPrice: 1490,
      commission: 7,
      maxProducts: 2000,
      maxTeamMembers: 15,
      maxOrders: 5000,
      active: true,
      isDefault: false,
      color: '#F59E0B',
    },
  ];
  
  // Basic Information
  const [vendorName, setVendorName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [description, setDescription] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [taxId, setTaxId] = useState('');
  
  // Banking Information
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  
  // Privilege Settings
  const [selectedPlanId, setSelectedPlanId] = useState<number>(
    subscriptionPlans.find((p) => p.isDefault)?.id || subscriptionPlans[0]?.id || 1
  );
  const [selectedRole, setSelectedRole] = useState<VendorRole>('owner');
  const [customPermissions, setCustomPermissions] = useState<Partial<VendorPermissions>>(
    ROLE_PERMISSIONS.owner
  );

  const selectedPlan = subscriptionPlans.find((p) => p.id === selectedPlanId);
  const rolePermissions = ROLE_PERMISSIONS[selectedRole];

  const handleRoleChange = (role: VendorRole) => {
    setSelectedRole(role);
    setCustomPermissions(ROLE_PERMISSIONS[role]);
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



  const handleSubmit = async () => {
    // Validation
    if (!vendorName || !storeName || !email || !phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      // Create vendor data - map to API format
      const vendorData = {
        name: vendorName,
        email: email,
        phone: phone,
        role: 'vendor' as const,
        // Store additional vendor-specific data in metadata or separate fields
        // Note: Backend may need to be extended to support all these fields
        metadata: {
          storeName,
          website,
          address,
          city,
          state,
          zipCode,
          country,
          description,
          contactPerson,
          taxId,
          bankName,
          accountNumber,
          routingNumber,
          accountHolderName,
          subscriptionPlan: selectedPlan,
          subscriptionPlanId: selectedPlanId,
          vendorRole: selectedRole,
          permissions: customPermissions,
        },
      };

      await adminService.createVendor(vendorData);
      toast.success('Vendor created successfully!');
      navigate('/admin/vendors');
    } catch (error: any) {
      console.error('Failed to create vendor:', error);
      toast.error(error.message || 'Failed to create vendor');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/vendors')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vendors
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Add New Vendor</h1>
              <p className="text-gray-600 mt-1">
                Create a new vendor account with complete details and privilege settings
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => navigate('/admin/vendors')}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-[#B4770E] hover:bg-[#8B5A0B]">
              <Save className="h-4 w-4 mr-2" />
              Create Vendor
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-[#B4770E]" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Primary vendor details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendorName">
                      Vendor Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="vendorName"
                      placeholder={PH.legalBusinessName}
                      value={vendorName}
                      onChange={(e) => setVendorName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeName">
                      Store Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="storeName"
                      placeholder={PH.storeDisplayName}
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={PH.email}
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        placeholder={PH.phone}
                        className="pl-10"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="website"
                        placeholder={PH.websiteUrl}
                        className="pl-10"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="contactPerson"
                        placeholder={PH.fullName}
                        className="pl-10"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder={PH.vendorBio}
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#B4770E]" />
                  Address Information
                </CardTitle>
                <CardDescription>Business location and mailing address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    placeholder={PH.streetAddress}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder={PH.city}
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State / Province</Label>
                    <Input
                      id="state"
                      placeholder={PH.state}
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP / Postal Code</Label>
                    <Input
                      id="zipCode"
                      placeholder={PH.zip}
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder={PH.country}
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Banking Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[#B4770E]" />
                  Banking Information
                </CardTitle>
                <CardDescription>Payment and payout details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                  <Input
                    id="taxId"
                    placeholder={PH.taxId}
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      placeholder={PH.bankName}
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountHolderName">Account Holder Name</Label>
                    <Input
                      id="accountHolderName"
                      placeholder={PH.accountHolderName}
                      value={accountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      type="password"
                      placeholder={PH.passwordMasked}
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="routingNumber">Routing Number</Label>
                    <Input
                      id="routingNumber"
                      placeholder={PH.accountNumber}
                      value={routingNumber}
                      onChange={(e) => setRoutingNumber(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privilege Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#B4770E]" />
                  Privilege & Permission Settings
                </CardTitle>
                <CardDescription>
                  Configure vendor tier, role, and granular permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="plan" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="plan">Subscription Plan</TabsTrigger>
                    <TabsTrigger value="role">User Role</TabsTrigger>
                    <TabsTrigger value="permissions">Permissions</TabsTrigger>
                  </TabsList>

                  {/* Plan Selection */}
                  <TabsContent value="plan" className="space-y-4">
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto">
                      {subscriptionPlans
                        .filter((plan) => plan.active)
                        .map((plan) => {
                          const isSelected = selectedPlanId === plan.id;

                          return (
                            <div
                              key={plan.id}
                              onClick={() => setSelectedPlanId(plan.id)}
                              className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
                                isSelected
                                  ? 'border-[#B4770E] bg-[#B4770E]/5'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              {/* Selection indicator */}
                              {isSelected && (
                                <div className="absolute top-2 right-2">
                                  <div className="bg-[#B4770E] text-white rounded-full p-1">
                                    <Check className="h-3 w-3" />
                                  </div>
                                </div>
                              )}

                              {/* Default badge */}
                              {plan.isDefault && !isSelected && (
                                <div className="absolute top-2 right-2">
                                  <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">
                                    Default
                                  </span>
                                </div>
                              )}

                              {/* Plan header */}
                              <div className="mb-3">
                                <h3
                                  className="font-semibold text-lg"
                                  style={{ color: plan.color }}
                                >
                                  {plan.name}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">{plan.description}</p>
                              </div>

                              {/* Pricing */}
                              <div className="space-y-1 mb-3 pb-3 border-b">
                                <div className="flex items-baseline gap-1">
                                  <span className="font-semibold text-2xl text-[#B4770E]">
                                    ${plan.monthlyPrice}
                                  </span>
                                  <span className="text-sm text-gray-500">/month</span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                  <span className="text-sm text-gray-600">
                                    ${plan.yearlyPrice}
                                  </span>
                                  <span className="text-xs text-gray-500">/year</span>
                                </div>
                                {plan.monthlyPrice > 0 && (
                                  <p className="text-xs text-green-600">
                                    Save ${Math.round(plan.monthlyPrice * 12 - plan.yearlyPrice)}{' '}
                                    annually
                                  </p>
                                )}
                              </div>

                              {/* Limits */}
                              <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">Commission</span>
                                  <span className="font-semibold text-[#B4770E]">
                                    {plan.commission}%
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">Max Products</span>
                                  <span className="font-semibold">
                                    {plan.maxProducts === 'unlimited' ? '∞' : plan.maxProducts}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">Team Members</span>
                                  <span className="font-semibold">
                                    {plan.maxTeamMembers === 'unlimited'
                                      ? '∞'
                                      : plan.maxTeamMembers}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-600">Max Orders/Mo</span>
                                  <span className="font-semibold">
                                    {plan.maxOrders === 'unlimited' ? '∞' : plan.maxOrders}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {subscriptionPlans.filter((p) => p.active).length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>No active subscription plans available.</p>
                        <p className="text-sm mt-2">
                          Please configure plans in Site Configuration → Subscriptions
                        </p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Role Selection */}
                  <TabsContent value="role" className="space-y-4">
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
                          <Badge variant="default" className="bg-[#B4770E]">
                            Full Access
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Complete control over all vendor operations and settings
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
                          Manage operations, products, and marketing
                        </p>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1 text-green-600">
                            <Check className="h-3 w-3" /> Product Management
                          </div>
                          <div className="flex items-center gap-1 text-green-600">
                            <Check className="h-3 w-3" /> Order Management
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
                          Basic product and order management
                        </p>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1 text-green-600">
                            <Check className="h-3 w-3" /> Edit Products
                          </div>
                          <div className="flex items-center gap-1 text-green-600">
                            <Check className="h-3 w-3" /> Update Orders
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
                          View-only access for reporting
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
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  {/* Custom Permissions */}
                  <TabsContent value="permissions" className="space-y-4 max-h-[600px] overflow-y-auto">
                    {/* Products */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b">
                        <Package className="h-4 w-4 text-[#B4770E]" />
                        <h3 className="font-semibold">Product Management</h3>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {Object.keys(rolePermissions.products || {}).map((permission) => (
                          <div
                            key={permission}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <Label className="text-sm capitalize cursor-pointer">
                              {permission.replace(/([A-Z])/g, ' $1').trim()}
                            </Label>
                            <Switch
                              checked={
                                customPermissions.products?.[
                                  permission as keyof typeof customPermissions.products
                                ] ?? false
                              }
                              onCheckedChange={(checked) =>
                                updatePermission('products', permission, checked)
                              }
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
                          <div
                            key={permission}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <Label className="text-sm capitalize cursor-pointer">
                              {permission.replace(/([A-Z])/g, ' $1').trim()}
                            </Label>
                            <Switch
                              checked={
                                customPermissions.orders?.[
                                  permission as keyof typeof customPermissions.orders
                                ] ?? false
                              }
                              onCheckedChange={(checked) =>
                                updatePermission('orders', permission, checked)
                              }
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
                          <div
                            key={permission}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <Label className="text-sm capitalize cursor-pointer">
                              {permission.replace(/([A-Z])/g, ' $1').trim()}
                            </Label>
                            <Switch
                              checked={
                                customPermissions.analytics?.[
                                  permission as keyof typeof customPermissions.analytics
                                ] ?? false
                              }
                              onCheckedChange={(checked) =>
                                updatePermission('analytics', permission, checked)
                              }
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
                          <div
                            key={permission}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <Label className="text-sm capitalize cursor-pointer">
                              {permission.replace(/([A-Z])/g, ' $1').trim()}
                            </Label>
                            <Switch
                              checked={
                                customPermissions.financial?.[
                                  permission as keyof typeof customPermissions.financial
                                ] ?? false
                              }
                              onCheckedChange={(checked) =>
                                updatePermission('financial', permission, checked)
                              }
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
                          <div
                            key={permission}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <Label className="text-sm capitalize cursor-pointer">
                              {permission.replace(/([A-Z])/g, ' $1').trim()}
                            </Label>
                            <Switch
                              checked={
                                customPermissions.marketing?.[
                                  permission as keyof typeof customPermissions.marketing
                                ] ?? false
                              }
                              onCheckedChange={(checked) =>
                                updatePermission('marketing', permission, checked)
                              }
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
                          <div
                            key={permission}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded"
                          >
                            <Label className="text-sm capitalize cursor-pointer">
                              {permission.replace(/([A-Z])/g, ' $1').trim()}
                            </Label>
                            <Switch
                              checked={
                                customPermissions.settings?.[
                                  permission as keyof typeof customPermissions.settings
                                ] ?? false
                              }
                              onCheckedChange={(checked) =>
                                updatePermission('settings', permission, checked)
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Vendor Summary</CardTitle>
                <CardDescription>Review before creating</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Selected Plan */}
                {selectedPlan && (
                  <div>
                    <p className="text-sm font-semibold mb-2">Subscription Plan</p>
                    <div
                      className="text-base px-3 py-2 rounded-lg border-2"
                      style={{
                        borderColor: selectedPlan.color,
                        backgroundColor: `${selectedPlan.color}15`,
                      }}
                    >
                      <p
                        className="font-semibold"
                        style={{ color: selectedPlan.color }}
                      >
                        {selectedPlan.name}
                      </p>
                      <p className="text-sm text-gray-600">${selectedPlan.monthlyPrice}/month</p>
                    </div>
                    <div className="mt-2 space-y-1 text-sm">
                      <p className="text-gray-600">
                        Commission:{' '}
                        <span className="font-semibold">{selectedPlan.commission}%</span>
                      </p>
                      <p className="text-gray-600">
                        Max Products:{' '}
                        <span className="font-semibold">
                          {selectedPlan.maxProducts === 'unlimited'
                            ? 'Unlimited'
                            : selectedPlan.maxProducts}
                        </span>
                      </p>
                      <p className="text-gray-600">
                        Team Members:{' '}
                        <span className="font-semibold">
                          {selectedPlan.maxTeamMembers === 'unlimited'
                            ? 'Unlimited'
                            : selectedPlan.maxTeamMembers}
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Selected Role */}
                <div className="pt-4 border-t">
                  <p className="text-sm font-semibold mb-2">User Role</p>
                  <Badge variant="outline" className="text-base px-3 py-1">
                    {selectedRole.toUpperCase()}
                  </Badge>
                </div>

                {/* Basic Info Summary */}
                {(vendorName || storeName || email) && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-semibold mb-2">Basic Information</p>
                    <div className="space-y-1 text-sm">
                      {vendorName && (
                        <p className="text-gray-600">
                          <span className="font-medium">Vendor:</span> {vendorName}
                        </p>
                      )}
                      {storeName && (
                        <p className="text-gray-600">
                          <span className="font-medium">Store:</span> {storeName}
                        </p>
                      )}
                      {email && (
                        <p className="text-gray-600">
                          <span className="font-medium">Email:</span> {email}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Required Fields Notice */}
                <div className="pt-4 border-t">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-xs text-yellow-800">
                      <span className="font-semibold">Required fields:</span> Vendor Name, Store
                      Name, Email, Phone
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
