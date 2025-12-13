// src/interfaces/report.interfaces.ts
export interface ProductReport {
  id?: number;
  productId: number;
  userId: number;
  reason: string;
  date?: string; // ISO string
}

