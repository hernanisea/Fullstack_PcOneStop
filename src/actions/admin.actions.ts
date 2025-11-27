import type { Order } from "../interfaces/order.interfaces";
import type { Product } from "../interfaces/product.interfaces";
import type { User } from "../interfaces/user.interfaces";

export const getAdminProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch('http://localhost:8082/api/v1/products');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
};

export const getAdminOrders = async (): Promise<Order[]> => {
  try {
    const response = await fetch('http://localhost:8083/api/v1/orders');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    return [];
  }
};

export const getAdminUsers = async (): Promise<Omit<User, 'password'>[]> => {
  try {
    const response = await fetch('http://localhost:8081/api/v1/auth');
    const data = await response.json();
    return (data.data || []).map(({ password, ...user }: User) => user);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return [];
  }
};

export const getAdminProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await fetch(`http://localhost:8082/api/v1/products/${id}`);
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return null;
  }
};

export const createAdminProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
  try {
    // Limpiar el objeto para no enviar campos undefined
    const cleanData = Object.fromEntries(
      Object.entries(productData).filter(([_, value]) => value !== undefined)
    );
    
    const response = await fetch('http://localhost:8082/api/v1/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanData)
    });

    const data = await response.json();

    if (!data.success || !data.data) {
      throw new Error(data.message || "Error al crear el producto");
    }

    return data.data;
  } catch (error) {
    console.error("Error al crear producto:", error);
    throw error;
  }
};

export const updateAdminProduct = async (productId: string, productData: Product): Promise<Product> => {
  try {
    // Limpiar el objeto para no enviar campos undefined
    const cleanData = Object.fromEntries(
      Object.entries(productData).filter(([_, value]) => value !== undefined)
    );
    
    const response = await fetch(`http://localhost:8082/api/v1/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cleanData)
    });

    const data = await response.json();

    if (!data.success || !data.data) {
      throw new Error(data.message || "Error al actualizar el producto");
    }

    return data.data;
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw error;
  }
};

export const deleteAdminProduct = async (productId: string): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(`http://localhost:8082/api/v1/products/${productId}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Error al eliminar el producto");
    }

    return { success: true };
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    throw error;
  }
};