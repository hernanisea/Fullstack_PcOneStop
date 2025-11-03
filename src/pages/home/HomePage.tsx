import { Link } from "react-router-dom";

export const HomePage = () => {
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

      {/* FEATURES */}
      <section className="features-section container text-center py-5">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="feature-card">
              <div className="icon">⚙️</div>
              <h4 className="fw-semibold">Compatibilidad garantizada</h4>
              <p className="text-muted small">
                Selecciona componentes compatibles con nuestro sistema inteligente de validación.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-card">
              <div className="icon">💳</div>
              <h4 className="fw-semibold">Compra segura</h4>
              <p className="text-muted small">
                Transacciones protegidas y soporte técnico en cada paso de tu compra.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="feature-card">
              <div className="icon">🚚</div>
              <h4 className="fw-semibold">Envíos express</h4>
              <p className="text-muted small">
                Entregas rápidas y rastreables en todo Chile, directamente en tu puerta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-section text-center py-5">
        <h2 className="fw-bold mb-3">¿Listo para construir tu nueva PC?</h2>
        <p className="text-muted mb-4">
          Empieza ahora y descubre por qué miles de usuarios confían en PC OneStop.
        </p>
        <Link to="/products" className="btn btn-accent px-5 py-2">
          Comenzar ahora
        </Link>
      </section>
    </div>
  );
};
