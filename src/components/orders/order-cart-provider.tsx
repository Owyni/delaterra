"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface CartProductItem {
  productId: string;
  name: string;
  priceMxn: number;
  unit: string;
  availableQuantity: number;
  imageUrl: string;
  backdropColor: string;
  farmerId: string;
  farmerName: string;
  municipality: string;
  quantity: number;
}

export interface CartFarmerGroup {
  farmerId: string;
  farmerName: string;
  municipality: string;
  items: CartProductItem[];
  estimatedTotalMxn: number;
}

interface OrderCartContextValue {
  items: CartProductItem[];
  totalItemsCount: number;
  groupedByFarmer: CartFarmerGroup[];
  addItem: (item: Omit<CartProductItem, "quantity">, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const STORAGE_KEY = "delaterra_order_cart_v1";

const OrderCartContext = createContext<OrderCartContextValue | null>(null);

export function OrderCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartProductItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartProductItem[];
        if (Array.isArray(parsed)) {
          setItems(
            parsed.filter(
              (item) =>
                typeof item.productId === "string" &&
                typeof item.quantity === "number" &&
                item.quantity > 0,
            ),
          );
        }
      }
    } catch {
      // Ignoramos errores de almacenamiento local corrupto
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignoramos errores de cuota
    }
  }, [items, hydrated]);

  const addItem = useCallback(
    (product: Omit<CartProductItem, "quantity">, quantity: number) => {
      if (quantity <= 0) return;
      setItems((prev) => {
        const existing = prev.find((i) => i.productId === product.productId);
        if (existing) {
          const nextQty = Math.min(
            product.availableQuantity,
            existing.quantity + quantity,
          );
          return prev.map((i) =>
            i.productId === product.productId
              ? { ...product, quantity: Math.max(1, nextQty) }
              : i,
          );
        }
        return [
          ...prev,
          {
            ...product,
            quantity: Math.min(product.availableQuantity, Math.max(1, quantity)),
          },
        ];
      });
    },
    [],
  );

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((i) => i.productId !== productId);
      }
      return prev.map((i) =>
        i.productId === productId
          ? { ...i, quantity: Math.min(i.availableQuantity, quantity) }
          : i,
      );
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItemsCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const groupedByFarmer = useMemo<CartFarmerGroup[]>(() => {
    const map = new Map<string, CartFarmerGroup>();
    for (const item of items) {
      const lineTotal = item.priceMxn * item.quantity;
      const existing = map.get(item.farmerId);
      if (existing) {
        existing.items.push(item);
        existing.estimatedTotalMxn += lineTotal;
      } else {
        map.set(item.farmerId, {
          farmerId: item.farmerId,
          farmerName: item.farmerName,
          municipality: item.municipality,
          items: [item],
          estimatedTotalMxn: lineTotal,
        });
      }
    }
    return Array.from(map.values());
  }, [items]);

  const value = useMemo<OrderCartContextValue>(
    () => ({
      items,
      totalItemsCount,
      groupedByFarmer,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [
      items,
      totalItemsCount,
      groupedByFarmer,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    ],
  );

  return (
    <OrderCartContext.Provider value={value}>
      {children}
    </OrderCartContext.Provider>
  );
}

export function useOrderCart() {
  const ctx = useContext(OrderCartContext);
  if (!ctx) {
    throw new Error("useOrderCart debe usarse dentro de OrderCartProvider.");
  }
  return ctx;
}
