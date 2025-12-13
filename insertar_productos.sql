-- Script SQL para insertar productos en la base de datos
-- Base de datos: db_inventario (verificar en application.properties)
-- Tabla: products

-- IMPORTANTE: Verifica el nombre de la base de datos antes de ejecutar
-- Puede ser: db_inventario, inventario, o el nombre que tengas configurado

USE db_inventario; -- Cambia esto si tu base de datos tiene otro nombre

-- Limpiar productos existentes (opcional, descomenta si quieres empezar desde cero)
-- DELETE FROM products;

-- Insertar productos
-- Nota: Los IDs se generan automáticamente como UUIDs o slugs. 
-- Si tu backend genera IDs automáticamente, puedes omitir el campo 'id' o usar NULL

INSERT INTO products (id, name, brand, category, price, stock, image, description, is_on_sale, offer_discount, offer_start_date, offer_end_date) VALUES
-- Procesadores (CPU)
('cpu-ryzen-5-5600x', 'Procesador AMD Ryzen 5 5600X', 'AMD', 'Procesador (CPU)', 600000.00, 15, 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500', 'Procesador AMD Ryzen 5 5600X con 6 núcleos y 12 hilos. Base clock 3.7GHz, boost hasta 4.6GHz. Socket AM4. Incluye cooler Wraith Stealth.', 0, NULL, NULL, NULL),
('cpu-intel-i5-12400f', 'Procesador Intel Core i5-12400F', 'Intel', 'Procesador (CPU)', 580000.00, 12, 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500', 'Procesador Intel Core i5-12400F 12va generación. 6 núcleos y 12 hilos. Base clock 2.5GHz, boost hasta 4.4GHz. Socket LGA1700.', 1, 10, '2025-11-27', '2025-12-31'),
('cpu-ryzen-7-5800x', 'Procesador AMD Ryzen 7 5800X', 'AMD', 'Procesador (CPU)', 850000.00, 8, 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500', 'Procesador AMD Ryzen 7 5800X con 8 núcleos y 16 hilos. Base clock 3.8GHz, boost hasta 4.7GHz. Socket AM4. Ideal para gaming y productividad.', 0, NULL, NULL, NULL),

-- Placas Madre
('mb-asus-tuf-b550m', 'Placa Madre ASUS TUF Gaming B550M-PLUS', 'ASUS', 'Placa Madre (Motherboard)', 450000.00, 10, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500', 'Placa madre ASUS TUF Gaming B550M-PLUS (Micro-ATX). Socket AM4, soporta Ryzen 5000. PCIe 4.0, 4 slots RAM DDR4, WiFi 6 integrado.', 0, NULL, NULL, NULL),
('mb-msi-b450-tomahawk', 'Placa Madre MSI B450 TOMAHAWK MAX', 'MSI', 'Placa Madre (Motherboard)', 380000.00, 15, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500', 'Placa madre MSI B450 TOMAHAWK MAX (ATX). Socket AM4, compatible con Ryzen 3000/5000. 4 slots DDR4, PCIe 3.0, audio HD.', 1, 15, '2025-11-27', '2025-12-15'),
('mb-gigabyte-b660m', 'Placa Madre Gigabyte B660M DS3H', 'Gigabyte', 'Placa Madre (Motherboard)', 420000.00, 9, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500', 'Placa madre Gigabyte B660M DS3H (Micro-ATX). Socket LGA1700, soporta Intel 12va gen. PCIe 4.0, 4 slots DDR4.', 0, NULL, NULL, NULL),

-- Tarjetas Gráficas (GPU)
('gpu-rtx-3060', 'Tarjeta Gráfica NVIDIA GeForce RTX 3060', 'NVIDIA', 'Tarjeta Gráfica (GPU)', 1200000.00, 5, 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500', 'Tarjeta gráfica NVIDIA GeForce RTX 3060 12GB GDDR6. Ray Tracing, DLSS. 192-bit bus, 3584 CUDA cores. Ideal para gaming en 1080p/1440p.', 0, NULL, NULL, NULL),
('gpu-rx-6600-xt', 'Tarjeta Gráfica AMD Radeon RX 6600 XT', 'AMD', 'Tarjeta Gráfica (GPU)', 1100000.00, 7, 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500', 'Tarjeta gráfica AMD Radeon RX 6600 XT 8GB GDDR6. 2048 Stream Processors, PCIe 4.0. Excelente rendimiento en 1080p gaming.', 1, 12, '2025-11-27', '2025-12-20'),
('gpu-rtx-3070', 'Tarjeta Gráfica NVIDIA GeForce RTX 3070', 'NVIDIA', 'Tarjeta Gráfica (GPU)', 1800000.00, 3, 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500', 'Tarjeta gráfica NVIDIA GeForce RTX 3070 8GB GDDR6. Ray Tracing, DLSS. 256-bit bus, 5888 CUDA cores. Gaming en 1440p y 4K.', 0, NULL, NULL, NULL),

-- Memorias RAM
('ram-corsair-vengeance-16gb', 'Memoria RAM Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz', 'Corsair', 'Memoria RAM', 280000.00, 20, 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500', 'Kit de memoria RAM Corsair Vengeance LPX 16GB (2 módulos de 8GB) DDR4 3200MHz. Latencia CL16, voltaje 1.35V. Compatible con Intel y AMD.', 0, NULL, NULL, NULL),
('ram-kingston-fury-32gb', 'Memoria RAM Kingston Fury Beast 32GB (2x16GB) DDR4 3600MHz', 'Kingston', 'Memoria RAM', 520000.00, 12, 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500', 'Kit de memoria RAM Kingston Fury Beast 32GB (2 módulos de 16GB) DDR4 3600MHz. Latencia CL18, disipador de calor incluido.', 1, 8, '2025-11-27', '2025-12-25'),
('ram-gskill-tridenz-16gb', 'Memoria RAM G.Skill Trident Z RGB 16GB (2x8GB) DDR4 3600MHz', 'G.Skill', 'Memoria RAM', 320000.00, 18, 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=500', 'Kit de memoria RAM G.Skill Trident Z RGB 16GB (2 módulos de 8GB) DDR4 3600MHz. Iluminación RGB, latencia CL18.', 0, NULL, NULL, NULL),

-- Almacenamiento
('ssd-samsung-970-evo-500gb', 'SSD Samsung 970 EVO Plus 500GB NVMe M.2', 'Samsung', 'Almacenamiento', 350000.00, 25, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500', 'SSD Samsung 970 EVO Plus 500GB NVMe M.2 PCIe 3.0. Velocidades de lectura hasta 3500MB/s, escritura hasta 3200MB/s. 5 años de garantía.', 0, NULL, NULL, NULL),
('ssd-wd-black-sn850-1tb', 'SSD WD Black SN850 1TB NVMe M.2', 'Western Digital', 'Almacenamiento', 680000.00, 15, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500', 'SSD WD Black SN850 1TB NVMe M.2 PCIe 4.0. Velocidades de lectura hasta 7000MB/s, escritura hasta 5300MB/s. Ideal para gaming y trabajo.', 1, 10, '2025-11-27', '2025-12-30'),
('hdd-seagate-2tb', 'HDD Seagate BarraCuda 2TB 7200RPM', 'Seagate', 'Almacenamiento', 180000.00, 30, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500', 'Disco duro Seagate BarraCuda 2TB 7200RPM SATA 3. Cache 256MB. Ideal para almacenamiento masivo y backups.', 0, NULL, NULL, NULL),

-- Fuentes de Poder (PSU)
('psu-corsair-rm750', 'Fuente de Poder Corsair RM750 750W 80 Plus Gold', 'Corsair', 'Fuente de Poder (PSU)', 450000.00, 14, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500', 'Fuente de poder Corsair RM750 750W 80 Plus Gold modular. Certificación 80 Plus Gold, cables modulares, ventilador de 135mm silencioso.', 0, NULL, NULL, NULL),
('psu-evga-600w', 'Fuente de Poder EVGA 600W 80 Plus Bronze', 'EVGA', 'Fuente de Poder (PSU)', 280000.00, 22, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500', 'Fuente de poder EVGA 600W 80 Plus Bronze. Certificación 80 Plus Bronze, cables no modulares, ideal para builds económicos.', 1, 15, '2025-11-27', '2025-12-18'),
('psu-seasonic-gx850', 'Fuente de Poder Seasonic Focus GX-850 850W 80 Plus Gold', 'Seasonic', 'Fuente de Poder (PSU)', 580000.00, 8, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500', 'Fuente de poder Seasonic Focus GX-850 850W 80 Plus Gold modular. Certificación 80 Plus Gold, cables modulares, 10 años de garantía.', 0, NULL, NULL, NULL),

-- Gabinetes
('case-nzxt-h510-flow', 'Gabinete NZXT H510 Flow Mid Tower', 'NZXT', 'Gabinete', 380000.00, 16, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', 'Gabinete NZXT H510 Flow Mid Tower ATX. Panel frontal con malla para mejor flujo de aire, vidrio templado lateral, soporte para radiadores de 280mm.', 0, NULL, NULL, NULL),
('case-corsair-4000d', 'Gabinete Corsair 4000D Airflow Mid Tower', 'Corsair', 'Gabinete', 420000.00, 12, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', 'Gabinete Corsair 4000D Airflow Mid Tower ATX. Diseño optimizado para flujo de aire, panel frontal con malla, vidrio templado lateral.', 1, 12, '2025-11-27', '2025-12-22'),
('case-fractal-meshify-c', 'Gabinete Fractal Design Meshify C Mid Tower', 'Fractal Design', 'Gabinete', 450000.00, 10, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', 'Gabinete Fractal Design Meshify C Mid Tower ATX. Panel frontal con malla, excelente flujo de aire, vidrio templado, diseño minimalista.', 0, NULL, NULL, NULL),

-- Coolers (Opcional)
('cooler-cm-hyper212', 'Cooler CPU Cooler Master Hyper 212 RGB Black Edition', 'Cooler Master', 'Cooler (Opcional)', 120000.00, 20, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500', 'Cooler CPU Cooler Master Hyper 212 RGB Black Edition. Refrigeración por aire, iluminación RGB, compatible con Intel y AMD, fácil instalación.', 0, NULL, NULL, NULL),
('cooler-noctua-nh-d15', 'Cooler CPU Noctua NH-D15', 'Noctua', 'Cooler (Opcional)', 280000.00, 8, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500', 'Cooler CPU Noctua NH-D15. Refrigeración por aire de alta gama, doble ventilador, excelente rendimiento térmico y silencioso.', 0, NULL, NULL, NULL),
('cooler-corsair-h100i', 'Cooler CPU AIO Corsair H100i RGB Elite 240mm', 'Corsair', 'Cooler (Opcional)', 450000.00, 6, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500', 'Cooler CPU AIO Corsair H100i RGB Elite 240mm. Refrigeración líquida, iluminación RGB, radiador de 240mm, excelente rendimiento.', 1, 10, '2025-11-27', '2025-12-28');

-- Verificar que se insertaron correctamente
-- SELECT COUNT(*) as total_productos FROM products;
-- SELECT * FROM products ORDER BY category, name;

