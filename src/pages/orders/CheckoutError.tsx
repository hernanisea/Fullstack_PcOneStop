// src/pages/orders/CheckoutError.tsx
import { Link, useNavigate, useLocation } from "react-router-dom";

export const CheckoutError = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener mensaje de error del estado de navegación si existe
  const errorMessage = location.state?.errorMessage || null;
  const isStockError = location.state?.isStockError || false;

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-8 text-center">
        
          <h2 className="text-danger mb-3">
            <i className="bi bi-exclamation-triangle-fill fs-1"></i><br/>
            {isStockError ? "Productos Agotados" : "No se pudo realizar el pago"}
          </h2>
          
          {errorMessage ? (
            <div className="alert alert-danger mb-4">
              <p className="lead mb-0">{errorMessage}</p>
            </div>
          ) : (
            <p className="lead text-muted">
              {isStockError 
                ? "Uno o más productos en tu carrito están agotados o no tienen suficiente stock disponible."
                : "Ocurrió un problema al procesar tu solicitud. No se ha realizado ningún cargo."}
            </p>
          )}
          
          {isStockError && (
            <div className="alert alert-warning mb-4">
              <p className="mb-0">
                <strong>¿Qué hacer?</strong><br/>
                Ve a tu carrito y elimina los productos agotados o ajusta las cantidades según el stock disponible.
              </p>
            </div>
          )}
          
          {/* Este botón te lleva de vuelta a la página de Checkout, donde tu carrito seguirá lleno */}
          <button 
            className="btn btn-primary btn-lg mt-3" 
            onClick={() => navigate("/checkout")}
          >
            {isStockError ? "REVISAR CARRITO" : "VOLVER A REALIZAR EL PAGO"}
          </button>
          
          <div className="mt-3">
            <Link to="/cart" className="me-3">Ver Carrito</Link>
            <Link to="/products">Seguir comprando</Link>
          </div>

        </div>
      </div>
    </div>
  );
};