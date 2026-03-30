import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Plus, Edit2, Trash2, Home, Briefcase, MapPinned } from 'lucide-react';
import { MobileSubPageHeader } from '@/app/components/mobile/MobileSubPageHeader';
import { toast } from 'sonner';

interface Address {
  id: string;
  name: string;
  type: 'home' | 'work' | 'other';
  address: string;
  city: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
}

const MOCK_ADDRESSES: Address[] = [
  {
    id: '1',
    name: 'Praneeth',
    type: 'home',
    address: '202 flat, 2nd floor, datta Krupa housing society, Miyapur',
    city: 'Hyderabad',
    pincode: '500049',
    phone: '+91 98765 43210',
    isDefault: true,
  },
  {
    id: '2',
    name: 'Office',
    type: 'work',
    address: 'Tech Park, 5th Floor, Hitech City',
    city: 'Hyderabad',
    pincode: '500081',
    phone: '+91 98765 43210',
    isDefault: false,
  },
  {
    id: '3',
    name: 'Parents House',
    type: 'other',
    address: 'Plot 123, Jubilee Hills',
    city: 'Hyderabad',
    pincode: '500033',
    phone: '+91 98765 43210',
    isDefault: false,
  },
];

export function MobileAddressesPage() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);

  const getTypeIcon = (type: Address['type']) => {
    switch (type) {
      case 'home':
        return <Home size={18} className="text-primary" />;
      case 'work':
        return <Briefcase size={18} className="text-primary" />;
      default:
        return <MapPinned size={18} className="text-primary" />;
    }
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
    toast.success('Address deleted');
  };

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    toast.success('Default address updated');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-20" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      <MobileSubPageHeader onBack={() => navigate('/account')} />

      <div className="pt-[100px] p-4">{/* Header + safe area */}
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-medium">Saved Addresses</h1>
          <p className="text-sm text-foreground/60 mt-1">
            Manage your delivery addresses
          </p>
        </div>

        {/* Add New Address Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/add-address')}
          className="w-full bg-primary text-white p-4 rounded-2xl flex items-center justify-center gap-2 mb-4"
        >
          <Plus size={20} />
          <span className="font-medium">Add New Address</span>
        </motion.button>

        {/* Addresses List */}
        <div className="space-y-3">
          {addresses.map((address, index) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-4 border border-border/30 shadow-sm"
            >
              {/* Header with Type and Default Badge */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getTypeIcon(address.type)}
                  <span className="font-medium capitalize">{address.type}</span>
                </div>
                {address.isDefault && (
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    Default
                  </span>
                )}
              </div>

              {/* Name */}
              <p className="font-medium text-foreground mb-1">{address.name}</p>

              {/* Address */}
              <p className="text-sm text-foreground/70 mb-1">
                {address.address}
              </p>
              <p className="text-sm text-foreground/70 mb-2">
                {address.city} - {address.pincode}
              </p>

              {/* Phone */}
              <p className="text-sm text-foreground/60 mb-3">{address.phone}</p>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/edit-address/${address.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-border/30 rounded-xl text-sm font-medium active:bg-foreground/5 transition-colors"
                >
                  <Edit2 size={16} />
                  <span>Edit</span>
                </button>

                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="flex-1 py-2.5 bg-primary/10 text-primary rounded-xl text-sm font-medium active:bg-primary/20 transition-colors"
                  >
                    Set as Default
                  </button>
                )}

                {!address.isDefault && (
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="px-4 py-2.5 border border-red-200 text-red-600 rounded-xl active:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}