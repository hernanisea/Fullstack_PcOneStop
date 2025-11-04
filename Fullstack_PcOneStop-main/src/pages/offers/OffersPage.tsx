import { useApp } from "../../context/AppContext";  // Asegúrate de importar el contexto
import { ProductCard } from "../shared/ProductCard";  // Asegúrate de tener este componente

export const OffersPage = () => {
  const { products } = useApp(); // Obtén los productos del contexto

  // Filtra los productos que están en oferta
  const offerProducts = products.filter(product => product.isOnSale);

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Productos en Oferta</h2>
      <div className="row g-3">
        {offerProducts.length > 0 ? (
          offerProducts.map(product => (
            <div className="col-12 col-md-6 col-lg-4" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <p>No hay productos en oferta actualmente.</p>
        )}
      </div>
    </div>
  );
};
