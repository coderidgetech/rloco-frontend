import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Plus, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useOrder } from '../context/OrderContext';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { CheckoutStepper } from '../components/CheckoutStepper';
import { AddressFormModal } from '../components/AddressFormModal';
import { addressService, Address as APIAddress } from '@/app/services/addressService';
import { useUser } from '../context/UserContext';
import { productService } from '../services/productService';
import { Product } from '../types/api';
import { getApiErrorMessage, isUnauthorizedApiError } from '../lib/apiErrors';

const DELIVERY_BUSINESS_DAYS = '5–7 business days';

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
  country: string;
  cashOnDelivery?: boolean;
  isDefault?: boolean;
}

function addressTypeLabel(t: Address['type']): string {
  if (t === 'HOME') return 'Home';
  if (t === 'OFFICE') return 'Work';
  return 'Other';
}

export function AddressSelectionPage() {
  const navigate = useNavigate();
  const { items, removeFromCart } = useCart();
  const [productsMap, setProductsMap] = useState<Map<string, Product>>(new Map());
  const { formatAmount, convertPrice, market } = useCurrency();
  const { isAuthenticated, isLoading: userLoading } = useUser();
  const { setSelectedAddress } = useOrder();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  // Require sign-in for saved addresses (same as checkout)
  useEffect(() => {
    if (userLoading) return;
    if (!isAuthenticated) {
      navigate('/login?redirect=' + encodeURIComponent('/address-selection'), { replace: true });
    }
  }, [userLoading, isAuthenticated, navigate]);

  // Fetch addresses from API
  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchAddresses = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const apiAddresses = await addressService.list();
        // Transform API response to component format
        const transformedAddresses: Address[] = apiAddresses.map((addr: APIAddress) => ({
          id: addr.id,
          name: addr.name,
          type: addr.type as 'HOME' | 'OFFICE' | 'OTHER',
          addressLine: addr.address_line,
          addressLine2: addr.address_line2,
          city: addr.city,
          state: addr.state,
          pincode: addr.pincode,
          mobile: addr.mobile,
          country: addr.country || 'India',
          isDefault: addr.is_default,
        }));
        setAddresses(transformedAddresses);
        // Set default address as selected
        const defaultAddr = transformedAddresses.find(addr => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        } else if (transformedAddresses.length > 0) {
          setSelectedAddressId(transformedAddresses[0].id);
        }
      } catch (err: unknown) {
        console.error('Failed to fetch addresses:', err);
        if (!isUnauthorizedApiError(err)) {
          toast.error(getApiErrorMessage(err, 'Failed to load addresses'));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [isAuthenticated]);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  // Fetch products for price calculation; remove cart items whose product no longer exists (404)
  useEffect(() => {
    const fetchProducts = async () => {
      const productIds = items.map(item => String(item.id));
      if (productIds.length === 0) return;

      try {
        const productsData = await Promise.all(
          productIds.map(id => productService.getById(id, { market }).catch(() => null))
        );
        const map = new Map<string, Product>();
        productsData.forEach((product, index) => {
          if (product) {
            map.set(productIds[index], product);
          } else {
            const item = items[index];
            if (item) {
              removeFromCart(item.id, item.size);
              toast.info('A product in your cart is no longer available and was removed.');
            }
          }
        });
        setProductsMap(map);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, [items, removeFromCart, market]);

  // Calculate original MRP (before any product discounts)
  const originalMRP = items.reduce((sum, item) => {
    const product = productsMap.get(String(item.id));
    if (product) {
      const originalPrice = convertPrice(product.price, product.price_inr);
      return sum + (originalPrice * item.quantity);
    }
    return sum;
  }, 0);

  /** Cart line total in current display currency (matches bag / cart). */
  const lineSubtotal = items.reduce((sum, item) => {
    const itemPrice = convertPrice(item.price, (item as any).priceINR);
    return sum + (itemPrice * item.quantity);
  }, 0);

  const savingsVsMRP = Math.max(0, originalMRP - lineSubtotal);

  const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
  const defaultAddress = addresses.find(addr => addr.isDefault);
  const otherAddresses = addresses.filter(addr => !addr.isDefault);

  const handleContinue = () => {
    if (!selectedAddressId) {
      toast.error('Please select a delivery address');
      return;
    }
    // Set selected address in OrderContext
    const address = addresses.find(addr => addr.id === selectedAddressId);
    if (address) {
      setSelectedAddress(address);
    }
    navigate('/payment');
  };

  const handleRemoveAddress = async (id: string) => {
    try {
      await addressService.delete(id);
      const updatedAddresses = addresses.filter(addr => addr.id !== id);
      setAddresses(updatedAddresses);
      if (selectedAddressId === id) {
        setSelectedAddressId(updatedAddresses[0]?.id || '');
      }
      toast.success('Address removed');
    } catch (err: unknown) {
      console.error('Failed to delete address:', err);
      toast.error(getApiErrorMessage(err, 'Failed to remove address'));
    }
  };

  const handleEditAddress = (id: string) => {
    const address = addresses.find(addr => addr.id === id);
    if (address) {
      setEditingAddress(address);
      setModalMode('edit');
      setShowAddressModal(true);
    }
  };

  const requestRemoveAddress = (id: string) => {
    if (!window.confirm('Remove this address? You can add a new one anytime.')) return;
    void handleRemoveAddress(id);
  };

  if (userLoading) {
    return (
      <div className="flex min-h-screen w-full min-w-0 items-center justify-center bg-muted/20 pt-16 md:pt-20">
        <div className="text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen w-full min-w-0 items-center justify-center bg-muted/20 pt-16 md:pt-20">
        <p className="text-sm text-muted-foreground">Redirecting to sign in…</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen w-full min-w-0 items-center justify-center bg-muted/20 pt-16 md:pt-20">
        <div className="text-muted-foreground">Loading addresses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full min-w-0 bg-muted/20 pt-16 md:pt-20">
      {/* Header with Progress Steps */}
      <div className="bg-background border-b border-border shadow-sm">
        <div className="page-section py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/cart')}
                className="p-2 hover:bg-muted rounded-full transition-colors mr-2"
                aria-label="Back to cart"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="text-primary" size={16} />
              </div>
              <h1 className="text-lg md:text-xl font-medium">Select Delivery Address</h1>
            </div>
          </div>

          <CheckoutStepper activeStep="address" />
        </div>
      </div>

      {/* Content */}
      <div className="w-full px-4 md:px-8 lg:px-16 py-6 md:py-8">
        <div className="grid lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-6 md:gap-8">
          {/* Left Side - Address Selection */}
          <div className="space-y-4 md:space-y-6">
            {/* Add New Address Button */}
            <div className="flex justify-between items-center gap-3">
              <h2 className="text-sm md:text-base font-medium">Saved addresses</h2>
              <button
                type="button"
                onClick={() => {
                  setModalMode('add');
                  setShowAddressModal(true);
                }}
                className="px-4 py-2 border border-border rounded text-xs uppercase tracking-wider font-medium hover:border-primary transition-colors shrink-0"
              >
                Add New Address
              </button>
            </div>

            {/* Empty State */}
            {addresses.length === 0 && (
              <div className="bg-white border-2 border-dashed border-border rounded-lg p-8 md:p-12 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-muted-foreground" size={32} />
                </div>
                <h3 className="text-lg font-medium mb-2">No Addresses Added</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Add a delivery address to continue with your order
                </p>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setModalMode('add');
                    setShowAddressModal(true);
                  }}
                  className="px-6 py-3 bg-[#FF3F6C] hover:bg-[#E6365F] text-white rounded-lg text-sm uppercase tracking-wider font-medium transition-colors inline-flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Your First Address
                </motion.button>
              </div>
            )}

            {/* Default Address */}
            {defaultAddress && (
              <div>
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">
                  Default Address
                </h3>
                <div className="bg-white border-2 border-border rounded-lg p-4 relative">
                  <div className="flex gap-4">
                    <div className="pt-1 flex-shrink-0">
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === defaultAddress.id}
                        onChange={() => setSelectedAddressId(defaultAddress.id)}
                        className="w-5 h-5 cursor-pointer accent-primary"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-medium">{defaultAddress.name}</span>
                        <span className="px-2 py-0.5 bg-muted text-foreground text-xs rounded tracking-wide">
                          {addressTypeLabel(defaultAddress.type)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80 mb-1">
                        {defaultAddress.addressLine}
                        {defaultAddress.addressLine2 ? `, ${defaultAddress.addressLine2}` : ''}
                      </p>
                      <p className="text-sm text-foreground/80 mb-2">
                        {defaultAddress.city}, {defaultAddress.state} {defaultAddress.pincode}
                        <span className="text-foreground/50"> · {defaultAddress.country}</span>
                      </p>
                      <p className="text-sm text-foreground/70 mb-3">
                        Mobile: <span className="font-medium">{defaultAddress.mobile}</span>
                      </p>
                      {defaultAddress.cashOnDelivery && (
                        <p className="text-sm text-foreground/70 mb-4">
                          • Cash on Delivery available
                        </p>
                      )}
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => requestRemoveAddress(defaultAddress.id)}
                          className="px-4 py-2 border border-border rounded text-xs uppercase tracking-wider font-medium hover:border-destructive hover:text-destructive transition-colors"
                        >
                          Remove
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEditAddress(defaultAddress.id)}
                          className="px-4 py-2 border border-border rounded text-xs uppercase tracking-wider font-medium hover:border-primary hover:text-primary transition-colors"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other Addresses */}
            {otherAddresses.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">
                  Other Address
                </h3>
                <div className="space-y-4">
                  {otherAddresses.map((address) => (
                    <div
                      key={address.id}
                      className={`bg-white border-2 rounded-lg p-4 relative transition-colors ${
                        selectedAddressId === address.id ? 'border-primary' : 'border-border'
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className="pt-1 flex-shrink-0">
                          <input
                            type="radio"
                            name="address"
                            checked={selectedAddressId === address.id}
                            onChange={() => setSelectedAddressId(address.id)}
                            className="w-5 h-5 cursor-pointer accent-primary"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="font-medium">{address.name}</span>
                            <span className="px-2 py-0.5 bg-muted text-foreground text-xs rounded tracking-wide">
                              {addressTypeLabel(address.type)}
                            </span>
                          </div>
                          <p className="text-sm text-foreground/80 mb-1">
                            {address.addressLine}
                            {address.addressLine2 ? `, ${address.addressLine2}` : ''}
                          </p>
                          <p className="text-sm text-foreground/80 mb-2">
                            {address.city}, {address.state} {address.pincode}
                            <span className="text-foreground/50"> · {address.country}</span>
                          </p>
                          <p className="text-sm text-foreground/70 mb-3">
                            Mobile: <span className="font-medium">{address.mobile}</span>
                          </p>
                          {address.cashOnDelivery && (
                            <p className="text-sm text-foreground/70 mb-4">
                              • Cash on Delivery available
                            </p>
                          )}
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => requestRemoveAddress(address.id)}
                              className="px-4 py-2 border border-border rounded text-xs uppercase tracking-wider font-medium hover:border-destructive hover:text-destructive transition-colors"
                            >
                              Remove
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEditAddress(address.id)}
                              className="px-4 py-2 border border-border rounded text-xs uppercase tracking-wider font-medium hover:border-primary hover:text-primary transition-colors"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Address Link */}
            {addresses.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setModalMode('add');
                  setShowAddressModal(true);
                }}
                className="text-primary font-medium text-sm hover:underline flex items-center gap-2"
              >
                <Plus size={16} />
                Add New Address
              </button>
            )}
          </div>

          {/* Right Side - Delivery Estimates & Price Summary */}
          <div className="space-y-4 lg:sticky lg:top-36 self-start">
            {/* Delivery (no fake calendar dates — exact date is confirmed after dispatch) */}
            <div className="bg-white border border-border rounded-lg p-4">
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">
                Delivery
              </h3>
              <p className="text-xs text-foreground/70 mb-4">
                Standard delivery is typically <span className="font-medium text-foreground">{DELIVERY_BUSINESS_DAYS}</span> after
                your order ships. The exact date depends on your address and item availability.
              </p>
              <div className="space-y-3">
                {items.slice(0, 3).map((item, index) => (
                  <div key={`${item.id}-${item.size}-${index}`} className="flex items-center gap-3">
                    <div className="w-12 h-16 rounded overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-foreground/60">Est. {DELIVERY_BUSINESS_DAYS} (after dispatch)</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order value (shipping & final charge are on payment) */}
            <div className="bg-white border border-border rounded-lg p-4">
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
                Order value ({items.length} item{items.length !== 1 ? 's' : ''})
              </h3>
              <p className="text-[11px] text-foreground/55 mb-4">
                Shown for your review. Shipping, taxes, and the amount charged are confirmed on the payment step.
              </p>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm gap-2">
                  <span className="text-muted-foreground">Total MRP</span>
                  <span className="tabular-nums">{formatAmount(originalMRP)}</span>
                </div>
                {savingsVsMRP > 0 && (
                  <div className="flex justify-between text-sm text-green-600 gap-2">
                    <span>Savings on MRP</span>
                    <span className="tabular-nums">−{formatAmount(savingsVsMRP)}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between items-center gap-2">
                    <span className="font-semibold text-sm">Item subtotal</span>
                    <span className="text-lg md:text-xl font-bold tabular-nums">{formatAmount(lineSubtotal)}</span>
                  </div>
                </div>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinue}
                disabled={!selectedAddressId}
                className="w-full py-3 md:py-4 bg-[#FF3F6C] hover:bg-[#E6365F] text-white uppercase tracking-wider font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                Continue to payment
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <AddressFormModal
        isOpen={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          setEditingAddress(null);
          setModalMode('add');
        }}
        onSave={async (address) => {
          try {
            if (modalMode === 'add') {
              const newAddress = await addressService.create({
                name: address.name,
                type: address.type,
                address_line: address.addressLine,
                address_line2: address.addressLine2,
                city: address.city,
                state: address.state,
                pincode: address.pincode,
                mobile: address.mobile,
                country: address.country,
                is_default: address.isDefault || false,
              });

              // Transform and add to list
              const transformedAddress: Address = {
                id: newAddress.id,
                name: newAddress.name,
                type: newAddress.type as 'HOME' | 'OFFICE' | 'OTHER',
                addressLine: newAddress.address_line,
                addressLine2: newAddress.address_line2,
                city: newAddress.city,
                state: newAddress.state,
                pincode: newAddress.pincode,
                mobile: newAddress.mobile,
                country: newAddress.country,
                isDefault: newAddress.is_default,
              };

              setAddresses([...addresses, transformedAddress]);
              if (transformedAddress.isDefault || addresses.length === 0) {
                setSelectedAddressId(transformedAddress.id);
              }
              toast.success('Address added successfully');
            } else if (editingAddress) {
              const updatedAddress = await addressService.update(editingAddress.id, {
                name: address.name,
                type: address.type,
                address_line: address.addressLine,
                address_line2: address.addressLine2,
                city: address.city,
                state: address.state,
                pincode: address.pincode,
                mobile: address.mobile,
                country: address.country,
                is_default: address.isDefault || false,
              });

              // Transform and update in list
              const transformedAddress: Address = {
                id: updatedAddress.id,
                name: updatedAddress.name,
                type: updatedAddress.type as 'HOME' | 'OFFICE' | 'OTHER',
                addressLine: updatedAddress.address_line,
                addressLine2: updatedAddress.address_line2,
                city: updatedAddress.city,
                state: updatedAddress.state,
                pincode: updatedAddress.pincode,
                mobile: updatedAddress.mobile,
                country: updatedAddress.country,
                isDefault: updatedAddress.is_default,
              };

              setAddresses(addresses.map(addr =>
                addr.id === editingAddress.id ? transformedAddress : addr
              ));
              if (transformedAddress.isDefault) {
                setSelectedAddressId(transformedAddress.id);
              }
              toast.success('Address updated successfully');
            }
            setShowAddressModal(false);
            setEditingAddress(null);
            setModalMode('add');
          } catch (err: unknown) {
            console.error('Failed to save address:', err);
            toast.error(getApiErrorMessage(err, 'Failed to save address'));
          }
        }}
        editAddress={editingAddress}
        mode={modalMode}
      />
    </div>
  );
}