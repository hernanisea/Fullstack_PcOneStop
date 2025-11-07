import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { ProductCard } from "../shared/ProductCard"; 

export const HomePage = () => {
  const { products } = useApp(); // Obtienes los productos desde el contexto

  // Filtramos los productos que están en oferta
  const offerProducts = products.filter(product => product.isOnSale);

  return (
    
    <div className="home-container">

      <section className="hero-banner text-center text-light">
        <div className="hero-overlay" />
        <div className="container position-relative z-2 py-5">
          <h1 className="display-4 fw-bold mb-3">
            Potencia tu Equipo con <span className="text-accent">PC OneStop</span>
          </h1>
          <p className="lead mb-4 text-muted">
            Arma tu PC ideal, explora el catálogo más completo y disfruta del rendimiento que mereces.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/products" className="btn btn-primary btn-lg px-4">
              Ver Catálogo
            </Link>
            <Link to="/build" className="btn btn-outline-light btn-lg px-4">
              Armar mi PC
            </Link>
          </div>
        </div>
      </section>

      
      <section className="container py-5">
        <h2 className="display-6 fw-bold mb-4 text-center">¡Ofertas especiales para ti!</h2>
        {offerProducts.length > 0 ? (
          <div className="product-grid">
            {offerProducts.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>

        ) : (
          <p className="text-center">No hay productos en oferta actualmente.</p>
        )}
      </section>
    </div>
  );
};