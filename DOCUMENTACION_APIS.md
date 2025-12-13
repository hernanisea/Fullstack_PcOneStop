# Documentación de APIs
## PC OneStop - Integración Frontend-Backend

**Versión:** 1.0  
**Fecha:** 2024  
**Proyecto:** Evaluación Final Transversal - DSY1104

---

## 1. Introducción

### 1.1 Propósito
Este documento describe las APIs REST utilizadas en PC OneStop, los endpoints disponibles, sus parámetros, respuestas y ejemplos de uso.

### 1.2 Arquitectura
PC OneStop utiliza una arquitectura de microservicios:
- **Servicio de Autenticación** (Puerto 8081)
- **Servicio de Productos** (Puerto 8082)
- **Servicio de Pedidos** (Puerto 8083)
- **Servicio de Reseñas** (Puerto 8084)

### 1.3 Documentación Swagger
Todos los endpoints están documentados en Swagger UI:
- Disponible en: `http://localhost:PORT/swagger-ui.html`
- Cada microservicio tiene su propia documentación Swagger

---

## 2. Configuración Base

### 2.1 URLs Base
```typescript
export const API_CONFIG = {
  AUTH: 'http://localhost:8081/api/v1/auth',
  PRODUCTS: 'http://localhost:8082/api/v1/products',
  PRODUCTS_REPORTS: 'http://localhost:8082/api/products',
  REPORTS: 'http://localhost:8082/api/v1/reports',
  ORDERS: 'http://localhost:8083/api/v1/orders',
  REVIEWS: 'http://localhost:8084/api/v1/reviews',
};
```

### 2.2 Formato de Respuesta Estándar
```typescript
interface ApiResponse<T> {
  ok: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  count: number;
}
```

### 2.3 Autenticación
- **Método**: JWT (JSON Web Token)
- **Header**: `Authorization: Bearer <token>`
- **Almacenamiento**: localStorage (clave: `jwt_token`)

---

## 3. Servicio de Autenticación (Puerto 8081)

### 3.1 POST /api/v1/auth/register
Registra un nuevo usuario en el sistema.

**Request:**
```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "role": "CLIENT"
}
```

**Response (200 OK):**
```json
{
  "ok": true,
  "statusCode": 200,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": 1,
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan@example.com",
      "role": "CLIENT"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "count": 1
}
```

**Errores:**
- `400`: Email ya existe o datos inválidos
- `500`: Error del servidor

---

### 3.2 POST /api/v1/auth/login
Inicia sesión con email y contraseña.

**Request:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "ok": true,
  "statusCode": 200,
  "message": "Login exitoso",
  "data": {
    "user": {
      "id": 1,
      "firstName": "Juan",
      "lastName": "Pérez",
      "email": "juan@example.com",
      "role": "CLIENT"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "count": 1
}
```

**Errores:**
- `401`: Credenciales inválidas
- `500`: Error del servidor

---

### 3.3 GET /api/v1/auth/validate
Valida el token JWT y retorna el usuario actual.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "ok": true,
  "statusCode": 200,
  "message": "Token válido",
  "data": {
    "id": 1,
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan@example.com",
    "role": "CLIENT"
  },
  "count": 1
}
```

**Errores:**
- `401`: Token inválido o expirado
- `403`: Token no proporcionado

---

## 4. Servicio de Productos (Puerto 8082)

### 4.1 GET /api/v1/products
Obtiene la lista de todos los productos.

**Response (200 OK):**
```json
{
  "ok": true,
  "statusCode": 200,
  "message": "Productos obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "name": "Procesador AMD Ryzen 5 5600X",
      "brand": "AMD",
      "category": "Procesador (CPU)",
      "price": 600000,
      "stock": 15,
      "image": "https://example.com/image.jpg",
      "description": "Procesador de 6 núcleos...",
      "isOnSale": false
    }
  ],
  "count": 50
}
```

---

### 4.2 GET /api/v1/products/:id
Obtiene un producto específico por ID.

**Response (200 OK):**
```json
{
  "ok": true,
  "statusCode": 200,
  "message": "Producto obtenido exitosamente",
  "data": {
    "id": 1,
    "name": "Procesador AMD Ryzen 5 5600X",
    "brand": "AMD",
    "category": "Procesador (CPU)",
    "price": 600000,
    "stock": 15,
    "image": "https://example.com/image.jpg",
    "description": "Procesador de 6 núcleos...",
    "isOnSale": false
  },
  "count": 1
}
```

**Errores:**
- `404`: Producto no encontrado

---

### 4.3 POST /api/v1/products
Crea un nuevo producto (Solo ADMIN).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Nuevo Producto",
  "brand": "Marca",
  "category": "Procesador (CPU)",
  "price": 500000,
  "stock": 10,
  "image": "https://example.com/image.jpg",
  "description": "Descripción del producto",
  "isOnSale": false
}
```

**Response (201 Created):**
```json
{
  "ok": true,
  "statusCode": 201,
  "message": "Producto creado exitosamente",
  "data": {
    "id": 51,
    "name": "Nuevo Producto",
    ...
  },
  "count": 1
}
```

**Errores:**
- `401`: No autenticado
- `403`: No autorizado (no es ADMIN)
- `400`: Datos inválidos

---

### 4.4 PUT /api/v1/products/:id
Actualiza un producto existente (Solo ADMIN).

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "name": "Producto Actualizado",
  "price": 550000,
  "stock": 12
}
```

**Response (200 OK):**
```json
{
  "ok": true,
  "statusCode": 200,
  "message": "Producto actualizado exitosamente",
  "data": {
    "id": 1,
    "name": "Producto Actualizado",
    ...
  },
  "count": 1
}
```

---

### 4.5 DELETE /api/v1/products/:id
Elimina un producto (Solo ADMIN).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "ok": true,
  "statusCode": 200,
  "message": "Producto eliminado exitosamente",
  "data": null,
  "count": 0
}
```

---

## 5. Servicio de Pedidos (Puerto 8083)

### 5.1 POST /api/v1/orders
Crea un nuevo pedido.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 600000
    }
  ],
  "total": 1200000,
  "userId": 1,
  "sellerId": 1
}
```

**Response (201 Created):**
```json
{
  "ok": true,
  "statusCode": 201,
  "message": "Pedido creado exitosamente",
  "data": {
    "id": 1,
    "items": [...],
    "total": 1200000,
    "status": "PENDING",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "count": 1
}
```

---

### 5.2 GET /api/v1/orders
Obtiene los pedidos del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "ok": true,
  "statusCode": 200,
  "message": "Pedidos obtenidos exitosamente",
  "data": [
    {
      "id": 1,
      "items": [...],
      "total": 1200000,
      "status": "PENDING",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 5
}
```

---

## 6. Servicio de Reseñas (Puerto 8084)

### 6.1 GET /api/v1/reviews/product/:productId
Obtiene las reseñas de un producto.

**Response (200 OK):**
```json
{
  "ok": true,
  "statusCode": 200,
  "message": "Reseñas obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "productId": 1,
      "userId": 1,
      "rating": 5,
      "comment": "Excelente producto",
      "date": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 10
}
```

---

### 6.2 POST /api/v1/reviews
Crea una nueva reseña.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request:**
```json
{
  "productId": 1,
  "rating": 5,
  "comment": "Excelente producto, muy recomendado"
}
```

**Response (201 Created):**
```json
{
  "ok": true,
  "statusCode": 201,
  "message": "Reseña creada exitosamente",
  "data": {
    "id": 1,
    "productId": 1,
    "userId": 1,
    "rating": 5,
    "comment": "Excelente producto, muy recomendado",
    "date": "2024-01-01T00:00:00Z"
  },
  "count": 1
}
```

---

## 7. Manejo de Errores

### 7.1 Códigos de Estado HTTP

| Código | Significado | Descripción |
|--------|-------------|-------------|
| 200 | OK | Solicitud exitosa |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Datos inválidos |
| 401 | Unauthorized | No autenticado o token inválido |
| 403 | Forbidden | No autorizado (falta de permisos) |
| 404 | Not Found | Recurso no encontrado |
| 500 | Internal Server Error | Error del servidor |

### 7.2 Formato de Error
```json
{
  "ok": false,
  "statusCode": 400,
  "message": "Email ya está registrado",
  "data": null,
  "count": 0
}
```

---

## 8. Ejemplos de Uso en Frontend

### 8.1 Login
```typescript
const response = await fetch(`${API_CONFIG.AUTH}/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const data = await response.json();
if (data.ok && data.data.token) {
  setAuthToken(data.data.token);
}
```

### 8.2 Obtener Productos
```typescript
const response = await fetch(API_CONFIG.PRODUCTS);
const data = await response.json();
const products = data.ok ? data.data : [];
```

### 8.3 Crear Pedido (Autenticado)
```typescript
const response = await fetch(`${API_CONFIG.ORDERS}`, {
  method: 'POST',
  headers: getAuthHeaders(),
  body: JSON.stringify(order)
});
```

---

## 9. Swagger UI

### 9.1 Acceso
Cada microservicio expone su documentación Swagger en:
- Autenticación: `http://localhost:8081/swagger-ui.html`
- Productos: `http://localhost:8082/swagger-ui.html`
- Pedidos: `http://localhost:8083/swagger-ui.html`
- Reseñas: `http://localhost:8084/swagger-ui.html`

### 9.2 Características
- Documentación interactiva
- Pruebas de endpoints desde el navegador
- Esquemas de datos
- Ejemplos de requests/responses

---

## 10. Seguridad

### 10.1 Autenticación JWT
- Tokens con expiración
- Validación en cada request protegido
- Almacenamiento seguro en localStorage

### 10.2 Headers Requeridos
```typescript
{
  'Content-Type': 'application/json',
  'Authorization': 'Bearer <token>'
}
```

---

**Fin de la Documentación de APIs**

