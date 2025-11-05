import { useApp } from "../../context/AppContext"; // Asegúrate de importar el contexto
import { ProductCard } from "../shared/ProductCard"; // Asegúrate de tener este componente

export const OffersPage = () => {
  const { products } = useApp(); // Obtén los productos del contexto

  // Filtra los productos que están en oferta
  const offerProducts = products.filter(product => product.isOnSale);

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Productos en Oferta</h2>
      
      {/* --- CÓDIGO MODIFICADO --- */}
      {offerProducts.length > 0 ? (
        
        // 1. Usamos la clase 'product-grid'
        <div className="product-grid">
          {offerProducts.map(product => (
            // 2. Renderizamos el ProductCard directamente
            <ProductCard product={product} key={product.id} />
          ))}
        </div>

      ) : (
        // 3. Mensaje si no hay ofertas
        <p className="text-center">No hay productos en oferta actualmente.</p>
      )}
    </div>
  );
};