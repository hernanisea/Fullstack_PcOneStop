// src/pages/shared/NavBar.tsx
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { logout } from "../../actions/auth.actions";

export const NavBar = () => {
  const [open, setOpen] = useState(false);
  const { cart, user, setUser, setIsLoading } = useApp();
  const cartCount = cart.reduce((acc, i) => acc + i.qty, 0);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoading(true);
    setUser(null);
    logout(); // IE3.3.2 - Cierra la sesión y elimina el token JWT
    setOpen(false);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 500);
  };

  const closeMenu = () => setOpen(false);

  return (
    <header className="navbar-glass">
      {/* El 'justify-content-between' ahora separará 
        el 'div.left-side' (hamburguesa + brand) del 'div.menu' (links) 
      */}
      <nav className="container d-flex align-items-center justify-content-between py-3">
        <div className="d-flex align-items-center gap-3">
          <button
            className="burger"
            aria-label="Abrir menú"
            onClick={() => setOpen(v => !v)}
          >
            <span /> <span /> <span />
          </button>

          <Link to="/" className="brand d-flex align-items-center gap-4">
            <img src="/logo.png" alt="PC OneStop Logo" className="navbar-logo" />
          </Link>
        </div>
        
        {/* --- FIN DE SECCIÓN MODIFICADA --- */}

        {/* Links (Lado Derecho - sin cambios) */}
        <div className={`menu ${open ? "open" : ""}`}>
          <NavLink to="/" className="nav-link" onClick={closeMenu}>
            Inicio
          </NavLink>
          <NavLink to="/products" className="nav-link" onClick={closeMenu}>
            Productos
          </NavLink>
          <NavLink to="/offers" className="nav-link" onClick={closeMenu}>
            Ofertas
          </NavLink>
          <NavLink to="/build" className="nav-link" onClick={closeMenu}>
            PC Builder
          </NavLink>

          {/* Carrito (siempre visible) */}
          <NavLink
            to="/cart"
            className="btn btn-outline-light position-relative ms-md-3"
            onClick={closeMenu}
          >
            <i className="bi bi-cart3"></i> Carrito
            <span
              className={`badge rounded-pill ms-2 ${cartCount > 0 ? "badge-pulse" : ""}`}
              style={{
                background: "var(--color-accent)",
                color: "#fff",
                minWidth: 28,
              }}
            >
              {cartCount}
            </span>
          </NavLink>

          {/* Lógica de Login (sin cambios) */}
          {user ? (
            <>
              {user.role === "ADMIN" && (
                <NavLink to="/admin/dashboard" className="nav-link" onClick={closeMenu}>
                  <i className="bi bi-shield-lock-fill"></i> Admin
                </NavLink>
              )}
              <button
                className="btn btn-outline-danger ms-md-2"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <NavLink
              to="/login"
              className="btn btn-outline-primary ms-md-3"
              onClick={closeMenu}
            >
              Iniciar Sesión
            </NavLink>
          )}

        </div>
      </nav>
    </header>
  );
};