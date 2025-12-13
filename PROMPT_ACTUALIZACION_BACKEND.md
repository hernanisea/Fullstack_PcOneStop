# Prompt para Actualización de Microservicios Backend
## PC OneStop - Implementaciones Frontend Requeridas

**Fecha:** 2024  
**Proyecto:** DSY1104 - Evaluación Final Transversal

---

## Contexto

El frontend de PC OneStop ha sido actualizado con nuevas funcionalidades según los requisitos de la Evaluación Final Transversal. Este documento describe las implementaciones necesarias en los microservicios backend para soportar estas funcionalidades.

---

## 1. Servicio de Autenticación (Puerto 8081)

### 1.1 Nuevo Endpoint: Validación de Sesión

**Requisito:** Implementar endpoint para validar tokens JWT y restaurar sesión del usuario.

**Endpoint:** `GET /api/v1/auth/validate`

**Headers Requeridos:**
```
Authorization: Bearer <token>
```

**Funcionalidad:**
- Validar que el token JWT sea válido y no haya expirado
- Extraer información del usuario desde el token
- Retornar datos del usuario si el token es válido

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
    "role": "CLIENTE",
    "phone": "123456789"
  },
  "count": 1
}
```

**Response (401 Unauthorized):**
```json
{
  "ok": false,
  "statusCode": 401,
  "message": "Token inválido o expirado",
  "data": null,
  "count": 0
}
```

**Response (403 Forbidden):**
```json
{
  "ok": false,
  "statusCode": 403,
  "message": "Token no proporcionado",
  "data": null,
  "count": 0
}
```

**Notas de Implementación:**
- Este endpoint debe validar el token JWT sin requerir credenciales adicionales
- Debe verificar la expiración del token
- Debe retornar los datos del usuario asociado al token
- Si el token es inválido, debe retornar 401
- Si no se proporciona token, debe retornar 403

---

## 2. Servicio de Productos (Puerto 8082)

### 2.1 Validación de Stock en Operaciones

**Requisito:** Implementar validación de stock en todas las operaciones que afecten el inventario.

#### 2.1.1 GET /api/v1/products/:id
**Mejora Requerida:**
- Asegurar que el campo `stock` siempre esté presente en la respuesta
- El stock debe ser un número entero >= 0

**Response Actual:**
```json
{
  "ok": true,
  "statusCode": 200,
  "data": {
    "id": 1,
    "name": "Producto",
    "stock": 15,  // ← Debe estar presente siempre
    ...
  }
}
```

#### 2.1.2 POST /api/v1/products (Crear Producto)
**Validación Requerida:**
- Validar que `stock` sea un número entero >= 0
- Si no se proporciona, establecer en 0 por defecto

**Request:**
```json
{
  "name": "Nuevo Producto",
  "brand": "Marca",
  "category": "Procesador (CPU)",
  "price": 500000,
  "stock": 10,  // ← Validar que sea >= 0
  ...
}
```

#### 2.1.3 PUT /api/v1/products/:id (Actualizar Producto)
**Validación Requerida:**
- Validar que `stock` sea un número entero >= 0 si se proporciona
- Permitir actualizar el stock independientemente de otros campos

**Request:**
```json
{
  "id": 1,
  "stock": 20,  // ← Validar que sea >= 0
  ...
}
```

**Response de Error (400 Bad Request):**
```json
{
  "ok": false,
  "statusCode": 400,
  "message": "El stock no puede ser negativo",
  "data": null,
  "count": 0
}
```

### 2.2 Obtener Todos los Productos (PC Builder) - CORREGIDO

**Requisito:** El endpoint `GET /api/v1/products` ahora debe estar disponible para cualquier usuario autenticado (no solo ADMIN).

**Cambio Importante:** 
- **ANTES:** Solo ADMIN podía ver todos los productos
- **AHORA:** Cualquier usuario autenticado puede ver todos los productos

**Endpoint:** `GET /api/v1/products`

**Headers Requeridos:**
```
Authorization: Bearer <token>
```

**Funcionalidad:**
- Retornar todos los productos disponibles
- Requerir autenticación (token JWT válido)
- Permitir acceso a cualquier rol autenticado (CLIENTE, ADMIN, etc.)

**Response (200 OK):**
```json
{
  "ok": true,
  "statusCode": 200,
  "message": "Productos obtenidos",
  "data": [
    {
      "id": 1,
      "name": "GeForce RTX 4070",
      "brand": "MSI",
      "model": "Ventus 3X",
      "category": "GPU",
      "price": 899990.00,
      "stock": 10,
      "description": "Tarjeta gráfica de alto rendimiento",
      "image": "url_de_imagen"
    },
    {
      "id": 2,
      "name": "AMD Ryzen 7 7800X3D",
      "brand": "AMD",
      "model": "Ryzen 7 7800X3D",
      "category": "CPU",
      "price": 599990.00,
      "stock": 5,
      "description": "Procesador de alto rendimiento",
      "image": "url_de_imagen"
    }
  ],
  "count": 40
}
```

**Response (401 Unauthorized):**
```json
{
  "ok": false,
  "statusCode": 401,
  "message": "Token inválido o expirado",
  "data": null,
  "count": 0
}
```

**Response (403 Forbidden):**
```json
{
  "ok": false,
  "statusCode": 403,
  "message": "Token no proporcionado",
  "data": null,
  "count": 0
}
```

**Notas de Implementación:**
- Este endpoint debe requerir autenticación (token JWT)
- Cualquier usuario autenticado puede acceder (no solo ADMIN)
- Debe retornar todos los productos disponibles
- El campo `stock` debe estar siempre presente

---

### 2.3 Actualizar Productos (Admin) - NUEVO

**Requisito:** Implementar endpoint para actualizar productos existentes, incluyendo la capacidad de poner/quitar productos en oferta.

**Endpoint:** `PUT /api/v1/products/{id}`

**Headers Requeridos:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Permisos:** Solo ADMIN

**Request Body:**
```json
{
  "name": "GeForce RTX 4070",
  "brand": "MSI",
  "model": "Ventus 3X",
  "category": "GPU",
  "price": 899990.00,
  "stock": 10,
  "description": "Tarjeta gráfica de alto rendimiento",
  "image": "url_de_imagen",
  "isOnSale": true,
  "discount": 20,
  "offerStartDate": "2024-01-01",
  "offerEndDate": "2024-12-31"
}
```

**Campos Opcionales:**
- `description`: Descripción del producto
- `image`: URL de la imagen
- `isOnSale`: Boolean - Si el producto está en oferta
- `discount`: Número - Porcentaje de descuento (0-100)
- `offerStartDate`: String - Fecha de inicio de oferta (formato ISO 8601)
- `offerEndDate`: String - Fecha de fin de oferta (formato ISO 8601)

**Response (200 OK):**
```json
{
  "ok": true,
  "statusCode": 200,
  "message": "Producto actualizado exitosamente",
  "data": {
    "id": 1,
    "name": "GeForce RTX 4070",
    "brand": "MSI",
    "model": "Ventus 3X",
    "category": "GPU",
    "price": 899990.00,
    "stock": 10,
    "description": "Tarjeta gráfica de alto rendimiento",
    "image": "url_de_imagen",
    "isOnSale": true,
    "discount": 20,
    "offerStartDate": "2024-01-01",
    "offerEndDate": "2024-12-31"
  },
  "count": 1
}
```

**Response (400 Bad Request):**
```json
{
  "ok": false,
  "statusCode": 400,
  "message": "Error de validación",
  "data": {
    "errors": [
      {
        "field": "price",
        "message": "El precio debe ser mayor a 0"
      },
      {
        "field": "stock",
        "message": "El stock no puede ser negativo"
      }
    ]
  },
  "count": 0
}
```

**Response (401 Unauthorized):**
```json
{
  "ok": false,
  "statusCode": 401,
  "message": "Token inválido o expirado",
  "data": null,
  "count": 0
}
```

**Response (403 Forbidden):**
```json
{
  "ok": false,
  "statusCode": 403,
  "message": "No tienes permisos para realizar esta acción",
  "data": null,
  "count": 0
}
```

**Response (404 Not Found):**
```json
{
  "ok": false,
  "statusCode": 404,
  "message": "Producto no encontrado con ID: 1",
  "data": null,
  "count": 0
}
```

**Validaciones Requeridas:**
- `name`: Obligatorio, no vacío
- `brand`: Obligatorio, no vacío
- `model`: Obligatorio, no vacío
- `category`: Obligatorio, no vacío
- `price`: Obligatorio, debe ser > 0
- `stock`: Obligatorio, debe ser >= 0
- `discount`: Si `isOnSale` es true, debe estar entre 0 y 100
- `offerStartDate`: Si se proporciona, debe ser una fecha válida
- `offerEndDate`: Si se proporciona, debe ser una fecha válida y posterior a `offerStartDate`

**Ejemplo de Uso - Poner Producto en Oferta:**
```json
{
  "isOnSale": true,
  "discount": 20,
  "offerStartDate": "2024-01-01",
  "offerEndDate": "2024-12-31"
}
```

**Ejemplo de Uso - Quitar Producto de Oferta:**
```json
{
  "isOnSale": false,
  "discount": 0
}
```

**Notas de Implementación:**
- Solo usuarios con rol ADMIN pueden actualizar productos
- El ID del producto se obtiene de la URL (`/api/v1/products/{id}`)
- Si el producto no existe, retornar 404
- Si el usuario no es ADMIN, retornar 403
- Validar todos los campos antes de actualizar
- Si `isOnSale` es false, se puede ignorar `discount`, `offerStartDate` y `offerEndDate`

---

## 3. Servicio de Pedidos (Puerto 8083)

### 3.1 Validación de Stock al Crear Pedido

**Requisito:** Validar stock disponible antes de crear un pedido.

**Endpoint:** `POST /api/v1/orders`

**Validaciones Requeridas:**

1. **Validar existencia de productos:**
   - Verificar que todos los productos en el pedido existan
   - Si algún producto no existe, retornar error 404

2. **Validar stock disponible:**
   - Para cada producto, verificar que haya stock suficiente
   - Comparar cantidad solicitada vs stock disponible
   - Si algún producto no tiene stock suficiente, retornar error 400 con detalles

3. **Reducir stock al crear pedido:**
   - Después de validar, reducir el stock de cada producto
   - Esto debe ser una operación atómica (transacción)
   - Si falla la creación del pedido, revertir la reducción de stock

**Request:**
```json
{
  "userId": 1,
  "totalAmount": 1200000,
  "productIds": "1,2,3",  // IDs separados por coma
  "sellerId": 1,
  "status": "PENDIENTE"
}
```

**Nota:** El frontend envía `productIds` como string separado por comas. El backend debe:
1. Parsear los IDs
2. Obtener las cantidades desde el servicio de productos o desde el request
3. Validar stock para cada producto

**Response de Error - Stock Insuficiente (400 Bad Request):**
```json
{
  "ok": false,
  "statusCode": 400,
  "message": "Stock insuficiente para uno o más productos",
  "data": {
    "errors": [
      {
        "productId": 1,
        "productName": "Producto A",
        "requested": 5,
        "available": 3,
        "message": "Solo hay 3 unidades disponibles (solicitaste 5)"
      },
      {
        "productId": 2,
        "productName": "Producto B",
        "requested": 2,
        "available": 0,
        "message": "Producto agotado"
      }
    ]
  },
  "count": 0
}
```

**Response de Error - Producto No Encontrado (404 Not Found):**
```json
{
  "ok": false,
  "statusCode": 404,
  "message": "Uno o más productos no fueron encontrados",
  "data": {
    "missingProducts": [5, 6]
  },
  "count": 0
}
```

**Response de Éxito (201 Created):**
```json
{
  "ok": true,
  "statusCode": 201,
  "message": "Pedido creado exitosamente",
  "data": {
    "id": 1,
    "userId": 1,
    "totalAmount": 1200000,
    "status": "PENDIENTE",
    "productIds": "1,2,3",
    "sellerId": 1,
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "count": 1
}
```

### 3.2 Mejora Sugerida: Estructura de Request

**Problema Actual:** El frontend envía `productIds` como string, lo que dificulta validar cantidades.

**Solución Sugerida:** Modificar el request para incluir items con cantidades.

**Request Mejorado:**
```json
{
  "userId": 1,
  "totalAmount": 1200000,
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 600000
    },
    {
      "productId": 2,
      "quantity": 1,
      "price": 600000
    }
  ],
  "sellerId": 1,
  "status": "PENDIENTE"
}
```

**Nota:** Si se implementa esta mejora, el frontend también debe actualizarse. Por ahora, el backend debe trabajar con el formato actual (`productIds` como string) pero puede prepararse para aceptar ambos formatos.

---

## 4. Manejo de Errores Mejorado

### 4.1 Formato de Respuesta Consistente

**Requisito:** Todos los endpoints deben retornar el mismo formato de respuesta.

**Formato Estándar:**
```json
{
  "ok": boolean,
  "statusCode": number,
  "message": string,
  "data": T | null,
  "count": number
}
```

### 4.2 Códigos de Estado HTTP

**Requisito:** Usar códigos de estado HTTP apropiados:

- `200 OK`: Operación exitosa (GET, PUT)
- `201 Created`: Recurso creado exitosamente (POST)
- `400 Bad Request`: Datos inválidos o validación fallida
- `401 Unauthorized`: No autenticado o token inválido
- `403 Forbidden`: No autorizado (falta de permisos)
- `404 Not Found`: Recurso no encontrado
- `500 Internal Server Error`: Error del servidor

### 4.3 Mensajes de Error Claros

**Requisito:** Los mensajes de error deben ser:
- Específicos y descriptivos
- En español (o según el idioma del proyecto)
- Incluir detalles cuando sea apropiado (ej: qué campo falló, qué valor es inválido)

**Ejemplo de Error de Validación:**
```json
{
  "ok": false,
  "statusCode": 400,
  "message": "Error de validación",
  "data": {
    "errors": [
      {
        "field": "email",
        "message": "El email es obligatorio"
      },
      {
        "field": "stock",
        "message": "El stock no puede ser negativo"
      }
    ]
  },
  "count": 0
}
```

---

## 5. Documentación Swagger

### 5.1 Actualización Requerida

**Requisito:** Actualizar la documentación Swagger para incluir:

1. **Nuevo endpoint de validación:**
   - `GET /api/v1/auth/validate`
   - Documentar headers requeridos
   - Documentar respuestas posibles

2. **Validaciones de stock:**
   - Documentar validaciones en endpoints de productos
   - Documentar validaciones en creación de pedidos
   - Incluir ejemplos de errores de stock

3. **Ejemplos de requests/responses:**
   - Incluir ejemplos de éxito
   - Incluir ejemplos de errores comunes
   - Documentar códigos de estado posibles

### 5.2 Acceso a Swagger

**Requisito:** Asegurar que Swagger UI esté disponible en:
- Autenticación: `http://localhost:8081/swagger-ui.html`
- Productos: `http://localhost:8082/swagger-ui.html`
- Pedidos: `http://localhost:8083/swagger-ui.html`
- Reseñas: `http://localhost:8084/swagger-ui.html`

---

## 6. Resumen de Implementaciones Requeridas

### Prioridad Alta (Crítico)

1. ✅ **Endpoint de validación de sesión** (`GET /api/v1/auth/validate`)
   - Servicio: Autenticación (8081)
   - Impacto: Permite restaurar sesión del usuario

2. ✅ **Obtener todos los productos con autenticación** (`GET /api/v1/products`)
   - Servicio: Productos (8082)
   - Impacto: Permite que cualquier usuario autenticado vea todos los productos (PC Builder)
   - **CORRECCIÓN:** Cambiar permisos de solo ADMIN a cualquier usuario autenticado

3. ✅ **Validación de stock al crear pedidos**
   - Servicio: Pedidos (8083)
   - Impacto: Previene ventas de productos sin stock

4. ✅ **Validación de stock en operaciones de productos**
   - Servicio: Productos (8082)
   - Impacto: Asegura integridad del inventario

5. ✅ **Actualizar productos (Admin)** (`PUT /api/v1/products/{id}`)
   - Servicio: Productos (8082)
   - Impacto: Permite a los administradores actualizar productos y gestionar ofertas

### Prioridad Media

4. ⚠️ **Mejora de estructura de request en pedidos**
   - Servicio: Pedidos (8083)
   - Impacto: Facilita validación de cantidades

5. ⚠️ **Mensajes de error más descriptivos**
   - Todos los servicios
   - Impacto: Mejor experiencia de usuario

### Prioridad Baja

6. ℹ️ **Actualización de documentación Swagger**
   - Todos los servicios
   - Impacto: Facilita desarrollo e integración

---

## 7. Casos de Prueba Sugeridos

### 7.1 Validación de Sesión

```java
// Test: Validar token válido
@Test
void testValidateValidToken() {
    // Crear token válido
    // Llamar endpoint /validate
    // Verificar respuesta 200 con datos de usuario
}

// Test: Validar token expirado
@Test
void testValidateExpiredToken() {
    // Crear token expirado
    // Llamar endpoint /validate
    // Verificar respuesta 401
}

// Test: Validar sin token
@Test
void testValidateWithoutToken() {
    // Llamar endpoint /validate sin header Authorization
    // Verificar respuesta 403
}
```

### 7.2 Validación de Stock en Pedidos

```java
// Test: Crear pedido con stock suficiente
@Test
void testCreateOrderWithSufficientStock() {
    // Crear productos con stock
    // Crear pedido
    // Verificar que se reduzca el stock
}

// Test: Crear pedido sin stock suficiente
@Test
void testCreateOrderWithInsufficientStock() {
    // Crear productos con stock limitado
    // Intentar crear pedido con cantidad mayor
    // Verificar error 400 con detalles
}

// Test: Crear pedido con producto agotado
@Test
void testCreateOrderWithOutOfStockProduct() {
    // Crear producto con stock 0
    // Intentar crear pedido
    // Verificar error 400
}
```

---

## 8. Notas de Implementación

### 8.1 Transacciones

**Importante:** La creación de pedidos debe ser una operación transaccional:
- Si falla la validación de stock, no crear el pedido
- Si falla la creación del pedido, revertir la reducción de stock
- Usar `@Transactional` en Spring Boot para garantizar atomicidad

### 8.2 Comunicación entre Microservicios

**Consideración:** El servicio de Pedidos necesita consultar el stock de productos:
- Opción 1: Llamar al servicio de Productos vía HTTP
- Opción 2: Compartir base de datos (no recomendado en microservicios)
- Opción 3: Usar eventos/mensajería (más complejo)

**Recomendación:** Para este proyecto, usar llamadas HTTP directas es aceptable.

### 8.3 Manejo de Concurrencia

**Consideración:** Múltiples usuarios pueden intentar comprar el mismo producto simultáneamente:
- Implementar locks o versionado optimista
- Usar `@Version` en JPA para control de concurrencia
- O usar bloqueos de base de datos

---

## 9. Checklist de Implementación

### Servicio de Autenticación (8081)
- [ ] Implementar `GET /api/v1/auth/validate`
- [ ] Validar token JWT
- [ ] Retornar datos del usuario
- [ ] Manejar errores (401, 403)
- [ ] Actualizar Swagger

### Servicio de Productos (8082)
- [ ] Validar stock >= 0 en POST
- [ ] Validar stock >= 0 en PUT
- [ ] Asegurar que stock esté siempre presente en GET
- [ ] **CORRECCIÓN:** Cambiar permisos de `GET /api/v1/products` de solo ADMIN a cualquier usuario autenticado
- [ ] Implementar `PUT /api/v1/products/{id}` para actualizar productos (solo ADMIN)
- [ ] Validar campos al actualizar productos
- [ ] Permitir poner/quitar productos en oferta
- [ ] Actualizar Swagger con validaciones

### Servicio de Pedidos (8083)
- [ ] Validar existencia de productos
- [ ] Validar stock disponible antes de crear pedido
- [ ] Reducir stock al crear pedido (transaccional)
- [ ] Retornar errores descriptivos
- [ ] Actualizar Swagger

### Todos los Servicios
- [ ] Verificar formato de respuesta consistente
- [ ] Verificar códigos de estado HTTP apropiados
- [ ] Verificar mensajes de error claros
- [ ] Actualizar documentación Swagger

---

## 10. Contacto y Soporte

Si hay dudas sobre la implementación, consultar:
- Documentación del frontend: `DOCUMENTACION_APIS.md`
- Documentación de integración: `DOCUMENTACION_INTEGRACION.md`
- Código del frontend en: `src/actions/` y `src/config/api.config.ts`

---

---

## 11. Resumen de Modificaciones para el Frontend

Este documento también sirve como referencia para el frontend. Las siguientes son las modificaciones principales que el frontend debe implementar:

### 1. ✅ Validación de Sesión (NUEVO)

**Endpoint:** `GET /api/v1/auth/validate`

**Implementación Frontend:**
- Crear función que valide el token al cargar la aplicación
- Restaurar sesión automáticamente si el token es válido
- Redirigir a login si el token expirado

### 2. ✅ Obtener Todos los Productos (PC Builder) - CORREGIDO

**Endpoint:** `GET /api/v1/products`

**Cambio Importante:** Ahora cualquier usuario autenticado puede ver todos los productos (antes solo ADMIN).

**Implementación Frontend:**
- Crear función `getAllProducts()` con token JWT
- Usar en el PC Builder para mostrar todos los componentes
- Implementar filtros por categoría

### 3. ✅ Validación de Stock

**Implementación Frontend:**
- Verificar campo `stock` en respuestas de productos
- Mostrar badge "Agotado" cuando `stock === 0`
- Deshabilitar botón de compra cuando `stock === 0`
- Manejar errores del backend cuando se intenta comprar producto agotado

### 4. ✅ Pedidos con Cantidades (NUEVO)

**Endpoint:** `POST /api/v1/orders`

**Cambio Importante:** Ahora se debe enviar `items` con `quantity` en lugar de solo `productIds`.

**Formato Nuevo (RECOMENDADO):**
```json
{
  "totalAmount": 2599980.00,
  "items": [
    {"productId": 1, "quantity": 2},
    {"productId": 5, "quantity": 3}
  ]
}
```

### 5. ✅ Actualizar Productos (Admin) - NUEVO

**Endpoint:** `PUT /api/v1/products/{id}`

**Implementación Frontend:**
- Crear función `updateProduct()` para actualizar productos
- Implementar formulario de edición
- Permitir poner/quitar productos en oferta

**Ejemplo de Código:**
```javascript
export async function updateProduct(productId, productData) {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:8082/api/v1/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData)
  });
  const result = await response.json();
  return result.data;
}

// Poner producto en oferta
const productData = {
  isOnSale: true,
  discount: 20,
  offerStartDate: "2024-01-01",
  offerEndDate: "2024-12-31"
};
await updateProduct(productId, productData);
```

### Checklist Rápido para Frontend

- [ ] Validar sesión al cargar la app (`GET /api/v1/auth/validate`)
- [ ] Obtener todos los productos para PC Builder (`GET /api/v1/products` con token)
- [ ] Mostrar estado de stock (agotado/disponible)
- [ ] Deshabilitar botones cuando `stock === 0`
- [ ] Implementar selector de cantidad en carrito
- [ ] Enviar pedidos con formato `items` y `quantity`
- [ ] Manejar errores de stock insuficiente
- [ ] Implementar actualización de productos (`PUT /api/v1/products/{id}`)
- [ ] Permitir poner/quitar productos en oferta
- [ ] Manejar error 401 (token expirado) → Redirigir a login
- [ ] Manejar error 403 (sin permisos)
- [ ] Mostrar mensajes claros al usuario

---

**Fin del Prompt de Actualización**

