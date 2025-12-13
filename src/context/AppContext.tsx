import { createContext, useContext, useMemo, useState, type ReactNode, useEffect } from "react";
import type { CartItem, User } from "../interfaces/user.interfaces";
import type { Product } from "../interfaces/product.interfaces";
import { getProducts } from "../actions/get-product.actions";
import { validateSession } from "../actions/auth.actions";

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
  removeOutOfStockItems: () => void;
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

  // Carga los productos, restaura la sesión del usuario y desactiva el 'isLoading'
  // IE3.3.2 - Restaura la sesión del usuario después de recargar la página
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Restaurar sesión del usuario desde el token JWT
        const sessionResult = await validateSession();
        if (sessionResult.isValid && sessionResult.user) {
          setUser(sessionResult.user);
        }
        
        // Cargar productos
        await reloadProducts();
      } catch (error) {
        // El error ya se maneja en las funciones correspondientes
        console.error("Error al cargar datos iniciales:", error);
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
    // Validar stock disponible antes de agregar
    const product = products.find(p => p.id.toString() === item.productId.toString());
    
    if (!product) {
      showToast('Producto no encontrado', 'error');
      return;
    }

    if (product.stock <= 0) {
      showToast(`${item.name} está agotado`, 'error');
      return;
    }

    setCart(prev => {
      const exists = prev.find(p => p.productId === item.productId);
      const currentQty = exists ? exists.qty : 0;
      const newQty = currentQty + item.qty;
      
      // Validar que la cantidad total no exceda el stock disponible
      if (newQty > product.stock) {
        showToast(`Solo hay ${product.stock} unidades disponibles de ${item.name}`, 'error');
        return prev; // No modificar el carrito
      }
      
      const next = exists
        ? prev.map(p =>
            p.productId === item.productId ? { ...p, qty: newQty } : p
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
    // Validar stock disponible antes de actualizar cantidad
    const product = products.find(p => p.id.toString() === productId.toString());
    
    if (!product) {
      showToast('Producto no encontrado', 'error');
      return;
    }

    if (qty <= 0) {
      // Si la cantidad es 0 o menor, eliminar del carrito
      removeFromCart(productId);
      return;
    }

    if (qty > product.stock) {
      showToast(`Solo hay ${product.stock} unidades disponibles de ${product.name}`, 'error');
      // Limitar la cantidad al stock disponible
      qty = product.stock;
    }

    setCart(prev => {
      const next = prev
        .map(p => (p.productId === productId ? { ...p, qty } : p))
        .filter(p => p.qty > 0);
      return next;
    });
  };

  const clearCart = () => {
    setCart([]);
    // Opcional: También podríamos recargar productos aquí para actualizar stock
    // Pero lo hacemos en CheckoutPage después de compra exitosa
  };
  
  // Función para eliminar productos agotados del carrito automáticamente
  const removeOutOfStockItems = () => {
    setCart(prev => {
      const filtered = prev.filter(item => {
        const product = products.find(p => p.id.toString() === item.productId.toString());
        return product && product.stock > 0;
      });
      
      if (filtered.length < prev.length) {
        const removedCount = prev.length - filtered.length;
        showToast(`${removedCount} producto(s) agotado(s) eliminado(s) del carrito`, 'warning');
      }
      
      return filtered;
    });
  };

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
      removeOutOfStockItems,
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