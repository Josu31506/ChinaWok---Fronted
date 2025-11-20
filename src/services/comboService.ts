import { ordersClient } from './apiClient';
import type { Combo, ApiResponse } from '../types';

// Flag para usar mock data o API real
const USE_MOCK_DATA = true;

/**
 * Mock combos para desarrollo
 */
const mockCombos: Combo[] = [
  {
    id: '1',
    name: 'Combo Personal Clásico',
    description: 'Arroz chaufa + pollo a la naranja + bebida',
    image: 'https://www.chinawok.com.pe/img/menu/promos/combo-personal.webp',
    price: 24.9,
    products: [
      { productId: '1', productName: 'Arroz Chaufa', quantity: 1 },
      { productId: '2', productName: 'Pollo a la Naranja', quantity: 1 },
      { productId: '3', productName: 'Bebida 500ml', quantity: 1 }
    ],
    isAvailable: true
  },
  {
    id: '2',
    name: 'Dúo Clásico al Wok',
    description: '2 platos de pollo con verduras + 2 bebidas',
    image: 'https://www.chinawok.com.pe/img/menu/promos/duo-clasico.webp',
    price: 54.9,
    discount: 45,
    products: [
      { productId: '4', productName: 'Pollo con Verduras', quantity: 2 },
      { productId: '5', productName: 'Bebida 500ml', quantity: 2 }
    ],
    isAvailable: true
  },
  {
    id: '3',
    name: 'Promo Familiar Deluxe',
    description: '4 platos + 4 bebidas + 8 wantanes',
    image: 'https://www.chinawok.com.pe/img/menu/promos/familiar-deluxe.webp',
    price: 89.9,
    discount: 30,
    products: [
      { productId: '6', productName: 'Plato a elegir', quantity: 4 },
      { productId: '7', productName: 'Bebida 500ml', quantity: 4 },
      { productId: '8', productName: 'Wantanes', quantity: 8 }
    ],
    isAvailable: true
  }
];

/**
 * Lista todos los combos disponibles
 */
export const listCombos = async (): Promise<Combo[]> => {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return mockCombos.filter((combo) => combo.isAvailable);
  }

  try {
    const response = await ordersClient.get<ApiResponse<Combo[]>>('/combos');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching combos:', error);
    throw error;
  }
};

/**
 * Obtiene un combo por ID
 */
export const getComboById = async (id: string): Promise<Combo | null> => {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const combo = mockCombos.find((c) => c.id === id);
    return combo || null;
  }

  try {
    const response = await ordersClient.get<ApiResponse<Combo>>(`/combos/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching combo:', error);
    throw error;
  }
};

/**
 * Lista combos por categoría o tipo
 */
export const listCombosByType = async (type: string): Promise<Combo[]> => {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Filtrar por precio como ejemplo (Personal < 30, Familiar > 50)
    if (type === 'personal') {
      return mockCombos.filter((combo) => combo.price < 30 && combo.isAvailable);
    } else if (type === 'familiar') {
      return mockCombos.filter((combo) => combo.price >= 50 && combo.isAvailable);
    }

    return mockCombos.filter((combo) => combo.isAvailable);
  }

  try {
    const response = await ordersClient.get<ApiResponse<Combo[]>>('/combos', {
      params: { type }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching combos by type:', error);
    throw error;
  }
};
