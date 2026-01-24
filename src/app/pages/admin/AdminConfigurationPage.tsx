import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';
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
  Palette,
  Home,
  Menu,
  Mail,
  Search,
  BarChart,
  Tag,
  Save,
  Eye,
  Upload,
  Plus,
  Trash2,
  Edit,
  Copy,
  Code,
  Globe,
  Smartphone,
  ShoppingBag,
  Star,
  Gift,
  TrendingUp,
  Zap,
  Award,
  Percent,
  Clock,
  Download,
  RotateCcw,
  CreditCard,
  Crown,
  DollarSign,
  X,
  List,
  Grid3x3,
} from 'lucide-react';
import { toast } from 'sonner';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { adminService } from '../../services/adminService';

export const AdminConfigurationPage = () => {
  const { config, updateConfig, updateNestedConfig, resetConfig, exportConfig, importConfig } = useSiteConfig();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [configuration, setConfiguration] = useState<any>(config || {});

  // Fetch configuration from API (only on mount)
  useEffect(() => {
    const fetchConfiguration = async () => {
      try {
        setLoading(true);
        const data = await adminService.getConfiguration();
        if (data) {
          // Backend returns the config map directly: {general: {...}, categories: {...}, ...}
          setConfiguration(data);
          // Also update context if needed (only once, not in dependency)
          if (updateConfig) {
            updateConfig(data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch configuration:', error);
        toast.error('Failed to load configuration');
        // Use context config as fallback
        if (config) {
          setConfiguration(config);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConfiguration();
  }, []); // Only run once on mount

  // Listen for config update events (separate effect)
  useEffect(() => {
    const handleConfigUpdate = async () => {
      try {
        const data = await adminService.getConfiguration();
        if (data) {
          setConfiguration(data);
          if (updateConfig) {
            updateConfig(data);
          }
        }
      } catch (error) {
        console.error('Failed to refetch configuration:', error);
      }
    };

    window.addEventListener('rloco_config_updated', handleConfigUpdate);
    window.addEventListener('storage', (e) => {
      if (e.key === 'rloco_config_updated') {
        handleConfigUpdate();
      }
    });

    return () => {
      window.removeEventListener('rloco_config_updated', handleConfigUpdate);
    };
  }, []); // Only set up listeners once

  const handleSave = async (section?: string) => {
    try {
      setSaving(true);
      // Use config from context (which is what the user is actually editing)
      // Convert config to the format expected by API (plain object)
      const configToSave = JSON.parse(JSON.stringify(config));
      // Send the configuration map directly: {general: {...}, categories: {...}, ...}
      await adminService.updateConfiguration(configToSave);
      
      // Wait a moment for the database to update, then refetch
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Refetch the configuration from the API to get the actual saved data
      try {
        const savedData = await adminService.getConfiguration();
        if (savedData) {
          console.log('Refetched config:', savedData);
          setConfiguration(savedData);
          // Also update context - updateConfig expects (section, data), so we need to update each section
          // Instead, we'll trigger a full refresh via the event system
          // The context will refetch from API when it receives the event
        } else {
          console.warn('No data returned from refetch');
        }
      } catch (fetchError) {
        console.error('Failed to refetch configuration:', fetchError);
        // The event system will trigger a refresh in SiteConfigContext
      }
      
      // Trigger a refresh in all open tabs/windows
      localStorage.setItem('rloco_config_updated', Date.now().toString());
      // Dispatch custom event for same-tab refresh
      window.dispatchEvent(new CustomEvent('rloco_config_updated'));
      // Also trigger storage event for cross-tab sync
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'rloco_config_updated',
        newValue: Date.now().toString(),
      }));
      toast.success(section ? `${section} configuration saved successfully` : 'Configuration saved successfully');
    } catch (error: any) {
      console.error('Failed to save configuration:', error);
      toast.error(error?.response?.data?.error || error?.message || 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };
  
  const [emailTemplates, setEmailTemplates] = useState([
    { id: 1, name: 'Order Confirmation', subject: 'Your Order #{order_number}', active: true },
    { id: 2, name: 'Shipping Notification', subject: 'Your Order has Shipped', active: true },
    { id: 3, name: 'Delivery Confirmation', subject: 'Your Order has been Delivered', active: true },
    { id: 4, name: 'Welcome Email', subject: 'Welcome to Rloco', active: true },
  ]);

  const [badges, setBadges] = useState([
    { id: 1, name: 'New Arrival', color: config.design.colors.primary, icon: 'Zap', active: true },
    { id: 2, name: 'Best Seller', color: '#FF6B6B', icon: 'TrendingUp', active: true },
    { id: 3, name: 'Limited Edition', color: '#9B59B6', icon: 'Award', active: true },
    { id: 4, name: 'Sale', color: '#E74C3C', icon: 'Percent', active: true },
  ]);

  const [subscriptionPlans, setSubscriptionPlans] = useState([
    {
      id: 1,
      configName: 'PLAN_STARTER',
      name: 'Starter',
      description: 'Perfect for new vendors just getting started',
      monthlyPrice: 19,
      yearlyPrice: 190,
      commission: 20,
      maxProducts: 50,
      maxTeamMembers: 2,
      maxOrders: 300,
      features: {
        basicDashboard: true,
        productManagement: true,
        orderManagement: true,
        emailSupport: true,
        basicAnalytics: false,
        prioritySupport: false,
        advancedAnalytics: false,
        apiAccess: false,
        whiteLabelBranding: false,
        customReports: false,
      },
      active: true,
      isDefault: false,
      icon: 'Star',
      color: '#10B981',
    },
    {
      id: 2,
      configName: 'PLAN_BASIC',
      name: 'Basic',
      description: 'Essential features for growing businesses',
      monthlyPrice: 29,
      yearlyPrice: 290,
      commission: 15,
      maxProducts: 100,
      maxTeamMembers: 3,
      maxOrders: 500,
      features: {
        basicDashboard: true,
        productManagement: true,
        orderManagement: true,
        emailSupport: true,
        basicAnalytics: true,
        prioritySupport: false,
        advancedAnalytics: false,
        apiAccess: false,
        whiteLabelBranding: false,
        customReports: false,
      },
      active: true,
      isDefault: true,
      icon: 'Star',
      color: '#6B7280',
    },
    {
      id: 3,
      configName: 'PLAN_PROFESSIONAL',
      name: 'Professional',
      description: 'For established vendors scaling their business',
      monthlyPrice: 59,
      yearlyPrice: 590,
      commission: 12,
      maxProducts: 500,
      maxTeamMembers: 7,
      maxOrders: 1500,
      features: {
        basicDashboard: true,
        productManagement: true,
        orderManagement: true,
        emailSupport: true,
        basicAnalytics: true,
        prioritySupport: true,
        advancedAnalytics: true,
        apiAccess: false,
        whiteLabelBranding: false,
        customReports: true,
      },
      active: true,
      isDefault: false,
      icon: 'TrendingUp',
      color: '#3B82F6',
    },
    {
      id: 4,
      configName: 'PLAN_PREMIUM',
      name: 'Premium',
      description: 'Advanced features and priority support',
      monthlyPrice: 79,
      yearlyPrice: 790,
      commission: 10,
      maxProducts: 1000,
      maxTeamMembers: 10,
      maxOrders: 2000,
      features: {
        basicDashboard: true,
        productManagement: true,
        orderManagement: true,
        emailSupport: true,
        basicAnalytics: true,
        prioritySupport: true,
        advancedAnalytics: true,
        apiAccess: true,
        whiteLabelBranding: false,
        customReports: true,
      },
      active: true,
      isDefault: false,
      icon: 'Crown',
      color: '#8B5CF6',
    },
    {
      id: 5,
      configName: 'PLAN_ENTERPRISE',
      name: 'Enterprise',
      description: 'Unlimited access with dedicated support',
      monthlyPrice: 199,
      yearlyPrice: 1990,
      commission: 5,
      maxProducts: 'unlimited',
      maxTeamMembers: 'unlimited',
      maxOrders: 'unlimited',
      features: {
        basicDashboard: true,
        productManagement: true,
        orderManagement: true,
        emailSupport: true,
        basicAnalytics: true,
        prioritySupport: true,
        advancedAnalytics: true,
        apiAccess: true,
        whiteLabelBranding: true,
        customReports: true,
      },
      active: true,
      isDefault: false,
      icon: 'Zap',
      color: '#A855F7',
    },
    {
      id: 6,
      configName: 'PLAN_CUSTOM_VIP',
      name: 'Custom VIP',
      description: 'Tailored plan for high-volume vendors',
      monthlyPrice: 149,
      yearlyPrice: 1490,
      commission: 7,
      maxProducts: 2000,
      maxTeamMembers: 15,
      maxOrders: 5000,
      features: {
        basicDashboard: true,
        productManagement: true,
        orderManagement: true,
        emailSupport: true,
        basicAnalytics: true,
        prioritySupport: true,
        advancedAnalytics: true,
        apiAccess: true,
        whiteLabelBranding: true,
        customReports: true,
      },
      active: true,
      isDefault: false,
      icon: 'Award',
      color: '#F59E0B',
    },
  ]);

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Load subscription plans from localStorage on mount
  useEffect(() => {
    const savedPlans = localStorage.getItem('subscriptionPlans');
    if (savedPlans) {
      try {
        const plans = JSON.parse(savedPlans);
        setSubscriptionPlans(plans);
      } catch (error) {
        console.error('Failed to load subscription plans:', error);
      }
    }
  }, []);

  // Save subscription plans to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('subscriptionPlans', JSON.stringify(subscriptionPlans));
  }, [subscriptionPlans]);

  const handleAddPlan = () => {
    navigate('/admin/subscription-plans/builder');
  };

  const handleEditPlan = (plan: any) => {
    navigate(`/admin/subscription-plans/builder?id=${plan.id}`);
  };

  const handleClonePlan = (plan: any) => {
    navigate(`/admin/subscription-plans/builder?id=${plan.id}&clone=true`);
  };

  const handleDeletePlan = (planId: number) => {
    if (confirm('Are you sure you want to delete this subscription plan?')) {
      setSubscriptionPlans(subscriptionPlans.filter((p) => p.id !== planId));
      toast.success('Subscription plan deleted');
    }
  };

  const handleSetDefaultPlan = (planId: number) => {
    setSubscriptionPlans(
      subscriptionPlans.map((p) => ({
        ...p,
        isDefault: p.id === planId,
      }))
    );
    toast.success('Default plan updated');
  };

  const handleTogglePlanActive = (planId: number) => {
    setSubscriptionPlans(
      subscriptionPlans.map((p) =>
        p.id === planId ? { ...p, active: !p.active } : p
      )
    );
  };

  const handlePreview = () => {
    toast.info('Opening preview in new tab...');
    window.open('/', '_blank');
  };

  const handleExportConfig = () => {
    const configJson = exportConfig();
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rloco-config.json';
    a.click();
    toast.success('Configuration exported successfully');
  };

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        importConfig(content);
        toast.success('Configuration imported successfully');
      } catch (error) {
        toast.error('Failed to import configuration');
      }
    };
    reader.readAsText(file);
  };

  const handleResetConfig = async () => {
    if (confirm('Are you sure you want to reset all configuration to defaults? This cannot be undone.')) {
      try {
        setSaving(true);
        
        // Reset to defaults in context first (this updates local state and localStorage)
        resetConfig();
        
        // Get the current config from context (which resetConfig just set to defaults)
        // Since React state updates are async, we'll use the config value after a small delay
        // or we can read from localStorage which resetConfig updates immediately
        let defaultConfigToSave;
        try {
          // Try to get from localStorage first (resetConfig saves there immediately)
          const savedConfig = localStorage.getItem('rloco_site_config');
          if (savedConfig) {
            defaultConfigToSave = JSON.parse(savedConfig);
          } else {
            // Fallback: use current config from context
            defaultConfigToSave = JSON.parse(JSON.stringify(config));
          }
        } catch {
          // If that fails, use current config
          defaultConfigToSave = JSON.parse(JSON.stringify(config));
        }
        
        // Save default config to API
        await adminService.updateConfiguration(defaultConfigToSave);
        
        // Wait a moment for the database to update, then refetch
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Refetch the configuration from the API
        try {
          const savedData = await adminService.getConfiguration();
          if (savedData) {
            setConfiguration(savedData);
            // Update context with the saved data
            if (updateConfig) {
              Object.keys(savedData).forEach((section) => {
                updateConfig(section as any, savedData[section]);
              });
            }
          }
        } catch (fetchError) {
          console.error('Failed to refetch configuration:', fetchError);
        }
        
        // Trigger a refresh in all open tabs/windows
        localStorage.setItem('rloco_config_updated', Date.now().toString());
        window.dispatchEvent(new CustomEvent('rloco_config_updated'));
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'rloco_config_updated',
          newValue: Date.now().toString(),
        }));
        
        toast.success('Configuration reset to defaults and saved to API');
      } catch (error: any) {
        console.error('Failed to reset configuration:', error);
        toast.error(error?.response?.data?.error || error?.message || 'Failed to reset configuration');
        // Still reset local config even if API call fails
        resetConfig();
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Site Configuration</h1>
            <p className="text-gray-600 mt-1">
              Complete control over all website settings and features
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleExportConfig} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" asChild>
              <label className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Import
                <input
                  type="file"
                  accept="application/json"
                  onChange={handleImportConfig}
                  className="hidden"
                />
              </label>
            </Button>
            <Button onClick={handleResetConfig} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handlePreview} variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview Changes
            </Button>
          </div>
        </div>

        {/* Configuration Tabs */}
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-9 h-auto">
            <TabsTrigger value="general" className="flex flex-col gap-1 py-3">
              <Settings className="h-4 w-4" />
              <span className="text-xs">General</span>
            </TabsTrigger>
            <TabsTrigger value="design" className="flex flex-col gap-1 py-3">
              <Palette className="h-4 w-4" />
              <span className="text-xs">Design</span>
            </TabsTrigger>
            <TabsTrigger value="homepage" className="flex flex-col gap-1 py-3">
              <Home className="h-4 w-4" />
              <span className="text-xs">Homepage</span>
            </TabsTrigger>
            <TabsTrigger value="navigation" className="flex flex-col gap-1 py-3">
              <Menu className="h-4 w-4" />
              <span className="text-xs">Navigation</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex flex-col gap-1 py-3">
              <Mail className="h-4 w-4" />
              <span className="text-xs">Email</span>
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex flex-col gap-1 py-3">
              <Search className="h-4 w-4" />
              <span className="text-xs">SEO</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex flex-col gap-1 py-3">
              <BarChart className="h-4 w-4" />
              <span className="text-xs">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex flex-col gap-1 py-3">
              <Tag className="h-4 w-4" />
              <span className="text-xs">Badges</span>
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="flex flex-col gap-1 py-3">
              <Crown className="h-4 w-4" />
              <span className="text-xs">Subscriptions</span>
            </TabsTrigger>
          </TabsList>

          {/* ==================== GENERAL CONFIGURATION ==================== */}
          <TabsContent value="general" className="space-y-6 mt-6">
            {/* Site Identity */}
            <Card>
              <CardHeader>
                <CardTitle>Site Identity</CardTitle>
                <CardDescription>
                  Core website information and branding
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Site Name</Label>
                    <Input 
                      value={config.general.siteName}
                      onChange={(e) => updateConfig('general', { siteName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tagline</Label>
                    <Input 
                      value={config.general.tagline}
                      onChange={(e) => updateConfig('general', { tagline: e.target.value })}
                      placeholder="Your brand tagline" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Site Description</Label>
                  <Textarea
                    value={config.general.description}
                    onChange={(e) => updateConfig('general', { description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Logo Upload</Label>
                    <div className="flex gap-2">
                      <Input type="file" accept="image/*" />
                      <Button variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">Recommended: SVG, PNG (transparent background)</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Favicon</Label>
                    <div className="flex gap-2">
                      <Input type="file" accept="image/*" />
                      <Button variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">32x32 or 64x64 ICO, PNG</p>
                  </div>
                </div>
                <Button onClick={() => handleSave('Site Identity')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Displayed in footer and contact pages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input 
                      type="email" 
                      value={config.general.email}
                      onChange={(e) => updateConfig('general', { email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input 
                      value={config.general.phone}
                      onChange={(e) => updateConfig('general', { phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Support Email</Label>
                    <Input 
                      type="email" 
                      value={config.general.supportEmail}
                      onChange={(e) => updateConfig('general', { supportEmail: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea
                    value={config.general.address}
                    onChange={(e) => updateConfig('general', { address: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Instagram</Label>
                    <Input 
                      placeholder="@rloco" 
                      value={config.general.socialMedia.instagram}
                      onChange={(e) => updateConfig('general', { socialMedia: { ...config.general.socialMedia, instagram: e.target.value } })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Facebook</Label>
                    <Input 
                      placeholder="facebook.com/rloco" 
                      value={config.general.socialMedia.facebook}
                      onChange={(e) => updateConfig('general', { socialMedia: { ...config.general.socialMedia, facebook: e.target.value } })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Twitter</Label>
                    <Input 
                      placeholder="@rloco" 
                      value={config.general.socialMedia.twitter}
                      onChange={(e) => updateConfig('general', { socialMedia: { ...config.general.socialMedia, twitter: e.target.value } })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pinterest</Label>
                    <Input 
                      placeholder="pinterest.com/rloco" 
                      value={config.general.socialMedia.pinterest}
                      onChange={(e) => updateConfig('general', { socialMedia: { ...config.general.socialMedia, pinterest: e.target.value } })}
                    />
                  </div>
                </div>
                <Button onClick={() => handleSave('Contact Information')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Regional Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Regional & Localization</CardTitle>
                <CardDescription>
                  Currency, language, and regional preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Default Currency</Label>
                    <Select 
                      value={config.general.currency}
                      onValueChange={(value) => updateConfig('general', { currency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                        <SelectItem value="inr">INR (₹)</SelectItem>
                        <SelectItem value="jpy">JPY (¥)</SelectItem>
                        <SelectItem value="cad">CAD (C$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select 
                      value={config.general.timezone}
                      onValueChange={(value) => updateConfig('general', { timezone: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="america/new_york">Eastern Time (ET)</SelectItem>
                        <SelectItem value="america/chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="america/denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="america/los_angeles">Pacific Time (PT)</SelectItem>
                        <SelectItem value="europe/london">London (GMT)</SelectItem>
                        <SelectItem value="europe/paris">Paris (CET)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Date Format</Label>
                    <Select 
                      value={config.general.dateFormat}
                      onValueChange={(value) => updateConfig('general', { dateFormat: value })}
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
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Multi-Currency Support</Label>
                    <p className="text-sm text-gray-500">Allow customers to switch currencies</p>
                  </div>
                  <Switch 
                    checked={config.general.multiCurrency}
                    onCheckedChange={(checked) => updateConfig('general', { multiCurrency: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Auto-detect Location</Label>
                    <p className="text-sm text-gray-500">Automatically detect customer location and set currency</p>
                  </div>
                  <Switch 
                    checked={config.general.autoDetectLocation}
                    onCheckedChange={(checked) => updateConfig('general', { autoDetectLocation: checked })}
                  />
                </div>
                <Button onClick={() => handleSave('Regional Settings')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Maintenance Mode */}
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Mode</CardTitle>
                <CardDescription>
                  Temporarily disable site for maintenance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-red-50">
                  <div className="space-y-0.5">
                    <Label>Enable Maintenance Mode</Label>
                    <p className="text-sm text-gray-500">Show "coming soon" page to visitors</p>
                  </div>
                  <Switch 
                    checked={config.general.maintenanceMode}
                    onCheckedChange={(checked) => updateConfig('general', { maintenanceMode: checked })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Maintenance Message</Label>
                  <Textarea
                    value={config.general.maintenanceMessage}
                    onChange={(e) => updateConfig('general', { maintenanceMessage: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Allowed IP Addresses (Admin Access)</Label>
                  <Input placeholder="192.168.1.1, 10.0.0.1" />
                  <p className="text-xs text-gray-500">Comma-separated list of IPs that can access the site</p>
                </div>
                <Button onClick={() => handleSave('Maintenance Mode')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== DESIGN SYSTEM CONFIGURATION ==================== */}
          <TabsContent value="design" className="space-y-6 mt-6">
            {/* Color Palette */}
            <Card>
              <CardHeader>
                <CardTitle>Brand Color Palette</CardTitle>
                <CardDescription>
                  Define your brand colors following the 60:30:10 color ratio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Primary Brand Color */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-semibold">Primary Brand Color (10%)</Label>
                      <p className="text-sm text-gray-500 mt-1">Accent color for CTA buttons, links, highlights</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Main</Label>
                      <div className="flex gap-2 items-center">
                        <Input 
                          type="color" 
                          value={config.design.colors.primary}
                          onChange={(e) => updateNestedConfig('design', 'colors', { primary: e.target.value })}
                          className="w-16 h-10" 
                        />
                        <Input 
                          value={config.design.colors.primary}
                          onChange={(e) => updateNestedConfig('design', 'colors', { primary: e.target.value })}
                          className="font-mono" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Light Variant</Label>
                      <div className="flex gap-2 items-center">
                        <Input 
                          type="color" 
                          value={config.design.colors.primaryLight}
                          onChange={(e) => updateNestedConfig('design', 'colors', { primaryLight: e.target.value })}
                          className="w-16 h-10" 
                        />
                        <Input 
                          value={config.design.colors.primaryLight}
                          onChange={(e) => updateNestedConfig('design', 'colors', { primaryLight: e.target.value })}
                          className="font-mono" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Dark Variant</Label>
                      <div className="flex gap-2 items-center">
                        <Input 
                          type="color" 
                          value={config.design.colors.primaryDark}
                          onChange={(e) => updateNestedConfig('design', 'colors', { primaryDark: e.target.value })}
                          className="w-16 h-10" 
                        />
                        <Input 
                          value={config.design.colors.primaryDark}
                          onChange={(e) => updateNestedConfig('design', 'colors', { primaryDark: e.target.value })}
                          className="font-mono" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <div className="h-10 rounded border" style={{ backgroundColor: config.design.colors.primary }} />
                    </div>
                  </div>
                </div>

                {/* Secondary Color */}
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <Label className="text-base font-semibold">Secondary Color (30%)</Label>
                    <p className="text-sm text-gray-500 mt-1">Headers, navigation, secondary elements</p>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Main</Label>
                      <div className="flex gap-2 items-center">
                        <Input 
                          type="color" 
                          value={config.design.colors.secondary}
                          onChange={(e) => updateNestedConfig('design', 'colors', { secondary: e.target.value })}
                          className="w-16 h-10" 
                        />
                        <Input 
                          value={config.design.colors.secondary}
                          onChange={(e) => updateNestedConfig('design', 'colors', { secondary: e.target.value })}
                          className="font-mono" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Gray</Label>
                      <div className="flex gap-2 items-center">
                        <Input 
                          type="color" 
                          value={config.design.colors.secondaryGray}
                          onChange={(e) => updateNestedConfig('design', 'colors', { secondaryGray: e.target.value })}
                          className="w-16 h-10" 
                        />
                        <Input 
                          value={config.design.colors.secondaryGray}
                          onChange={(e) => updateNestedConfig('design', 'colors', { secondaryGray: e.target.value })}
                          className="font-mono" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Light Gray</Label>
                      <div className="flex gap-2 items-center">
                        <Input 
                          type="color" 
                          value={config.design.colors.secondaryLightGray}
                          onChange={(e) => updateNestedConfig('design', 'colors', { secondaryLightGray: e.target.value })}
                          className="w-16 h-10" 
                        />
                        <Input 
                          value={config.design.colors.secondaryLightGray}
                          onChange={(e) => updateNestedConfig('design', 'colors', { secondaryLightGray: e.target.value })}
                          className="font-mono" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <div className="h-10 rounded border" style={{ backgroundColor: config.design.colors.secondary }} />
                    </div>
                  </div>
                </div>

                {/* Dominant Color */}
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <Label className="text-base font-semibold">Dominant Color (60%)</Label>
                    <p className="text-sm text-gray-500 mt-1">Background, main content areas</p>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>White</Label>
                      <div className="flex gap-2 items-center">
                        <Input 
                          type="color" 
                          value={config.design.colors.dominant}
                          onChange={(e) => updateNestedConfig('design', 'colors', { dominant: e.target.value })}
                          className="w-16 h-10" 
                        />
                        <Input 
                          value={config.design.colors.dominant}
                          onChange={(e) => updateNestedConfig('design', 'colors', { dominant: e.target.value })}
                          className="font-mono" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Off-White</Label>
                      <div className="flex gap-2 items-center">
                        <Input 
                          type="color" 
                          value={config.design.colors.dominantOffWhite}
                          onChange={(e) => updateNestedConfig('design', 'colors', { dominantOffWhite: e.target.value })}
                          className="w-16 h-10" 
                        />
                        <Input 
                          value={config.design.colors.dominantOffWhite}
                          onChange={(e) => updateNestedConfig('design', 'colors', { dominantOffWhite: e.target.value })}
                          className="font-mono" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Light</Label>
                      <div className="flex gap-2 items-center">
                        <Input 
                          type="color" 
                          value={config.design.colors.dominantLight}
                          onChange={(e) => updateNestedConfig('design', 'colors', { dominantLight: e.target.value })}
                          className="w-16 h-10" 
                        />
                        <Input 
                          value={config.design.colors.dominantLight}
                          onChange={(e) => updateNestedConfig('design', 'colors', { dominantLight: e.target.value })}
                          className="font-mono" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <div className="h-10 rounded border" style={{ backgroundColor: config.design.colors.dominant, border: '1px solid #ddd' }} />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave('Color Palette')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Color Palette
                </Button>
              </CardContent>
            </Card>

            {/* Typography */}
            <Card>
              <CardHeader>
                <CardTitle>Typography</CardTitle>
                <CardDescription>
                  Font families and text styling
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Heading Font</Label>
                    <Select 
                      value={config.design.typography.headingFont}
                      onValueChange={(value) => updateNestedConfig('design', 'typography', { headingFont: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                        <SelectItem value="Lora">Lora</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Body Font</Label>
                    <Select 
                      value={config.design.typography.bodyFont}
                      onValueChange={(value) => updateNestedConfig('design', 'typography', { bodyFont: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Lato">Lato</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Custom Font URL (Google Fonts)</Label>
                  <Input placeholder="https://fonts.googleapis.com/css2?family=..." />
                  <p className="text-xs text-gray-500">Paste Google Fonts embed URL</p>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <Label>Base Font Size</Label>
                    <Select 
                      value={config.design.typography.baseFontSize}
                      onValueChange={(value) => updateNestedConfig('design', 'typography', { baseFontSize: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="14">14px</SelectItem>
                        <SelectItem value="16">16px</SelectItem>
                        <SelectItem value="18">18px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Line Height</Label>
                    <Select 
                      value={config.design.typography.lineHeight}
                      onValueChange={(value) => updateNestedConfig('design', 'typography', { lineHeight: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1.3">1.3</SelectItem>
                        <SelectItem value="1.5">1.5</SelectItem>
                        <SelectItem value="1.7">1.7</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Letter Spacing</Label>
                    <Select 
                      value={config.design.typography.letterSpacing}
                      onValueChange={(value) => updateNestedConfig('design', 'typography', { letterSpacing: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tight">Tight</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="wide">Wide</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={() => handleSave('Typography')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Typography
                </Button>
              </CardContent>
            </Card>

            {/* Spacing & Layout */}
            <Card>
              <CardHeader>
                <CardTitle>Spacing & Layout</CardTitle>
                <CardDescription>
                  Control spacing, borders, and layout properties
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Border Radius</Label>
                    <Select 
                      value={config.design.layout.borderRadius}
                      onValueChange={(value) => updateNestedConfig('design', 'layout', { borderRadius: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Sharp (0px)</SelectItem>
                        <SelectItem value="2">Subtle (2px)</SelectItem>
                        <SelectItem value="4">Soft (4px)</SelectItem>
                        <SelectItem value="8">Rounded (8px)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Container Width</Label>
                    <Select 
                      value={config.design.layout.containerWidth}
                      onValueChange={(value) => updateNestedConfig('design', 'layout', { containerWidth: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1280">1280px</SelectItem>
                        <SelectItem value="1440">1440px</SelectItem>
                        <SelectItem value="1920">1920px</SelectItem>
                        <SelectItem value="full">Full Width</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Section Spacing</Label>
                    <Select 
                      value={config.design.layout.sectionSpacing}
                      onValueChange={(value) => updateNestedConfig('design', 'layout', { sectionSpacing: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={() => handleSave('Spacing & Layout')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Layout
                </Button>
              </CardContent>
            </Card>

            {/* Animation Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Animation & Effects</CardTitle>
                <CardDescription>
                  Control website animations and transitions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Enable Animations</Label>
                    <p className="text-sm text-gray-500">Turn on/off all animations site-wide</p>
                  </div>
                  <Switch 
                    checked={config.design.animations.enabled}
                    onCheckedChange={(checked) => updateNestedConfig('design', 'animations', { enabled: checked })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Animation Speed</Label>
                    <Select 
                      value={config.design.animations.speed}
                      onValueChange={(value) => updateNestedConfig('design', 'animations', { speed: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slow">Slow (800ms)</SelectItem>
                        <SelectItem value="normal">Normal (500ms)</SelectItem>
                        <SelectItem value="fast">Fast (300ms)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Hover Effects</Label>
                    <Select 
                      value={config.design.animations.hoverEffects}
                      onValueChange={(value) => updateNestedConfig('design', 'animations', { hoverEffects: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="subtle">Subtle</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="dramatic">Dramatic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={() => handleSave('Animations')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Animation Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== HOMEPAGE CONFIGURATION ==================== */}
          <TabsContent value="homepage" className="space-y-6 mt-6">
            {/* Hero Section */}
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>
                  Configure the main hero banner on homepage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                  <div className="space-y-0.5">
                    <Label>Show Hero Section</Label>
                    <p className="text-sm text-gray-500">Display hero banner on homepage</p>
                  </div>
                  <Switch 
                    checked={config.homepage.hero.enabled}
                    onCheckedChange={(checked) => updateNestedConfig('homepage', 'hero', { enabled: checked })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hero Heading</Label>
                  <Input 
                    value={config.homepage.hero.heading}
                    onChange={(e) => updateNestedConfig('homepage', 'hero', { heading: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hero Subheading</Label>
                  <Textarea
                    value={config.homepage.hero.subheading}
                    onChange={(e) => updateNestedConfig('homepage', 'hero', { subheading: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Primary Button Text</Label>
                    <Input 
                      value={config.homepage.hero.primaryButtonText}
                      onChange={(e) => updateNestedConfig('homepage', 'hero', { primaryButtonText: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Primary Button Link</Label>
                    <Input 
                      value={config.homepage.hero.primaryButtonLink}
                      onChange={(e) => updateNestedConfig('homepage', 'hero', { primaryButtonLink: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Background Image</Label>
                  <Input 
                    type="text" 
                    value={config.homepage.hero.backgroundImage || ''}
                    onChange={(e) => updateNestedConfig('homepage', 'hero', { backgroundImage: e.target.value })}
                    placeholder="Image URL"
                  />
                  <p className="text-xs text-gray-500">Enter image URL or upload file (Recommended: 1920x800px, under 500KB)</p>
                </div>
                <div className="space-y-2">
                  <Label>Hero Style</Label>
                  <Select 
                    value={config.homepage.hero.style}
                    onValueChange={(value) => updateNestedConfig('homepage', 'hero', { style: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fullscreen">Full Screen</SelectItem>
                      <SelectItem value="large">Large (800px)</SelectItem>
                      <SelectItem value="medium">Medium (600px)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => handleSave('Hero Section')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Hero Section
                </Button>
              </CardContent>
            </Card>

            {/* Homepage Sections Toggle */}
            <Card>
              <CardHeader>
                <CardTitle>Homepage Sections</CardTitle>
                <CardDescription>
                  Enable/disable and reorder homepage sections
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { key: 'featuredProducts', name: 'Featured Products' },
                    { key: 'newArrivals', name: 'New Arrivals' },
                    { key: 'shopByCategory', name: 'Shop by Category' },
                    { key: 'bestSellers', name: 'Best Sellers' },
                    { key: 'editorialFeatures', name: 'Editorial Features' },
                    { key: 'promotionalBanner', name: 'Promotional Banner' },
                    { key: 'testimonials', name: 'Testimonials' },
                    { key: 'brandStory', name: 'Brand Story' },
                    { key: 'instagramFeed', name: 'Instagram Feed' },
                    { key: 'newsletterSignup', name: 'Newsletter Signup' },
                  ].map((section) => (
                    <div key={section.key} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="cursor-move">
                          <Menu className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <Label className="cursor-pointer">{section.name}</Label>
                          <p className="text-xs text-gray-500">Drag to reorder</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Switch 
                          checked={config.homepage.sections[section.key as keyof typeof config.homepage.sections] || false}
                          onCheckedChange={(checked) => updateNestedConfig('homepage', 'sections', { [section.key]: checked })}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <Button onClick={() => handleSave('Homepage Sections')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Section Order
                </Button>
              </CardContent>
            </Card>

            {/* Featured Collections */}
            <Card>
              <CardHeader>
                <CardTitle>Featured Collections</CardTitle>
                <CardDescription>
                  Select collections to feature on homepage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Featured Collections</Label>
                  <p className="text-xs text-gray-500 mb-2">Select up to 6 collections to feature on homepage</p>
                  <div className="space-y-3">
                    {[0, 1, 2, 3, 4, 5].map((index) => {
                      const collectionValue = Array.isArray(config.homepage.featuredCollections) 
                        ? config.homepage.featuredCollections[index] || ''
                        : '';
                      return (
                        <div key={index} className="flex items-center gap-3">
                          <Label className="w-32 text-sm">Collection {index + 1}</Label>
                          <Select 
                            value={collectionValue}
                            onValueChange={(value) => {
                              const current = Array.isArray(config.homepage.featuredCollections) 
                                ? [...config.homepage.featuredCollections] 
                                : [];
                              current[index] = value;
                              // Remove empty values and ensure array length
                              const updated = current.filter(v => v).slice(0, 6);
                              updateConfig('homepage', { featuredCollections: updated });
                            }}
                          >
                            <SelectTrigger className="flex-1">
                              <SelectValue placeholder="Select collection" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New Arrivals</SelectItem>
                              <SelectItem value="women">Women's Fashion</SelectItem>
                              <SelectItem value="men">Men's Fashion</SelectItem>
                              <SelectItem value="accessories">Accessories</SelectItem>
                            </SelectContent>
                          </Select>
                          {index > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const current = Array.isArray(config.homepage.featuredCollections) 
                                  ? [...config.homepage.featuredCollections] 
                                  : [];
                                current.splice(index, 1);
                                updateConfig('homepage', { featuredCollections: current });
                              }}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <Button onClick={() => handleSave('Featured Collections')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Collections
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== NAVIGATION CONFIGURATION ==================== */}
          <TabsContent value="navigation" className="space-y-6 mt-6">
            {/* Header Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Header Configuration</CardTitle>
                <CardDescription>
                  Customize header appearance and behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Header Style</Label>
                    <Select 
                      value={config.navigation.header.style}
                      onValueChange={(value) => updateNestedConfig('navigation', 'header', { style: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="transparent">Transparent</SelectItem>
                        <SelectItem value="solid">Solid Background</SelectItem>
                        <SelectItem value="blur">Blur Effect</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Header Height</Label>
                    <Select 
                      value={config.navigation.header.height}
                      onValueChange={(value) => updateNestedConfig('navigation', 'header', { height: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="64">64px (Compact)</SelectItem>
                        <SelectItem value="80">80px (Standard)</SelectItem>
                        <SelectItem value="96">96px (Large)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Sticky Header</Label>
                    <p className="text-sm text-gray-500">Keep header visible when scrolling</p>
                  </div>
                  <Switch 
                    checked={config.navigation.header.sticky}
                    onCheckedChange={(checked) => updateNestedConfig('navigation', 'header', { sticky: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Show Search Bar</Label>
                    <p className="text-sm text-gray-500">Display search in header</p>
                  </div>
                  <Switch 
                    checked={config.navigation.header.showSearch}
                    onCheckedChange={(checked) => updateNestedConfig('navigation', 'header', { showSearch: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Show Currency Selector</Label>
                    <p className="text-sm text-gray-500">Display currency switcher in header</p>
                  </div>
                  <Switch 
                    checked={config.navigation.header.showCurrency}
                    onCheckedChange={(checked) => updateNestedConfig('navigation', 'header', { showCurrency: checked })}
                  />
                </div>
                <Button onClick={() => handleSave('Header Configuration')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Header Settings
                </Button>
              </CardContent>
            </Card>

            {/* Mega Menu Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Mega Menu Configuration</CardTitle>
                <CardDescription>
                  Configure mega menu categories and links
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Mega Menu Style</Label>
                  <Select 
                    value={config.navigation.megaMenu.style}
                    onValueChange={(value) => updateNestedConfig('navigation', 'megaMenu', { style: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="expanded">Expanded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Women's Categories */}
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-semibold">Women's Categories</Label>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm mb-2 block">Clothing Categories</Label>
                      <div className="flex flex-wrap gap-2">
                        {(configuration.categories?.women?.clothing || ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Knitwear']).map((cat, idx) => (
                          <div key={idx} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                            <Input
                              value={cat}
                              onChange={(e) => {
                                const newCategories = { ...configuration.categories };
                                if (!newCategories.women) newCategories.women = { clothing: [], accessories: [] };
                                newCategories.women.clothing[idx] = e.target.value;
                                setConfiguration({ ...configuration, categories: newCategories });
                              }}
                              className="h-7 w-24 text-sm"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => {
                                const newCategories = { ...configuration.categories };
                                if (!newCategories.women) newCategories.women = { clothing: [], accessories: [] };
                                newCategories.women.clothing = newCategories.women.clothing.filter((_, i) => i !== idx);
                                setConfiguration({ ...configuration, categories: newCategories });
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7"
                          onClick={() => {
                            const newCategories = { ...configuration.categories };
                            if (!newCategories.women) newCategories.women = { clothing: [], accessories: [] };
                            newCategories.women.clothing.push('New Category');
                            setConfiguration({ ...configuration, categories: newCategories });
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">Accessories Categories</Label>
                      <div className="flex flex-wrap gap-2">
                        {(configuration.categories?.women?.accessories || ['Shoes', 'Jewelry', 'Bags']).map((cat, idx) => (
                          <div key={idx} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                            <Input
                              value={cat}
                              onChange={(e) => {
                                const newCategories = { ...configuration.categories };
                                if (!newCategories.women) newCategories.women = { clothing: [], accessories: [] };
                                newCategories.women.accessories[idx] = e.target.value;
                                setConfiguration({ ...configuration, categories: newCategories });
                              }}
                              className="h-7 w-24 text-sm"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => {
                                const newCategories = { ...configuration.categories };
                                if (!newCategories.women) newCategories.women = { clothing: [], accessories: [] };
                                newCategories.women.accessories = newCategories.women.accessories.filter((_, i) => i !== idx);
                                setConfiguration({ ...configuration, categories: newCategories });
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7"
                          onClick={() => {
                            const newCategories = { ...configuration.categories };
                            if (!newCategories.women) newCategories.women = { clothing: [], accessories: [] };
                            newCategories.women.accessories.push('New Category');
                            setConfiguration({ ...configuration, categories: newCategories });
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Men's Categories */}
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-semibold">Men's Categories</Label>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm mb-2 block">Clothing Categories</Label>
                      <div className="flex flex-wrap gap-2">
                        {(configuration.categories?.men?.clothing || ['Shirts', 'Tops', 'Bottoms', 'Outerwear', 'Knitwear']).map((cat, idx) => (
                          <div key={idx} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                            <Input
                              value={cat}
                              onChange={(e) => {
                                const newCategories = { ...configuration.categories };
                                if (!newCategories.men) newCategories.men = { clothing: [], accessories: [] };
                                newCategories.men.clothing[idx] = e.target.value;
                                setConfiguration({ ...configuration, categories: newCategories });
                              }}
                              className="h-7 w-24 text-sm"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => {
                                const newCategories = { ...configuration.categories };
                                if (!newCategories.men) newCategories.men = { clothing: [], accessories: [] };
                                newCategories.men.clothing = newCategories.men.clothing.filter((_, i) => i !== idx);
                                setConfiguration({ ...configuration, categories: newCategories });
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7"
                          onClick={() => {
                            const newCategories = { ...configuration.categories };
                            if (!newCategories.men) newCategories.men = { clothing: [], accessories: [] };
                            newCategories.men.clothing.push('New Category');
                            setConfiguration({ ...configuration, categories: newCategories });
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm mb-2 block">Accessories Categories</Label>
                      <div className="flex flex-wrap gap-2">
                        {(configuration.categories?.men?.accessories || ['Shoes', 'Accessories']).map((cat, idx) => (
                          <div key={idx} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                            <Input
                              value={cat}
                              onChange={(e) => {
                                const newCategories = { ...configuration.categories };
                                if (!newCategories.men) newCategories.men = { clothing: [], accessories: [] };
                                newCategories.men.accessories[idx] = e.target.value;
                                setConfiguration({ ...configuration, categories: newCategories });
                              }}
                              className="h-7 w-24 text-sm"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => {
                                const newCategories = { ...configuration.categories };
                                if (!newCategories.men) newCategories.men = { clothing: [], accessories: [] };
                                newCategories.men.accessories = newCategories.men.accessories.filter((_, i) => i !== idx);
                                setConfiguration({ ...configuration, categories: newCategories });
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7"
                          onClick={() => {
                            const newCategories = { ...configuration.categories };
                            if (!newCategories.men) newCategories.men = { clothing: [], accessories: [] };
                            newCategories.men.accessories.push('New Category');
                            setConfiguration({ ...configuration, categories: newCategories });
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sale Menu */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-semibold">Sale Menu</Label>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Categories: All Sale Items, Last Chance, Clearance</p>
                    <p>Featured Items: Sale highlights</p>
                  </div>
                </div>

                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Menu Category
                </Button>
                
                <Button onClick={() => handleSave('Mega Menu')} className="ml-2">
                  <Save className="h-4 w-4 mr-2" />
                  Save Menu Changes
                </Button>
              </CardContent>
            </Card>

            {/* Footer Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Footer Configuration</CardTitle>
                <CardDescription>
                  Customize footer content and links
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Footer Style</Label>
                  <Select 
                    value={config.navigation.footer.style}
                    onValueChange={(value) => updateNestedConfig('navigation', 'footer', { style: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Column</SelectItem>
                      <SelectItem value="multi-column">Multi-Column</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Show Newsletter Signup</Label>
                    <p className="text-sm text-gray-500">Display newsletter form in footer</p>
                  </div>
                  <Switch 
                    checked={config.navigation.footer.showNewsletter}
                    onCheckedChange={(checked) => updateNestedConfig('navigation', 'footer', { showNewsletter: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Show Social Links</Label>
                    <p className="text-sm text-gray-500">Display social media icons</p>
                  </div>
                  <Switch 
                    checked={config.navigation.footer.showSocial}
                    onCheckedChange={(checked) => updateNestedConfig('navigation', 'footer', { showSocial: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Show Payment Icons</Label>
                    <p className="text-sm text-gray-500">Display accepted payment methods</p>
                  </div>
                  <Switch 
                    checked={config.navigation.footer.showPaymentIcons}
                    onCheckedChange={(checked) => updateNestedConfig('navigation', 'footer', { showPaymentIcons: checked })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Copyright Text</Label>
                  <Input 
                    value={config.navigation.footer.copyrightText}
                    onChange={(e) => updateNestedConfig('navigation', 'footer', { copyrightText: e.target.value })}
                  />
                </div>
                <Button onClick={() => handleSave('Footer Configuration')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Footer Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== EMAIL TEMPLATES CONFIGURATION ==================== */}
          <TabsContent value="email" className="space-y-6 mt-6">
            {/* Email Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Email Server Configuration</CardTitle>
                <CardDescription>
                  SMTP settings for sending emails
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>SMTP Host</Label>
                    <Input placeholder="smtp.example.com" defaultValue="smtp.sendgrid.net" />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Port</Label>
                    <Input placeholder="587" defaultValue="587" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>SMTP Username</Label>
                    <Input placeholder="apikey" defaultValue="apikey" />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Password</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>From Email</Label>
                  <Input type="email" defaultValue="noreply@rloco.com" />
                </div>
                <div className="space-y-2">
                  <Label>From Name</Label>
                  <Input defaultValue="Rloco" />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    Test Email Configuration
                  </Button>
                  <Button onClick={() => handleSave('Email Server')}>
                    <Save className="h-4 w-4 mr-2" />
                    Save SMTP Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Email Templates */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Email Templates</CardTitle>
                    <CardDescription>
                      Customize automated email templates
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Template
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {emailTemplates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Label className="font-semibold">{template.name}</Label>
                            {template.active && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">Subject: {template.subject}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Switch checked={template.active} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* SMS Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>SMS Configuration</CardTitle>
                <CardDescription>
                  Configure SMS notifications via Twilio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Enable SMS Notifications</Label>
                    <p className="text-sm text-gray-500">Send order updates via SMS</p>
                  </div>
                  <Switch />
                </div>
                <div className="space-y-2">
                  <Label>Twilio Account SID</Label>
                  <Input placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" type="password" />
                </div>
                <div className="space-y-2">
                  <Label>Twilio Auth Token</Label>
                  <Input placeholder="••••••••" type="password" />
                </div>
                <div className="space-y-2">
                  <Label>Twilio Phone Number</Label>
                  <Input placeholder="+1 (555) 123-4567" />
                </div>
                <div className="space-y-4 pt-4 border-t">
                  <Label>SMS Notifications</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <Label className="text-sm">Order Placed</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <Label className="text-sm">Order Shipped</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <Label className="text-sm">Out for Delivery</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <Label className="text-sm">Delivered</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                <Button onClick={() => handleSave('SMS Configuration')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save SMS Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== SEO CONFIGURATION ==================== */}
          <TabsContent value="seo" className="space-y-6 mt-6">
            {/* Meta Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Meta Tags & SEO</CardTitle>
                <CardDescription>
                  Configure meta tags for search engines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Site Title</Label>
                  <Input defaultValue="Rloco - Modern Luxury Fashion" />
                  <p className="text-xs text-gray-500">Appears in browser tab and search results</p>
                </div>
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Textarea
                    defaultValue="Shop curated luxury fashion at Rloco. Discover timeless pieces from the world's finest designers. Free shipping on orders over $100."
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">150-160 characters recommended</p>
                </div>
                <div className="space-y-2">
                  <Label>Meta Keywords</Label>
                  <Input defaultValue="luxury fashion, designer clothing, high-end fashion, premium accessories" />
                  <p className="text-xs text-gray-500">Comma-separated keywords</p>
                </div>
                <div className="space-y-2">
                  <Label>Canonical URL</Label>
                  <Input defaultValue="https://rloco.com" />
                </div>
                <Button onClick={() => handleSave('Meta Tags')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Meta Tags
                </Button>
              </CardContent>
            </Card>

            {/* Open Graph */}
            <Card>
              <CardHeader>
                <CardTitle>Open Graph (Social Sharing)</CardTitle>
                <CardDescription>
                  Configure how your site appears on social media
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>OG Title</Label>
                  <Input defaultValue="Rloco - Modern Luxury Fashion" />
                </div>
                <div className="space-y-2">
                  <Label>OG Description</Label>
                  <Textarea
                    defaultValue="Discover curated luxury fashion collections at Rloco."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>OG Image</Label>
                  <Input type="file" accept="image/*" />
                  <p className="text-xs text-gray-500">Recommended: 1200x630px</p>
                </div>
                <div className="space-y-2">
                  <Label>Twitter Card Type</Label>
                  <Select defaultValue="summary_large">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">Summary</SelectItem>
                      <SelectItem value="summary_large">Summary Large Image</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => handleSave('Open Graph')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Social Settings
                </Button>
              </CardContent>
            </Card>

            {/* Sitemap & Robots */}
            <Card>
              <CardHeader>
                <CardTitle>Sitemap & Robots.txt</CardTitle>
                <CardDescription>
                  Configure search engine crawling
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Auto-generate Sitemap</Label>
                    <p className="text-sm text-gray-500">Automatically create and update sitemap.xml</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sitemap URL</Label>
                    <p className="text-sm text-gray-500 mt-1">https://rloco.com/sitemap.xml</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Globe className="h-4 w-4 mr-2" />
                    View Sitemap
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Robots.txt Content</Label>
                  <Textarea
                    defaultValue={`User-agent: *\nAllow: /\nSitemap: https://rloco.com/sitemap.xml`}
                    rows={5}
                    className="font-mono text-sm"
                  />
                </div>
                <Button onClick={() => handleSave('Sitemap & Robots')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Crawler Settings
                </Button>
              </CardContent>
            </Card>

            {/* Schema Markup */}
            <Card>
              <CardHeader>
                <CardTitle>Schema Markup (Structured Data)</CardTitle>
                <CardDescription>
                  Add structured data for rich search results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Enable Organization Schema</Label>
                    <p className="text-sm text-gray-500">Add company information schema</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Enable Product Schema</Label>
                    <p className="text-sm text-gray-500">Add product rich snippets</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Enable Breadcrumb Schema</Label>
                    <p className="text-sm text-gray-500">Add breadcrumb navigation data</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Button onClick={() => handleSave('Schema Markup')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Schema Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== ANALYTICS CONFIGURATION ==================== */}
          <TabsContent value="analytics" className="space-y-6 mt-6">
            {/* Google Analytics */}
            <Card>
              <CardHeader>
                <CardTitle>Google Analytics</CardTitle>
                <CardDescription>
                  Connect Google Analytics for tracking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                  <div className="space-y-0.5">
                    <Label>Enable Google Analytics</Label>
                    <p className="text-sm text-gray-500">Track website traffic and user behavior</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Google Analytics Measurement ID</Label>
                  <Input placeholder="G-XXXXXXXXXX" defaultValue="G-XXXXXXXXXX" />
                  <p className="text-xs text-gray-500">Find this in your GA4 property settings</p>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Enable Enhanced Ecommerce</Label>
                    <p className="text-sm text-gray-500">Track product impressions, clicks, and purchases</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Track User ID</Label>
                    <p className="text-sm text-gray-500">Associate sessions with user accounts</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Button onClick={() => handleSave('Google Analytics')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Analytics Settings
                </Button>
              </CardContent>
            </Card>

            {/* Facebook Pixel */}
            <Card>
              <CardHeader>
                <CardTitle>Facebook Pixel</CardTitle>
                <CardDescription>
                  Track conversions for Facebook ads
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Enable Facebook Pixel</Label>
                    <p className="text-sm text-gray-500">Track conversions and build audiences</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Facebook Pixel ID</Label>
                  <Input placeholder="1234567890123456" defaultValue="1234567890123456" />
                </div>
                <div className="space-y-4 pt-4 border-t">
                  <Label>Standard Events</Label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <Label className="text-sm">PageView</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <Label className="text-sm">ViewContent</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <Label className="text-sm">AddToCart</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <Label className="text-sm">InitiateCheckout</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <Label className="text-sm">Purchase</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                <Button onClick={() => handleSave('Facebook Pixel')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Pixel Settings
                </Button>
              </CardContent>
            </Card>

            {/* Other Integrations */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Tracking</CardTitle>
                <CardDescription>
                  Connect other analytics and tracking tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Google Tag Manager ID</Label>
                  <Input placeholder="GTM-XXXXXXX" />
                </div>
                <div className="space-y-2">
                  <Label>TikTok Pixel ID</Label>
                  <Input placeholder="XXXXXXXXXXXXXXX" />
                </div>
                <div className="space-y-2">
                  <Label>Pinterest Tag ID</Label>
                  <Input placeholder="XXXXXXXXXXXXX" />
                </div>
                <div className="space-y-2">
                  <Label>Hotjar Site ID</Label>
                  <Input placeholder="XXXXXXX" />
                </div>
                <div className="space-y-2">
                  <Label>Custom JavaScript (Header)</Label>
                  <Textarea
                    placeholder="<!-- Custom scripts -->"
                    rows={4}
                    className="font-mono text-sm"
                  />
                </div>
                <Button onClick={() => handleSave('Additional Tracking')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Tracking Codes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== BADGE CONFIGURATION ==================== */}
          <TabsContent value="badges" className="space-y-6 mt-6">
            {/* Badge Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Product Badges</CardTitle>
                    <CardDescription>
                      Create and manage product badges and labels
                    </CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Badge
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'New Arrival', color: '#B4770E', icon: <Zap className="h-5 w-5" />, active: true, products: 24 },
                    { name: 'Best Seller', color: '#FF6B6B', icon: <TrendingUp className="h-5 w-5" />, active: true, products: 18 },
                    { name: 'Limited Edition', color: '#9B59B6', icon: <Award className="h-5 w-5" />, active: true, products: 8 },
                    { name: 'Sale', color: '#E74C3C', icon: <Percent className="h-5 w-5" />, active: true, products: 45 },
                    { name: 'Exclusive', color: '#000000', icon: <Star className="h-5 w-5" />, active: true, products: 12 },
                    { name: 'Gift Worthy', color: '#E91E63', icon: <Gift className="h-5 w-5" />, active: false, products: 0 },
                    { name: 'Trending', color: '#FF9800', icon: <TrendingUp className="h-5 w-5" />, active: true, products: 15 },
                    { name: 'Low Stock', color: '#F44336', icon: <Clock className="h-5 w-5" />, active: true, products: 6 },
                  ].map((badge, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded flex items-center justify-center text-white"
                            style={{ backgroundColor: badge.color }}
                          >
                            {badge.icon}
                          </div>
                          <div>
                            <Label className="font-semibold">{badge.name}</Label>
                            <p className="text-xs text-gray-500">{badge.products} products</p>
                          </div>
                        </div>
                        <Switch checked={badge.active} />
                      </div>
                      <div className="flex gap-2 pt-3 border-t">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Copy className="h-3 w-3 mr-1" />
                          Duplicate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Badge Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Badge Display Settings</CardTitle>
                <CardDescription>
                  Configure how badges appear on products
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Badge Position</Label>
                  <Select defaultValue="top-left">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top-left">Top Left</SelectItem>
                      <SelectItem value="top-right">Top Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Badge Size</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Badge Shape</Label>
                  <Select defaultValue="rounded">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="rounded">Rounded</SelectItem>
                      <SelectItem value="circle">Circle</SelectItem>
                      <SelectItem value="tag">Tag</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Show Multiple Badges</Label>
                    <p className="text-sm text-gray-500">Allow multiple badges per product</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Badges per Product</Label>
                  <Select defaultValue="2">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Badge</SelectItem>
                      <SelectItem value="2">2 Badges</SelectItem>
                      <SelectItem value="3">3 Badges</SelectItem>
                      <SelectItem value="unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => handleSave('Badge Settings')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Badge Settings
                </Button>
              </CardContent>
            </Card>

            {/* Auto Badge Rules */}
            <Card>
              <CardHeader>
                <CardTitle>Automatic Badge Rules</CardTitle>
                <CardDescription>
                  Set rules to automatically assign badges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { rule: 'Products added in last 30 days', badge: 'New Arrival', active: true },
                    { rule: 'Products with >50 sales/month', badge: 'Best Seller', active: true },
                    { rule: 'Products with discount >20%', badge: 'Sale', active: true },
                    { rule: 'Products with stock <10', badge: 'Low Stock', active: true },
                  ].map((rule, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="font-semibold">Auto Rule {index + 1}</Label>
                        <Switch checked={rule.active} />
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{rule.rule}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Assigns:</span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {rule.badge}
                        </span>
                        <Button variant="ghost" size="sm" className="ml-auto">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Rule
                </Button>
                <Button onClick={() => handleSave('Badge Rules')} className="ml-2">
                  <Save className="h-4 w-4 mr-2" />
                  Save Rules
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ==================== SUBSCRIPTION CONFIGURATION ==================== */}
          <TabsContent value="subscriptions" className="space-y-6 mt-6">
            {/* Manage All Subscription Plans */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-[#B4770E]" />
                      Manage Subscription Plans
                    </CardTitle>
                    <CardDescription>
                      Create, edit, and configure multiple subscription plans for different vendor pricing
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border rounded-lg p-1 bg-gray-50">
                      <button
                        onClick={() => setViewMode('table')}
                        className={`px-3 py-1 rounded ${
                          viewMode === 'table'
                            ? 'bg-white shadow-sm text-[#B4770E]'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-1 rounded ${
                          viewMode === 'grid'
                            ? 'bg-white shadow-sm text-[#B4770E]'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Grid3x3 className="h-4 w-4" />
                      </button>
                    </div>
                    <Button onClick={handleAddPlan} className="bg-[#B4770E] hover:bg-[#8B5A0B]">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Plan
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Table View */}
                {viewMode === 'table' && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left p-3 font-semibold text-sm">Config Name</th>
                          <th className="text-left p-3 font-semibold text-sm">Plan Name</th>
                          <th className="text-left p-3 font-semibold text-sm">Description</th>
                          <th className="text-left p-3 font-semibold text-sm">Monthly</th>
                          <th className="text-left p-3 font-semibold text-sm">Yearly</th>
                          <th className="text-left p-3 font-semibold text-sm">Commission</th>
                          <th className="text-left p-3 font-semibold text-sm">Max Products</th>
                          <th className="text-left p-3 font-semibold text-sm">Max Team</th>
                          <th className="text-left p-3 font-semibold text-sm">Max Orders</th>
                          <th className="text-left p-3 font-semibold text-sm">Status</th>
                          <th className="text-left p-3 font-semibold text-sm">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscriptionPlans.map((plan) => (
                          <tr
                            key={plan.id}
                            className={`border-b hover:bg-gray-50 ${
                              plan.isDefault ? 'bg-[#B4770E]/5' : ''
                            }`}
                          >
                            <td className="p-3">
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                                {plan.configName}
                              </code>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: plan.color }}
                                />
                                <span className="font-semibold">{plan.name}</span>
                                {plan.isDefault && (
                                  <Badge className="bg-[#B4770E] text-white text-xs">
                                    Default
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="p-3 text-sm text-gray-600 max-w-xs truncate">
                              {plan.description}
                            </td>
                            <td className="p-3 font-semibold text-[#B4770E]">
                              ${plan.monthlyPrice}
                            </td>
                            <td className="p-3 text-sm text-gray-600">
                              ${plan.yearlyPrice}
                              {plan.monthlyPrice > 0 && (
                                <div className="text-xs text-green-600">
                                  Save ${Math.round(plan.monthlyPrice * 12 - plan.yearlyPrice)}
                                </div>
                              )}
                            </td>
                            <td className="p-3 font-semibold">{plan.commission}%</td>
                            <td className="p-3">
                              {plan.maxProducts === 'unlimited' ? '∞' : plan.maxProducts}
                            </td>
                            <td className="p-3">
                              {plan.maxTeamMembers === 'unlimited' ? '∞' : plan.maxTeamMembers}
                            </td>
                            <td className="p-3">
                              {plan.maxOrders === 'unlimited' ? '∞' : plan.maxOrders}
                            </td>
                            <td className="p-3">
                              <div className="flex flex-col gap-1">
                                <Badge
                                  className={
                                    plan.active
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }
                                >
                                  {plan.active ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditPlan(plan)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleClonePlan(plan)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                                {!plan.isDefault && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeletePlan(plan.id)}
                                  >
                                    <Trash2 className="h-3 w-3 text-red-600" />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Grid View */}
                {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subscriptionPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative border-2 rounded-lg p-4 transition-all ${
                        plan.isDefault
                          ? 'border-[#B4770E] bg-[#B4770E]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${!plan.active ? 'opacity-50' : ''}`}
                    >
                      {/* Status Badges */}
                      <div className="absolute top-2 right-2 flex gap-1">
                        {plan.isDefault && (
                          <span className="px-2 py-0.5 bg-[#B4770E] text-white text-xs rounded-full">
                            Default
                          </span>
                        )}
                        {!plan.active && (
                          <span className="px-2 py-0.5 bg-gray-500 text-white text-xs rounded-full">
                            Inactive
                          </span>
                        )}
                      </div>

                      {/* Plan Header */}
                      <div className="mb-3 pr-16">
                        <h3 className="text-lg font-bold" style={{ color: plan.color }}>
                          {plan.name}
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">{plan.description}</p>
                      </div>

                      {/* Pricing */}
                      <div className="mb-3 pb-3 border-b">
                        <div className="flex items-baseline gap-1 mb-1">
                          <span className="text-2xl font-bold text-[#B4770E]">
                            ${plan.monthlyPrice}
                          </span>
                          <span className="text-sm text-gray-500">/month</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm text-gray-600">
                            ${plan.yearlyPrice}
                          </span>
                          <span className="text-xs text-gray-500">/year</span>
                          {plan.monthlyPrice > 0 && (
                            <span className="text-xs text-green-600 ml-1">
                              (Save $
                              {Math.round(plan.monthlyPrice * 12 - plan.yearlyPrice)})
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Commission & Limits */}
                      <div className="space-y-2 mb-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Commission:</span>
                          <span className="font-semibold text-[#B4770E]">
                            {plan.commission}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Max Products:</span>
                          <span className="font-semibold">
                            {plan.maxProducts === 'unlimited' ? '∞' : plan.maxProducts}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Team Members:</span>
                          <span className="font-semibold">
                            {plan.maxTeamMembers === 'unlimited' ? '∞' : plan.maxTeamMembers}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Max Orders:</span>
                          <span className="font-semibold">
                            {plan.maxOrders === 'unlimited' ? '∞' : plan.maxOrders}
                          </span>
                        </div>
                      </div>

                      {/* Features Summary */}
                      <div className="mb-3 pb-3 border-t pt-3">
                        <p className="text-xs font-semibold text-gray-700 mb-2">
                          Included Features:
                        </p>
                        <div className="space-y-1">
                          {Object.entries(plan.features)
                            .filter(([_, enabled]) => enabled)
                            .slice(0, 3)
                            .map(([feature]) => (
                              <div key={feature} className="flex items-center gap-1 text-xs text-green-600">
                                <div className="h-1 w-1 rounded-full bg-green-600" />
                                {feature.replace(/([A-Z])/g, ' $1').trim()}
                              </div>
                            ))}
                          {Object.values(plan.features).filter(Boolean).length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{Object.values(plan.features).filter(Boolean).length - 3} more
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-1 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPlan(plan)}
                          className="flex-1"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleClonePlan(plan)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        {!plan.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePlan(plan.id)}
                          >
                            <Trash2 className="h-3 w-3 text-red-600" />
                          </Button>
                        )}
                      </div>

                      {/* Quick Actions */}
                      <div className="mt-2 pt-2 border-t flex gap-2 text-xs">
                        {!plan.isDefault && (
                          <button
                            onClick={() => handleSetDefaultPlan(plan.id)}
                            className="text-[#B4770E] hover:underline"
                          >
                            Set as Default
                          </button>
                        )}
                        <button
                          onClick={() => handleTogglePlanActive(plan.id)}
                          className="text-gray-600 hover:underline"
                        >
                          {plan.active ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </div>
                  ))}
                  </div>
                )}

                {/* Total Plans Count */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      <span className="font-semibold">{subscriptionPlans.length}</span> total plans
                      <span className="mx-2">•</span>
                      <span className="font-semibold">
                        {subscriptionPlans.filter((p) => p.active).length}
                      </span>{' '}
                      active
                      <span className="mx-2">•</span>
                      <span className="font-semibold">
                        {subscriptionPlans.filter((p) => p.isDefault).length}
                      </span>{' '}
                      default
                    </span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleSave('All Plans')}>
                    <Save className="h-4 w-4 mr-2" />
                    Save All Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Basic Tier Configuration */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-gray-600" />
                      Basic Tier Configuration
                    </CardTitle>
                    <CardDescription>
                      Configure pricing and features for Basic subscription tier
                    </CardDescription>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Monthly Price (USD)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input defaultValue="29" type="number" className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Yearly Price (USD)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input defaultValue="290" type="number" className="pl-10" />
                    </div>
                    <p className="text-xs text-green-600">Save $58/year (16% off)</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Commission Rate (%)</Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input defaultValue="15" type="number" className="pl-10" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Max Products</Label>
                    <Input defaultValue="100" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Team Members</Label>
                    <Input defaultValue="3" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Orders/Month</Label>
                    <Input defaultValue="500" type="number" />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label className="mb-3 block">Included Features</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Basic Dashboard</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Product Management</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Order Management</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Email Support</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Basic Analytics</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Standard Reports</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Priority Support</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Advanced Analytics</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">API Access</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">White Label Branding</Label>
                      <Switch />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave('Basic Tier')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Basic Tier Settings
                </Button>
              </CardContent>
            </Card>

            {/* Premium Tier Configuration */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-blue-600" />
                      Premium Tier Configuration
                    </CardTitle>
                    <CardDescription>
                      Configure pricing and features for Premium subscription tier
                    </CardDescription>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Monthly Price (USD)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input defaultValue="79" type="number" className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Yearly Price (USD)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input defaultValue="790" type="number" className="pl-10" />
                    </div>
                    <p className="text-xs text-green-600">Save $158/year (16% off)</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Commission Rate (%)</Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input defaultValue="10" type="number" className="pl-10" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Max Products</Label>
                    <Input defaultValue="1000" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Team Members</Label>
                    <Input defaultValue="10" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Orders/Month</Label>
                    <Input defaultValue="2000" type="number" />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label className="mb-3 block">Included Features</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Basic Dashboard</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Product Management</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Order Management</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Priority Support</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Advanced Analytics</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Custom Reports</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Bulk Operations</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Marketing Tools</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">API Access</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">White Label Branding</Label>
                      <Switch />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave('Premium Tier')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Premium Tier Settings
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Tier Configuration */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-purple-600" />
                      Enterprise Tier Configuration
                    </CardTitle>
                    <CardDescription>
                      Configure pricing and features for Enterprise subscription tier
                    </CardDescription>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Monthly Price (USD)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input defaultValue="199" type="number" className="pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Yearly Price (USD)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input defaultValue="1990" type="number" className="pl-10" />
                    </div>
                    <p className="text-xs text-green-600">Save $398/year (16% off)</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Commission Rate (%)</Label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input defaultValue="5" type="number" className="pl-10" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Max Products</Label>
                    <Input defaultValue="unlimited" disabled />
                    <p className="text-xs text-gray-500">Unlimited</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Max Team Members</Label>
                    <Input defaultValue="unlimited" disabled />
                    <p className="text-xs text-gray-500">Unlimited</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Max Orders/Month</Label>
                    <Input defaultValue="unlimited" disabled />
                    <p className="text-xs text-gray-500">Unlimited</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label className="mb-3 block">Included Features (All Enabled)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Advanced Dashboard</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Product Management</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Order Management</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Priority Support 24/7</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Advanced Analytics</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Custom Reports</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Bulk Operations</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Marketing Automation</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Full API Access</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">White Label Branding</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Dedicated Account Manager</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Custom Integrations</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave('Enterprise Tier')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Enterprise Tier Settings
                </Button>
              </CardContent>
            </Card>

            {/* Billing Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-[#B4770E]" />
                  Billing & Payment Settings
                </CardTitle>
                <CardDescription>
                  Configure billing cycles, payment methods, and invoicing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Default Billing Cycle</Label>
                    <Select defaultValue="monthly">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Due Date</Label>
                    <Select defaultValue="1">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st of month</SelectItem>
                        <SelectItem value="15">15th of month</SelectItem>
                        <SelectItem value="custom">Custom Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Grace Period (Days)</Label>
                    <Input defaultValue="7" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label>Late Fee (%)</Label>
                    <Input defaultValue="5" type="number" />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label className="mb-3 block">Accepted Payment Methods</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Credit Card (Stripe)</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Debit Card</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">PayPal</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Bank Transfer</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Apple Pay</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Google Pay</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label className="mb-3 block">Invoicing Options</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Auto-generate invoices</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Email invoices automatically</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Include tax breakdown</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Show payment history</Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave('Billing Settings')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Billing Settings
                </Button>
              </CardContent>
            </Card>

            {/* Trial & Promotional Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-[#B4770E]" />
                  Trial & Promotional Settings
                </CardTitle>
                <CardDescription>
                  Configure free trials, discounts, and promotional offers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div>
                      <Label className="text-sm font-semibold">Enable Free Trial</Label>
                      <p className="text-xs text-gray-600">Allow new vendors to try before subscribing</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 ml-4">
                    <div className="space-y-2">
                      <Label>Trial Duration (Days)</Label>
                      <Input defaultValue="14" type="number" />
                    </div>
                    <div className="space-y-2">
                      <Label>Trial Tier Access</Label>
                      <Select defaultValue="basic">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic Features</SelectItem>
                          <SelectItem value="premium">Premium Features</SelectItem>
                          <SelectItem value="enterprise">Enterprise Features</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 border-t pt-4">
                  <Label className="block font-semibold">Promotional Discounts</Label>
                  
                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">First Month Discount</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Discount Amount (%)</Label>
                        <Input defaultValue="50" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Applies To</Label>
                        <Select defaultValue="all">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Tiers</SelectItem>
                            <SelectItem value="basic">Basic Only</SelectItem>
                            <SelectItem value="premium">Premium Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">Annual Subscription Discount</Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <Label>Yearly Discount (%)</Label>
                      <Input defaultValue="16" type="number" />
                      <p className="text-xs text-gray-500">Applied when vendor chooses annual billing</p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">Referral Discount</Label>
                      <Switch />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Referrer Discount (%)</Label>
                        <Input defaultValue="10" type="number" />
                      </div>
                      <div className="space-y-2">
                        <Label>Referee Discount (%)</Label>
                        <Input defaultValue="10" type="number" />
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave('Trial Settings')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Trial & Promotional Settings
                </Button>
              </CardContent>
            </Card>

            {/* Commission Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Percent className="h-5 w-5 text-[#B4770E]" />
                  Commission & Payout Settings
                </CardTitle>
                <CardDescription>
                  Configure commission rates, payout schedules, and thresholds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Basic Tier Commission (%)</Label>
                    <Input defaultValue="15" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label>Premium Tier Commission (%)</Label>
                    <Input defaultValue="10" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label>Enterprise Tier Commission (%)</Label>
                    <Input defaultValue="5" type="number" />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label className="mb-3 block">Payout Schedule</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Payout Frequency</Label>
                      <Select defaultValue="weekly">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Minimum Payout Amount (USD)</Label>
                      <Input defaultValue="100" type="number" />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label className="mb-3 block">Commission Options</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Apply commission on shipping</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Apply commission on tax</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <Label className="text-sm">Commission on refunded orders</Label>
                      <Switch defaultChecked />
                      <p className="text-xs text-gray-500 ml-2">(Deduct from next payout)</p>
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleSave('Commission Settings')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Commission Settings
                </Button>
              </CardContent>
            </Card>

            {/* Email Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-[#B4770E]" />
                  Subscription Email Notifications
                </CardTitle>
                <CardDescription>
                  Configure automated emails for subscription events
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <Label className="font-medium">Welcome Email</Label>
                        <p className="text-xs text-gray-600">Sent when vendor creates account</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit Template
                    </Button>
                  </div>

                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <Label className="font-medium">Subscription Confirmation</Label>
                        <p className="text-xs text-gray-600">Sent when subscription is activated</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit Template
                    </Button>
                  </div>

                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <Label className="font-medium">Payment Receipt</Label>
                        <p className="text-xs text-gray-600">Sent after successful payment</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit Template
                    </Button>
                  </div>

                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <Label className="font-medium">Payment Failed</Label>
                        <p className="text-xs text-gray-600">Sent when payment fails</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit Template
                    </Button>
                  </div>

                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <Label className="font-medium">Subscription Renewal Reminder</Label>
                        <p className="text-xs text-gray-600">Sent 7 days before renewal</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit Template
                    </Button>
                  </div>

                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <Label className="font-medium">Subscription Cancelled</Label>
                        <p className="text-xs text-gray-600">Sent when subscription is cancelled</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit Template
                    </Button>
                  </div>

                  <div className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <Label className="font-medium">Trial Ending Soon</Label>
                        <p className="text-xs text-gray-600">Sent 3 days before trial ends</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit Template
                    </Button>
                  </div>
                </div>

                <Button onClick={() => handleSave('Email Notifications')}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Email Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};
