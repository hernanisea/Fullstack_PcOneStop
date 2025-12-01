export interface Offer {
  discount: number;        // El porcentaje de descuento (por ejemplo, 20 significa un 20% de descuento)
  startDate: string;       // Fecha de inicio de la oferta (en formato ISO 8601, por ejemplo, "2025-11-01")
  endDate: string;         // Fecha de finalización de la oferta (en formato ISO 8601, por ejemplo, "2025-11-30")
}

export interface Product {
  id: string | number;     // Puede ser string (frontend) o number (backend)
  name: string;
  category: string;
  brand: string;
  model?: string;          // Campo del backend
  price: number;           // El precio normal del producto
  stock: number;          // El stock disponible
  sellerId?: number;      // Campo del backend
  image?: string;         // Campo del frontend (opcional si viene del backend)
  description?: string;   // Campo del frontend (opcional si viene del backend)
  isOnSale?: boolean;     // Campo para saber si el producto está en oferta
  offer?: Offer;          // Si está en oferta, podemos añadir los detalles de la oferta
}

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
};