import { Link } from "react-router-dom";
export const CheckoutError = () => (
  <div className="container py-5 text-center">
    <h2>Ups, ocurrió un error 😓</h2>
    <p>Intenta nuevamente.</p>
    <Link className="btn btn-outline-primary mt-3" to="/checkout">Volver al checkout</Link>
  </div>
);
