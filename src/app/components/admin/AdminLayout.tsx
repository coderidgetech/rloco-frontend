import { ReactNode, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Store,
  FolderTree,
  BarChart3,
  FileText,
  Tag,
  Sliders,
  ExternalLink,
  Home,
} from 'lucide-react';
import { cn } from '../ui/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout, hasPermission } = useAdmin();
  const { config } = useSiteConfig();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      permission: 'vendor' as const,
    },
    {
      label: 'Products',
      icon: Package,
      path: '/admin/products',
      permission: 'vendor' as const,
    },
    {
      label: 'Orders',
      icon: ShoppingCart,
      path: '/admin/orders',
      permission: 'vendor' as const,
    },
    {
      label: 'Categories',
      icon: FolderTree,
      path: '/admin/categories',
      permission: 'admin' as const,
    },
    {
      label: 'Customers',
      icon: Users,
      path: '/admin/customers',
      permission: 'admin' as const,
    },
    {
      label: 'Vendors',
      icon: Store,
      path: '/admin/vendors',
      permission: 'admin' as const,
    },
    {
      label: 'Analytics',
      icon: BarChart3,
      path: '/admin/analytics',
      permission: 'vendor' as const,
    },
    {
      label: 'Content',
      icon: FileText,
      path: '/admin/content',
      permission: 'admin' as const,
    },
    {
      label: 'Promotions',
      icon: Tag,
      path: '/admin/promotions',
      permission: 'admin' as const,
    },
    {
      label: 'Configuration',
      icon: Sliders,
      path: '/admin/configuration',
      permission: 'admin' as const,
    },
    {
      label: 'Settings',
      icon: Settings,
      path: '/admin/settings',
      permission: 'vendor' as const,
    },
  ];

  const filteredMenuItems = menuItems.filter(item =>
    hasPermission(item.permission)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 h-16">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-bold text-xl">{config.general.siteName} Admin</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Button
              className="text-white"
              style={{ backgroundColor: config.design.colors.primary }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = config.design.colors.primaryDark}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = config.design.colors.primary}
              size="sm"
              onClick={() => navigate('/')}
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Store
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      Role: {user?.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-40 flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                           (item.path === '/admin/vendors' && location.pathname.startsWith('/admin/vendors')) ||
                           (item.path === '/admin/configuration' && location.pathname.startsWith('/admin/subscription-plans'));

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        {/* Back to Store Button in Sidebar */}
        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={() => navigate('/')}
            className="w-full text-white"
            style={{ backgroundColor: config.design.colors.primary }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = config.design.colors.primaryDark}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = config.design.colors.primary}
            size="sm"
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Store
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          'pt-16 transition-all duration-300',
          sidebarOpen ? 'lg:pl-64' : 'pl-0'
        )}
      >
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
