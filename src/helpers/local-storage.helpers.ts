import type { CartItem } from "../interfaces/user.interfaces";
const KEY = "pcos_cart";

export function getCartFromLS(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
export function saveCartToLS(data: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(data));
}
