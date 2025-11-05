import { Link } from "react-router-dom"; // <-- 1. Asegúrate de importar Link

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer-slim mt-5">
      <div className="container py-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div>
            <h5 className="fw-bold mb-1 text-white">PC OneStop</h5>
            <p className="small text-muted mb-0">
              Componentes, rendimiento y confianza. Tu tienda de hardware en línea.
            </p>
          </div>

          <div className="d-flex gap-3">
            {/* --- 2. ENLACE AÑADIDO AQUÍ --- */}
            <Link to="/about" className="text-muted small text-decoration-none">
              Nosotros
            </Link>
          </div>
        </div>

        <hr className="my-3 border-secondary opacity-25" />

        <div className="text-center small text-muted">
          © {year} PC OneStop — Desarrollado 
        </div>
      </div>
    </footer>
  );
};