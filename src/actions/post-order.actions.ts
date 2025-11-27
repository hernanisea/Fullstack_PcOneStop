import type { Order } from "../interfaces/order.interfaces";

const KEY = "pcos_last_order";

export async function postOrder(order: Order): Promise<Order> {
  try {
    // No enviar el id al crear una orden, el backend lo genera
    const { id, ...orderData } = order;
    
    // Limpiar campos undefined
    const cleanData = Object.fromEntries(
      Object.entries(orderData).filter(([_, value]) => value !== undefined)
    );
    
    const response = await fetch('http://localhost:8083/api/v1/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}: Error al crear el pedido`);
    }

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
