import type { CartItem } from "../interfaces/user.interfaces";

// El carrito ahora solo existe en memoria (en el contexto)
// No se guarda en localStorage ni en la base de datos
// Se crea una orden cuando el usuario hace checkout
export async function getCart(): Promise<CartItem[]> {
  // Retornar array vacío ya que el carrito se maneja en el contexto
  return Promise.resolve([]);
}
