import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginPage } from '../pages/login/LoginPage';
import * as AuthActions from '../actions/auth.actions';
import * as AppContext from '../context/AppContext';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('LoginPage Component', () => {
  let loginSpy: any;
  let setUserMock: any;

  beforeEach(() => {
    setUserMock = vi.fn();
    vi.spyOn(AppContext, 'useApp').mockReturnValue({
      setUser: setUserMock,
      setIsLoading: vi.fn(),
      showToast: vi.fn(),
      user: null,
      cart: [],
      products: [],
      addToCart: vi.fn(),
      removeFromCart: vi.fn(),
      updateQty: vi.fn(),
      clearCart: vi.fn(),
      removeOutOfStockItems: vi.fn(),
      cartTotal: 0,
      toast: null,
      hideToast: vi.fn(),
      isLoading: false,
      reloadProducts: vi.fn()
    });

    loginSpy = vi.spyOn(AuthActions, 'login').mockResolvedValue({ 
        user: { id: '1', name: 'Test', firstName: 'Test', lastName: 'User', email: 'test@mail.com', role: 'CLIENT' }, 
        error: null 
    });
  });

  it('IE2.1.4 - Debería actualizar el estado local al escribir en los inputs', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'test@mail.com' } });
    expect(emailInput.value).toBe('test@mail.com');
  });

  it('IE2.3.1 - Debería llamar a la acción de login al enviar el formulario', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'admin@pconestop.com' } });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), { target: { value: '123' } });
    fireEvent.click(screen.getByText('Ingresar'));

    await waitFor(() => {
      expect(loginSpy).toHaveBeenCalledWith('admin@pconestop.com', '123');
    });
  });

  it('IE1.3.1 - Debería mostrar mensajes de error de validación cuando los campos están vacíos', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const submitButton = screen.getByText('Ingresar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/El email es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/La contraseña es obligatoria/i)).toBeInTheDocument();
    });
  });

  it('IE1.3.1 - Debería mostrar atributos HTML5 correctos en los inputs', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('autoComplete', 'email');
    expect(emailInput).toHaveAttribute('required');
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('autoComplete', 'current-password');
    expect(passwordInput).toHaveAttribute('required');
  });

  it('IE2.1.2 - Debería limpiar errores de validación al escribir en los campos', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const submitButton = screen.getByText('Ingresar');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/El email es obligatorio/i)).toBeInTheDocument();
    });

    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, { target: { value: 'test@mail.com' } });

    await waitFor(() => {
      expect(screen.queryByText(/El email es obligatorio/i)).not.toBeInTheDocument();
    });
  });
});