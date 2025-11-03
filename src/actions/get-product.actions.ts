import { db } from "../data/db.js"; // ⚠️ incluye la extensión .js
import type { Product } from "../interfaces/product.interfaces";

export async function getProducts(): Promise<Product[]> {
  // Simula un fetch a base de datos
  return Promise.resolve(db.products);
}
