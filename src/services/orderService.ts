/**
 * Servicio de Pedidos
 * Maneja la creación de pedidos con cantidades
 */

import { API_CONFIG, type ApiResponse, getAuthHeaders } from "../config/api.config";
import type { Order } from "../interfaces/order.interfaces";

// Interfaz para items del pedido (formato mejorado con cantidades)
interface BackendOrderItem {
  productId: number | string;
  quantity: number;
  price?: number; // Opcional, puede ayudar al backend a validar
}

// Interfaz para la orden que el backend espera
interface BackendOrder {
  userId?: number;
  totalAmount: number;
  status?: string;
  items: BackendOrderItem[]; // Formato nuevo recomendado con cantidades
  productIds?: string; // Formato antiguo para compatibilidad
  sellerId?: number;
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

/**
 * Crea un pedido con cantidades específicas para cada producto
 * Usa el formato mejorado con items[] que incluye quantity
 */
export async function createOrderWithQuantities(
  cartItems: Array<{ productId: string | number; quantity: number; price: number }>,
  totalAmount: number,
  userId?: number,
  sellerId: number = 1
): Promise<Order> {
  const token = getAuthHeaders()['Authorization'];

  if (!token) {
    throw new Error('No estás autenticado. Por favor, inicia sesión.');
  }

  // Preparar items con cantidades
  const items: BackendOrderItem[] = cartItems.map(item => ({
    productId: typeof item.productId === 'string' ? parseInt(item.productId) || item.productId : item.productId,
    quantity: item.quantity,
    price: item.price // Incluir precio para validación adicional
  }));

  // También mantener productIds para compatibilidad hacia atrás
  const productIds = cartItems.map(item => item.productId.toString()).join(',');

  const orderData: BackendOrder = {
    userId: userId,
    totalAmount: totalAmount,
    status: "PENDIENTE",
    items: items, // Formato nuevo recomendado
    productIds: productIds, // Formato antiguo para compatibilidad
    sellerId: sellerId
  };

  try {
    const response = await fetch(`${API_CONFIG.ORDERS}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData)
    });

    const result: ApiResponse<BackendOrderResponse> = await response.json();

    if (!result.ok) {
      // Manejar errores
      const message = result.message || 'Error al crear el pedido';

      if (message.includes('agotado') || message.includes('agotados')) {
        throw new Error('Uno o más productos están agotados. Por favor, elimínalos del carrito.');
      } else if (message.includes('Stock insuficiente')) {
        throw new Error(message);
      } else {
        throw new Error(message);
      }
    }

    // Transformar respuesta al formato del frontend
    if (result.data) {
      const backendOrder = result.data;
      return {
        id: backendOrder.id.toString(),
        items: cartItems.map(item => ({
          productId: item.productId.toString(),
          name: '', // Se puede obtener del carrito original
          price: item.price,
          qty: item.quantity
        })),
        total: backendOrder.totalAmount,
        createdAt: backendOrder.createdAt || new Date().toISOString(),
        customerEmail: '',
        customerName: '',
        customerLastName: '',
        shippingStreet: '',
        shippingRegion: '',
        shippingComuna: '',
      } as Order;
    }

    throw new Error('Error al crear el pedido: respuesta inválida');
  } catch (error) {
    console.error('Error al crear pedido:', error);
    throw error;
  }
}

