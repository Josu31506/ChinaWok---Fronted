import { ordersClient } from './apiClient';
import { products as mockProducts } from '../data/products';
import type { Product as MockProduct } from '../data/products';
import type { Product, ProductFilters, ApiResponse } from '../types';

// Flag para usar mock data o API real
// Cambia a false cuando tengas la API desplegada
const USE_MOCK_DATA = true;

/**
 * Convierte producto mock al formato de la API
 */
const convertMockProduct = (mockProduct: MockProduct): Product => ({
  id: mockProduct.id.toString(),
  name: mockProduct.title,
  description: mockProduct.description,
  price: mockProduct.price,
  category: mockProduct.category as any,
  image: mockProduct.image,
  discount: mockProduct.discount,
  isAvailable: true,
  isNew: false
});

/**
 * Lista todos los productos con filtros opcionales
 */
export const listProducts = async (category?: MockProduct['category']): Promise<Product[]> => {
  if (USE_MOCK_DATA) {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 300));

    let filteredProducts = mockProducts;

    if (category && category !== 'Para compartir') {
      filteredProducts = mockProducts.filter((product) => product.category === category);
    }

    return filteredProducts.map(convertMockProduct);
  }

  try {
    // Llamada real a la API cuando esté disponible
    const params: ProductFilters = {};
    if (category && category !== 'Para compartir') {
      params.category = category as any;
    }

    const response = await ordersClient.get<ApiResponse<Product[]>>('/products', { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Obtiene un producto por ID
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const mockProduct = mockProducts.find((p) => p.id.toString() === id);
    return mockProduct ? convertMockProduct(mockProduct) : null;
  }

  try {
    const response = await ordersClient.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

/**
 * Lista todas las categorías disponibles
 */
export const listCategories = async (): Promise<string[]> => {
  if (USE_MOCK_DATA) {
    const categories = Array.from(new Set(mockProducts.map((product) => product.category)));
    return ['Para compartir', ...categories.filter((category) => category !== 'Para compartir')];
  }

  try {
    const response = await ordersClient.get<ApiResponse<string[]>>('/products/categories');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Busca productos por nombre
 */
export const searchProducts = async (query: string): Promise<Product[]> => {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const filteredProducts = mockProducts.filter((product) =>
      product.title.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase())
    );

    return filteredProducts.map(convertMockProduct);
  }

  try {
    const response = await ordersClient.get<ApiResponse<Product[]>>('/products/search', {
      params: { q: query }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};
