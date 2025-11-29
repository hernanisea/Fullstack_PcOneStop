// src/pages/orders/CheckoutError.tsx
import { Link, useNavigate } from "react-router-dom";

export const CheckoutError = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-8 text-center">
        
          <h2 className="text-danger mb-3">
            <i className="bi bi-exclamation-triangle-fill fs-1"></i><br/>
            No se pudo realizar el pago.
          </h2>
          
          <p className="lead text-muted">
            Ocurrió un problema al procesar tu solicitud. No se ha realizado ningún cargo.
          </p>
          
          {/* Este botón te lleva de vuelta a la página de Checkout, donde tu carrito seguirá lleno */}
          <button 
            className="btn btn-primary btn-lg mt-3" 
            onClick={() => navigate("/checkout")}
          >
            VOLVER A REALIZAR EL PAGO
          </button>
          
          <div className="mt-3">
            <Link to="/products">Seguir comprando</Link>
          </div>

        </div>
      </div>
    </div>
  );
};