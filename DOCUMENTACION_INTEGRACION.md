# Documento de APIs e Integración
## PC OneStop - Comunicación Frontend-Backend

**Versión:** 1.0  
**Fecha:** 2024  
**Proyecto:** Evaluación Final Transversal - DSY1104

---

## 1. Introducción

### 1.1 Propósito
Este documento describe la integración entre el frontend (React) y el backend (Spring Boot) de PC OneStop, incluyendo la comunicación REST, manejo de datos y flujos de integración.

### 1.2 Arquitectura de Integración
```
Frontend (React) ←→ REST API ←→ Backend (Spring Boot)
     ↓                              ↓
  Actions                      Controllers
     ↓                              ↓
  API Config                  Services
     ↓                              ↓
  Fetch/HTTP                  Database
```

---

## 2. Configuración de Integración

### 2.1 Configuración de URLs
**Archivo:** `src/config/api.config.ts`

```typescript
export const API_CONFIG = {
  AUTH: 'http://localhost:8081/api/v1/auth',
  PRODUCTS: 'http://localhost:8082/api/v1/products',
  PRODUCTS_REPORTS: 'http://localhost:8082/api/products',
  REPORTS: 'http://localhost:8082/api/v1/reports',
  ORDERS: 'http://localhost:8083/api/v1/orders',
  REVIEWS: 'http://localhost:8084/api/v1/reviews',
} as const;
```

### 2.2 Formato de Respuesta Estándar
Todas las respuestas del backend siguen el formato:
```typescript
interface ApiResponse<T> {
  ok: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  count: number;
}
```

---

## 3. Operaciones CRUD (IE3.2.2)

### 3.1 CREATE - Crear Recursos

#### 3.1.1 Crear Usuario (Registro)
**Frontend:** `src/actions/register.actions.ts`
```typescript
const response = await fetch(`${API_CONFIG.AUTH}/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ firstName, lastName, email, password, role })
});
```

**Backend Endpoint:** `POST /api/v1/auth/register`

#### 3.1.2 Crear Producto (Admin)
**Frontend:** `src/actions/admin.actions.ts`
```typescript
const response = await fetch(`${API_CONFIG.PRODUCTS}`, {
  method: 'POST',
  headers: getAuthHeaders(),
  body: JSON.stringify(product)
});
```

**Backend Endpoint:** `POST /api/v1/products`

#### 3.1.3 Crear Pedido
**Frontend:** `src/actions/post-order.actions.ts`
```typescript
const response = await fetch(`${API_CONFIG.ORDERS}`, {
  method: 'POST',
  headers: getAuthHeaders(),
  body: JSON.stringify(order)
});
```

**Backend Endpoint:** `POST /api/v1/orders`

---

### 3.2 READ - Leer Recursos

#### 3.2.1 Obtener Todos los Productos
**Frontend:** `src/actions/get-product.actions.ts`
```typescript
const response = await fetch(API_CONFIG.PRODUCTS);
const data: ApiResponse<Product[]> = await response.json();
return data.ok && data.data ? data.data : [];
```

**Backend Endpoint:** `GET /api/v1/products`

#### 3.2.2 Obtener Producto por ID
**Frontend:** `src/actions/get-product-by-id.actions.ts`
```typescript
const response = await fetch(`${API_CONFIG.PRODUCTS}/${id}`);
const data: ApiResponse<Product> = await response.json();
return data.ok && data.data ? data.data : null;
```

**Backend Endpoint:** `GET /api/v1/products/:id`

#### 3.2.3 Obtener Reseñas de Producto
**Frontend:** `src/actions/reviews.actions.ts`
```typescript
const response = await fetch(`${API_CONFIG.REVIEWS}/product/${productId}`);
const data: ApiResponse<Review[]> = await response.json();
return data.ok && data.data ? data.data : [];
```

**Backend Endpoint:** `GET /api/v1/reviews/product/:productId`

---

### 3.3 UPDATE - Actualizar Recursos

#### 3.3.1 Actualizar Producto (Admin)
**Frontend:** `src/actions/admin.actions.ts`
```typescript
const response = await fetch(`${API_CONFIG.PRODUCTS}/${id}`, {
  method: 'PUT',
  headers: getAuthHeaders(),
  body: JSON.stringify(updatedProduct)
});
```

**Backend Endpoint:** `PUT /api/v1/products/:id`

---

### 3.4 DELETE - Eliminar Recursos

#### 3.4.1 Eliminar Producto (Admin)
**Frontend:** `src/actions/admin.actions.ts`
```typescript
const response = await fetch(`${API_CONFIG.PRODUCTS}/${id}`, {
  method: 'DELETE',
  headers: getAuthHeaders()
});
```

**Backend Endpoint:** `DELETE /api/v1/products/:id`

---

## 4. Autenticación y Autorización (IE3.3.2)

### 4.1 Flujo de Autenticación

#### 4.1.1 Login
```typescript
// 1. Frontend envía credenciales
const response = await fetch(`${API_CONFIG.AUTH}/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// 2. Backend valida y retorna token
const data = await response.json();
if (data.ok && data.data.token) {
  setAuthToken(data.data.token); // Guardar en localStorage
  setUser(data.data.user); // Actualizar estado
}
```

#### 4.1.2 Validación de Sesión
```typescript
// Al cargar la aplicación
const token = getAuthToken();
if (token) {
  const response = await fetch(`${API_CONFIG.AUTH}/validate`, {
    headers: getAuthHeaders()
  });
  // Restaurar usuario si token es válido
}
```

#### 4.1.3 Headers de Autenticación
```typescript
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
```

---

## 5. Manejo de Errores

### 5.1 Estrategia de Manejo

#### 5.1.1 Errores de Conexión
```typescript
try {
  const response = await fetch(url);
  if (!response.ok && response.status === 0) {
    return { error: "No se pudo conectar con el servidor" };
  }
} catch (error) {
  if (error.message?.includes('Failed to fetch')) {
    return { error: "Error de conexión" };
  }
}
```

#### 5.1.2 Errores del Backend
```typescript
const data: ApiResponse<T> = await response.json();
if (!data.ok) {
  return { error: data.message || "Error desconocido" };
}
```

### 5.2 Códigos de Estado HTTP

| Código | Manejo en Frontend |
|--------|-------------------|
| 200 | Éxito, procesar data |
| 201 | Éxito, recurso creado |
| 400 | Error de validación, mostrar mensaje |
| 401 | Token inválido, redirigir a login |
| 403 | Sin permisos, mostrar error |
| 404 | Recurso no encontrado |
| 500 | Error del servidor, mostrar mensaje genérico |

---

## 6. Transformación de Datos

### 6.1 Backend → Frontend

#### 6.1.1 Usuario
```typescript
// Backend retorna
{
  id: 1,
  firstName: "Juan",
  role: "CLIENTE"
}

// Frontend transforma
const frontendUser: User = {
  id: backendUser.id.toString(),
  firstName: backendUser.firstName,
  name: backendUser.firstName,
  role: backendUser.role === "CLIENTE" ? "CLIENT" : backendUser.role
};
```

#### 6.1.2 Producto
```typescript
// Backend y Frontend usan el mismo formato
// No se requiere transformación
```

### 6.2 Frontend → Backend

#### 6.2.1 Registro
```typescript
// Frontend envía
{
  firstName: name, // Frontend usa 'name', backend espera 'firstName'
  lastName,
  email,
  password,
  role: "CLIENT" // Frontend usa "CLIENT", backend espera "CLIENTE"
}

// Transformación
const backendRole = role === "CLIENT" ? "CLIENTE" : role;
```

---

## 7. Flujos de Integración Completos

### 7.1 Flujo de Compra

```
1. Usuario agrega productos al carrito (Frontend - Estado local)
   ↓
2. Usuario hace clic en "Checkout"
   ↓
3. Frontend valida autenticación
   ↓
4. Frontend envía pedido: POST /api/v1/orders
   ↓
5. Backend valida y crea pedido
   ↓
6. Backend retorna pedido creado
   ↓
7. Frontend muestra confirmación
   ↓
8. Frontend limpia carrito
```

### 7.2 Flujo de Autenticación

```
1. Usuario ingresa credenciales
   ↓
2. Frontend: POST /api/v1/auth/login
   ↓
3. Backend valida credenciales
   ↓
4. Backend genera JWT token
   ↓
5. Frontend guarda token en localStorage
   ↓
6. Frontend actualiza estado de usuario
   ↓
7. Frontend redirige según rol
```

### 7.3 Flujo de Restauración de Sesión

```
1. Usuario recarga página
   ↓
2. Frontend lee token de localStorage
   ↓
3. Frontend: GET /api/v1/auth/validate
   ↓
4. Backend valida token
   ↓
5. Backend retorna usuario
   ↓
6. Frontend restaura estado de usuario
   ↓
7. Usuario permanece autenticado
```

---

## 8. Endpoints Documentados en Swagger

### 8.1 Servicio de Autenticación
- `POST /api/v1/auth/register` - Registrar usuario
- `POST /api/v1/auth/login` - Iniciar sesión
- `GET /api/v1/auth/validate` - Validar token

### 8.2 Servicio de Productos
- `GET /api/v1/products` - Listar productos
- `GET /api/v1/products/:id` - Obtener producto
- `POST /api/v1/products` - Crear producto (Admin)
- `PUT /api/v1/products/:id` - Actualizar producto (Admin)
- `DELETE /api/v1/products/:id` - Eliminar producto (Admin)

### 8.3 Servicio de Pedidos
- `POST /api/v1/orders` - Crear pedido
- `GET /api/v1/orders` - Listar pedidos del usuario

### 8.4 Servicio de Reseñas
- `GET /api/v1/reviews/product/:productId` - Obtener reseñas
- `POST /api/v1/reviews` - Crear reseña

---

## 9. Validación y Seguridad

### 9.1 Validación en Frontend
- Validación de formularios antes de enviar
- Validación de tipos con TypeScript
- Validación de campos requeridos

### 9.2 Validación en Backend
- Validación de datos de entrada
- Validación de permisos (roles)
- Validación de tokens JWT

### 9.3 Seguridad
- Tokens JWT con expiración
- Headers de autenticación en requests protegidos
- Validación de sesión en cada carga
- Protección de rutas por roles

---

## 10. Testing de Integración

### 10.1 Pruebas de Endpoints
- Verificar que los endpoints respondan correctamente
- Validar formato de respuestas
- Probar manejo de errores

### 10.2 Pruebas de Flujos
- Flujo completo de compra
- Flujo de autenticación
- Flujo de restauración de sesión

---

## 11. Mejoras Futuras

### 11.1 Optimizaciones
- Implementar caché de productos
- Lazy loading de imágenes
- Paginación en listados

### 11.2 Funcionalidades
- WebSockets para actualizaciones en tiempo real
- Notificaciones push
- Sincronización offline

---

## 12. Conclusiones

### 12.1 Estado Actual
- ✅ Integración REST completa
- ✅ Operaciones CRUD implementadas
- ✅ Autenticación JWT funcional
- ✅ Manejo de errores robusto
- ✅ Documentación Swagger disponible

### 12.2 Cumplimiento de Requisitos
- ✅ IE3.2.2: Integración REST con operaciones CRUD
- ✅ IE3.3.2: Autenticación y autorización segura
- ✅ Documentación de APIs completa
- ✅ Endpoints disponibles en Swagger

---

**Fin del Documento de APIs e Integración**

