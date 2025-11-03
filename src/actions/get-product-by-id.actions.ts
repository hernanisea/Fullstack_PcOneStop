import { db } from "../data/db.js";
import type { Product } from "../interfaces/product.interfaces";

export async function getProductById(id: string): Promise<Product | null> {
  const product = db.products.find((p) => p.id === id);
  return Promise.resolve(product ?? null);
}
