// src/App.tsx
import { BrowserRouter } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { AppRoutes } from "./routes/AppRoutes";
import { NavBar, Footer, ToastAlert, CartDrawer, LoadingScreen } from "./pages/shared";
import "./styles/global.css";
import "./styles/theme.css";

function AppContent() {
  const { isLoading } = useApp(); // <-- MODIFICADO (ya no necesita toastMessage)

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <NavBar />
      <AppRoutes />
      <Footer />
      {/* MODIFICADO: ToastAlert ahora se renderiza solo */}
      <ToastAlert /> 
      <CartDrawer />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}