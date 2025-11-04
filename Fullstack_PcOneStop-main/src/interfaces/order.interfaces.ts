
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
  customerEmail?: string;
};

