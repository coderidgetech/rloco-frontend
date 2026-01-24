import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useCurrency } from '../context/CurrencyContext';

interface Address {
  id: string;
  name: string;
  type: 'HOME' | 'OFFICE' | 'OTHER';
  addressLine: string;
  addressLine2?: string; // For US: Apt/Suite
  city: string;
  state: string;
  pincode: string; // or zipCode for US
  mobile: string;
  cashOnDelivery?: boolean;
  isDefault?: boolean;
}

// TODO: Integrate Google Places API for address autocomplete
// For now, address suggestions are disabled - users must enter addresses manually
// To enable: Add Google Places API key and implement autocomplete
const US_ADDRESS_SUGGESTIONS: Array<{ street: string; city: string; state: string; zip: string }> = [];

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

export function AddressFormModal({ isOpen, onClose, onSave, editAddress, mode }: AddressFormModalProps) {
  const { currency } = useCurrency();
  const isUS = currency === 'USD';
  
  const [formData, setFormData] = useState<Omit<Address, 'id'>>(({
    name: '',
    type: 'HOME',
    addressLine: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    mobile: '',
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
        cashOnDelivery: editAddress.cashOnDelivery,
        isDefault: editAddress.isDefault,
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: '',
        type: 'HOME',
        addressLine: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        mobile: '',
        cashOnDelivery: true,
        isDefault: false,
      });
    }
    setErrors({});
  }, [editAddress, mode, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = isUS ? 'Phone number is required' : 'Mobile number is required';
    } else if (isUS) {
      // US phone validation (10 digits)
      if (!/^[0-9]{10}$/.test(formData.mobile.replace(/\s/g, ''))) {
        newErrors.mobile = 'Please enter a valid 10-digit phone number';
      }
    } else {
      // India phone validation
      if (!/^[0-9]{10}$/.test(formData.mobile.replace(/\s/g, ''))) {
        newErrors.mobile = 'Please enter a valid 10-digit mobile number';
      }
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = isUS ? 'ZIP Code is required' : 'Pincode is required';
    } else if (isUS) {
      // US ZIP code validation (5 digits)
      if (!/^[0-9]{5}$/.test(formData.pincode)) {
        newErrors.pincode = 'Please enter a valid 5-digit ZIP code';
      }
    } else {
      // India pincode validation (6 digits)
      if (!/^[0-9]{6}$/.test(formData.pincode)) {
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

  const addressInputRef = useRef<HTMLInputElement>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<typeof US_ADDRESS_SUGGESTIONS>([]);

  const handleAddressInputChange = (value: string) => {
    handleInputChange('addressLine', value);
    // TODO: Integrate Google Places API for real address autocomplete
    // For now, address suggestions are disabled
    // if (isUS && value.length > 2) {
    //   // Use Google Places API to fetch address suggestions
    //   // const suggestions = await fetchAddressSuggestions(value);
    //   // setAddressSuggestions(suggestions);
    // }
    setAddressSuggestions([]);
  };

  const selectAddressSuggestion = (suggestion: typeof US_ADDRESS_SUGGESTIONS[number]) => {
    handleInputChange('addressLine', suggestion.street);
    handleInputChange('city', suggestion.city);
    handleInputChange('state', suggestion.state);
    handleInputChange('pincode', suggestion.zip);
    setAddressSuggestions([]);
  };

  if (!isOpen) return null;

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
                          placeholder="Enter full name"
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
                          {isUS ? 'Phone Number' : 'Mobile Number'} <span className="text-destructive">*</span>
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
                          placeholder={isUS ? '10-digit phone number' : '10-digit mobile number'}
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
                      Address Details
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          {isUS ? 'Street Address' : 'Address (House No, Building, Street, Area)'} <span className="text-destructive">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.addressLine}
                            onChange={(e) => handleAddressInputChange(e.target.value)}
                            placeholder={isUS ? 'Enter street address' : 'Enter complete address'}
                            rows={isUS ? 2 : 3}
                            className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none ${
                              errors.addressLine ? 'border-destructive' : 'border-border'
                            }`}
                          />
                          {addressSuggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-border shadow-md z-10 max-h-40 overflow-y-auto">
                              {addressSuggestions.map((suggestion, index) => (
                                <div
                                  key={index}
                                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                  onClick={() => selectAddressSuggestion(suggestion)}
                                >
                                  {suggestion.street}, {suggestion.city}, {suggestion.state} {suggestion.zip}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {errors.addressLine && (
                          <p className="text-xs text-destructive mt-1">{errors.addressLine}</p>
                        )}
                      </div>

                      {isUS && (
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Apt/Suite (Optional)
                          </label>
                          <input
                            type="text"
                            value={formData.addressLine2}
                            onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                            placeholder="Apartment, suite, unit, etc."
                            className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                              errors.addressLine2 ? 'border-destructive' : 'border-border'
                            }`}
                          />
                        </div>
                      )}

                      <div className="grid md:grid-cols-3 gap-4">
                        <div className={isUS ? 'md:col-span-1' : 'md:col-span-1'}>
                          <label className="block text-sm font-medium mb-2">
                            {isUS ? 'ZIP Code' : 'Pincode'} <span className="text-destructive">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.pincode}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '');
                              const maxLength = isUS ? 5 : 6;
                              if (value.length <= maxLength) {
                                handleInputChange('pincode', value);
                              }
                            }}
                            placeholder={isUS ? '5-digit ZIP' : '6-digit pincode'}
                            maxLength={isUS ? 5 : 6}
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
                            placeholder="Enter city"
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
                          <select
                            value={formData.state}
                            onChange={(e) => handleInputChange('state', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
                              errors.state ? 'border-destructive' : 'border-border'
                            }`}
                          >
                            <option value="">Select State</option>
                            {isUS ? US_STATES.map(state => (
                              <option key={state} value={state}>{state}</option>
                            )) : (
                              <option value={formData.state}>{formData.state}</option>
                            )}
                          </select>
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
                    <div className="flex gap-3">
                      {(['HOME', 'OFFICE', 'OTHER'] as const).map((type) => (
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
                          {type}
                        </button>
                      ))}
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