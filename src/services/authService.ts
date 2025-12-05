import { api } from "@/config/api";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
} from "@/types/api";

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
    const response = await api.post<RegisterResponse>(
      "/admin/staff/register",
      data
    );
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

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>("/users/profile");
    return response.data;
  },

  updateProfile: async (data: FormData): Promise<User> => {
    try {
      const response = await api.put<{ user: User }>("/users/profile", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Update localStorage
      const currentUser = authService.getCurrentUser();
      if (currentUser && response.data.user) {
        const updatedUser = { ...currentUser, ...response.data.user };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      return response.data.user;
    } catch (error: any) {
      console.error(
        "Update profile API error:",
        error.response?.status,
        error.response?.data
      );
      throw error;
    }
  },
};
