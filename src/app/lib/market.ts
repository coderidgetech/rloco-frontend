export type SupportedCountry = 'India' | 'United States';
export type SupportedCurrency = 'INR' | 'USD';

export function normalizeCountry(input?: string | null): SupportedCountry | null {
  const raw = (input ?? '').trim().toLowerCase();
  if (!raw) return null;
  if (raw === 'india' || raw === 'in') return 'India';
  if (raw === 'united states' || raw === 'us' || raw === 'usa') return 'United States';
  return null;
}

export function expectedCurrencyForCountry(input?: string | null): SupportedCurrency | null {
  const country = normalizeCountry(input);
  if (!country) return null;
  return country === 'India' ? 'INR' : 'USD';
}

export function isCountryCurrencyMatch(countryInput: string, currency: SupportedCurrency): boolean {
  const expected = expectedCurrencyForCountry(countryInput);
  return expected === currency;
}
