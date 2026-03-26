import { createContext, useContext, useState, ReactNode } from 'react';

interface Address {
  id: string;
  name: string;
  type: 'HOME' | 'OFFICE' | 'OTHER';
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  mobile: string;
  country?: string;
}

interface OrderContextType {
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address | null) => void;
  selectedPaymentMethod: string | null;
  setSelectedPaymentMethod: (method: string | null) => void;
  appliedCoupon: { code: string; discount: number } | null;
  setAppliedCoupon: (coupon: { code: string; discount: number } | null) => void;
  donationAmount: number;
  setDonationAmount: (amount: number) => void;
  resetOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [donationAmount, setDonationAmount] = useState(0);

  const resetOrder = () => {
    setSelectedAddress(null);
    setSelectedPaymentMethod(null);
    setAppliedCoupon(null);
    setDonationAmount(0);
  };

  return (
    <OrderContext.Provider
      value={{
        selectedAddress,
        setSelectedAddress,
        selectedPaymentMethod,
        setSelectedPaymentMethod,
        appliedCoupon,
        setAppliedCoupon,
        donationAmount,
        setDonationAmount,
        resetOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within OrderProvider');
  }
  return context;
}

export default OrderProvider;
