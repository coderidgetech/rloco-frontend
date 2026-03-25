import { useState, useEffect } from 'react';
import { PH } from '../../lib/formPlaceholders';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Settings,
  Store,
  CreditCard,
  Truck,
  Bell,
  Shield,
  Palette,
  Save,
} from 'lucide-react';
import { toast } from 'sonner';
import { adminService } from '../../services/adminService';
import api from '../../lib/api';

export const AdminSettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [changingPassword, setChangingPassword] = useState(false);
  const [settings, setSettings] = useState<any>({
    general: {
      storeName: 'Rloco',
      storeUrl: 'https://rloco.com',
      storeDescription: 'Modern fashion retailer offering curated collections',
      contactEmail: 'contact@rloco.com',
      supportEmail: 'support@rloco.com',
      phone: '+1 (555) 123-4567',
      timezone: 'america/new_york',
    },
    regional: {
      currency: 'usd',
      language: 'en',
      dateFormat: 'mm/dd/yyyy',
      unitSystem: 'imperial',
    },
    store: {
      guestCheckout: true,
      wishlist: true,
      productReviews: true,
      inventoryTracking: true,
      newsletterSignup: true,
      minimumOrderAmount: 0,
      freeShippingThreshold: 100,
      requirePhoneNumber: false,
    },
    payment: {
      creditCards: true,
      paypal: true,
      stripe: true,
    },
    notifications: {
      orderConfirmation: true,
      orderShipped: true,
      orderDelivered: true,
      lowStockAlerts: true,
      newCustomerWelcome: true,
    },
    appearance: {
      primaryColor: '#000000',
      accentColor: '#666666',
    },
    security: {
      twoFactorAuth: false,
      sslOnly: true,
      cookieConsent: true,
      sessionTimeout: 30,
    },
  });

  // Fetch settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await adminService.getSettings();
        if (data) {
          setSettings(data);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (section: string) => {
    try {
      setSaving(true);
      await adminService.updateSettings(settings);
      toast.success(`${section} settings saved successfully`);
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.current || !passwordForm.newPass || !passwordForm.confirm) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPass.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    try {
      setChangingPassword(true);
      await api.put('/auth/password', {
        current_password: passwordForm.current,
        new_password: passwordForm.newPass,
      });
      toast.success('Password updated successfully');
      setPasswordForm({ current: '', newPass: '', confirm: '' });
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to update password');
    } finally {
      setChangingPassword(false);
    }
  };

  const updateSetting = (path: string[], value: any) => {
    setSettings((prev: any) => {
      const newSettings = { ...prev };
      let current = newSettings;
      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = { ...current[path[i]] };
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newSettings;
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600 mt-1">
            Configure your store settings and preferences
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading settings...</p>
          </div>
        ) : (
          <>
            {/* Settings Tabs */}
            <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="store">Store</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>
                  Basic store configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Store Name</Label>
                    <Input
                      value={settings?.general?.storeName || ''}
                      onChange={(e) => updateSetting(['general', 'storeName'], e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Store URL</Label>
                    <Input
                      value={settings?.general?.storeUrl || ''}
                      onChange={(e) => updateSetting(['general', 'storeUrl'], e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Store Description</Label>
                  <Textarea
                    value={settings?.general?.storeDescription || ''}
                    onChange={(e) => updateSetting(['general', 'storeDescription'], e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Contact Email</Label>
                    <Input
                      type="email"
                      value={settings?.general?.contactEmail || ''}
                      onChange={(e) => updateSetting(['general', 'contactEmail'], e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Support Email</Label>
                    <Input
                      type="email"
                      value={settings?.general?.supportEmail || ''}
                      onChange={(e) => updateSetting(['general', 'supportEmail'], e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      value={settings?.general?.phone || ''}
                      onChange={(e) => updateSetting(['general', 'phone'], e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Time Zone</Label>
                    <Select
                      value={settings?.general?.timezone || 'america/new_york'}
                      onValueChange={(value) => updateSetting(['general', 'timezone'], value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="america/new_york">Eastern Time (ET)</SelectItem>
                        <SelectItem value="america/chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="america/denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="america/los_angeles">Pacific Time (PT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={() => handleSave('General')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Settings</CardTitle>
                <CardDescription>
                  Currency and language preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select
                      value={settings?.regional?.currency || 'usd'}
                      onValueChange={(value) => updateSetting(['regional', 'currency'], value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                        <SelectItem value="inr">INR (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select
                      value={settings?.regional?.language || 'en'}
                      onValueChange={(value) => updateSetting(['regional', 'language'], value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select
                      value={settings?.regional?.dateFormat || 'mm/dd/yyyy'}
                      onValueChange={(value) => updateSetting(['regional', 'dateFormat'], value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Unit System</Label>
                    <Select
                      value={settings?.regional?.unitSystem || 'imperial'}
                      onValueChange={(value) => updateSetting(['regional', 'unitSystem'], value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="imperial">Imperial</SelectItem>
                        <SelectItem value="metric">Metric</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={() => handleSave('Regional')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Store Settings */}
          <TabsContent value="store" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Features</CardTitle>
                <CardDescription>
                  Enable or disable store features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Guest Checkout</Label>
                    <p className="text-sm text-gray-500">Allow customers to checkout without an account</p>
                  </div>
                  <Switch
                    checked={settings?.store?.guestCheckout !== false}
                    onCheckedChange={(checked) => updateSetting(['store', 'guestCheckout'], checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Wishlist</Label>
                    <p className="text-sm text-gray-500">Enable wishlist functionality</p>
                  </div>
                  <Switch
                    checked={settings?.store?.wishlist !== false}
                    onCheckedChange={(checked) => updateSetting(['store', 'wishlist'], checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Product Reviews</Label>
                    <p className="text-sm text-gray-500">Allow customers to leave reviews</p>
                  </div>
                  <Switch
                    checked={settings?.store?.productReviews !== false}
                    onCheckedChange={(checked) => updateSetting(['store', 'productReviews'], checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Inventory Tracking</Label>
                    <p className="text-sm text-gray-500">Track product stock levels</p>
                  </div>
                  <Switch
                    checked={settings?.store?.inventoryTracking !== false}
                    onCheckedChange={(checked) => updateSetting(['store', 'inventoryTracking'], checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Newsletter Signup</Label>
                    <p className="text-sm text-gray-500">Show newsletter subscription form</p>
                  </div>
                  <Switch
                    checked={settings?.store?.newsletterSignup !== false}
                    onCheckedChange={(checked) => updateSetting(['store', 'newsletterSignup'], checked)}
                  />
                </div>
                <Button onClick={() => handleSave('Store Features')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Checkout Settings</CardTitle>
                <CardDescription>
                  Configure checkout process
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Minimum Order Amount</Label>
                  <Input
                    type="number"
                    value={settings?.store?.minimumOrderAmount || 0}
                    onChange={(e) => updateSetting(['store', 'minimumOrderAmount'], parseFloat(e.target.value) || 0)}
                    placeholder={PH.priceZero}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Free Shipping Threshold</Label>
                  <Input
                    type="number"
                    value={settings?.store?.freeShippingThreshold || 100}
                    onChange={(e) => updateSetting(['store', 'freeShippingThreshold'], parseFloat(e.target.value) || 100)}
                    placeholder={PH.percentExample}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Require Phone Number</Label>
                    <p className="text-sm text-gray-500">Make phone number mandatory at checkout</p>
                  </div>
                  <Switch
                    checked={settings?.store?.requirePhoneNumber === true}
                    onCheckedChange={(checked) => updateSetting(['store', 'requirePhoneNumber'], checked)}
                  />
                </div>
                <Button onClick={() => handleSave('Checkout')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>
                  Configure accepted payment methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Credit/Debit Cards</p>
                      <p className="text-sm text-gray-500">Visa, Mastercard, Amex</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings?.payment?.creditCards ?? true}
                    onCheckedChange={(v) => updateSetting(['payment', 'creditCards'], v)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-purple-600">PP</span>
                    </div>
                    <div>
                      <p className="font-medium">PayPal</p>
                      <p className="text-sm text-gray-500">PayPal checkout</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings?.payment?.paypal ?? true}
                    onCheckedChange={(v) => updateSetting(['payment', 'paypal'], v)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="font-bold text-green-600">S</span>
                    </div>
                    <div>
                      <p className="font-medium">Stripe</p>
                      <p className="text-sm text-gray-500">Stripe payment processing</p>
                    </div>
                  </div>
                  <Switch
                    checked={settings?.payment?.stripe ?? true}
                    onCheckedChange={(v) => updateSetting(['payment', 'stripe'], v)}
                  />
                </div>
                <Button onClick={() => handleSave('Payment Methods')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Gateway Configuration</CardTitle>
                <CardDescription>
                  API keys and credentials (encrypted and stored server-side)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Stripe Publishable Key</Label>
                  <Input
                    type="password"
                    placeholder={PH.stripePublishableKey}
                    value={settings?.payment?.stripePublishableKey || ''}
                    onChange={(e) => updateSetting(['payment', 'stripePublishableKey'], e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Stripe Secret Key</Label>
                  <Input
                    type="password"
                    placeholder={PH.stripeSecretKey}
                    value={settings?.payment?.stripeSecretKey || ''}
                    onChange={(e) => updateSetting(['payment', 'stripeSecretKey'], e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>PayPal Client ID</Label>
                  <Input
                    type="password"
                    placeholder={PH.ellipsis}
                    value={settings?.payment?.paypalClientId || ''}
                    onChange={(e) => updateSetting(['payment', 'paypalClientId'], e.target.value)}
                  />
                </div>
                <Button onClick={() => handleSave('Payment Gateway')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Settings */}
          <TabsContent value="shipping" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Zones</CardTitle>
                <CardDescription>
                  Configure shipping zones and rates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium">Domestic Shipping (US)</p>
                      <p className="text-sm text-gray-500">Standard, Express, Overnight</p>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Standard (5-7 days)</span>
                      <span className="font-medium">$5.99</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Express (2-3 days)</span>
                      <span className="font-medium">$12.99</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overnight</span>
                      <span className="font-medium">$24.99</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-medium">International Shipping</p>
                      <p className="text-sm text-gray-500">Worldwide delivery</p>
                    </div>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Standard (10-15 days)</span>
                      <span className="font-medium">$19.99</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Express (5-7 days)</span>
                      <span className="font-medium">$39.99</span>
                    </div>
                  </div>
                </div>
                <Button>
                  <Truck className="h-4 w-4 mr-2" />
                  Add Shipping Zone
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Carriers</CardTitle>
                <CardDescription>
                  Connect shipping carrier accounts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">USPS</p>
                    <p className="text-sm text-gray-500">United States Postal Service</p>
                  </div>
                  <Switch
                    checked={settings?.shipping?.usps ?? false}
                    onCheckedChange={(v) => updateSetting(['shipping', 'usps'], v)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">FedEx</p>
                    <p className="text-sm text-gray-500">FedEx shipping services</p>
                  </div>
                  <Switch
                    checked={settings?.shipping?.fedex ?? false}
                    onCheckedChange={(v) => updateSetting(['shipping', 'fedex'], v)}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">UPS</p>
                    <p className="text-sm text-gray-500">United Parcel Service</p>
                  </div>
                  <Switch
                    checked={settings?.shipping?.ups ?? false}
                    onCheckedChange={(v) => updateSetting(['shipping', 'ups'], v)}
                  />
                </div>
                <Button onClick={() => handleSave('Shipping Carriers')} disabled={saving} className="mt-2">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>
                  Configure automated email notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Order Confirmation</Label>
                    <p className="text-sm text-gray-500">Send when order is placed</p>
                  </div>
                  <Switch
                    checked={settings?.notifications?.orderConfirmation ?? true}
                    onCheckedChange={(v) => updateSetting(['notifications', 'orderConfirmation'], v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Order Shipped</Label>
                    <p className="text-sm text-gray-500">Send when order ships</p>
                  </div>
                  <Switch
                    checked={settings?.notifications?.orderShipped ?? true}
                    onCheckedChange={(v) => updateSetting(['notifications', 'orderShipped'], v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Order Delivered</Label>
                    <p className="text-sm text-gray-500">Send when order is delivered</p>
                  </div>
                  <Switch
                    checked={settings?.notifications?.orderDelivered ?? true}
                    onCheckedChange={(v) => updateSetting(['notifications', 'orderDelivered'], v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Low Stock Alerts</Label>
                    <p className="text-sm text-gray-500">Notify when inventory is low</p>
                  </div>
                  <Switch
                    checked={settings?.notifications?.lowStockAlerts ?? true}
                    onCheckedChange={(v) => updateSetting(['notifications', 'lowStockAlerts'], v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Customer Welcome</Label>
                    <p className="text-sm text-gray-500">Send welcome email to new customers</p>
                  </div>
                  <Switch
                    checked={settings?.notifications?.newCustomerWelcome ?? true}
                    onCheckedChange={(v) => updateSetting(['notifications', 'newCustomerWelcome'], v)}
                  />
                </div>
                <Button onClick={() => handleSave('Notifications')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme Settings</CardTitle>
                <CardDescription>
                  Customize the look and feel of your store
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={settings?.appearance?.primaryColor || '#000000'}
                        onChange={(e) => updateSetting(['appearance', 'primaryColor'], e.target.value)}
                        className="w-16"
                      />
                      <Input
                        value={settings?.appearance?.primaryColor || '#000000'}
                        onChange={(e) => updateSetting(['appearance', 'primaryColor'], e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Accent Color</Label>
                    <div className="flex gap-2">
                      <Input
                        type="color"
                        value={settings?.appearance?.accentColor || '#666666'}
                        onChange={(e) => updateSetting(['appearance', 'accentColor'], e.target.value)}
                        className="w-16"
                      />
                      <Input
                        value={settings?.appearance?.accentColor || '#666666'}
                        onChange={(e) => updateSetting(['appearance', 'accentColor'], e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Logo</Label>
                  <Input type="file" />
                </div>
                <div className="space-y-2">
                  <Label>Favicon</Label>
                  <Input type="file" />
                </div>
                <Button onClick={() => handleSave('Appearance')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Preferences</CardTitle>
                <CardDescription>
                  Manage security and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Require 2FA for admin login</p>
                  </div>
                  <Switch
                    checked={settings?.security?.twoFactorAuth ?? false}
                    onCheckedChange={(v) => updateSetting(['security', 'twoFactorAuth'], v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SSL/HTTPS Only</Label>
                    <p className="text-sm text-gray-500">Force secure connections</p>
                  </div>
                  <Switch
                    checked={settings?.security?.sslOnly ?? true}
                    onCheckedChange={(v) => updateSetting(['security', 'sslOnly'], v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cookie Consent Banner</Label>
                    <p className="text-sm text-gray-500">Show cookie consent notice</p>
                  </div>
                  <Switch
                    checked={settings?.security?.cookieConsent ?? true}
                    onCheckedChange={(v) => updateSetting(['security', 'cookieConsent'], v)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    value={settings?.security?.sessionTimeout ?? 30}
                    onChange={(e) => updateSetting(['security', 'sessionTimeout'], parseInt(e.target.value) || 30)}
                  />
                </div>
                <Button onClick={() => handleSave('Security')} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Update your admin password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input
                    type="password"
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input
                    type="password"
                    value={passwordForm.newPass}
                    onChange={(e) => setPasswordForm((p) => ({ ...p, newPass: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input
                    type="password"
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))}
                  />
                </div>
                <Button onClick={handleChangePassword} disabled={changingPassword}>
                  {changingPassword ? 'Updating...' : 'Update Password'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </AdminLayout>
  );
};
