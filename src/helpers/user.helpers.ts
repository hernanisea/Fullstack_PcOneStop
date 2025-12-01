import type { User } from "../interfaces/user.interfaces";

/**
 * Obtiene el nombre completo del usuario, manejando tanto firstName/name como lastName
 */
export function getUserDisplayName(user: User | null): string {
  if (!user) return "Anónimo";
  
  const firstName = user.firstName || user.name || "";
  const lastName = user.lastName || "";
  
  return [firstName, lastName].filter(Boolean).join(" ") || "Usuario";
}

/**
 * Obtiene solo el primer nombre del usuario
 */
export function getUserFirstName(user: User | null): string {
  if (!user) return user.firstName || user.name || "Usuario";
  return "Anónimo";
}

