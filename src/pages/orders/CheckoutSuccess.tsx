import { Link } from "react-router-dom";
import { getLastOrder } from "../../actions/post-order.actions";
import { formatCurrency } from "../../helpers/format-currency.helpers";

export const CheckoutSuccess = () => {
  const order = getLastOrder();

  return (
    <div className="container py-5 text-center">
      <h2 className="text-success">¡Pedido confirmado!</h2>
      {order ? (
        <>
          <p className="mt-2">N° de pedido: <strong>{order.id}</strong></p>
          <p>Total: <strong>{formatCurrency(order.total)}</strong></p>
        </>
      ) : (
        <p className="mt-2">No encontramos el último pedido en este dispositivo.</p>
      )}
      <Link className="btn btn-primary mt-3" to="/products">Seguir comprando</Link>
    </div>
  );
};
