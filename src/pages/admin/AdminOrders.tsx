// src/pages/admin/AdminOrders.tsx
import { useState, useEffect } from "react";
import { getAdminOrders, type AdminOrder } from "../../actions/admin.actions";
import { formatCurrency } from "../../helpers/format-currency.helpers";
import { useApp } from "../../context/AppContext";

export const AdminOrders = () => {
  const { setIsLoading } = useApp();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getAdminOrders()
      .then(setOrders)
      .finally(() => {
        setLoading(false);
        setIsLoading(false);
      });
  }, [setIsLoading]);

  const getStatusBadge = (status?: string) => {
    const statusLower = (status || "PENDIENTE").toLowerCase();
    if (statusLower === "completado" || statusLower === "completada") {
      return <span className="badge bg-success">Completada</span>;
    }
    if (statusLower === "cancelado" || statusLower === "cancelada") {
      return <span className="badge bg-danger">Cancelada</span>;
    }
    return <span className="badge bg-warning text-dark">Pendiente</span>;
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando órdenes...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Historial de Órdenes</h2>
        <span className="badge bg-primary">
          {orders.length} {orders.length === 1 ? 'orden' : 'órdenes'}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i>
            <h4 className="mt-3">No hay órdenes</h4>
            <p className="text-muted">Aún no se han realizado pedidos.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Fecha</th>
                      <th>Cliente</th>
                      <th>Email</th>
                      <th>Estado</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => {
                      return (
                        <tr key={order.id}>
                          <td>
                            <strong>#{order.id}</strong>
                          </td>
                          <td>
                            {new Date(order.createdAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td>
                            {order.userName || (order.customerName && order.customerLastName 
                              ? `${order.customerName} ${order.customerLastName}`.trim()
                              : order.customerName || 'N/A')}
                          </td>
                          <td>
                            {order.userEmail || order.customerEmail || (
                              <span className="text-muted">N/A</span>
                            )}
                          </td>
                          <td>{getStatusBadge(order.status)}</td>
                          <td>
                            <span className="badge bg-secondary">
                              {order.itemCount || order.items?.length || 0}
                            </span>
                          </td>
                          <td>
                            <strong>{formatCurrency(order.total)}</strong>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => setSelectedOrder(order)}
                              title="Ver detalles"
                            >
                              <i className="bi bi-eye"></i> Ver
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Modal para ver detalles de la orden */}
          {selectedOrder && (
            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Detalles de la Orden #{selectedOrder.id}</h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setSelectedOrder(null)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="row g-3 mb-3">
                      <div className="col-md-6">
                        <strong>Fecha:</strong>
                        <p>{new Date(selectedOrder.createdAt).toLocaleString('es-ES')}</p>
                      </div>
                      <div className="col-md-6">
                        <strong>Estado:</strong>
                        <p>{getStatusBadge(selectedOrder.status)}</p>
                      </div>
                      <div className="col-md-6">
                        <strong>Cliente:</strong>
                        <p>
                          {selectedOrder.userName || 
                           (selectedOrder.customerName && selectedOrder.customerLastName
                             ? `${selectedOrder.customerName} ${selectedOrder.customerLastName}`
                             : selectedOrder.customerName || 'N/A')}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <strong>Email:</strong>
                        <p>{selectedOrder.userEmail || selectedOrder.customerEmail || 'N/A'}</p>
                      </div>
                      <div className="col-12">
                        <strong>Productos:</strong>
                        <p>
                          {selectedOrder.productIds 
                            ? selectedOrder.productIds.split(',').map((id, idx) => (
                                <span key={idx} className="badge bg-light text-dark me-1">
                                  ID: {id.trim()}
                                </span>
                              ))
                            : 'No disponible'}
                        </p>
                        <small className="text-muted">
                          Total de items: {selectedOrder.itemCount || selectedOrder.items?.length || 0}
                        </small>
                      </div>
                      <div className="col-12">
                        <strong>Total:</strong>
                        <h4 className="text-success">{formatCurrency(selectedOrder.total)}</h4>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setSelectedOrder(null)}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};