import { useApp } from "../../context/AppContext";
import { formatCurrency } from "../../helpers/format-currency.helpers";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const CartPage = () => {
  const { cart, removeFromCart, updateQty, clearCart, cartTotal, products, removeOutOfStockItems } = useApp();
  const navigate = useNavigate();
  
  // Verificar y eliminar productos agotados cuando se carga la página o se actualizan productos
  useEffect(() => {
    if (cart.length > 0 && products.length > 0) {
      // Solo ejecutar si hay productos en el carrito y productos cargados
      const hasOutOfStock = cart.some(item => {
        const product = products.find(p => p.id.toString() === item.productId.toString());
        return !product || product.stock <= 0;
      });
      
      if (hasOutOfStock) {
        removeOutOfStockItems();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.length]); // Solo cuando cambia la cantidad de productos cargados

  if (cart.length === 0) {
    return (
      <div className="container py-4">
        <h2>Carrito</h2>
        <p>Tu carrito está vacío. <Link to="/products">Ver productos</Link></p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="mb-3">Carrito</h2>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body p-0">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Producto</th>
                    <th style={{ width: 140 }}>Cantidad</th>
                    <th style={{ width: 140 }}>Precio</th>
                    <th style={{ width: 140 }}>Subtotal</th>
                    <th style={{ width: 90 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => {
                    const product = products.find(p => p.id.toString() === item.productId.toString());
                    const stockAvailable = product?.stock ?? 0;
                    const hasStockIssue = !product || product.stock <= 0 || item.qty > product.stock;
                    
                    return (
                      <tr key={item.productId} className={hasStockIssue ? "table-warning" : ""}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <img 
                              src={item.image ?? "/logo.png"} 
                              alt={item.name} 
                              width={54} 
                              height={54} 
                              className="rounded border bg-white object-fit-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (target.src !== `${window.location.origin}/logo.png`) {
                                  target.src = "/logo.png";
                                }
                              }}
                            />
                            <div>
                              <div className="fw-semibold">{item.name}</div>
                              <div className="small text-muted">{item.productId}</div>
                              {hasStockIssue && (
                                <div className="small text-danger mt-1">
                                  {!product ? "Producto no disponible" : 
                                   product.stock <= 0 ? "Agotado" : 
                                   `Solo ${stockAvailable} disponible${stockAvailable !== 1 ? 's' : ''}`}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <button 
                              className="btn btn-sm btn-outline-secondary" 
                              onClick={() => updateQty(item.productId, Math.max(1, item.qty - 1))}
                              disabled={item.qty <= 1}
                            >
                              −
                            </button>
                            <input
                              className={`form-control form-control-sm ${hasStockIssue ? 'border-warning' : ''}`}
                              style={{ width: 70 }}
                              type="number"
                              min={1}
                              max={stockAvailable}
                              value={item.qty}
                              onChange={(e) => {
                                const v = parseInt(e.target.value || "1", 10);
                                updateQty(item.productId, isNaN(v) ? 1 : Math.max(1, Math.min(v, stockAvailable)));
                              }}
                            />
                            <button 
                              className="btn btn-sm btn-outline-secondary" 
                              onClick={() => updateQty(item.productId, item.qty + 1)}
                              disabled={!product || item.qty >= stockAvailable}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td>{formatCurrency(item.price)}</td>
                        <td className="fw-semibold">{formatCurrency(item.price * item.qty)}</td>
                        <td>
                          <button className="btn btn-link text-danger p-0" onClick={() => removeFromCart(item.productId)}>Quitar</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <button className="btn btn-outline-secondary mt-3" onClick={clearCart}>Vaciar carrito</button>
        </div>

        {/* 👇 LÍNEA MODIFICADA (se añadió .summary-card-sticky) */}
        <div className="col-lg-4 summary-card-sticky"> 
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Resumen</h5>
              <div className="d-flex justify-content-between">
                <span>Subtotal</span>
                <span className="fw-semibold">{formatCurrency(cartTotal)}</span>
              </div>
              <hr />
              <button className="btn btn-success w-100" onClick={() => navigate("/checkout")}>
                Ir a pagar
              </button>
              <Link to="/products" className="btn btn-link w-100 mt-2">Seguir comprando</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};