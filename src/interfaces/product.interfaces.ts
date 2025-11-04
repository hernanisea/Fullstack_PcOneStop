export interface Offer {
  discount: number;        // El porcentaje de descuento (por ejemplo, 20 significa un 20% de descuento)
  startDate: string;       // Fecha de inicio de la oferta (en formato ISO 8601, por ejemplo, "2025-11-01")
  endDate: string;         // Fecha de finalización de la oferta (en formato ISO 8601, por ejemplo, "2025-11-30")
}

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;           // El precio normal del producto
  stock: number;           // El stock disponible
  image: string;
  description: string;
  isOnSale?: boolean;      // Campo para saber si el producto está en oferta
  offer?: Offer;           // Si está en oferta, podemos añadir los detalles de la oferta
}

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
};