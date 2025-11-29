
export type Role = "ADMIN" | "CLIENT";

export interface User {
  id: string;
  name: string;     
  lastName?: string; 
  email: string;
  role: Role;
  password?: string; 
}

export interface CartItem {
  image: string;
  productId: string;
  name: string;
  price: number;
  qty: number;
}