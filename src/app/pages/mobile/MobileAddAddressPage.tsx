import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Home, Briefcase, Save } from 'lucide-react';
import { toast } from 'sonner';

interface AddressFormData {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  type: 'home' | 'work';
  isDefault: boolean;
}

export function MobileAddAddressPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AddressFormData>({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA',
    type: 'home',
    isDefault: false,
  });

  const handleInputChange = (field: keyof AddressFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.phone || !formData.street || !formData.city || !formData.state || !formData.zip) {
      toast.error('Please fill in all required fields');
      return;
    }

    // In a real app, this would save to a backend
    toast.success('Address saved successfully!');
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-24" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border/20">
        <div className="flex items-center justify-between h-14 px-4" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center"
          >
            <ChevronLeft size={20} />
          </motion.button>

          <h1 className="text-base font-medium">Add New Address</h1>

          <div className="w-9" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="pt-14 px-4 pb-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={20} className="text-primary" />
            <h2 className="text-lg font-medium">Delivery Details</h2>
          </div>
          <p className="text-sm text-foreground/60">
            Add a new delivery address for your orders
          </p>
        </motion.div>

        {/* Address Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <label className="block text-sm font-medium mb-3">Address Type</label>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => handleInputChange('type', 'home')}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                formData.type === 'home'
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-white'
              }`}
            >
              <Home size={24} className={formData.type === 'home' ? 'text-primary' : 'text-foreground/60'} />
              <span className={`text-sm font-medium ${formData.type === 'home' ? 'text-primary' : 'text-foreground/60'}`}>
                Home
              </span>
            </motion.button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => handleInputChange('type', 'work')}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                formData.type === 'work'
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-white'
              }`}
            >
              <Briefcase size={24} className={formData.type === 'work' ? 'text-primary' : 'text-foreground/60'} />
              <span className={`text-sm font-medium ${formData.type === 'work' ? 'text-primary' : 'text-foreground/60'}`}>
                Work
              </span>
            </motion.button>
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 mb-6"
        >
          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              required
            />
          </div>
        </motion.div>

        {/* Address Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4 mb-6"
        >
          <div>
            <label className="block text-sm font-medium mb-2">
              Street Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) => handleInputChange('street', e.target.value)}
              placeholder="123 Main Street, Apt 4B"
              className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="New York"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                placeholder="NY"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-2">
                ZIP Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.zip}
                onChange={(e) => handleInputChange('zip', e.target.value)}
                placeholder="10001"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                placeholder="USA"
                className="w-full px-4 py-3 rounded-xl border border-border bg-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
        </motion.div>

        {/* Default Address Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <label className="flex items-center justify-between p-4 rounded-2xl bg-white border border-border cursor-pointer">
            <div>
              <p className="text-sm font-medium">Set as default address</p>
              <p className="text-xs text-foreground/60 mt-1">
                Use this address for future orders
              </p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-foreground/10 rounded-full peer-checked:bg-primary transition-all"></div>
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all peer-checked:translate-x-5 shadow"></div>
            </div>
          </label>
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 bg-blue-50 rounded-2xl mb-6"
        >
          <p className="text-xs text-blue-800">
            💡 <strong>Tip:</strong> Make sure your address is complete and accurate to avoid delivery delays.
          </p>
        </motion.div>
      </form>

      {/* Sticky Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border/20 p-4">
        <motion.button
          type="submit"
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="w-full bg-primary text-white py-4 rounded-full font-medium text-base flex items-center justify-center gap-2 shadow-lg"
        >
          <Save size={20} />
          Save Address
        </motion.button>
      </div>
    </div>
  );
}
