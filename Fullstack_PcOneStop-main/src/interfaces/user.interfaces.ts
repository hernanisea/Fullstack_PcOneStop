export type Role = "ADMIN" | "CLIENT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface CartItem {
  image: string;
  productId: string;
  name: string;
  price: number;
  qty: number;
}
