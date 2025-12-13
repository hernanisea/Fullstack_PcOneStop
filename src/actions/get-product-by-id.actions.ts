import type { Product } from "../interfaces/product.interfaces";
import { API_CONFIG, type ApiResponse } from "../config/api.config";

export async function getProductById(id: string): Promise<Product | null> {
  try {
    // Crear un AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_CONFIG.PRODUCTS}/${id}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      if (response.status !== 0) {
        console.warn("Error al obtener producto:", response.statusText);
      }
      return null;
    }

    const data: ApiResponse<Product> = await response.json();
    return data.ok && data.data ? data.data : null;
  } catch (error: any) {
    // Solo loguear si no es un error de conexión (ya se maneja en getProducts)
    if (!error.message?.includes('Failed to fetch') && !error.message?.includes('ERR_CONNECTION_REFUSED')) {
      console.error("Error al obtener producto:", error);
    }
    return null;
  }
}
