import { apiClient } from "../services/api.client";
import { API_CONFIG } from "../config/api.config";
import type { Order } from "../interfaces/order.interfaces";

const KEY = "pcos_last_order";

export async function postOrder(order: Order): Promise<Order> {
  try {
    const response = await apiClient.post<Order>(
      `${API_CONFIG.ORDERS.baseURL}${API_CONFIG.ORDERS.endpoints.create}`,
      order
    );

    if (response.data) {
      // Guardamos también en localStorage como respaldo
      localStorage.setItem(KEY, JSON.stringify(response.data));
      return response.data;
    }

    throw new Error(response.message || "Error al crear el pedido");
  } catch (error) {
    console.error("Error al crear pedido:", error);
    throw error;
  }
}

export function getLastOrder(): Order | null {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) as Order : null;
}
