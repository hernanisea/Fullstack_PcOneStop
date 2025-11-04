// src/actions/register.actions.ts
import { db } from "../data/db.js";
import type { User } from "../interfaces/user.interfaces";

type RegisterResult = {
  user: User | null;
  error: string | null;
};

export const register = async (name: string, email: string, password: string): Promise<RegisterResult> => {
  // Simula latencia de red
  await new Promise(r => setTimeout(r, 700));

  const existingUser = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  // 1. Email ya existe
  if (existingUser) {
    return { user: null, error: "Este email ya está registrado." };
  }

  // 2. Crear nuevo usuario (Cliente por defecto)
  const newUser = {
    id: `user-client-${Date.now().toString().slice(-4)}`,
    name: name,
    email: email,
    password: password, // En un proyecto real, hashear la contraseña
    role: "CLIENT" as const, // Forzamos el tipo a "CLIENT"
  };

  // 3. Guardar en la BD mock
  db.users.push(newUser);

  // 4. Devolver el usuario (sin contraseña)
  const { password: _, ...userWithoutPassword } = newUser;
  
  return {
    user: userWithoutPassword as User,
    error: null
  };
};