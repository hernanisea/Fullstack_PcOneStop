import type { Product } from "../interfaces/product.interfaces";
import { API_CONFIG, type ApiResponse } from "../config/api.config";

// Variable para evitar múltiples logs del mismo error
let connectionErrorLogged = false;

export async function getOffers(): Promise<Product[]> {
  try {
    // Crear un AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_CONFIG.PRODUCTS}/offers`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      // Si es 204 (No Content), significa que no hay productos en oferta
      if (response.status === 204) {
        return [];
      }
      if (response.status !== 0) {
        console.warn("Error al obtener productos en oferta:", response.statusText);
      }
      return [];
    }

    const data: ApiResponse<Product[]> = await response.json();
    return data.ok && data.data ? data.data : [];
  } catch (error: any) {
    // Detectar errores de conexión y solo loguear una vez
    if (error.name === 'AbortError' || error.message?.includes('Failed to fetch') || error.message?.includes('ERR_CONNECTION_REFUSED')) {
      if (!connectionErrorLogged) {
        console.warn("⚠️ El backend no está disponible. Asegúrate de que los microservicios estén corriendo en los puertos 8081-8084.");
        connectionErrorLogged = true;
      }
    } else {
      console.error("Error al obtener productos en oferta:", error);
    }
    return [];
  }
}

