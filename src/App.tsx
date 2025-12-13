// src/App.tsx
import { BrowserRouter } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { AppRoutes } from "./routes/AppRoutes";
import { NavBar, Footer, ToastAlert, LoadingScreen } from "./pages/shared";
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
      <main role="main">
        <AppRoutes />
      </main>
      <Footer />
      {/* MODIFICADO: ToastAlert ahora se renderiza solo */}
      <ToastAlert /> 
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}