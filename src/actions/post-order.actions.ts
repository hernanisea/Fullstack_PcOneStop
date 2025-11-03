import type { Order } from "../interfaces/order.interfaces";

const KEY = "pcos_last_order";

export async function postOrder(order: Order): Promise<Order> {
  // Simula latencia de red
  await new Promise(r => setTimeout(r, 500));
  localStorage.setItem(KEY, JSON.stringify(order));
  return order;
}

export function getLastOrder(): Order | null {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) as Order : null;
}
