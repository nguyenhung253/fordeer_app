import { api } from "@/config/api";
import type { Customer, PaginationParams, PaginationResponse } from "@/types/api";

export const customerService = {
  getAll: async (params?: PaginationParams & { isActive?: boolean }): Promise<PaginationResponse<Customer>> => {
    const response = await api.get<PaginationResponse<Customer>>("/customers", { params });
    return response.data;
  },

  getById: async (id: number): Promise<Customer> => {
    const response = await api.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  create: async (data: Omit<Customer, "id" | "customerCode" | "isActive" | "createdAt" | "updatedAt">): Promise<Customer> => {
    const response = await api.post<Customer>("/customers", data);
    return response.data;
  },

  update: async (id: number, data: Partial<Omit<Customer, "id" | "customerCode" | "isActive" | "createdAt" | "updatedAt">>): Promise<Customer> => {
    const response = await api.put<Customer>(`/customers/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/customers/${id}`);
  },

  restore: async (id: number): Promise<Customer> => {
    const response = await api.put<Customer>(`/customers/${id}/restore`);
    return response.data;
  },
};
