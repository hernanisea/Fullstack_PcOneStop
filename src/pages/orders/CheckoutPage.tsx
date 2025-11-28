// src/pages/orders/CheckoutPage.tsx
import { useMemo, useState, useEffect } from "react"; // 1. Importamos useEffect
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { formatCurrency } from "../../helpers/format-currency.helpers";
import { postOrder } from "../../actions/post-order.actions";
import type { Order } from "../../interfaces/order.interfaces";

export const CheckoutPage = () => {
  const { cart, clearCart, user } = useApp(); // 2. Obtenemos 'user' del contexto
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
      // Asumimos que user.name es "Nombre Apellido"
      const nameParts = user.name.split(' ');
      const firstName = nameParts[0] || "";
      const restOfName = nameParts.slice(1).join(' ');

      setName(firstName);
      setLastName(restOfName);
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
      
      await postOrder(order);
      clearCart();
      navigate("/checkout/success");
    } catch (error) {
      console.error("Error al procesar orden:", error);
      setFormError("No se pudo procesar la orden. Intenta de nuevo.");
      navigate("/checkout/error"); 
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
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              {/* ... (Resumen de la tabla) ... */}
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