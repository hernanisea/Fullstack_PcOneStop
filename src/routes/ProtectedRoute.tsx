// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useApp } from "../context/AppContext";

// Añadimos una prop 'role' para que la ruta especifique qué rol se requiere
type Props = {
  redirectTo?: string;
  role?: "ADMIN" | "CLIENT";
};

export const ProtectedRoute = ({ redirectTo = "/login", role }: Props) => {
  const { user } = useApp();

  // 1. Si no hay usuario, siempre redirige a 'redirectTo' (login)
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // 2. Si se requiere un rol específico y el usuario no lo tiene
  if (role && user.role !== role) {
    // Si un cliente intenta entrar a /admin, lo mandamos al inicio
    // Si un admin intenta entrar a una ruta solo de cliente (ej. /mis-compras), lo mandamos a su dashboard
    const redirectPath = user.role === "ADMIN" ? "/admin/dashboard" : "/";
    return <Navigate to={redirectPath} replace />;
  }

  // 3. Si pasa las validaciones, muestra el contenido (las rutas anidadas)
  return <Outlet />;
};