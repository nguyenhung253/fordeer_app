import { api } from "@/config/api";
import type { LoginRequest, LoginResponse, User } from "@/types/api";

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/login", credentials);
    if (response.data.user?.accessToken) {
      localStorage.setItem("accessToken", response.data.user.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>("/admin/staff/register", data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post("/logout");
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem("accessToken");
  },
};
