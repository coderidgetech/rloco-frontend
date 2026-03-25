import { motion } from 'motion/react';
import { Phone, ChevronDown, Search } from 'lucide-react';
import { DIAL_COUNTRIES, type DialCountry } from '@/app/lib/dialCountries';
import { PH } from '@/app/lib/formPlaceholders';

export type { DialCountry };

type Variant = 'desktop' | 'modal' | 'mobile';

const variantClass: Record<
  Variant,
  { trigger: string; input: string; chevron: number; searchIcon: number; dropdown: string }
> = {
  desktop: {
    trigger:
      'h-[54px] px-3 bg-foreground/5 border border-border/30 shadow-sm rounded-xl hover:bg-foreground/10 transition-all flex items-center gap-2 min-w-[90px]',
    input:
      'w-full pl-11 pr-4 py-3.5 bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-[54px]',
    chevron: 16,
    searchIcon: 18,
    dropdown:
      'absolute left-0 top-full mt-2 w-80 max-w-[calc(100vw-48px)] bg-white border border-border/30 shadow-2xl rounded-2xl overflow-hidden z-50',
  },
  modal: {
    trigger:
      'h-[52px] px-3 bg-white border border-border/30 shadow-sm hover:border-border/50 rounded-xl transition-all flex items-center gap-2 min-w-[110px]',
    input:
      'w-full pl-11 pr-4 py-3 bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all',
    chevron: 14,
    searchIcon: 16,
    dropdown:
      'absolute left-0 top-full mt-2 w-80 bg-white border border-border/30 shadow-2xl rounded-lg overflow-hidden z-50',
  },
  mobile: {
    trigger:
      'h-[54px] px-3 bg-foreground/5 border border-border/30 shadow-sm rounded-xl hover:bg-foreground/10 transition-all flex items-center gap-2 min-w-[90px]',
    input:
      'w-full pl-11 pr-4 py-3.5 bg-foreground/5 border border-border/30 shadow-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-[54px]',
    chevron: 16,
    searchIcon: 18,
    dropdown:
      'absolute left-0 top-full mt-2 w-80 max-w-[calc(100vw-48px)] bg-white border border-border/30 shadow-2xl rounded-2xl overflow-hidden z-50',
  },
};

type Props = {
  variant?: Variant;
  localPhone: string;
  onLocalPhoneChange: (value: string) => void;
  selectedCountry: DialCountry;
  onSelectCountry: (c: DialCountry) => void;
  showPicker: boolean;
  setShowPicker: (open: boolean) => void;
  countrySearch: string;
  setCountrySearch: (q: string) => void;
  localPlaceholder?: string;
  listMaxHeightClass?: string;
};

function filterCountries(search: string) {
  const q = search.toLowerCase();
  return DIAL_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.dialCode.includes(search) ||
      c.code.toLowerCase().includes(q)
  );
}

export function PhoneCountryRow({
  variant = 'desktop',
  localPhone,
  onLocalPhoneChange,
  selectedCountry,
  onSelectCountry,
  showPicker,
  setShowPicker,
  countrySearch,
  setCountrySearch,
  localPlaceholder = PH.phoneLocal,
  listMaxHeightClass,
}: Props) {
  const vc = variantClass[variant];
  const filtered = filterCountries(countrySearch);
  const listClass = listMaxHeightClass ?? (variant === 'modal' ? 'max-h-64' : 'max-h-72');

  return (
    <div className="flex gap-2">
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className={vc.trigger}
        >
          <span className={variant === 'modal' ? 'text-xl' : 'text-2xl'}>{selectedCountry.flag}</span>
          <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
          <ChevronDown
            size={vc.chevron}
            className={`text-foreground/40 transition-transform ${showPicker ? 'rotate-180' : ''}`}
          />
        </button>

        {showPicker && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowPicker(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={vc.dropdown}
            >
              <div className="p-3 border-b border-border/20 bg-muted/10">
                <div className="relative">
                  <Search
                    size={vc.searchIcon}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40"
                  />
                  <input
                    type="text"
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    placeholder={PH.searchCountries}
                    className="w-full pl-10 pr-3 py-2.5 bg-white border border-border/30 shadow-sm rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B4770E]/20 focus:border-[#B4770E]"
                  />
                </div>
              </div>
              <div className={`${listClass} overflow-y-auto`}>
                {filtered.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      onSelectCountry(country);
                      setShowPicker(false);
                      setCountrySearch('');
                    }}
                    className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/30 transition-colors ${
                      selectedCountry.code === country.code ? 'bg-[#B4770E]/10' : ''
                    }`}
                  >
                    <span className={variant === 'modal' ? 'text-xl' : 'text-2xl'}>{country.flag}</span>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{country.name}</div>
                      <div className="text-xs text-foreground/50">{country.code}</div>
                    </div>
                    <span className="text-sm font-medium text-foreground/70">{country.dialCode}</span>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="px-4 py-8 text-center text-sm text-foreground/40">No countries found</div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </div>

      <div className="flex-1 relative">
        <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
        <input
          type="tel"
          value={localPhone}
          onChange={(e) => onLocalPhoneChange(e.target.value)}
          placeholder={localPlaceholder}
          className={vc.input}
          autoComplete="tel-national"
        />
      </div>
    </div>
  );
}
