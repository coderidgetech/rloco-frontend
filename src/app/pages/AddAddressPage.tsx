import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Home, Briefcase, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { addressService } from '../services/addressService';
import { AddressAutocompleteInput, lookupZipCode } from '../components/AddressAutocompleteInput';

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
  country: 'India',
  type: 'HOME',
  is_default: false,
};

const ADDRESS_TYPES: { value: FormData['type']; label: string; icon: React.ReactNode }[] = [
  { value: 'HOME', label: 'Home', icon: <Home size={16} /> },
  { value: 'OFFICE', label: 'Office', icon: <Briefcase size={16} /> },
  { value: 'OTHER', label: 'Other', icon: <MapPin size={16} /> },
];

export function AddAddressPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const editId = params.get('edit');
  const isEdit = !!editId;

  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

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
          country: addr.country,
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
    const digits = value.replace(/\D/g, '').slice(0, 10);
    set('pincode', digits);
    if (digits.length === 5 && (form.country === 'US' || form.country === 'United States')) {
      const result = await lookupZipCode(digits, 'us');
      if (result) {
        set('city', result.city);
        set('state', result.state);
        toast.success(`Filled: ${result.city}, ${result.state}`);
      }
    }
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.mobile.trim()) e.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(form.mobile.replace(/\D/g, '')))
      e.mobile = 'Enter a valid 10-digit number';
    if (!form.address_line.trim()) e.address_line = 'Street address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.state.trim()) e.state = 'State is required';
    if (!form.pincode.trim()) e.pincode = 'Pincode / ZIP is required';
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
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : undefined;
      toast.error(msg ?? (err instanceof Error ? err.message : 'Failed to save address'));
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
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
        value={form[field] as string}
        onChange={(e) => set(field, e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full h-11 px-3 bg-background border text-sm focus:outline-none transition-colors ${
          errors[field] ? 'border-red-400 focus:border-red-500' : 'border-foreground/20 focus:border-foreground'
        }`}
      />
      {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-mobile-nav">
      <div className="max-w-2xl mx-auto px-4 py-4 sm:py-6 space-y-6 sm:space-y-8">
          <section>
            <p className="text-xs uppercase tracking-widest text-foreground/50 mb-4">Contact</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full name" field="name" placeholder="Full name" />
              <Field
                label="Phone number"
                field="mobile"
                placeholder="Phone number"
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
                  placeholder="Street address"
                  error={errors.address_line}
                  countryCode={form.country === 'US' || form.country === 'United States' ? 'us' : 'in'}
                  className="h-11 rounded-none text-sm border-foreground/20 focus:border-foreground focus:ring-0"
                />
              </div>

              <Field
                label="Apartment / Suite (optional)"
                field="address_line2"
                placeholder="Apt, suite, or building (optional)"
                required={false}
              />
              <div className="grid grid-cols-2 gap-4">
                <Field label="City" field="city" placeholder="City" />
                <Field label="State" field="state" placeholder="State" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-foreground/60 mb-1.5">
                    Pincode / ZIP<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={form.pincode}
                    onChange={(e) => handleZipChange(e.target.value)}
                    placeholder="ZIP / Postal code"
                    maxLength={10}
                    className={`w-full h-11 px-3 bg-background border text-sm focus:outline-none transition-colors ${
                      errors.pincode
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-foreground/20 focus:border-foreground'
                    }`}
                  />
                  {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
                </div>
                <Field label="Country" field="country" placeholder="Country" />
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
            <label className="flex items-center justify-between p-4 border border-foreground/20 cursor-pointer hover:bg-foreground/5 transition-colors">
              <div>
                <p className="text-sm">Set as default address</p>
                <p className="text-xs text-foreground/50 mt-0.5">Used automatically at checkout</p>
              </div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => set('is_default', !form.is_default)}
                onKeyDown={(e) => e.key === 'Enter' && set('is_default', !form.is_default)}
                className={`relative w-11 h-6 transition-colors shrink-0 ${form.is_default ? 'bg-foreground' : 'bg-foreground/20'}`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-background transition-all ${form.is_default ? 'left-[22px]' : 'left-0.5'}`}
                />
              </div>
            </label>
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
