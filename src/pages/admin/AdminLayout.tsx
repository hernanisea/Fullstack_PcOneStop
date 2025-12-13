// src/pages/admin/AdminLayout.tsx
import { Link, NavLink, Outlet } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import '../../styles/theme.css';

export const AdminLayout = () => {
  const { user } = useApp();

  return (
    <div className="admin-layout">
      {/* --- Sidebar (Barra Lateral) --- */}
      <nav className="admin-sidebar">
        <div className="sidebar-header">
          <Link to="/" className="brand text-white">PC OneStop</Link>
        </div>
        
        {/* Usamos NavLink para que se marque la ruta activa */}
        <ul className="nav flex-column">
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/dashboard">
              <i className="bi bi-grid-fill"></i> Dashboard
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/orders">
              <i className="bi bi-receipt"></i> Órdenes
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/products">
              <i className="bi bi-box-seam-fill"></i> Productos
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/users">
              <i className="bi bi-people-fill"></i> Usuarios
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/admin/reports">
              <i className="bi bi-flag-fill"></i> Reportes
            </NavLink>
          </li>
        </ul>
        
        <div className="sidebar-footer">
          <Link to="/" className="nav-link text-white-50">
            <i className="bi bi-shop"></i> Ir a la Tienda
          </Link>
          <hr />
          <div className="nav-link text-white">
            <i className="bi bi-person-circle"></i> {user?.firstName || user?.name || 'Admin'}
          </div>
        </div>
      </nav>

      {/* --- Contenido Principal --- */}
      {/* Aquí se renderizará cada página (Dashboard, Productos, etc.) */}
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};