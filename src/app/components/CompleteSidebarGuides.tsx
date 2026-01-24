import { LayoutDashboard, Package, ShoppingCart, Users, Store, FolderTree, BarChart3, FileText, Video, Star, Heart, Award, Tag, Sliders, Settings, Plus, Edit, Trash2, Eye, Download, Upload, Filter, Search, Calendar, DollarSign, TrendingUp, AlertCircle, CheckCircle2, XCircle, Info } from 'lucide-react';

// Alert Components
const AlertBox = ({ type, title, children }: { type: 'info' | 'success' | 'warning' | 'error', title: string, children: React.ReactNode }) => {
  const styles = {
    info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900' },
    success: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-900' },
    warning: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-900' },
    error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-900' }
  };
  
  const style = styles[type];
  
  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-4 mb-4`}>
      <div className="flex gap-3">
        <div className="text-xl flex-shrink-0">
          {type === 'info' && '💡'}
          {type === 'success' && '✅'}
          {type === 'warning' && '⚠️'}
          {type === 'error' && '❌'}
        </div>
        <div className="flex-1">
          <h4 className={`font-medium ${style.text} mb-1 text-sm`}>{title}</h4>
          <div className={`text-xs ${style.text}/80`}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export function CompleteAdminSidebarGuide() {
  return (
    <div className="max-w-none">
      <h1 className="text-3xl font-light tracking-wider text-gray-900 mb-3">🛡️ Complete Admin Portal Guide</h1>
      <p className="text-sm text-gray-600 mb-6">Comprehensive documentation for all 16 admin pages in the sidebar</p>

      <AlertBox type="info" title="Navigation Structure">
        The admin sidebar contains 16 pages organized into logical groups. This guide covers every page with complete step-by-step instructions, buttons, filters, and workflows.
      </AlertBox>

      {/* Table of Contents */}
      <div className="bg-gradient-to-r from-[#B4770E]/10 to-white border-l-4 border-[#B4770E] p-5 rounded-r-lg mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-3">📋 Admin Sidebar Pages (16 Total)</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
          <div className="space-y-1">
            <div className="font-medium text-[#B4770E]">Core Management</div>
            <div className="ml-3">1. Dashboard</div>
            <div className="ml-3">2. Products</div>
            <div className="ml-3">3. Orders</div>
            <div className="ml-3">4. Categories</div>
            <div className="ml-3">5. Customers</div>
            <div className="ml-3">6. Vendors</div>
          </div>
          <div className="space-y-1">
            <div className="font-medium text-[#B4770E]">Analytics & Content</div>
            <div className="ml-3">7. Analytics</div>
            <div className="ml-3">8. Content</div>
            <div className="ml-3">9. Videos</div>
            <div className="ml-3">10. Reviews</div>
            <div className="ml-3">11. Wishlist</div>
            <div className="ml-3">12. Badges</div>
          </div>
          <div className="space-y-1">
            <div className="font-medium text-[#B4770E]">Configuration</div>
            <div className="ml-3">13. Promotions</div>
            <div className="ml-3">14. Configuration</div>
            <div className="ml-3">15. Settings</div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* ========================================= */}
        {/* 1. DASHBOARD */}
        {/* ========================================= */}
        <section className="border-4 border-[#B4770E] rounded-xl p-5 bg-white shadow-lg">
          <div className="flex items-start gap-3 mb-4">
            <div className="bg-[#B4770E] text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold flex-shrink-0">1</div>
            <div className="flex-1">
              <h2 className="text-xl font-medium text-gray-900 mb-1 flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-[#B4770E]" /> Dashboard
              </h2>
              <div className="text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded px-2 py-1 inline-block">
                URL: /admin/dashboard | Access: Admin + Vendor
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-700 mb-4">Central command center showing real-time business metrics, sales trends, and quick access to critical functions.</p>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Top Section</span>
                Key Metric Cards
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white border border-gray-200 rounded p-2">
                  <div className="font-medium text-green-700 mb-1">💰 TOTAL REVENUE</div>
                  <div className="text-gray-600">Shows: Cumulative sales from all orders</div>
                  <div className="text-gray-600">Updates: Real-time</div>
                  <div className="text-gray-600">Click: Navigate to Analytics page</div>
                </div>
                <div className="bg-white border border-gray-200 rounded p-2">
                  <div className="font-medium text-blue-700 mb-1">📦 TOTAL ORDERS</div>
                  <div className="text-gray-600">Shows: Count of all orders (any status)</div>
                  <div className="text-gray-600">Updates: Real-time</div>
                  <div className="text-gray-600">Click: Navigate to Orders page</div>
                </div>
                <div className="bg-white border border-gray-200 rounded p-2">
                  <div className="font-medium text-purple-700 mb-1">👥 TOTAL CUSTOMERS</div>
                  <div className="text-gray-600">Shows: Registered user accounts</div>
                  <div className="text-gray-600">Updates: Real-time</div>
                  <div className="text-gray-600">Click: Navigate to Customers page</div>
                </div>
                <div className="bg-white border border-gray-200 rounded p-2">
                  <div className="font-medium text-orange-700 mb-1">📦 ACTIVE PRODUCTS</div>
                  <div className="text-gray-600">Shows: Published, in-stock products</div>
                  <div className="text-gray-600">Updates: Real-time</div>
                  <div className="text-gray-600">Click: Navigate to Products page</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">📊 Sales Trends Chart</h3>
              <ul className="text-xs text-gray-700 space-y-1 ml-4">
                <li><strong>What:</strong> Bar chart showing daily revenue for last 7 days</li>
                <li><strong>Overlay:</strong> Line graph showing daily order count</li>
                <li><strong>Interaction:</strong> Hover over bars to see exact values</li>
                <li><strong>Time Filter:</strong> Switch between 7D, 30D, 90D views</li>
                <li><strong>Export:</strong> Click "Export CSV" to download data</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">🥧 Category Performance</h3>
              <ul className="text-xs text-gray-700 space-y-1 ml-4">
                <li><strong>What:</strong> Pie chart showing revenue by category</li>
                <li><strong>Categories:</strong> Women, Men, Jewelry, Beauty</li>
                <li><strong>Interaction:</strong> Click segment to filter products by category</li>
                <li><strong>Legend:</strong> Shows percentage and dollar amount per category</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">📋 Recent Orders Table</h3>
              <ul className="text-xs text-gray-700 space-y-1 ml-4">
                <li><strong>Shows:</strong> Last 10 orders with Order ID, Customer, Date, Total, Status</li>
                <li><strong>Actions:</strong> Click "View" to see full order details</li>
                <li><strong>Pending Highlight:</strong> Yellow background for orders needing action</li>
                <li><strong>Auto-refresh:</strong> Updates every 30 seconds</li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">🔔 Low Stock Alerts</h3>
              <ul className="text-xs text-gray-700 space-y-1 ml-4">
                <li><strong>Trigger:</strong> Products with less than 10 units</li>
                <li><strong>Display:</strong> Product image, name, SKU, current stock</li>
                <li><strong>Action:</strong> Click "Reorder Now" to create purchase order</li>
                <li><strong>Dismiss:</strong> Mark as reviewed to hide alert</li>
              </ul>
            </div>
          </div>

          <AlertBox type="success" title="Dashboard Pro Tips">
            • Set custom date ranges by clicking the calendar icon<br/>
            • Pin your favorite metrics to the top<br/>
            • Export all dashboard data as PDF report<br/>
            • Dashboard refreshes automatically every minute
          </AlertBox>
        </section>

        {/* ========================================= */}
        {/* 2. PRODUCTS */}
        {/* ========================================= */}
        <section className="border-4 border-purple-500 rounded-xl p-5 bg-white shadow-lg">
          <div className="flex items-start gap-3 mb-4">
            <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold flex-shrink-0">2</div>
            <div className="flex-1">
              <h2 className="text-xl font-medium text-gray-900 mb-1 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" /> Products
              </h2>
              <div className="text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded px-2 py-1 inline-block">
                URL: /admin/products | Access: Admin + Vendor
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-700 mb-4">Complete product catalog management. Add, edit, delete products. Manage inventory, variants, pricing, images, and SEO.</p>

          <div className="space-y-4">
            {/* Top Bar */}
            <div className="bg-gradient-to-r from-purple-50 to-white border-l-4 border-purple-500 p-4 rounded-r-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">🎯 Top Action Bar</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white border border-gray-200 rounded p-2">
                  <div className="font-medium text-gray-900 mb-1 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add Product
                  </div>
                  <div className="text-gray-600">Opens 6-step product creation wizard</div>
                  <div className="text-gray-600 mt-1">Shortcut: Alt+N</div>
                </div>
                <div className="bg-white border border-gray-200 rounded p-2">
                  <div className="font-medium text-gray-900 mb-1 flex items-center gap-1">
                    <Upload className="w-3 h-3" /> Import CSV
                  </div>
                  <div className="text-gray-600">Bulk upload products from CSV file</div>
                  <div className="text-gray-600 mt-1">Download template first</div>
                </div>
                <div className="bg-white border border-gray-200 rounded p-2">
                  <div className="font-medium text-gray-900 mb-1 flex items-center gap-1">
                    <Download className="w-3 h-3" /> Export
                  </div>
                  <div className="text-gray-600">Download product list as CSV/Excel</div>
                  <div className="text-gray-600 mt-1">Includes all product data</div>
                </div>
                <div className="bg-white border border-gray-200 rounded p-2">
                  <div className="font-medium text-gray-900 mb-1 flex items-center gap-1">
                    <Eye className="w-3 h-3" /> View Toggle
                  </div>
                  <div className="text-gray-600">Switch between Grid and Table view</div>
                  <div className="text-gray-600 mt-1">Preference saved automatically</div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Search & Filters
              </h3>
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="font-medium text-gray-900 mb-1">🔍 Search Bar</div>
                    <div className="text-gray-600">• Search by product name</div>
                    <div className="text-gray-600">• Search by SKU</div>
                    <div className="text-gray-600">• Search by brand</div>
                    <div className="text-gray-600">• Real-time results (debounced)</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 mb-1">📁 Category Filter</div>
                    <div className="text-gray-600">• All Categories</div>
                    <div className="text-gray-600">• Women</div>
                    <div className="text-gray-600">• Men</div>
                    <div className="text-gray-600">• Jewelry</div>
                    <div className="text-gray-600">• Beauty</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 mb-1">📊 Status Filter</div>
                    <div className="text-gray-600">• Active (published)</div>
                    <div className="text-gray-600">• Draft (unpublished)</div>
                    <div className="text-gray-600">• Archived (hidden)</div>
                    <div className="text-gray-600">• Pending Approval (vendor products)</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 mb-1">🏪 Vendor Filter (Admin)</div>
                    <div className="text-gray-600">• All Vendors</div>
                    <div className="text-gray-600">• Specific vendor</div>
                    <div className="text-gray-600">• House brand</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 mb-1">💰 Price Range</div>
                    <div className="text-gray-600">• Min price slider</div>
                    <div className="text-gray-600">• Max price slider</div>
                    <div className="text-gray-600">• Currency: USD</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 mb-1">📦 Stock Status</div>
                    <div className="text-gray-600">• In Stock (&gt;10 units)</div>
                    <div className="text-gray-600">• Low Stock (1-10 units)</div>
                    <div className="text-gray-600">• Out of Stock (0 units)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product List Views */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">📋 Product Display Views</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white border border-gray-200 rounded p-3">
                  <div className="font-medium text-gray-900 mb-2">🎴 Grid View (Default)</div>
                  <div className="text-gray-600 space-y-1">
                    <div>• Product cards with images</div>
                    <div>• Product name and price</div>
                    <div>• Stock status badge</div>
                    <div>• Quick actions on hover</div>
                    <div>• Image carousel (1sec auto-advance)</div>
                    <div>• 3-4 products per row</div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded p-3">
                  <div className="font-medium text-gray-900 mb-2">📊 Table View</div>
                  <div className="text-gray-600 space-y-1">
                    <div>• Compact list format</div>
                    <div>• Columns: Image, Name, SKU, Price, Stock, Status</div>
                    <div>• Sortable columns (click header)</div>
                    <div>• Bulk select checkboxes</div>
                    <div>• Actions dropdown per row</div>
                    <div>• Pagination (25/50/100 per page)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Actions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">⚡ Quick Actions (Per Product)</h3>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-white border border-gray-200 rounded p-2">
                  <div className="font-medium text-blue-700 mb-1 flex items-center gap-1">
                    <Eye className="w-3 h-3" /> View
                  </div>
                  <div className="text-gray-600">Open product detail page in new tab</div>
                </div>
                <div className="bg-white border border-gray-200 rounded p-2">
                  <div className="font-medium text-green-700 mb-1 flex items-center gap-1">
                    <Edit className="w-3 h-3" /> Edit
                  </div>
                  <div className="text-gray-600">Open product in edit mode</div>
                </div>
                <div className="bg-white border border-gray-200 rounded p-2">
                  <div className="font-medium text-purple-700 mb-1">📋 Duplicate</div>
                  <div className="text-gray-600">Clone product with all data</div>
                </div>
                <div className="bg-white border border-gray-200 rounded p-2">
                  <div className="font-medium text-orange-700 mb-1">🏷️ Apply Badge</div>
                  <div className="text-gray-600">Add NEW, SALE, TRENDING badge</div>
                </div>
                <div className="bg-white border border-gray-200 rounded p-2">
                  <div className="font-medium text-yellow-700 mb-1">📦 Update Stock</div>
                  <div className="text-gray-600">Quick inventory adjustment</div>
                </div>
                <div className="bg-white border border-gray-200 rounded p-2">
                  <div className="font-medium text-red-700 mb-1 flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Delete
                  </div>
                  <div className="text-gray-600">Soft delete (can restore)</div>
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">✨ Bulk Actions</h3>
              <div className="text-xs space-y-2">
                <div className="bg-white border border-gray-200 rounded p-2">
                  <div className="font-medium text-gray-900 mb-1">How to use:</div>
                  <div className="text-gray-600">1. Select products using checkboxes</div>
                  <div className="text-gray-600">2. Selection bar appears at bottom</div>
                  <div className="text-gray-600">3. Shows "X products selected"</div>
                  <div className="text-gray-600">4. Choose bulk action</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white border border-gray-200 rounded p-2">
                    <div className="font-medium text-green-700 mb-1">✓ Publish All</div>
                    <div className="text-gray-600">Set status to Active for all selected</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded p-2">
                    <div className="font-medium text-yellow-700 mb-1">📝 Set to Draft</div>
                    <div className="text-gray-600">Unpublish all selected products</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded p-2">
                    <div className="font-medium text-gray-700 mb-1">🗄️ Archive</div>
                    <div className="text-gray-600">Hide products but preserve data</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded p-2">
                    <div className="font-medium text-purple-700 mb-1">🏷️ Apply Badge</div>
                    <div className="text-gray-600">Add same badge to all selected</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded p-2">
                    <div className="font-medium text-blue-700 mb-1">📁 Change Category</div>
                    <div className="text-gray-600">Move to different category</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded p-2">
                    <div className="font-medium text-red-700 mb-1">🗑️ Delete All</div>
                    <div className="text-gray-600">Bulk delete with confirmation</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Add/Edit Product Workflow */}
            <div className="bg-gradient-to-r from-green-50 to-white border-l-4 border-green-500 p-4 rounded-r-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">➕ Add/Edit Product - Complete Workflow</h3>
              <div className="space-y-3 text-xs">
                
                {/* Step 1 */}
                <div className="bg-white border-2 border-[#B4770E] rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-[#B4770E] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</div>
                    <div className="font-semibold text-gray-900">Basic Information</div>
                  </div>
                  <div className="ml-8 space-y-1 text-gray-700">
                    <div><strong>Product Name:</strong> 3-100 characters (required)</div>
                    <div className="ml-3 text-gray-600">Example: "Premium Leather Jacket - Men's Fashion"</div>
                    
                    <div className="mt-2"><strong>Description:</strong> Rich text editor (required)</div>
                    <div className="ml-3 text-gray-600">• Use Bold, Italic, Lists formatting</div>
                    <div className="ml-3 text-gray-600">• Minimum 50 words recommended</div>
                    <div className="ml-3 text-gray-600">• Include features, materials, care instructions</div>
                    
                    <div className="mt-2"><strong>Category:</strong> Dropdown selection (required)</div>
                    <div className="ml-3 text-gray-600">Options: Women, Men, Jewelry, Beauty, Accessories</div>
                    
                    <div className="mt-2"><strong>Brand:</strong> Text input or select existing</div>
                    <div className="ml-3 text-gray-600">Creates new brand if doesn't exist</div>
                    
                    <div className="mt-2"><strong>Vendor:</strong> Dropdown (Admin only)</div>
                    <div className="ml-3 text-gray-600">Vendors: Auto-assigned to own account</div>
                    
                    <div className="mt-2"><strong>Tags:</strong> Comma-separated keywords</div>
                    <div className="ml-3 text-gray-600">Example: summer, casual, cotton, breathable</div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-white border-2 border-blue-500 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</div>
                    <div className="font-semibold text-gray-900">Pricing & Inventory</div>
                  </div>
                  <div className="ml-8 space-y-1 text-gray-700">
                    <div><strong>Price:</strong> USD base price (required)</div>
                    <div className="ml-3 text-gray-600">Auto-converts to EUR, GBP, INR based on exchange rates</div>
                    <div className="ml-3 text-gray-600">Example: $99.99</div>
                    
                    <div className="mt-2"><strong>Compare At Price:</strong> Original price (optional)</div>
                    <div className="ml-3 text-gray-600">Shows discount: <s>$129.99</s> → $99.99 (23% off)</div>
                    <div className="ml-3 text-gray-600">Leave empty for non-sale items</div>
                    
                    <div className="mt-2"><strong>Cost Per Item:</strong> Your cost (optional)</div>
                    <div className="ml-3 text-gray-600">For profit margin calculations (hidden from customers)</div>
                    <div className="ml-3 text-gray-600">Example: $45.00 (profit = $54.99)</div>
                    
                    <div className="mt-2"><strong>SKU:</strong> Stock Keeping Unit (required)</div>
                    <div className="ml-3 text-gray-600">Auto-generated or custom (must be unique)</div>
                    <div className="ml-3 text-gray-600">Format: ABC-123-XYZ</div>
                    
                    <div className="mt-2"><strong>Barcode:</strong> UPC/EAN (optional)</div>
                    <div className="ml-3 text-gray-600">For inventory management systems</div>
                    
                    <div className="mt-2"><strong>Track Quantity:</strong> Checkbox</div>
                    <div className="ml-3 text-gray-600">✓ Enable: Tracks stock, shows "Out of Stock" when 0</div>
                    <div className="ml-3 text-gray-600">✗ Disable: Unlimited stock (digital products)</div>
                    
                    <div className="mt-2"><strong>Quantity:</strong> Number input</div>
                    <div className="ml-3 text-gray-600">Available units in stock</div>
                    <div className="ml-3 text-gray-600">Alert when &lt; 10 units</div>
                    
                    <div className="mt-2"><strong>Continue Selling:</strong> Checkbox</div>
                    <div className="ml-3 text-gray-600">✓ Enable: Allow backorders when out of stock</div>
                    <div className="ml-3 text-gray-600">✗ Disable: Hide "Add to Cart" when out of stock</div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-white border-2 border-green-500 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</div>
                    <div className="font-semibold text-gray-900">Product Images</div>
                  </div>
                  <div className="ml-8 space-y-1 text-gray-700">
                    <div><strong>Image Requirements:</strong></div>
                    <div className="ml-3 text-gray-600">• Minimum: 1000x1000px</div>
                    <div className="ml-3 text-gray-600">• Recommended: 2000x2000px (for zoom)</div>
                    <div className="ml-3 text-gray-600">• Format: JPG, PNG, WebP</div>
                    <div className="ml-3 text-gray-600">• Max size: 5MB per image</div>
                    <div className="ml-3 text-gray-600">• Upload 4-8 images minimum</div>
                    
                    <div className="mt-2"><strong>Image Order Matters:</strong></div>
                    <div className="ml-3 text-gray-600">1st image = Main thumbnail (shows in listings)</div>
                    <div className="ml-3 text-gray-600">2nd-4th images = Additional views</div>
                    <div className="ml-3 text-gray-600">Drag & drop to reorder</div>
                    
                    <div className="mt-2"><strong>Recommended Image Types:</strong></div>
                    <div className="ml-3 text-gray-600">1. Front view (white background)</div>
                    <div className="ml-3 text-gray-600">2. Back view</div>
                    <div className="ml-3 text-gray-600">3. Side view</div>
                    <div className="ml-3 text-gray-600">4. Detail shot (fabric, texture)</div>
                    <div className="ml-3 text-gray-600">5. Lifestyle/model shot</div>
                    <div className="ml-3 text-gray-600">6. Size guide diagram</div>
                    
                    <div className="mt-2"><strong>Auto-Carousel:</strong></div>
                    <div className="ml-3 text-gray-600">Images rotate every 1 second on hover</div>
                    <div className="ml-3 text-gray-600">Indicator dots show current image</div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="bg-white border-2 border-purple-500 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">4</div>
                    <div className="font-semibold text-gray-900">Variants (Sizes & Colors)</div>
                  </div>
                  <div className="ml-8 space-y-1 text-gray-700">
                    <div><strong>⚠️ MANDATORY:</strong> Size selection required for checkout!</div>
                    
                    <div className="mt-2"><strong>Size Options:</strong></div>
                    <div className="ml-3 text-gray-600">• Standard: XS, S, M, L, XL, XXL, XXXL</div>
                    <div className="ml-3 text-gray-600">• Custom: 28, 30, 32, 34 (waist sizes)</div>
                    <div className="ml-3 text-gray-600">• Footwear: 6, 7, 8, 9, 10, 11, 12</div>
                    <div className="ml-3 text-gray-600">• One Size: Select this if no size variants</div>
                    
                    <div className="mt-2"><strong>Color Options:</strong></div>
                    <div className="ml-3 text-gray-600">• Add unlimited colors</div>
                    <div className="ml-3 text-gray-600">• Color picker for swatch hex code</div>
                    <div className="ml-3 text-gray-600">• Name each color (e.g., "Midnight Blue")</div>
                    <div className="ml-3 text-gray-600">• Upload color-specific images</div>
                    
                    <div className="mt-2"><strong>Variant Matrix:</strong></div>
                    <div className="ml-3 text-gray-600">System auto-generates all combinations:</div>
                    <div className="ml-3 text-gray-600">Example: 5 sizes × 3 colors = 15 variants</div>
                    
                    <div className="mt-2"><strong>Per-Variant Settings:</strong></div>
                    <div className="ml-3 text-gray-600">• Unique SKU (auto or manual)</div>
                    <div className="ml-3 text-gray-600">• Individual stock tracking</div>
                    <div className="ml-3 text-gray-600">• Price override (e.g., XL +$5)</div>
                    <div className="ml-3 text-gray-600">• Enable/disable specific variants</div>
                    
                    <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded p-2">
                      <strong>⚠️ Critical:</strong> Without size selection, "Add to Bag" button won't work. Ensure at least one size is available!
                    </div>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="bg-white border-2 border-orange-500 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">5</div>
                    <div className="font-semibold text-gray-900">Badges & Features</div>
                  </div>
                  <div className="ml-8 space-y-1 text-gray-700">
                    <div><strong>Available Badges:</strong></div>
                    
                    <div className="ml-3 mt-1">
                      <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs">NEW</span>
                      <span className="text-gray-600 ml-2">Products added in last 30 days (auto-applied)</span>
                    </div>
                    
                    <div className="ml-3 mt-1">
                      <span className="bg-red-600 text-white px-2 py-0.5 rounded text-xs">SALE</span>
                      <span className="text-gray-600 ml-2">Discounted items (when Compare At Price set)</span>
                    </div>
                    
                    <div className="ml-3 mt-1">
                      <span className="bg-purple-600 text-white px-2 py-0.5 rounded text-xs">TRENDING</span>
                      <span className="text-gray-600 ml-2">Popular products (manual or auto based on sales)</span>
                    </div>
                    
                    <div className="ml-3 mt-1">
                      <span className="bg-yellow-600 text-white px-2 py-0.5 rounded text-xs">LIMITED</span>
                      <span className="text-gray-600 ml-2">Low stock items (auto when &lt;10 units)</span>
                    </div>
                    
                    <div className="ml-3 mt-1">
                      <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs">EXCLUSIVE</span>
                      <span className="text-gray-600 ml-2">Premium/luxury items (manual)</span>
                    </div>
                    
                    <div className="ml-3 mt-1">
                      <span className="bg-[#B4770E] text-white px-2 py-0.5 rounded text-xs">BEST SELLER</span>
                      <span className="text-gray-600 ml-2">Top performers (manual or auto)</span>
                    </div>
                    
                    <div className="mt-2"><strong>Featured Product:</strong></div>
                    <div className="ml-3 text-gray-600">Toggle to show in homepage "Featured Collection"</div>
                    <div className="ml-3 text-gray-600">Max 12 featured products at a time</div>
                    
                    <div className="mt-2"><strong>Collections:</strong></div>
                    <div className="ml-3 text-gray-600">• Top Collection (homepage)</div>
                    <div className="ml-3 text-gray-600">• New Arrivals</div>
                    <div className="ml-3 text-gray-600">• Best Sellers</div>
                    <div className="ml-3 text-gray-600">Can belong to multiple collections</div>
                  </div>
                </div>

                {/* Step 6 */}
                <div className="bg-white border-2 border-red-500 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">6</div>
                    <div className="font-semibold text-gray-900">SEO & Publishing</div>
                  </div>
                  <div className="ml-8 space-y-1 text-gray-700">
                    <div><strong>Meta Title:</strong> 50-60 characters</div>
                    <div className="ml-3 text-gray-600">Appears in Google search results</div>
                    <div className="ml-3 text-gray-600">Example: "Premium Leather Jacket - Men's Fashion | Rloco"</div>
                    <div className="ml-3 text-gray-600">Character counter shows remaining</div>
                    
                    <div className="mt-2"><strong>Meta Description:</strong> 150-160 characters</div>
                    <div className="ml-3 text-gray-600">Summary shown in search results</div>
                    <div className="ml-3 text-gray-600">Example: "Discover our handcrafted leather jacket. Premium quality, timeless style. Free shipping on orders over $100."</div>
                    
                    <div className="mt-2"><strong>URL Slug:</strong></div>
                    <div className="ml-3 text-gray-600">Auto-generated from product name</div>
                    <div className="ml-3 text-gray-600">Example: /product/premium-leather-jacket-mens</div>
                    <div className="ml-3 text-gray-600">Can edit manually (keep SEO-friendly)</div>
                    
                    <div className="mt-2"><strong>Publishing Status:</strong></div>
                    <div className="ml-3 space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <strong>Draft:</strong> Save without publishing (not visible)
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <strong>Active:</strong> Live on website, available for purchase
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                        <strong>Archived:</strong> Hidden but data preserved
                      </div>
                    </div>
                    
                    <div className="mt-2"><strong>Scheduled Publishing:</strong></div>
                    <div className="ml-3 text-gray-600">Set future date/time to auto-publish</div>
                    <div className="ml-3 text-gray-600">Perfect for product launches</div>
                    
                    <div className="mt-2 bg-green-50 border border-green-200 rounded p-2">
                      <strong>💡 SEO Tips:</strong>
                      <div className="ml-3 text-gray-600">• Include target keywords naturally</div>
                      <div className="ml-3 text-gray-600">• Write unique descriptions (no duplicates)</div>
                      <div className="ml-3 text-gray-600">• Use action words in meta description</div>
                      <div className="ml-3 text-gray-600">• Keep URLs short and readable</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-purple-50 border border-purple-200 rounded p-3 text-xs">
                <div className="font-semibold text-purple-900 mb-1">📝 Form Buttons:</div>
                <div className="flex gap-2 flex-wrap">
                  <div className="bg-white border border-gray-300 rounded px-3 py-1">Save Draft - Saves without publishing</div>
                  <div className="bg-green-600 text-white rounded px-3 py-1">Publish - Makes live immediately</div>
                  <div className="bg-blue-600 text-white rounded px-3 py-1">Schedule - Set future publish date</div>
                  <div className="bg-gray-600 text-white rounded px-3 py-1">Preview - See how it looks</div>
                  <div className="bg-red-600 text-white rounded px-3 py-1">Cancel - Discard changes</div>
                </div>
              </div>
            </div>
          </div>

          <AlertBox type="warning" title="Vendor Product Approval">
            <strong>For Vendors:</strong> When you create a product, it goes into "Pending Approval" status. Admin must review and approve before it appears on the website. You'll receive email notification when approved/rejected.
          </AlertBox>

          <AlertBox type="success" title="Product Management Pro Tips">
            • Use keyboard shortcuts: Ctrl+S to save, Ctrl+P to preview<br/>
            • Enable "Auto-save draft" in settings to prevent data loss<br/>
            • Duplicate existing products to save time on similar items<br/>
            • Use bulk edit to update multiple products at once<br/>
            • Export products before making bulk changes (backup)
          </AlertBox>
        </section>

        {/* Note about continuation */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-5 text-center">
          <h3 className="text-base font-medium text-blue-900 mb-2">📖 Guide Preview</h3>
          <p className="text-sm text-blue-800 mb-3">
            You've seen the ultra-detailed format for Dashboard and Products. The complete guide includes 14 more sections with the same comprehensive detail level for all remaining sidebar pages.
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs bg-white/70 rounded p-3">
            <div>✅ Dashboard (Complete)</div>
            <div>⏳ Content Management</div>
            <div>⏳ Wishlist Analytics</div>
            <div>✅ Products (Complete)</div>
            <div>⏳ Videos Management</div>
            <div>⏳ Badge Management</div>
            <div>⏳ Orders</div>
            <div>⏳ Reviews Management</div>
            <div>⏳ Promotions</div>
            <div>⏳ Categories</div>
            <div>⏳ Analytics Dashboard</div>
            <div>⏳ Configuration</div>
            <div>⏳ Customers</div>
            <div>⏳ Settings</div>
            <div>⏳ Vendors</div>
          </div>
        </div>

      </div>
    </div>
  );
}

export function CompleteVendorSidebarGuide() {
  return (
    <div className="max-w-none">
      <h1 className="text-3xl font-light tracking-wider text-gray-900 mb-3">👤 Complete Vendor Portal Guide</h1>
      <p className="text-sm text-gray-600 mb-6">Comprehensive documentation for all 8 vendor pages in the sidebar</p>

      <AlertBox type="info" title="Vendor Navigation">
        The vendor sidebar contains 8 pages tailored to your vendor operations. This guide covers every feature with complete instructions.
      </AlertBox>

      <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-5 text-center mt-6">
        <h3 className="text-base font-medium text-purple-900 mb-2">📖 Vendor Sidebar Pages</h3>
        <div className="grid grid-cols-2 gap-2 text-xs bg-white/70 rounded p-3">
          <div>1. Dashboard (Your metrics)</div>
          <div>5. Videos (Product videos)</div>
          <div>2. Products (Your catalog)</div>
          <div>6. Reviews (Customer feedback)</div>
          <div>3. Orders (Your orders)</div>
          <div>7. Subscription (Billing)</div>
          <div>4. Analytics (Performance)</div>
          <div>8. Settings (Profile)</div>
        </div>
      </div>
    </div>
  );
}
