import type { CartItem } from "../interfaces/user.interfaces";

export async function postOrder(payload: { items: CartItem[]; total: number }) {
  // Simula un OK
  console.log("Order posted", payload);
  return Promise.resolve(true);
}
