import type { CartItem } from "./user.interfaces";

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  status: "PAID" | "FAILED" | "PENDING";
}
