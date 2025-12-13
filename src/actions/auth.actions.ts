import type { User } from "../interfaces/user.interfaces";
import { API_CONFIG, type ApiResponse, type LoginResponse, setAuthToken, getAuthToken, getAuthHeaders, removeAuthToken } from "../config/api.config";

type Role = "ADMIN" | "CLIENT" | "CLIENTE";

type LoginResult = {
  user: User | null;
  error: string | null;
};

type ValidateSessionResult = {
  user: User | null;
  isValid: boolean;
};

export const login = async (email: string, password: string): Promise<LoginResult> => {
  try {
    // Crear un AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`${API_CONFIG.AUTH}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok && response.status === 0) {
      return { user: null, error: "No se pudo conectar con el servidor. Verifica que el backend esté corriendo." };
    }

    const data: ApiResponse<LoginResponse> = await response.json();

    if (data.ok && data.data) {
      // Guardar el token JWT
      if (data.data.token) {
        setAuthToken(data.data.token);
      }

      // Transformar el usuario del backend al formato del frontend
      const backendUser = data.data.user;
      const frontendUser: User = {
        id: backendUser.id?.toString() || String(backendUser.id),
        firstName: backendUser.firstName,
        name: backendUser.firstName || backendUser.name, // Compatibilidad
        lastName: backendUser.lastName || "",
        email: backendUser.email,
        role: backendUser.role === "CLIENTE" ? "CLIENT" : (backendUser.role as Role),
        phone: backendUser.phone,
      };
      return { user: frontendUser, error: null };
    }

    return { user: null, error: data.message || "Error al iniciar sesión" };
  } catch (error: any) {
    // Detectar errores de conexión
    if (error.name === 'AbortError' || error.message?.includes('Failed to fetch') || error.message?.includes('ERR_CONNECTION_REFUSED')) {
      return { user: null, error: "No se pudo conectar con el servidor. Verifica que el backend esté corriendo en el puerto 8081." };
    }
    return { user: null, error: error instanceof Error ? error.message : "Error desconocido" };
  }
};

/**
 * Valida la sesión del usuario desde el token JWT almacenado
 * Restaura el usuario si el token es válido
 * IE3.3.2 - Mantiene la sesión activa incluso después de recargar la página
 */
export const validateSession = async (): Promise<ValidateSessionResult> => {
  const token = getAuthToken();
  
  if (!token) {
    return { user: null, isValid: false };
  }

  try {
    // Intentar validar el token con el backend
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${API_CONFIG.AUTH}/validate`, {
      method: 'GET',
      headers: getAuthHeaders(),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (response.ok) {
      const data: ApiResponse<any> = await response.json();
      
      if (data.ok && data.data) {
        const backendUser = data.data;
        const frontendUser: User = {
          id: backendUser.id?.toString() || String(backendUser.id),
          firstName: backendUser.firstName,
          name: backendUser.firstName || backendUser.name,
          lastName: backendUser.lastName || "",
          email: backendUser.email,
          role: backendUser.role === "CLIENTE" ? "CLIENT" : (backendUser.role as Role),
          phone: backendUser.phone,
        };
        return { user: frontendUser, isValid: true };
      }
    }

    // Si el token no es válido, limpiarlo
    if (response.status === 401 || response.status === 403) {
      removeAuthToken();
      return { user: null, isValid: false };
    }

    // Si no hay endpoint de validación, intentar decodificar el token básico
    // (fallback si el backend no tiene endpoint /validate)
    return decodeTokenAndRestoreUser(token);
  } catch (error: any) {
    // Si hay error de conexión, intentar decodificar el token localmente
    if (error.name === 'AbortError' || error.message?.includes('Failed to fetch')) {
      return decodeTokenAndRestoreUser(token);
    }
    removeAuthToken();
    return { user: null, isValid: false };
  }
};

/**
 * Decodifica el token JWT y restaura el usuario (fallback)
 * Nota: Esta es una solución temporal. Lo ideal es validar con el backend
 */
const decodeTokenAndRestoreUser = (token: string): ValidateSessionResult => {
  try {
    // Decodificar el payload del JWT (sin verificar la firma)
    const parts = token.split('.');
    if (parts.length !== 3) {
      removeAuthToken();
      return { user: null, isValid: false };
    }

    const payload = JSON.parse(atob(parts[1]));
    
    // Verificar si el token ha expirado
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      removeAuthToken();
      return { user: null, isValid: false };
    }

    // Restaurar usuario desde el payload del token
    if (payload.sub || payload.email) {
      const user: User = {
        id: payload.id || payload.sub || '',
        firstName: payload.firstName || payload.name || '',
        name: payload.firstName || payload.name || '',
        lastName: payload.lastName || '',
        email: payload.email || '',
        role: payload.role === "CLIENTE" ? "CLIENT" : (payload.role as Role) || "CLIENT",
        phone: payload.phone,
      };
      return { user, isValid: true };
    }

    return { user: null, isValid: false };
  } catch (error) {
    removeAuthToken();
    return { user: null, isValid: false };
  }
};

/**
 * Cierra la sesión del usuario
 */
export const logout = (): void => {
  removeAuthToken();
};