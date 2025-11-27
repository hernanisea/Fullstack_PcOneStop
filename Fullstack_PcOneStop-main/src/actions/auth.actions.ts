// src/actions/auth.actions.ts
import { apiClient } from "../services/api.client";
import { API_CONFIG } from "../config/api.config";
import type { User } from "../interfaces/user.interfaces";

// Definimos un tipo para la respuesta
type LoginResult = {
  user: User | null;
  error: string | null;
};

/**
 * Inicia sesión usando el microservicio de Usuarios
 */
export const login = async (email: string, password: string): Promise<LoginResult> => {
  try {
    const response = await apiClient.post<User>(
      `${API_CONFIG.USERS.baseURL}${API_CONFIG.USERS.endpoints.login}`,
      { email, password }
    );

    if (response.data) {
      // El backend devuelve el usuario sin contraseña
      return {
        user: response.data,
        error: null
      };
    }

    return {
      user: null,
      error: response.message || "Error al iniciar sesión"
    };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : "Error desconocido al iniciar sesión"
    };
  }
};