import { BrowserRouter } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { AppRoutes } from "./routes/AppRoutes";
import { NavBar, Footer, ToastAlert, CartDrawer, LoadingScreen } from "./pages/shared"; // <-- AÑADIDO LoadingScreen
import "./styles/global.css";
import "./styles/theme.css";

function AppContent() {
  const { toastMessage, hideToast, isLoading } = useApp(); // <-- AÑADIDO isLoading

  // Si está cargando, muestra la pantalla de carga
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Si no, muestra la app normal
  return (
    <>
      <NavBar />
      <AppRoutes />
      <Footer />
      <ToastAlert
        message={toastMessage}
        show={!!toastMessage}
        onClose={hideToast}
        
      />
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