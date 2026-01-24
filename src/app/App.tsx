import { HelpGuideButton } from './components/HelpGuideButton';
import { HomePage } from './pages/HomePage';
import { MobileHomePage } from './pages/MobileHomePage';
import { ResponsiveHomePage } from './components/ResponsiveHomePage';
import { ResponsiveProductDetailPage } from './components/ResponsiveProductDetailPage';
import { ResponsiveCartPage } from './components/ResponsiveCartPage';
import { ResponsiveCategoryPage } from './components/ResponsiveCategoryPage';
import { ResponsiveWishlistPage } from './components/ResponsiveWishlistPage';
import { ResponsiveSalePage } from './components/ResponsiveSalePage';
import { ResponsiveNewArrivalsPage } from './components/ResponsiveNewArrivalsPage';
import { ResponsiveAllProductsPage } from './components/ResponsiveAllProductsPage';
import { ResponsiveOrderConfirmationPage } from './components/ResponsiveOrderConfirmationPage';
import { ResponsiveNotFoundPage } from './components/ResponsiveNotFoundPage';
import { ResponsiveAccountPage } from './components/ResponsiveAccountPage';
import { MobileSearchPage } from './pages/mobile/MobileSearchPage';
import { MobileCategoriesPage } from './pages/mobile/MobileCategoriesPage';
import { MobileAccountPage } from './pages/mobile/MobileAccountPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AddressSelectionPage } from './pages/AddressSelectionPage';
import { PaymentPage } from './pages/PaymentPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { WishlistPage } from './pages/WishlistPage';
import { CategoryPage } from './pages/CategoryPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SalePage } from './pages/SalePage';
import { NewArrivalsPage } from './pages/NewArrivalsPage';
import { FeaturedCollectionPage } from './pages/FeaturedCollectionPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { SizeGuidePage } from './pages/SizeGuidePage';
import { ShippingPage } from './pages/ShippingPage';
import { ReturnsPage } from './pages/ReturnsPage';
import { SupportPage } from './pages/SupportPage';
import { FAQPage } from './pages/FAQPage';
import { CareersPage } from './pages/CareersPage';
import { SustainabilityPage } from './pages/SustainabilityPage';
import { PressPage } from './pages/PressPage';
import { CookiesPage } from './pages/CookiesPage';
import { AllProductsPage } from './pages/AllProductsPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminAddEditProductPage } from './pages/admin/AdminAddEditProductPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminVendorsPage } from './pages/admin/AdminVendorsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AddVendorPage } from './pages/admin/AddVendorPage';
import { AddUserPage } from './pages/admin/AddUserPage';
import { AdminContentPage } from './pages/admin/AdminContentPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminPromotionsPage } from './pages/admin/AdminPromotionsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminConfigurationPage } from './pages/admin/AdminConfigurationPage';
import SubscriptionPlanBuilder from './pages/admin/SubscriptionPlanBuilder';
import { AdminVideosPage } from './pages/admin/AdminVideosPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminWishlistPage } from './pages/admin/AdminWishlistPage';
import { AdminBadgesPage } from './pages/admin/AdminBadgesPage';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AdminProvider } from './context/AdminContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { SiteConfigProvider } from './context/SiteConfigContext';
import { OrderProvider } from './context/OrderContext';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Loader } from './components/Loader';
import { ScrollProgress } from './components/ScrollProgress';
import { ScrollToTop } from './components/ScrollToTop';
import { Navigation } from './components/Navigation';
import { CustomCursor } from './components/CustomCursor';
import { ConfigApplier } from './components/ConfigApplier';
import { ConfigIndicator } from './components/ConfigIndicator';
import { useIsMobile } from './hooks/useIsMobile';

// Layout wrapper to conditionally show navigation
function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <>
      <ConfigApplier />
      <ConfigIndicator />
      {!isMobile && <CustomCursor />}
      <ScrollProgress />
      {/* Only show Navigation and HelpGuide on non-admin routes and desktop */}
      {!isAdminRoute && !isMobile && (
        <>
          <Navigation />
          <HelpGuideButton />
        </>
      )}
      <div className="min-h-screen bg-background text-foreground">
        {children}
      </div>
    </>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only suppress known third-party library errors in development
    // In production, let all errors bubble up for proper error tracking
    if (import.meta.env.DEV) {
      const originalError = console.error;
      const originalWarn = console.warn;
      
      // Only filter specific known third-party library warnings in dev
      const shouldFilter = (message: string): boolean => {
        return (
          message.includes('logPreviewError') ||
          message.includes('reduxState') ||
          // Filter only specific React warnings that are known false positives
          (message.includes('Warning: validateDOMNesting') && message.includes('react-beautiful-dnd'))
        );
      };

      console.error = (...args) => {
        const message = args[0]?.toString() || '';
        if (shouldFilter(message)) return;
        originalError.apply(console, args);
      };

      console.warn = (...args) => {
        const message = args[0]?.toString() || '';
        if (shouldFilter(message)) return;
        originalWarn.apply(console, args);
      };

      // Log but don't suppress errors for error tracking
      const handleError = (event: ErrorEvent) => {
        // Log to error tracking service (e.g., Sentry) in production
        if (!import.meta.env.DEV) {
          // TODO: Integrate error tracking service
          // errorTracker.captureException(event.error);
        }
        // Don't prevent default - let error boundary handle it
      };

      const handleRejection = (event: PromiseRejectionEvent) => {
        // Log to error tracking service in production
        if (!import.meta.env.DEV) {
          // TODO: Integrate error tracking service
          // errorTracker.captureException(event.reason);
        }
        // Don't prevent default - let error boundary handle it
      };

      window.addEventListener('error', handleError);
      window.addEventListener('unhandledrejection', handleRejection);

      return () => {
        console.error = originalError;
        console.warn = originalWarn;
        window.removeEventListener('error', handleError);
        window.removeEventListener('unhandledrejection', handleRejection);
      };
    }
  }, []);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Prevent scroll during loading
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [loading]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <UserProvider>
          <CartProvider>
            <WishlistProvider>
              <AdminProvider>
                <CurrencyProvider>
                  <SiteConfigProvider>
                    <OrderProvider>
                      <ScrollToTop />
                      <Toaster position="top-right" richColors closeButton duration={1500} />
                      <AnimatePresence mode="wait">
                        {loading && <Loader onComplete={() => setLoading(false)} />}
                      </AnimatePresence>

                      {!loading && (
                        <AppLayout>
                          <Routes>
                            {/* Responsive routes */}
                            <Route path="/" element={<ResponsiveHomePage />} />
                            <Route path="/product/:id" element={<ResponsiveProductDetailPage />} />
                            <Route path="/cart" element={<ResponsiveCartPage />} />
                            <Route path="/wishlist" element={<ResponsiveWishlistPage />} />
                            <Route path="/account" element={<ResponsiveAccountPage />} />
                            <Route path="/categories" element={<MobileCategoriesPage />} />
                            <Route path="/search" element={<MobileSearchPage />} />
                            <Route path="/category/:gender" element={<ResponsiveCategoryPage />} />
                            <Route path="/category/:gender/:category" element={<ResponsiveCategoryPage />} />
                            <Route path="/address-selection" element={<AddressSelectionPage />} />
                            <Route path="/payment" element={<PaymentPage />} />
                            <Route path="/order-confirmation" element={<ResponsiveOrderConfirmationPage />} />
                            <Route path="/all-products" element={<ResponsiveAllProductsPage />} />
                            <Route path="/not-found" element={<ResponsiveNotFoundPage />} />
                            <Route path="/sale" element={<ResponsiveSalePage />} />
                            <Route path="/new-arrivals" element={<ResponsiveNewArrivalsPage />} />
                            <Route path="/featured-collection" element={<FeaturedCollectionPage />} />
                            
                            {/* Auth */}
                            <Route path="/login" element={<LoginPage />} />

                            {/* Legacy routes (for backward compatibility) */}
                            <Route path="/checkout" element={<CheckoutPage />} />
                            
                            {/* Static pages */}
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/terms" element={<TermsPage />} />
                            <Route path="/privacy" element={<PrivacyPage />} />
                            <Route path="/size-guide" element={<SizeGuidePage />} />
                            <Route path="/shipping" element={<ShippingPage />} />
                            <Route path="/returns" element={<ReturnsPage />} />
                            <Route path="/support" element={<SupportPage />} />
                            <Route path="/faq" element={<FAQPage />} />
                            <Route path="/careers" element={<CareersPage />} />
                            <Route path="/sustainability" element={<SustainabilityPage />} />
                            <Route path="/press" element={<PressPage />} />
                            <Route path="/cookies" element={<CookiesPage />} />
                            <Route path="*" element={<NotFoundPage />} />
                            
                            {/* Admin routes */}
                            <Route path="/admin/login" element={<AdminLoginPage />} />
                            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
                            <Route path="/admin/products" element={<ProtectedRoute><AdminProductsPage /></ProtectedRoute>} />
                            <Route path="/admin/products/add" element={<ProtectedRoute><AdminAddEditProductPage /></ProtectedRoute>} />
                            <Route path="/admin/products/edit" element={<ProtectedRoute><AdminAddEditProductPage /></ProtectedRoute>} />
                            <Route path="/admin/orders" element={<ProtectedRoute><AdminOrdersPage /></ProtectedRoute>} />
                            <Route path="/admin/customers" element={<ProtectedRoute><AdminCustomersPage /></ProtectedRoute>} />
                            <Route path="/admin/users/add" element={<ProtectedRoute><AddUserPage /></ProtectedRoute>} />
                            <Route path="/admin/vendors" element={<ProtectedRoute><AdminVendorsPage /></ProtectedRoute>} />
                            <Route path="/admin/vendors/add" element={<ProtectedRoute><AddVendorPage /></ProtectedRoute>} />
                            <Route path="/admin/categories" element={<ProtectedRoute><AdminCategoriesPage /></ProtectedRoute>} />
                            <Route path="/admin/content" element={<ProtectedRoute><AdminContentPage /></ProtectedRoute>} />
                            <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalyticsPage /></ProtectedRoute>} />
                            <Route path="/admin/promotions" element={<ProtectedRoute><AdminPromotionsPage /></ProtectedRoute>} />
                            <Route path="/admin/settings" element={<ProtectedRoute><AdminSettingsPage /></ProtectedRoute>} />
                            <Route path="/admin/configuration" element={<ProtectedRoute><AdminConfigurationPage /></ProtectedRoute>} />
                            <Route path="/admin/videos" element={<ProtectedRoute><AdminVideosPage /></ProtectedRoute>} />
                            <Route path="/admin/subscription-plans/builder" element={<ProtectedRoute><SubscriptionPlanBuilder /></ProtectedRoute>} />
                            <Route path="/admin/reviews" element={<ProtectedRoute><AdminReviewsPage /></ProtectedRoute>} />
                            <Route path="/admin/wishlist" element={<ProtectedRoute><AdminWishlistPage /></ProtectedRoute>} />
                            <Route path="/admin/badges" element={<ProtectedRoute><AdminBadgesPage /></ProtectedRoute>} />
                          </Routes>
                        </AppLayout>
                      )}
                    </OrderProvider>
                  </SiteConfigProvider>
                </CurrencyProvider>
              </AdminProvider>
            </WishlistProvider>
          </CartProvider>
        </UserProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
