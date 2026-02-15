import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MapPin, Navigation, Search, Clock, ChevronRight, Plus, CheckCircle2 } from 'lucide-react';
import { MobileSubPageHeader } from '@/app/components/mobile/MobileSubPageHeader';

interface SavedAddress {
  id: number;
  type: 'home' | 'work' | 'other';
  name: string;
  address: string;
  landmark?: string;
  phone: string;
  isDefault: boolean;
  deliveryTime: string;
}

export function MobileDeliveryLocationPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAddressId, setSelectedAddressId] = useState<number>(1);

  // Mock saved addresses
  const [savedAddresses] = useState<SavedAddress[]>([
    {
      id: 1,
      type: 'home',
      name: 'Praneeth',
      address: '202 flat, 2nd floor, datta Krupa Residency, Street 5, Madhapur',
      landmark: 'Near Cyber Towers',
      phone: '+1 (555) 123-4567',
      isDefault: true,
      deliveryTime: '3-5 business days'
    },
    {
      id: 2,
      type: 'work',
      name: 'Praneeth',
      address: '5th Floor, Tech Park, HITEC City, Hyderabad',
      landmark: 'Near DLF Building',
      phone: '+1 (555) 123-4567',
      isDefault: false,
      deliveryTime: '3-5 business days'
    },
    {
      id: 3,
      type: 'other',
      name: 'Praneeth',
      address: '456 Park Avenue, New York, NY 10022',
      landmark: 'Opposite Central Park',
      phone: '+1 (555) 987-6543',
      isDefault: false,
      deliveryTime: '5-7 business days'
    }
  ]);

  const handleSelectAddress = (addressId: number) => {
    setSelectedAddressId(addressId);
    // Store selected address in localStorage or context
    setTimeout(() => {
      navigate(-1); // Go back to previous page
    }, 300);
  };

  const handleUseCurrentLocation = () => {
    // Mock getting current location
    console.log('Getting current location...');
    // In real app, would use geolocation API
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home':
        return '🏠';
      case 'work':
        return '💼';
      default:
        return '📍';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-20" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      {/* Header */}
      <MobileSubPageHeader showBackButton={true} showDeliveryAddress={false} />

      {/* Content */}
      <div 
        className="pb-6"
        style={{ 
          paddingTop: 'calc(env(safe-area-inset-top) + 56px)'
        }}
      >
        {/* Title */}
        <div className="px-4 pt-4 pb-3">
          <h1 className="text-xl font-semibold mb-1">Select Delivery Location</h1>
          <p className="text-sm text-foreground/60">Choose where you want your order delivered</p>
        </div>

        {/* Search Location */}
        <div className="px-4 mb-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for area, street name..."
              className="w-full pl-11 pr-4 py-3 bg-foreground/5 border border-border/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Use Current Location */}
        <div className="px-4 mb-6">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleUseCurrentLocation}
            className="w-full flex items-center gap-3 p-4 border-2 border-primary/30 rounded-xl bg-primary/5"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Navigation size={20} className="text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-primary">Use Current Location</p>
              <p className="text-xs text-foreground/60 mt-0.5">Enable location to detect your address</p>
            </div>
            <ChevronRight size={20} className="text-primary" />
          </motion.button>
        </div>

        {/* Saved Addresses */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Saved Addresses</h2>
            <button
              onClick={() => navigate('/add-address')}
              className="flex items-center gap-1 text-sm text-primary font-medium"
            >
              <Plus size={16} />
              Add New
            </button>
          </div>

          <div className="space-y-3">
            {savedAddresses.map((address) => (
              <motion.div
                key={address.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectAddress(address.id)}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  selectedAddressId === address.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-white'
                }`}
              >
                {/* Selected Indicator */}
                {selectedAddressId === address.id && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle2 size={20} className="text-primary fill-primary" />
                  </div>
                )}

                {/* Address Type Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{getAddressIcon(address.type)}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase text-foreground/70">
                      {address.type}
                    </span>
                    {address.isDefault && (
                      <span className="text-xs bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                </div>

                {/* Name */}
                <p className="font-medium mb-1">{address.name}</p>

                {/* Address */}
                <p className="text-sm text-foreground/70 leading-relaxed mb-2">
                  {address.address}
                </p>

                {/* Landmark */}
                {address.landmark && (
                  <p className="text-xs text-foreground/60 mb-2">
                    Landmark: {address.landmark}
                  </p>
                )}

                {/* Phone */}
                <p className="text-xs text-foreground/60 mb-3">
                  Phone: {address.phone}
                </p>

                {/* Delivery Time */}
                <div className="flex items-center gap-2 pt-3 border-t border-border/20">
                  <Clock size={14} className="text-foreground/40" />
                  <span className="text-xs text-foreground/60">
                    Estimated delivery: <span className="font-medium text-foreground">{address.deliveryTime}</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Delivery Information */}
        <div className="px-4 mt-6">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <h3 className="font-medium text-sm mb-2 text-blue-900">📦 Delivery Information</h3>
            <ul className="text-xs text-blue-800 space-y-1.5">
              <li>• Standard delivery: 3-5 business days</li>
              <li>• Express delivery available in select areas</li>
              <li>• Free shipping on orders over $100</li>
              <li>• Contactless delivery available</li>
            </ul>
          </div>
        </div>

        {/* Service Areas */}
        <div className="px-4 mt-4">
          <div className="p-4 bg-foreground/5 rounded-xl">
            <h3 className="font-medium text-sm mb-2">🌍 We Deliver To</h3>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Currently delivering across New York, Los Angeles, Chicago, Houston, Phoenix, and 50+ cities nationwide. 
              International shipping available to select countries.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
