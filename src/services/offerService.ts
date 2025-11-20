import { ordersClient } from './apiClient';
import type { Offer, ApiResponse } from '../types';

// Flag para usar mock data o API real
const USE_MOCK_DATA = true;

/**
 * Mock offers para desarrollo
 */
const mockOffers: Offer[] = [
  {
    id: '1',
    title: 'Promo Dúo Sopa al Wok',
    description: '2 sopas orientales + wantanes crujientes',
    image: 'https://www.chinawok.com.pe/img/menu/promos/duo-sopa.webp',
    discountPercentage: 25,
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    products: ['1', '2'],
    isActive: true
  },
  {
    id: '2',
    title: 'Cyber para Compartir',
    description: '2 platos + wantanes + bebida 1.5L',
    image: 'https://www.chinawok.com.pe/img/menu/promos/cyber-compartir.webp',
    discountPercentage: 40,
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    products: ['3', '4'],
    isActive: true
  }
];

/**
 * Lista todas las ofertas activas
 */
export const listOffers = async (): Promise<Offer[]> => {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const now = new Date();
    return mockOffers.filter((offer) => {
      const validFrom = new Date(offer.validFrom);
      const validUntil = new Date(offer.validUntil);
      return offer.isActive && now >= validFrom && now <= validUntil;
    });
  }

  try {
    const response = await ordersClient.get<ApiResponse<Offer[]>>('/offers');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching offers:', error);
    throw error;
  }
};

/**
 * Obtiene una oferta por ID
 */
export const getOfferById = async (id: string): Promise<Offer | null> => {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const offer = mockOffers.find((o) => o.id === id);
    return offer || null;
  }

  try {
    const response = await ordersClient.get<ApiResponse<Offer>>(`/offers/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching offer:', error);
    throw error;
  }
};

/**
 * Lista ofertas activas para un producto específico
 */
export const getOffersForProduct = async (productId: string): Promise<Offer[]> => {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const now = new Date();
    return mockOffers.filter((offer) => {
      const validFrom = new Date(offer.validFrom);
      const validUntil = new Date(offer.validUntil);
      return (
        offer.isActive &&
        offer.products.includes(productId) &&
        now >= validFrom &&
        now <= validUntil
      );
    });
  }

  try {
    const response = await ordersClient.get<ApiResponse<Offer[]>>(
      `/offers/product/${productId}`
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching offers for product:', error);
    throw error;
  }
};
