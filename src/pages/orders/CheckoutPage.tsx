import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { postOrder } from "../../actions/post-order.actions";
import { formatCurrency } from "../../helpers/format-currency.helpers";

export const CheckoutPage = () => {
  const { cart, clearCart } = useApp();
  const navigate = useNavigate();
  const total = cart.reduce((acc, i) => acc + i.price * i.qty, 0);

  const handlePay = async () => {
    const ok = await postOrder({ items: cart, total });
    if (ok) {
      clearCart();
      navigate("/checkout/success");
    } else {
      navigate("/checkout/error");
    }
  };

  return (
    <div className="container py-4">
      <h2>Checkout</h2>
      <p className="mb-2">Total: <strong>{formatCurrency(total)}</strong></p>
      <button className="btn btn-primary" onClick={handlePay}>Pagar</button>
    </div>
  );
};
