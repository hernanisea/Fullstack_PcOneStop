import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { validateSession, logout } from '../actions/auth.actions';
import { getAuthToken, setAuthToken, removeAuthToken } from '../config/api.config';

// Mock fetch
global.fetch = vi.fn();

describe('Auth Actions - Session Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    removeAuthToken();
  });

  afterEach(() => {
    removeAuthToken();
  });

  it('IE3.3.2 - validateSession debería retornar usuario null si no hay token', async () => {
    const result = await validateSession();
    expect(result.user).toBeNull();
    expect(result.isValid).toBe(false);
  });

  it('IE3.3.2 - validateSession debería validar token con el backend', async () => {
    const mockToken = 'valid.token.here';
    setAuthToken(mockToken);

    const mockUser = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@mail.com',
      role: 'CLIENT',
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ok: true,
        data: mockUser,
      }),
    });

    const result = await validateSession();
    expect(result.isValid).toBe(true);
    expect(result.user).toBeTruthy();
    expect(result.user?.email).toBe('test@mail.com');
  });

  it('IE3.3.2 - validateSession debería limpiar token si es inválido (401)', async () => {
    const mockToken = 'invalid.token.here';
    setAuthToken(mockToken);

    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    const result = await validateSession();
    expect(result.isValid).toBe(false);
    expect(result.user).toBeNull();
    expect(getAuthToken()).toBeNull();
  });

  it('IE3.3.2 - logout debería eliminar el token', () => {
    setAuthToken('some.token');
    expect(getAuthToken()).toBeTruthy();
    
    logout();
    expect(getAuthToken()).toBeNull();
  });
});

