import React, { createContext, useContext, useState, useEffect } from 'react';

interface ScannedItemType {
  sku: string;
  quantity: number;
  name?: string;
  unitMrp?: number;
  unitPrice?: number;
  price: number;
  allowLoose?: boolean;
  minQuantity?: number;
}

interface SalesContextType {
  scannedValue: ScannedItemType[];
  looseItem: ScannedItemType[];
  setLooseItem: React.Dispatch<React.SetStateAction<ScannedItemType[]>>;
  setScannedValue: React.Dispatch<React.SetStateAction<ScannedItemType[]>>;
  totalPrice: number;
  setTotalPrice: React.Dispatch<React.SetStateAction<number>>;
  customerName: string;
  setCustomerName: React.Dispatch<React.SetStateAction<string>>;
  customerMobile: string;
  setCustomerMobile: React.Dispatch<React.SetStateAction<string>>;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export function SalesProvider({ children }: { children: React.ReactNode }) {
  const [scannedValue, setScannedValue] = useState<ScannedItemType[]>([]);
  const [looseItem, setLooseItem] = useState<ScannedItemType[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');

  useEffect(() => {
    const total = [...scannedValue, ...looseItem].reduce((sum, item) => sum + (item.price || 0), 0);
    setTotalPrice(Math.ceil(total));
  }, [scannedValue, looseItem]);

  return (
    <SalesContext.Provider value={{ scannedValue, setScannedValue, totalPrice, setTotalPrice, 
      looseItem, setLooseItem,
      customerName, setCustomerName, customerMobile, setCustomerMobile }}>
      {children}
    </SalesContext.Provider>
  );
}

export function useSales() {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
}
