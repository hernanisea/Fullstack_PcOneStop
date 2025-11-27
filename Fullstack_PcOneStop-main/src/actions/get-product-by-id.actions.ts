import { apiClient } from "../services/api.client";
import { API_CONFIG } from "../config/api.config";
import type { Product } from "../interfaces/product.interfaces";

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await apiClient.get<Product>(
      `${API_CONFIG.PRODUCTS.baseURL}${API_CONFIG.PRODUCTS.endpoints.byId(id)}`
    );

    return response.data || null;
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return null;
  }
}
