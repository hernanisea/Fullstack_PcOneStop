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

export async function reportProduct(
  productId: string | number,
  reason: string,
  userId: number
): Promise<ProductReport> {
  try {
    const backendReport = {
      userId: userId,
      reason: reason,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const productIdNum = typeof productId === 'string' ? parseInt(productId) : productId;
    const response = await fetch(`${API_CONFIG.PRODUCTS_REPORTS}/${productIdNum}/reports`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(backendReport),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok && response.status === 0) {
      throw new Error("No se pudo conectar con el servidor. Verifica que el backend esté corriendo.");
    }

    const data: ApiResponse<BackendReportResponse> = await response.json();

    if (data.ok && data.data) {
      return {
        id: data.data.id,
        productId: data.data.productId,
        userId: data.data.userId,
        reason: data.data.reason,
        date: data.data.date,
      };
    }

    throw new Error(data.message || "Error al enviar el reporte");
  } catch (error: any) {
    if (error.name === 'AbortError' || error.message?.includes('Failed to fetch')) {
      throw new Error("No se pudo conectar con el servidor. Verifica que el backend esté corriendo.");
    }
    console.error("Error al enviar reporte:", error);
    throw error;
  }
}

