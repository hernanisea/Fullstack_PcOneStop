// src/data/db.js
export const db = {
  products: [
    {
      id: "cpu-ryzen-5600",
      name: "AMD Ryzen 5 5600",
      category: "CPU",
      price: 129990,
      image: "https://media.spdigital.cl/thumbnails/products/of2nke17_20c552f2_thumbnail_4096.png",
      description: "6C/12T, gran rendimiento precio-rendimiento.",
      stock: 20,
      brand: "AMD",
      isOnSale: true,
      offer:{
        discount: 15,
      }
    },
    {
      id: "gpu-rtx-4060",
      name: "NVIDIA GeForce RTX 4060",
      category: "GPU",
      price: 349990,
      image: "https://images-na.ssl-images-amazon.com/images/I/71U826jfF1L.jpg",
      description: "Ada Lovelace, DLSS 3, ideal 1080p/1440p.",
      stock: 10,
      brand: "NVIDIA",
      isOnSale: false
    },
    {
      id: "ram-ddr5-16",
      name: "DDR5 16GB 6000MHz",
      category: "RAM",
      price: 69990,
      image: "https://centrale.cl/wp-content/uploads/Memoria-RAM-32GB-2x-16GB-DDR5-6000MT-s-CL30-Kingston-Fury-Beast-RGB_CWaRYf8.webp",
      description: "Kit 2x8GB, CL36.",
      stock: 50,
      brand: "Corsair",
      isOnSale: false
    },
    {
      id: "mb-b550-asus",
      name: "ASUS TUF Gaming B550-PLUS",
      category: "Placa madre",
      price: 159990,
      image: "https://www.quietpc.com/images/products/asus-b550-plus-wifi-tuf-box-large.png",
      description: "Placa madre ATX, AM4, ideal para Ryzen 5000.",
      stock: 15,
      brand: "ASUS",
      isOnSale: true,
      offer:{
        discount: 10,
      }
    },
    {
      id: "psu-corsair-750w",
      name: "Corsair RM750x 750W 80+ Gold",
      category: "Fuente",
      price: 109990,
      image: "https://www.civip.com.vn/media/lib/1112_05q1.jpg",
      description: "Fuente de poder modular, 750W, certificación 80+ Gold.",
      stock: 25,
      brand: "Corsair",
      isOnSale: true,
      offer:{
        discount: 12,
      }
    },

    // --- PRODUCTO NUEVO: ALMACENAMIENTO ---
    {
      id: "ssd-kingston-nv2-1tb",
      name: "Kingston NV2 1TB NVMe PCIe 4.0",
      category: "Almacenamiento",
      price: 59990,
      image: "https://tse2.mm.bing.net/th/id/OIP.TEXHB1s9YOkev0i-cm7JuAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
      description: "SSD NVMe M.2 1TB. Velocidades de lectura/escritura de hasta 3500/2100 MB/s.",
      stock: 40,
      brand: "Kingston",
      isOnSale: false // No está en oferta
    },

    // --- PRODUCTO NUEVO: GABINETE ---
    {
      id: "case-nzxt-h5-flow",
      name: "Gabinete NZXT H5 Flow",
      category: "Gabinete",
      price: 84990,
      image: "https://ddtech.mx/assets/uploads/4cf5a6819e781350851b7bdc5ab55901.png",
      description: "Gabinete media torre con panel frontal perforado para alto flujo de aire. Incluye 2 ventiladores.",
      stock: 18,
      brand: "NZXT",
      isOnSale: false // No está en oferta
    },

    // --- PRODUCTO NUEVO: COOLER ---
    {
      id: "cooler-deepcool-ag400",
      name: "Cooler CPU Deepcool AG400",
      category: "Cooler",
      price: 24990,
      image: "https://microgem.fbitsstatic.net/img/p/cooler-deepcool-gammaxx-series-ag400-argb-120mm-intel-amd-preto-r-ag400-bkanmc-g-1-76719/265457.jpg?w=420&h=420&v=no-change&qs=ignore",
      description: "Disipador de aire para CPU con 4 tubos de calor de contacto directo y ventilador de 120mm.",
      stock: 30,
      brand: "Deepcool",
      isOnSale: false // No está en oferta
    }
  ],
  
  
 users: [
    {
      id: "user-admin-01",
      name: "Hernán",
      email: "admin@pconestop.com",
      password: "admin",
      role: "ADMIN"
    },
    {
      id: "user-client-01",
      name: "Pedro",
      email: "cliente@gmail.com",
      password: "123",
      role: "CLIENT"
    }
  ],


  orders: [
    {
      id: "NRO-123456",
      items: [
        { productId: "cpu-ryzen-5600", name: "AMD Ryzen 5 5600", price: 129990, qty: 1 }
      ],
      total: 129990,
      createdAt: new Date().toISOString(),
      customerName: "Pedro",
      customerLastName: "Cliente",
      customerEmail: "cliente@gmail.com",
      shippingStreet: "Calle Falsa 123",
      shippingRegion: "Región Metropolitana",
      shippingComuna: "Providencia"
    }
  ]

};