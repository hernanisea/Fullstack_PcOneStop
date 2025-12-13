/**
 * Utilidades para manejo de errores de la API
 */

export interface ErrorInfo {
  type: 'out_of_stock' | 'insufficient_stock' | 'unauthorized' | 'forbidden' | 'not_found' | 'validation_error' | 'generic';
  message: string;
  userFriendly: string;
  statusCode?: number;
}

/**
 * Maneja errores de la API y retorna información estructurada
 */
export function handleApiError(error: any, result?: any): ErrorInfo | null {
  // Si hay un resultado de la API, usarlo
  if (result && !result.ok) {
    const message = result.message || error?.message || 'Error desconocido';
    const statusCode = result.statusCode || error?.statusCode || 500;

    // Errores de stock
    if (message.includes('agotado') || message.includes('agotados') || message.includes('No hay unidades disponibles')) {
      return {
        type: 'out_of_stock',
        message: message,
        userFriendly: 'Uno o más productos están agotados. Por favor, elimínalos del carrito e intenta de nuevo.',
        statusCode: statusCode
      };
    }

    if (message.includes('Stock insuficiente') || message.includes('insuficiente')) {
      return {
        type: 'insufficient_stock',
        message: message,
        userFriendly: message, // El backend ya proporciona detalles claros
        statusCode: statusCode
      };
    }

    // Errores de autenticación
    if (statusCode === 401 || message.includes('Token inválido') || message.includes('expirado')) {
      return {
        type: 'unauthorized',
        message: message,
        userFriendly: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.',
        statusCode: statusCode
      };
    }

    if (statusCode === 403 || message.includes('no proporcionado') || message.includes('sin permisos')) {
      return {
        type: 'forbidden',
        message: message,
        userFriendly: 'No tienes permisos para realizar esta acción.',
        statusCode: statusCode
      };
    }

    // Error de recurso no encontrado
    if (statusCode === 404 || message.includes('no encontrado') || message.includes('not found')) {
      return {
        type: 'not_found',
        message: message,
        userFriendly: 'El recurso solicitado no fue encontrado.',
        statusCode: statusCode
      };
    }

    // Error de validación
    if (statusCode === 400 || message.includes('validación') || message.includes('inválido')) {
      return {
        type: 'validation_error',
        message: message,
        userFriendly: message || 'Los datos proporcionados no son válidos. Por favor, revísalos.',
        statusCode: statusCode
      };
    }

    // Error genérico
    return {
      type: 'generic',
      message: message,
      userFriendly: 'Ocurrió un error. Por favor, intenta de nuevo.',
      statusCode: statusCode
    };
  }

  // Si solo hay un error sin resultado
  if (error) {
    const message = error.message || error.originalMessage || 'Error desconocido';
    
    // Verificar si es un error de stock
    if (error.isStockError || error.type === 'OUT_OF_STOCK' || error.type === 'INSUFFICIENT_STOCK') {
      return {
        type: error.type === 'OUT_OF_STOCK' ? 'out_of_stock' : 'insufficient_stock',
        message: message,
        userFriendly: error.type === 'OUT_OF_STOCK' 
          ? 'Uno o más productos están agotados. Por favor, elimínalos del carrito.'
          : message,
        statusCode: error.statusCode || 400
      };
    }

    // Error de autenticación
    if (error.type === 'AUTH_ERROR' || error.statusCode === 401) {
      return {
        type: 'unauthorized',
        message: message,
        userFriendly: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.',
        statusCode: 401
      };
    }

    return {
      type: 'generic',
      message: message,
      userFriendly: 'Ocurrió un error. Por favor, intenta de nuevo.',
      statusCode: error.statusCode || 500
    };
  }

  return null;
}

/**
 * Muestra un error al usuario de forma amigable
 */
export function showErrorToUser(errorInfo: ErrorInfo, showToast?: (msg: string, type: 'success' | 'error') => void) {
  if (showToast) {
    showToast(errorInfo.userFriendly, 'error');
  } else {
    // Fallback si no hay función de toast
    alert(errorInfo.userFriendly);
  }
}

/**
 * Verifica si un error requiere redirección al login
 */
export function shouldRedirectToLogin(errorInfo: ErrorInfo): boolean {
  return errorInfo.type === 'unauthorized' || errorInfo.type === 'forbidden';
}

/**
 * Verifica si un error requiere actualizar el carrito
 */
export function shouldRefreshCart(errorInfo: ErrorInfo): boolean {
  return errorInfo.type === 'out_of_stock' || errorInfo.type === 'insufficient_stock';
}

