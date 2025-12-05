import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import DashboardPage from "@/pages/Dashboard";
import ProductsPage from "@/pages/Products";
import CustomersPage from "@/pages/Customers";
import OrdersPage from "@/pages/Orders";
import InventoryPage from "@/pages/Inventory";
import RegisterPage from "@/pages/Register";
import ProfilePage from "@/pages/Profile";

import { authService } from "@/services/authService";

const MAIN_SITE_LOGIN_URL = "https://fordeer-shop.vercel.app/login";

// Hook to check and save token from URL params (when redirected from main site)
function useTokenFromUrl() {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const refresh = urlParams.get("refresh");
    const userStr = urlParams.get("user");

    if (token && refresh && userStr) {
      try {
        // Save tokens to localStorage
        localStorage.setItem("accessToken", token);
        localStorage.setItem("refreshToken", refresh);
        localStorage.setItem("user", decodeURIComponent(userStr));

        // Clean URL (remove token params)
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      } catch (error) {
        console.error("Error parsing token from URL:", error);
      }
    }
    setIsChecking(false);
  }, []);

  return isChecking;
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  if (!authService.isAuthenticated()) {
    // Redirect to main site login page instead of local login
    window.location.href = MAIN_SITE_LOGIN_URL;
    return null;
  }
  return <>{children}</>;
}

function App() {
  // Check for token in URL first
  const isCheckingToken = useTokenFromUrl();

  // Show loading while checking token
  if (isCheckingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Đang xác thực...</p>
      </div>
    );
  }
  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Remove login route - redirect to main site */}
        <Route path="/login" element={<RedirectToMainLogin />} />
        <Route
          path="/register"
          element={
            <PrivateRoute>
              <RegisterPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/products"
          element={
            <PrivateRoute>
              <ProductsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <PrivateRoute>
              <CustomersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <OrdersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <PrivateRoute>
              <InventoryPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

// Component to redirect to main site login
function RedirectToMainLogin() {
  window.location.href = MAIN_SITE_LOGIN_URL;
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Đang chuyển hướng đến trang đăng nhập...</p>
    </div>
  );
}

export default App;
