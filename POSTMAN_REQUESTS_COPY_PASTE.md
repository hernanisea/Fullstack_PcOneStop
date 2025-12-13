# Requests de Postman - Listos para Copiar y Pegar

## USUARIOS - Servicio de Autenticación (Puerto 8081)

### 1. Registrar Usuario ADMIN
**URL:** `http://localhost:8081/api/v1/auth/register`  
**Método:** `POST`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Admin",
  "lastName": "Principal",
  "email": "admin@pconestop.com",
  "password": "admin123",
  "role": "ADMIN"
}
```

---

### 2. Registrar Usuario CLIENTE
**URL:** `http://localhost:8081/api/v1/auth/register`  
**Método:** `POST`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@example.com",
  "password": "cliente123",
  "role": "CLIENT"
}
```

---

## PRODUCTOS - Servicio de Inventario (Puerto 8082)

### 1. CPU - AMD Ryzen 5 5600X
**URL:** `http://localhost:8082/api/v1/products`  
**Método:** `POST`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Procesador AMD Ryzen 5 5600X",
  "brand": "AMD",
  "category": "Procesador (CPU)",
  "price": 600000,
  "stock": 15,
  "image": "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&h=500&fit=crop",
  "description": "Procesador AMD Ryzen 5 5600X con 6 núcleos y 12 hilos. Base clock 3.7GHz, boost hasta 4.6GHz. Socket AM4. Incluye cooler Wraith Stealth.",
  "isOnSale": false
}
```

---

### 2. Placa Madre - ASUS TUF B550M-PLUS
**URL:** `http://localhost:8082/api/v1/products`  
**Método:** `POST`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Placa Madre ASUS TUF Gaming B550M-PLUS",
  "brand": "ASUS",
  "category": "Placa Madre (Motherboard)",
  "price": 450000,
  "stock": 10,
  "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=500&fit=crop",
  "description": "Placa madre ASUS TUF Gaming B550M-PLUS (Micro-ATX). Socket AM4, soporta Ryzen 5000. PCIe 4.0, 4 slots RAM DDR4, WiFi 6 integrado.",
  "isOnSale": false
}
```

---

### 3. GPU - NVIDIA GeForce RTX 3060
**URL:** `http://localhost:8082/api/v1/products`  
**Método:** `POST`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Tarjeta Gráfica NVIDIA GeForce RTX 3060",
  "brand": "NVIDIA",
  "category": "Tarjeta Gráfica (GPU)",
  "price": 1200000,
  "stock": 5,
  "image": "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&h=500&fit=crop",
  "description": "Tarjeta gráfica NVIDIA GeForce RTX 3060 12GB GDDR6. Ray Tracing, DLSS. 192-bit bus, 3584 CUDA cores. Ideal para gaming en 1080p/1440p.",
  "isOnSale": false
}
```

---

### 4. RAM - Corsair Vengeance LPX 16GB
**URL:** `http://localhost:8082/api/v1/products`  
**Método:** `POST`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Memoria RAM Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz",
  "brand": "Corsair",
  "category": "Memoria RAM",
  "price": 280000,
  "stock": 20,
  "image": "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500&h=500&fit=crop",
  "description": "Kit de memoria RAM Corsair Vengeance LPX 16GB (2 módulos de 8GB) DDR4 3200MHz. Latencia CL16, voltaje 1.35V. Compatible con Intel y AMD.",
  "isOnSale": false
}
```

---

### 5. Almacenamiento - Samsung 970 EVO Plus 500GB
**URL:** `http://localhost:8082/api/v1/products`  
**Método:** `POST`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "SSD Samsung 970 EVO Plus 500GB NVMe M.2",
  "brand": "Samsung",
  "category": "Almacenamiento",
  "price": 350000,
  "stock": 25,
  "image": "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop",
  "description": "SSD Samsung 970 EVO Plus 500GB NVMe M.2 PCIe 3.0. Velocidades de lectura hasta 3500MB/s, escritura hasta 3200MB/s. 5 años de garantía.",
  "isOnSale": false
}
```

---

### 6. PSU - Corsair RM750 750W
**URL:** `http://localhost:8082/api/v1/products`  
**Método:** `POST`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Fuente de Poder Corsair RM750 750W 80 Plus Gold",
  "brand": "Corsair",
  "category": "Fuente de Poder (PSU)",
  "price": 450000,
  "stock": 14,
  "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=500&fit=crop",
  "description": "Fuente de poder Corsair RM750 750W 80 Plus Gold modular. Certificación 80 Plus Gold, cables modulares, ventilador de 135mm silencioso.",
  "isOnSale": false
}
```

---

### 7. Gabinete - NZXT H510 Flow
**URL:** `http://localhost:8082/api/v1/products`  
**Método:** `POST`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Gabinete NZXT H510 Flow Mid Tower",
  "brand": "NZXT",
  "category": "Gabinete",
  "price": 380000,
  "stock": 16,
  "image": "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop",
  "description": "Gabinete NZXT H510 Flow Mid Tower ATX. Panel frontal con malla para mejor flujo de aire, vidrio templado lateral, soporte para radiadores de 280mm.",
  "isOnSale": false
}
```

---

### 8. Cooler - Cooler Master Hyper 212 RGB
**URL:** `http://localhost:8082/api/v1/products`  
**Método:** `POST`  
**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Cooler CPU Cooler Master Hyper 212 RGB Black Edition",
  "brand": "Cooler Master",
  "category": "Cooler (Opcional)",
  "price": 120000,
  "stock": 20,
  "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=500&fit=crop",
  "description": "Cooler CPU Cooler Master Hyper 212 RGB Black Edition. Refrigeración por aire, iluminación RGB, compatible con Intel y AMD, fácil instalación.",
  "isOnSale": false
}
```

---

## Instrucciones de Uso

1. **Abre Postman**
2. **Crea una nueva request** (botón "New" → "HTTP Request")
3. **Selecciona el método** (POST)
4. **Pega la URL** correspondiente
5. **Ve a la pestaña "Headers"** y agrega:
   - Key: `Content-Type`
   - Value: `application/json`
6. **Ve a la pestaña "Body"**:
   - Selecciona **"raw"**
   - Selecciona **"JSON"** en el dropdown
   - **Pega el JSON** del body correspondiente
7. **Haz clic en "Send"**

## Importante

- Asegúrate de que los microservicios estén corriendo:
  - **Autenticación**: `http://localhost:8081`
  - **Inventario**: `http://localhost:8082`

- Las imágenes usan URLs de Unsplash (placeholders). Para producción, usa imágenes reales.

- Puedes modificar cualquier campo en el JSON antes de enviar.

