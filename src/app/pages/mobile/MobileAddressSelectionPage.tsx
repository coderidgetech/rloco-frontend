import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin, Plus, Check, Edit2, Trash2, Home, Briefcase } from 'lucide-react';
import { useOrder } from '@/app/context/OrderContext';
import { useUser } from '@/app/context/UserContext';
import { addressService } from '@/app/services/addressService';
import { toast } from 'sonner';

interface Address {
  id: string;
  name: string;
  type: 'HOME' | 'OFFICE' | 'OTHER';
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  mobile: string;
  isDefault?: boolean;
}

export function MobileAddressSelectionPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useUser();
  const { setSelectedAddress } = useOrder();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const apiAddresses = await addressService.list();
        const transformed: Address[] = apiAddresses.map((addr: any) => ({
          id: addr.id,
          name: addr.name,
          type: (addr.type || 'HOME') as 'HOME' | 'OFFICE' | 'OTHER',
          addressLine: addr.address_line || '',
          city: addr.city || '',
          state: addr.state || '',
          pincode: addr.pincode || '',
          mobile: addr.mobile || '',
          isDefault: addr.is_default,
        }));
        setAddresses(transformed);
        const defaultAddr = transformed.find((a) => a.isDefault) || transformed[0];
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      } catch (err: any) {
        if (err?.response?.status !== 401) toast.error('Failed to load addresses');
        setAddresses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, [isAuthenticated]);

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
  };

  const handleContinue = () => {
    const address = addresses.find((a) => a.id === selectedAddressId);
    if (address) {
      setSelectedAddress({
        id: address.id,
        name: address.name,
        type: address.type,
        addressLine: address.addressLine,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        mobile: address.mobile,
      });
      navigate('/payment');
    } else {
      toast.error('Please select an address');
    }
  };

  const handleAddNewAddress = () => {
    navigate('/add-address');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-background">
        <p className="text-foreground/60">Loading addresses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background pb-32" style={{ backgroundColor: 'var(--background, #ffffff)' }}>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border/20 dark:bg-background">
        <div className="flex items-center justify-between h-14 px-4" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full bg-foreground/5 flex items-center justify-center"
          >
            <ChevronLeft size={20} />
          </motion.button>
          <h1 className="text-base font-medium">Delivery Address</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="pt-14 px-4 pb-6">
        <div className="py-4">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={20} className="text-primary" />
            <h2 className="text-lg font-medium">Select Delivery Address</h2>
          </div>
          <p className="text-sm text-foreground/60">Choose where you want your order delivered</p>
        </div>

        <div className="space-y-3 mb-6">
          {addresses.length === 0 && (
            <p className="text-sm text-foreground/60 py-4">No saved addresses. Add one to continue.</p>
          )}
          {addresses.map((address, index) => {
            const isSelected = selectedAddressId === address.id;
            const typeLabel = address.type === 'OFFICE' ? 'work' : address.type === 'HOME' ? 'home' : 'other';
            return (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectAddress(address.id)}
                className={`relative p-4 rounded-2xl border-2 transition-all ${
                  isSelected ? 'border-primary bg-primary/5' : 'border-border bg-white dark:bg-background'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {typeLabel === 'home' ? (
                      <Home size={16} className="text-foreground/60" />
                    ) : (
                      <Briefcase size={16} className="text-foreground/60" />
                    )}
                    <span className="text-xs font-medium uppercase text-foreground/60">{typeLabel}</span>
                    {address.isDefault && (
                      <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        DEFAULT
                      </span>
                    )}
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected ? 'border-primary bg-primary' : 'border-foreground/20'
                    }`}
                  >
                    {isSelected && <Check size={14} className="text-white" />}
                  </div>
                </div>
                <div className="space-y-1 mb-3">
                  <p className="font-medium">{address.name}</p>
                  <p className="text-sm text-foreground/70">{address.addressLine}</p>
                  <p className="text-sm text-foreground/70">
                    {address.city}, {address.state} {address.pincode}
                  </p>
                  <p className="text-sm text-foreground/70">{address.mobile}</p>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex gap-2 pt-3 border-t border-border/30"
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/add-address', { state: { editId: address.id } });
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-primary"
                    >
                      <Edit2 size={14} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addressService.delete(address.id).then(() => {
                          setAddresses((prev) => prev.filter((a) => a.id !== address.id));
                          if (selectedAddressId === address.id) setSelectedAddressId(addresses[0]?.id || '');
                        }).catch(() => toast.error('Failed to delete'));
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-600"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleAddNewAddress}
          className="w-full py-4 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 flex items-center justify-center gap-2 text-primary font-medium"
        >
          <Plus size={20} />
          Add New Address
        </motion.button>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-2xl">
          <h3 className="font-medium text-sm mb-2 text-blue-900 dark:text-blue-200">Delivery Information</h3>
          <ul className="space-y-1 text-xs text-blue-800 dark:text-blue-300">
            <li>• Free delivery on orders over $50</li>
            <li>• Standard delivery: 3-5 business days</li>
          </ul>
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-background border-t border-border/20 p-4"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 4px)', marginBottom: '64px' }}
      >
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleContinue}
          disabled={!selectedAddressId || addresses.length === 0}
          className="w-full bg-primary text-white py-4 rounded-full font-medium text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Payment
        </motion.button>
      </div>
    </div>
  );
}
