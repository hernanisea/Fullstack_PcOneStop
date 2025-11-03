export interface User {
  id: string;
  name: string;
  role: "CLIENT" | "ADMIN";
  email: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
}
