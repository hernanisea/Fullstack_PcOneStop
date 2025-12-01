// src/pages/orders/CheckoutSuccess.tsx
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { getLastOrder } from "../../actions/post-order.actions";
import { formatCurrency } from "../../helpers/format-currency.helpers";
import type { Order } from "../../interfaces/order.interfaces";

export const CheckoutSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useApp();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Intentar obtener la orden del estado de navegación primero
    const orderFromState = location.state?.order as Order | undefined;
    
    if (orderFromState) {
      setOrder(orderFromState);
      setLoading(false);
      return;
    }

    // Si no hay orden en el estado, intentar obtenerla del backend
    const fetchOrder = async () => {
      if (user?.id) {
        try {
          const userId = typeof user.id === 'number' ? user.id : parseInt(user.id.toString());
          const lastOrder = await getLastOrder(userId);
          if (lastOrder) {
            setOrder(lastOrder);
          }
        } catch (error) {
          console.error("Error al obtener última orden:", error);
        }
      }
      setLoading(false);
    };

    fetchOrder();
  }, [location.state, user]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-success">¡Pedido confirmado!</h2>
        <p className="mt-2">Tu pedido ha sido procesado exitosamente.</p>
        <Link className="btn btn-primary mt-3" to="/products">Seguir comprando</Link>
      </div>
    );
  }

  // Si encontramos la orden, la mostramos como en la Figura 7
  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-8">
        
          <div className="text-center mb-4">
            <h2 className="text-success">Se ha realizado la compra. nro #{order.id}</h2>
            <p className="lead">¡Gracias por tu compra!</p>
          </div>

          {/* 1. Resumen de Información */}
          {(order.customerName || order.customerEmail) && (
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title mb-3">Información del cliente</h5>
                <div className="row g-3">
                  {order.customerName && (
                    <div className="col-md-6">
                      <label className="form-label">Nombre</label>
                      <p className="form-control-plaintext">{order.customerName}</p>
                    </div>
                  )}
                  {order.customerLastName && (
                    <div className="col-md-6">
                      <label className="form-label">Apellidos</label>
                      <p className="form-control-plaintext">{order.customerLastName}</p>
                    </div>
                  )}
                  {order.customerEmail && (
                    <div className="col-12">
                      <label className="form-label">Correo</label>
                      <p className="form-control-plaintext">{order.customerEmail}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {(order.shippingStreet || order.shippingRegion) && (
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title mb-3">Dirección de entrega</h5>
                <div className="row g-3">
                  {order.shippingStreet && (
                    <div className="col-md-8">
                      <label className="form-label">Calle</label>
                      <p className="form-control-plaintext">{order.shippingStreet}</p>
                    </div>
                  )}
                  {order.shippingDepartment && (
                    <div className="col-md-4">
                      <label className="form-label">Departamento</label>
                      <p className="form-control-plaintext">{order.shippingDepartment}</p>
                    </div>
                  )}
                  {order.shippingRegion && (
                    <div className="col-md-6">
                      <label className="form-label">Región</label>
                      <p className="form-control-plaintext">{order.shippingRegion}</p>
                    </div>
                  )}
                  {order.shippingComuna && (
                    <div className="col-md-6">
                      <label className="form-label">Comuna</label>
                      <p className="form-control-plaintext">{order.shippingComuna}</p>
                    </div>
                  )}
                  {order.shippingIndications && (
                    <div className="col-12">
                      <label className="form-label">Indicaciones</label>
                      <p className="form-control-plaintext">{order.shippingIndications}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* 2. Resumen del Carrito */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Resumen de la compra</h5>
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items && order.items.length > 0 ? (
                    order.items.map(item => (
                      <tr key={item.productId}>
                        <td>{item.name}</td>
                        <td>{formatCurrency(item.price)}</td>
                        <td>{item.qty}</td>
                        <td className="fw-semibold">{formatCurrency(item.price * item.qty)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center text-muted">
                        No se pudieron cargar los detalles de los productos
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="text-end border-0 fs-5">
                      <strong>Total pagado:</strong>
                    </td>
                    <td className="border-0 fs-5 fw-bold">
                      {formatCurrency(order.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="text-center">
            <Link className="btn btn-primary mt-3" to="/products">Seguir comprando</Link>
          </div>

        </div>
      </div>
    </div>
  );
};