import { Link } from "react-router-dom";

export const CheckoutError = () => (
  <div className="container py-5 text-center">
    <h2 className="text-danger">Ocurrió un problema</h2>
    <p>Tu pedido no pudo procesarse. Intenta nuevamente.</p>
    <Link className="btn btn-outline-primary mt-3" to="/checkout">Volver al checkout</Link>
  </div>
);
