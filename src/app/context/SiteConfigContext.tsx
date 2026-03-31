import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  type Dispatch,
  type SetStateAction,
} from 'react';
import api from '../lib/api';

// Configuration Types
export interface SiteConfig {
  general: {
    siteName: string;
    tagline: string;
    description: string;
    email: string;
    phone: string;
    supportEmail: string;
    address: string;
    socialMedia: {
      instagram: string;
      facebook: string;
      twitter: string;
      pinterest: string;
      youtube: string;
    };
    currency: string;
    timezone: string;
    dateFormat: string;
    multiCurrency: boolean;
    autoDetectLocation: boolean;
    maintenanceMode: boolean;
    maintenanceMessage: string;
  };
  design: {
    colors: {
      primary: string;
      primaryLight: string;
      primaryDark: string;
      secondary: string;
      secondaryGray: string;
      secondaryLightGray: string;
      dominant: string;
      dominantOffWhite: string;
      dominantLight: string;
    };
    typography: {
      headingFont: string;
      bodyFont: string;
      baseFontSize: string;
      lineHeight: string;
      letterSpacing: string;
    };
    layout: {
      borderRadius: string;
      containerWidth: string;
      sectionSpacing: string;
    };
    animations: {
      enabled: boolean;
      speed: string;
      hoverEffects: string;
    };
  };
  homepage: {
    hero: {
      enabled: boolean;
      heading: string;
      subheading: string;
      primaryButtonText: string;
      primaryButtonLink: string;
      backgroundImage: string;
      style: string;
    };
    sections: {
      featuredProducts: boolean;
      newArrivals: boolean;
      shopByCategory: boolean;
      bestSellers: boolean;
      editorialFeatures: boolean;
      promotionalBanner: boolean;
      testimonials: boolean;
      brandStory: boolean;
      instagramFeed: boolean;
      newsletterSignup: boolean;
    };
    featuredCollections: string[];
  };
  navigation: {
    header: {
      style: string;
      height: string;
      sticky: boolean;
      showSearch: boolean;
      showCurrency: boolean;
    };
    megaMenu: {
      style: string;
    };
    footer: {
      style: string;
      showNewsletter: boolean;
      showSocial: boolean;
      showPaymentIcons: boolean;
      copyrightText: string;
    };
  };
  categories: {
    women: {
      clothing: string[];
      accessories: string[];
    };
    men: {
      clothing: string[];
      accessories: string[];
    };
  };
  email: {
    smtp: {
      host: string;
      port: string;
      username: string;
      password: string;
      fromEmail: string;
      fromName: string;
    };
    sms: {
      enabled: boolean;
      twilioAccountSid: string;
      twilioAuthToken: string;
      twilioPhoneNumber: string;
      notifications: {
        orderPlaced: boolean;
        orderShipped: boolean;
        outForDelivery: boolean;
        delivered: boolean;
      };
    };
  };
  seo: {
    meta: {
      title: string;
      description: string;
      keywords: string;
      canonicalUrl: string;
    };
    openGraph: {
      title: string;
      description: string;
      image: string;
      twitterCardType: string;
    };
    sitemap: {
      autoGenerate: boolean;
    };
    schema: {
      organization: boolean;
      product: boolean;
      breadcrumb: boolean;
    };
  };
  analytics: {
    googleAnalytics: {
      enabled: boolean;
      measurementId: string;
      enhancedEcommerce: boolean;
      trackUserId: boolean;
    };
    facebookPixel: {
      enabled: boolean;
      pixelId: string;
      events: {
        pageView: boolean;
        viewContent: boolean;
        addToCart: boolean;
        initiateCheckout: boolean;
        purchase: boolean;
      };
    };
    other: {
      googleTagManager: string;
      tiktokPixel: string;
      pinterestTag: string;
      hotjarSiteId: string;
      customHeaderScript: string;
    };
  };
  badges: {
    display: {
      position: string;
      size: string;
      shape: string;
      allowMultiple: boolean;
      maxBadges: string;
    };
  };
  /** Optional marketing copy; stored in site config when set from admin. */
  emailTemplates?: {
    orderConfirmation: { subject: string; body: string };
    welcome: { subject: string; body: string };
  };
}

const defaultConfig: SiteConfig = {
  general: {
    siteName: 'Rloco',
    tagline: 'Modern Luxury Fashion',
    description: 'Rloco is a premium fashion retailer offering curated collections of luxury apparel, accessories, and beauty products.',
    email: 'hello@rloco.com',
    phone: '+1 (555) 123-4567',
    supportEmail: 'support@rloco.com',
    address: '123 Fashion Avenue, New York, NY 10001, United States',
    socialMedia: {
      instagram: '@rloco',
      facebook: 'facebook.com/rloco',
      twitter: '@rloco',
      pinterest: 'pinterest.com/rloco',
      youtube: 'youtube.com/@rloco',
    },
    currency: 'usd',
    timezone: 'america/new_york',
    dateFormat: 'mm/dd/yyyy',
    multiCurrency: true,
    autoDetectLocation: true,
    maintenanceMode: false,
    maintenanceMessage: "We're currently performing scheduled maintenance. We'll be back soon!",
  },
  design: {
    colors: {
      primary: '#B4770E',
      primaryLight: '#D4970E',
      primaryDark: '#8B5A0B',
      secondary: '#000000',
      secondaryGray: '#666666',
      secondaryLightGray: '#999999',
      dominant: '#FFFFFF',
      dominantOffWhite: '#F8F8F8',
      dominantLight: '#F5F5F5',
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Inter',
      baseFontSize: '16',
      lineHeight: '1.5',
      letterSpacing: 'normal',
    },
    layout: {
      borderRadius: '0',
      containerWidth: '1920',
      sectionSpacing: 'large',
    },
    animations: {
      enabled: true,
      speed: 'normal',
      hoverEffects: 'subtle',
    },
  },
  homepage: {
    hero: {
      enabled: true,
      heading: 'Timeless Elegance Redefined',
      subheading: 'Discover our curated collection of luxury fashion pieces',
      primaryButtonText: 'Shop Collection',
      primaryButtonLink: '/shop',
      backgroundImage: '',
      style: 'fullscreen',
    },
    sections: {
      featuredProducts: true,
      newArrivals: true,
      shopByCategory: true,
      bestSellers: true,
      editorialFeatures: true,
      promotionalBanner: true,
      testimonials: true,
      brandStory: false,
      instagramFeed: false,
      newsletterSignup: true,
    },
    featuredCollections: ['new', 'women', 'accessories'],
  },
  navigation: {
    header: {
      style: 'transparent',
      height: '80',
      sticky: true,
      showSearch: true,
      showCurrency: true,
    },
    megaMenu: {
      style: 'compact',
    },
    footer: {
      style: 'multi-column',
      showNewsletter: true,
      showSocial: true,
      showPaymentIcons: true,
      copyrightText: '© 2026 Rloco. All rights reserved.',
    },
  },
  email: {
    smtp: {
      host: 'smtp.sendgrid.net',
      port: '587',
      username: 'apikey',
      password: '',
      fromEmail: 'noreply@rloco.com',
      fromName: 'Rloco',
    },
    sms: {
      enabled: false,
      twilioAccountSid: '',
      twilioAuthToken: '',
      twilioPhoneNumber: '',
      notifications: {
        orderPlaced: false,
        orderShipped: true,
        outForDelivery: true,
        delivered: true,
      },
    },
  },
  seo: {
    meta: {
      title: 'Rloco - Modern Luxury Fashion',
      description: 'Shop curated luxury fashion at Rloco. Discover timeless pieces from the world\'s finest designers. Free shipping on orders over $100.',
      keywords: 'luxury fashion, designer clothing, high-end fashion, premium accessories',
      canonicalUrl: 'https://rloco.com',
    },
    openGraph: {
      title: 'Rloco - Modern Luxury Fashion',
      description: 'Discover curated luxury fashion collections at Rloco.',
      image: '',
      twitterCardType: 'summary_large',
    },
    sitemap: {
      autoGenerate: true,
    },
    schema: {
      organization: true,
      product: true,
      breadcrumb: true,
    },
  },
  analytics: {
    googleAnalytics: {
      enabled: true,
      measurementId: 'G-XXXXXXXXXX',
      enhancedEcommerce: true,
      trackUserId: true,
    },
    facebookPixel: {
      enabled: true,
      pixelId: '1234567890123456',
      events: {
        pageView: true,
        viewContent: true,
        addToCart: true,
        initiateCheckout: true,
        purchase: true,
      },
    },
    other: {
      googleTagManager: '',
      tiktokPixel: '',
      pinterestTag: '',
      hotjarSiteId: '',
      customHeaderScript: '',
    },
  },
  badges: {
    display: {
      position: 'top-left',
      size: 'medium',
      shape: 'rounded',
      allowMultiple: true,
      maxBadges: '2',
    },
  },
  emailTemplates: {
    orderConfirmation: {
      subject: 'Your order #{orderNumber} — R-Loko',
      body: 'Thank you for your order. We will email you when it ships.',
    },
    welcome: {
      subject: 'Welcome to R-Loko',
      body: 'Thank you for creating an account. We are glad you are here.',
    },
  },
  categories: {
    women: {
      clothing: ['Dresses', 'Tops', 'Bottoms', 'Outerwear', 'Knitwear'],
      accessories: ['Shoes', 'Jewelry', 'Bags'],
    },
    men: {
      clothing: ['Shirts', 'Tops', 'Bottoms', 'Outerwear', 'Knitwear'],
      accessories: ['Shoes', 'Accessories'],
    },
  },
};

/** Default site config (aligned with backend `getDefaultConfig`). */
export const defaultSiteConfig: SiteConfig = defaultConfig;

// Type-safe update functions
type ConfigSection = keyof SiteConfig;
type ConfigUpdate<T extends ConfigSection> = Partial<SiteConfig[T]>;

interface SiteConfigContextType {
  config: SiteConfig;
  loading: boolean;
  refreshConfig: () => Promise<void>;
  /** Full config setter (for admin editors that need deep immutable updates). */
  setSiteConfig: Dispatch<SetStateAction<SiteConfig>>;
  updateConfig: <T extends ConfigSection>(section: T, data: ConfigUpdate<T>) => void;
  updateNestedConfig: <T extends ConfigSection>(
    section: T,
    subsection: string,
    data: Record<string, unknown>
  ) => void;
  resetConfig: () => void;
  exportConfig: () => string;
  importConfig: (configJson: string) => void;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(undefined);

export const SiteConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);

  // Fetch config function (reusable)
  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      const configResponse = await api.get('/config').catch(() => null);

      // Merge API config with defaults
      let mergedConfig = { ...defaultConfig };
      
      if (configResponse?.data) {
        // Deep merge API config data
        mergedConfig = {
          ...mergedConfig,
          ...configResponse.data,
          // Ensure nested objects are properly merged
          general: {
            ...mergedConfig.general,
            ...(configResponse.data.general || {}),
            socialMedia: {
              ...mergedConfig.general.socialMedia,
              ...(configResponse.data.general?.socialMedia || {}),
            },
          },
          design: { 
            ...mergedConfig.design, 
            ...(configResponse.data.design || {}),
            // Deep merge colors to ensure all color values are preserved
            colors: {
              ...mergedConfig.design.colors,
              ...(configResponse.data.design?.colors || {}),
            },
            typography: {
              ...mergedConfig.design.typography,
              ...(configResponse.data.design?.typography || {}),
            },
            layout: {
              ...mergedConfig.design.layout,
              ...(configResponse.data.design?.layout || {}),
            },
            animations: {
              ...mergedConfig.design.animations,
              ...(configResponse.data.design?.animations || {}),
            },
          },
          homepage: { ...mergedConfig.homepage, ...(configResponse.data.homepage || {}) },
          navigation: { ...mergedConfig.navigation, ...(configResponse.data.navigation || {}) },
          categories: { 
            ...mergedConfig.categories, 
            ...(configResponse.data.categories || {}),
            women: { 
              ...mergedConfig.categories.women, 
              ...(configResponse.data.categories?.women || {}),
              clothing: Array.isArray(configResponse.data.categories?.women?.clothing) 
                ? configResponse.data.categories.women.clothing 
                : mergedConfig.categories.women.clothing,
              accessories: Array.isArray(configResponse.data.categories?.women?.accessories)
                ? configResponse.data.categories.women.accessories
                : mergedConfig.categories.women.accessories,
            },
            men: { 
              ...mergedConfig.categories.men, 
              ...(configResponse.data.categories?.men || {}),
              clothing: Array.isArray(configResponse.data.categories?.men?.clothing)
                ? configResponse.data.categories.men.clothing
                : mergedConfig.categories.men.clothing,
              accessories: Array.isArray(configResponse.data.categories?.men?.accessories)
                ? configResponse.data.categories.men.accessories
                : mergedConfig.categories.men.accessories,
            },
          },
        };
      }

      setConfig(mergedConfig);
      
      // Save to localStorage as backup
      try {
        localStorage.setItem('rloco_site_config', JSON.stringify(mergedConfig));
      } catch (e) {
        console.warn('Failed to save config to localStorage:', e);
      }
    } catch (err: any) {
      console.error('Failed to fetch config from API:', err);
      
      // Fallback to localStorage or default
      const saved = localStorage.getItem('rloco_site_config');
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as SiteConfig;
          setConfig(parsed);
        } catch (e) {
          console.error('Failed to parse saved config:', e);
          setConfig(defaultConfig);
        }
      } else {
        setConfig(defaultConfig);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch config from API on mount
  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  // Listen for storage events and config update signals
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'rloco_site_config' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as SiteConfig;
          setConfig(parsed);
        } catch (error) {
          console.error('Failed to parse config from storage event:', error);
        }
      }
      // Refresh config when update signal is detected
      if (e.key === 'rloco_config_updated') {
        fetchConfig();
      }
    };

    // Also listen for custom events (same-tab updates)
    const handleConfigUpdate = () => {
      fetchConfig();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('rloco_config_updated', handleConfigUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('rloco_config_updated', handleConfigUpdate);
    };
  }, [fetchConfig]);

  // Poll for config changes every 30 seconds (optional - can be disabled)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchConfig();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [fetchConfig]);

  // Use ref to track if this is the initial mount
  const isInitialMount = useRef(true);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Apply CSS variables immediately (no debounce needed)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      
      // Apply color variables
      root.style.setProperty('--color-primary', config.design.colors.primary);
      root.style.setProperty('--color-primary-light', config.design.colors.primaryLight);
      root.style.setProperty('--color-primary-dark', config.design.colors.primaryDark);
      
      // Apply typography
      root.style.setProperty('--font-heading', config.design.typography.headingFont);
      root.style.setProperty('--font-body', config.design.typography.bodyFont);
      root.style.setProperty('--font-size-base', `${config.design.typography.baseFontSize}px`);
      root.style.setProperty('--line-height', config.design.typography.lineHeight);
      
      // Apply layout
      root.style.setProperty('--border-radius', `${config.design.layout.borderRadius}px`);
      
      // Apply animation speed
      const speedMap: Record<string, string> = {
        slow: '800ms',
        normal: '500ms',
        fast: '300ms',
      };
      root.style.setProperty('--animation-speed', speedMap[config.design.animations.speed] || '500ms');
    }
  }, [config.design]);

  // Debounce localStorage saves to prevent excessive writes
  useEffect(() => {
    // Skip saving on initial mount (config already loaded from localStorage)
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Debounce save operation
    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem('rloco_site_config', JSON.stringify(config));
      } catch (error) {
        console.error('Failed to save config to localStorage:', error);
        // Handle quota exceeded error
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          console.warn('localStorage quota exceeded. Config changes may not be persisted.');
        }
      }
    }, 500); // Debounce: save 500ms after last change

    // Cleanup timeout on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [config]);

  const updateConfig = useCallback(<T extends ConfigSection>(
    section: T,
    data: ConfigUpdate<T>
  ) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));
  }, []);

  const updateNestedConfig = useCallback(<T extends ConfigSection>(
    section: T,
    subsection: string,
    data: Record<string, unknown>
  ) => {
    setConfig((prev) => {
      const sectionData = prev[section] as Record<string, unknown>;
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [subsection]: {
            ...(sectionData[subsection] as Record<string, unknown> || {}),
            ...data,
          },
        },
      };
    });
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(defaultConfig);
    // Immediately save default config (no debounce for reset)
    try {
      localStorage.setItem('rloco_site_config', JSON.stringify(defaultConfig));
    } catch (error) {
      console.error('Failed to reset config in localStorage:', error);
    }
  }, []);

  const exportConfig = useCallback(() => {
    return JSON.stringify(config, null, 2);
  }, [config]);

  const importConfig = useCallback((configJson: string) => {
    try {
      const imported = JSON.parse(configJson) as SiteConfig;
      // Basic validation - ensure it has required structure
      if (typeof imported === 'object' && imported !== null) {
        setConfig(imported);
        // Immediately save imported config (no debounce for import)
        try {
          localStorage.setItem('rloco_site_config', JSON.stringify(imported));
        } catch (error) {
          console.error('Failed to save imported config:', error);
        }
      } else {
        throw new Error('Invalid configuration structure');
      }
    } catch (e) {
      console.error('Failed to import config:', e);
      throw new Error('Invalid configuration JSON');
    }
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      config,
      loading,
      refreshConfig: fetchConfig,
      setSiteConfig: setConfig,
      updateConfig,
      updateNestedConfig,
      resetConfig,
      exportConfig,
      importConfig,
    }),
    [config, loading, fetchConfig, updateConfig, updateNestedConfig, resetConfig, exportConfig, importConfig]
  );

  return (
    <SiteConfigContext.Provider value={contextValue}>
      {children}
    </SiteConfigContext.Provider>
  );
};

export const useSiteConfig = () => {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error('useSiteConfig must be used within SiteConfigProvider');
  }
  return context;
};
