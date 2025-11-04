import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export const HomePage = () => {
  const { products } = useApp(); // Obtienes los productos desde el contexto

  // Filtramos los productos que están en oferta
  const offerProducts = products.filter(product => product.isOnSale);

  return (
    <div className="home-container">
      {/* HERO */}
      <section className="hero-banner text-center text-light">
        <div className="hero-overlay" />
        <div className="container position-relative z-2 py-5">
          <h1 className="display-4 fw-bold mb-3">
            Potencia tus ideas con <span className="text-accent">PC OneStop</span>
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

      {/* PRODUCTOS EN OFERTA */}
      <section className="container py-5 text-center">
        <h2 className="display-6 fw-bold mb-4">¡Ofertas especiales para ti!</h2>
        <div className="row g-4">
          {offerProducts.length > 0 ? (
            offerProducts.map((product) => (
              <div className="col-md-4" key={product.id}>
                <div className="product-card">
                  <img src={product.image || "/logo.png"} alt={product.name} className="w-100" />
                  <h5 className="mt-2 text-white">{product.name}</h5>
                  <p className="text-muted">
                    {product.isOnSale
                      ? `$${(product.price - (product.price * (product.offer?.discount || 0)) / 100).toFixed(2)}`
                      : `$${product.price.toFixed(2)}`}
                  </p>
                  <Link to={`/products/${product.id}`} className="btn btn-outline-primary btn-sm">
                    Ver Producto
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>No hay productos en oferta actualmente.</p>
          )}
        </div>
      </section>
    </div>
  );
};
