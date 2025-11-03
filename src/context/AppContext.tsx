import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { CartItem, User } from "../interfaces/user.interfaces";
import { getCartFromLS, saveCartToLS } from "../helpers/local-storage.helpers";

type AppState = {
  user: User | null;
  setUser: (u: User | null) => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
};

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>(getCartFromLS());

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const exists = prev.find(p => p.productId === item.productId);
      const next = exists
        ? prev.map(p => p.productId === item.productId ? { ...p, qty: p.qty + item.qty } : p)
        : [...prev, item];
    saveCartToLS(next);
    return next;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const next = prev.filter(p => p.productId !== productId);
      saveCartToLS(next);
      return next;
    });
  };

  const clearCart = () => {
    setCart([]);
    saveCartToLS([]);
  };

  const value = useMemo(() => ({
    user, setUser, cart, addToCart, removeFromCart, clearCart
  }), [user, cart]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp debe usarse dentro de <AppProvider>");
  return v;
}
