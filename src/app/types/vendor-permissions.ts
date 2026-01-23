/**
 * Vendor Permission System
 * Defines all vendor roles, permissions, and privilege levels
 */

// Vendor Tier Levels
export type VendorTier = 'basic' | 'premium' | 'enterprise';

// Vendor Roles
export type VendorRole = 'owner' | 'manager' | 'staff' | 'readonly';

// Permission Categories
export interface VendorPermissions {
  // Product Management
  products: {
    create: boolean;
    edit: boolean;
    delete: boolean;
    publish: boolean;
    viewAll: boolean;
    bulkEdit: boolean;
    exportData: boolean;
    importData: boolean;
    manageVariants: boolean;
    managePricing: boolean;
    manageInventory: boolean;
    manageImages: boolean;
    manageSEO: boolean;
  };
  
  // Order Management
  orders: {
    viewAll: boolean;
    viewOwn: boolean;
    edit: boolean;
    cancel: boolean;
    refund: boolean;
    updateStatus: boolean;
    viewCustomerInfo: boolean;
    exportOrders: boolean;
    printInvoices: boolean;
    manageShipping: boolean;
  };
  
  // Customer Management
  customers: {
    viewAll: boolean;
    viewOwn: boolean;
    viewDetails: boolean;
    exportData: boolean;
    sendMessages: boolean;
    manageReviews: boolean;
  };
  
  // Analytics & Reports
  analytics: {
    viewSales: boolean;
    viewPerformance: boolean;
    viewCustomerInsights: boolean;
    exportReports: boolean;
    viewRevenue: boolean;
    viewTraffic: boolean;
    viewConversions: boolean;
    viewComparisons: boolean;
  };
  
  // Financial
  financial: {
    viewPayouts: boolean;
    viewTransactions: boolean;
    manageBanking: boolean;
    viewCommissions: boolean;
    requestPayouts: boolean;
    viewTaxReports: boolean;
    downloadInvoices: boolean;
  };
  
  // Marketing & Promotions
  marketing: {
    createCoupons: boolean;
    editCoupons: boolean;
    createPromotions: boolean;
    manageDiscounts: boolean;
    viewCampaigns: boolean;
    sendEmails: boolean;
    manageSEO: boolean;
    viewMarketingAnalytics: boolean;
  };
  
  // Store Settings
  settings: {
    editProfile: boolean;
    manageTeam: boolean;
    editBranding: boolean;
    editPolicies: boolean;
    editShipping: boolean;
    editPayment: boolean;
    editNotifications: boolean;
    accessAPI: boolean;
    manageIntegrations: boolean;
  };
  
  // Support & Communication
  support: {
    viewTickets: boolean;
    respondTickets: boolean;
    viewMessages: boolean;
    sendMessages: boolean;
    viewReviews: boolean;
    respondReviews: boolean;
  };
}

// Vendor Tier Features & Limits
export interface VendorTierFeatures {
  tier: VendorTier;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: {
    maxProducts: number | 'unlimited';
    maxTeamMembers: number | 'unlimited';
    maxOrders: number | 'unlimited';
    commission: number; // Percentage
    prioritySupport: boolean;
    customBranding: boolean;
    advancedAnalytics: boolean;
    apiAccess: boolean;
    bulkOperations: boolean;
    exportData: boolean;
    emailMarketing: boolean;
    seoTools: boolean;
    multiLocation: boolean;
    inventorySync: boolean;
    customReports: boolean;
  };
  permissions: Partial<VendorPermissions>;
}

// Predefined Role Permissions
export const ROLE_PERMISSIONS: Record<VendorRole, Partial<VendorPermissions>> = {
  owner: {
    products: {
      create: true,
      edit: true,
      delete: true,
      publish: true,
      viewAll: true,
      bulkEdit: true,
      exportData: true,
      importData: true,
      manageVariants: true,
      managePricing: true,
      manageInventory: true,
      manageImages: true,
      manageSEO: true,
    },
    orders: {
      viewAll: true,
      viewOwn: true,
      edit: true,
      cancel: true,
      refund: true,
      updateStatus: true,
      viewCustomerInfo: true,
      exportOrders: true,
      printInvoices: true,
      manageShipping: true,
    },
    customers: {
      viewAll: true,
      viewOwn: true,
      viewDetails: true,
      exportData: true,
      sendMessages: true,
      manageReviews: true,
    },
    analytics: {
      viewSales: true,
      viewPerformance: true,
      viewCustomerInsights: true,
      exportReports: true,
      viewRevenue: true,
      viewTraffic: true,
      viewConversions: true,
      viewComparisons: true,
    },
    financial: {
      viewPayouts: true,
      viewTransactions: true,
      manageBanking: true,
      viewCommissions: true,
      requestPayouts: true,
      viewTaxReports: true,
      downloadInvoices: true,
    },
    marketing: {
      createCoupons: true,
      editCoupons: true,
      createPromotions: true,
      manageDiscounts: true,
      viewCampaigns: true,
      sendEmails: true,
      manageSEO: true,
      viewMarketingAnalytics: true,
    },
    settings: {
      editProfile: true,
      manageTeam: true,
      editBranding: true,
      editPolicies: true,
      editShipping: true,
      editPayment: true,
      editNotifications: true,
      accessAPI: true,
      manageIntegrations: true,
    },
    support: {
      viewTickets: true,
      respondTickets: true,
      viewMessages: true,
      sendMessages: true,
      viewReviews: true,
      respondReviews: true,
    },
  },
  
  manager: {
    products: {
      create: true,
      edit: true,
      delete: false,
      publish: true,
      viewAll: true,
      bulkEdit: true,
      exportData: true,
      importData: true,
      manageVariants: true,
      managePricing: true,
      manageInventory: true,
      manageImages: true,
      manageSEO: true,
    },
    orders: {
      viewAll: true,
      viewOwn: true,
      edit: true,
      cancel: true,
      refund: false,
      updateStatus: true,
      viewCustomerInfo: true,
      exportOrders: true,
      printInvoices: true,
      manageShipping: true,
    },
    customers: {
      viewAll: true,
      viewOwn: true,
      viewDetails: true,
      exportData: false,
      sendMessages: true,
      manageReviews: true,
    },
    analytics: {
      viewSales: true,
      viewPerformance: true,
      viewCustomerInsights: true,
      exportReports: true,
      viewRevenue: false,
      viewTraffic: true,
      viewConversions: true,
      viewComparisons: true,
    },
    financial: {
      viewPayouts: false,
      viewTransactions: false,
      manageBanking: false,
      viewCommissions: false,
      requestPayouts: false,
      viewTaxReports: false,
      downloadInvoices: false,
    },
    marketing: {
      createCoupons: true,
      editCoupons: true,
      createPromotions: true,
      manageDiscounts: true,
      viewCampaigns: true,
      sendEmails: true,
      manageSEO: true,
      viewMarketingAnalytics: true,
    },
    settings: {
      editProfile: false,
      manageTeam: false,
      editBranding: false,
      editPolicies: false,
      editShipping: true,
      editPayment: false,
      editNotifications: true,
      accessAPI: false,
      manageIntegrations: false,
    },
    support: {
      viewTickets: true,
      respondTickets: true,
      viewMessages: true,
      sendMessages: true,
      viewReviews: true,
      respondReviews: true,
    },
  },
  
  staff: {
    products: {
      create: true,
      edit: true,
      delete: false,
      publish: false,
      viewAll: true,
      bulkEdit: false,
      exportData: false,
      importData: false,
      manageVariants: true,
      managePricing: false,
      manageInventory: true,
      manageImages: true,
      manageSEO: false,
    },
    orders: {
      viewAll: true,
      viewOwn: true,
      edit: false,
      cancel: false,
      refund: false,
      updateStatus: true,
      viewCustomerInfo: true,
      exportOrders: false,
      printInvoices: true,
      manageShipping: true,
    },
    customers: {
      viewAll: false,
      viewOwn: true,
      viewDetails: false,
      exportData: false,
      sendMessages: false,
      manageReviews: false,
    },
    analytics: {
      viewSales: false,
      viewPerformance: false,
      viewCustomerInsights: false,
      exportReports: false,
      viewRevenue: false,
      viewTraffic: false,
      viewConversions: false,
      viewComparisons: false,
    },
    financial: {
      viewPayouts: false,
      viewTransactions: false,
      manageBanking: false,
      viewCommissions: false,
      requestPayouts: false,
      viewTaxReports: false,
      downloadInvoices: false,
    },
    marketing: {
      createCoupons: false,
      editCoupons: false,
      createPromotions: false,
      manageDiscounts: false,
      viewCampaigns: false,
      sendEmails: false,
      manageSEO: false,
      viewMarketingAnalytics: false,
    },
    settings: {
      editProfile: false,
      manageTeam: false,
      editBranding: false,
      editPolicies: false,
      editShipping: false,
      editPayment: false,
      editNotifications: false,
      accessAPI: false,
      manageIntegrations: false,
    },
    support: {
      viewTickets: true,
      respondTickets: true,
      viewMessages: true,
      sendMessages: true,
      viewReviews: true,
      respondReviews: false,
    },
  },
  
  readonly: {
    products: {
      create: false,
      edit: false,
      delete: false,
      publish: false,
      viewAll: true,
      bulkEdit: false,
      exportData: false,
      importData: false,
      manageVariants: false,
      managePricing: false,
      manageInventory: false,
      manageImages: false,
      manageSEO: false,
    },
    orders: {
      viewAll: true,
      viewOwn: true,
      edit: false,
      cancel: false,
      refund: false,
      updateStatus: false,
      viewCustomerInfo: false,
      exportOrders: false,
      printInvoices: false,
      manageShipping: false,
    },
    customers: {
      viewAll: false,
      viewOwn: false,
      viewDetails: false,
      exportData: false,
      sendMessages: false,
      manageReviews: false,
    },
    analytics: {
      viewSales: true,
      viewPerformance: true,
      viewCustomerInsights: false,
      exportReports: false,
      viewRevenue: false,
      viewTraffic: true,
      viewConversions: false,
      viewComparisons: false,
    },
    financial: {
      viewPayouts: false,
      viewTransactions: false,
      manageBanking: false,
      viewCommissions: false,
      requestPayouts: false,
      viewTaxReports: false,
      downloadInvoices: false,
    },
    marketing: {
      createCoupons: false,
      editCoupons: false,
      createPromotions: false,
      manageDiscounts: false,
      viewCampaigns: true,
      sendEmails: false,
      manageSEO: false,
      viewMarketingAnalytics: false,
    },
    settings: {
      editProfile: false,
      manageTeam: false,
      editBranding: false,
      editPolicies: false,
      editShipping: false,
      editPayment: false,
      editNotifications: false,
      accessAPI: false,
      manageIntegrations: false,
    },
    support: {
      viewTickets: true,
      respondTickets: false,
      viewMessages: true,
      sendMessages: false,
      viewReviews: true,
      respondReviews: false,
    },
  },
};

// Vendor Tier Configurations
export const VENDOR_TIERS: Record<VendorTier, VendorTierFeatures> = {
  basic: {
    tier: 'basic',
    name: 'Basic',
    description: 'Perfect for getting started',
    price: {
      monthly: 29,
      yearly: 290, // ~17% discount
    },
    features: {
      maxProducts: 100,
      maxTeamMembers: 2,
      maxOrders: 500,
      commission: 15, // 15% commission
      prioritySupport: false,
      customBranding: false,
      advancedAnalytics: false,
      apiAccess: false,
      bulkOperations: false,
      exportData: false,
      emailMarketing: false,
      seoTools: false,
      multiLocation: false,
      inventorySync: false,
      customReports: false,
    },
    permissions: {
      products: {
        create: true,
        edit: true,
        delete: true,
        publish: true,
        viewAll: true,
        bulkEdit: false,
        exportData: false,
        importData: false,
      },
      analytics: {
        viewSales: true,
        viewPerformance: true,
        viewCustomerInsights: false,
        exportReports: false,
      },
      financial: {
        viewPayouts: true,
        viewTransactions: true,
      },
    },
  },
  
  premium: {
    tier: 'premium',
    name: 'Premium',
    description: 'For growing businesses',
    price: {
      monthly: 79,
      yearly: 790, // ~17% discount
    },
    features: {
      maxProducts: 1000,
      maxTeamMembers: 10,
      maxOrders: 5000,
      commission: 10, // 10% commission
      prioritySupport: true,
      customBranding: true,
      advancedAnalytics: true,
      apiAccess: false,
      bulkOperations: true,
      exportData: true,
      emailMarketing: true,
      seoTools: true,
      multiLocation: false,
      inventorySync: true,
      customReports: false,
    },
    permissions: {
      products: {
        create: true,
        edit: true,
        delete: true,
        publish: true,
        viewAll: true,
        bulkEdit: true,
        exportData: true,
        importData: true,
      },
      analytics: {
        viewSales: true,
        viewPerformance: true,
        viewCustomerInsights: true,
        exportReports: true,
      },
      financial: {
        viewPayouts: true,
        viewTransactions: true,
        viewCommissions: true,
        requestPayouts: true,
      },
      marketing: {
        createCoupons: true,
        editCoupons: true,
        createPromotions: true,
        sendEmails: true,
      },
    },
  },
  
  enterprise: {
    tier: 'enterprise',
    name: 'Enterprise',
    description: 'For large-scale operations',
    price: {
      monthly: 199,
      yearly: 1990, // ~17% discount
    },
    features: {
      maxProducts: 'unlimited',
      maxTeamMembers: 'unlimited',
      maxOrders: 'unlimited',
      commission: 5, // 5% commission
      prioritySupport: true,
      customBranding: true,
      advancedAnalytics: true,
      apiAccess: true,
      bulkOperations: true,
      exportData: true,
      emailMarketing: true,
      seoTools: true,
      multiLocation: true,
      inventorySync: true,
      customReports: true,
    },
    permissions: ROLE_PERMISSIONS.owner, // Full permissions
  },
};

// Vendor User
export interface VendorUser {
  id: string;
  vendorId: string;
  email: string;
  name: string;
  role: VendorRole;
  permissions: Partial<VendorPermissions>;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
}

// Vendor Profile
export interface VendorProfile {
  id: string;
  businessName: string;
  email: string;
  tier: VendorTier;
  status: 'active' | 'suspended' | 'pending';
  permissions: Partial<VendorPermissions>;
  tierFeatures: VendorTierFeatures;
  users: VendorUser[];
  createdAt: string;
  updatedAt: string;
}
