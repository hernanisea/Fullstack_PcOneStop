import { Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/home";
import { ProductList } from "../pages/products/ProductList";
import { ProductDetail } from "../pages/products/ProductDetail";
import { CartPage } from "../pages/cart/CartPage";
import { CheckoutPage } from "../pages/orders/CheckoutPage";
import { CheckoutSuccess } from "../pages/orders/CheckoutSuccess";
import { CheckoutError } from "../pages/orders/CheckoutError";
import { OffersPage } from "../pages/offers/OffersPage";
import { NotFound } from "../pages/shared/NotFound";
import { PcBuilderPage } from "../pages/build"; // <-- AÑADIDO

export const AppRoutes = () => (
  
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/products" element={<ProductList />} />
    <Route path="/products/:id" element={<ProductDetail />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/checkout" element={<CheckoutPage />} />
    <Route path="/checkout/success" element={<CheckoutSuccess />} />
    <Route path="/checkout/error" element={<CheckoutError />} />
    <Route path="/offers" element={<OffersPage />} />
    <Route path="/build" element={<PcBuilderPage />} /> {/* <-- AÑADIDO */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);