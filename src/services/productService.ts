import { api } from "@/config/api";
import type { Product, PaginationParams, PaginationResponse } from "@/types/api";

export const productService = {
  getAll: async (params?: PaginationParams & { category?: string; isActive?: boolean }): Promise<PaginationResponse<Product>> => {
    const response = await api.get<PaginationResponse<Product>>("/products", { params });
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (data: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> => {
    const response = await api.post<Product>("/products", data);
    return response.data;
  },

  update: async (id: number, data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
