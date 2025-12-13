// src/pages/admin/AdminReports.tsx
import { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { getAdminReports } from "../../actions/admin-reports.actions";
import type { ProductReport } from "../../interfaces/report.interfaces";
import { Link } from "react-router-dom";
import { getAdminProducts } from "../../actions/admin.actions";
import { getAdminUsers } from "../../actions/admin.actions";
import type { Product } from "../../interfaces/product.interfaces";
import type { User } from "../../interfaces/user.interfaces";

export const AdminReports = () => {
  const { showToast, setIsLoading } = useApp();
  const [reports, setReports] = useState<ProductReport[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<Omit<User, 'password'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      setIsLoading(true);
      
      try {
        // Cargar reportes, productos y usuarios en paralelo
        const [reportsData, productsData, usersData] = await Promise.all([
          getAdminReports(),
          getAdminProducts(),
          getAdminUsers()
        ]);
        
        setReports(reportsData);
        setProducts(productsData);
        setUsers(usersData);
      } catch (err: any) {
        setError(err.message || "Error al cargar los reportes");
        showToast(err.message || "Error al cargar los reportes", 'error');
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    };

    loadData();
  }, [showToast, setIsLoading]);

  // Helper para obtener el nombre del producto
  const getProductName = (productId: number): string => {
    const product = products.find(p => {
      const pId = typeof p.id === 'number' ? p.id : parseInt(p.id.toString());
      return pId === productId;
    });
    return product?.name || `Producto #${productId}`;
  };

  // Helper para obtener el nombre del usuario
  const getUserName = (userId: number): string => {
    const user = users.find(u => {
      const uId = typeof u.id === 'number' ? u.id : parseInt(u.id.toString());
      return uId === userId;
    });
    if (user) {
      return `${user.firstName || user.name || ''} ${user.lastName || ''}`.trim() || `Usuario #${userId}`;
    }
    return `Usuario #${userId}`;
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando reportes...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Reportes de Productos</h2>
        <span className="badge bg-warning text-dark">
          {reports.length} {reports.length === 1 ? 'reporte' : 'reportes'}
        </span>
      </div>

      {reports.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
            <h4 className="mt-3">No hay reportes</h4>
            <p className="text-muted">No se han recibido reportes de productos.</p>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Producto</th>
                    <th>Reportado por</th>
                    <th>Motivo</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => {
                    return (
                      <tr key={report.id}>
                        <td>{report.id}</td>
                        <td>
                          <Link
                            to={`/products/${report.productId}`}
                            className="text-decoration-none"
                            target="_blank"
                            title={getProductName(report.productId)}
                          >
                            {getProductName(report.productId)}
                            <i className="bi bi-box-arrow-up-right ms-1 small"></i>
                          </Link>
                          <br />
                          <small className="text-muted">ID: {report.productId}</small>
                        </td>
                        <td>
                          {getUserName(report.userId)}
                          <br />
                          <small className="text-muted">ID: {report.userId}</small>
                        </td>
                        <td>
                          <div style={{ maxWidth: '400px', wordWrap: 'break-word' }}>
                            {report.reason || <span className="text-muted">Sin motivo especificado</span>}
                          </div>
                        </td>
                        <td>
                          {report.date ? (
                            new Date(report.date).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          ) : (
                            <span className="text-muted">N/A</span>
                          )}
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Link
                              to={`/products/${report.productId}`}
                              className="btn btn-sm btn-outline-primary"
                              target="_blank"
                              title="Ver producto en nueva pestaña"
                            >
                              <i className="bi bi-eye"></i> Ver
                            </Link>
                            <Link
                              to={`/admin/products/edit/${report.productId}`}
                              className="btn btn-sm btn-outline-secondary"
                              title="Editar producto"
                            >
                              <i className="bi bi-pencil"></i> Editar
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

