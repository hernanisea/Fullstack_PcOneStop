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
      const result = await register(name, lastName, email, password);

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
              <label className="form-label">Nombre</label>
              <input
                type="text"
                className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
              {validationErrors.name && (
                <div className="invalid-feedback">{validationErrors.name}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Apellido</label>
              <input
                type="text"
                className={`form-control ${validationErrors.lastName ? 'is-invalid' : ''}`}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading}
              />
              {validationErrors.lastName && (
                <div className="invalid-feedback">{validationErrors.lastName}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
              {validationErrors.email && (
                <div className="invalid-feedback">{validationErrors.email}</div>
              )}
            </div>
            
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              {validationErrors.password && (
                <div className="invalid-feedback">{validationErrors.password}</div>
              )}
            </div>
            
            <div className="mb-3">
              <label className="form-label">Confirmar Contraseña</label>
              <input
                type="password"
                className={`form-control ${validationErrors.confirmPassword ? 'is-invalid' : ''}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              {validationErrors.confirmPassword && (
                <div className="invalid-feedback">{validationErrors.confirmPassword}</div>
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