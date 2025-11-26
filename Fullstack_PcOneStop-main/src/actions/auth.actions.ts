// src/actions/auth.actions.ts
import { db } from "../data/db.js";
import type { User } from "../interfaces/user.interfaces";

// Definimos un tipo para la respuesta
type LoginResult = {
  user: User | null;
  error: string | null;
};

/**
 * Simula un inicio de sesión buscando en la base de datos mock.
 */
export const login = async (email: string, password: string): Promise<LoginResult> => {
  // Simula latencia de red
  await new Promise(r => setTimeout(r, 500));
  
  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  // --- LÓGICA DE ERROR MEJORADA ---

  // 1. Email no encontrado
  // Aquí es donde generamos el mensaje que pides.
  if (!user) {
    return { user: null, error: "El email ingresado no existe." };
  }

  // 2. Contraseña incorrecta
  if (user.password !== password) {
    return { user: null, error: "Contraseña incorrecta." };
  }
  
  // 3. Éxito
  // Devolvemos el usuario sin la contraseña por seguridad
  const { password: _, ...userWithoutPassword } = user;
  
  return {
    user: userWithoutPassword as User,
    error: null
  };
};