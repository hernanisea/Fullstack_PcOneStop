import type { User } from "../interfaces/user.interfaces";

type LoginResult = {
  user: User | null;
  error: string | null;
};

export const login = async (email: string, password: string): Promise<LoginResult> => {
  try {
    const response = await fetch('http://localhost:8081/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success && data.data) {
      return { user: data.data, error: null };
    }

    return { user: null, error: data.message || "Error al iniciar sesión" };
  } catch (error) {
    return { user: null, error: error instanceof Error ? error.message : "Error desconocido" };
  }
};