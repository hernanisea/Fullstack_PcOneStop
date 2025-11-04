import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { CartItem, User } from "../interfaces/user.interfaces";
import { getCartFromLS, saveCartToLS } from "../helpers/local-storage.helpers";
import type { Product } from "../interfaces/product.interfaces"; // Asegúrate de importar Product

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
};

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>(getCartFromLS());
  const [toastMessage, setToastMessage] = useState("");
  
  // Aquí definimos los productos, incluyendo los que tienen la oferta
  const [products] = useState<Product[]>([
    {
      id: "cpu-ryzen-5600",
      name: "AMD Ryzen 5 5600",
      category: "CPU",
      price: 129990,
      image: "/logo.png",
      description: "6C/12T, gran rendimiento precio-rendimiento.",
      stock: 20,
      brand: "AMD",
      isOnSale: true,
      offer: {
        discount: 10, // 10% de descuento
        startDate: "",
        endDate: "",
      },
    },
    {
      id: "gpu-rtx-4060",
      name: "NVIDIA GeForce RTX 4060",
      category: "GPU",
      price: 349990,
      image: "/logo.png",
      description: "Ada Lovelace, DLSS 3, ideal 1080p/1440p.",
      stock: 10,
      brand: "NVIDIA",
      isOnSale: false, // No está en oferta
    },
    
  ]);

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
      products, // Pasamos los productos al contexto
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      cartTotal,
      toastMessage,
      showToast,
      hideToast,
    }),
    [user, cart, products, cartTotal, toastMessage] // Asegúrate de agregar 'products' y otras dependencias
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp debe usarse dentro de <AppProvider>");
  return v;
}
