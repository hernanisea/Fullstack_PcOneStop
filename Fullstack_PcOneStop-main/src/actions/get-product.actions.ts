import type { Product } from "../interfaces/product.interfaces";

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch('http://localhost:8082/api/v1/products');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
}
