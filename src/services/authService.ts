/**
 * Servicio de Autenticación
 * Maneja login, registro, validación de sesión y logout
 */

import type { User } from "../interfaces/user.interfaces";
import { API_CONFIG, type ApiResponse, getAuthToken, setAuthToken, removeAuthToken, getAuthHeaders } from "../config/api.config";

type Role = "ADMIN" | "CLIENT" | "CLIENTE";

interface LoginResponse {
  user: any;
  token: string;
}

/**
 * Valida la sesión del usuario desde el token JWT almacenado
 * Permite restaurar la sesión sin hacer login de nuevo
 */
export async function validateSession(): Promise<User | null> {
  const token = getAuthToken();

  if (!token) {
    return null; // No hay token, usuario no autenticado
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${API_CONFIG.AUTH}/validate`, {
      method: 'GET',
      headers: getAuthHeaders(),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const result: ApiResponse<any> = await response.json();

    if (result.ok && result.data) {
      // Token válido, transformar y retornar datos del usuario
      const backendUser = result.data;
      const frontendUser: User = {
        id: backendUser.id?.toString() || String(backendUser.id),
        firstName: backendUser.firstName,
        name: backendUser.firstName || backendUser.name,
        lastName: backendUser.lastName || "",
        email: backendUser.email,
        role: backendUser.role === "CLIENTE" ? "CLIENT" : (backendUser.role as Role),
        phone: backendUser.phone,
      };
      return frontendUser;
    } else {
      // Token inválido o expirado
      removeAuthToken();
      return null;
    }
  } catch (error) {
    console.error('Error al validar sesión:', error);
    // En caso de error, limpiar token por seguridad
    removeAuthToken();
    return null;
  }
}

/**
 * Inicia sesión con email y contraseña
 */
export async function login(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  try {
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
        name: backendUser.firstName || backendUser.name,
        lastName: backendUser.lastName || "",
        email: backendUser.email,
        role: backendUser.role === "CLIENTE" ? "CLIENT" : (backendUser.role as Role),
        phone: backendUser.phone,
      };
      return { user: frontendUser, error: null };
    }

    return { user: null, error: data.message || "Error al iniciar sesión" };
  } catch (error: any) {
    if (error.name === 'AbortError' || error.message?.includes('Failed to fetch')) {
      return { user: null, error: "No se pudo conectar con el servidor. Verifica que el backend esté corriendo en el puerto 8081." };
    }
    return { user: null, error: error instanceof Error ? error.message : "Error desconocido" };
  }
}

/**
 * Registra un nuevo usuario
 */
export async function register(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: "ADMIN" | "CLIENT" = "CLIENT"
): Promise<{ user: User | null; error: string | null }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const backendRole = role === "CLIENT" ? "CLIENTE" : role;

    const response = await fetch(`${API_CONFIG.AUTH}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName,
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
        name: backendUser.firstName || backendUser.name,
        lastName: backendUser.lastName || "",
        email: backendUser.email,
        role: backendUser.role === "CLIENTE" ? "CLIENT" : (backendUser.role as Role),
        phone: backendUser.phone,
      };
      return { user: frontendUser, error: null };
    }

    return { user: null, error: data.message || "Error al registrar usuario" };
  } catch (error: any) {
    if (error.name === 'AbortError' || error.message?.includes('Failed to fetch')) {
      return { user: null, error: "No se pudo conectar con el servidor. Verifica que el backend esté corriendo en el puerto 8081." };
    }
    return { user: null, error: error instanceof Error ? error.message : "Error desconocido" };
  }
}

/**
 * Cierra la sesión del usuario
 */
export function logout(): void {
  removeAuthToken();
}

