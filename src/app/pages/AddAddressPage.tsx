import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Home, Briefcase, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { addressService } from '../services/addressService';
import { AddressAutocompleteInput, lookupZipCode } from '../components/AddressAutocompleteInput';
import { PH } from '../lib/formPlaceholders';
import { getApiErrorMessage } from '../lib/apiErrors';
import { useCurrency } from '../context/CurrencyContext';
import { normalizeCountry } from '../lib/market';

interface FormData {
  name: string;
  mobile: string;
  address_line: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  type: 'HOME' | 'OFFICE' | 'OTHER';
  is_default: boolean;
}

const EMPTY_FORM: FormData = {
  name: '',
  mobile: '',
  address_line: '',
  address_line2: '',
  city: '',
  state: '',
  pincode: '',
  country: 'United States',
  type: 'HOME',
  is_default: false,
};

const ADDRESS_TYPES: { value: FormData['type']; label: string; icon: React.ReactNode }[] = [
  { value: 'HOME', label: 'Home', icon: <Home size={16} /> },
  { value: 'OFFICE', label: 'Office', icon: <Briefcase size={16} /> },
  { value: 'OTHER', label: 'Other', icon: <MapPin size={16} /> },
];

function readCountryFromStorage(): FormData['country'] {
  if (typeof localStorage === 'undefined') return 'United States';
  const c = localStorage.getItem('selectedCountry') as FormData['country'] | null;
  return c === 'India' || c === 'United States' ? c : 'United States';
}

export function AddAddressPage() {
  const navigate = useNavigate();
  const { country: storefrontCountry } = useCurrency();
  const [params] = useSearchParams();
  const editId = params.get('edit');
  const isEdit = !!editId;

  const [form, setForm] = useState<FormData>(() => ({
    ...EMPTY_FORM,
    country: readCountryFromStorage(),
  }));
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  // New address: follow selected storefront (India vs United States) like major marketplaces
  useEffect(() => {
    if (isEdit) return;
    setForm((f) => (f.country === storefrontCountry ? f : { ...f, country: storefrontCountry }));
  }, [isEdit, storefrontCountry]);

  useEffect(() => {
    if (!editId) return;
    setFetching(true);
    addressService
      .getById(editId)
      .then((addr) => {
        setForm({
          name: addr.name,
          mobile: addr.mobile,
          address_line: addr.address_line,
          address_line2: addr.address_line2 ?? '',
          city: addr.city,
          state: addr.state,
          pincode: addr.pincode,
          country: normalizeCountry(addr.country) ?? 'United States',
          type: addr.type,
          is_default: addr.is_default,
        });
      })
      .catch(() => {
        toast.error('Could not load address. Please try again.');
        navigate(-1);
      })
      .finally(() => setFetching(false));
  }, [editId, navigate]);

  const set = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => {
      const e = { ...prev };
      delete e[field];
      return e;
    });
  };

  const handleZipChange = async (value: string) => {
    const nc = normalizeCountry(form.country);
    const maxLen = nc === 'India' ? 6 : nc === 'United States' ? 9 : 10;
    const digits = value.replace(/\D/g, '').slice(0, maxLen);
    set('pincode', digits);
    if (digits.length === 5 && nc === 'United States') {
      const result = await lookupZipCode(digits, 'us');
      if (result) {
        set('city', result.city);
        set('state', result.state);
        toast.success(`Updated city and state for ${result.city}, ${result.state}`);
      }
    }
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    const phoneDigits = form.mobile.replace(/\D/g, '');
    const pinDigits = form.pincode.replace(/\D/g, '');
    const market = normalizeCountry(form.country);

    if (!form.name.trim()) e.name = 'Full name is required';
    else if (form.name.trim().length < 2) e.name = 'Enter at least 2 characters';

    if (!form.mobile.trim()) e.mobile = 'Phone number is required';
    else if (market === 'India' || market === 'United States') {
      if (!/^\d{10}$/.test(phoneDigits)) e.mobile = 'Enter a valid 10-digit number';
    } else if (phoneDigits.length < 8) e.mobile = 'Enter a valid phone number';
    else if (phoneDigits.length > 15) e.mobile = 'Phone number is too long';

    if (!form.address_line.trim()) e.address_line = 'Street address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state.trim()) e.state = 'State or region is required';

    if (!form.pincode.trim()) e.pincode = 'Pincode or ZIP is required';
    else if (market === 'India') {
      if (!/^\d{6}$/.test(pinDigits)) e.pincode = 'Enter a 6-digit PIN code';
    } else if (market === 'United States') {
      if (pinDigits.length !== 5 && pinDigits.length !== 9) {
        e.pincode = 'Enter a 5-digit ZIP or 9 digits (ZIP+4, no hyphens needed)';
      }
    } else if (pinDigits.length < 3) e.pincode = 'Enter a valid postal code';

    if (!form.country.trim()) e.country = 'Country is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      if (isEdit && editId) {
        await addressService.update(editId, {
          name: form.name,
          mobile: form.mobile,
          address_line: form.address_line,
          address_line2: form.address_line2 || undefined,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          country: form.country,
          type: form.type,
          is_default: form.is_default,
        });
        toast.success('Address updated');
      } else {
        await addressService.create({
          name: form.name,
          mobile: form.mobile,
          address_line: form.address_line,
          address_line2: form.address_line2 || undefined,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          country: form.country,
          type: form.type,
          is_default: form.is_default,
        });
        toast.success('Address saved');
      }
      navigate(-1);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, 'Failed to save address'));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-screen w-full min-w-0 items-center justify-center bg-background">
        <Loader2 size={24} className="animate-spin text-foreground/40" />
      </div>
    );
  }

  const Field = ({
    label,
    field,
    type = 'text',
    placeholder,
    required = true,
    maxLength,
    inputMode,
  }: {
    label: string;
    field: keyof FormData;
    type?: string;
    placeholder?: string;
    required?: boolean;
    maxLength?: number;
    inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  }) => (
    <div>
      <label className="block text-xs uppercase tracking-wider text-foreground/60 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        inputMode={inputMode}
        name={String(field)}
        value={form[field] as string}
        onChange={(e) => set(field, e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={field === 'name' ? 'name' : field === 'mobile' ? 'tel' : 'off'}
        aria-invalid={errors[field] ? true : undefined}
        className={`w-full h-11 px-3 bg-background border text-sm focus:outline-none transition-colors ${
          errors[field] ? 'border-red-400 focus:border-red-500' : 'border-foreground/20 focus:border-foreground'
        }`}
      />
      {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen w-full min-w-0 bg-background pb-mobile-nav">
      <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-6 sm:space-y-8">
          <section>
            <p className="text-xs uppercase tracking-widest text-foreground/50 mb-4">Contact</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full name" field="name" placeholder={PH.fullName} />
              <Field
                label="Phone number"
                field="mobile"
                placeholder={PH.phone}
                inputMode="numeric"
                maxLength={10}
              />
            </div>
          </section>

          <section>
            <p className="text-xs uppercase tracking-widest text-foreground/50 mb-4">Address</p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-foreground/60 mb-1.5">
                  Street / Area / Locality<span className="text-red-500 ml-0.5">*</span>
                </label>
                <AddressAutocompleteInput
                  value={form.address_line}
                  onChange={(val) => set('address_line', val)}
                  onAddressFill={(components) => {
                    if (components.addressLine) set('address_line', components.addressLine);
                    if (components.city) set('city', components.city);
                    if (components.state) set('state', components.state);
                    if (components.pincode) set('pincode', components.pincode);
                    if (components.country) set('country', components.country);
                  }}
                  placeholder={PH.streetAddress}
                  error={errors.address_line}
                  countryCode={normalizeCountry(form.country) === 'United States' ? 'us' : 'in'}
                  className="h-11 rounded-none text-sm border-foreground/20 focus:border-foreground focus:ring-0"
                />
              </div>

              <Field
                label="Apartment / Suite (optional)"
                field="address_line2"
                placeholder={PH.aptOptional}
                required={false}
              />
              <div className="grid grid-cols-2 gap-4">
                <Field label="City" field="city" placeholder={PH.city} />
                <Field label="State" field="state" placeholder={PH.state} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-foreground/60 mb-1.5">
                    {normalizeCountry(form.country) === 'India' ? 'PIN code' : normalizeCountry(form.country) === 'United States' ? 'ZIP code' : 'Postal code'}
                    <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    name="postal-code"
                    inputMode="numeric"
                    value={form.pincode}
                    onChange={(e) => handleZipChange(e.target.value)}
                    placeholder={normalizeCountry(form.country) === 'India' ? '6-digit PIN' : PH.zip}
                    maxLength={normalizeCountry(form.country) === 'India' ? 6 : 9}
                    autoComplete="postal-code"
                    aria-invalid={errors.pincode ? true : undefined}
                    className={`w-full h-11 px-3 bg-background border text-sm focus:outline-none transition-colors ${
                      errors.pincode
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-foreground/20 focus:border-foreground'
                    }`}
                  />
                  {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-foreground/60 mb-1.5" htmlFor="add-address-country">
                    Country<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <select
                    id="add-address-country"
                    value={form.country === 'India' || form.country === 'United States' ? form.country : 'United States'}
                    onChange={(e) => {
                      const v = e.target.value as FormData['country'];
                      set('country', v);
                      if (v === 'India' || v === 'United States') {
                        set('pincode', '');
                        const d = form.mobile.replace(/\D/g, '');
                        set('mobile', d.length > 10 ? d.slice(0, 10) : d);
                      }
                    }}
                    className={`w-full h-11 px-3 bg-background border text-sm focus:outline-none transition-colors ${
                      errors.country
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-foreground/20 focus:border-foreground'
                    }`}
                    aria-invalid={errors.country ? true : undefined}
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                  </select>
                  {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country}</p>}
                </div>
              </div>
            </div>
          </section>

          <section>
            <p className="text-xs uppercase tracking-widest text-foreground/50 mb-4">Save as</p>
            <div className="flex gap-3 flex-wrap">
              {ADDRESS_TYPES.map(({ value, label, icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set('type', value)}
                  className={`flex items-center gap-2 px-4 h-10 border text-xs uppercase tracking-wider transition-all ${
                    form.type === value
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-foreground/20 text-foreground/60 hover:border-foreground/50'
                  }`}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-start gap-3 p-4 border border-foreground/20">
              <input
                type="checkbox"
                id="default-address"
                checked={form.is_default}
                onChange={(e) => set('is_default', e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-foreground/30 accent-foreground"
              />
              <label htmlFor="default-address" className="cursor-pointer flex-1 min-w-0">
                <p className="text-sm font-medium">Set as default address</p>
                <p className="text-xs text-foreground/50 mt-0.5">We&apos;ll pre-select it at checkout and for deliveries</p>
              </label>
            </div>
          </section>

          <div className="pt-2 pb-8">
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 transition-all uppercase tracking-widest text-xs disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Saving…' : isEdit ? 'Update Address' : 'Save Address'}
            </button>
          </div>
        </div>
    </div>
  );
}
