import type { Review } from "../interfaces/review.interfaces";
import { API_CONFIG, type ApiResponse, getAuthHeaders } from "../config/api.config";

// Interfaz para la reseña que el backend espera
interface BackendReview {
  productId: number;
  userId?: number;
  rating: number;
  comment: string;
}

// Interfaz para la respuesta del backend
interface BackendReviewResponse {
  id: number;
  productId: number;
  userId?: number;
  rating: number;
  comment: string;
  createdAt?: string;
}

// Transformar reseña del backend al formato del frontend
function transformReview(backendReview: BackendReviewResponse, authorName: string): Review {
  return {
    id: backendReview.id.toString(),
    productId: backendReview.productId.toString(),
    userId: backendReview.userId?.toString() || null,
    author: authorName,
    rating: backendReview.rating as 1 | 2 | 3 | 4 | 5,
    comment: backendReview.comment,
    date: backendReview.createdAt || new Date().toISOString(),
  };
}

export async function getReviewsByProductId(productId: string): Promise<Review[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_CONFIG.REVIEWS}/product/${productId}`, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      // Si es 204 (No Content), significa que no hay reseñas
      if (response.status === 204) {
        return [];
      }
      return [];
    }

    const data: ApiResponse<BackendReviewResponse[]> = await response.json();
    
    if (data.ok && data.data) {
      // Transformar las reseñas del backend al formato del frontend
      return data.data.map(review => 
        transformReview(review, "Usuario") // El backend no devuelve el nombre del autor
      );
    }
    
    return [];
  } catch (error: any) {
    if (!error.message?.includes('Failed to fetch') && !error.message?.includes('ERR_CONNECTION_REFUSED')) {
      console.error("Error al obtener reseñas:", error);
    }
    return [];
  }
}

export async function addReview(review: Omit<Review, 'id' | 'date'>, userId?: number): Promise<Review | null> {
  try {
    const backendReview: BackendReview = {
      productId: parseInt(review.productId),
      userId: userId,
      rating: review.rating,
      comment: review.comment,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(API_CONFIG.REVIEWS, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(backendReview),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    const data: ApiResponse<BackendReviewResponse> = await response.json();

    if (data.ok && data.data) {
      return transformReview(data.data, review.author);
    }

    throw new Error(data.message || "Error al guardar la reseña");
  } catch (error: any) {
    if (error.name === 'AbortError' || error.message?.includes('Failed to fetch')) {
      throw new Error("No se pudo conectar con el servidor. Verifica que el backend esté corriendo.");
    }
    console.error("Error al guardar reseña:", error);
    throw error;
  }
}

