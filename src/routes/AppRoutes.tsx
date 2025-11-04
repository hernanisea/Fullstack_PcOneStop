// src/routes/AppRoutes.tsx
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
import { PcBuilderPage } from "../pages/build";
import { LoginPage } from "../pages/login"; 
import { RegisterPage } from "../pages/register"; 
import { AdminDashboard } from "../pages/admin"; 
import { ProtectedRoute } from "./ProtectedRoute"; 

export const AppRoutes = () => (
  <Routes>
    {/* --- Rutas Públicas --- */}
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} /> 
    <Route path="/register" element={<RegisterPage />} /> 
    <Route path="/products" element={<ProductList />} />
    <Route path="/products/:id" element={<ProductDetail />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/offers" element={<OffersPage />} />
    <Route path="/build" element={<PcBuilderPage />} />

    {/* --- Rutas de Checkout (Protegidas por login básico) --- */}
    <Route element={<ProtectedRoute />}>
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/checkout/success" element={<CheckoutSuccess />} />
      <Route path="/checkout/error" element={<CheckoutError />} />
    </Route>
    
    {/* --- Rutas de Administrador (Protegidas por ROL) --- */}
    <Route element={<ProtectedRoute role="ADMIN" />}>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Route>

    {/* --- Página no encontrada --- */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);