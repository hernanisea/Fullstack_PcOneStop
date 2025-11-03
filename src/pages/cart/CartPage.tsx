import { useApp } from "../../context/AppContext";
import { formatCurrency } from "../../helpers/format-currency.helpers";
import { Link, useNavigate } from "react-router-dom";

export const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useApp();
  const navigate = useNavigate();

  const total = cart.reduce((acc, i) => acc + i.price * i.qty, 0);

  if (cart.length === 0) {
    return (
      <div className="container py-4">
        <h2>Carrito</h2>
        <p>
          Tu carrito está vacío.{" "}
          <Link to="/products">Ver productos</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-3">Carrito</h2>

      <ul className="list-group mb-3">
        {cart.map((item) => (
          <li
            key={item.productId}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{item.name}</strong>
              <div className="small text-muted">x{item.qty}</div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <span>{formatCurrency(item.price * item.qty)}</span>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => removeFromCart(item.productId)}
              >
                Quitar
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="d-flex justify-content-between align-items-center">
        <h4>Total: {formatCurrency(total)}</h4>

        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={clearCart}>
            Vaciar
          </button>

          <button
            className="btn btn-success"
            onClick={() => navigate("/checkout")}
          >
            Ir a pagar
          </button>
        </div>
      </div>
    </div>
  );
};
