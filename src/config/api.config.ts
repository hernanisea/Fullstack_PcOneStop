// Configuración de URLs base de los microservicios
export const API_CONFIG = {
  AUTH: 'http://localhost:8081/api/v1/auth',
  PRODUCTS: 'http://localhost:8082/api/v1/products',
  PRODUCTS_REPORTS: 'http://localhost:8082/api/products', // Endpoint de reportes individuales (sin /v1)
  REPORTS: 'http://localhost:8082/api/v1/reports', // Endpoint de reportes para admin (con /v1)
  ORDERS: 'http://localhost:8083/api/v1/orders',
  REVIEWS: 'http://localhost:8084/api/v1/reviews',
} as const;

// Tipo para las respuestas del backend (usa 'ok' en lugar de 'success')
export interface ApiResponse<T> {
  ok: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  count: number;
}

// Tipo para LoginResponse del backend
export interface LoginResponse {
  user: any;
  token: string;
}

// Helper para obtener el token JWT del localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('jwt_token');
};

// Helper para guardar el token JWT
export const setAuthToken = (token: string): void => {
  localStorage.setItem('jwt_token', token);
};

// Helper para eliminar el token JWT
export const removeAuthToken = (): void => {
  localStorage.removeItem('jwt_token');
};

// Helper para obtener headers con autenticación
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

