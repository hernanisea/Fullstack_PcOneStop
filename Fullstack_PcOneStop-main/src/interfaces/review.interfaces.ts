export type Review = {
  id: string;          // uuid
  productId: string;   // id del producto
  author: string;      // nombre visible
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  date: string;        // ISO string
};
