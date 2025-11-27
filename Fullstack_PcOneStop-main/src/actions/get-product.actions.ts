import { apiClient } from "../services/api.client";
import { API_CONFIG } from "../config/api.config";
import type { Product } from "../interfaces/product.interfaces";

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await apiClient.get<Product[]>(
      `${API_CONFIG.PRODUCTS.baseURL}${API_CONFIG.PRODUCTS.endpoints.list}`
    );

    return response.data || [];
  } catch (error) {
    console.error("Error al obtener productos:", error);
    // En caso de error, retornamos un array vacío para no romper la UI
    return [];
  }
}
