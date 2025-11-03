import type { CartItem } from "../interfaces/user.interfaces";
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

export function getReviewsFromLS(productId: string) {
  const raw = localStorage.getItem(REVIEWS_KEY);
  const all: Record<string, any[]> = raw ? JSON.parse(raw) : {};
  return (all[productId] ?? []) as Array<{
    id: string;
    productId: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

export function saveReviewsToLS(productId: string, reviews: any[]) {
  const raw = localStorage.getItem(REVIEWS_KEY);
  const all: Record<string, any[]> = raw ? JSON.parse(raw) : {};
  all[productId] = reviews;
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(all));
}

export function addReviewToLS(review: {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}) {
  const current = getReviewsFromLS(review.productId);
  const next = [review, ...current];
  saveReviewsToLS(review.productId, next);
  return next;
}
