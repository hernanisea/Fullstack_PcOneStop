import type { Product } from "../interfaces/product.interfaces";

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`http://localhost:8082/api/v1/products/${id}`);
    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return null;
  }
}
