// src/pages/admin/AdminDashboard.tsx
import { Link } from 'react-router-dom';
import '../../styles/theme.css';

export const AdminDashboard = () => {

  return (
    <>
      <h3 className="mb-4">Dashboard</h3>
      <p className="text-muted">Resumen de las actividades diarias</p>

      {/* --- Tarjetas de Resumen (Estadísticas) --- */}
      <div className="row g-4 mb-4">
        
        {/* Tarjeta de Compras */}
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
        
        {/* Tarjeta de Productos */}
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
        
        {/* Tarjeta de Clientes */}
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

      </>
  );
};