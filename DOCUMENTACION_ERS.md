# Especificación de Requisitos de Software (ERS)
## PC OneStop - Tienda Online de Componentes de PC

**Versión:** 1.0  
**Fecha:** 2024  
**Proyecto:** Evaluación Final Transversal - DSY1104

---

## 1. Introducción

### 1.1 Propósito del Documento
Este documento especifica los requisitos funcionales y no funcionales del sistema PC OneStop, una tienda online especializada en la venta de componentes de PC y armado personalizado de computadoras.

### 1.2 Alcance del Proyecto
PC OneStop es una aplicación web fullstack que permite a los usuarios:
- Explorar y comprar componentes de PC
- Armar configuraciones personalizadas de PC
- Gestionar carrito de compras y realizar pedidos
- Administrar productos, usuarios y pedidos (rol ADMIN)

### 1.3 Definiciones y Acrónimos
- **JWT**: JSON Web Token - Token de autenticación
- **REST**: Representational State Transfer - Arquitectura de API
- **CRUD**: Create, Read, Update, Delete - Operaciones básicas
- **SPA**: Single Page Application - Aplicación de una sola página

---

## 2. Descripción General

### 2.1 Perspectiva del Producto
PC OneStop es una aplicación web independiente que se comunica con múltiples microservicios backend para gestionar:
- Autenticación y autorización de usuarios
- Catálogo de productos
- Gestión de pedidos
- Sistema de reseñas

### 2.2 Funciones del Producto
- **Gestión de Usuarios**: Registro, login, autenticación con JWT
- **Catálogo de Productos**: Visualización, búsqueda, filtrado
- **Carrito de Compras**: Agregar, modificar, eliminar productos
- **PC Builder**: Herramienta para armar configuraciones personalizadas
- **Panel de Administración**: Gestión de productos, usuarios, pedidos y reportes
- **Sistema de Reseñas**: Los usuarios pueden calificar productos

### 2.3 Características del Usuario
- **Cliente (CLIENT)**: Puede comprar productos, armar PCs, dejar reseñas
- **Administrador (ADMIN)**: Acceso completo al panel de administración

---

## 3. Requisitos Funcionales

### 3.1 Autenticación y Autorización (IE3.3.2)

#### RF-001: Registro de Usuario
- **Descripción**: Los usuarios pueden registrarse con nombre, apellido, email y contraseña
- **Prioridad**: Alta
- **Validaciones**:
  - Email debe ser único
  - Contraseña mínimo 3 caracteres
  - Todos los campos son obligatorios

#### RF-002: Inicio de Sesión
- **Descripción**: Los usuarios pueden iniciar sesión con email y contraseña
- **Prioridad**: Alta
- **Validaciones**:
  - Email y contraseña obligatorios
  - Credenciales deben ser válidas

#### RF-003: Persistencia de Sesión
- **Descripción**: La sesión del usuario se mantiene activa después de recargar la página
- **Prioridad**: Alta
- **Implementación**: Token JWT almacenado en localStorage, validado al cargar la aplicación

#### RF-004: Control de Acceso por Roles
- **Descripción**: Restricción de acceso según rol (ADMIN/CLIENT)
- **Prioridad**: Alta
- **Rutas protegidas**:
  - `/admin/*` - Solo ADMIN
  - `/checkout` - Solo usuarios autenticados

### 3.2 Gestión de Productos (IE3.1.2, IE3.2.2)

#### RF-005: Visualización de Productos
- **Descripción**: Los usuarios pueden ver el catálogo completo de productos
- **Prioridad**: Alta
- **Funcionalidades**:
  - Listado paginado
  - Filtrado por categoría
  - Búsqueda por nombre/marca

#### RF-006: Detalle de Producto
- **Descripción**: Visualización detallada de un producto específico
- **Prioridad**: Alta
- **Información mostrada**:
  - Nombre, marca, categoría
  - Precio, stock disponible
  - Descripción completa
  - Imagen del producto
  - Reseñas de usuarios

#### RF-007: Gestión de Productos (Admin)
- **Descripción**: Los administradores pueden crear, editar y eliminar productos
- **Prioridad**: Media
- **Operaciones CRUD**:
  - Crear nuevo producto
  - Editar producto existente
  - Eliminar producto
  - Ver lista de productos

### 3.3 Carrito de Compras

#### RF-008: Agregar al Carrito
- **Descripción**: Los usuarios pueden agregar productos al carrito
- **Prioridad**: Alta
- **Validaciones**:
  - Stock disponible
  - Cantidad válida

#### RF-009: Modificar Carrito
- **Descripción**: Los usuarios pueden modificar cantidades o eliminar productos
- **Prioridad**: Alta

#### RF-010: Visualizar Carrito
- **Descripción**: Los usuarios pueden ver el contenido del carrito con totales
- **Prioridad**: Alta

### 3.4 Proceso de Compra

#### RF-011: Checkout
- **Descripción**: Los usuarios pueden finalizar la compra
- **Prioridad**: Alta
- **Validaciones**:
  - Usuario autenticado
  - Carrito no vacío
  - Stock disponible

#### RF-012: Confirmación de Pedido
- **Descripción**: Los usuarios reciben confirmación del pedido
- **Prioridad**: Alta

### 3.5 PC Builder

#### RF-013: Armar PC Personalizado
- **Descripción**: Los usuarios pueden seleccionar componentes para armar un PC
- **Prioridad**: Media
- **Funcionalidades**:
  - Selección por categoría (CPU, GPU, RAM, etc.)
  - Validación de compatibilidad
  - Agregar al carrito

### 3.6 Panel de Administración

#### RF-014: Dashboard de Admin
- **Descripción**: Vista general de estadísticas y métricas
- **Prioridad**: Media

#### RF-015: Gestión de Usuarios
- **Descripción**: Los administradores pueden ver y gestionar usuarios
- **Prioridad**: Baja

#### RF-016: Gestión de Pedidos
- **Descripción**: Los administradores pueden ver y gestionar pedidos
- **Prioridad**: Media

#### RF-017: Reportes
- **Descripción**: Los administradores pueden generar reportes de ventas
- **Prioridad**: Baja

---

## 4. Requisitos No Funcionales

### 4.1 Rendimiento
- Tiempo de carga inicial < 3 segundos
- Respuesta de API < 1 segundo

### 4.2 Seguridad (IE3.3.2)
- Autenticación mediante JWT
- Tokens con expiración
- Validación de sesión en cada carga
- Protección de rutas por roles

### 4.3 Usabilidad
- Interfaz responsiva (Bootstrap)
- Diseño intuitivo y moderno
- Mensajes de error claros y contextuales
- Validación de formularios en tiempo real

### 4.4 Compatibilidad
- Navegadores modernos (Chrome, Firefox, Edge, Safari)
- Diseño responsivo para móviles, tablets y desktop

### 4.5 Mantenibilidad
- Código modular y bien estructurado
- Uso de TypeScript para type safety
- Separación de concerns (actions, components, helpers)

---

## 5. Requisitos Técnicos

### 5.1 Frontend
- **Framework**: React 18.3.1
- **Lenguaje**: TypeScript
- **Estilos**: Bootstrap 5.3.3
- **Routing**: React Router DOM 6.30.2
- **Testing**: Vitest 2.0.5

### 5.2 Backend (Requisitos)
- **Framework**: Spring Boot
- **Base de Datos**: Relacional (MySQL/PostgreSQL)
- **API**: REST con documentación Swagger
- **Autenticación**: JWT

### 5.3 Integración
- Comunicación frontend-backend mediante REST API
- Endpoints documentados en Swagger
- Manejo de errores consistente

---

## 6. Validación de Formularios (IE1.3.1)

### 6.1 Formulario de Login
- Email: Obligatorio, formato válido
- Contraseña: Obligatoria
- Mensajes de error claros y contextuales
- Atributos HTML5: `required`, `type="email"`, `autoComplete`

### 6.2 Formulario de Registro
- Nombre: Obligatorio
- Apellido: Obligatorio
- Email: Obligatorio, formato válido, único
- Contraseña: Obligatoria, mínimo 3 caracteres
- Confirmar Contraseña: Obligatoria, debe coincidir
- Atributos HTML5: `required`, `autoComplete`, `minLength`

---

## 7. Testing (IE2.3.2)

### 7.1 Pruebas Unitarias
- Framework: Vitest
- Cobertura objetivo: > 70%
- Componentes testeados:
  - LoginPage
  - RegisterPage
  - ProductCard
  - NavBar
  - Auth Actions

### 7.2 Casos de Prueba
- Validación de formularios
- Interacción de componentes
- Manejo de estados
- Integración con acciones

---

## 8. Documentación de APIs

### 8.1 Endpoints Principales
- **Autenticación**: `/api/v1/auth/login`, `/api/v1/auth/register`, `/api/v1/auth/validate`
- **Productos**: `/api/v1/products` (GET, POST, PUT, DELETE)
- **Pedidos**: `/api/v1/orders` (GET, POST)
- **Reseñas**: `/api/v1/reviews` (GET, POST)

### 8.2 Documentación Swagger
- Todos los endpoints deben estar documentados en Swagger
- Disponible en: `http://localhost:PORT/swagger-ui.html`

---

## 9. Glosario

- **JWT Token**: Token de autenticación que permite mantener la sesión del usuario
- **Microservicio**: Servicio independiente que maneja una funcionalidad específica
- **SPA**: Single Page Application - Aplicación que carga una sola vez y navega sin recargar
- **CRUD**: Operaciones básicas de base de datos (Crear, Leer, Actualizar, Eliminar)

---

## 10. Aprobaciones

| Rol | Nombre | Firma | Fecha |
|-----|--------|-------|-------|
| Desarrollador | | | |
| Cliente/Profesor | | | |

---

**Fin del Documento ERS**

