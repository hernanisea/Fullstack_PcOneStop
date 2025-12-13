// src/interfaces/review.interfaces.ts
export type Review = {
  id: string;         // uuid
  productId: string;  // id del producto
  userId: string | null; // <-- AÑADIDO: id del usuario, o null si es anónimo
  author: string;       // nombre visible (Anónimo o user.name)
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  date: string;       // ISO string
};