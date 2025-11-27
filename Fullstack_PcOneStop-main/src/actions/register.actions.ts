// src/actions/register.actions.ts
import { apiClient } from "../services/api.client";
import { API_CONFIG } from "../config/api.config";
import type { User } from "../interfaces/user.interfaces";

type RegisterResult = {
  user: User | null;
  error: string | null;
};

export const register = async (name: string, email: string, password: string): Promise<RegisterResult> => {
  try {
    // El backend espera un objeto User completo
    const userData = {
      name,
      email,
      password,
      role: "CLIENT" as const
    };

    const response = await apiClient.post<User>(
      `${API_CONFIG.USERS.baseURL}${API_CONFIG.USERS.endpoints.register}`,
      userData
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
      error: response.message || "Error al registrar usuario"
    };
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : "Error desconocido al registrar usuario"
    };
  }
};