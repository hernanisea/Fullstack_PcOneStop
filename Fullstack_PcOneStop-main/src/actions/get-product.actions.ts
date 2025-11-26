import { db } from "../data/db.js"; 
import type { Product } from "../interfaces/product.interfaces";

export async function getProducts(): Promise<Product[]> {
 
  return Promise.resolve(db.products);
}
