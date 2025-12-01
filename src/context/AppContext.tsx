import { createContext, useContext, useMemo, useState, type ReactNode, useEffect } from "react";
import type { CartItem, User } from "../interfaces/user.interfaces";
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
  reloadProducts: () => Promise<void>;
};

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]); // Carrito solo en memoria, sin localStorage
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Inicia en true
  const [toast, setToast] = useState<ToastState>(null);

  
  // Función para recargar productos
  const reloadProducts = async () => {
    try {
      const productsFromDb = await getProducts();
      setProducts(productsFromDb);
    } catch (error) {
      // El error ya se maneja en getProducts
      console.error("Error al recargar productos:", error);
    }
  };

  // Carga los productos y desactiva el 'isLoading'
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await reloadProducts();
      } catch (error) {
        // El error ya se maneja en reloadProducts
      } finally {
        // Simula un tiempo de carga mínimo
        await new Promise(r => setTimeout(r, 500));
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // --- Funciones del Toast (ya estaban correctas) ---
  const showToast = (msg: string, type: ToastType = 'success') => {
    setToast({ message: msg, type: type });
  };
  const hideToast = () => setToast(null);

  // --- Funciones del Carrito (sin localStorage, solo en memoria) ---
  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const exists = prev.find(p => p.productId === item.productId);
      const next = exists
        ? prev.map(p =>
            p.productId === item.productId ? { ...p, qty: p.qty + item.qty } : p
          )
        : [...prev, item];
      showToast(`${item.name} agregado al carrito`, 'success');
      return next;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(p => p.productId !== productId));
  };

  const updateQty = (productId: string, qty: number) => {
    setCart(prev => {
      const next = prev
        .map(p => (p.productId === productId ? { ...p, qty } : p))
        .filter(p => p.qty > 0);
      return next;
    });
  };

  const clearCart = () => setCart([]);

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
      reloadProducts,
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