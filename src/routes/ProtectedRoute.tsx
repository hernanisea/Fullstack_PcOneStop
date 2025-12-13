// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useApp } from "../context/AppContext";

type Props = {
  redirectTo?: string;
  role?: "ADMIN" | "CLIENT";
};

export const ProtectedRoute = ({ redirectTo = "/login", role }: Props) => {
  const { user } = useApp();

  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si se requiere un rol específico y el usuario no lo tiene
  if (role && user.role !== role) {
    const redirectPath = user.role === "ADMIN" ? "/admin/dashboard" : "/";
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};