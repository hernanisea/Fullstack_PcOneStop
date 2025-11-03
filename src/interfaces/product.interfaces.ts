export interface Product {
  id: string;
  name: string;
  category: "CPU" | "GPU" | "RAM" | string; // puedes ajustar a tus categorías reales
  price: number;
  image: string;
  description: string;
  stock: number;
  brand: string;
}
