import { AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';
import { BrowserRouter, HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Loader } from './components/Loader';
import { ScrollProgress } from './components/ScrollProgress';
import { ScrollToTop } from './components/ScrollToTop';
import { Navigation } from './components/Navigation';
import { CustomCursor } from './components/CustomCursor';
import { ConfigApplier } from './components/ConfigApplier';
import { ConfigIndicator } from './components/ConfigIndicator';
import { useIsMobile } from './hooks/useIsMobile';
import { useState, useEffect } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { BottomNavigation } from './components/mobile/BottomNavigation';
import { HelpGuideButton } from './components/HelpGuideButton';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AdminProvider } from './context/AdminContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { SiteConfigProvider } from './context/SiteConfigContext';
import { OrderProvider } from './context/OrderContext';
import { MobileOnboardingRedirect } from './components/MobileOnboardingRedirect';
import { ResponsiveHomePage } from './components/ResponsiveHomePage';
import { ResponsiveProductDetailPage } from './components/ResponsiveProductDetailPage';
import { ResponsiveCartPage } from './components/ResponsiveCartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { ResponsiveWishlistPage } from './components/ResponsiveWishlistPage';
import { ResponsiveCategoryPage } from './components/ResponsiveCategoryPage';
import { ResponsiveSalePage } from './components/ResponsiveSalePage';
import { ResponsiveNewArrivalsPage } from './components/ResponsiveNewArrivalsPage';
import { ResponsiveAllProductsPage } from './components/ResponsiveAllProductsPage';
import { ResponsiveOrderConfirmationPage } from './components/ResponsiveOrderConfirmationPage';
import { ResponsiveNotFoundPage } from './components/ResponsiveNotFoundPage';
import { ResponsiveAddressSelectionPage } from './components/ResponsiveAddressSelectionPage';
import { ResponsivePaymentPage } from './components/ResponsivePaymentPage';
import { ResponsiveAboutPage } from './components/ResponsiveAboutPage';
import { ResponsiveContactPage } from './components/ResponsiveContactPage';
import { ResponsiveTermsPage } from './components/ResponsiveTermsPage';
import { ResponsivePrivacyPage } from './components/ResponsivePrivacyPage';
import { ResponsiveSizeGuidePage } from './components/ResponsiveSizeGuidePage';
import { ResponsiveShippingPage } from './components/ResponsiveShippingPage';
import { ResponsiveReturnsPage } from './components/ResponsiveReturnsPage';
import { FAQPage } from './pages/FAQPage';
import { CareersPage } from './pages/CareersPage';
import { SustainabilityPage } from './pages/SustainabilityPage';
import { PressPage } from './pages/PressPage';
import { CookiesPage } from './pages/CookiesPage';
import { ResponsiveLoginPage } from './components/ResponsiveLoginPage';
import { ResponsiveSignupPage } from './components/ResponsiveSignupPage';
import { ResponsiveForgotPasswordPage } from './components/ResponsiveForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { ResponsiveAccountPage } from './components/ResponsiveAccountPage';
import { ResponsiveOTPVerificationPage } from './components/ResponsiveOTPVerificationPage';
import { AddAddressPage } from './pages/AddAddressPage';
import { CategoriesHubPage } from './pages/CategoriesHubPage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { AddressesPage } from './pages/AddressesPage';
import { DesktopHeaderWrapper } from './components/DesktopHeaderWrapper';
import { FeaturedCollectionPage } from './pages/FeaturedCollectionPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminAddEditProductPage } from './pages/admin/AdminAddEditProductPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminVendorsPage } from './pages/admin/AdminVendorsPage';
import { AddVendorPage } from './pages/admin/AddVendorPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminContentPage } from './pages/admin/AdminContentPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminPromotionsPage } from './pages/admin/AdminPromotionsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminConfigurationPage } from './pages/admin/AdminConfigurationPage';
import { AdminVideosPage } from './pages/admin/AdminVideosPage';
import SubscriptionPlanBuilder from './pages/admin/SubscriptionPlanBuilder';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminWishlistPage } from './pages/admin/AdminWishlistPage';
import { AdminBadgesPage } from './pages/admin/AdminBadgesPage';
import { ConfigurationPanel } from './pages/ConfigurationPanel';
import { SupportPage } from './pages/SupportPage';

/** In Capacitor native app, use hash routing so the WebView never does a full reload on navigation. */
function isCapacitorNative(): boolean {
  if (typeof window === 'undefined') return false;
  const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
  return !!(cap?.isNativePlatform?.());
}

const AppRouter = isCapacitorNative() ? HashRouter : BrowserRouter;

const MOBILE_HIDE_NAV_PATHS = ['/splash', '/onboarding', '/login', '/signup', '/forgot-password', '/otp-verification'];

function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const showMobileBottomNav = isMobile && !isAdminRoute && !MOBILE_HIDE_NAV_PATHS.some((p) => location.pathname === p || location.pathname.startsWith(p + '/'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [loading]);

  return (
    <>
      <ConfigApplier />
      <ConfigIndicator />
      <AnimatePresence mode="wait">
        {loading && <Loader onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      {!isMobile && <CustomCursor />}
      <ScrollProgress />
      {/* Site nav on all viewports (hamburger + icons on small screens) */}
      {!isAdminRoute && (
        <>
          <Navigation />
          <HelpGuideButton />
        </>
      )}
      {!loading && (
        <div className="min-h-screen bg-background text-foreground">
          {children}
          {showMobileBottomNav && <BottomNavigation />}
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AppRouter>
        <ScrollToTop />
        <UserProvider>
          <CurrencyProvider>
            <CartProvider>
              <WishlistProvider>
                <AdminProvider>
                  <SiteConfigProvider>
                    <OrderProvider>
                      <Toaster position="top-right" richColors closeButton duration={1500} />
                      <AppLayout>
                        <MobileOnboardingRedirect>
                          <Routes>
                            <Route path="/" element={<ResponsiveHomePage />} />
                            <Route path="/splash" element={<Navigate to="/" replace />} />
                            <Route path="/onboarding" element={<Navigate to="/" replace />} />
                            <Route path="/login" element={<ResponsiveLoginPage />} />
                            <Route path="/signup" element={<ResponsiveSignupPage />} />
                            <Route path="/forgot-password" element={<ResponsiveForgotPasswordPage />} />
                            <Route path="/reset-password" element={<ResetPasswordPage />} />
                            <Route path="/otp-verification" element={<ResponsiveOTPVerificationPage />} />
                            <Route path="/delivery-location" element={<Navigate to="/addresses" replace />} />
                            <Route path="/orders" element={<OrdersPage />} />
                            <Route path="/orders/:id" element={<OrderDetailPage />} />
                            <Route path="/order/:id" element={<OrderDetailPage />} />
                            <Route path="/addresses" element={<AddressesPage />} />
                            <Route path="/addresses/add" element={<DesktopHeaderWrapper title="Add address" backPath="/addresses"><AddAddressPage /></DesktopHeaderWrapper>} />
                            <Route path="/profile/edit" element={<Navigate to="/account" replace />} />
                            <Route path="/payment-methods" element={<Navigate to="/account" replace />} />
                            <Route path="/add-payment-method" element={<Navigate to="/account" replace />} />
                            <Route path="/help" element={<SupportPage />} />
                            <Route path="/support" element={<SupportPage />} />
                            <Route path="/reviews" element={<Navigate to="/account" replace />} />
                            <Route path="/rewards" element={<Navigate to="/account" replace />} />
                            <Route path="/coupons" element={<Navigate to="/account" replace />} />
                            <Route path="/settings" element={<Navigate to="/account" replace />} />
                            <Route path="/change-password" element={<Navigate to="/account" replace />} />
                            <Route path="/two-factor" element={<Navigate to="/account" replace />} />
                            <Route path="/language" element={<Navigate to="/account" replace />} />
                            <Route path="/product/:id" element={<ResponsiveProductDetailPage />} />
                            <Route path="/cart" element={<ResponsiveCartPage />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/wishlist" element={<ResponsiveWishlistPage />} />
                            <Route path="/account" element={<ResponsiveAccountPage />} />
                            <Route path="/categories" element={<DesktopHeaderWrapper title="Categories" backPath="/"><CategoriesHubPage /></DesktopHeaderWrapper>} />
                            <Route path="/gift-for-her" element={<Navigate to="/category/women?gift=true" replace />} />
                            <Route path="/gift-for-him" element={<Navigate to="/category/men?gift=true" replace />} />
                            <Route path="/gift-cards" element={<Navigate to="/all-products" replace />} />
                            <Route path="/search" element={<Navigate to="/all-products" replace />} />
                            <Route path="/notifications" element={<Navigate to="/account" replace />} />
                            <Route path="/category/:gender" element={<ResponsiveCategoryPage />} />
                            <Route path="/category/:gender/:category" element={<ResponsiveCategoryPage />} />
                            <Route path="/address" element={<ResponsiveAddressSelectionPage />} />
                            <Route path="/address-selection" element={<ResponsiveAddressSelectionPage />} />
                            <Route path="/add-address" element={<DesktopHeaderWrapper title="Add address" backPath="/addresses"><AddAddressPage /></DesktopHeaderWrapper>} />
                            <Route path="/payment" element={<ResponsivePaymentPage />} />
                            <Route path="/order-confirmation" element={<ResponsiveOrderConfirmationPage />} />
                            <Route path="/order-confirmation/:id" element={<ResponsiveOrderConfirmationPage />} />
                            <Route path="/all-products" element={<ResponsiveAllProductsPage />} />
                            <Route path="/not-found" element={<ResponsiveNotFoundPage />} />
                            <Route path="/sale" element={<ResponsiveSalePage />} />
                            <Route path="/new-arrivals" element={<ResponsiveNewArrivalsPage />} />
                            <Route path="/featured-collection" element={<FeaturedCollectionPage />} />
                            <Route path="/about" element={<ResponsiveAboutPage />} />
                            <Route path="/contact" element={<ResponsiveContactPage />} />
                            <Route path="/terms" element={<ResponsiveTermsPage />} />
                            <Route path="/privacy" element={<ResponsivePrivacyPage />} />
                            <Route path="/size-guide" element={<ResponsiveSizeGuidePage />} />
                            <Route path="/mobile/size-guide" element={<ResponsiveSizeGuidePage />} />
                            <Route path="/shipping" element={<ResponsiveShippingPage />} />
                            <Route path="/returns" element={<ResponsiveReturnsPage />} />
                            <Route path="/faq" element={<FAQPage />} />
                            <Route path="/careers" element={<CareersPage />} />
                            <Route path="/sustainability" element={<SustainabilityPage />} />
                            <Route path="/press" element={<PressPage />} />
                            <Route path="/cookies" element={<CookiesPage />} />
                            <Route path="*" element={<ResponsiveNotFoundPage />} />
                            <Route path="/admin/login" element={<AdminLoginPage />} />
                            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
                            <Route path="/admin/products" element={<ProtectedRoute><AdminProductsPage /></ProtectedRoute>} />
                            <Route path="/admin/products/add" element={<ProtectedRoute><AdminAddEditProductPage /></ProtectedRoute>} />
                            <Route path="/admin/products/edit" element={<ProtectedRoute><AdminAddEditProductPage /></ProtectedRoute>} />
                            <Route path="/admin/orders" element={<ProtectedRoute><AdminOrdersPage /></ProtectedRoute>} />
                            <Route path="/admin/customers" element={<ProtectedRoute requiredRole="admin"><AdminCustomersPage /></ProtectedRoute>} />
                            <Route path="/admin/vendors" element={<ProtectedRoute requiredRole="admin"><AdminVendorsPage /></ProtectedRoute>} />
                            <Route path="/admin/vendors/add" element={<ProtectedRoute requiredRole="admin"><AddVendorPage /></ProtectedRoute>} />
                            <Route path="/admin/categories" element={<ProtectedRoute><AdminCategoriesPage /></ProtectedRoute>} />
                            <Route path="/admin/content" element={<ProtectedRoute requiredRole="admin"><AdminContentPage /></ProtectedRoute>} />
                            <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalyticsPage /></ProtectedRoute>} />
                            <Route path="/admin/promotions" element={<ProtectedRoute requiredRole="admin"><AdminPromotionsPage /></ProtectedRoute>} />
                            <Route path="/admin/settings" element={<ProtectedRoute requiredRole="admin"><AdminSettingsPage /></ProtectedRoute>} />
                            <Route path="/admin/configuration" element={<ProtectedRoute requiredRole="admin"><AdminConfigurationPage /></ProtectedRoute>} />
                            <Route path="/admin/videos" element={<ProtectedRoute><AdminVideosPage /></ProtectedRoute>} />
                            <Route path="/admin/subscription-plans/builder" element={<ProtectedRoute requiredRole="admin"><SubscriptionPlanBuilder /></ProtectedRoute>} />
                            <Route path="/admin/reviews" element={<ProtectedRoute><AdminReviewsPage /></ProtectedRoute>} />
                            <Route path="/admin/wishlist" element={<ProtectedRoute><AdminWishlistPage /></ProtectedRoute>} />
                            <Route path="/admin/badges" element={<ProtectedRoute requiredRole="admin"><AdminBadgesPage /></ProtectedRoute>} />
                            <Route path="/configuration" element={<ConfigurationPanel />} />
                          </Routes>
                        </MobileOnboardingRedirect>
                      </AppLayout>
                    </OrderProvider>
                  </SiteConfigProvider>
                </AdminProvider>
              </WishlistProvider>
            </CartProvider>
          </CurrencyProvider>
        </UserProvider>
      </AppRouter>
    </ErrorBoundary>
  );
}

export default App;
