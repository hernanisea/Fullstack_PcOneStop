import { BrowserRouter } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { AppRoutes } from "./routes/AppRoutes";
import { NavBar, Footer, ToastAlert,CartDrawer } from "./pages/shared";
import "./styles/global.css";
import "./styles/theme.css";

function AppContent() {
  const { toastMessage, hideToast } = useApp();
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
