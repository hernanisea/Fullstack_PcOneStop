// src/pages/shared/ToastAlert.tsx
import { useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";

export const ToastAlert = () => {
  const { toast, hideToast } = useApp();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!toast || !ref.current) return;
    
    const el = ref.current;
    el.classList.add("show"); // Muestra el toast
    
    // Timer para ocultarlo
    const timer = setTimeout(() => {
      el.classList.remove("show");
      // Damos tiempo a la animación de 'fade out' (0.3s)
      setTimeout(() => {
        hideToast();
      }, 300);
    }, 2500); // 2.5 segundos visible
    
    return () => clearTimeout(timer);
  }, [toast, hideToast]); // Depende del objeto 'toast'

  if (!toast) {
    return null; // No renderiza nada si no hay toast
  }

  // Define icono y clase basado en el tipo
  const isError = toast.type === 'error';
  const icon = isError ? "" : ""; // Error o Carrito
  const typeClass = isError ? 'error' : 'success';

  return (
    <div ref={ref} className="toast-alert position-fixed top-0 end-0 m-4">
      {/* Añadimos la clase 'error' o 'success' */}
      <div className={`toast-content ${typeClass}`}>
        <span>{icon} {toast.message}</span>
      </div>
    </div>
  );
};