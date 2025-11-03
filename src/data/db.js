// src/data/db.js
export const db = {
  products: [
    {
      id: "cpu-ryzen-5600",
      name: "AMD Ryzen 5 5600",
      category: "CPU",
      price: 129990,
      image: "/logo.png",
      description: "6C/12T, gran rendimiento precio-rendimiento.",
      stock: 20,
      brand: "AMD",
    },
    {
      id: "gpu-rtx-4060",
      name: "NVIDIA GeForce RTX 4060",
      category: "GPU",
      price: 349990,
      image: "/logo.png",
      description: "Ada Lovelace, DLSS 3, ideal 1080p/1440p.",
      stock: 10,
      brand: "NVIDIA",
    },
    {
      id: "ram-ddr5-16",
      name: "DDR5 16GB 6000MHz",
      category: "RAM",
      price: 69990,
      image: "/logo.png",
      description: "Kit 2x8GB, CL36.",
      stock: 50,
      brand: "Corsair",
    },
  ],
};
