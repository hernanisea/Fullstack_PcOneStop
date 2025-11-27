import type { Order } from "../interfaces/order.interfaces";

const KEY = "pcos_last_order";

export async function postOrder(order: Order): Promise<Order> {
  try {
    const response = await fetch('http://localhost:8083/api/v1/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });

    const data = await response.json();

    if (data.success && data.data) {
      localStorage.setItem(KEY, JSON.stringify(data.data));
      return data.data;
    }

    throw new Error(data.message || "Error al crear el pedido");
  } catch (error) {
    console.error("Error al crear pedido:", error);
    throw error;
  }
}

export function getLastOrder(): Order | null {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) as Order : null;
}
