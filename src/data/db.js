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
      offer: { discount: 15 }
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
      image: "https://dlcdnweb.asus.com/product/a4a83355-7d04-46c5-9b1a-20f59a16f2c3/P_setting_000_1_90_end_s.png",
      description: "Placa madre ATX, AM4, ideal para Ryzen 5000.",
      stock: 15,
      brand: "ASUS",
      isOnSale: true,
      offer: { discount: 10 }
    },
    {
      id: "psu-corsair-750w",
      name: "Corsair RM750x 750W 80+ Gold",
      category: "Fuente",
      price: 109990,
      image: "https://www.corsair.com/medias/sys_master/images/images/h8f/h30/8883584598046/CP-9020179-NA/Gallery/RMx_2018_750_01_Front.png",
      description: "Fuente de poder modular, 750W, certificación 80+ Gold.",
      stock: 25,
      brand: "Corsair",
      isOnSale: true,
      offer: { discount: 12 }
    },
    {
      id: "ssd-kingston-nv2-1tb",
      name: "Kingston NV2 1TB NVMe PCIe 4.0",
      category: "Almacenamiento",
      price: 59990,
      image: "https://media.kingston.com/kingston/product/ktc-product-ssd-nv2-nvme-pcie-snv2s-1000g-1-sm.png",
      description: "SSD NVMe M.2 1TB. Velocidades de lectura/escritura de hasta 3500/2100 MB/s.",
      stock: 40,
      brand: "Kingston",
      isOnSale: false
    },
    {
      id: "case-nzxt-h5-flow",
      name: "Gabinete NZXT H5 Flow",
      category: "Gabinete",
      price: 84990,
      image: "https://nzxt.com/assets/cms/34299/1665005825-h5flow-white-main-no-system.png?auto=format&fit=fill&h=1000&w=1000",
      description: "Gabinete media torre con panel frontal perforado para alto flujo de aire. Incluye 2 ventiladores.",
      stock: 18,
      brand: "NZXT",
      isOnSale: false
    },
    {
      id: "cooler-deepcool-ag400",
      name: "Cooler CPU Deepcool AG400",
      category: "Cooler",
      price: 24990,
      image: "https://www.deepcool.com/product/CPUPACKAGE/2022-07/19_19502/web/AG400-BK-ARDB-1.png",
      description: "Disipador de aire para CPU con 4 tubos de calor de contacto directo y ventilador de 120mm.",
      stock: 30,
      brand: "Deepcool",
      isOnSale: false
    }
  ],
  
  users: [
    {
      id: "user-admin-01",
      name: "Hernán",
      lastName: "Admin", // <-- Nuevo campo
      email: "admin@pconestop.com",
      password: "admin",
      role: "ADMIN"
    },
    {
      id: "user-client-01",
      name: "Pedro",
      lastName: "Pérez", // <-- Nuevo campo
      email: "cliente@gmail.com",
      password: "123",
      role: "CLIENT"
    }
  ],

  orders: [
    {
      id: "20240705", // <-- Formato ajustado al PDF (#20240705)
      items: [
        { productId: "cpu-ryzen-5600", name: "AMD Ryzen 5 5600", price: 129990, qty: 1 }
      ],
      total: 129990,
      createdAt: new Date().toISOString(),
      customerName: "Pedro",
      customerLastName: "Pérez",
      customerEmail: "cliente@gmail.com",
      shippingStreet: "Calle Falsa 123",
      shippingDepartment: "Depto 603",
      shippingRegion: "Región Metropolitana",
      shippingComuna: "Cerrillos",
      shippingIndications: "Dejar en conserjería"
    }
  ]
};