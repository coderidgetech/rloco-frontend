import { ReactNode, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { RlocoLogo } from '../RlocoLogo';
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
  Tag,
  Sliders,
  Home,
  Building2,
} from 'lucide-react';
import { cn } from '../ui/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, logout, hasPermission } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems: Array<{
    label: string;
    icon: typeof LayoutDashboard;
    path: string;
    permission: 'admin' | 'vendor';
    vendorOnly?: boolean;
  }> = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      permission: 'vendor',
    },
    {
      label: 'Products',
      icon: Package,
      path: '/admin/products',
      permission: 'vendor',
    },
    {
      label: 'Orders',
      icon: ShoppingCart,
      path: '/admin/orders',
      permission: 'vendor',
    },
    {
      label: 'My store',
      icon: Building2,
      path: '/admin/vendor-settings',
      permission: 'vendor',
      vendorOnly: true,
    },
    {
      label: 'Categories',
      icon: FolderTree,
      path: '/admin/categories',
      permission: 'admin',
    },
    {
      label: 'Customers',
      icon: Users,
      path: '/admin/customers',
      permission: 'admin',
    },
    {
      label: 'Vendors',
      icon: Store,
      path: '/admin/vendors',
      permission: 'admin',
    },
    {
      label: 'Analytics',
      icon: BarChart3,
      path: '/admin/analytics',
      permission: 'vendor',
    },
    {
      label: 'Promotions',
      icon: Tag,
      path: '/admin/promotions',
      permission: 'admin',
    },
    {
      label: 'Configuration',
      icon: Sliders,
      path: '/admin/configuration',
      permission: 'admin',
    },
    {
      label: 'Settings',
      icon: Settings,
      path: '/admin/settings',
      permission: 'vendor',
    },
  ];

  const filteredMenuItems = menuItems.filter((item) => {
    if (!hasPermission(item.permission)) return false;
    if (item.vendorOnly && user?.role !== 'vendor') return false;
    return true;
  });

  return (
    <div className="min-h-screen w-full min-w-0 bg-gray-50">
      <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 h-[56px]">
        <div className="flex items-center justify-between h-full px-3 md:px-4">
          <div className="flex items-center gap-2 md:gap-4 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1 h-8 w-8 shrink-0"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link to="/admin/dashboard" className="flex items-center gap-1 md:gap-2 min-w-0">
              <div className="w-20 md:w-24 shrink-0">
                <RlocoLogo size="sm" className="justify-start" />
              </div>
              <span className="font-bold text-xs md:text-sm text-gray-600 ml-1 truncate">
                {user?.role === 'admin' ? 'Admin' : 'Vendor'}
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 md:h-10 md:w-10 rounded-full p-0">
                  <Avatar className="h-8 w-8 md:h-10 md:w-10">
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
                    <p className="text-xs text-gray-500 capitalize">Role: {user?.role}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/')}>
                  <Home className="mr-2 h-4 w-4" />
                  Back to store
                </DropdownMenuItem>
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

      <aside
        className={cn(
          'fixed left-0 top-[56px] bottom-0 w-64 bg-white border-r border-gray-200 transition-transform duration-300 z-40 flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <nav className="p-2 md:p-4 space-y-1 flex-1 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path === '/admin/vendors' && location.pathname.startsWith('/admin/vendors')) ||
              (item.path === '/admin/configuration' && location.pathname.startsWith('/admin/subscription-plans'));

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg transition-colors text-sm md:text-base',
                  isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-2 md:p-4 border-t border-gray-200">
          <Button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-lg transition-colors text-sm md:text-base bg-red-50 text-red-600 hover:bg-red-100"
          >
            <LogOut className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
            <span className="font-medium">Logout</span>
          </Button>
        </div>
      </aside>

      <main className={cn('min-h-screen w-full min-w-0 pt-[56px] transition-all duration-300 lg:pl-64')}>
        <div className="p-3 md:p-4 lg:p-6">{children}</div>
      </main>

      {sidebarOpen && (
        <div
          className="fixed left-0 right-0 bottom-0 bg-black/50 z-30 lg:hidden top-[56px]"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}
    </div>
  );
};
