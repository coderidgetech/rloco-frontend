import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Country = 'India' | 'United States';
type Currency = 'INR' | 'USD';
export type MarketCode = 'IN' | 'US';

interface CurrencyContextType {
  country: Country;
  currency: Currency;
  /** API/catalog market (matches backend `market` query param). */
  market: MarketCode;
  setCountry: (country: Country) => void;
  formatPrice: (usdPrice: number, inrPrice?: number) => string;
  convertPrice: (usdPrice: number, inrPrice?: number) => number;
  formatAmount: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [country, setCountryState] = useState<Country>('United States'); // Default to US/USD
  const [currency, setCurrency] = useState<Currency>('USD'); // Default to USD
  const market: MarketCode = country === 'India' ? 'IN' : 'US';

  // Load saved country from localStorage on mount
  useEffect(() => {
    const savedCountry = localStorage.getItem('selectedCountry') as Country;
    if (savedCountry) {
      setCountryState(savedCountry);
      setCurrency(savedCountry === 'India' ? 'INR' : 'USD');
    }
  }, []);

  const setCountry = (newCountry: Country) => {
    setCountryState(newCountry);
    setCurrency(newCountry === 'India' ? 'INR' : 'USD');
    localStorage.setItem('selectedCountry', newCountry);
  };

  // Convert to the current currency
  // If inrPrice is provided, use it for INR, otherwise calculate
  const convertPrice = (usdPrice: number, inrPrice?: number): number => {
    if (currency === 'INR') {
      return inrPrice || usdPrice * 75;
    }
    return usdPrice;
  };

  // Format price with currency symbol
  const formatPrice = (usdPrice: number, inrPrice?: number): string => {
    const price = convertPrice(usdPrice, inrPrice);
    
    if (currency === 'USD') {
      return `$${price.toFixed(2)}`;
    }
    return `₹${Math.round(price).toLocaleString('en-IN')}`;
  };

  // Format amount with currency symbol (for already converted amounts in current currency)
  const formatAmount = (amount: number): string => {
    if (currency === 'USD') {
      return `$${amount.toFixed(2)}`;
    }
    return `₹${Math.round(amount).toLocaleString('en-IN')}`;
  };

  return (
    <CurrencyContext.Provider value={{ country, currency, market, setCountry, formatPrice, convertPrice, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

export default CurrencyProvider;