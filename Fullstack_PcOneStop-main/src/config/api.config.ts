// Configuración de URLs de los microservicios
export const API_CONFIG = {
  // Microservicio de Usuarios
  USERS: {
    baseURL: 'http://localhost:8081/api/v1/auth',
    endpoints: {
      login: '/login',
      register: '/register',
      users: '', // GET /api/v1/auth
      userById: (id: string) => `/${id}`,
    }
  },
  
  // Microservicio de Inventario
  PRODUCTS: {
    baseURL: 'http://localhost:8082/api/v1/products',
    endpoints: {
      list: '',
      byId: (id: string) => `/${id}`,
      byCategory: (category: string) => `/category/${category}`,
      offers: '/offers',
      create: '',
      update: (id: string) => `/${id}`,
      delete: (id: string) => `/${id}`,
      reduceStock: (id: string) => `/${id}/stock`,
    }
  },
  
  // Microservicio de Pagos
  ORDERS: {
    baseURL: 'http://localhost:8083/api/v1/orders',
    endpoints: {
      create: '',
      list: '',
      byId: (id: string) => `/${id}`,
      byCustomerEmail: (email: string) => `/customer/${email}`,
      delete: (id: string) => `/${id}`,
    }
  },
  
  // Microservicio de Calificaciones
  REVIEWS: {
    baseURL: 'http://localhost:8084/api/v1/reviews',
    endpoints: {
      create: '',
      list: '',
      byProduct: (productId: string) => `/product/${productId}`,
      byUser: (userId: string) => `/user/${userId}`,
      delete: (id: string) => `/${id}`,
    }
  }
} as const;

