import { createContext, useContext, useMemo, useState, type ReactNode, useEffect } from "react";
import type { CartItem, User } from "../interfaces/user.interfaces";
import { getCartFromLS, saveCartToLS } from "../helpers/local-storage.helpers";
import type { Product } from "../interfaces/product.interfaces";
import { getProducts } from "../actions/get-product.actions"; // <-- Importado

// Definimos el estado de la aplicación
type AppState = {
  user: User | null;
  setUser: (u: User | null) => void;
  cart: CartItem[];
  products: Product[]; // Agregar products al estado global
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  toastMessage: string;
  showToast: (msg: string) => void;
  hideToast: () => void;
  isLoading: boolean; // <-- AÑADIDO
  setIsLoading: (loading: boolean) => void; // <-- AÑADIDO
};

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>(getCartFromLS());
  const [toastMessage, setToastMessage] = useState("");
  const [products, setProducts] = useState<Product[]>([]); // <-- Modificado (inicia vacío)
  const [isLoading, setIsLoading] = useState(true); // <-- AÑADIDO

  // Carga los productos desde la "base de datos" al iniciar
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const productsFromDb = await getProducts();
      setProducts(productsFromDb);
      // Simula una pequeña demora para que se vea el loader
      await new Promise(r => setTimeout(r, 500));
      setIsLoading(false); // Termina la carga
    };
    loadData();
  }, []); // El array vacío asegura que solo se ejecute una vez

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
      products,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      cartTotal,
      toastMessage,
      showToast,
      hideToast,
      isLoading, // <-- AÑADIDO
      setIsLoading, // <-- AÑADIDO
    }),
    [user, cart, products, cartTotal, toastMessage, isLoading] // <-- AÑADIDO isLoading
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp debe usarse dentro de <AppProvider>");
  return v;
}