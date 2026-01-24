import { BarChart3, Package, ShoppingCart, Users, Store, Tag, TrendingUp, FileText, Video, MessageSquare, Heart, Award, Percent, Settings as SettingsIcon, CreditCard, DollarSign } from 'lucide-react';

// Alert Components
const AlertBox = ({ type, title, children }: { type: 'info' | 'success' | 'warning' | 'error', title: string, children: React.ReactNode }) => {
  const styles = {
    info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', icon: '

ℹ️' },
    success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900', icon: '✅' },
    warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-900', icon: '⚠️' },
    error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900', icon: '❌' }
  };
  
  const style = styles[type];
  
  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-4 mb-4`}>
      <div className="flex gap-3">
        <div className="text-2xl">{style.icon}</div>
        <div className="flex-1">
          <h4 className={`font-medium ${style.text} mb-1`}>{title}</h4>
          <div className={`text-sm ${style.text}/80`}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export function CompleteAdminGuide() {
  return (
    <div className="prose prose-sm max-w-none">
      <h1 className="text-4xl font-light tracking-wider text-gray-900 mb-2">🛡️ Complete Admin Guide</h1>
      <p className="text-gray-600 mb-8">Ultra-detailed documentation for all 16 admin portal pages with step-by-step instructions</p>

      <AlertBox type="info" title="Admin Access Level">
        You have FULL ACCESS to all features. This comprehensive guide covers every page, button, configuration option, and workflow in the admin portal.
      </AlertBox>

      {/* TABLE OF CONTENTS */}
      <div className="bg-gradient-to-r from-[#B4770E]/10 to-white border-l-4 border-[#B4770E] p-6 rounded-r-lg mb-8">
        <h2 className="text-2xl font-medium text-gray-900 mb-4">📚 Table of Contents</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-2">
            <div className="font-medium text-[#B4770E]">Core Management</div>
            <div className="ml-3">1. Dashboard</div>
            <div className="ml-3">2. Products Management</div>
            <div className="ml-3">3. Orders Management</div>
            <div className="ml-3">4. Customers Management</div>
            <div className="ml-3">5. Vendors Management</div>
            <div className="ml-3">6. Categories Management</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-[#B4770E]">Content & Marketing</div>
            <div className="ml-3">7. Analytics Dashboard</div>
            <div className="ml-3">8. Content Management</div>
            <div className="ml-3">9. Videos Management</div>
            <div className="ml-3">10. Reviews Management</div>
            <div className="ml-3">11. Wishlist Analytics</div>
            <div className="ml-3">12. Badge Management</div>
          </div>
          <div className="space-y-2">
            <div className="font-medium text-[#B4770E]">Configuration</div>
            <div className="ml-3">13. Promotions</div>
            <div className="ml-3">14. Site Configuration</div>
            <div className="ml-3">15. Subscription Plans</div>
            <div className="ml-3">16. Settings</div>
          </div>
        </div>
      </div>

      {/* Continue with all sections... */}
      <AlertBox type="success" title="Guide Preview">
        This is the complete admin guide structure. Full implementation with all 16 sections coming in the next update!
      </AlertBox>
    </div>
  );
}

export function CompleteVendorGuide() {
  return (
    <div className="prose prose-sm max-w-none">
      <h1 className="text-4xl font-light tracking-wider text-gray-900 mb-2">👤 Complete Vendor Guide</h1>
      <p className="text-gray-600 mb-8">Ultra-detailed documentation for all 8 vendor portal pages with step-by-step instructions</p>

      <AlertBox type="info" title="Vendor Access Level">
        You have access to 8 vendor-specific pages. This guide covers every feature available to vendors with detailed workflows.
      </AlertBox>

      {/* TABLE OF CONTENTS */}
      <div className="bg-gradient-to-r from-purple-50 to-white border-l-4 border-purple-500 p-6 rounded-r-lg mb-8">
        <h2 className="text-2xl font-medium text-gray-900 mb-4">📚 Table of Contents</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="space-y-2">
            <div className="ml-3">1. Vendor Dashboard</div>
            <div className="ml-3">2. My Products</div>
            <div className="ml-3">3. My Orders</div>
            <div className="ml-3">4. My Analytics</div>
          </div>
          <div className="space-y-2">
            <div className="ml-3">5. My Videos</div>
            <div className="ml-3">6. Product Reviews</div>
            <div className="ml-3">7. Subscription & Billing</div>
            <div className="ml-3">8. Vendor Settings</div>
          </div>
        </div>
      </div>

      {/* Continue with all sections... */}
      <AlertBox type="success" title="Guide Preview">
        This is the complete vendor guide structure. Full implementation with all 8 sections coming in the next update!
      </AlertBox>
    </div>
  );
}
