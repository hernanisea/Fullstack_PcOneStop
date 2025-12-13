import type { User } from "../interfaces/user.interfaces";
import { API_CONFIG, type ApiResponse, type LoginResponse, setAuthToken } from "../config/api.config";

type Role = "ADMIN" | "CLIENT" | "CLIENTE";

type RegisterResult = {
  user: User | null;
  error: string | null;
};

export const register = async (
  name: string,
  lastName: string,
  email: string,
  password: string,
  role: "ADMIN" | "CLIENT" = "CLIENT"
): Promise<RegisterResult> => {
  try {
    // El backend espera firstName, no name
    const backendRole = role === "CLIENT" ? "CLIENTE" : role;
    // Crear un AbortController para timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`${API_CONFIG.AUTH}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        firstName: name, 
        lastName, 
        email, 
        password, 
        role: backendRole 
      }),
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

    return { user: null, error: data.message || "Error al registrar usuario" };
  } catch (error: any) {
    // Detectar errores de conexión
    if (error.name === 'AbortError' || error.message?.includes('Failed to fetch') || error.message?.includes('ERR_CONNECTION_REFUSED')) {
      return { user: null, error: "No se pudo conectar con el servidor. Verifica que el backend esté corriendo en el puerto 8081." };
    }
    return { user: null, error: error instanceof Error ? error.message : "Error desconocido" };
  }
};