import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterPage } from '../pages/register/RegisterPage';
import * as RegisterActions from '../actions/register.actions';
import * as AppContext from '../context/AppContext';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock useNavigate antes de importar el componente
const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe('RegisterPage Component', () => {
  let registerSpy: any;
  let setUserMock: any;

  beforeEach(() => {
    setUserMock = vi.fn();
    navigateMock.mockClear();
    
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

    registerSpy = vi.spyOn(RegisterActions, 'register').mockResolvedValue({ 
      user: { 
        id: '1', 
        name: 'Test', 
        firstName: 'Test', 
        lastName: 'User', 
        email: 'test@mail.com', 
        role: 'CLIENT' 
      }, 
      error: null 
    });
  });

  it('IE1.3.1 - Debería mostrar mensajes de error de validación cuando los campos están vacíos', async () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const submitButton = screen.getByText('Registrarse');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/El nombre es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/El apellido es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/El email es obligatorio/i)).toBeInTheDocument();
    });
  });

  it('IE1.3.1 - Debería validar que las contraseñas coincidan', async () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const passwordInput = screen.getByPlaceholderText(/Mínimo 3 caracteres/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/Confirma tu contraseña/i);
    const submitButton = screen.getByText('Registrarse');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password456' } });
    fireEvent.click(submitButton);

    expect(screen.getByText(/Las contraseñas no coinciden/i)).toBeInTheDocument();
  });

  it('IE1.3.1 - Debería validar la longitud mínima de la contraseña', async () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const passwordInput = screen.getByPlaceholderText(/Mínimo 3 caracteres/i);
    fireEvent.change(passwordInput, { target: { value: '12' } });
    fireEvent.blur(passwordInput);

    await waitFor(() => {
      expect(screen.getByText(/La contraseña debe tener al menos 3 caracteres/i)).toBeInTheDocument();
    });
  });

  it('IE2.1.4 - Debería actualizar el estado local al escribir en los inputs', () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText(/Nombre/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: 'Juan' } });
    fireEvent.change(emailInput, { target: { value: 'juan@test.com' } });

    expect(nameInput.value).toBe('Juan');
    expect(emailInput.value).toBe('juan@test.com');
  });

  it('IE2.3.1 - Debería llamar a la acción de registro al enviar el formulario válido', async () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByLabelText(/Apellido/i), { target: { value: 'Pérez' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'juan@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Mínimo 3 caracteres/i), { target: { value: '123' } });
    fireEvent.change(screen.getByPlaceholderText(/Confirma tu contraseña/i), { target: { value: '123' } });
    
    fireEvent.click(screen.getByText('Registrarse'));

    await waitFor(() => {
      expect(registerSpy).toHaveBeenCalledWith('Juan', 'Pérez', 'juan@test.com', '123', 'CLIENT');
    });
  });

  it('IE1.3.1 - Debería mostrar atributos HTML5 correctos en los inputs', () => {
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Mínimo 3 caracteres/i);

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('autoComplete', 'email');
    expect(emailInput).toHaveAttribute('required');
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('autoComplete', 'new-password');
    expect(passwordInput).toHaveAttribute('required');
  });
});

