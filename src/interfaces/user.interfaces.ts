
export type Role = "ADMIN" | "CLIENT" | "CLIENTE";

export interface User {
  id: string | number; // Puede ser string (frontend) o number (backend)
  firstName?: string; // Campo del backend
  name?: string; // Campo del frontend (compatibilidad)
  lastName: string;
  email: string;
  role: Role;
  password?: string;
  phone?: string; // Campo opcional del backend
}

export interface CartItem {
  image: string;
  productId: string;
  name: string;
  price: number;
  qty: number;
}