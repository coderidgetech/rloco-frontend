import api from '../lib/api';

// Master data types
export interface Country {
  code: string;
  name: string;
  phoneCode: string;
  currency: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  exchangeRate?: number; // Exchange rate to base currency (USD)
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  cost: number;
  estimatedDays: number;
  countries: string[]; // Country codes
  isActive: boolean;
}

export interface TaxRate {
  id: string;
  country: string;
  state?: string;
  rate: number; // Percentage (e.g., 8.5 for 8.5%)
  type: 'standard' | 'reduced' | 'zero';
  isActive: boolean;
}

// Common countries list (can be extended or fetched from API)
const COMMON_COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', phoneCode: '+1', currency: 'USD' },
  { code: 'IN', name: 'India', phoneCode: '+91', currency: 'INR' },
  { code: 'GB', name: 'United Kingdom', phoneCode: '+44', currency: 'GBP' },
  { code: 'CA', name: 'Canada', phoneCode: '+1', currency: 'CAD' },
  { code: 'AU', name: 'Australia', phoneCode: '+61', currency: 'AUD' },
  { code: 'DE', name: 'Germany', phoneCode: '+49', currency: 'EUR' },
  { code: 'FR', name: 'France', phoneCode: '+33', currency: 'EUR' },
  { code: 'IT', name: 'Italy', phoneCode: '+39', currency: 'EUR' },
  { code: 'ES', name: 'Spain', phoneCode: '+34', currency: 'EUR' },
  { code: 'JP', name: 'Japan', phoneCode: '+81', currency: 'JPY' },
  { code: 'CN', name: 'China', phoneCode: '+86', currency: 'CNY' },
  { code: 'BR', name: 'Brazil', phoneCode: '+55', currency: 'BRL' },
  { code: 'MX', name: 'Mexico', phoneCode: '+52', currency: 'MXN' },
  { code: 'AE', name: 'United Arab Emirates', phoneCode: '+971', currency: 'AED' },
  { code: 'SG', name: 'Singapore', phoneCode: '+65', currency: 'SGD' },
];

// Common currencies
const COMMON_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
];

export const masterDataService = {
  // Countries
  async getCountries(): Promise<Country[]> {
    try {
      // Try to fetch from API if endpoint exists
      const response = await api.get<Country[]>('/master/countries');
      return response.data;
    } catch (error) {
      // Fallback to static list
      return COMMON_COUNTRIES;
    }
  },

  getCountriesSync(): Country[] {
    return COMMON_COUNTRIES;
  },

  // Currencies
  async getCurrencies(): Promise<Currency[]> {
    try {
      const response = await api.get<Currency[]>('/master/currencies');
      return response.data;
    } catch (error) {
      return COMMON_CURRENCIES;
    }
  },

  getCurrenciesSync(): Currency[] {
    return COMMON_CURRENCIES;
  },

  // Shipping Methods - fetch from API
  async getShippingMethods(countryCode?: string): Promise<ShippingMethod[]> {
    try {
      const response = await api.get<ShippingMethod[]>('/shipping/methods', {
        params: countryCode ? { country: countryCode } : {},
      });
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch shipping methods:', error);
      return [];
    }
  },

  // Tax Rates - fetch from API
  async getTaxRates(countryCode?: string, state?: string): Promise<TaxRate[]> {
    try {
      const response = await api.get<TaxRate[]>('/tax/rates', {
        params: {
          ...(countryCode && { country: countryCode }),
          ...(state && { state }),
        },
      });
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch tax rates:', error);
      return [];
    }
  },
};
