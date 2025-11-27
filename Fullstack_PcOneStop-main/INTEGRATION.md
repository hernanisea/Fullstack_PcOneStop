# Integración Frontend-Backend

Este documento describe la integración del frontend React con los microservicios Spring Boot.

## Configuración

### Microservicios Backend

El proyecto se conecta a 4 microservicios que deben estar ejecutándose:

1. **Usuarios** - Puerto `8081`
   - Base URL: `http://localhost:8081/api/v1/auth`
   - Endpoints: login, register, gestión de usuarios

2. **Inventario** - Puerto `8082`
   - Base URL: `http://localhost:8082/api/v1/products`
   - Endpoints: CRUD de productos, ofertas, categorías

3. **Pagos** - Puerto `8083`
   - Base URL: `http://localhost:8083/api/v1/orders`
   - Endpoints: creación y gestión de pedidos

4. **Calificaciones** - Puerto `8084`
   - Base URL: `http://localhost:8084/api/v1/reviews`
   - Endpoints: gestión de reseñas y calificaciones

### Configuración de URLs

Las URLs están configuradas en `src/config/api.config.ts`. Para cambiar los puertos o hosts, modifica este archivo.

## Estructura de Respuesta del Backend

Todos los microservicios devuelven respuestas en el formato `ApiResponse<T>`:

```typescript
interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T | null;
  count: number;
}
```

El cliente HTTP (`src/services/api.client.ts`) maneja automáticamente esta estructura.

## Archivos Modificados

### Nuevos Archivos

- `src/config/api.config.ts` - Configuración de URLs de los microservicios
- `src/services/api.client.ts` - Cliente HTTP reutilizable

### Archivos Actualizados

- `src/actions/auth.actions.ts` - Ahora usa el backend de Usuarios
- `src/actions/register.actions.ts` - Ahora usa el backend de Usuarios
- `src/actions/get-product.actions.ts` - Ahora usa el backend de Inventario
- `src/actions/get-product-by-id.actions.ts` - Ahora usa el backend de Inventario
- `src/actions/post-order.actions.ts` - Ahora usa el backend de Pagos
- `src/actions/admin.actions.ts` - Ahora usa todos los backends correspondientes

## Uso

### Iniciar los Microservicios

Antes de ejecutar el frontend, asegúrate de que todos los microservicios estén ejecutándose:

```bash
# En cada directorio de microservicio
cd microservicios/Usuarios
mvn spring-boot:run

cd ../Inventario
mvn spring-boot:run

cd ../Pagos
mvn spring-boot:run

cd ../Calificaciones
mvn spring-boot:run
```

### Ejecutar el Frontend

```bash
npm run dev
```

## Manejo de Errores

El cliente HTTP maneja automáticamente:
- Errores de conexión (servidor no disponible)
- Errores HTTP (4xx, 5xx)
- Respuestas del backend con `success: false`

Las acciones devuelven objetos con `error` cuando algo falla, permitiendo que la UI maneje los errores de forma elegante.

## Notas Importantes

1. **CORS**: Los microservicios tienen `@CrossOrigin(origins = "*")` configurado, por lo que no debería haber problemas de CORS.

2. **Base de Datos**: Asegúrate de que MySQL esté ejecutándose y que las bases de datos estén creadas. Los microservicios las crean automáticamente si `createDatabaseIfNotExist=true` está configurado.

3. **Datos Mock**: El archivo `src/data/db.js` ya no se usa para las operaciones principales, pero puede mantenerse como referencia o para desarrollo offline.

## Troubleshooting

### Error: "No se pudo conectar con el servidor"

- Verifica que los microservicios estén ejecutándose
- Verifica que los puertos sean correctos en `api.config.ts`
- Verifica que no haya firewalls bloqueando las conexiones

### Error: "El email ingresado no existe" o "Contraseña incorrecta"

- Estos son errores esperados del backend cuando las credenciales son incorrectas
- Verifica que los usuarios existan en la base de datos del microservicio de Usuarios

### Error: CORS

- Aunque los microservicios tienen CORS habilitado, si encuentras problemas, verifica la configuración en cada microservicio

