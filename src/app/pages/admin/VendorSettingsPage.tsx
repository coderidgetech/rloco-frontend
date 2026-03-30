import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { useAdmin } from '../../context/AdminContext';
import { vendorService, VendorProfile } from '../../services/vendorService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Switch } from '../../components/ui/switch';
import { Store, Bell, Palette, Save } from 'lucide-react';
import { toast } from 'sonner';

const defaultNotif = {
  newOrders: true,
  orderUpdates: true,
  lowStock: true,
  emailDigest: false,
};

export function VendorSettingsPage() {
  const { user } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [logo, setLogo] = useState('');
  const [notifications, setNotifications] = useState(defaultNotif);
  const [display, setDisplay] = useState({ compactView: false, showTips: true });

  useEffect(() => {
    if (user?.role !== 'vendor') return;
    (async () => {
      try {
        const v = await vendorService.getMe();
        setVendor(v);
        setName(v.name);
        setEmail(v.email);
        setLogo(v.logo || '');
        const prefs = v.preferences || {};
        const n = prefs.notifications as typeof defaultNotif | undefined;
        if (n && typeof n === 'object') {
          setNotifications({ ...defaultNotif, ...n });
        }
        const d = prefs.display as typeof display | undefined;
        if (d && typeof d === 'object') {
          setDisplay({ ...display, ...d });
        }
      } catch {
        toast.error('Could not load vendor profile');
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

  const saveProfile = async () => {
    try {
      const updated = await vendorService.updateMe({ name, email, logo });
      setVendor(updated);
      toast.success('Profile saved');
    } catch {
      toast.error('Save failed');
    }
  };

  const savePreferences = async () => {
    try {
      const updated = await vendorService.updateMe({
        preferences: {
          ...(vendor?.preferences || {}),
          notifications,
          display,
        },
      });
      setVendor(updated);
      toast.success('Preferences saved');
    } catch {
      toast.error('Save failed');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex min-h-[40vh] items-center justify-center text-foreground/60">Loading…</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Vendor settings</h1>
          <p className="text-muted-foreground mt-1 text-sm">Store profile and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="profile" className="gap-2">
              <Store className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="display" className="gap-2">
              <Palette className="h-4 w-4" />
              Display
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6 max-w-xl space-y-4">
            <div>
              <Label htmlFor="vs-name">Store name</Label>
              <Input id="vs-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="vs-email">Contact email</Label>
              <Input id="vs-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="vs-logo">Logo URL</Label>
              <Input id="vs-logo" value={logo} onChange={(e) => setLogo(e.target.value)} className="mt-1" placeholder="https://…" />
            </div>
            <Button type="button" onClick={saveProfile}>
              <Save className="h-4 w-4 mr-2" />
              Save profile
            </Button>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6 max-w-xl space-y-4">
            {Object.entries(notifications).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between rounded-lg border border-border p-3">
                <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                <Switch
                  checked={!!val}
                  onCheckedChange={(checked) => setNotifications((n) => ({ ...n, [key]: checked }))}
                />
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={savePreferences}>
              Save notification preferences
            </Button>
          </TabsContent>

          <TabsContent value="display" className="mt-6 max-w-xl space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <span className="text-sm">Compact view</span>
              <Switch
                checked={display.compactView}
                onCheckedChange={(checked) => setDisplay((d) => ({ ...d, compactView: checked }))}
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <span className="text-sm">Show tips</span>
              <Switch
                checked={display.showTips}
                onCheckedChange={(checked) => setDisplay((d) => ({ ...d, showTips: checked }))}
              />
            </div>
            <Button type="button" variant="secondary" onClick={savePreferences}>
              Save display preferences
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
