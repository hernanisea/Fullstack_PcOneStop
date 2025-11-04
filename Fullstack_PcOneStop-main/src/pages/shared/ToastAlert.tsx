import { useEffect, useRef } from "react";

type Props = {
  message: string;
  show: boolean;
  onClose: () => void;
};

export const ToastAlert = ({ message, show, onClose }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  // Cuando cambia show, iniciamos la animación
  useEffect(() => {
    if (!show || !ref.current) return;
    const el = ref.current;
    el.classList.add("show");
    const timer = setTimeout(() => {
      el.classList.remove("show");
      onClose();
    }, 2500);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  return (
    <div ref={ref} className="toast-alert position-fixed bottom-0 end-0 m-4">
      <div className="toast-content">
        <span>🛒 {message}</span>
      </div>
    </div>
  );
};
