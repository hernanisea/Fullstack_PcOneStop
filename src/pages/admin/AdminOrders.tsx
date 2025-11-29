// src/pages/admin/AdminOrders.tsx
import { useState, useEffect } from "react";
import type { Order } from "../../interfaces/order.interfaces";
import { getAdminOrders } from "../../actions/admin.actions";
import { formatCurrency } from "../../helpers/format-currency.helpers";

export const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h3 className="mb-4">Historial de Órdenes ({orders.length})</h3>

      <div className="card">
        <div className="card-body">
          {loading ? (
            <p>Cargando órdenes...</p>
          ) : (
            <div className="table-responsive">
              <table className="table admin-table align-middle">
                <thead>
                  <tr>
                    <th>ID Orden</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Email</th>
                    <th>N° Items</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>{order.customerName} {order.customerLastName}</td>
                      <td>{order.customerEmail}</td>
                      <td>{order.items.length}</td>
                      <td>{formatCurrency(order.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};