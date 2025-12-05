import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config.url?.includes("/login")
    ) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      // Redirect to shop login with logout action (token expired)
      window.location.href =
        "https://fordeer-shop.vercel.app/login?action=logout";
    }
    return Promise.reject(error);
  }
);
