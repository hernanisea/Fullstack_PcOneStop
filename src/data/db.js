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
    }
  ],

  users: [
    {
      id: "user-admin-01",
      name: "Hernán",
      email: "admin@pconestop.com",
      password: "admin", // En un proyecto real, esto debe estar hasheado
      role: "ADMIN"
    },
    {
      id: "user-client-01",
      name: "Pedro",
      email: "cliente@gmail.com",
      password: "123",
      role: "CLIENT"
    }
  ]
};
