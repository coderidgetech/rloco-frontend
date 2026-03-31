/** Shape stored in Vendor.preferences (Mongo). No mock defaults — empty strings / false until loaded from API. */

export type VendorNotifications = {
  newOrders: boolean;
  orderUpdates: boolean;
  lowStock: boolean;
  customerMessages: boolean;
  productReviews: boolean;
  paymentReceived: boolean;
  emailDigest: boolean;
  smsNotifications: boolean;
  digestTime: string;
};

export type VendorDisplay = {
  compactView: boolean;
  darkMode: boolean;
  showTips: boolean;
  autoRefresh: boolean;
};

export type VendorStore = {
  tagline: string;
  description: string;
  slug: string;
  bannerUrl: string;
};

export type VendorContact = {
  phone: string;
  address: string;
  website: string;
};

export type VendorSocial = {
  instagram: string;
  facebook: string;
  twitter: string;
  pinterest: string;
};

export type VendorBusiness = {
  legalName: string;
  taxId: string;
  businessType: string;
  registrationNumber: string;
};

export type VendorProductDefaults = {
  defaultCurrency: string;
  defaultTaxRate: string;
  processingTime: string;
  autoPublish: boolean;
  lowStockAlerts: boolean;
  autoHideOutOfStock: boolean;
};

export type VendorReturns = {
  returnWindowDays: string;
  restockingFee: string;
  returnPolicyText: string;
};

export type VendorReviews = {
  autoApproveReviews: boolean;
  requireVerifiedPurchase: boolean;
  allowAnonymousReviews: boolean;
  allowReviewMedia: boolean;
  minRatingAutoApprove: string;
  minReviewLength: string;
  reviewWindowDays: string;
  showVerifiedBadge: boolean;
  showHelpfulVotes: boolean;
  showVendorResponses: boolean;
  defaultSort: string;
  remindToRespond: boolean;
  responseReminderHours: string;
  autoRequestReviews: boolean;
  reviewRequestDays: string;
  profanityFilter: boolean;
  customerReporting: boolean;
  competitorBlock: boolean;
  flagThreshold: string;
  offerReviewRewards: boolean;
};

export type VendorShipping = {
  shipFromAddress: string;
  defaultCarrier: string;
  processingDays: string;
  packageUnit: string;
  freeShippingThreshold: string;
  freeShippingEnabled: boolean;
  expeditedEnabled: boolean;
  internationalShipping: boolean;
  notes: string;
  /** carrier name -> enabled (e.g. USPS, FedEx) */
  carriers: Record<string, boolean>;
};

export type VendorPreferenceState = {
  store: VendorStore;
  contact: VendorContact;
  social: VendorSocial;
  business: VendorBusiness;
  notifications: VendorNotifications;
  display: VendorDisplay;
  products: VendorProductDefaults;
  returns: VendorReturns;
  reviews: VendorReviews;
  shipping: VendorShipping;
};

export function emptyPreferenceState(): VendorPreferenceState {
  return {
    store: { tagline: '', description: '', slug: '', bannerUrl: '' },
    contact: { phone: '', address: '', website: '' },
    social: { instagram: '', facebook: '', twitter: '', pinterest: '' },
    business: { legalName: '', taxId: '', businessType: '', registrationNumber: '' },
    notifications: {
      newOrders: false,
      orderUpdates: false,
      lowStock: false,
      customerMessages: false,
      productReviews: false,
      paymentReceived: false,
      emailDigest: false,
      smsNotifications: false,
      digestTime: '',
    },
    display: {
      compactView: false,
      darkMode: false,
      showTips: false,
      autoRefresh: false,
    },
    products: {
      defaultCurrency: '',
      defaultTaxRate: '',
      processingTime: '',
      autoPublish: false,
      lowStockAlerts: false,
      autoHideOutOfStock: false,
    },
    returns: {
      returnWindowDays: '',
      restockingFee: '',
      returnPolicyText: '',
    },
    reviews: {
      autoApproveReviews: false,
      requireVerifiedPurchase: false,
      allowAnonymousReviews: false,
      allowReviewMedia: false,
      minRatingAutoApprove: '',
      minReviewLength: '',
      reviewWindowDays: '',
      showVerifiedBadge: false,
      showHelpfulVotes: false,
      showVendorResponses: false,
      defaultSort: '',
      remindToRespond: false,
      responseReminderHours: '',
      autoRequestReviews: false,
      reviewRequestDays: '',
      profanityFilter: false,
      customerReporting: false,
      competitorBlock: false,
      flagThreshold: '',
      offerReviewRewards: false,
    },
    shipping: {
      shipFromAddress: '',
      defaultCarrier: '',
      processingDays: '',
      packageUnit: '',
      freeShippingThreshold: '',
      freeShippingEnabled: false,
      expeditedEnabled: false,
      internationalShipping: false,
      notes: '',
      carriers: { USPS: false, FedEx: false, UPS: false, DHL: false },
    },
  };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function mergeSection<T extends Record<string, unknown>>(base: T, patch: unknown): T {
  if (!isRecord(patch)) return { ...base };
  const out = { ...base } as Record<string, unknown>;
  for (const k of Object.keys(base)) {
    if (k in patch && patch[k] !== undefined && patch[k] !== null) {
      out[k] = patch[k] as unknown;
    }
  }
  return out as T;
}

function mergeCarriers(base: Record<string, boolean>, patch: unknown): Record<string, boolean> {
  const out = { ...base };
  if (!isRecord(patch)) return out;
  for (const k of Object.keys(patch)) {
    if (typeof patch[k] === 'boolean') out[k] = patch[k] as boolean;
  }
  return out;
}

/** Merge API preferences into empty state (only known keys). */
export function preferencesFromApi(raw: Record<string, unknown> | undefined | null): VendorPreferenceState {
  const e = emptyPreferenceState();
  if (!raw) return e;
  const shipMerged = mergeSection(e.shipping, raw.shipping);
  const rawShip = isRecord(raw.shipping) ? raw.shipping : null;
  return {
    store: mergeSection(e.store, raw.store),
    contact: mergeSection(e.contact, raw.contact),
    social: mergeSection(e.social, raw.social),
    business: mergeSection(e.business, raw.business),
    notifications: mergeSection(e.notifications, raw.notifications),
    display: mergeSection(e.display, raw.display),
    products: mergeSection(e.products, raw.products),
    returns: mergeSection(e.returns, raw.returns),
    reviews: mergeSection(e.reviews, raw.reviews),
    shipping: {
      ...shipMerged,
      carriers: mergeCarriers(e.shipping.carriers, rawShip?.carriers),
    },
  };
}

export function preferencesToApi(p: VendorPreferenceState): Record<string, unknown> {
  return {
    store: p.store,
    contact: p.contact,
    social: p.social,
    business: p.business,
    notifications: p.notifications,
    display: p.display,
    products: p.products,
    returns: p.returns,
    reviews: p.reviews,
    shipping: p.shipping,
  };
}
