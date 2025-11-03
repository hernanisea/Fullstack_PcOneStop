import { Link } from "react-router-dom";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-glass mt-5">
      <div className="container py-5">
        <div className="row g-4">
          {/* Brand + claim */}
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="brand-dot" />
              <h5 className="m-0">PC OneStop</h5>
            </div>
            <p className="text-muted small mb-3">
              Tu tienda de hardware: componentes, armados y asesoría para tu próximo build.
            </p>
            <div className="d-flex gap-2">
              <a className="social-link" href="#" aria-label="Instagram">IG</a>
              <a className="social-link" href="#" aria-label="X/Twitter">X</a>
              <a className="social-link" href="#" aria-label="YouTube">YT</a>
            </div>
          </div>

          {/* Navegación */}
          <div className="col-6 col-md-2">
            <h6 className="text-uppercase text-muted">Navegación</h6>
            <ul className="list-unstyled footer-links">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/products">Productos</Link></li>
              <li><Link to="/build">PC Builder</Link></li>
              <li><Link to="/reviews">Reseñas</Link></li>
              <li><Link to="/cart">Carrito</Link></li>
            </ul>
          </div>

          {/* Soporte */}
          <div className="col-6 col-md-3">
            <h6 className="text-uppercase text-muted">Soporte</h6>
            <ul className="list-unstyled footer-links">
              <li><a href="#">Preguntas frecuentes</a></li>
              <li><a href="#">Garantías y devoluciones</a></li>
              <li><a href="#">Envíos</a></li>
              <li><a href="#">Contacto</a></li>
            </ul>
          </div>

          {/* Newsletter (mock) */}
          <div className="col-12 col-md-3">
            <h6 className="text-uppercase text-muted">Novedades</h6>
            <p className="text-muted small">
              Ofertas y lanzamientos semanales directamente a tu correo.
            </p>
            <form
              className="d-flex gap-2"
              onSubmit={(e) => { e.preventDefault(); alert("¡Gracias por suscribirte!"); }}
            >
              <input
                type="email"
                className="form-control form-control-sm footer-input"
                placeholder="tu@email.com"
                required
              />
              <button className="btn btn-sm btn-accent">Ok</button>
            </form>
          </div>
        </div>

        <hr className="footer-sep my-4" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <small className="text-muted">
            © {year} PC OneStop — Hecho con para entusiastas del hardware.
          </small>
          <ul className="list-inline m-0 text-muted small">
            <li className="list-inline-item"><a href="#">Privacidad</a></li>
            <li className="list-inline-item">•</li>
            <li className="list-inline-item"><a href="#">Términos</a></li>
            <li className="list-inline-item">•</li>
            <li className="list-inline-item"><a href="#">Cookies</a></li>
          </ul>
        </div>
      </div>

      {/* Back to top */}
      <button
        className="back-to-top"
        aria-label="Volver arriba"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ↑
      </button>
    </footer>
  );
};
