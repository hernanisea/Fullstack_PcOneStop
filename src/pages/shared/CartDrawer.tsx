import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { formatCurrency } from "../../helpers/format-currency.helpers";

export const CartDrawer = () => {
  const { cart, removeFromCart, updateQty, cartTotal, clearCart } = useApp();
  const navigate = useNavigate();

  return (
    <div className="offcanvas offcanvas-end" tabIndex={-1} id="cartDrawer" aria-labelledby="cartDrawerLabel">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="cartDrawerLabel">Tu carrito</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>

      <div className="offcanvas-body d-flex flex-column">
        {cart.length === 0 ? (
          <div className="text-center text-muted">
            <p className="mb-3">Aún no tienes productos.</p>
            <Link className="btn btn-outline-primary" to="/products" data-bs-dismiss="offcanvas">Ver productos</Link>
          </div>
        ) : (
          <>
            <ul className="list-group mb-3 flex-grow-1 overflow-auto">
              {cart.map(item => (
                <li key={item.productId} className="list-group-item d-flex align-items-center gap-3">
                  <img
                    src={item.image ?? "/logo.png"}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="rounded border bg-white object-fit-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== `${window.location.origin}/logo.png`) {
                        target.src = "/logo.png";
                      }
                    }}
                  />
                  <div className="flex-grow-1">
                    <div className="fw-semibold">{item.name}</div>
                    <div className="small text-muted">{formatCurrency(item.price)}</div>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => updateQty(item.productId, Math.max(1, item.qty - 1))}
                      >−</button>
                      <input
                        className="form-control form-control-sm qty-input"
                        style={{ width: 60 }}
                        type="number"
                        min={1}
                        value={item.qty}
                        onChange={(e) => {
                          const v = parseInt(e.target.value || "1", 10);
                          updateQty(item.productId, isNaN(v) ? 1 : Math.max(1, v));
                        }}
                      />
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => updateQty(item.productId, item.qty + 1)}
                      >+</button>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="fw-semibold">{formatCurrency(item.price * item.qty)}</div>
                    <button className="btn btn-link text-danger p-0 small" onClick={() => removeFromCart(item.productId)}>
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-semibold">Subtotal</span>
              <span className="fs-5 fw-bold">{formatCurrency(cartTotal)}</span>
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-outline-secondary w-50" onClick={clearCart}>Vaciar</button>
              <button
                className="btn btn-success w-50"
                data-bs-dismiss="offcanvas"
                onClick={() => navigate("/checkout")}
              >
                Ir a pagar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

