import type { Order } from "../interfaces/order.interfaces";
import { API_CONFIG, type ApiResponse, getAuthHeaders } from "../config/api.config";

// Ya no se guarda la última orden en localStorage
// Se puede obtener desde el backend si es necesario

// Interfaz para items del pedido (formato mejorado con cantidades)
interface BackendOrderItem {
  productId: number | string;
  quantity: number;
  price?: number; // Opcional, puede ayudar al backend a validar
}

// Interfaz para la orden que el backend espera
// Soporta ambos formatos: el nuevo con items[] y el antiguo con productIds (para compatibilidad)
interface BackendOrder {
  userId?: number; // Opcional, el backend lo extrae del token JWT si no se proporciona
  totalAmount: number;
  status?: string; // Opcional, el backend lo establece como PENDIENTE por defecto
  items?: BackendOrderItem[]; // Formato nuevo recomendado con cantidades
  productIds?: string; // Formato antiguo (CSV) - para compatibilidad hacia atrás
  sellerId?: number; // Opcional
}

// Interfaz para la respuesta del backend
interface BackendOrderResponse {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  productIds: string;
  sellerId: number;
  createdAt: string;
}

export async function postOrder(order: Order, userId?: number, sellerId: number = 1): Promise<Order> {
  try {
    // Transformar la orden del frontend al formato del backend
    // Usar formato mejorado con items[] que incluye cantidades
    const items: BackendOrderItem[] = order.items.map(item => ({
      productId: typeof item.productId === 'string' ? parseInt(item.productId) || item.productId : item.productId,
      quantity: item.qty,
      price: item.price // Incluir precio para validación adicional
    }));
    
    // También mantener productIds para compatibilidad hacia atrás (si el backend aún lo requiere)
    const productIds = order.items.map(item => item.productId).join(',');
    
    const backendOrder: BackendOrder = {
      // userId es opcional - el backend lo extrae del token JWT automáticamente
      userId: userId,
      totalAmount: order.total,
      status: "PENDIENTE",
      items: items, // Formato nuevo recomendado con cantidades
      productIds: productIds, // Formato antiguo para compatibilidad
      sellerId: sellerId
    };

    const response = await fetch(API_CONFIG.ORDERS, {
      method: 'POST',
      headers: getAuthHeaders(), // Incluye el token JWT en el header Authorization
      body: JSON.stringify(backendOrder)
    });

    const data: ApiResponse<BackendOrderResponse> = await response.json();

    if (data.ok && data.data) {
      // Transformar la respuesta del backend al formato del frontend
      const backendOrderData = data.data;
      const frontendOrder: Order = {
        id: backendOrderData.id.toString(),
        items: order.items, // Mantenemos los items originales
        total: backendOrderData.totalAmount,
        createdAt: backendOrderData.createdAt || new Date().toISOString(),
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        customerLastName: order.customerLastName,
        shippingStreet: order.shippingStreet,
        shippingDepartment: order.shippingDepartment,
        shippingRegion: order.shippingRegion,
        shippingComuna: order.shippingComuna,
        shippingIndications: order.shippingIndications,
      };
      
      // Ya no se guarda en localStorage, todo está en la base de datos
      return frontendOrder;
    }

    // Parsear errores específicos del backend
    const errorMessage = data.message || "Error al crear el pedido";
    
    // Crear un error con información específica
    const error = new Error(errorMessage);
    
    // Agregar información adicional para identificar el tipo de error
    if (errorMessage.includes('agotado') || errorMessage.includes('agotados') || errorMessage.includes('No hay unidades disponibles')) {
      (error as any).type = 'OUT_OF_STOCK';
      (error as any).isStockError = true;
    } else if (errorMessage.includes('Stock insuficiente') || errorMessage.includes('insuficiente')) {
      (error as any).type = 'INSUFFICIENT_STOCK';
      (error as any).isStockError = true;
    } else if (response.status === 400) {
      (error as any).type = 'VALIDATION_ERROR';
    } else if (response.status === 401 || response.status === 403) {
      (error as any).type = 'AUTH_ERROR';
    }
    
    (error as any).statusCode = data.statusCode || response.status;
    (error as any).originalMessage = errorMessage;
    
    throw error;
  } catch (error) {
    console.error("Error al crear pedido:", error);
    throw error;
  }
}

// Función eliminada - las órdenes se obtienen desde el backend
// Si necesitas obtener la última orden, usa getAdminOrders o crea un endpoint específico
export async function getLastOrder(userId: number): Promise<Order | null> {
  try {
    const response = await fetch(`${API_CONFIG.ORDERS}/user/${userId}`, {
      headers: getAuthHeaders()
    });
    
    const data: ApiResponse<any[]> = await response.json();
    
    if (data.ok && data.data && data.data.length > 0) {
      // Retornar la orden más reciente
      const orders = data.data.sort((a, b) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      const latestOrder = orders[0];
      
      // Transformar al formato del frontend
      return {
        id: latestOrder.id.toString(),
        items: [], // El backend no devuelve items detallados
        total: latestOrder.totalAmount || 0,
        createdAt: latestOrder.createdAt || new Date().toISOString(),
        customerEmail: "",
        customerName: "",
        customerLastName: "",
        shippingStreet: "",
        shippingRegion: "",
        shippingComuna: "",
      } as Order;
    }
    
    return null;
  } catch (error) {
    console.error("Error al obtener última orden:", error);
    return null;
  }
}
