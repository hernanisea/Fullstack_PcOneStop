// src/pages/orders/CheckoutPage.tsx
import { useMemo, useState, useEffect } from "react"; // 1. Importamos useEffect
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { formatCurrency } from "../../helpers/format-currency.helpers";
import { postOrder } from "../../actions/post-order.actions";
import { isStockError, extractStockErrorMessage } from "../../helpers/stock.helpers";
import { handleApiError, showErrorToUser, shouldRedirectToLogin, shouldRefreshCart } from "../../utils/errorHandler";
import type { Order } from "../../interfaces/order.interfaces";

export const CheckoutPage = () => {
  const { cart, clearCart, user, products, showToast, reloadProducts } = useApp(); // 2. Obtenemos 'user', 'products' y 'reloadProducts' del contexto
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Estados para el formulario completo
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [department, setDepartment] = useState("");
  const [region, setRegion] = useState("Región Metropolitana de Santiago");
  const [comuna, setComuna] = useState("Cerrillos");
  const [indications, setIndications] = useState("");

  // --- 3. NUEVO: Lógica para rellenar el formulario si el usuario existe ---
  useEffect(() => {
    if (user) {
      setName(user.firstName || user.name || "");
      setLastName(user.lastName || "");
      setEmail(user.email);
    }
  }, [user]); // Se ejecuta cada vez que el 'user' (del login) cambie

  const total = useMemo(
    () => cart.reduce((acc, i) => acc + i.price * i.qty, 0),
    [cart]
  );
  
  const isFormValid = name && lastName && email && street && region && comuna;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setFormError(""); 

    if (!isFormValid) {
      setFormError("Faltan campos obligatorios. Por favor, revísalos.");
      return;
    }

    // Validar stock antes de crear la orden
    const stockErrors: string[] = [];
    for (const item of cart) {
      const product = products.find(p => p.id.toString() === item.productId.toString());
      if (!product) {
        stockErrors.push(`${item.name} no está disponible`);
        continue;
      }
      if (product.stock <= 0) {
        stockErrors.push(`${item.name} está agotado`);
      } else if (item.qty > product.stock) {
        stockErrors.push(`${item.name}: solo hay ${product.stock} unidades disponibles (solicitaste ${item.qty})`);
      }
    }

    if (stockErrors.length > 0) {
      const errorMessage = `Error de stock: ${stockErrors.join('. ')}. Por favor, ajusta las cantidades en tu carrito o elimina los productos agotados.`;
      setFormError(errorMessage);
      showToast('Hay problemas con el stock de algunos productos', 'error');
      
      // Eliminar productos agotados automáticamente
      removeOutOfStockItems();
      
      return;
    }

    try {
      setLoading(true);
      const order: Order = {
        id: `NRO-${Date.now().toString().slice(-6)}`, 
        items: cart.map(i => ({ productId: i.productId, name: i.name, price: i.price, qty: i.qty })),
        total,
        createdAt: new Date().toISOString(),
        customerName: name,
        customerLastName: lastName,
        customerEmail: email,
        shippingStreet: street,
        shippingDepartment: department || undefined,
        shippingRegion: region,
        shippingComuna: comuna,
        shippingIndications: indications || undefined,
      };
      
      // Pasar el userId del usuario logueado (si existe)
      const userId = user?.id ? (typeof user.id === 'number' ? user.id : parseInt(user.id.toString())) : undefined;
      
      // Usar postOrder que ahora envía items con cantidades
      const createdOrder = await postOrder(order, userId);
      
      // Actualizar productos después de compra exitosa
      await reloadProducts();
      
      // Eliminar productos agotados del carrito automáticamente
      // (esto se hace automáticamente al limpiar el carrito)
      clearCart();
      
      // Pasar la orden creada en el estado de navegación
      navigate("/checkout/success", { state: { order: createdOrder } });
    } catch (error: any) {
      console.error("Error al procesar orden:", error);
      
      // Usar el error handler para obtener información estructurada
      const errorInfo = handleApiError(error, error.response?.data || {
        ok: false,
        message: error.originalMessage || error.message,
        statusCode: error.statusCode || 500
      });
      
      if (errorInfo) {
        // Mostrar mensaje amigable al usuario
        showErrorToUser(errorInfo, showToast);
        setFormError(errorInfo.userFriendly);
        
        // Si es error de autenticación, redirigir al login
        if (shouldRedirectToLogin(errorInfo)) {
          setTimeout(() => {
            navigate("/login");
          }, 2000);
          return;
        }
        
        // Si es error de stock, recargar productos y limpiar carrito
        if (shouldRefreshCart(errorInfo)) {
          reloadProducts().catch(err => console.error("Error al recargar productos:", err));
          removeOutOfStockItems();
        }
      } else {
        // Error genérico
        const errorMessage = error.originalMessage || error.message || "No se pudo procesar la orden. Intenta de nuevo.";
        setFormError(errorMessage);
        showToast("Error al procesar la orden", 'error');
      }
      
      // No navegar a error page, quedarse en checkout para que el usuario pueda corregir
      // navigate("/checkout/error"); 
    } finally {
      setLoading(false);
    }
  };
  
  // (Las funciones 'onChange' que limpian el error siguen igual)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (formError) setFormError("");
  };
  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
    if (formError) setFormError("");
  };
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (formError) setFormError("");
  };
  const handleStreetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStreet(e.target.value);
    if (formError) setFormError("");
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
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-8">
        
          <h2 className="mb-3">Carrito de compra</h2>
          
          {/* Resumen de productos en el carrito */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Productos en tu carrito</h5>
              <div className="table-responsive">
                <table className="table table-sm align-middle">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th style={{ width: 100 }}>Cantidad</th>
                      <th style={{ width: 120 }}>Precio</th>
                      <th style={{ width: 120 }}>Subtotal</th>
                      <th style={{ width: 100 }}>Estado</th>
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
                            <div className="d-flex align-items-center gap-2">
                              <img 
                                src={item.image ?? "/logo.png"} 
                                alt={item.name} 
                                width={40} 
                                height={40} 
                                className="rounded border bg-white object-fit-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  if (target.src !== `${window.location.origin}/logo.png`) {
                                    target.src = "/logo.png";
                                  }
                                }}
                              />
                              <div>
                                <div className="fw-semibold small">{item.name}</div>
                                {hasStockIssue && (
                                  <div className="small text-danger">
                                    {!product ? "No disponible" : 
                                     product.stock <= 0 ? "Agotado" : 
                                     `Solo ${stockAvailable} disponible${stockAvailable !== 1 ? 's' : ''}`}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>{item.qty}</td>
                          <td>{formatCurrency(item.price)}</td>
                          <td className="fw-semibold">{formatCurrency(item.price * item.qty)}</td>
                          <td>
                            {hasStockIssue ? (
                              <span className="badge bg-danger">⚠️ Problema</span>
                            ) : (
                              <span className="badge bg-success">✓ OK</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="text-end fw-bold">Total:</td>
                      <td className="fw-bold fs-5">{formatCurrency(total)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              {/* Advertencia si hay productos con problemas de stock */}
              {cart.some(item => {
                const product = products.find(p => p.id.toString() === item.productId.toString());
                return !product || product.stock <= 0 || item.qty > product.stock;
              }) && (
                <div className="alert alert-warning mt-3 mb-0">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <strong>Atención:</strong> Algunos productos en tu carrito tienen problemas de stock. 
                  Por favor, revisa y ajusta las cantidades antes de continuar.
                </div>
              )}
            </div>
          </div>

          {/* El formulario se rellenará automáticamente gracias al useEffect */}
          <form onSubmit={handleConfirm}>
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title mb-3">Información del cliente</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre *</label>
                    <input type="text" className="form-control" value={name} onChange={handleNameChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Apellidos *</label>
                    <input type="text" className="form-control" value={lastName} onChange={handleLastNameChange} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Correo *</label>
                    <input type="email" className="form-control" value={email} onChange={handleEmailChange} />
                  </div>
                </div>
              </div>
            </div>

            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h5 className="card-title mb-3">Dirección de entrega de los productos</h5>
                <div className="row g-3">
                  <div className="col-md-8">
                    <label className="form-label">Calle *</label>
                    <input type="text" className="form-control" value={street} onChange={handleStreetChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Departamento (opcional)</label>
                    <input type="text" className="form-control" value={department} onChange={(e) => setDepartment(e.target.value)} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Región *</label>
                    <select className="form-select" value={region} onChange={(e) => setRegion(e.target.value)}>
                      <option value="Región Metropolitana de Santiago">Región Metropolitana de Santiago</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Comuna *</label>
                    <select className="form-select" value={comuna} onChange={(e) => setComuna(e.target.value)}>
                      <option value="Cerrillos">Cerrillos</option>
                      <option value="La Reina">La Reina</option>
                      <option value="Providencia">Providencia</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Indicaciones para la entrega (opcional)</label>
                    <textarea className="form-control" rows={3} value={indications} onChange={(e) => setIndications(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-end">
              {formError && (
                <div className="alert alert-danger text-center small p-2 mb-3">
                  {formError}
                </div>
              )}
              
              <button type="submit" className="btn btn-success btn-lg" disabled={loading}>
                {loading ? "Procesando..." : `Pagar ahora ${formatCurrency(total)}`}
              </button>
            </div>
            
          </form>

        </div>
      </div>
    </div>
  );
};