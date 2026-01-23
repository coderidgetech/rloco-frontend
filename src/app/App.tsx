import { AdminConfigurationPage } from './pages/admin/AdminConfigurationPage';
import SubscriptionPlanBuilder from './pages/admin/SubscriptionPlanBuilder';
import { ReturnsPage } from './pages/ReturnsPage';
import { SupportPage } from './pages/SupportPage';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AdminProvider } from './context/AdminContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { SiteConfigProvider } from './context/SiteConfigContext';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Toaster } from 'sonner';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Loader } from './components/Loader';
import { ScrollProgress } from './components/ScrollProgress';
import { ScrollToTop } from './components/ScrollToTop';
import { Navigation } from './components/Navigation';
import { CustomCursor } from './components/CustomCursor';
import { ConfigApplier } from './components/ConfigApplier';
import { ConfigIndicator } from './components/ConfigIndicator';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { WishlistPage } from './pages/WishlistPage';
import { CategoryPage } from './pages/CategoryPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SalePage } from './pages/SalePage';
import { NewArrivalsPage } from './pages/NewArrivalsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { SizeGuidePage } from './pages/SizeGuidePage';
import { ShippingPage } from './pages/ShippingPage';
import { AllProductsPage } from './pages/AllProductsPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
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
import { FAQPage } from './pages/FAQPage';
import { CareersPage } from './pages/CareersPage';
import { SustainabilityPage } from './pages/SustainabilityPage';
import { PressPage } from './pages/PressPage';
import { CookiesPage } from './pages/CookiesPage';

// Updated: January 10, 2026 - Enhanced blur effects on all modals

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
                    <ScrollToTop />
                    <Toaster position="top-right" richColors closeButton />
                    <AnimatePresence mode="wait">
                      {loading && <Loader onComplete={() => setLoading(false)} />}
                    </AnimatePresence>

                    {!loading && (
                      <>
                        <ConfigApplier />
                        <ConfigIndicator />
                        <CustomCursor />
                        <ScrollProgress />
                        <Navigation />
                      <div className="min-h-screen bg-background text-foreground relative" style={{ position: 'relative' }}>
                        <Routes>
                          <Route path="/" element={<HomePage />} />
                          <Route path="/product/:id" element={<ProductDetailPage />} />
                          <Route path="/cart" element={<CartPage />} />
                          <Route path="/checkout" element={<CheckoutPage />} />
                          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                          <Route path="/wishlist" element={<WishlistPage />} />
                          <Route path="/all-products" element={<AllProductsPage />} />
                          <Route path="/category/:gender" element={<CategoryPage />} />
                          <Route path="/category/:gender/:category" element={<CategoryPage />} />
                          <Route path="/not-found" element={<NotFoundPage />} />
                          <Route path="/sale" element={<SalePage />} />
                          <Route path="/new-arrivals" element={<NewArrivalsPage />} />
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
                          <Route path="/admin/login" element={<AdminLoginPage />} />
                          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
                          <Route path="/admin/products" element={<ProtectedRoute><AdminProductsPage /></ProtectedRoute>} />
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
                          <Route path="/admin/subscription-plans/builder" element={<ProtectedRoute><SubscriptionPlanBuilder /></ProtectedRoute>} />
                        </Routes>
                        </div>
                      </>
                    )}
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