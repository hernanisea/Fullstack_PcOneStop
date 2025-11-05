import { db } from "../data/db.js";
import type { Order } from "../interfaces/order.interfaces";
import type { Product } from "../interfaces/product.interfaces";
import type { User } from "../interfaces/user.interfaces";

// --- (Existente) ---
export const getAdminProducts = async (): Promise<Product[]> => {
  return Promise.resolve(db.products);
};

// --- (Corregido) ---
// La función estaba vacía. Esta es la implementación correcta.
export const getAdminOrders = async (): Promise<Order[]> => {
  // @ts-ignore
  return Promise.resolve(db.orders);
};

// --- (Corregido) ---
// La función estaba vacía. Esta es la implementación correcta.
export const getAdminUsers = async (): Promise<Omit<User, 'password'>[]> => {
  const users = db.users.map(u => {
    const { password, ...userWithoutPassword } = u;
    return userWithoutPassword;
  });
  // @ts-ignore
  return Promise.resolve(users);
};

// --- (Resto de las funciones que ya tenías) ---
export const getAdminProductById = async (id: string): Promise<Product | null> => {
  const product = db.products.find(p => p.id === id);
  return Promise.resolve(product ?? null);
};

export const createAdminProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
  await new Promise(r => setTimeout(r, 500)); // Simula latencia
  const newProduct: Product = {
    ...productData,
    id: `prod-${Date.now().toString().slice(-6)}`,
  };
  db.products.push(newProduct); // Añade al mock DB
  return newProduct;
};

export const updateAdminProduct = async (productId: string, productData: Product): Promise<Product> => {
  await new Promise(r => setTimeout(r, 500)); // Simula latencia
  const index = db.products.findIndex(p => p.id === productId);
  if (index === -1) {
    throw new Error("Producto no encontrado");
  }
  db.products[index] = productData; // Actualiza el mock DB
  return productData;
};

export const deleteAdminProduct = async (productId: string): Promise<{ success: boolean }> => {
  await new Promise(r => setTimeout(r, 500)); // Simula latencia
  const initialLength = db.products.length;
  // Re-asigna db.products para "mutar" el mock DB
  db.products = db.products.filter(p => p.id !== productId);
  
  if (db.products.length === initialLength) {
    throw new Error("No se pudo eliminar el producto");
  }
  return { success: true };
};