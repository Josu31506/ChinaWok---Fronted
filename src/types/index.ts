// =====================================================
// TIPOS PARA ENTIDADES DEL SISTEMA
// =====================================================

// =====================================================
// USUARIO
// =====================================================
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'cliente' | 'administrador';
  address?: Address;
  createdAt?: string;
  updatedAt?: string;
}

export interface Address {
  street: string;
  district: string;
  city: string;
  reference?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// =====================================================
// LOCAL / TIENDA
// =====================================================
export interface Store {
  id: string;
  name: string;
  address: string;
  district: string;
  city: string;
  phone: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  deliveryTypes: DeliveryType[];
  isActive: boolean;
  openingHours?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type DeliveryType = 'delivery' | 'pickup';

export interface DeliveryOption {
  type: DeliveryType;
  label: string;
  icon: string;
  description: string;
}

// =====================================================
// PRODUCTO
// =====================================================
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image: string;
  discount?: number;
  isAvailable: boolean;
  isNew?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type ProductCategory =
  | 'Platos'
  | 'Entradas'
  | 'Bebidas'
  | 'Postres'
  | 'Para compartir';

// =====================================================
// OFERTA
// =====================================================
export interface Offer {
  id: string;
  title: string;
  description: string;
  image: string;
  discountPercentage: number;
  validFrom: string;
  validUntil: string;
  products: string[]; // IDs de productos incluidos
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// =====================================================
// COMBO
// =====================================================
export interface Combo {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  products: ComboProduct[];
  discount?: number;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ComboProduct {
  productId: string;
  productName: string;
  quantity: number;
}

// =====================================================
// PEDIDO
// =====================================================
export interface Order {
  id: string;
  userId: string;
  storeId: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryType: DeliveryType;
  deliveryAddress?: Address;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
  estimatedDeliveryTime?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  subtotal: number;
  type: 'product' | 'combo' | 'offer';
}

export type OrderStatus =
  | 'pending'      // Pendiente de confirmación
  | 'confirmed'    // Confirmado
  | 'preparing'    // En preparación
  | 'ready'        // Listo para recoger/entregar
  | 'delivering'   // En camino (solo delivery)
  | 'delivered'    // Entregado
  | 'cancelled';   // Cancelado

export type PaymentMethod =
  | 'cash'
  | 'card'
  | 'yape'
  | 'plin';

export interface CreateOrderData {
  userId: string;
  storeId: string;
  items: OrderItem[];
  deliveryType: DeliveryType;
  deliveryAddress?: Address;
  paymentMethod: PaymentMethod;
  notes?: string;
}

// =====================================================
// CARRITO DE COMPRAS (Estado Local)
// =====================================================
export interface CartItem {
  id: string; // ID del producto, combo u oferta
  name: string;
  image: string;
  price: number;
  quantity: number;
  type: 'product' | 'combo' | 'offer';
  maxQuantity?: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

// =====================================================
// FILTROS Y BÚSQUEDA
// =====================================================
export interface ProductFilters {
  category?: ProductCategory;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
}

export interface StoreFilters {
  city?: string;
  district?: string;
  deliveryType?: DeliveryType;
  isActive?: boolean;
}

// =====================================================
// RESPUESTAS DE API
// =====================================================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  statusCode: number;
}
