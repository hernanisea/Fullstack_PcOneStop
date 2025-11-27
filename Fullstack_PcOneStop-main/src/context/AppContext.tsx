import { createContext, useContext, useMemo, useState, type ReactNode, useEffect } from "react";
import type { CartItem, User } from "../interfaces/user.interfaces";
import { getCartFromLS, saveCartToLS } from "../helpers/local-storage.helpers";
import type { Product } from "../interfaces/product.interfaces";
import { getProducts } from "../actions/get-product.actions";

// --- Tipos para el Toast ---
type ToastType = 'success' | 'error';
type ToastState = {
  message: string;
  type: ToastType;
} | null;

// --- AppState ---
type AppState = {
  user: User | null;
  setUser: (u: User | null) => void;
  cart: CartItem[];
  products: Product[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  toast: ToastState; 
  showToast: (msg: string, type?: ToastType) => void;
  hideToast: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>(getCartFromLS());
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Inicia en true
  const [toast, setToast] = useState<ToastState>(null);

  
  // Carga los productos y desactiva el 'isLoading'
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true); // Asegura que esté en true
      const productsFromDb = await getProducts();
      setProducts(productsFromDb);
      // Simula un tiempo de carga mínimo
      await new Promise(r => setTimeout(r, 500));
      setIsLoading(false); // <-- ¡La línea clave! Termina la carga
    };
    loadData();
  }, []); // Array vacío, se ejecuta solo una vez

  // --- Funciones del Toast (ya estaban correctas) ---
  const showToast = (msg: string, type: ToastType = 'success') => {
    setToast({ message: msg, type: type });
  };
  const hideToast = () => setToast(null);

  const persist = (next: CartItem[]) => {
    saveCartToLS(next);
    return next;
  };

  // --- Funciones del Carrito (actualizadas) ---
  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const exists = prev.find(p => p.productId === item.productId);
      const next = exists
        ? prev.map(p =>
            p.productId === item.productId ? { ...p, qty: p.qty + item.qty } : p
          )
        : [...prev, item];
      showToast(`${item.name} agregado al carrito`, 'success'); // Llama al toast
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

  // --- 'value' del Provider (ya estaba correcto) ---
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
      toast, 
      showToast,
      hideToast,
      isLoading,
      setIsLoading,
    }),
    [user, cart, products, cartTotal, toast, isLoading]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp debe usarse dentro de <AppProvider>");
  return v;
}