import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Plus, Check, Edit2, Trash2, Home, Briefcase } from 'lucide-react';
interface Address {
  id: number;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  type: 'home' | 'work';
  isDefault: boolean;
}

const mockAddresses: Address[] = [
  {
    id: 1,
    name: 'John Doe',
    street: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'USA',
    phone: '+1 (555) 123-4567',
    type: 'home',
    isDefault: true,
  },
  {
    id: 2,
    name: 'John Doe',
    street: '456 Business Ave, Suite 200',
    city: 'New York',
    state: 'NY',
    zip: '10002',
    country: 'USA',
    phone: '+1 (555) 987-6543',
    type: 'work',
    isDefault: false,
  },
];

export function MobileAddressSelectionPage() {
  const navigate = useNavigate();
  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);

  const handleSelectAddress = (id: number) => {
    setSelectedAddressId(id);
  };

  const handleContinue = () => {
    // Navigate to payment page with selected address
    navigate('/payment', { state: { addressId: selectedAddressId } });
  };

  const handleAddNewAddress = () => {
    // Navigate to the add address form page
    navigate('/add-address');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-32" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
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

          <h1 className="text-base font-medium">Delivery Address</h1>

          <div className="w-9" /> {/* Spacer for alignment */}
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-14 px-4 pb-6">
        {/* Header Info */}
        <div className="py-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={20} className="text-primary" />
            <h2 className="text-lg font-medium">Select Delivery Address</h2>
          </div>
          <p className="text-sm text-foreground/60">
            Choose where you want your order delivered
          </p>
        </div>

        {/* Address List */}
        <div className="space-y-3 mb-6">
          {addresses.map((address, index) => {
            const isSelected = selectedAddressId === address.id;

            return (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectAddress(address.id)}
                className={`relative p-4 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-white'
                }`}
              >
                {/* Type Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {address.type === 'home' ? (
                      <Home size={16} className="text-foreground/60" />
                    ) : (
                      <Briefcase size={16} className="text-foreground/60" />
                    )}
                    <span className="text-xs font-medium uppercase text-foreground/60">
                      {address.type}
                    </span>
                    {address.isDefault && (
                      <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        DEFAULT
                      </span>
                    )}
                  </div>

                  {/* Selection Indicator */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'border-primary bg-primary'
                        : 'border-foreground/20'
                    }`}
                  >
                    {isSelected && <Check size={14} className="text-white" />}
                  </div>
                </div>

                {/* Address Details */}
                <div className="space-y-1 mb-3">
                  <p className="font-medium">{address.name}</p>
                  <p className="text-sm text-foreground/70">{address.street}</p>
                  <p className="text-sm text-foreground/70">
                    {address.city}, {address.state} {address.zip}
                  </p>
                  <p className="text-sm text-foreground/70">{address.country}</p>
                  <p className="text-sm text-foreground/70">{address.phone}</p>
                </div>

                {/* Action Buttons */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-2 pt-3 border-t border-border/30"
                  >
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-primary">
                      <Edit2 size={14} />
                      Edit
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-600">
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Add New Address Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleAddNewAddress}
          className="w-full py-4 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 flex items-center justify-center gap-2 text-primary font-medium"
        >
          <Plus size={20} />
          Add New Address
        </motion.button>

        {/* Delivery Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
          <h3 className="font-medium text-sm mb-2 text-blue-900">
            📦 Delivery Information
          </h3>
          <ul className="space-y-1 text-xs text-blue-800">
            <li>• Free delivery on orders over $50</li>
            <li>• Standard delivery: 3-5 business days</li>
            <li>• Express delivery available at checkout</li>
          </ul>
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <div 
        className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border/20 p-4"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 4px)', marginBottom: '64px' }}
      >
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
          disabled={!selectedAddressId}
          className="w-full bg-primary text-white py-4 rounded-full font-medium text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Payment
        </motion.button>
      </div>

    </div>
  );
}