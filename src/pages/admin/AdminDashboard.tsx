// src/pages/admin/AdminDashboard.tsx
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import '../../styles/theme.css'; // Importamos el CSS nuevo

export const AdminDashboard = () => {
  const { user } = useApp();

  return (
    <div className="admin-layout">
      {/* --- Sidebar (Barra Lateral) --- */}
      <nav className="admin-sidebar">
        <div className="sidebar-header">
          <Link to="/" className="brand text-white">PC OneStop</Link>
        </div>
        <ul className="nav flex-column">
          <li className="nav-item">
            <Link className="nav-link active" to="/admin/dashboard">
              <i className="bi bi-grid-fill"></i> Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin/orders">
              <i className="bi bi-receipt"></i> Órdenes
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin/products">
              <i className="bi bi-box-seam-fill"></i> Productos
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin/categories">
              <i className="bi bi-tags-fill"></i> Categorías
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin/users">
              <i className="bi bi-people-fill"></i> Usuarios
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/admin/reports">
              <i className="bi bi-bar-chart-fill"></i> Reportes
            </Link>
          </li>
        </ul>
        <div className="sidebar-footer">
          <Link to="/" className="nav-link text-white-50">
            <i className="bi bi-shop"></i> Ir a la Tienda
          </Link>
          <hr />
          <div className="nav-link text-white">
            <i className="bi bi-person-circle"></i> {user?.name}
          </div>
        </div>
      </nav>

      {/* --- Contenido Principal --- */}
      <main className="admin-content">
        <h3 className="mb-4">Dashboard</h3>
        <p className="text-muted">Resumen de las actividades diarias</p>

        {/* Tarjetas de Resumen (Figura 9) */}
        <div className="row g-4 mb-4">
          <div className="col-lg-4">
            <div className="card admin-stat-card bg-primary text-white">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Compras</h5>
                  <h2 className="card-text fw-bold">1,234</h2>
                  <p className="card-text small opacity-75">Probabilidad de ascenso: 20%</p>
                </div>
                <i className="bi bi-cart-check-fill stat-icon"></i>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card admin-stat-card bg-success text-white">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Productos</h5>
                  <h2 className="card-text fw-bold">400</h2>
                  <p className="card-text small opacity-75">Inventario actual: 500</p>
                </div>
                <i className="bi bi-box-seam-fill stat-icon"></i>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card admin-stat-card bg-warning text-dark">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">Clientes</h5>
                  <h2 className="card-text fw-bold">890</h2>
                  <p className="card-text small opacity-75">Nuevos clientes: 25</p>
                </div>
                <i className="bi bi-people-fill stat-icon"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjetas de Acceso (Figura 9) */}
        <div className="row g-4">
          <div className="col-md-6 col-lg-4">
            <Link to="/admin/dashboard" className="card admin-link-card">
              <div className="card-body text-center">
                <i className="bi bi-grid-fill fs-2 mb-2 text-primary"></i>
                <h6 className="card-title">Dashboard</h6>
                <p className="card-text small text-muted">Visión general de todas las métricas y estadísticas.</p>
              </div>
            </Link>
          </div>
          <div className="col-md-6 col-lg-4">
            <Link to="/admin/orders" className="card admin-link-card">
              <div className="card-body text-center">
                <i className="bi bi-receipt fs-2 mb-2 text-success"></i>
                <h6 className="card-title">Órdenes</h6>
                <p className="card-text small text-muted">Gestión y seguimiento de todas las órdenes realizadas.</p>
              </div>
            </Link>
          </div>
          <div className="col-md-6 col-lg-4">
            <Link to="/admin/products" className="card admin-link-card">
              <div className="card-body text-center">
                <i className="bi bi-box-seam-fill fs-2 mb-2 text-info"></i>
                <h6 className="card-title">Productos</h6>
                <p className="card-text small text-muted">Administrar inventario y detalles de los productos.</p>
              </div>
            </Link>
          </div>
          <div className="col-md-6 col-lg-4">
            <Link to="/admin/categories" className="card admin-link-card">
              <div className="card-body text-center">
                <i className="bi bi-tags-fill fs-2 mb-2 text-warning"></i>
                <h6 className="card-title">Categorías</h6>
                <p className="card-text small text-muted">Organizar productos en categorías para facilitar la navegación.</p>
              </div>
            </Link>
          </div>
          <div className="col-md-6 col-lg-4">
            <Link to="/admin/users" className="card admin-link-card">
              <div className="card-body text-center">
                <i className="bi bi-people-fill fs-2 mb-2 text-danger"></i>
                <h6 className="card-title">Usuarios</h6>
                <p className="card-text small text-muted">Gestión de cuentas de usuario y sus roles dentro del sistema.</p>
              </div>
            </Link>
          </div>
          <div className="col-md-6 col-lg-4">
            <Link to="/admin/reports" className="card admin-link-card">
              <div className="card-body text-center">
                <i className="bi bi-bar-chart-fill fs-2 mb-2 text-secondary"></i>
                <h6 className="card-title">Reportes</h6>
                <p className="card-text small text-muted">Generación de informes detallados sobre las operaciones.</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};