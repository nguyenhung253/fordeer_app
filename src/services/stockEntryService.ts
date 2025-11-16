import { api } from "@/config/api";
import type { PaginationParams, PaginationResponse } from "@/types/api";

export interface StockEntry {
  id: number;
  entryCode: string;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  supplier?: string;
  notes?: string;
  entryDate: string;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: number;
    productName: string;
    category: string;
  };
}

export interface StockEntryStats {
  totalEntries: number;
  totalQuantity: number;
  totalValue: number;
  byProduct: Record<string, {
    quantity: number;
    value: number;
    count: number;
  }>;
}

export const stockEntryService = {
  getAll: async (params?: PaginationParams & { 
    productId?: number; 
    startDate?: string; 
    endDate?: string;
  }): Promise<PaginationResponse<StockEntry>> => {
    const response = await api.get<PaginationResponse<StockEntry>>("/stock-entries", { params });
    return response.data;
  },

  getById: async (id: number): Promise<StockEntry> => {
    const response = await api.get<StockEntry>(`/stock-entries/${id}`);
    return response.data;
  },

  create: async (data: {
    productId: number;
    quantity: number;
    unitPrice: number;
    supplier?: string;
    notes?: string;
    entryDate?: string;
  }): Promise<StockEntry> => {
    const response = await api.post<{ stockEntry: StockEntry }>("/stock-entries", data);
    return response.data.stockEntry;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/stock-entries/${id}`);
  },

  getStats: async (params?: { startDate?: string; endDate?: string }): Promise<StockEntryStats> => {
    const response = await api.get<StockEntryStats>("/stock-entries/stats/summary", { params });
    return response.data;
  },
};
