import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { CartItem, User } from "../interfaces/user.interfaces";
import { getCartFromLS, saveCartToLS } from "../helpers/local-storage.helpers";

type AppState = {
  user: User | null;
  setUser: (u: User | null) => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  // toast global (si ya lo tienes)
  toastMessage: string;
  showToast: (msg: string) => void;
  hideToast: () => void;
};

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>(getCartFromLS());
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => setToastMessage(msg);
  const hideToast = () => setToastMessage("");

  const persist = (next: CartItem[]) => {
    saveCartToLS(next);
    return next;
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const exists = prev.find(p => p.productId === item.productId);
      const next = exists
        ? prev.map(p =>
            p.productId === item.productId ? { ...p, qty: p.qty + item.qty } : p
          )
        : [...prev, item];
      showToast(`${item.name} agregado al carrito`);
      return persist(next);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => persist(prev.filter(p => p.productId !== productId)));
  };

  const updateQty = (productId: string, qty: number) => {
    setCart(prev => {
      const next = prev
        .map(p => (p.productId === productId ? { ...p, qty } : p))
        .filter(p => p.qty > 0);
      return persist(next);
    });
  };

  const clearCart = () => setCart(persist([]));

  const cartTotal = useMemo(
    () => cart.reduce((acc, i) => acc + i.price * i.qty, 0),
    [cart]
  );

  const value = useMemo(
    () => ({
      user,
      setUser,
      cart,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      cartTotal,
      toastMessage,
      showToast,
      hideToast,
    }),
    [user, cart, cartTotal, toastMessage]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp debe usarse dentro de <AppProvider>");
  return v;
}
