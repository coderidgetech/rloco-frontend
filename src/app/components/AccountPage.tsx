import { motion, AnimatePresence } from 'motion/react';
import { 
  X, User, Package, MapPin, CreditCard, Heart, Settings, 
  LogOut, Edit2, Trash2, Plus, Check, Clock, Truck, 
  Mail, Phone, Calendar, ShieldCheck, Eye, ChevronRight,
  Download, Bell, Lock, ShoppingCart
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useWishlist } from '../context/WishlistContext';
import { OrderDetailsModal } from './OrderDetailsModal';
import { InvoiceModal } from './InvoiceModal';
import { LuxuryInput } from './ui/luxury-input';
import { LuxurySelect } from './ui/luxury-select';
import { LuxuryCheckbox } from './ui/luxury-checkbox';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import { addressService, Address as APIAddress } from '../services/addressService';
import { AddressAutocompleteInput } from './AddressAutocompleteInput';
import { Order as APIOrder, PaymentTransaction } from '../types/api';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import { authService } from '../services/authService';
import { PH } from '../lib/formPlaceholders';
import { isUnauthorizedApiError } from '../lib/apiErrors';

const SETTINGS_NOTIFICATIONS_KEY = 'rloco_notifications';

function loadSettingsNotifications(): { orders: boolean; offers: boolean; updates: boolean } {
  try {
    const raw = localStorage.getItem(SETTINGS_NOTIFICATIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { orders: !!parsed.orders, offers: !!parsed.offers, updates: !!parsed.updates };
    }
  } catch (_) {}
  return { orders: true, offers: true, updates: false };
}

interface AccountPageProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

type TabType = 'profile' | 'orders' | 'addresses' | 'payment' | 'wishlist' | 'settings';

interface Order {
  id: string;
  date: string;
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled';
  total: number;
  items: number;
  image: string;
  products?: {
    id: string;
    name: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  shippingAddress?: Address;
  trackingNumber?: string;
  estimatedDelivery?: string;
  subtotal?: number;
  shipping?: number;
  tax?: number;
}

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expiry: string;
  isDefault: boolean;
}


export function AccountPage({ isOpen, onClose, onLogout }: AccountPageProps) {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const { items: wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { logout, refreshUser } = useUser();
  const [settingsNotifications, setSettingsNotifications] = useState(loadSettingsNotifications);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [dangerLoading, setDangerLoading] = useState<'deactivate' | 'delete' | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [addAddressForm, setAddAddressForm] = useState({ addressLine: '', city: '', state: '', zip: '', country: '' });

  useEffect(() => {
    if (activeTab === 'settings') {
      localStorage.setItem(SETTINGS_NOTIFICATIONS_KEY, JSON.stringify(settingsNotifications));
    }
  }, [activeTab, settingsNotifications]);

  useEffect(() => {
    if (showAddAddress) {
      setAddAddressForm({ addressLine: '', city: '', state: '', zip: '', country: '' });
    }
  }, [showAddAddress]);

  // Check if this is being used as a standalone page (when path is /account)
  const isStandalone = location.pathname === '/account';

  const formatBirthdayForInput = (value: string | undefined): string => {
    if (!value) return '';
    const d = new Date(value);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  };

  const [profileData, setProfileData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    birthday: formatBirthdayForInput(user?.birthday),
  });

  // Update profile data when user changes (from API /auth/me)
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        birthday: formatBirthdayForInput(user.birthday),
      });
    }
  }, [user]);

  // Fetch addresses, orders and transactions from API
  useEffect(() => {
    if ((isOpen || isStandalone) && user) {
      fetchAddresses();
      fetchOrders();
      fetchTransactions();
    }
  }, [isOpen, isStandalone, user]);

  const fetchAddresses = async () => {
    if (!user) {
      setAddresses([]);
      return;
    }
    try {
      setAddressesLoading(true);
      const apiAddresses = await addressService.list();
      // Convert API addresses to local format
      const convertedAddresses: Address[] = apiAddresses.map((apiAddr: APIAddress) => ({
        id: apiAddr.id,
        type: apiAddr.type.toLowerCase() as 'home' | 'work' | 'other',
        name: apiAddr.name,
        address: apiAddr.address_line,
        city: apiAddr.city,
        state: apiAddr.state,
        zip: apiAddr.pincode,
        country: apiAddr.country,
        isDefault: apiAddr.is_default,
      }));
      setAddresses(convertedAddresses);
    } catch (error: unknown) {
      if (!isUnauthorizedApiError(error)) {
        console.error('Failed to fetch addresses:', error);
        toast.error('Failed to load addresses');
      }
      setAddresses([]);
    } finally {
      setAddressesLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setTransactionsLoading(true);
      // Fetch transactions from orders (since we don't have a direct transactions list endpoint)
      const response = await orderService.list({ limit: 50 });
      // OrderService returns { orders: [], total: number }
      const apiOrders = (response as any).orders || [];
      
      // Extract transaction IDs from orders and fetch transaction details
      // Note: Since we don't have a direct transactions list endpoint, we'll show payment info from orders
      // For now, we'll create a simplified transaction list from order payment data
      const orderTransactions: PaymentTransaction[] = apiOrders
        .filter((order: APIOrder) => order.payment_status === 'paid' || order.payment_status === 'pending')
        .map((order: APIOrder) => ({
          id: order.id,
          order_id: order.id,
          user_id: order.user_id,
          amount: order.total,
          currency: 'INR',
          gateway:
            order.payment_method === 'card' ||
            order.payment_method === 'wallet' ||
            order.payment_method === 'upi'
              ? 'stripe'
              : 'cod',
          gateway_transaction_id: order.payment_intent_id || order.id,
          status: order.payment_status === 'paid' ? 'succeeded' as const : 
                  order.payment_status === 'pending' ? 'pending' as const : 'failed' as const,
          type: 'charge' as const,
          created_at: order.created_at,
          updated_at: order.updated_at,
        }));
      
      setTransactions(orderTransactions);
    } catch (error: unknown) {
      if (!isUnauthorizedApiError(error)) {
        console.error('Failed to fetch transactions:', error);
      }
      // Don't show error toast as this is optional data
    } finally {
      setTransactionsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await orderService.list({ limit: 50 });
      // OrderService returns { orders: [], total: number }
      const apiOrders = (response as any).orders || [];
      
      // Convert API orders to local format
      const convertedOrders: Order[] = apiOrders.map((apiOrder: APIOrder) => ({
        id: apiOrder.id,
        date: apiOrder.created_at,
        status: apiOrder.status as Order['status'],
        total: apiOrder.total,
        items: apiOrder.items.length,
        image: apiOrder.items[0]?.image || '',
        products: apiOrder.items.map(item => ({
          id: item.product_id,
          name: item.product_name,
          size: item.size,
          color: 'Unknown',
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
        shippingAddress: {
          id: '1',
          type: 'home',
          name: `${apiOrder.shipping_info.first_name} ${apiOrder.shipping_info.last_name}`,
          address: apiOrder.shipping_info.address,
          city: apiOrder.shipping_info.city,
          state: apiOrder.shipping_info.state,
          zip: apiOrder.shipping_info.zip_code,
          country: apiOrder.shipping_info.country,
          isDefault: false,
        },
        trackingNumber: apiOrder.tracking_number,
        subtotal: apiOrder.subtotal,
        shipping: apiOrder.shipping_cost,
        tax: apiOrder.tax,
      }));
      
      setOrders(convertedOrders);
    } catch (error: unknown) {
      if (!isUnauthorizedApiError(error)) {
        console.error('Failed to fetch orders:', error);
        toast.error('Failed to load orders');
      }
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const tabs = [
    { id: 'profile' as TabType, label: 'Profile', icon: User },
    { id: 'orders' as TabType, label: 'Orders', icon: Package },
    { id: 'addresses' as TabType, label: 'Addresses', icon: MapPin },
    { id: 'wishlist' as TabType, label: 'Wishlist', icon: Heart },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-500/10';
      case 'shipped':
        return 'text-blue-600 bg-blue-500/10';
      case 'processing':
        return 'text-primary bg-primary/10';
      case 'cancelled':
        return 'text-red-600 bg-red-500/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return <Check size={16} />;
      case 'shipped':
        return <Truck size={16} />;
      case 'processing':
        return <Clock size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  const handleSaveProfile = async () => {
    try {
      setProfileSaving(true);
      const fullName = [profileData.firstName, profileData.lastName].filter(Boolean).join(' ').trim();
      const emailTrim = profileData.email?.trim() ?? '';
      if (!fullName) {
        toast.error('Please enter your name');
        setProfileSaving(false);
        return;
      }
      if (!emailTrim) {
        toast.error('Please enter your email');
        setProfileSaving(false);
        return;
      }
      const updateData: { name: string; email: string; phone?: string; birthday?: string } = {
        name: fullName,
        email: emailTrim,
      };
      if (profileData.phone?.trim()) updateData.phone = profileData.phone.trim();
      if (profileData.birthday) updateData.birthday = profileData.birthday;
      await authService.updateProfile(updateData);
      await refreshUser();
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error?.response?.data?.error || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  // In standalone mode, always render (ignore isOpen)
  const shouldRender = isStandalone || isOpen;

  return (
    <>
    <AnimatePresence>
      {shouldRender && (
        <>
          {/* Backdrop - only show if not standalone */}
          {!isStandalone && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(60px)',
                WebkitBackdropFilter: 'blur(60px)',
              }}
              className="fixed inset-0 z-50"
              onClick={onClose}
            />
          )}

          {/* Account Modal/Page */}
          <motion.div
            initial={{ opacity: 0, scale: isStandalone ? 1 : 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: isStandalone ? 1 : 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={isStandalone ? "relative min-h-screen w-full min-w-0 bg-white dark:bg-background" : "fixed inset-0 z-50 overflow-hidden bg-white dark:bg-background"}
            style={{ backgroundColor: 'var(--background, #ffffff)' }}
            onClick={(e) => !isStandalone && e.stopPropagation()}
          >
            <div className={`${isStandalone ? 'pt-20' : 'h-full'} bg-white dark:bg-background flex flex-col relative`} style={{ backgroundColor: 'var(--background, #ffffff)' }}>
              {/* Header */}
              <div className="border-b border-border bg-white dark:bg-background" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
                <div className="page-section py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <User size={32} className="text-primary" />
                      </div>
                      <div>
                        <h1 className="text-2xl md:text-3xl">My Account</h1>
                        <p className="text-sm text-muted-foreground">
                          {profileData.firstName} {profileData.lastName}
                        </p>
                      </div>
                    </div>
                    {!isStandalone && (
                      <button
                        onClick={onClose}
                        className="p-3 hover:bg-muted rounded-full transition-colors"
                      >
                        <X size={24} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto bg-white dark:bg-background" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
                <div className="page-section py-8">
                  <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-1">
                      <div className="bg-muted/30 rounded-xl p-4 space-y-2 sticky top-8">
                        {tabs.map((tab) => {
                          const Icon = tab.icon;
                          const count = tab.id === 'orders' ? orders.length : 
                                       tab.id === 'wishlist' ? wishlistItems.length : 
                                       tab.id === 'addresses' ? addresses.length :
                                       tab.id === 'payment' ? paymentMethods.length : null;
                          
                          return (
                            <motion.button
                              key={tab.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setActiveTab(tab.id)}
                              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                                activeTab === tab.id
                                  ? 'bg-primary text-primary-foreground'
                                  : 'hover:bg-muted'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <Icon size={20} />
                                <span className="font-medium">{tab.label}</span>
                              </div>
                              {count !== null && (
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  activeTab === tab.id
                                    ? 'bg-primary-foreground/20'
                                    : 'bg-muted'
                                }`}>
                                  {count}
                                </span>
                              )}
                            </motion.button>
                          );
                        })}

                        <div className="pt-4 border-t border-border">
                          <button
                            onClick={async () => {
                              await logout();
                              toast.success('Logged out successfully');
                              onClose();
                              if (onLogout) onLogout();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 hover:text-red-600 transition-colors"
                          >
                            <LogOut size={20} />
                            <span className="font-medium">Log Out</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                      <AnimatePresence mode="wait">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                          <motion.div
                            key="profile"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                          >
                            <div className="flex items-center justify-between mb-6">
                              <h2 className="text-2xl">Personal Information</h2>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSaveProfile}
                                disabled={profileSaving}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-60"
                              >
                                <Edit2 size={18} />
                                {profileSaving ? 'Saving...' : 'Save Profile'}
                              </motion.button>
                            </div>

                            <div className="bg-muted/30 rounded-xl p-6 space-y-6">
                              <div className="grid md:grid-cols-2 gap-6">
                                <LuxuryInput
                                  label="First name"
                                  type="text"
                                  value={profileData.firstName}
                                  onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                  placeholder={PH.firstName}
                                />

                                <LuxuryInput
                                  label="Last name"
                                  type="text"
                                  value={profileData.lastName}
                                  onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                  placeholder={PH.lastName}
                                />

                                <LuxuryInput
                                  label="Email address"
                                  type="email"
                                  value={profileData.email}
                                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                  placeholder={PH.email}
                                />

                                <LuxuryInput
                                  label="Phone number"
                                  type="tel"
                                  value={profileData.phone}
                                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                  placeholder={PH.phone}
                                  helperText="Include country code. Bare 10-digit local numbers are not accepted."
                                />

                                <LuxuryInput
                                  label="Birthday"
                                  type="date"
                                  value={profileData.birthday}
                                  onChange={(e) => setProfileData({ ...profileData, birthday: e.target.value })}
                                />
                              </div>
                            </div>

                            {/* Account Stats */}
                            <div className="grid md:grid-cols-3 gap-4">
                              <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-500/20">
                                <div className="flex items-center gap-3 mb-2">
                                  <Package size={24} className="text-blue-600" />
                                  <span className="text-3xl font-bold">{orders.length}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">Total Orders</p>
                              </div>

                              <div className="bg-purple-500/10 rounded-xl p-6 border border-purple-500/20">
                                <div className="flex items-center gap-3 mb-2">
                                  <Heart size={24} className="text-purple-600" />
                                  <span className="text-3xl font-bold">{wishlistItems.length}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">Wishlist Items</p>
                              </div>

                              <div className="bg-green-500/10 rounded-xl p-6 border border-green-500/20">
                                <div className="flex items-center gap-3 mb-2">
                                  <ShieldCheck size={24} className="text-green-600" />
                                  <span className="text-3xl font-bold">VIP</span>
                                </div>
                                <p className="text-sm text-muted-foreground">Member Status</p>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                          <motion.div
                            key="orders"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                          >
                            <div className="flex items-center justify-between mb-6">
                              <h2 className="text-2xl">Order History</h2>
                              <div className="text-sm text-muted-foreground">
                                {orders.length} orders
                              </div>
                            </div>

                            <div className="space-y-4">
                              {ordersLoading ? (
                                <div className="text-center py-12">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                                  <p className="mt-4 text-gray-600">Loading orders...</p>
                                </div>
                              ) : orders.length === 0 ? (
                                /* Empty State */
                                <div className="flex flex-col items-center justify-center text-center py-12 md:py-20">
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', damping: 15 }}
                                    className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted flex items-center justify-center mb-4 md:mb-6"
                                  >
                                    <Package size={48} className="md:hidden text-muted-foreground" />
                                    <Package size={64} className="hidden md:block text-muted-foreground" />
                                  </motion.div>
                                  <h2 className="text-xl md:text-2xl mb-2 md:mb-3">No orders yet</h2>
                                  <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 max-w-md px-4">
                                    You haven't placed any orders yet. Start shopping to see your order history here!
                                  </p>
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                      if (onClose) onClose();
                                      // Navigate to home or products page
                                      window.location.href = '/';
                                    }}
                                    className="px-6 md:px-8 py-3 md:py-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 text-sm md:text-base"
                                  >
                                    <ShoppingCart size={20} />
                                    Start Shopping
                                  </motion.button>
                                </div>
                              ) : (
                                orders.map((order) => (
                                <motion.div
                                  key={order.id}
                                  whileHover={{ scale: 1.01 }}
                                  className="bg-muted/30 rounded-xl p-6 hover:bg-muted/50 transition-colors cursor-pointer"
                                >
                                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                      <img
                                        src={order.image}
                                        alt="Order"
                                        className="w-full h-full object-cover"
                                        style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                                      />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                        <div>
                                          <h3 className="font-medium font-mono">#{order.id}</h3>
                                          <p className="text-sm text-muted-foreground">
                                            {new Date(order.date).toLocaleDateString('en-US', {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric'
                                            })}
                                          </p>
                                        </div>
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                          {getStatusIcon(order.status)}
                                          <span className="capitalize">{order.status}</span>
                                        </div>
                                      </div>

                                      <div className="flex flex-wrap items-center gap-4 text-sm">
                                        <span className="text-muted-foreground">
                                          {order.items} {order.items === 1 ? 'item' : 'items'}
                                        </span>
                                        <span className="font-medium">
                                          ${order.total.toFixed(2)}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedOrder(order)}
                                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 justify-center"
                                      >
                                        <Eye size={16} />
                                        View Details
                                      </motion.button>
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                          setInvoiceOrder(order);
                                          setShowInvoice(true);
                                        }}
                                        className="px-4 py-2 border border-border rounded-lg flex items-center gap-2 justify-center text-sm"
                                      >
                                        <Download size={16} />
                                        Invoice
                                      </motion.button>
                                    </div>
                                  </div>
                                </motion.div>
                              ))
                            )}
                            </div>
                          </motion.div>
                        )}

                        {/* Addresses Tab */}
                        {activeTab === 'addresses' && (
                          <motion.div
                            key="addresses"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                          >
                            <div className="flex items-center justify-between mb-6">
                              <h2 className="text-2xl">Saved Addresses</h2>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowAddAddress(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                              >
                                <Plus size={18} />
                                Add Address
                              </motion.button>
                            </div>

                            {addressesLoading ? (
                              <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                              </div>
                            ) : addresses.length === 0 ? (
                              /* Empty State */
                              <div className="flex flex-col items-center justify-center text-center py-12 md:py-20">
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: 'spring', damping: 15 }}
                                  className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted flex items-center justify-center mb-4 md:mb-6"
                                >
                                  <MapPin size={48} className="md:hidden text-muted-foreground" />
                                  <MapPin size={64} className="hidden md:block text-muted-foreground" />
                                </motion.div>
                                <h2 className="text-xl md:text-2xl mb-2 md:mb-3">No saved addresses</h2>
                                <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 max-w-md px-4">
                                  You haven't saved any addresses yet. Add your first address to make checkout faster!
                                </p>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setShowAddAddress(true)}
                                  className="px-6 md:px-8 py-3 md:py-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 text-sm md:text-base"
                                >
                                  <Plus size={20} />
                                  Add Your First Address
                                </motion.button>
                              </div>
                            ) : (
                              <div className="grid md:grid-cols-2 gap-4">
                                {addresses.map((address) => (
                                  <motion.div
                                    key={address.id}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-muted/30 rounded-xl p-6 relative"
                                  >
                                    {address.isDefault && (
                                      <div className="absolute top-4 right-4 px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                                        Default
                                      </div>
                                    )}

                                    <div className="flex items-center gap-3 mb-4">
                                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                        address.type === 'home' ? 'bg-blue-500/10' :
                                        address.type === 'work' ? 'bg-purple-500/10' :
                                        'bg-green-500/10'
                                      }`}>
                                        <MapPin size={24} className={
                                          address.type === 'home' ? 'text-blue-600' :
                                          address.type === 'work' ? 'text-purple-600' :
                                          'text-green-600'
                                        } />
                                      </div>
                                      <div>
                                        <h3 className="font-medium capitalize">{address.type}</h3>
                                        <p className="text-sm text-muted-foreground">{address.name}</p>
                                      </div>
                                    </div>

                                    <div className="text-sm text-muted-foreground space-y-1 mb-4">
                                      <p>{address.address}</p>
                                      <p>{address.city}, {address.state} {address.zip}</p>
                                      <p>{address.country}</p>
                                    </div>

                                    <div className="flex gap-2">
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                          toast.info('Edit your address in Saved Addresses');
                                          navigate('/addresses');
                                        }}
                                        className="flex-1 px-3 py-2 border border-border rounded-lg flex items-center justify-center gap-2 text-sm"
                                      >
                                        <Edit2 size={14} />
                                        Edit
                                      </motion.button>
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={async () => {
                                          try {
                                            await addressService.delete(address.id);
                                            toast.success('Address deleted successfully');
                                            fetchAddresses();
                                          } catch (error: any) {
                                            console.error('Failed to delete address:', error);
                                            toast.error('Failed to delete address');
                                          }
                                        }}
                                        className="px-3 py-2 border border-red-500/20 rounded-lg flex items-center justify-center gap-2 text-sm text-red-600 hover:bg-red-500/10"
                                      >
                                        <Trash2 size={14} />
                                      </motion.button>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}

                        {/* Payment Tab */}
                        {activeTab === 'payment' && (
                          <motion.div
                            key="payment"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                          >
                            <div className="flex items-center justify-between mb-6">
                              <h2 className="text-2xl">Payment Methods</h2>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowAddPayment(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                              >
                                <Plus size={18} />
                                Add Card
                              </motion.button>
                            </div>

                            {paymentMethods.length === 0 ? (
                              /* Empty State */
                              <div className="flex flex-col items-center justify-center text-center py-12 md:py-20">
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ type: 'spring', damping: 15 }}
                                  className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted flex items-center justify-center mb-4 md:mb-6"
                                >
                                  <CreditCard size={48} className="md:hidden text-muted-foreground" />
                                  <CreditCard size={64} className="hidden md:block text-muted-foreground" />
                                </motion.div>
                                <h2 className="text-xl md:text-2xl mb-2 md:mb-3">No payment methods</h2>
                                <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8 max-w-md px-4">
                                  You haven't added any payment methods yet. Add a card to make checkout faster!
                                </p>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setShowAddPayment(true)}
                                  className="px-6 md:px-8 py-3 md:py-4 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 text-sm md:text-base"
                                >
                                  <Plus size={20} />
                                  Add Your First Card
                                </motion.button>
                              </div>
                            ) : (
                              <>
                                <div className="space-y-4">
                                  {paymentMethods.map((card) => (
                                <motion.div
                                  key={card.id}
                                  whileHover={{ scale: 1.01 }}
                                  className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-6 border border-primary/20 relative"
                                >
                                  {card.isDefault && (
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                                      Default
                                    </div>
                                  )}

                                  <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-xl bg-background flex items-center justify-center">
                                      <CreditCard size={28} className="text-primary" />
                                    </div>
                                    <div>
                                      <h3 className="font-medium text-lg capitalize">{card.type}</h3>
                                      <p className="text-sm text-muted-foreground font-mono">•••• •••• •••• {card.last4}</p>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between">
                                    <div className="text-sm">
                                      <p className="text-muted-foreground mb-1">Expires</p>
                                      <p className="font-medium font-mono">{card.expiry}</p>
                                    </div>

                                    <div className="flex gap-2">
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-3 py-2 border border-border rounded-lg flex items-center justify-center gap-2 text-sm"
                                      >
                                        <Edit2 size={14} />
                                        Edit
                                      </motion.button>
                                      <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-3 py-2 border border-red-500/20 rounded-lg flex items-center justify-center gap-2 text-sm text-red-600 hover:bg-red-500/10"
                                      >
                                        <Trash2 size={14} />
                                      </motion.button>
                                    </div>
                                  </div>
                                  </motion.div>
                                  ))}
                                </div>

                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 flex items-start gap-3">
                                  <ShieldCheck size={24} className="text-blue-600 flex-shrink-0" />
                                  <div className="text-sm">
                                    <p className="font-medium text-blue-600 mb-1">Secure Payment Information</p>
                                    <p className="text-blue-600/80">
                                      Your payment information is encrypted and securely stored. We never share your card details.
                                    </p>
                                  </div>
                                </div>
                              </>
                            )}
                          </motion.div>
                        )}

                        {/* Wishlist Tab */}
                        {activeTab === 'wishlist' && (
                          <motion.div
                            key="wishlist"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                          >
                            <div className="flex items-center justify-between mb-6">
                              <h2 className="text-2xl">My Wishlist</h2>
                              <div className="text-sm text-muted-foreground">
                                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
                              </div>
                            </div>

                            {wishlistItems.length === 0 ? (
                              <div className="bg-muted/30 rounded-xl p-12 text-center">
                                <div className="w-24 h-24 rounded-full bg-muted mx-auto mb-6 flex items-center justify-center">
                                  <Heart size={48} className="text-muted-foreground" />
                                </div>
                                <h3 className="text-xl mb-2">Your wishlist is empty</h3>
                                <p className="text-muted-foreground mb-6">
                                  Save your favorite items to your wishlist
                                </p>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={onClose}
                                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg"
                                >
                                  Start Shopping
                                </motion.button>
                              </div>
                            ) : (
                              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {wishlistItems.map((item) => (
                                  <motion.div
                                    key={item.id}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-muted/30 rounded-xl overflow-hidden"
                                  >
                                    <div className="aspect-square bg-muted">
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                                      />
                                    </div>
                                    <div className="p-4">
                                      <h3 className="font-medium mb-1 truncate">{item.name}</h3>
                                      <p className="font-medium text-primary mb-3">${item.price}</p>
                                      <div className="flex gap-2">
                                        <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          onClick={async () => {
                                            try {
                                              await addToCart({
                                                product_id: String(item.id),
                                                product_name: item.name,
                                                image: item.image,
                                                price: item.price,
                                                size: 'M',
                                                quantity: 1,
                                              });
                                              toast.success('Added to cart!');
                                            } catch {
                                              toast.error('Failed to add to cart');
                                            }
                                          }}
                                          className="flex-1 px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 bg-primary text-primary-foreground"
                                        >
                                          Add to Bag
                                        </motion.button>
                                        <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          onClick={() => removeFromWishlist(item.id)}
                                          className="px-3 py-2 border border-border rounded-lg"
                                        >
                                          <Trash2 size={16} />
                                        </motion.button>
                                      </div>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                          <motion.div
                            key="settings"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                          >
                            <h2 className="text-2xl mb-6">Account Settings</h2>

                            {/* Notifications */}
                            <div className="bg-muted/30 rounded-xl p-6">
                              <div className="flex items-center gap-3 mb-4">
                                <Bell size={24} className="text-primary" />
                                <h3 className="font-medium">Notifications</h3>
                              </div>
                              <div className="space-y-4">
                                {[
                                  { key: 'orders' as const, label: 'Order updates', desc: 'Get notified about your orders' },
                                  { key: 'offers' as const, label: 'Offers & Promotions', desc: 'Get the latest deals' },
                                  { key: 'updates' as const, label: 'App updates', desc: 'New features & improvements' },
                                ].map((setting) => (
                                  <div key={setting.key} className="flex items-center justify-between">
                                    <div>
                                      <p className="font-medium">{setting.label}</p>
                                      <p className="text-sm text-muted-foreground">{setting.desc}</p>
                                    </div>
                                    <LuxuryCheckbox
                                      checked={settingsNotifications[setting.key]}
                                      onChange={() =>
                                        setSettingsNotifications((prev) => ({ ...prev, [setting.key]: !prev[setting.key] }))
                                      }
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Security */}
                            <div className="bg-muted/30 rounded-xl p-6">
                              <div className="flex items-center gap-3 mb-4">
                                <Lock size={24} className="text-primary" />
                                <h3 className="font-medium">Security</h3>
                              </div>
                              <div className="space-y-3">
                                <motion.button
                                  type="button"
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  onClick={() => navigate('/change-password')}
                                  className="w-full flex items-center justify-between p-4 bg-background rounded-lg hover:bg-muted transition-colors"
                                >
                                  <span className="font-medium">Change Password</span>
                                  <ChevronRight size={20} />
                                </motion.button>
                                <motion.button
                                  type="button"
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  onClick={() => navigate('/two-factor')}
                                  className="w-full flex items-center justify-between p-4 bg-background rounded-lg hover:bg-muted transition-colors"
                                >
                                  <span className="font-medium">Two-Factor Authentication</span>
                                  <ChevronRight size={20} />
                                </motion.button>
                              </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
                              <h3 className="font-medium text-red-600 mb-4">Danger Zone</h3>
                              <div className="space-y-3">
                                <motion.button
                                  type="button"
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  onClick={() => setShowDeactivateConfirm(true)}
                                  disabled={!!dangerLoading}
                                  className="w-full p-4 border border-red-500/20 rounded-lg text-red-600 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                >
                                  Deactivate Account
                                </motion.button>
                                <motion.button
                                  type="button"
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.99 }}
                                  onClick={() => setShowDeleteConfirm(true)}
                                  disabled={!!dangerLoading}
                                  className="w-full p-4 border border-red-500/20 rounded-lg text-red-600 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                >
                                  Delete Account
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

    {/* Order Details Modal */}
    <OrderDetailsModal 
      order={selectedOrder}
      isOpen={!!selectedOrder}
      onClose={() => setSelectedOrder(null)}
    />

    {/* Invoice Modal */}
    <InvoiceModal 
      order={invoiceOrder}
      isOpen={showInvoice}
      onClose={() => setShowInvoice(false)}
    />

    {/* Deactivate Account Confirmation */}
    <AnimatePresence>
      {showDeactivateConfirm && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/60" onClick={() => setShowDeactivateConfirm(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 z-[70] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-background p-6 shadow-xl">
            <h3 className="text-lg font-medium mb-2">Deactivate account?</h3>
            <p className="text-sm text-muted-foreground mb-4">You can contact support to reactivate later.</p>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowDeactivateConfirm(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-muted">Cancel</button>
              <button
                type="button"
                disabled={dangerLoading === 'deactivate'}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                onClick={async () => {
                  setDangerLoading('deactivate');
                  try {
                    await authService.deactivateAccount();
                    await logout();
                    onClose?.();
                    navigate('/');
                  } catch (err: unknown) {
                    const msg = err && typeof err === 'object' && 'response' in err && typeof (err as { response?: { data?: { error?: string } } }).response?.data?.error === 'string'
                      ? (err as { response: { data: { error: string } } }).response.data.error
                      : 'Failed to deactivate';
                    toast.error(msg);
                  } finally {
                    setDangerLoading(null);
                    setShowDeactivateConfirm(false);
                  }
                }}
              >
                {dangerLoading === 'deactivate' ? 'Deactivating...' : 'Deactivate'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

    {/* Delete Account Confirmation */}
    <AnimatePresence>
      {showDeleteConfirm && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] bg-black/60" onClick={() => setShowDeleteConfirm(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 z-[70] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-background p-6 shadow-xl">
            <h3 className="text-lg font-medium mb-2">Delete account permanently?</h3>
            <p className="text-sm text-muted-foreground mb-4">All your data will be removed. This cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 rounded-lg border border-border hover:bg-muted">Cancel</button>
              <button
                type="button"
                disabled={dangerLoading === 'delete'}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                onClick={async () => {
                  setDangerLoading('delete');
                  try {
                    await authService.deleteAccount();
                    await logout();
                    onClose?.();
                    navigate('/');
                  } catch (err: unknown) {
                    const msg = err && typeof err === 'object' && 'response' in err && typeof (err as { response?: { data?: { error?: string } } }).response?.data?.error === 'string'
                      ? (err as { response: { data: { error: string } } }).response.data.error
                      : 'Failed to delete account';
                    toast.error(msg);
                  } finally {
                    setDangerLoading(null);
                    setShowDeleteConfirm(false);
                  }
                }}
              >
                {dangerLoading === 'delete' ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

    {/* Add Address Modal */}
    <AnimatePresence>
      {showAddAddress && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(60px)',
              WebkitBackdropFilter: 'blur(60px)',
            }}
            className="fixed inset-0 z-[60]"
            onClick={() => setShowAddAddress(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-background rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">Add New Address</h2>
                <button
                  onClick={() => setShowAddAddress(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!addAddressForm.addressLine.trim()) {
                    toast.error('Please enter a street address');
                    return;
                  }
                  try {
                    const formData = new FormData(e.currentTarget);
                    const addressType = formData.get('type') as string;
                    const newAddress = {
                      type: addressType.toUpperCase() as 'HOME' | 'OFFICE' | 'OTHER',
                      name: formData.get('name') as string,
                      address_line: addAddressForm.addressLine.trim(),
                      city: addAddressForm.city.trim(),
                      state: addAddressForm.state.trim(),
                      pincode: addAddressForm.zip.trim(),
                      country: addAddressForm.country.trim(),
                      mobile: formData.get('mobile') as string || '',
                      is_default: formData.get('isDefault') === 'on',
                    };
                    await addressService.create(newAddress);
                    toast.success('Address added successfully!');
                    setShowAddAddress(false);
                    fetchAddresses();
                  } catch (error: any) {
                    console.error('Failed to add address:', error);
                    toast.error('Failed to add address');
                  }
                }}
                className="space-y-6"
              >
                <LuxurySelect
                  label="Address type"
                  name="type"
                  required
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </LuxurySelect>

                <LuxuryInput
                  label="Full name"
                  type="text"
                  name="name"
                  required
                  placeholder={PH.fullName}
                />

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Street address <span className="text-destructive">*</span>
                  </label>
                  <AddressAutocompleteInput
                    value={addAddressForm.addressLine}
                    onChange={(val) => setAddAddressForm((p) => ({ ...p, addressLine: val }))}
                    onAddressFill={(components) => {
                      setAddAddressForm((p) => ({
                        ...p,
                        addressLine: components.addressLine,
                        city: components.city || p.city,
                        state: components.state || p.state,
                        zip: components.pincode || p.zip,
                        country: components.country || p.country,
                      }));
                    }}
                    placeholder={PH.streetAddress}
                  />
                </div>

                <input type="hidden" name="address" value={addAddressForm.addressLine} />

                <div className="grid md:grid-cols-2 gap-4">
                  <LuxuryInput
                    label="City"
                    type="text"
                    name="city"
                    required
                    placeholder={PH.city}
                    value={addAddressForm.city}
                    onChange={(e) => setAddAddressForm((p) => ({ ...p, city: e.target.value }))}
                  />

                  <LuxuryInput
                    label="State"
                    type="text"
                    name="state"
                    required
                    placeholder={PH.state}
                    value={addAddressForm.state}
                    onChange={(e) => setAddAddressForm((p) => ({ ...p, state: e.target.value }))}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <LuxuryInput
                    label="ZIP code"
                    type="text"
                    name="zip"
                    required
                    placeholder={PH.zip}
                    value={addAddressForm.zip}
                    onChange={(e) => setAddAddressForm((p) => ({ ...p, zip: e.target.value }))}
                  />

                  <LuxuryInput
                    label="Country"
                    type="text"
                    name="country"
                    required
                    placeholder={PH.country}
                    value={addAddressForm.country}
                    onChange={(e) => setAddAddressForm((p) => ({ ...p, country: e.target.value }))}
                  />
                </div>

                <LuxuryCheckbox
                  name="isDefault"
                  id="isDefault"
                  label="Set as default address"
                />

                <div className="flex gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddAddress(false)}
                    className="flex-1 px-6 py-3 border border-border rounded-lg"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg"
                  >
                    Add Address
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>

    {/* Add Payment Method Modal */}
    <AnimatePresence>
      {showAddPayment && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(60px)',
              WebkitBackdropFilter: 'blur(60px)',
            }}
            className="fixed inset-0 z-[60]"
            onClick={() => setShowAddPayment(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-background rounded-2xl p-8 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">Add Payment Method</h2>
                <button
                  onClick={() => setShowAddPayment(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const cardNumber = formData.get('cardNumber') as string;
                  const newCard: PaymentMethod = {
                    id: String(paymentMethods.length + 1),
                    type: formData.get('type') as 'visa' | 'mastercard' | 'amex',
                    last4: cardNumber.slice(-4),
                    expiry: formData.get('expiry') as string,
                    isDefault: formData.get('isDefault') === 'on',
                  };
                  setPaymentMethods([...paymentMethods, newCard]);
                  setShowAddPayment(false);
                  toast.success('Payment method added successfully!');
                }}
                className="space-y-6"
              >
                <LuxurySelect
                  label="Card type"
                  name="type"
                  required
                >
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                  <option value="amex">American Express</option>
                </LuxurySelect>

                <LuxuryInput
                  label="Card number"
                  type="text"
                  name="cardNumber"
                  required
                  placeholder={PH.cardNumber}
                  maxLength={19}
                  className="font-mono"
                />

                <div className="grid grid-cols-2 gap-4">
                  <LuxuryInput
                    label="Expiry date"
                    type="text"
                    name="expiry"
                    required
                    placeholder={PH.cardExpiry}
                    maxLength={5}
                    className="font-mono"
                  />

                  <LuxuryInput
                    label="CVV"
                    type="text"
                    name="cvv"
                    required
                    placeholder={PH.cvv}
                    maxLength={4}
                    className="font-mono"
                  />
                </div>

                <LuxuryInput
                  label="Cardholder name"
                  type="text"
                  name="cardholderName"
                  required
                  placeholder={PH.nameOnCard}
                  className="uppercase"
                />

                <LuxuryCheckbox
                  name="isDefault"
                  id="isDefaultCard"
                  label="Set as default payment method"
                />

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
                  <ShieldCheck size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-600">
                    Your payment information is encrypted and securely stored.
                  </p>
                </div>

                <div className="flex gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddPayment(false)}
                    className="flex-1 px-6 py-3 border border-border rounded-lg"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg"
                  >
                    Add Card
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}