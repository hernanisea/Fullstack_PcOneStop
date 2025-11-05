import type { CartItem } from "../interfaces/user.interfaces";
import type { Review } from "../interfaces/review.interfaces";
const KEY = "pcos_cart";

export function getCartFromLS(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
export function saveCartToLS(data: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(data));
}
// ---------------- Reseñas en LocalStorage ----------------
const REVIEWS_KEY = "pcos_reviews";

// 2. Actualizar el tipo de retorno
export function getReviewsFromLS(productId: string): Review[] {
  const raw = localStorage.getItem(REVIEWS_KEY);
  const all: Record<string, Review[]> = raw ? JSON.parse(raw) : {};
  return (all[productId] ?? []) as Review[];
}

// 3. Actualizar el tipo del parámetro
export function saveReviewsToLS(productId: string, reviews: Review[]) {
  const raw = localStorage.getItem(REVIEWS_KEY);
  const all: Record<string, Review[]> = raw ? JSON.parse(raw) : {};
  all[productId] = reviews;
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(all));
}

// 4. Actualizar el tipo del parámetro
export function addReviewToLS(review: Review) {
  const current = getReviewsFromLS(review.productId);
  // NOTA: Esta función 'addReviewToLS' la dejaremos de usar en el componente
  // para implementar la lógica de "editar", pero la actualizamos por si la usas en otro lado.
  const next = [review, ...current];
  saveReviewsToLS(review.productId, next);
  return next;
}