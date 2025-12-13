import type { Product } from "../interfaces/product.interfaces";
import { API_CONFIG, type ApiResponse, getAuthHeaders, getAuthToken, removeAuthToken } from "../config/api.config";
import { db } from "../data/db";

// Variable para evitar múltiples logs del mismo error
let connectionErrorLogged = false;
let usingLocalDataLogged = false;

/**
 * Obtiene productos desde el backend.
 * ⚠️ IMPORTANTE: Este endpoint ahora requiere autenticación (token JWT).
 * Si el backend no está disponible o el token es inválido, usa datos locales como fallback.
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const token = getAuthToken();
    
    // Si no hay token, usar datos locales directamente (permite navegación sin login)
    if (!token) {
      if (!usingLocalDataLogged) {
        console.info("ℹ️ No hay token de autenticación. Usando productos locales.");
        usingLocalDataLogged = true;
      }
      return getLocalProducts();
    }
    
    // Crear un AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    // Incluir token JWT en el header Authorization
    const response = await fetch(API_CONFIG.PRODUCTS, {
      method: 'GET',
      headers: getAuthHeaders(),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    // Manejar errores de autenticación
    if (response.status === 401 || response.status === 403) {
      // Intentar leer el mensaje de error (opcional)
      await response.json().catch(() => null);
      
      // Token inválido o expirado - limpiar token y usar datos locales
      console.warn("⚠️ Token inválido o expirado. Limpiando sesión y usando productos locales.");
      removeAuthToken();
      
      // Si estamos en el navegador, podríamos redirigir a login después de un delay
      // Pero por ahora solo usamos datos locales para no interrumpir la navegación
      if (typeof window !== 'undefined' && response.status === 401) {
        // Solo redirigir si estamos en una página que requiere autenticación
        // Por ahora, solo usamos datos locales como fallback
        setTimeout(() => {
          // No redirigir automáticamente para permitir navegación sin login
          // El usuario puede seguir viendo productos locales
        }, 0);
      }
      
      return getLocalProducts();
    }
    
    if (!response.ok) {
      // Otros errores (404, 500, etc.)
      if (response.status !== 0) {
        console.warn("Error al obtener productos:", response.status, response.statusText);
      }
      // Usar datos locales como fallback
      return getLocalProducts();
    }

    const data: ApiResponse<Product[]> = await response.json();
    const products = data.ok && data.data ? data.data : [];
    
    // Si el backend retorna array vacío, usar datos locales como fallback
    if (products.length === 0) {
      console.info("ℹ️ El backend no tiene productos. Usando datos locales.");
      return getLocalProducts();
    }
    
    // Resetear flags si la conexión fue exitosa
    connectionErrorLogged = false;
    usingLocalDataLogged = false;
    
    return products;
  } catch (error: any) {
    // Detectar errores de conexión y solo loguear una vez
    if (error.name === 'AbortError' || error.message?.includes('Failed to fetch') || error.message?.includes('ERR_CONNECTION_REFUSED')) {
      if (!connectionErrorLogged) {
        console.warn("⚠️ El backend no está disponible. Usando productos precargados locales.");
        console.warn("💡 Para usar el backend, asegúrate de que los microservicios estén corriendo en los puertos 8081-8084.");
        connectionErrorLogged = true;
      }
    } else {
      // Otros errores se loguean normalmente
      console.error("Error al obtener productos:", error);
    }
    
    // Usar datos locales como fallback
    return getLocalProducts();
  }
}

/**
 * Obtiene productos desde los datos locales (fallback)
 */
function getLocalProducts(): Product[] {
  try {
    // Convertir los productos locales al formato esperado
    return db.products.map(product => {
      // Mapear la oferta si existe
      let offer = undefined;
      if (product.offer && product.isOnSale) {
        offer = {
          discount: product.offer.discount || 0,
          startDate: product.offer.startDate || new Date().toISOString(),
          endDate: product.offer.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días desde ahora
        };
      }
      
      return {
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        stock: product.stock || 0,
        image: product.image || "/logo.png",
        description: product.description || "",
        isOnSale: product.isOnSale || false,
        offer: offer,
      } as Product;
    });
  } catch (error) {
    console.error("Error al cargar productos locales:", error);
    return [];
  }
}
