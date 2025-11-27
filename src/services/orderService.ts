import { api } from "@/config/api";
import type { Order, PaginationParams, PaginationResponse } from "@/types/api";

interface CreateOrderRequest {
  customerInfo: {
    fullName: string;
    phone: string;
    address?: string;
  };
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  discount?: number;
}

export const orderService = {
  getAll: async (
    params?: PaginationParams & { status?: string; customerId?: number }
  ): Promise<PaginationResponse<Order>> => {
    const response = await api.get<PaginationResponse<Order>>("/orders", {
      params,
    });
    return response.data;
  },

  getById: async (id: number): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  create: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await api.post<Order>("/orders", data);
    return response.data;
  },

  updateStatus: async (id: number, status: Order["status"]): Promise<Order> => {
    const response = await api.put<Order>(`/orders/${id}/status`, { status });
    return response.data;
  },

  cancel: async (id: number): Promise<void> => {
    await api.delete(`/orders/${id}`);
  },
};
