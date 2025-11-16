export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: "ASC" | "DESC";
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface Customer {
  id: number;
  customerCode: string;
  fullName: string;
  email: string;
  phone: string;
  birthYear?: number;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  orderCode: string;
  customerId: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  totalAmount: number;
  discount: number;
  createdAt: string;
  updatedAt: string;
  customer?: Customer;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Product {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  category: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: "admin" | "staff";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User & {
    accessToken: string;
  };
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: "admin" | "staff";
}

export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
}
