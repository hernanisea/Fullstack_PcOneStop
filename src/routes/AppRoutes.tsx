import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/home/HomePage";
import { ProductList } from "../pages/products/ProductList";
import { ProductDetail } from "../pages/products/ProductDetail";
import { CartPage } from "../pages/cart/CartPage";
import { CheckoutPage } from "../pages/orders/CheckoutPage";
import { CheckoutSuccess } from "../pages/orders/CheckoutSuccess";
import { CheckoutError } from "../pages/orders/CheckoutError";

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/products" element={<ProductList />} />
    <Route path="/products/:id" element={<ProductDetail />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/checkout" element={<CheckoutPage />} />
    <Route path="/checkout/success" element={<CheckoutSuccess />} />
    <Route path="/checkout/error" element={<CheckoutError />} />
    <Route path="*" element={<h2 className="text-center mt-5">Página no encontrada</h2>} />
  </Routes>
);
