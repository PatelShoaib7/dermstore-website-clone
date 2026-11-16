import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem, Product } from '../types';
import { useAuth } from './AuthContext';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP';

const CURRENCY_CONFIG: Record<CurrencyCode, { symbol: string; rate: number }> = {
  USD: { symbol: '$', rate: 1 },
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.79 },
};

const STORAGE_KEY_PREFIX = 'dermstore_cart_v1';
const FREE_SHIPPING_THRESHOLD_USD = 50;

interface CartContextValue {
  items: CartItem[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToCart: (product: Product, quantity?: number, openSlideOver?: boolean) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  freeShippingThreshold: number;
  amountToFreeShipping: number;
  qualifiesForFreeShipping: boolean;
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (usdAmount: number) => string;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

function loadInitialCart(storageKey: string): CartItem[] {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const CartStateProvider: React.FC<{
  storageKey: string;
  children: React.ReactNode;
}> = ({ storageKey, children }) => {
  const [items, setItems] = useState<CartItem[]>(() => loadInitialCart(storageKey));
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // Ignore storage quota errors in private browsing
    }
  }, [items, storageKey]);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const addToCart = (product: Product, quantity = 1, openSlideOver = true) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    if (openSlideOver) {
      setIsDrawerOpen(true);
    }
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const { totalItems, subtotal } = useMemo(() => {
    return items.reduce(
      (acc, item) => ({
        totalItems: acc.totalItems + item.quantity,
        subtotal: acc.subtotal + item.product.price * item.quantity,
      }),
      { totalItems: 0, subtotal: 0 }
    );
  }, [items]);

  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_USD - subtotal);
  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD_USD;

  const formatPrice = (usdAmount: number): string => {
    const { symbol, rate } = CURRENCY_CONFIG[currency];
    return `${symbol}${(usdAmount * rate).toFixed(2)}`;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD_USD,
        amountToFreeShipping,
        qualifiesForFreeShipping,
        currency,
        setCurrency,
        formatPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const storageKey = `${STORAGE_KEY_PREFIX}_${user?.id ?? 'guest'}`;

  return (
    <CartStateProvider key={storageKey} storageKey={storageKey}>
      {children}
    </CartStateProvider>
  );
};

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
