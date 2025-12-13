/**
 * Helpers para validación y manejo de stock
 */

/**
 * Verifica si un producto está agotado
 */
export function isOutOfStock(stock: number): boolean {
  return stock <= 0;
}

/**
 * Verifica si un producto tiene stock bajo (5 o menos unidades)
 */
export function isLowStock(stock: number): boolean {
  return stock > 0 && stock <= 5;
}

/**
 * Obtiene el mensaje de stock para mostrar al usuario
 */
export function getStockMessage(stock: number): string {
  if (isOutOfStock(stock)) {
    return "Agotado";
  }
  if (isLowStock(stock)) {
    return `Últimas ${stock} unidades`;
  }
  return "En stock";
}

/**
 * Obtiene la clase CSS para el badge de stock
 */
export function getStockBadgeClass(stock: number): string {
  if (isOutOfStock(stock)) {
    return "bg-danger";
  }
  if (isLowStock(stock)) {
    return "bg-warning";
  }
  return "bg-success";
}

/**
 * Verifica si un error es relacionado con stock
 */
export function isStockError(error: any): boolean {
  if (!error) return false;
  
  const message = error.message || error.originalMessage || "";
  const lowerMessage = message.toLowerCase();
  
  return (
    error.isStockError === true ||
    error.type === 'OUT_OF_STOCK' ||
    error.type === 'INSUFFICIENT_STOCK' ||
    lowerMessage.includes('agotado') ||
    lowerMessage.includes('agotados') ||
    lowerMessage.includes('stock insuficiente') ||
    lowerMessage.includes('no hay unidades disponibles')
  );
}

/**
 * Extrae el mensaje de error de stock del backend
 */
export function extractStockErrorMessage(error: any): string {
  if (!error) return "Error desconocido";
  
  const message = error.originalMessage || error.message || "";
  
  // Si el mensaje contiene información específica del backend, usarla
  if (message.includes('Producto agotado') || message.includes('agotados')) {
    return "Uno o más productos están agotados. Por favor, elimínalos del carrito.";
  }
  
  if (message.includes('Stock insuficiente')) {
    return message; // El backend ya proporciona detalles
  }
  
  if (error.type === 'OUT_OF_STOCK') {
    return "Uno o más productos están agotados. No hay unidades disponibles.";
  }
  
  if (error.type === 'INSUFFICIENT_STOCK') {
    return "No hay suficiente stock para uno o más productos. Por favor, ajusta las cantidades.";
  }
  
  return message || "Error de stock desconocido";
}

