import type { ProductReport } from "../interfaces/report.interfaces";
import { API_CONFIG, type ApiResponse, getAuthHeaders } from "../config/api.config";

// Interfaz para la respuesta del backend
interface BackendReportResponse {
  id: number;
  productId: number;
  userId: number;
  reason: string;
  date: string;
}

export async function getAdminReports(): Promise<ProductReport[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(API_CONFIG.REPORTS, {
      headers: getAuthHeaders(),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("No estás autenticado. Por favor, inicia sesión.");
      }
      if (response.status === 403) {
        throw new Error("No tienes permisos para ver los reportes. Se requiere rol de administrador.");
      }
      console.error("Error al obtener reportes:", response.statusText);
      return [];
    }

    const data: ApiResponse<BackendReportResponse[]> = await response.json();
    
    if (data.ok && data.data) {
      return data.data.map(report => ({
        id: report.id,
        productId: report.productId,
        userId: report.userId,
        reason: report.reason,
        date: report.date,
      }));
    }
    
    return [];
  } catch (error: any) {
    if (error.name === 'AbortError' || error.message?.includes('Failed to fetch')) {
      throw new Error("No se pudo conectar con el servidor. Verifica que el backend esté corriendo.");
    }
    console.error("Error al obtener reportes:", error);
    throw error;
  }
}

export async function getReportCountByProduct(productId: string | number): Promise<number> {
  try {
    const productIdNum = typeof productId === 'string' ? parseInt(productId) : productId;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_CONFIG.REPORTS}/count/${productIdNum}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return 0;
    }

    const data: ApiResponse<number> = await response.json();
    return data.ok && data.data ? data.data : 0;
  } catch (error) {
    console.error("Error al obtener conteo de reportes:", error);
    return 0;
  }
}

