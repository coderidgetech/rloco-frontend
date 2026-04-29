import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useCurrency } from '../context/CurrencyContext';
import { AddressAutocompleteInput, lookupZipCode } from './AddressAutocompleteInput';
import { PH } from '../lib/formPlaceholders';
import { normalizeCountry } from '../lib/market';

type MarketCountry = 'India' | 'United States';

interface Address {
  id: string;
  name: string;
  type: 'HOME' | 'OFFICE' | 'OTHER';
  addressLine: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  mobile: string;
  /** Shown in UI and sent to the API; must match [normalizeCountry] for checkout rules. */
  country: MarketCountry;
  cashOnDelivery?: boolean;
  isDefault?: boolean;
}


// US States list
const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Address) => void;
  editAddress?: Address | null;
  mode: 'add' | 'edit';
}

function toMarketCountry(c?: string | null, fallback: MarketCountry = 'United States'): MarketCountry {
  return normalizeCountry(c) ?? fallback;
}

export function AddressFormModal({ isOpen, onClose, onSave, editAddress, mode }: AddressFormModalProps) {
  const { country: storefrontCountry } = useCurrency();
  const isUS = (c: MarketCountry) => c === 'United States';

  const [formData, setFormData] = useState<Omit<Address, 'id'>>(() => ({
    name: '',
    type: 'HOME',
    addressLine: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    mobile: '',
    country: 'United States',
    cashOnDelivery: true,
    isDefault: false,
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editAddress && mode === 'edit') {
      setFormData({
        name: editAddress.name,
        type: editAddress.type,
        addressLine: editAddress.addressLine,
        addressLine2: editAddress.addressLine2 || '',
        city: editAddress.city,
        state: editAddress.state,
        pincode: editAddress.pincode,
        mobile: editAddress.mobile,
        country: toMarketCountry((editAddress as { country?: string }).country, storefrontCountry),
        cashOnDelivery: editAddress.cashOnDelivery,
        isDefault: editAddress.isDefault,
      });
    } else {
      setFormData({
        name: '',
        type: 'HOME',
        addressLine: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        mobile: '',
        country: storefrontCountry,
        cashOnDelivery: true,
        isDefault: false,
      });
    }
    setErrors({});
  }, [editAddress, mode, isOpen, storefrontCountry]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    const us = isUS(formData.country);
    const pinD = formData.pincode.replace(/\D/g, '');

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = us ? 'Phone number is required' : 'Mobile number is required';
    } else {
      const d = formData.mobile.replace(/\D/g, '');
      if (!/^\d{10}$/.test(d)) {
        newErrors.mobile = us
          ? 'Please enter a valid 10-digit phone number'
          : 'Please enter a valid 10-digit mobile number';
      }
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = us ? 'ZIP code is required' : 'Pincode is required';
    } else if (us) {
      if (pinD.length !== 5 && pinD.length !== 9) {
        newErrors.pincode = 'Enter a 5-digit ZIP or 9 digits (ZIP+4, no hyphens)';
      }
    } else {
      if (!/^\d{6}$/.test(pinD)) {
        newErrors.pincode = 'Please enter a valid 6-digit pincode';
      }
    }

    if (!formData.addressLine.trim()) {
      newErrors.addressLine = 'Street address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    const addressToSave: Address = {
      id: editAddress?.id || Date.now().toString(),
      ...formData,
    };

    onSave(addressToSave);
    onClose();
  };

  const handleInputChange = (field: keyof Omit<Address, 'id'>, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleZipChange = async (value: string) => {
    const us = isUS(formData.country);
    const digits = value.replace(/\D/g, '');
    const maxLen = us ? 9 : 6;
    if (digits.length > maxLen) return;
    handleInputChange('pincode', digits);
    if (us && digits.length === 5) {
      const result = await lookupZipCode(digits, 'us');
      if (result) {
        handleInputChange('city', result.city);
        handleInputChange('state', result.state);
        toast.success(`Filled: ${result.city}, ${result.state}`);
      }
    }
  };

  if (!isOpen) return null;

  const us = isUS(formData.country);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden pointer-events-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-border sticky top-0 bg-white z-10">
                <h2 className="text-lg md:text-xl font-medium uppercase tracking-wider">
                  {mode === 'edit' ? 'Edit Address' : 'Add New Address'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="space-y-4 md:space-y-6">
                  {/* Contact Details */}
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-4">
                      Contact Details
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Full Name <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder={PH.fullName}
                          className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                            errors.name ? 'border-destructive' : 'border-border'
                          }`}
                        />
                        {errors.name && (
                          <p className="text-xs text-destructive mt-1">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {us ? 'Phone number' : 'Mobile number'} <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="tel"
                          value={formData.mobile}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 10) {
                              handleInputChange('mobile', value);
                            }
                          }}
                          placeholder={PH.phone}
                          className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                            errors.mobile ? 'border-destructive' : 'border-border'
                          }`}
                        />
                        {errors.mobile && (
                          <p className="text-xs text-destructive mt-1">{errors.mobile}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Address Details */}
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-4">
                      Address details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" htmlFor="addr-modal-country">
                          Country <span className="text-destructive">*</span>
                        </label>
                        <select
                          id="addr-modal-country"
                          value={formData.country}
                          onChange={(e) => {
                            const c = e.target.value as MarketCountry;
                            setFormData((prev) => ({
                              ...prev,
                              country: c,
                              pincode: '',
                              mobile: prev.mobile.replace(/\D/g, '').slice(0, 10),
                            }));
                            if (errors.pincode) setErrors((o) => ({ ...o, pincode: '' }));
                          }}
                          className="w-full px-4 py-3 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        >
                          <option value="India">India</option>
                          <option value="United States">United States</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {us ? 'Street address' : 'Address (house no., building, street, area)'} <span className="text-destructive">*</span>
                        </label>
                        <AddressAutocompleteInput
                          value={formData.addressLine}
                          onChange={(val) => handleInputChange('addressLine', val)}
                          onAddressFill={(components) => {
                            handleInputChange('addressLine', components.addressLine);
                            if (components.city)    handleInputChange('city', components.city);
                            if (components.state)   handleInputChange('state', components.state);
                            if (components.pincode) handleInputChange('pincode', components.pincode);
                            if (components.country) {
                              handleInputChange('country', toMarketCountry(components.country, formData.country));
                            }
                          }}
                          placeholder={PH.streetAddress}
                          error={errors.addressLine}
                          countryCode={us ? 'us' : 'in'}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Apartment, suite, landmark (optional)
                        </label>
                        <input
                          type="text"
                          value={formData.addressLine2}
                          onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                          placeholder={PH.aptOptional}
                          className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                            errors.addressLine2 ? 'border-destructive' : 'border-border'
                          }`}
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            {us ? 'ZIP code' : 'PIN code'} <span className="text-destructive">*</span>
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            autoComplete="postal-code"
                            value={formData.pincode}
                            onChange={(e) => handleZipChange(e.target.value)}
                            placeholder={us ? '5 or 9 digits' : '6-digit PIN'}
                            maxLength={us ? 9 : 6}
                            className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                              errors.pincode ? 'border-destructive' : 'border-border'
                            }`}
                          />
                          {errors.pincode && (
                            <p className="text-xs text-destructive mt-1">{errors.pincode}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            City <span className="text-destructive">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            placeholder={PH.city}
                            className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                              errors.city ? 'border-destructive' : 'border-border'
                            }`}
                          />
                          {errors.city && (
                            <p className="text-xs text-destructive mt-1">{errors.city}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            State <span className="text-destructive">*</span>
                          </label>
                          {us ? (
                            <select
                              value={formData.state}
                              onChange={(e) => handleInputChange('state', e.target.value)}
                              className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                                errors.state ? 'border-destructive' : 'border-border'
                              }`}
                            >
                              <option value="">Select state</option>
                              {US_STATES.map((state) => (
                                <option key={state} value={state}>{state}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={formData.state}
                              onChange={(e) => handleInputChange('state', e.target.value)}
                              placeholder="State or UT"
                              className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                                errors.state ? 'border-destructive' : 'border-border'
                              }`}
                            />
                          )}
                          {errors.state && (
                            <p className="text-xs text-destructive mt-1">{errors.state}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Type */}
                  <div>
                    <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-4">
                      Save Address As
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {(['HOME', 'OFFICE', 'OTHER'] as const).map((type) => {
                        const label = type === 'HOME' ? 'Home' : type === 'OFFICE' ? 'Work' : 'Other';
                        return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleInputChange('type', type)}
                          className={`px-6 py-2 border rounded-full text-sm font-medium transition-all ${
                            formData.type === type
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'border-border hover:border-primary'
                          }`}
                        >
                          {label}
                        </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Additional Options */}
                  <div className="space-y-3 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isDefault}
                        onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                        className="w-5 h-5 rounded border-2 border-foreground/20 checked:bg-primary checked:border-primary cursor-pointer accent-primary"
                      />
                      <span className="text-sm">Make this my default address</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.cashOnDelivery}
                        onChange={(e) => handleInputChange('cashOnDelivery', e.target.checked)}
                        className="w-5 h-5 rounded border-2 border-foreground/20 checked:bg-primary checked:border-primary cursor-pointer accent-primary"
                      />
                      <span className="text-sm">Enable Cash on Delivery for this address</span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-border">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 px-6 py-3 border border-border rounded-lg text-sm uppercase tracking-wider font-medium hover:border-foreground transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-[#FF3F6C] hover:bg-[#E6365F] text-white rounded-lg text-sm uppercase tracking-wider font-medium transition-colors"
                  >
                    {mode === 'edit' ? 'Update Address' : 'Save Address'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}