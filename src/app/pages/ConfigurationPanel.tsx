import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  Smartphone, 
  Monitor,
  Palette,
  Settings,
  Globe,
  Bell,
  Shield,
  Zap
} from 'lucide-react';
import { useSiteConfig } from '@/app/context/SiteConfigContext';
import { useIsMobile } from '@/app/hooks/useIsMobile';
import { toast } from 'sonner';

export function ConfigurationPanel() {
  const { config, updateConfig, updateNestedConfig, resetConfig, exportConfig, importConfig } = useSiteConfig();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<'general' | 'mobile' | 'desktop' | 'design'>('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'mobile', label: 'Mobile', icon: Smartphone },
    { id: 'desktop', label: 'Desktop', icon: Monitor },
    { id: 'design', label: 'Design', icon: Palette },
  ];

  const handleExport = () => {
    const configJson = exportConfig();
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rloco-config-${Date.now()}.json`;
    a.click();
    toast.success('Configuration exported successfully!');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const configJson = e.target?.result as string;
        importConfig(configJson);
        toast.success('Configuration imported successfully!');
      } catch (error) {
        toast.error('Failed to import configuration. Invalid JSON format.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all configurations to default? This cannot be undone.')) {
      resetConfig();
      toast.success('Configuration reset to defaults');
    }
  };

  const handleSave = () => {
    // Configuration is auto-saved to localStorage
    toast.success('Configuration saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-border/30"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-medium mb-2">Configuration Panel</h1>
              <p className="text-foreground/60">Manage mobile and desktop settings</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Export */}
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              >
                <Download size={18} />
                <span>Export</span>
              </button>

              {/* Import */}
              <label className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors cursor-pointer">
                <Upload size={18} />
                <span>Import</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>

              {/* Reset */}
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
              >
                <RotateCcw size={18} />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-4 border border-border/30 sticky top-4">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-transparent text-foreground/70 hover:bg-muted'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Current Platform Indicator */}
              <div className="mt-6 pt-6 border-t border-border/30">
                <div className="flex items-center gap-2 text-sm text-foreground/60 mb-2">
                  <Zap size={16} />
                  <span>Current View</span>
                </div>
                <div className={`px-3 py-2 rounded-lg ${
                  isMobile ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                }`}>
                  <div className="flex items-center gap-2">
                    {isMobile ? <Smartphone size={16} /> : <Monitor size={16} />}
                    <span className="font-medium">{isMobile ? 'Mobile' : 'Desktop'}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-border/30">
              {activeTab === 'general' && <GeneralSettings config={config} updateConfig={updateConfig} />}
              {activeTab === 'mobile' && <MobileSettings />}
              {activeTab === 'desktop' && <DesktopSettings />}
              {activeTab === 'design' && <DesignSettings config={config} updateNestedConfig={updateNestedConfig} />}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Save Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSave}
        className="fixed bottom-8 right-8 bg-primary text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 hover:bg-primary/90 transition-colors z-50"
      >
        <Save size={20} />
        <span className="font-medium">Save Changes</span>
      </motion.button>
    </div>
  );
}

// General Settings Component
function GeneralSettings({ config, updateConfig }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium mb-4 flex items-center gap-2">
          <Globe size={24} />
          General Settings
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Site Name</label>
          <input
            type="text"
            value={config.general.siteName}
            onChange={(e) => updateConfig('general', { siteName: e.target.value })}
            className="w-full px-4 py-2 border border-border/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tagline</label>
          <input
            type="text"
            value={config.general.tagline}
            onChange={(e) => updateConfig('general', { tagline: e.target.value })}
            className="w-full px-4 py-2 border border-border/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={config.general.email}
            onChange={(e) => updateConfig('general', { email: e.target.value })}
            className="w-full px-4 py-2 border border-border/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <input
            type="tel"
            value={config.general.phone}
            onChange={(e) => updateConfig('general', { phone: e.target.value })}
            className="w-full px-4 py-2 border border-border/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={config.general.description}
          onChange={(e) => updateConfig('general', { description: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-border/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Currency</label>
          <select
            value={config.general.currency}
            onChange={(e) => updateConfig('general', { currency: e.target.value })}
            className="w-full px-4 py-2 border border-border/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="usd">USD ($)</option>
            <option value="eur">EUR (€)</option>
            <option value="gbp">GBP (£)</option>
            <option value="inr">INR (₹)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Timezone</label>
          <select
            value={config.general.timezone}
            onChange={(e) => updateConfig('general', { timezone: e.target.value })}
            className="w-full px-4 py-2 border border-border/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="america/new_york">America/New York</option>
            <option value="america/los_angeles">America/Los Angeles</option>
            <option value="europe/london">Europe/London</option>
            <option value="asia/dubai">Asia/Dubai</option>
            <option value="asia/kolkata">Asia/Kolkata</option>
          </select>
        </div>
      </div>

      <div className="pt-6 border-t border-border/30">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={config.general.maintenanceMode}
            onChange={(e) => updateConfig('general', { maintenanceMode: e.target.checked })}
            className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary/50"
          />
          <div>
            <span className="font-medium">Maintenance Mode</span>
            <p className="text-sm text-foreground/60">Enable to show maintenance page to visitors</p>
          </div>
        </label>
      </div>
    </div>
  );
}

// Mobile Settings Component
function MobileSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium mb-4 flex items-center gap-2">
          <Smartphone size={24} />
          Mobile App Settings
        </h2>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Bell className="text-blue-600 mt-1" size={20} />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">Mobile Configuration</h3>
            <p className="text-sm text-blue-700">
              These settings control the mobile app behavior. Changes will apply to mobile devices (screens under 768px).
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <h3 className="font-medium">Splash Screen</h3>
            <p className="text-sm text-foreground/60">Show splash screen on app launch</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <h3 className="font-medium">Onboarding</h3>
            <p className="text-sm text-foreground/60">Show onboarding slides for new users</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <h3 className="font-medium">Bottom Navigation</h3>
            <p className="text-sm text-foreground/60">Show fixed bottom navigation bar</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <h3 className="font-medium">Pull to Refresh</h3>
            <p className="text-sm text-foreground/60">Enable pull-to-refresh gesture</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <h3 className="font-medium">Push Notifications</h3>
            <p className="text-sm text-foreground/60">Enable push notifications</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
    </div>
  );
}

// Desktop Settings Component
function DesktopSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium mb-4 flex items-center gap-2">
          <Monitor size={24} />
          Desktop Website Settings
        </h2>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Shield className="text-green-600 mt-1" size={20} />
          <div>
            <h3 className="font-medium text-green-900 mb-1">Desktop Configuration</h3>
            <p className="text-sm text-green-700">
              These settings control the desktop website behavior. Changes will apply to desktop devices (screens over 768px).
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <h3 className="font-medium">Custom Cursor</h3>
            <p className="text-sm text-foreground/60">Show custom animated cursor</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <h3 className="font-medium">Mega Menu</h3>
            <p className="text-sm text-foreground/60">Show mega menu in navigation</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <h3 className="font-medium">Parallax Effects</h3>
            <p className="text-sm text-foreground/60">Enable parallax scrolling effects</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <h3 className="font-medium">Sticky Header</h3>
            <p className="text-sm text-foreground/60">Keep header fixed on scroll</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
          <div>
            <h3 className="font-medium">Keyboard Shortcuts</h3>
            <p className="text-sm text-foreground/60">Enable keyboard navigation shortcuts</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
    </div>
  );
}

// Design Settings Component
function DesignSettings({ config, updateNestedConfig }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium mb-4 flex items-center gap-2">
          <Palette size={24} />
          Design & Branding
        </h2>
      </div>

      <div>
        <h3 className="font-medium mb-4">Color Palette (60:30:10 System)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Primary (10% - Brand Gold)</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.design.colors.primary}
                onChange={(e) => updateNestedConfig('design', 'colors', { primary: e.target.value })}
                className="w-16 h-10 rounded border border-border/30 cursor-pointer"
              />
              <input
                type="text"
                value={config.design.colors.primary}
                onChange={(e) => updateNestedConfig('design', 'colors', { primary: e.target.value })}
                className="flex-1 px-4 py-2 border border-border/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Secondary (30% - Black)</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.design.colors.secondary}
                onChange={(e) => updateNestedConfig('design', 'colors', { secondary: e.target.value })}
                className="w-16 h-10 rounded border border-border/30 cursor-pointer"
              />
              <input
                type="text"
                value={config.design.colors.secondary}
                onChange={(e) => updateNestedConfig('design', 'colors', { secondary: e.target.value })}
                className="flex-1 px-4 py-2 border border-border/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Dominant (60% - White)</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.design.colors.dominant}
                onChange={(e) => updateNestedConfig('design', 'colors', { dominant: e.target.value })}
                className="w-16 h-10 rounded border border-border/30 cursor-pointer"
              />
              <input
                type="text"
                value={config.design.colors.dominant}
                onChange={(e) => updateNestedConfig('design', 'colors', { dominant: e.target.value })}
                className="flex-1 px-4 py-2 border border-border/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-border/30">
        <h3 className="font-medium mb-4">Typography</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Font Family</label>
            <select
              value={config.design.typography.bodyFont}
              onChange={(e) => updateNestedConfig('design', 'typography', { bodyFont: e.target.value })}
              className="w-full px-4 py-2 border border-border/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="Inter">Inter</option>
              <option value="Poppins">Poppins</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Playfair Display">Playfair Display</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Base Font Size (px)</label>
            <input
              type="number"
              value={config.design.typography.baseFontSize}
              onChange={(e) => updateNestedConfig('design', 'typography', { baseFontSize: e.target.value })}
              className="w-full px-4 py-2 border border-border/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-border/30">
        <h3 className="font-medium mb-4">Animations</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <h4 className="font-medium">Enable Animations</h4>
              <p className="text-sm text-foreground/60">Smooth Motion animations throughout</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.design.animations.enabled}
                onChange={(e) => updateNestedConfig('design', 'animations', { enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Animation Speed</label>
            <select
              value={config.design.animations.speed}
              onChange={(e) => updateNestedConfig('design', 'animations', { speed: e.target.value })}
              className="w-full px-4 py-2 border border-border/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="slow">Slow (800ms)</option>
              <option value="normal">Normal (500ms)</option>
              <option value="fast">Fast (300ms)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
