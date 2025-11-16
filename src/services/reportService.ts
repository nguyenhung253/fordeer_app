import { api } from "@/config/api";

export interface InventoryReport {
  id: number;
  productName: string;
  category: string;
  quantity: number;
  price: number;
  isLowStock?: boolean;
  lowStock?: boolean; // Backend returns this field
}

export interface SalesReport {
  period: string;
  totalRevenue: number;
  totalOrders: number;
  data: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

export interface CustomerReport {
  totalCustomers: number;
  newCustomers: number;
  vipCustomers: Array<{
    id: number;
    fullName: string;
    email: string;
    totalSpent: number;
    orderCount: number;
  }>;
}

export interface BestSellingProduct {
  id: number;
  productName: string;
  category: string;
  totalQuantity: number;
  totalRevenue: number;
}

export const reportService = {
  getInventory: async (params?: { lowStock?: number; category?: string }): Promise<any> => {
    const response = await api.get("/reports/inventory", { params });
    return response.data;
  },

  getSales: async (period: "daily" | "weekly" | "monthly" | "yearly", params?: { year?: number; month?: number }): Promise<SalesReport> => {
    const response = await api.get<SalesReport>(`/reports/sales/${period}`, { params });
    return response.data;
  },

  getCustomers: async (): Promise<CustomerReport> => {
    const response = await api.get<CustomerReport>("/reports/customers");
    return response.data;
  },

  getBestSelling: async (params?: { period?: string; limit?: number }): Promise<BestSellingProduct[]> => {
    const response = await api.get<BestSellingProduct[]>("/reports/products/bestselling", { params });
    return response.data;
  },
};
