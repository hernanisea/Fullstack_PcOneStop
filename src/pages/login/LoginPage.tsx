// src/pages/login/LoginPage.tsx
import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../actions/auth.actions";

type ValidationErrors = {
  email?: string;
  password?: string;
};

export const LoginPage = () => {
  // --- 1. Obtenemos showToast ---
  const { setUser, setIsLoading, showToast } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  // const [serverError, setServerError] = useState(""); // <-- YA NO SE USA
  const [loading, setLoading] = useState(false);

  // Funciones onChange que limpian los errores de validación
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (validationErrors.email) setValidationErrors({});
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (validationErrors.password) setValidationErrors({});
    setPassword(e.target.value);
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    if (!email.trim()) {
      errors.email = "El email es obligatorio.";
    }
    if (!password) {
      errors.password = "La contraseña es obligatoria.";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setIsLoading(true); // Loader global

    try {
      const result = await login(email, password);

      if (result.user) {
        setUser(result.user);
        // Opcional: Damos la bienvenida
        const userName = result.user.firstName || result.user.name || "Usuario";
        showToast(`Bienvenido, ${userName}!`, 'success'); 
        if (result.user.role === "ADMIN") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else if (result.error) {
        // --- 2. AQUÍ ESTÁ LA SOLUCIÓN ---
        // Usamos el Toast global de error
        showToast(result.error, 'error'); 
      }
      
    } catch (err) {
      console.error(err);
      showToast("Ocurrió un error inesperado.", 'error'); // Error genérico
    } finally {
      setLoading(false);
      setIsLoading(false); // Apaga el loader global
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "450px" }}>
      <div className="card shadow-sm">
        <div className="card-body p-4 p-md-5">
          <h2 className="text-center mb-4">Iniciar Sesión</h2>
          <form onSubmit={handleSubmit} noValidate>
            
            {/* --- 3. ELIMINAMOS EL ALERT ROJO DE AQUÍ --- */}
            
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email <span className="text-danger">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                value={email}
                onChange={handleEmailChange}
                onBlur={() => validateForm()}
                placeholder="ejemplo@correo.com"
                aria-describedby={validationErrors.email ? "email-error" : "email-help"}
                aria-invalid={validationErrors.email ? "true" : "false"}
                required
                disabled={loading}
              />
              {validationErrors.email ? (
                <div id="email-error" className="invalid-feedback" role="alert">
                  {validationErrors.email}
                </div>
              ) : (
                <div id="email-help" className="form-text">
                  Ingresa tu dirección de correo electrónico
                </div>
              )}
            </div>
            
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Contraseña <span className="text-danger">*</span>
              </label>
              <input
                id="password"
                type="password"
                name="password"
                autoComplete="current-password"
                className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => validateForm()}
                placeholder="Ingresa tu contraseña"
                aria-describedby={validationErrors.password ? "password-error" : "password-help"}
                aria-invalid={validationErrors.password ? "true" : "false"}
                required
                disabled={loading}
              />
              {validationErrors.password ? (
                <div id="password-error" className="invalid-feedback" role="alert">
                  {validationErrors.password}
                </div>
              ) : (
                <div id="password-help" className="form-text">
                  Ingresa tu contraseña de acceso
                </div>
              )}
            </div>
            
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
            
            <div className="text-center mt-3">
              <Link to="/register" className="small">¿No tienes cuenta? Regístrate</Link>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};