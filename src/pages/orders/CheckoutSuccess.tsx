import { Link } from "react-router-dom";
export const CheckoutSuccess = () => (
  <div className="container py-5 text-center">
    <h2>¡Pago exitoso! 🎉</h2>
    <p>Gracias por tu compra.</p>
    <Link className="btn btn-outline-primary mt-3" to="/products">Seguir comprando</Link>
  </div>
);
