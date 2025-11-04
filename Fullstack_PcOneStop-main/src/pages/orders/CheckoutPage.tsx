import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { formatCurrency } from "../../helpers/format-currency.helpers";
import { postOrder } from "../../actions/post-order.actions";
import type { Order } from "../../interfaces/order.interfaces";

export const CheckoutPage = () => {
  const { cart, clearCart } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const total = useMemo(
    () => cart.reduce((acc, i) => acc + i.price * i.qty, 0),
    [cart]
  );

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const order: Order = {
        id: crypto.randomUUID(),
        items: cart.map(i => ({ productId: i.productId, name: i.name, price: i.price, qty: i.qty })),
        total,
        createdAt: new Date().toISOString(),
        customerEmail: email || undefined
      };
      await postOrder(order);
      clearCart();
      navigate("/checkout/success");
    } catch {
      navigate("/checkout/error");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container py-4">
        <h2>Checkout</h2>
        <p>No tienes productos en el carrito.</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-3">Checkout</h2>

      <div className="row g-4">
        <div className="col-md-7">
          <div className="card">
            <div className="card-body">
              <h5>Resumen</h5>
              <ul className="list-group list-group-flush">
                {cart.map(i => (
                  <li key={i.productId} className="list-group-item d-flex justify-content-between">
                    <span>{i.name} <small className="text-muted">x{i.qty}</small></span>
                    <strong>{formatCurrency(i.price * i.qty)}</strong>
                  </li>
                ))}
                <li className="list-group-item d-flex justify-content-between">
                  <span>Total</span>
                  <strong className="fs-5">{formatCurrency(total)}</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card">
            <div className="card-body">
              <h5>Datos de contacto (opcional)</h5>
              <input
                className="form-control"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                className="btn btn-success w-100 mt-3"
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? "Procesando..." : "Confirmar pedido"}
              </button>
              <p className="text-muted small mt-2">* Pago simulado (mock)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

