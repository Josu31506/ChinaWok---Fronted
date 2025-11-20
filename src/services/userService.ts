import { usersClient } from './apiClient';
import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ApiResponse
} from '../types';

// Flag para usar mock data o API real
const USE_MOCK_DATA = true;

/**
 * Mock user para desarrollo
 */
const mockUser: User = {
  id: '1',
  email: 'usuario@chinawok.com',
  firstName: 'Juan',
  lastName: 'Pérez',
  phone: '987654321',
  role: 'cliente',
  address: {
    street: 'Av. Larco 123',
    district: 'Miraflores',
    city: 'Lima',
    reference: 'Frente al parque'
  }
};

/**
 * Registra un nuevo usuario
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      role: 'cliente'
    };

    const token = 'mock-token-' + Math.random().toString(36).substr(2, 9);

    // Guardar en localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(newUser));

    return { user: newUser, token };
  }

  try {
    const response = await usersClient.post<ApiResponse<AuthResponse>>('/register', data);

    // Guardar token y usuario
    localStorage.setItem('authToken', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));

    return response.data.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

/**
 * Inicia sesión
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Validación simple para mock
    if (credentials.email && credentials.password) {
      const token = 'mock-token-' + Math.random().toString(36).substr(2, 9);

      // Guardar en localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(mockUser));

      return { user: mockUser, token };
    }

    throw new Error('Credenciales inválidas');
  }

  try {
    const response = await usersClient.post<ApiResponse<AuthResponse>>('/login', credentials);

    // Guardar token y usuario
    localStorage.setItem('authToken', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));

    return response.data.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

/**
 * Cierra sesión
 */
export const logout = async (): Promise<void> => {
  // Limpiar localStorage
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');

  if (!USE_MOCK_DATA) {
    try {
      await usersClient.post('/logout');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
};

/**
 * Obtiene el usuario actual desde localStorage
 */
export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * Verifica si el usuario está autenticado
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('authToken');
};

/**
 * Obtiene el perfil del usuario desde la API
 */
export const getUserProfile = async (userId: string): Promise<User> => {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockUser;
  }

  try {
    const response = await usersClient.get<ApiResponse<User>>(`/users/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

/**
 * Actualiza el perfil del usuario
 */
export const updateUserProfile = async (
  userId: string,
  data: Partial<User>
): Promise<User> => {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const updatedUser = { ...mockUser, ...data };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    return updatedUser;
  }

  try {
    const response = await usersClient.put<ApiResponse<User>>(`/users/${userId}`, data);

    // Actualizar usuario en localStorage
    localStorage.setItem('user', JSON.stringify(response.data.data));

    return response.data.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};
