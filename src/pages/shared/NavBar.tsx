import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export const NavBar = () => {
  const [open, setOpen] = useState(false);
  const { cart } = useApp();
  const cartCount = cart.reduce((acc, i) => acc + i.qty, 0);

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
          <span />
          <span />
          <span />
        </button>

        {/* Links */}
        <div className={`menu ${open ? "open" : ""}`}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
            onClick={() => setOpen(false)}
          >
            Inicio
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
            onClick={() => setOpen(false)}
          >
            Productos
          </NavLink>

          {/* New Offer section */}
          <NavLink
            to="/offers"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
            onClick={() => setOpen(false)}
          >
            Ofertas
          </NavLink>

          <NavLink
            to="/build"
            className={({ isActive }) =>
              "nav-link" + (isActive ? " active" : "")
            }
            onClick={() => setOpen(false)}
          >
            PC Builder
          </NavLink>

          {/* Cart button */}
          <NavLink
            to="/cart"
            className="btn btn-outline-light position-relative ms-md-3"
            onClick={() => setOpen(false)}
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
        </div>
      </nav>
    </header>
  );
};
