// src/pages/shared/NavBar.tsx
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export const NavBar = () => {
  const [open, setOpen] = useState(false);
  const { cart, user, setUser, setIsLoading } = useApp(); // <-- OBTENEMOS USER y SETUSER
  const cartCount = cart.reduce((acc, i) => acc + i.qty, 0);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoading(true);
    setUser(null); // Borra el usuario del contexto
    // Aquí también deberías limpiar cualquier token de localStorage si lo usaras
    setOpen(false);
    // Añadimos una pequeña demora para que se vea el loader
    setTimeout(() => {
      setIsLoading(false);
      navigate("/"); // Redirige al inicio
    }, 500);
  };

  const closeMenu = () => setOpen(false);

  return (
    <header className="navbar-glass">
      <nav className="container d-flex align-items-center justify-content-between py-3">
        {/* Brand */}
        <Link to="/" className="brand d-flex align-items-center gap-2">
          <span className="fw-bold text-white">PC OneStop</span>
        </Link>

        {/* Mobile burger */}
        <button
          className="burger"
          aria-label="Abrir menú"
          onClick={() => setOpen(v => !v)}
        >
          <span /> <span /> <span />
        </button>

        {/* Links */}
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

          {/* --- LÓGICA DE LOGIN --- */}
          {user ? (
            // --- SI ESTÁ LOGUEADO ---
            <>
              {/* Si es Admin, muestra el enlace al Dashboard */}
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
            // --- SI NO ESTÁ LOGUEADO (Invitado) ---
            <NavLink
              to="/login"
              className="btn btn-outline-primary ms-md-3"
              onClick={closeMenu}
            >
              Iniciar Sesión
            </NavLink>
            // Aquí puedes poner el botón de "Crear Cuenta" del PDF
            // <NavLink to="/register" className="btn btn-primary" onClick={closeMenu}>
            //   Crear Cuenta
            // </NavLink>
          )}

        </div>
      </nav>
    </header>
  );
};