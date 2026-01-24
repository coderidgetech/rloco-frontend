/**
 * Version tracking for cache busting
 * Update this timestamp when making significant component changes
 * to force browser cache invalidation
 */

export const APP_VERSION = '2.1.0';
export const BUILD_TIMESTAMP = '2026-01-16T12:00:00Z';
export const FILTER_SYSTEM_VERSION = '2.0.0'; // Updated to multi-select categories

// Feature flags for progressive enhancement
export const FEATURES = {
  MULTI_SELECT_CATEGORIES: true,
  ADVANCED_FILTERS: true,
  PRODUCT_BADGES: true,
  WISHLIST: true,
  CURRENCY_CONVERSION: true,
  MYNTRA_CHECKOUT: true,
  ADMIN_PORTAL: true,
  VENDOR_MANAGEMENT: true,
} as const;

// Cache busting query parameter
export const getCacheBuster = () => {
  return `v=${BUILD_TIMESTAMP}`;
};

// Log version info in development
if (import.meta.env.DEV) {
  console.log(`🚀 Rloco App Version: ${APP_VERSION}`);
  console.log(`📦 Filter System: ${FILTER_SYSTEM_VERSION}`);
  console.log(`⏰ Build: ${BUILD_TIMESTAMP}`);
}
