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
import { ProtectedRoute } from "./ProtectedRoute";
import { AboutPage } from "../pages/about";

// --- Importaciones de Admin actualizadas ---
import { 
  AdminLayout, 
  AdminDashboard, 
  AdminProducts, 
  AdminUsers,
  AdminOrders,
  AdminReports,
  AdminProductNew,  
  AdminProductEdit
} from "../pages/admin";

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
    <Route path="/about" element={<AboutPage />} />

    
    
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/checkout/success" element={<CheckoutSuccess />} />
      <Route path="/checkout/error" element={<CheckoutError />} />
    
    
   {/* --- RUTAS DE ADMIN --- */}
    <Route path="/admin" element={<ProtectedRoute role="ADMIN" />}>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} /> 
        <Route path="dashboard" element={<AdminDashboard />} />
        
        {/* Rutas de Productos */}
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductNew />} /> 
        <Route path="products/edit/:id" element={<AdminProductEdit />} /> 

        {/* Otras rutas de admin */}
        <Route path="users" element={<AdminUsers />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>
    </Route>

    {/* --- Página no encontrada --- */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);