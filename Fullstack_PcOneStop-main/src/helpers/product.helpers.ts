// helpers/product.helpers.ts
export const getProductsOnSale = async () => {
  // Simulamos una lista de productos en oferta, usa tu propia lógica para obtener los productos
  return [
    {
      id: 'cpu-ryzen-5600',
      name: 'AMD Ryzen 5 5600',
      price: 129990,
      image: '/images/cpu-ryzen-5600.png',
      description: '6C/12T, gran rendimiento precio-rendimiento.',
      stock: 20,
      salePrice: 99990, // Precio con descuento
    },
    // Otros productos en oferta
  ];
};
