
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  postcode: string;
  is_default: boolean;
}

interface ShippingMethod {
  name: string;
  description: string;
  price: number;
}

interface CheckoutContextType {
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address | null) => void;
  selectedShippingMethod: ShippingMethod | null;
  setSelectedShippingMethod: (method: ShippingMethod | null) => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod | null>(null);

  return (
    <CheckoutContext.Provider
      value={{
        selectedAddress,
        setSelectedAddress,
        selectedShippingMethod,
        setSelectedShippingMethod,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}
