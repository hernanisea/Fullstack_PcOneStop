import type { User } from "../interfaces/user.interfaces";

type RegisterResult = {
  user: User | null;
  error: string | null;
};

export const register = async (name: string, lastName: string, email: string, password: string): Promise<RegisterResult> => {
  try {
    const response = await fetch('http://localhost:8081/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, lastName, email, password, role: 'CLIENT' })
    });

    const data = await response.json();

    if (!response.ok) {
      return { user: null, error: data.message || `Error ${response.status}: Error al registrar usuario` };
    }

    if (data.success && data.data) {
      return { user: data.data, error: null };
    }

    return { user: null, error: data.message || "Error al registrar usuario" };
  } catch (error) {
    return { user: null, error: error instanceof Error ? error.message : "Error desconocido" };
  }
};