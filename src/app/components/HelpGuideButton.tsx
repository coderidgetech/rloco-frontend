import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, X, ChevronRight, User, Shield, Zap, FileText, AlertCircle, CheckCircle2, XCircle, Info, Package, TrendingUp, DollarSign, Users, ShoppingCart, Star, Tag, Video, MessageSquare, Heart, Award, Settings, BarChart3, FileEdit, Percent } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { UltraDetailedAdminGuide, UltraDetailedVendorGuide } from './UltraDetailedGuides';

interface GuideSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export function HelpGuideButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('quick');
  const location = useLocation();
  const { user } = useAdmin();

  // Only show on admin pages
  if (!location.pathname.startsWith('/admin')) {
    return null;
  }

  // Filter guides based on user role
  const allGuides: GuideSection[] = [
    {
      id: 'quick',
      title: 'Quick Start',
      icon: <Zap className="w-4 h-4" />,
      content: <QuickStartGuide />
    },
    {
      id: 'admin',
      title: 'Admin Guide',
      icon: <Shield className="w-4 h-4" />,
      content: <AdminGuide />
    },
    {
      id: 'vendor',
      title: 'Vendor Guide',
      icon: <User className="w-4 h-4" />,
      content: <VendorGuide />
    },
    {
      id: 'permissions',
      title: 'Permissions Guide',
      icon: <FileText className="w-4 h-4" />,
      content: <PermissionsGuide />
    }
  ];

  // Filter guides based on role
  const guides = allGuides.filter(guide => {
    if (guide.id === 'quick' || guide.id === 'permissions') {
      return true; // Show to everyone
    }
    if (guide.id === 'admin' && user?.role === 'admin') {
      return true; // Show admin guide only to admins
    }
    if (guide.id === 'vendor' && user?.role === 'vendor') {
      return true; // Show vendor guide only to vendors
    }
    return false;
  });

  const activeGuide = guides.find(g => g.id === activeTab);

  return (
    <>
      {/* Floating Help Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[100] bg-[#B4770E] text-white rounded-full p-4 shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <BookOpen className="w-6 h-6" />
        <motion.div
          className="absolute -top-12 right-0 bg-black text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        >
          Help & Guides
          <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-black"></div>
        </motion.div>
      </motion.button>

      {/* Help Guide Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 h-full w-full max-w-5xl bg-white shadow-2xl z-[120] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-black to-[#B4770E] text-white p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 rounded-full p-3">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-light tracking-wider">RLOCO PORTAL GUIDE</h2>
                    <p className="text-sm text-white/80 tracking-wide">Comprehensive admin & vendor documentation</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex h-[calc(100%-88px)]">
                {/* Sidebar Tabs */}
                <div className="w-72 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
                  <div className="space-y-2">
                    {guides.map((guide) => (
                      <button
                        key={guide.id}
                        onClick={() => setActiveTab(guide.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          activeTab === guide.id
                            ? 'bg-[#B4770E] text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {guide.icon}
                        <span className="flex-1 text-left font-light tracking-wide text-sm whitespace-nowrap">{guide.title}</span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === guide.id ? 'opacity-100' : 'opacity-0'}`} />
                      </button>
                    ))}
                  </div>

                  {/* Login Credentials Card */}
                  <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3 tracking-wide">LOGIN CREDENTIALS</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">ADMIN</div>
                        <div className="text-xs font-mono bg-gray-50 p-2 rounded">
                          <div>admin@rloco.com</div>
                          <div>admin123</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">VENDOR</div>
                        <div className="text-xs font-mono bg-gray-50 p-2 rounded">
                          <div>vendor@fashion.com</div>
                          <div>vendor123</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3 tracking-wide">QUICK LINKS</h3>
                    <div className="space-y-2 text-xs">
                      <a href="/admin/dashboard" className="block text-[#B4770E] hover:underline">📊 Dashboard</a>
                      <a href="/admin/products" className="block text-[#B4770E] hover:underline">📦 Products</a>
                      <a href="/admin/orders" className="block text-[#B4770E] hover:underline">🛒 Orders</a>
                      <a href="/admin/configuration" className="block text-[#B4770E] hover:underline">⚙️ Configuration</a>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeGuide?.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Alert Components
const AlertBox = ({ type, title, children }: { type: 'info' | 'success' | 'warning' | 'error', title: string, children: React.ReactNode }) => {
  const styles = {
    info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', icon: <Info className="w-5 h-5 text-blue-600" /> },
    success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900', icon: <CheckCircle2 className="w-5 h-5 text-green-600" /> },
    warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-900', icon: <AlertCircle className="w-5 h-5 text-yellow-600" /> },
    error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900', icon: <XCircle className="w-5 h-5 text-red-600" /> }
  };
  
  const style = styles[type];
  
  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-4 mb-4`}>
      <div className="flex gap-3">
        {style.icon}
        <div className="flex-1">
          <h4 className={`font-medium ${style.text} mb-1`}>{title}</h4>
          <div className={`text-sm ${style.text}/80`}>{children}</div>
        </div>
      </div>
    </div>
  );
};

// Quick Start Guide Component
function QuickStartGuide() {
  return (
    <div className="prose prose-sm max-w-none">
      <h1 className="text-4xl font-light tracking-wider text-gray-900 mb-2">🚀 Quick Start Guide</h1>
      <p className="text-gray-600 mb-8">Get up and running in 5 minutes</p>

      <AlertBox type="success" title="Welcome to Rloco Portal!">
        This comprehensive guide will help you master the admin portal. Choose your role below to get started.
      </AlertBox>

      {/* Admin Quick Start */}
      <div className="bg-gradient-to-r from-[#B4770E]/10 to-transparent border-l-4 border-[#B4770E] p-6 rounded-r-lg mb-8">
        <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-6 h-6" /> Admin Quick Start
        </h2>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="bg-[#B4770E] text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-medium">1</div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-2">Login & Access Dashboard</h3>
              <p className="text-sm text-gray-600 mb-2">Use your admin credentials to access the portal</p>
              <div className="bg-white border border-gray-200 rounded p-3 text-sm">
                <div className="font-mono text-[#B4770E]">admin@rloco.com / admin123</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-[#B4770E] text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-medium">2</div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-2">Configure Site Settings</h3>
              <p className="text-sm text-gray-600">Set up logo, currency, shipping options in Configuration</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-[#B4770E] text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-medium">3</div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-2">Create Categories</h3>
              <p className="text-sm text-gray-600">Organize products by categories (Women, Men, Jewelry, Beauty)</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-[#B4770E] text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-medium">4</div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-2">Add Products</h3>
              <p className="text-sm text-gray-600">Upload products with images, variants, and pricing</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-[#B4770E] text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-medium">5</div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-2">Start Managing Orders</h3>
              <p className="text-sm text-gray-600">Process orders, track shipments, manage customers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Quick Start */}
      <div className="bg-gradient-to-r from-purple-50 to-transparent border-l-4 border-purple-500 p-6 rounded-r-lg mb-8">
        <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-6 h-6" /> Vendor Quick Start
        </h2>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-medium">1</div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-2">Login & Complete Profile</h3>
              <p className="text-sm text-gray-600 mb-2">Access vendor portal and set up your business profile</p>
              <div className="bg-white border border-gray-200 rounded p-3 text-sm">
                <div className="font-mono text-purple-600">vendor@fashion.com / vendor123</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-medium">2</div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-2">Choose Subscription Plan</h3>
              <p className="text-sm text-gray-600">Select plan: Starter ($29), Growth ($79), Pro ($149), or Enterprise</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-medium">3</div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-2">Upload Your Products</h3>
              <p className="text-sm text-gray-600">Create product listings (requires admin approval)</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-medium">4</div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-2">Set Up Payout Method</h3>
              <p className="text-sm text-gray-600">Add bank account for monthly commission payouts</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-medium">5</div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-2">Start Selling</h3>
              <p className="text-sm text-gray-600">Monitor dashboard, fulfill orders, respond to reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Overview */}
      <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4 mt-8">📋 Portal Features Overview</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-[#B4770E]" />
            <h3 className="font-medium text-gray-900">Product Management</h3>
          </div>
          <p className="text-sm text-gray-600">Create, edit, and manage product catalog with variants and inventory</p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="w-5 h-5 text-[#B4770E]" />
            <h3 className="font-medium text-gray-900">Order Processing</h3>
          </div>
          <p className="text-sm text-gray-600">Track and fulfill customer orders with status updates and shipping</p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-[#B4770E]" />
            <h3 className="font-medium text-gray-900">Analytics Dashboard</h3>
          </div>
          <p className="text-sm text-gray-600">Monitor sales, revenue, and performance with detailed charts</p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-[#B4770E]" />
            <h3 className="font-medium text-gray-900">Customer Management</h3>
          </div>
          <p className="text-sm text-gray-600">View customer profiles, order history, and engagement (Admin only)</p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Video className="w-5 h-5 text-[#B4770E]" />
            <h3 className="font-medium text-gray-900">Video Management</h3>
          </div>
          <p className="text-sm text-gray-600">Upload TikTok-style videos to showcase products on homepage</p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-[#B4770E]" />
            <h3 className="font-medium text-gray-900">Review Management</h3>
          </div>
          <p className="text-sm text-gray-600">Moderate and respond to customer product reviews</p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-[#B4770E]" />
            <h3 className="font-medium text-gray-900">Badge System</h3>
          </div>
          <p className="text-sm text-gray-600">Create and apply product badges (NEW, SALE, TRENDING, etc.)</p>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="w-5 h-5 text-[#B4770E]" />
            <h3 className="font-medium text-gray-900">Promotions</h3>
          </div>
          <p className="text-sm text-gray-600">Create sales, discounts, and promotional campaigns (Admin only)</p>
        </div>
      </div>

      <AlertBox type="info" title="Need Help?">
        <div className="space-y-1">
          <div>📧 Email: support@rloco.com</div>
          <div>📞 Phone: +1 (555) 123-4567</div>
          <div>⏰ Hours: Mon-Fri 9AM-6PM EST</div>
        </div>
      </AlertBox>
    </div>
  );
}

// Admin Guide Component
function AdminGuide() {
  return <UltraDetailedAdminGuide />;
}

// Vendor Guide Component  
function VendorGuide() {
  return <UltraDetailedVendorGuide />;
}

// Permissions Guide Component
function OLD_AdminGuide_REMOVE_ME() {
  return (
    <div className="hidden">
      {/* Dashboard */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-[#B4770E]" /> Dashboard
        </h2>
        
        <p className="text-gray-700 mb-4">Your central command center showing key metrics and insights.</p>
        
        <h3 className="font-medium text-gray-900 mb-2">Key Metrics Displayed:</h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 rounded p-3">
            <div className="text-xs text-gray-500 whitespace-nowrap">Total Revenue</div>
            <div className="text-lg font-medium text-gray-900">$1,234,567</div>
            <div className="text-xs text-green-600 whitespace-nowrap">↑ 12.5% vs last mo.</div>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <div className="text-xs text-gray-500 whitespace-nowrap">Total Orders</div>
            <div className="text-lg font-medium text-gray-900">8,472</div>
            <div className="text-xs text-green-600 whitespace-nowrap">↑ 8.3% vs last mo.</div>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <div className="text-xs text-gray-500 whitespace-nowrap">Total Customers</div>
            <div className="text-lg font-medium text-gray-900">12,845</div>
            <div className="text-xs text-green-600 whitespace-nowrap">↑ 15.2% vs last mo.</div>
          </div>
          <div className="bg-gray-50 rounded p-3">
            <div className="text-xs text-gray-500 whitespace-nowrap">Total Products</div>
            <div className="text-lg font-medium text-gray-900">347</div>
            <div className="text-xs text-blue-600 whitespace-nowrap">Active inventory</div>
          </div>
        </div>

        <h3 className="font-medium text-gray-900 mb-2">Dashboard Features:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>📊 7-day sales trends (bar/line charts)</li>
          <li>🥧 Category performance breakdown</li>
          <li>📦 Recent orders table with quick actions</li>
          <li>⭐ Top-selling products</li>
          <li>🔔 Low stock alerts</li>
          <li>💰 Revenue comparison charts</li>
        </ul>
      </div>

      {/* Products */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4 flex items-center gap-2">
          <Package className="w-6 h-6 text-[#B4770E]" /> Product Management
        </h2>

        <p className="text-gray-700 mb-4">Complete product catalog management with 6-step creation process.</p>

        <AlertBox type="success" title="6-Step Product Creation">
          Follow these steps to create a professional product listing
        </AlertBox>

        <div className="space-y-4">
          <div className="border-l-4 border-[#B4770E] pl-4">
            <h3 className="font-medium text-gray-900 mb-2">Step 1: Basic Information</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Product Name (required, 3-100 characters)</li>
              <li>• Description (required, 50+ words recommended)</li>
              <li>• Category (Women, Men, Jewelry, Beauty, Accessories)</li>
              <li>• Brand Name</li>
              <li>• Vendor Assignment (auto for vendors)</li>
            </ul>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-medium text-gray-900 mb-2">Step 2: Pricing & Inventory</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Base Price (USD, converts to other currencies)</li>
              <li>• Compare At Price (original price for sale items)</li>
              <li>• Cost Per Item (for profit calculations)</li>
              <li>• SKU (Stock Keeping Unit)</li>
              <li>• Inventory Tracking (enable/disable)</li>
            </ul>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-medium text-gray-900 mb-2">Step 3: Product Images</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Upload 4-6 high-quality images</li>
              <li>• Recommended: 1000x1000px minimum</li>
              <li>• White or neutral background</li>
              <li>• Show multiple angles</li>
              <li>• First image = main product photo</li>
            </ul>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-medium text-gray-900 mb-2">Step 4: Variants</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Add Size Options (XS, S, M, L, XL, XXL)</li>
              <li>• Add Color Options (with color swatches)</li>
              <li>• Set variant-specific prices</li>
              <li>• Manage stock per variant</li>
              <li>• Unique SKU per variant</li>
            </ul>
          </div>

          <div className="border-l-4 border-orange-500 pl-4">
            <h3 className="font-medium text-gray-900 mb-2">Step 5: Badges & Features</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• NEW: Products added in last 30 days</li>
              <li>• SALE: Discounted items</li>
              <li>• TRENDING: Popular products</li>
              <li>• LIMITED: Low stock items</li>
              <li>• EXCLUSIVE: Premium products</li>
              <li>• BEST SELLER: Top-performing items</li>
            </ul>
          </div>

          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="font-medium text-gray-900 mb-2">Step 6: SEO & Publishing</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Meta Title (50-60 characters)</li>
              <li>• Meta Description (150-160 characters)</li>
              <li>• URL Slug (auto-generated or custom)</li>
              <li>• Status: Draft, Active, or Archived</li>
              <li>• Featured Product Toggle</li>
            </ul>
          </div>
        </div>

        <AlertBox type="warning" title="Best Practices">
          <ul className="text-sm space-y-1">
            <li>• Use professional product photography</li>
            <li>• Write detailed, compelling descriptions</li>
            <li>• Keep inventory accurate to avoid overselling</li>
            <li>• Use relevant keywords for SEO</li>
            <li>• Apply appropriate badges</li>
          </ul>
        </AlertBox>
      </div>

      {/* Orders */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-[#B4770E]" /> Order Management
        </h2>

        <p className="text-gray-700 mb-4">Process and track all customer orders across all vendors.</p>

        <h3 className="font-medium text-gray-900 mb-2">Order Status Workflow:</h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm font-medium text-gray-900">Pending</span>
            <span className="text-sm text-gray-600">→ Payment received, awaiting processing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm font-medium text-gray-900">Processing</span>
            <span className="text-sm text-gray-600">→ Order being prepared</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-sm font-medium text-gray-900">Shipped</span>
            <span className="text-sm text-gray-600">→ Order shipped with tracking</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-gray-900">Delivered</span>
            <span className="text-sm text-gray-600">→ Successfully delivered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm font-medium text-gray-900">Cancelled</span>
            <span className="text-sm text-gray-600">→ Order cancelled by customer/admin</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span className="text-sm font-medium text-gray-900">Refunded</span>
            <span className="text-sm text-gray-600">→ Payment refunded to customer</span>
          </div>
        </div>

        <h3 className="font-medium text-gray-900 mb-2">Admin Actions:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>✅ View all orders from all vendors</li>
          <li>✏️ Update order status</li>
          <li>📦 Add tracking numbers</li>
          <li>💰 Issue full or partial refunds</li>
          <li>📧 Send customer notifications</li>
          <li>📄 Print invoices and packing slips</li>
          <li>🔍 Filter by status, vendor, date range</li>
        </ul>
      </div>

      {/* More sections continue... */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">💡 Pro Tip</h3>
        <p className="text-sm text-blue-800">
          Check the Admin Guide, Vendor Guide, and Permissions tabs for complete documentation on all 16 admin pages!
        </p>
      </div>
    </div>
  );
}

// OLD VENDOR GUIDE - TO BE REMOVED
function OLD_VendorGuide_REMOVE_ME() {
  return (
    <div className="hidden">
      {/* Subscription Plans */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-[#B4770E]" /> Subscription Plans
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="border-2 border-gray-300 rounded-lg p-4">
            <div className="text-lg font-medium text-gray-900 mb-1">Starter</div>
            <div className="text-2xl font-bold text-[#B4770E] mb-2">$29<span className="text-sm font-normal text-gray-600">/month</span></div>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ 50 products max</li>
              <li>✓ 20% commission</li>
              <li>✓ Basic analytics</li>
              <li>✓ Email support</li>
            </ul>
          </div>

          <div className="border-2 border-purple-500 rounded-lg p-4 bg-purple-50">
            <div className="text-lg font-medium text-gray-900 mb-1">Growth</div>
            <div className="text-2xl font-bold text-purple-600 mb-2">$79<span className="text-sm font-normal text-gray-600">/month</span></div>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ 250 products max</li>
              <li>✓ 15% commission</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Priority support</li>
            </ul>
          </div>

          <div className="border-2 border-[#B4770E] rounded-lg p-4 bg-[#B4770E]/5">
            <div className="text-lg font-medium text-gray-900 mb-1">Professional</div>
            <div className="text-2xl font-bold text-[#B4770E] mb-2">$149<span className="text-sm font-normal text-gray-600">/month</span></div>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>✓ 1,000 products max</li>
              <li>✓ 12% commission</li>
              <li>✓ Full analytics suite</li>
              <li>✓ Dedicated support</li>
            </ul>
          </div>

          <div className="border-2 border-black rounded-lg p-4 bg-gray-900 text-white">
            <div className="text-lg font-medium mb-1">Enterprise</div>
            <div className="text-2xl font-bold text-[#B4770E] mb-2">Custom</div>
            <ul className="text-sm space-y-1">
              <li>✓ Unlimited products</li>
              <li>✓ 8% commission</li>
              <li>✓ Custom features</li>
              <li>✓ White glove service</li>
            </ul>
          </div>
        </div>

        <AlertBox type="success" title="Commission Example">
          On a $100 product sale: Starter keeps $80, Growth keeps $85, Pro keeps $88, Enterprise keeps $92
        </AlertBox>
      </div>

      {/* Vendor Workflow */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">🔄 Vendor Workflow</h2>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="bg-[#B4770E] text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-medium">1</div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">Create Product</h3>
              <p className="text-sm text-gray-600">Upload product with images, pricing, and variants</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-yellow-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-medium">2</div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">Await Admin Approval</h3>
              <p className="text-sm text-gray-600">Admin reviews and approves your product listing</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-medium">3</div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">Product Goes Live</h3>
              <p className="text-sm text-gray-600">Product appears on website for customers to purchase</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-medium">4</div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">Receive Order</h3>
              <p className="text-sm text-gray-600">Customer places order, you receive notification</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-medium">5</div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">Ship Product</h3>
              <p className="text-sm text-gray-600">Package and ship within 24-48 hours, add tracking</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-[#B4770E] text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-medium">6</div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">Receive Payout</h3>
              <p className="text-sm text-gray-600">Monthly commission payout on 1st of month (min $50)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Tips */}
      <div className="bg-gradient-to-r from-green-50 to-transparent border-l-4 border-green-500 p-6 rounded-r-lg">
        <h2 className="text-xl font-medium text-green-900 mb-4">💡 Success Tips for Vendors</h2>
        <div className="space-y-2 text-sm text-green-800">
          <div>📸 <strong>Professional Photography:</strong> High-quality images increase sales by 40%</div>
          <div>📝 <strong>Detailed Descriptions:</strong> Write 300+ words explaining features, materials, sizing</div>
          <div>⚡ <strong>Fast Shipping:</strong> Ship within 24-48 hours for best customer satisfaction</div>
          <div>⭐ <strong>Maintain 4.5+ Rating:</strong> Respond to all reviews within 24 hours</div>
          <div>📊 <strong>Check Analytics Weekly:</strong> Monitor performance and adjust strategies</div>
          <div>🎥 <strong>Upload Product Videos:</strong> Videos increase conversion by 80%</div>
        </div>
      </div>
    </div>
  );
}

// Permissions Guide Component
function PermissionsGuide() {
  return (
    <div className="prose prose-sm max-w-none">
      <h1 className="text-4xl font-light tracking-wider text-gray-900 mb-2">🔐 Permissions Guide</h1>
      <p className="text-gray-600 mb-8">Complete breakdown of admin vs vendor access</p>

      <AlertBox type="info" title="Access Overview">
        <div className="space-y-1">
          <div><strong>Admin:</strong> 100% access (16 pages, full control)</div>
          <div><strong>Vendor:</strong> 60% access (8 pages, limited scope)</div>
        </div>
      </AlertBox>

      {/* Permissions Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-3 font-medium text-gray-900">Feature</th>
              <th className="text-center p-3 font-medium text-gray-900">Admin</th>
              <th className="text-center p-3 font-medium text-gray-900">Vendor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="p-3">Dashboard</td>
              <td className="text-center p-3">
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Full Access</span>
              </td>
              <td className="text-center p-3">
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Own Data</span>
              </td>
            </tr>
            <tr>
              <td className="p-3">Products</td>
              <td className="text-center p-3">
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">All Vendors</span>
              </td>
              <td className="text-center p-3">
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Own Only</span>
              </td>
            </tr>
            <tr>
              <td className="p-3">Orders</td>
              <td className="text-center p-3">
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">All Orders</span>
              </td>
              <td className="text-center p-3">
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Own Orders</span>
              </td>
            </tr>
            <tr>
              <td className="p-3">Customers</td>
              <td className="text-center p-3">
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Full Access</span>
              </td>
              <td className="text-center p-3">
                <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-xs">No Access</span>
              </td>
            </tr>
            <tr>
              <td className="p-3">Vendors</td>
              <td className="text-center p-3">
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Full Management</span>
              </td>
              <td className="text-center p-3">
                <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-xs">No Access</span>
              </td>
            </tr>
            <tr>
              <td className="p-3">Categories</td>
              <td className="text-center p-3">
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Full Control</span>
              </td>
              <td className="text-center p-3">
                <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Read-Only</span>
              </td>
            </tr>
            <tr>
              <td className="p-3">Analytics</td>
              <td className="text-center p-3">
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Site-Wide</span>
              </td>
              <td className="text-center p-3">
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Own Data</span>
              </td>
            </tr>
            <tr>
              <td className="p-3">Content Management</td>
              <td className="text-center p-3">
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Full Editing</span>
              </td>
              <td className="text-center p-3">
                <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-xs">No Access</span>
              </td>
            </tr>
            <tr>
              <td className="p-3">Videos</td>
              <td className="text-center p-3">
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">All Videos</span>
              </td>
              <td className="text-center p-3">
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Own Videos</span>
              </td>
            </tr>
            <tr>
              <td className="p-3">Reviews</td>
              <td className="text-center p-3">
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Moderate All</span>
              </td>
              <td className="text-center p-3">
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Respond Only</span>
              </td>
            </tr>
            <tr>
              <td className="p-3">Wishlist Analytics</td>
              <td className="text-center p-3">
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Full Access</span>
              </td>
              <td className="text-center p-3">
                <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-xs">No Access</span>
              </td>
            </tr>
            <tr>
              <td className="p-3">Badge Management</td>
              <td className="text-center p-3">
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Create/Manage</span>
              </td>
              <td className="text-center p-3">
                <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">Auto-Apply</span>
              </td>
            </tr>
            <tr>
              <td className="p-3">Promotions</td>
              <td className="text-center p-3">
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Create All</span>
              </td>
              <td className="text-center p-3">
                <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-xs">No Access</span>
              </td>
            </tr>
            <tr>
              <td className="p-3">Site Configuration</td>
              <td className="text-center p-3">
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Full Control</span>
              </td>
              <td className="text-center p-3">
                <span className="inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-xs">No Access</span>
              </td>
            </tr>
            <tr>
              <td className="p-3">Subscription Plans</td>
              <td className="text-center p-3">
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Manage Plans</span>
              </td>
              <td className="text-center p-3">
                <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">View Own</span>
              </td>
            </tr>
            <tr>
              <td className="p-3">Settings</td>
              <td className="text-center p-3">
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Personal</span>
              </td>
              <td className="text-center p-3">
                <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Personal</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Page Access Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-[#B4770E]/10 to-white border-2 border-[#B4770E] rounded-lg p-5">
          <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#B4770E]" /> Admin Pages (16)
          </h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>✓ Dashboard</li>
            <li>✓ Products</li>
            <li>✓ Orders</li>
            <li>✓ Customers</li>
            <li>✓ Vendors</li>
            <li>✓ Categories</li>
            <li>✓ Analytics</li>
            <li>✓ Content</li>
            <li>✓ Videos</li>
            <li>✓ Reviews</li>
            <li>✓ Wishlist</li>
            <li>✓ Badges</li>
            <li>✓ Promotions</li>
            <li>✓ Configuration</li>
            <li>✓ Subscription Plans</li>
            <li>✓ Settings</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-500 rounded-lg p-5">
          <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" /> Vendor Pages (8)
          </h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>✓ Dashboard (own data)</li>
            <li>✓ Products (own only)</li>
            <li>✓ Orders (own only)</li>
            <li>✓ Analytics (own data)</li>
            <li>✓ Videos (own uploads)</li>
            <li>✓ Reviews (respond)</li>
            <li>✓ Subscription (view/upgrade)</li>
            <li>✓ Settings (personal)</li>
          </ul>
          <div className="mt-4 pt-4 border-t border-purple-200">
            <div className="text-xs text-gray-600">❌ No Access To:</div>
            <div className="text-xs text-gray-500 mt-1">Customers, Vendors, Categories (manage), Content, Wishlist, Badges (create), Promotions, Configuration</div>
          </div>
        </div>
      </div>
    </div>
  );
}