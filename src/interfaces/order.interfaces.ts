// src/interfaces/order.interfaces.ts

export interface PcBuild {
  cpu?: string;
  gpu?: string;
  ram?: string;
  mb?: string;
  storage?: string;
  psu?: string;
  case?: string;
  cooler?: string;
}

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
};

export type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  createdAt: string; // ISO
  
  // Datos del cliente
  customerEmail: string;
  customerName: string;
  customerLastName: string;
  
  // Datos de envío
  shippingStreet: string;
  shippingDepartment?: string;
  shippingRegion: string;
  shippingComuna: string;
  shippingIndications?: string;
};

export interface Offer {
  discount: number;      // El porcentaje de descuento (por ejemplo, 20 significa un 20% de descuento)
  startDate: string;     // Fecha de inicio de la oferta (en formato ISO 8601, por ejemplo, "2025-11-01")
  endDate: string;       // Fecha de finalización de la oferta (en formato ISO 8601, por ejemplo, "2025-11-30")
}

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;         // El precio normal del producto
  stock: number;         // El stock disponible
  image: string;
  description: string;
  isOnSale?: boolean;    // Campo para saber si el producto está en oferta
  offer?: Offer;         // Si está en oferta, podemos añadir los detalles de la oferta
}

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
};