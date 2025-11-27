import { apiClient } from "../services/api.client";
import { API_CONFIG } from "../config/api.config";
import type { Order } from "../interfaces/order.interfaces";
import type { Product } from "../interfaces/product.interfaces";
import type { User } from "../interfaces/user.interfaces";

// Obtener todos los productos (admin)
export const getAdminProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get<Product[]>(
      `${API_CONFIG.PRODUCTS.baseURL}${API_CONFIG.PRODUCTS.endpoints.list}`
    );
    return response.data || [];
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
};

// Obtener todas las órdenes (admin)
export const getAdminOrders = async (): Promise<Order[]> => {
  try {
    const response = await apiClient.get<Order[]>(
      `${API_CONFIG.ORDERS.baseURL}${API_CONFIG.ORDERS.endpoints.list}`
    );
    return response.data || [];
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    return [];
  }
};

// Obtener todos los usuarios (admin)
export const getAdminUsers = async (): Promise<Omit<User, 'password'>[]> => {
  try {
    const response = await apiClient.get<User[]>(
      `${API_CONFIG.USERS.baseURL}${API_CONFIG.USERS.endpoints.users}`
    );
    // El backend ya devuelve usuarios sin contraseña, pero por seguridad lo filtramos
    return (response.data || []).map(({ password, ...user }) => user);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return [];
  }
};

// Obtener producto por ID (admin)
export const getAdminProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await apiClient.get<Product>(
      `${API_CONFIG.PRODUCTS.baseURL}${API_CONFIG.PRODUCTS.endpoints.byId(id)}`
    );
    return response.data || null;
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return null;
  }
};

// Crear nuevo producto (admin)
export const createAdminProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
  try {
    const response = await apiClient.post<Product>(
      `${API_CONFIG.PRODUCTS.baseURL}${API_CONFIG.PRODUCTS.endpoints.create}`,
      productData
    );

    if (!response.data) {
      throw new Error(response.message || "Error al crear el producto");
    }

    return response.data;
  } catch (error) {
    console.error("Error al crear producto:", error);
    throw error;
  }
};

// Actualizar producto existente (admin)
export const updateAdminProduct = async (productId: string, productData: Product): Promise<Product> => {
  try {
    const response = await apiClient.put<Product>(
      `${API_CONFIG.PRODUCTS.baseURL}${API_CONFIG.PRODUCTS.endpoints.update(productId)}`,
      productData
    );

    if (!response.data) {
      throw new Error(response.message || "Error al actualizar el producto");
    }

    return response.data;
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw error;
  }
};

// Eliminar producto (admin)
export const deleteAdminProduct = async (productId: string): Promise<{ success: boolean }> => {
  try {
    await apiClient.delete<void>(
      `${API_CONFIG.PRODUCTS.baseURL}${API_CONFIG.PRODUCTS.endpoints.delete(productId)}`
    );
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    throw error;
  }
};