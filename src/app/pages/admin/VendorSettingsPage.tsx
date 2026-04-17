import { useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAdmin } from '../../context/AdminContext';
import { vendorService } from '../../services/vendorService';
import { authService } from '../../services/authService';
import { uploadImage } from '../../services/uploadService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Switch } from '../../components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Store,
  Bell,
  Palette,
  Save,
  Package,
  Truck,
  Star,
  Lock,
  Upload,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { getApiErrorMessage } from '../../lib/apiErrors';
import {
  emptyPreferenceState,
  preferencesFromApi,
  preferencesToApi,
  type VendorPreferenceState,
} from './vendor-settings/preferences';

function setNested<K extends keyof VendorPreferenceState>(
  prev: VendorPreferenceState,
  section: K,
  patch: Partial<VendorPreferenceState[K]>
): VendorPreferenceState {
  return {
    ...prev,
    [section]: { ...prev[section], ...patch },
  };
}

export function VendorSettingsPage() {
  const { user } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [logo, setLogo] = useState('');
  const [prefs, setPrefs] = useState<VendorPreferenceState>(() => emptyPreferenceState());
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [uploadTarget, setUploadTarget] = useState<'logo' | 'banner' | null>(null);

  useEffect(() => {
    if (user?.role !== 'vendor') return;
    (async () => {
      try {
        const v = await vendorService.getMe();
        setName(v.name);
        setEmail(v.email);
        setLogo(v.logo || '');
        setPrefs(preferencesFromApi(v.preferences as Record<string, unknown> | undefined));
      } catch (err: unknown) {
        toast.error(getApiErrorMessage(err, 'Could not load vendor profile'));
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.role]);

  if (user?.role === 'admin') {
    return <Navigate to="/admin/vendors" replace />;
  }

  if (user?.role !== 'vendor') {
    return <Navigate to="/admin/login" replace />;
  }

  const persist = async (msg: string) => {
    setSaving(true);
    try {
      const updated = await vendorService.updateMe({
        name,
        email,
        logo,
        preferences: preferencesToApi(prefs),
      });
      setPrefs(preferencesFromApi(updated.preferences as Record<string, unknown> | undefined));
      toast.success(msg);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Save failed'));
    } finally {
      setSaving(false);
    }
  };

  const onUpload = async (file: File, kind: 'logo' | 'banner') => {
    setUploadTarget(kind);
    try {
      const url = await uploadImage(file);
      if (kind === 'logo') setLogo(url);
      else setPrefs((p) => setNested(p, 'store', { bannerUrl: url }));
      toast.success(kind === 'logo' ? 'Logo uploaded — save to persist' : 'Banner uploaded — save to persist');
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Upload failed'));
    } finally {
      setUploadTarget(null);
    }
  };

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    setSaving(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password updated');
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Could not change password'));
    } finally {
      setSaving(false);
    }
  };

  const carrierEntries = Object.entries(prefs.shipping.carriers);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[40vh] items-center justify-center text-foreground/60">Loading…</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6 max-w-5xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Vendor settings</h1>
          <p className="text-muted-foreground mt-1 text-sm">Store profile, preferences, and security</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="flex h-auto flex-wrap gap-1 justify-start bg-muted/40 p-1">
            <TabsTrigger value="profile" className="gap-1.5 text-xs sm:text-sm">
              <Store className="h-4 w-4 shrink-0" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-1.5 text-xs sm:text-sm">
              <Bell className="h-4 w-4 shrink-0" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="products" className="gap-1.5 text-xs sm:text-sm">
              <Package className="h-4 w-4 shrink-0" />
              Products
            </TabsTrigger>
            <TabsTrigger value="shipping" className="gap-1.5 text-xs sm:text-sm">
              <Truck className="h-4 w-4 shrink-0" />
              Shipping
            </TabsTrigger>
            <TabsTrigger value="display" className="gap-1.5 text-xs sm:text-sm">
              <Palette className="h-4 w-4 shrink-0" />
              Display
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-1.5 text-xs sm:text-sm">
              <Star className="h-4 w-4 shrink-0" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-1.5 text-xs sm:text-sm">
              <Lock className="h-4 w-4 shrink-0" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6 space-y-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="border-border/30 shadow-sm">
                <CardHeader>
                  <CardTitle>Store identity</CardTitle>
                  <CardDescription>Public name, branding, and storefront copy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="vs-name">Store name</Label>
                      <Input id="vs-name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vs-email">Contact email</Label>
                      <Input id="vs-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Logo</Label>
                    <div className="flex flex-wrap items-center gap-3">
                      {logo ? (
                        <img src={logo} alt="" className="h-14 w-14 rounded border object-cover" />
                      ) : null}
                      <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) void onUpload(f, 'logo');
                          e.target.value = '';
                        }}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={uploadTarget === 'logo'}
                        onClick={() => logoInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploadTarget === 'logo' ? 'Uploading…' : 'Upload logo'}
                      </Button>
                      <Input value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="Or paste image URL" className="max-w-md flex-1 min-w-[12rem]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Banner</Label>
                    <div className="flex flex-wrap items-center gap-3">
                      {prefs.store.bannerUrl ? (
                        <img src={prefs.store.bannerUrl} alt="" className="h-16 max-w-xs rounded border object-cover" />
                      ) : null}
                      <input
                        ref={bannerInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) void onUpload(f, 'banner');
                          e.target.value = '';
                        }}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={uploadTarget === 'banner'}
                        onClick={() => bannerInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploadTarget === 'banner' ? 'Uploading…' : 'Upload banner'}
                      </Button>
                      <Input
                        value={prefs.store.bannerUrl}
                        onChange={(e) => setPrefs((p) => setNested(p, 'store', { bannerUrl: e.target.value }))}
                        placeholder="Or paste banner URL"
                        className="max-w-md flex-1 min-w-[12rem]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vs-slug">Store slug</Label>
                    <Input
                      id="vs-slug"
                      value={prefs.store.slug}
                      onChange={(e) => setPrefs((p) => setNested(p, 'store', { slug: e.target.value }))}
                      placeholder="url-friendly-id"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vs-tagline">Tagline</Label>
                    <Input
                      id="vs-tagline"
                      value={prefs.store.tagline}
                      onChange={(e) => setPrefs((p) => setNested(p, 'store', { tagline: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vs-desc">Description</Label>
                    <Textarea
                      id="vs-desc"
                      rows={4}
                      value={prefs.store.description}
                      onChange={(e) => setPrefs((p) => setNested(p, 'store', { description: e.target.value }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <Card className="border-border/30 shadow-sm">
              <CardHeader>
                <CardTitle>Contact & social</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Phone</Label>
                  <Input
                    value={prefs.contact.phone}
                    onChange={(e) => setPrefs((p) => setNested(p, 'contact', { phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Address</Label>
                  <Textarea
                    rows={2}
                    value={prefs.contact.address}
                    onChange={(e) => setPrefs((p) => setNested(p, 'contact', { address: e.target.value }))}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Website</Label>
                  <Input
                    value={prefs.contact.website}
                    onChange={(e) => setPrefs((p) => setNested(p, 'contact', { website: e.target.value }))}
                  />
                </div>
                {(['instagram', 'facebook', 'twitter', 'pinterest'] as const).map((k) => (
                  <div key={k} className="space-y-2">
                    <Label className="capitalize">{k}</Label>
                    <Input
                      value={prefs.social[k]}
                      onChange={(e) =>
                        setPrefs((p) => ({
                          ...p,
                          social: { ...p.social, [k]: e.target.value },
                        }))
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/30 shadow-sm">
              <CardHeader>
                <CardTitle>Business details</CardTitle>
                <CardDescription>Used for compliance and invoicing where applicable</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Legal name</Label>
                  <Input
                    value={prefs.business.legalName}
                    onChange={(e) => setPrefs((p) => setNested(p, 'business', { legalName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tax ID</Label>
                  <Input
                    value={prefs.business.taxId}
                    onChange={(e) => setPrefs((p) => setNested(p, 'business', { taxId: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Business type</Label>
                  <Input
                    value={prefs.business.businessType}
                    onChange={(e) => setPrefs((p) => setNested(p, 'business', { businessType: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Registration number</Label>
                  <Input
                    value={prefs.business.registrationNumber}
                    onChange={(e) => setPrefs((p) => setNested(p, 'business', { registrationNumber: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Button type="button" disabled={saving} onClick={() => void persist('Profile saved')}>
              <Save className="h-4 w-4 mr-2" />
              Save profile
            </Button>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Email and SMS preferences for your dashboard</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {(
                  [
                    ['newOrders', 'New orders'],
                    ['orderUpdates', 'Order updates'],
                    ['lowStock', 'Low stock'],
                    ['customerMessages', 'Customer messages'],
                    ['productReviews', 'Product reviews'],
                    ['paymentReceived', 'Payments received'],
                    ['emailDigest', 'Email digest'],
                    ['smsNotifications', 'SMS notifications'],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between rounded-lg border border-border/30 p-3">
                    <span className="text-sm">{label}</span>
                    <Switch
                      checked={prefs.notifications[key]}
                      onCheckedChange={(c) => setPrefs((p) => setNested(p, 'notifications', { [key]: c }))}
                    />
                  </div>
                ))}
                <div className="space-y-2 pt-2">
                  <Label>Digest time</Label>
                  <Input
                    value={prefs.notifications.digestTime}
                    onChange={(e) => setPrefs((p) => setNested(p, 'notifications', { digestTime: e.target.value }))}
                    placeholder="e.g. 9:00"
                  />
                </div>
              </CardContent>
            </Card>
            <Button type="button" variant="secondary" disabled={saving} onClick={() => void persist('Notifications saved')}>
              <Save className="h-4 w-4 mr-2" />
              Save notifications
            </Button>
          </TabsContent>

          <TabsContent value="products" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product defaults</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Default currency</Label>
                  <Select
                    value={prefs.products.defaultCurrency || 'none'}
                    onValueChange={(v) =>
                      setPrefs((p) => setNested(p, 'products', { defaultCurrency: v === 'none' ? '' : v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">—</SelectItem>
                      <SelectItem value="usd">USD</SelectItem>
                      <SelectItem value="inr">INR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default tax rate (%)</Label>
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={prefs.products.defaultTaxRate}
                    onChange={(e) => setPrefs((p) => setNested(p, 'products', { defaultTaxRate: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Processing time</Label>
                  <Select
                    value={prefs.products.processingTime || 'none'}
                    onValueChange={(v) =>
                      setPrefs((p) => setNested(p, 'products', { processingTime: v === 'none' ? '' : v }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">—</SelectItem>
                      <SelectItem value="same">Same day</SelectItem>
                      <SelectItem value="1">1 business day</SelectItem>
                      <SelectItem value="1-3">1–3 business days</SelectItem>
                      <SelectItem value="3-5">3–5 business days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(
                  [
                    ['autoPublish', 'Auto-publish new listings'],
                    ['lowStockAlerts', 'Low stock alerts'],
                    ['autoHideOutOfStock', 'Hide out-of-stock from storefront'],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between rounded-lg border border-border/30 p-3 sm:col-span-2">
                    <span className="text-sm">{label}</span>
                    <Switch
                      checked={prefs.products[key]}
                      onCheckedChange={(c) => setPrefs((p) => setNested(p, 'products', { [key]: c }))}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Returns</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Return window (days)</Label>
                    <Input
                      value={prefs.returns.returnWindowDays}
                      onChange={(e) => setPrefs((p) => setNested(p, 'returns', { returnWindowDays: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Restocking fee (%)</Label>
                    <Input
                      value={prefs.returns.restockingFee}
                      onChange={(e) => setPrefs((p) => setNested(p, 'returns', { restockingFee: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Return policy (shown to customers)</Label>
                  <Textarea
                    rows={5}
                    value={prefs.returns.returnPolicyText}
                    onChange={(e) => setPrefs((p) => setNested(p, 'returns', { returnPolicyText: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Button type="button" disabled={saving} onClick={() => void persist('Product settings saved')}>
              <Save className="h-4 w-4 mr-2" />
              Save products & returns
            </Button>
          </TabsContent>

          <TabsContent value="shipping" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Ship-from address</Label>
                  <Textarea
                    rows={2}
                    value={prefs.shipping.shipFromAddress}
                    onChange={(e) => setPrefs((p) => setNested(p, 'shipping', { shipFromAddress: e.target.value }))}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Processing time</Label>
                    <Select
                      value={prefs.shipping.processingDays || 'none'}
                      onValueChange={(v) =>
                        setPrefs((p) => setNested(p, 'shipping', { processingDays: v === 'none' ? '' : v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">—</SelectItem>
                        <SelectItem value="same">Same day</SelectItem>
                        <SelectItem value="1">1 business day</SelectItem>
                        <SelectItem value="1-3">1–3 business days</SelectItem>
                        <SelectItem value="3-5">3–5 business days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Package weight unit</Label>
                    <Select
                      value={prefs.shipping.packageUnit || 'none'}
                      onValueChange={(v) =>
                        setPrefs((p) => setNested(p, 'shipping', { packageUnit: v === 'none' ? '' : v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">—</SelectItem>
                        <SelectItem value="lb">Pounds (lb)</SelectItem>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        <SelectItem value="oz">Ounces (oz)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/30 p-3">
                  <div>
                    <p className="text-sm font-medium">Free shipping</p>
                    <p className="text-xs text-muted-foreground">Offer free shipping above a threshold</p>
                  </div>
                  <Switch
                    checked={prefs.shipping.freeShippingEnabled}
                    onCheckedChange={(c) => setPrefs((p) => setNested(p, 'shipping', { freeShippingEnabled: c }))}
                  />
                </div>
                {prefs.shipping.freeShippingEnabled ? (
                  <div className="space-y-2">
                    <Label>Free shipping threshold (USD)</Label>
                    <Input
                      value={prefs.shipping.freeShippingThreshold}
                      onChange={(e) =>
                        setPrefs((p) => setNested(p, 'shipping', { freeShippingThreshold: e.target.value }))
                      }
                    />
                  </div>
                ) : null}
                <div className="flex items-center justify-between rounded-lg border border-border/30 p-3">
                  <span className="text-sm font-medium">International shipping</span>
                  <Switch
                    checked={prefs.shipping.internationalShipping}
                    onCheckedChange={(c) => setPrefs((p) => setNested(p, 'shipping', { internationalShipping: c }))}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/30 p-3">
                  <span className="text-sm font-medium">Expedited shipping</span>
                  <Switch
                    checked={prefs.shipping.expeditedEnabled}
                    onCheckedChange={(c) => setPrefs((p) => setNested(p, 'shipping', { expeditedEnabled: c }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Internal notes</Label>
                  <Textarea
                    rows={2}
                    value={prefs.shipping.notes}
                    onChange={(e) => setPrefs((p) => setNested(p, 'shipping', { notes: e.target.value }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Carriers</CardTitle>
                <CardDescription>Which carriers you use (stored for your records)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {carrierEntries.map(([carrier, enabled]) => (
                  <div key={carrier} className="flex items-center justify-between rounded-lg border border-border/30 p-3">
                    <span className="text-sm font-medium">{carrier}</span>
                    <Switch
                      checked={enabled}
                      onCheckedChange={(c) =>
                        setPrefs((p) =>
                          setNested(p, 'shipping', {
                            carriers: { ...p.shipping.carriers, [carrier]: c },
                          })
                        )
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Button type="button" disabled={saving} onClick={() => void persist('Shipping saved')}>
              <Save className="h-4 w-4 mr-2" />
              Save shipping
            </Button>
          </TabsContent>

          <TabsContent value="display" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Admin display</CardTitle>
                <CardDescription>How your vendor dashboard behaves</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {(
                  [
                    ['compactView', 'Compact view'],
                    ['darkMode', 'Dark mode'],
                    ['showTips', 'Show tips'],
                    ['autoRefresh', 'Auto-refresh data'],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between rounded-lg border border-border/30 p-3">
                    <span className="text-sm">{label}</span>
                    <Switch
                      checked={prefs.display[key]}
                      onCheckedChange={(c) => setPrefs((p) => setNested(p, 'display', { [key]: c }))}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Button type="button" variant="secondary" disabled={saving} onClick={() => void persist('Display saved')}>
              <Save className="h-4 w-4 mr-2" />
              Save display
            </Button>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review collection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(
                  [
                    ['autoApproveReviews', 'Auto-approve reviews'],
                    ['requireVerifiedPurchase', 'Require verified purchase'],
                    ['allowAnonymousReviews', 'Allow anonymous reviews'],
                    ['allowReviewMedia', 'Allow photos/videos'],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between rounded-lg border border-border/30 p-3">
                    <span className="text-sm">{label}</span>
                    <Switch
                      checked={prefs.reviews[key]}
                      onCheckedChange={(c) => setPrefs((p) => setNested(p, 'reviews', { [key]: c }))}
                    />
                  </div>
                ))}
                <div className="grid gap-4 sm:grid-cols-2 pt-2">
                  <div className="space-y-2">
                    <Label>Min rating for auto-approve</Label>
                    <Input
                      value={prefs.reviews.minRatingAutoApprove}
                      onChange={(e) => setPrefs((p) => setNested(p, 'reviews', { minRatingAutoApprove: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Min review length (chars)</Label>
                    <Input
                      value={prefs.reviews.minReviewLength}
                      onChange={(e) => setPrefs((p) => setNested(p, 'reviews', { minReviewLength: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Review window (days)</Label>
                    <Input
                      value={prefs.reviews.reviewWindowDays}
                      onChange={(e) => setPrefs((p) => setNested(p, 'reviews', { reviewWindowDays: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Default sort</Label>
                    <Select
                      value={prefs.reviews.defaultSort || 'none'}
                      onValueChange={(v) =>
                        setPrefs((p) => setNested(p, 'reviews', { defaultSort: v === 'none' ? '' : v }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">—</SelectItem>
                        <SelectItem value="recent">Most recent</SelectItem>
                        <SelectItem value="helpful">Most helpful</SelectItem>
                        <SelectItem value="rating">Highest rating</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Display & follow-up</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(
                  [
                    ['showVerifiedBadge', 'Show verified badge'],
                    ['showHelpfulVotes', 'Show helpful votes'],
                    ['showVendorResponses', 'Show vendor responses'],
                    ['remindToRespond', 'Remind me to respond'],
                    ['autoRequestReviews', 'Auto-request reviews after delivery'],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between rounded-lg border border-border/30 p-3">
                    <span className="text-sm">{label}</span>
                    <Switch
                      checked={prefs.reviews[key]}
                      onCheckedChange={(c) => setPrefs((p) => setNested(p, 'reviews', { [key]: c }))}
                    />
                  </div>
                ))}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Response reminder (hours)</Label>
                    <Input
                      value={prefs.reviews.responseReminderHours}
                      onChange={(e) =>
                        setPrefs((p) => setNested(p, 'reviews', { responseReminderHours: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Review request (days after delivery)</Label>
                    <Input
                      value={prefs.reviews.reviewRequestDays}
                      onChange={(e) => setPrefs((p) => setNested(p, 'reviews', { reviewRequestDays: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality & incentives</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(
                  [
                    ['profanityFilter', 'Auto-filter profanity'],
                    ['customerReporting', 'Allow customer reporting'],
                    ['competitorBlock', 'Flag competitor domains'],
                    ['offerReviewRewards', 'Offer review rewards'],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between rounded-lg border border-border/30 p-3">
                    <span className="text-sm">{label}</span>
                    <Switch
                      checked={prefs.reviews[key]}
                      onCheckedChange={(c) => setPrefs((p) => setNested(p, 'reviews', { [key]: c }))}
                    />
                  </div>
                ))}
                <div className="space-y-2">
                  <Label>Auto-flag threshold (reports)</Label>
                  <Input
                    value={prefs.reviews.flagThreshold}
                    onChange={(e) => setPrefs((p) => setNested(p, 'reviews', { flagThreshold: e.target.value }))}
                  />
                </div>
                {prefs.reviews.offerReviewRewards ? (
                  <div className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p>If you offer incentives, disclose them to comply with applicable guidelines (e.g. FTC).</p>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Button type="button" disabled={saving} onClick={() => void persist('Review settings saved')}>
              <Save className="h-4 w-4 mr-2" />
              Save review settings
            </Button>
          </TabsContent>

          <TabsContent value="security" className="mt-6 max-w-lg space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Change password</CardTitle>
                <CardDescription>Uses your account credentials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pw-cur">Current password</Label>
                  <Input
                    id="pw-cur"
                    type="password"
                    autoComplete="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pw-new">New password</Label>
                  <Input
                    id="pw-new"
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pw-conf">Confirm new password</Label>
                  <Input
                    id="pw-conf"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button type="button" disabled={saving} onClick={() => void changePassword()}>
                  <Lock className="h-4 w-4 mr-2" />
                  Update password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
