// Cliente HTTP para comunicarse con los microservicios

// Estructura de respuesta del backend
export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T | null;
  count: number;
}

// Opciones para las peticiones HTTP
interface RequestOptions extends RequestInit {
  params?: Record<string, string | number>;
}

/**
 * Cliente HTTP genérico para hacer peticiones a los microservicios
 */
class ApiClient {
  /**
   * Realiza una petición HTTP y maneja la respuesta del backend
   */
  private async request<T>(
    url: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { params, ...fetchOptions } = options;
    
    // Construir URL con parámetros de consulta si existen
    let finalUrl = url;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, String(value));
      });
      finalUrl = `${url}?${searchParams.toString()}`;
    }

    try {
      const response = await fetch(finalUrl, {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      });

      const data: ApiResponse<T> = await response.json();

      // Si el backend devuelve un error, lanzamos una excepción
      if (!data.success || !response.ok) {
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      // Manejo de errores de red
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('No se pudo conectar con el servidor. Verifica que los microservicios estén ejecutándose.');
      }
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T>(url: string, params?: Record<string, string | number>): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'GET',
      params,
    });
  }

  /**
   * POST request
   */
  async post<T>(url: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(url: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      method: 'DELETE',
    });
  }
}

// Instancia singleton del cliente
export const apiClient = new ApiClient();

