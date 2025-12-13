// src/pages/register/RegisterPage.tsx
import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../actions/register.actions";

type ValidationErrors = {
  name?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export const RegisterPage = () => {
  const { setUser, setIsLoading } = useApp();
  const navigate = useNavigate();

  // Estados del formulario
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Estados de error
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // Función de validación del lado del cliente
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!name.trim()) {
      errors.name = "El nombre es obligatorio.";
    }
    if (!lastName.trim()) {
      errors.lastName = "El apellido es obligatorio.";
    }
    if (!email.trim()) {
      errors.email = "El email es obligatorio.";
    }
    if (!password) {
      errors.password = "La contraseña es obligatoria.";
    } else if (password.length < 3) {
      errors.password = "La contraseña debe tener al menos 3 caracteres."; // Mínimo para tu '123'
    }
    if (!confirmPassword) {
      errors.confirmPassword = "Debes confirmar la contraseña.";
    } else if (password && password !== confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // Devuelve true si no hay errores
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    
    // 1. Validar campos del cliente
    if (!validateForm()) {
      return;
    }

    // 2. Si la validación pasa, llamar a la acción
    setLoading(true);
    setIsLoading(true);

    try {
      const result = await register(name, lastName, email, password, "CLIENT");

      if (result.user) {
        setUser(result.user); // Autoiniciar sesión al registrarse
        navigate("/"); // Redirigir al inicio
      } else if (result.error) {
        // Error del "servidor" (ej. email duplicado)
        setServerError(result.error);
      }

    } catch (err) {
      setServerError("Ocurrió un error. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "550px" }}>
      <div className="card shadow-sm">
        <div className="card-body p-4 p-md-5">
          <h2 className="text-center mb-4">Crear Cuenta</h2>
          <form onSubmit={handleSubmit} noValidate>
            
            {serverError && (
              <div className="alert alert-danger small p-2">{serverError}</div>
            )}
            
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Nombre <span className="text-danger">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="firstName"
                autoComplete="given-name"
                className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
                value={name}
                onChange={(e) => {
                  if (validationErrors.name) setValidationErrors({});
                  setName(e.target.value);
                }}
                onBlur={() => validateForm()}
                placeholder="Ingresa tu nombre"
                aria-describedby={validationErrors.name ? "name-error" : "name-help"}
                aria-invalid={validationErrors.name ? "true" : "false"}
                required
                disabled={loading}
              />
              {validationErrors.name ? (
                <div id="name-error" className="invalid-feedback" role="alert">
                  {validationErrors.name}
                </div>
              ) : (
                <div id="name-help" className="form-text">
                  Ingresa tu nombre de pila
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">
                Apellido <span className="text-danger">*</span>
              </label>
              <input
                id="lastName"
                type="text"
                name="lastName"
                autoComplete="family-name"
                className={`form-control ${validationErrors.lastName ? 'is-invalid' : ''}`}
                value={lastName}
                onChange={(e) => {
                  if (validationErrors.lastName) setValidationErrors({});
                  setLastName(e.target.value);
                }}
                onBlur={() => validateForm()}
                placeholder="Ingresa tu apellido"
                aria-describedby={validationErrors.lastName ? "lastName-error" : "lastName-help"}
                aria-invalid={validationErrors.lastName ? "true" : "false"}
                required
                disabled={loading}
              />
              {validationErrors.lastName ? (
                <div id="lastName-error" className="invalid-feedback" role="alert">
                  {validationErrors.lastName}
                </div>
              ) : (
                <div id="lastName-help" className="form-text">
                  Ingresa tu apellido
                </div>
              )}
            </div>

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
                onChange={(e) => {
                  if (validationErrors.email) setValidationErrors({});
                  setEmail(e.target.value);
                }}
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
                autoComplete="new-password"
                className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                value={password}
                onChange={(e) => {
                  if (validationErrors.password) setValidationErrors({});
                  setPassword(e.target.value);
                }}
                onBlur={() => validateForm()}
                placeholder="Mínimo 3 caracteres"
                aria-describedby={validationErrors.password ? "password-error" : "password-help"}
                aria-invalid={validationErrors.password ? "true" : "false"}
                required
                minLength={3}
                disabled={loading}
              />
              {validationErrors.password ? (
                <div id="password-error" className="invalid-feedback" role="alert">
                  {validationErrors.password}
                </div>
              ) : (
                <div id="password-help" className="form-text">
                  La contraseña debe tener al menos 3 caracteres
                </div>
              )}
            </div>
            
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmar Contraseña <span className="text-danger">*</span>
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                className={`form-control ${validationErrors.confirmPassword ? 'is-invalid' : ''}`}
                value={confirmPassword}
                onChange={(e) => {
                  if (validationErrors.confirmPassword) setValidationErrors({});
                  setConfirmPassword(e.target.value);
                }}
                onBlur={() => validateForm()}
                placeholder="Confirma tu contraseña"
                aria-describedby={validationErrors.confirmPassword ? "confirmPassword-error" : "confirmPassword-help"}
                aria-invalid={validationErrors.confirmPassword ? "true" : "false"}
                required
                disabled={loading}
              />
              {validationErrors.confirmPassword ? (
                <div id="confirmPassword-error" className="invalid-feedback" role="alert">
                  {validationErrors.confirmPassword}
                </div>
              ) : (
                <div id="confirmPassword-help" className="form-text">
                  Ingresa nuevamente tu contraseña para confirmar
                </div>
              )}
            </div>
            
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? "Creando cuenta..." : "Registrarse"}
            </button>
            
            <div className="text-center mt-3">
              <Link to="/login" className="small">¿Ya tienes cuenta? Inicia sesión</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};