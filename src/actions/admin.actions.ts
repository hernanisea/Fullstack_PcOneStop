import type { Order } from "../interfaces/order.interfaces";
import type { Product } from "../interfaces/product.interfaces";
import type { User } from "../interfaces/user.interfaces";
import { API_CONFIG, type ApiResponse, getAuthHeaders } from "../config/api.config";

export const getAdminProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch(API_CONFIG.PRODUCTS, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      console.error("Error al obtener productos:", response.statusText);
      return [];
    }

    const data: ApiResponse<Product[]> = await response.json();
    return data.ok && data.data ? data.data : [];
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
};

// Interfaz para la respuesta del backend de órdenes
interface BackendOrderResponse {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  productIds: string;
  sellerId: number;
  createdAt: string;
}

// Interfaz extendida para órdenes del admin con información adicional
export interface AdminOrder extends Order {
  userId?: number;
  status?: string;
  productIds?: string;
  itemCount?: number;
  userEmail?: string;
  userName?: string;
}

export const getAdminOrders = async (): Promise<AdminOrder[]> => {
  try {
    const response = await fetch(API_CONFIG.ORDERS, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      console.error("Error al obtener órdenes:", response.statusText);
      return [];
    }

    const data: ApiResponse<BackendOrderResponse[]> = await response.json();
    // Transformar órdenes del backend al formato del frontend
    if (data.ok && data.data) {
      // Obtener usuarios para poder mostrar información del cliente
      let users: Array<{ id: number; firstName?: string; name?: string; lastName?: string; email: string }> = [];
      try {
        const usersResponse = await fetch(API_CONFIG.AUTH, {
          headers: getAuthHeaders()
        });
        if (usersResponse.ok) {
          const usersData: ApiResponse<Array<{ id: number; firstName?: string; name?: string; lastName?: string; email: string }>> = await usersResponse.json();
          if (usersData.ok && usersData.data) {
            users = usersData.data;
          }
        }
      } catch (err) {
        console.warn("No se pudieron cargar usuarios para las órdenes");
      }

      return data.data.map((backendOrder: BackendOrderResponse) => {
        // Contar productos desde productIds (CSV)
        const productIds = backendOrder.productIds || "";
        const itemCount = productIds ? productIds.split(',').filter((id: string) => id.trim()).length : 0;
        
        // Buscar información del usuario
        const user = users.find(u => u.id === backendOrder.userId);
        
        return {
          id: backendOrder.id?.toString() || String(backendOrder.id),
          items: [], // El backend no devuelve items detallados, solo productIds
          total: backendOrder.totalAmount || 0,
          createdAt: backendOrder.createdAt || new Date().toISOString(),
          customerEmail: user?.email || "",
          customerName: user?.firstName || user?.name || "",
          customerLastName: user?.lastName || "",
          shippingStreet: "",
          shippingRegion: "",
          shippingComuna: "",
          // Campos adicionales
          userId: backendOrder.userId,
          status: backendOrder.status || "PENDIENTE",
          productIds: backendOrder.productIds,
          itemCount: itemCount,
          userEmail: user?.email || "",
          userName: user ? `${user.firstName || user.name || ''} ${user.lastName || ''}`.trim() : "",
        } as AdminOrder;
      });
    }
    return [];
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    return [];
  }
};

export const getAdminUsers = async (): Promise<Omit<User, 'password'>[]> => {
  try {
    const response = await fetch(API_CONFIG.AUTH, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      console.error("Error al obtener usuarios:", response.statusText);
      return [];
    }

    const data: ApiResponse<any[]> = await response.json();
    // Transformar usuarios del backend al formato del frontend
    if (data.ok && data.data) {
      return data.data.map((backendUser: any) => {
        const { password, ...rest } = backendUser;
        return {
          id: backendUser.id?.toString() || String(backendUser.id),
          firstName: backendUser.firstName,
          name: backendUser.firstName || backendUser.name, // Compatibilidad
          lastName: backendUser.lastName || "",
          email: backendUser.email,
          role: backendUser.role === "CLIENTE" ? "CLIENT" : (backendUser.role as Role),
          phone: backendUser.phone,
        } as Omit<User, 'password'>;
      });
    }
    return [];
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return [];
  }
};

export const getAdminProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await fetch(`${API_CONFIG.PRODUCTS}/${id}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      console.error("Error al obtener producto:", response.statusText);
      return null;
    }

    const data: ApiResponse<Product> = await response.json();
    return data.ok && data.data ? data.data : null;
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return null;
  }
};

export const createAdminProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
  try {
    // Limpiar y transformar los datos para que coincidan con lo que espera el backend
    // El backend requiere: name, brand, model, category, price, stock
    const cleanedData: any = {
      name: productData.name?.trim() || '',
      brand: productData.brand?.trim() || '',
      model: productData.model?.trim() || productData.name?.trim() || '', // Model es obligatorio, usamos name si no se proporciona
      category: productData.category?.trim() || '',
      price: Number(productData.price) || 0,
      stock: Number(productData.stock) || 0,
    };

    // Agregar campos opcionales solo si tienen valor
    if (productData.image?.trim()) {
      cleanedData.image = productData.image.trim();
    }
    
    if (productData.description?.trim()) {
      cleanedData.description = productData.description.trim();
    }

    // El backend espera isOnSale como boolean
    cleanedData.isOnSale = Boolean(productData.isOnSale || false);

    // Manejar el descuento desde el objeto offer si existe
    if (productData.offer?.discount !== undefined) {
      cleanedData.discount = Number(productData.offer.discount) || 0;
    } else {
      cleanedData.discount = 0;
    }

    // Validar campos requeridos
    if (!cleanedData.name || !cleanedData.brand || !cleanedData.model || !cleanedData.category) {
      throw new Error("Los campos nombre, marca, modelo y categoría son obligatorios");
    }

    if (cleanedData.price <= 0) {
      throw new Error("El precio debe ser mayor a 0");
    }

    if (cleanedData.stock < 0) {
      throw new Error("El stock no puede ser negativo");
    }

    // Asegurar tipos correctos (Double para price, Integer para stock)
    cleanedData.price = parseFloat(cleanedData.price);
    cleanedData.stock = parseInt(cleanedData.stock);

    const response = await fetch(API_CONFIG.PRODUCTS, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(cleanedData)
    });

    if (!response.ok) {
      // Intentar obtener el mensaje de error del backend
      let errorMessage = "Error al crear el producto";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Si no se puede parsear, usar el status text
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data: ApiResponse<Product> = await response.json();

    if (!data.ok || !data.data) {
      throw new Error(data.message || "Error al crear el producto");
    }

    return data.data;
  } catch (error: any) {
    console.error("Error al crear producto:", error);
    throw error;
  }
};

export const updateAdminProduct = async (productId: string, productData: Product): Promise<Product> => {
  try {
    // El backend usa JPA Repository.save() que actualiza si el ID existe
    // Enviamos el producto con el ID para que el backend lo actualice
    const productIdNum = typeof productId === 'string' ? parseInt(productId) : productId;
    
    // Limpiar y transformar los datos igual que en createAdminProduct
    const cleanedData: any = {
      id: productIdNum, // Incluimos el ID para que el backend sepa que es una actualización
      name: productData.name?.trim() || '',
      brand: productData.brand?.trim() || '',
      model: productData.model?.trim() || productData.name?.trim() || '',
      category: productData.category?.trim() || '',
      price: parseFloat(String(productData.price)) || 0,
      stock: parseInt(String(productData.stock)) || 0,
    };

    // Agregar campos opcionales solo si tienen valor
    if (productData.image?.trim()) {
      cleanedData.image = productData.image.trim();
    }
    
    if (productData.description?.trim()) {
      cleanedData.description = productData.description.trim();
    }

    // El backend espera isOnSale como boolean
    cleanedData.isOnSale = Boolean(productData.isOnSale || false);

    // Manejar el descuento desde el objeto offer si existe
    if (productData.offer?.discount !== undefined) {
      cleanedData.discount = Number(productData.offer.discount) || 0;
    } else {
      cleanedData.discount = 0;
    }

    // Validar campos requeridos
    if (!cleanedData.name || !cleanedData.brand || !cleanedData.model || !cleanedData.category) {
      throw new Error("Los campos nombre, marca, modelo y categoría son obligatorios");
    }

    if (cleanedData.price <= 0) {
      throw new Error("El precio debe ser mayor a 0");
    }

    if (cleanedData.stock < 0) {
      throw new Error("El stock no puede ser negativo");
    }

    // El backend no tiene endpoint PUT, usamos POST con el ID incluido
    // El método save() de JPA actualizará si el ID existe
    const response = await fetch(API_CONFIG.PRODUCTS, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(cleanedData)
    });

    if (!response.ok) {
      // Intentar obtener el mensaje de error del backend
      let errorMessage = "Error al actualizar el producto";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data: ApiResponse<Product> = await response.json();

    if (!data.ok || !data.data) {
      throw new Error(data.message || "Error al actualizar el producto");
    }

    return data.data;
  } catch (error: any) {
    console.error("Error al actualizar producto:", error);
    throw error;
  }
};

export const deleteAdminProduct = async (productId: string): Promise<{ success: boolean }> => {
  try {
    const response = await fetch(`${API_CONFIG.PRODUCTS}/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const data: ApiResponse<void> = await response.json();

    if (!data.ok) {
      throw new Error(data.message || "Error al eliminar el producto");
    }

    return { success: true };
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    throw error;
  }
};