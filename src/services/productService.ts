import { api } from "@/config/api";
import type {
  Product,
  PaginationParams,
  PaginationResponse,
} from "@/types/api";

export const productService = {
  getAll: async (
    params?: PaginationParams & { category?: string; isActive?: boolean }
  ): Promise<PaginationResponse<Product>> => {
    const response = await api.get<PaginationResponse<Product>>("/products", {
      params,
    });
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (data: FormData): Promise<Product> => {
    const response = await api.post<{ product: Product }>("/products", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.product;
  },

  update: async (id: number, data: FormData): Promise<Product> => {
    const response = await api.put<{ product: Product }>(
      `/products/${id}`,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data.product;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
