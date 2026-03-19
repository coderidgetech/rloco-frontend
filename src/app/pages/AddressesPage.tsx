import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus, Edit2, Trash2, Home, Briefcase, MapPinned } from 'lucide-react';
import { ResponsivePageHeader } from '@/app/components/ResponsivePageHeader';
import { addressService, type Address as APIAddress } from '@/app/services/addressService';
import { toast } from 'sonner';
import { useIsMobile } from '@/app/hooks/useIsMobile';

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

function mapType(t: string): 'home' | 'work' | 'other' {
  const lower = t?.toLowerCase() || '';
  if (lower === 'office' || lower === 'work') return 'work';
  if (lower === 'other') return 'other';
  return 'home';
}

export function AddressesPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const list = await addressService.list();
      setAddresses(
        list.map((a: APIAddress) => ({
          id: a.id,
          name: a.name,
          type: mapType(a.type),
          address: a.address_line || '',
          city: a.city || '',
          pincode: a.pincode || '',
          phone: a.mobile || '',
          isDefault: a.is_default ?? false,
        }))
      );
    } catch {
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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

  const handleDelete = async (id: string) => {
    try {
      await addressService.delete(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success('Address deleted');
    } catch {
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await addressService.setDefault(id);
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: a.id === id }))
      );
      toast.success('Default address updated');
    } catch {
      toast.error('Failed to update default');
    }
  };

  const topPadding = isMobile ? 'pt-4' : 'pt-6';
  const bottomPadding = isMobile ? 'pb-mobile-nav' : 'pb-12';
  const containerClass = isMobile ? 'px-4' : 'max-w-2xl mx-auto px-4 md:px-8';

  return (
    <div className={`min-h-screen bg-background pt-page-nav ${bottomPadding}`}>
      <ResponsivePageHeader title="Saved Addresses" onBack={() => navigate('/account')} />

      <div className={`${topPadding} ${containerClass}`}>
        <p className="text-sm text-muted-foreground mb-4">Manage your delivery addresses</p>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/add-address')}
          className="w-full bg-primary text-white p-4 rounded-2xl flex items-center justify-center gap-2 mb-6"
        >
          <Plus size={20} />
          <span className="font-medium">Add New Address</span>
        </motion.button>

        {loading ? (
          <p className="text-muted-foreground text-sm">Loading…</p>
        ) : addresses.length === 0 ? (
          <p className="text-muted-foreground text-sm">No addresses yet. Add one above.</p>
        ) : (
          <div className="space-y-3">
            {addresses.map((address, index) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="bg-card rounded-2xl p-4 border border-border shadow-sm"
              >
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

                <p className="font-medium mb-1">{address.name}</p>
                <p className="text-sm text-muted-foreground mb-1">{address.address}</p>
                <p className="text-sm text-muted-foreground mb-2">{address.city} - {address.pincode}</p>
                <p className="text-sm text-muted-foreground mb-3">{address.phone}</p>

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => navigate(`/add-address?edit=${address.id}`)}
                    className="flex-1 min-w-[80px] flex items-center justify-center gap-2 py-2.5 border border-border rounded-xl text-sm font-medium hover:bg-muted"
                  >
                    <Edit2 size={16} />
                    <span>Edit</span>
                  </button>
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="flex-1 min-w-[80px] py-2.5 bg-primary/10 text-primary rounded-xl text-sm font-medium hover:bg-primary/20"
                    >
                      Set as Default
                    </button>
                  )}
                  {!address.isDefault && (
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="px-4 py-2.5 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 dark:bg-red-950/20"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
