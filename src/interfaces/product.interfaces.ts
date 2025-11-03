export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
  description?: string;
  stock: number;
  brand?: string;
  oldPrice?: number;
}


export type CartItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
};