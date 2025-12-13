import { render, screen } from '@testing-library/react';
import { NavBar } from '../pages/shared/NavBar';
import * as AppContext from '../context/AppContext';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';

describe('NavBar Component', () => {
  
  it('Debería mostrar botón "Iniciar Sesión" cuando NO hay usuario (Invitado)', () => {
    vi.spyOn(AppContext, 'useApp').mockReturnValue({
      user: null,
      cart: [],
      products: [],
      addToCart: vi.fn(),
      setUser: vi.fn(),
      removeFromCart: vi.fn(),
      updateQty: vi.fn(),
      clearCart: vi.fn(),
      removeOutOfStockItems: vi.fn(),
      cartTotal: 0,
      toast: null,
      showToast: vi.fn(),
      hideToast: vi.fn(),
      isLoading: false,
      setIsLoading: vi.fn(),
      reloadProducts: vi.fn()
    });

    render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );

    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.queryByText('Cerrar Sesión')).toBeNull();
  });

  it('Debería mostrar botón "Cerrar Sesión" cuando SÍ hay usuario (Logueado)', () => {
    vi.spyOn(AppContext, 'useApp').mockReturnValue({
      user: { id: '1', name: 'Juan', firstName: 'Juan', lastName: 'Pérez', email: 'juan@mail.com', role: 'CLIENT' },
      cart: [],
      products: [],
      addToCart: vi.fn(),
      setUser: vi.fn(),
      removeFromCart: vi.fn(),
      updateQty: vi.fn(),
      clearCart: vi.fn(),
      removeOutOfStockItems: vi.fn(),
      cartTotal: 0,
      toast: null,
      showToast: vi.fn(),
      hideToast: vi.fn(),
      isLoading: false,
      setIsLoading: vi.fn(),
      reloadProducts: vi.fn()
    });

    render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );

    expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
    expect(screen.queryByText('Iniciar Sesión')).toBeNull();
  });
});