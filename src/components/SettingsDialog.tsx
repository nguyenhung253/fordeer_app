import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Globe,
  Shield,
  Smartphone,
  User,
  Volume2,
  Mail,
  X,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

// Theme helper functions
const getStoredTheme = () => localStorage.getItem("theme") || "light";
const setStoredTheme = (theme: string) => localStorage.setItem("theme", theme);

const applyTheme = (theme: string) => {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else if (theme === "light") {
    root.classList.remove("dark");
  } else {
    // system
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (prefersDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }
};

export function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
  });
  const [theme, setTheme] = useState(getStoredTheme());

  useEffect(() => {
    // Apply theme on mount
    applyTheme(getStoredTheme());
  }, []);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    setStoredTheme(newTheme);
    applyTheme(newTheme);
  };

  const tabs = [
    { id: "general", label: "Chung", icon: Globe },
    { id: "account", label: "Tài khoản", icon: User },
    { id: "notifications", label: "Thông báo", icon: Bell },
    { id: "security", label: "Bảo mật", icon: Shield },
  ];

  const handleSave = () => {
    toast.success("Đã lưu cài đặt thành công!");
    onClose();
  };

  const handleCancel = () => {
    toast.info("Đã hủy thay đổi");
    onClose();
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 z-50 w-auto sm:w-full sm:max-w-4xl sm:-translate-x-1/2 sm:-translate-y-1/2 rounded-lg border bg-background shadow-lg overflow-hidden">
        <div className="flex h-full sm:h-[600px] flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 sm:px-6 py-3 sm:py-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                Cài đặt
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Quản lý cài đặt ứng dụng và tùy chọn của bạn
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-accent transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
            {/* Sidebar - horizontal on mobile, vertical on desktop */}
            <aside className="border-b sm:border-b-0 sm:border-r bg-muted/30 p-2 sm:p-4 sm:w-56 flex-shrink-0">
              <nav className="flex sm:flex-col gap-1 overflow-x-auto sm:overflow-x-visible">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 sm:gap-3 rounded-lg px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap sm:w-full",
                      activeTab === tab.id
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="hidden xs:inline sm:inline">
                      {tab.label}
                    </span>
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                {activeTab === "general" && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="rounded-lg border bg-card p-4 sm:p-6 space-y-4 sm:space-y-6">
                      <div>
                        <h3 className="text-base sm:text-lg font-medium">
                          Giao diện
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Tùy chỉnh giao diện ứng dụng
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 sm:gap-4">
                        <button
                          onClick={() => handleThemeChange("light")}
                          className={cn(
                            "flex flex-col items-center gap-1 sm:gap-2 rounded-lg border-2 p-2 sm:p-4 hover:bg-accent transition-all",
                            theme === "light"
                              ? "border-primary ring-1 ring-primary bg-primary/5"
                              : "border-muted"
                          )}
                        >
                          <Sun className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
                          <span className="text-xs sm:text-sm font-medium">
                            Sáng
                          </span>
                        </button>
                        <button
                          onClick={() => handleThemeChange("dark")}
                          className={cn(
                            "flex flex-col items-center gap-1 sm:gap-2 rounded-lg border-2 p-2 sm:p-4 hover:bg-accent transition-all",
                            theme === "dark"
                              ? "border-primary ring-1 ring-primary bg-primary/5"
                              : "border-muted"
                          )}
                        >
                          <Moon className="h-5 w-5 sm:h-6 sm:w-6 text-slate-700" />
                          <span className="text-xs sm:text-sm font-medium">
                            Tối
                          </span>
                        </button>
                        <button
                          onClick={() => handleThemeChange("system")}
                          className={cn(
                            "flex flex-col items-center gap-1 sm:gap-2 rounded-lg border-2 p-2 sm:p-4 hover:bg-accent transition-all",
                            theme === "system"
                              ? "border-primary ring-1 ring-primary bg-primary/5"
                              : "border-muted"
                          )}
                        >
                          <Monitor className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                          <span className="text-xs sm:text-sm font-medium">
                            Hệ thống
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="rounded-lg border bg-card p-4 sm:p-6 space-y-4 sm:space-y-6">
                      <div>
                        <h3 className="text-base sm:text-lg font-medium">
                          Ngôn ngữ & Khu vực
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Cài đặt ngôn ngữ và định dạng ngày giờ
                        </p>
                      </div>
                      <div className="space-y-3 sm:space-y-4">
                        <div className="grid gap-2">
                          <label className="text-xs sm:text-sm font-medium">
                            Ngôn ngữ
                          </label>
                          <select className="flex h-9 sm:h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            <option value="vi">Tiếng Việt</option>
                            <option value="en">English</option>
                          </select>
                        </div>
                        <div className="grid gap-2">
                          <label className="text-xs sm:text-sm font-medium">
                            Múi giờ
                          </label>
                          <select className="flex h-9 sm:h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            <option value="asia/hcm">
                              (GMT+07:00) Bangkok, Hanoi, Jakarta
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="rounded-lg border bg-card p-4 sm:p-6 space-y-4 sm:space-y-6">
                      <div>
                        <h3 className="text-base sm:text-lg font-medium">
                          Cài đặt thông báo
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Chọn cách bạn muốn nhận thông báo
                        </p>
                      </div>
                      <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                            <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                            <div className="space-y-0.5 min-w-0">
                              <label className="text-xs sm:text-sm font-medium block truncate">
                                Email thông báo
                              </label>
                              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                                Nhận thông báo qua email
                              </p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.email}
                            onChange={(e) =>
                              setNotifications({
                                ...notifications,
                                email: e.target.checked,
                              })
                            }
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary flex-shrink-0"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                            <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                            <div className="space-y-0.5 min-w-0">
                              <label className="text-xs sm:text-sm font-medium block truncate">
                                Thông báo đẩy
                              </label>
                              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                                Nhận thông báo trên trình duyệt
                              </p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.push}
                            onChange={(e) =>
                              setNotifications({
                                ...notifications,
                                push: e.target.checked,
                              })
                            }
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary flex-shrink-0"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                            <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                            <div className="space-y-0.5 min-w-0">
                              <label className="text-xs sm:text-sm font-medium block truncate">
                                Tiếp thị
                              </label>
                              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                                Nhận email về các tính năng mới
                              </p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={notifications.marketing}
                            onChange={(e) =>
                              setNotifications({
                                ...notifications,
                                marketing: e.target.checked,
                              })
                            }
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary flex-shrink-0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {(activeTab === "account" || activeTab === "security") && (
                  <div className="flex h-[250px] sm:h-[400px] items-center justify-center rounded-lg border border-dashed p-4 sm:p-8 text-center">
                    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                      <div className="flex h-14 w-14 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-muted">
                        {activeTab === "account" ? (
                          <User className="h-7 w-7 sm:h-10 sm:w-10 text-muted-foreground" />
                        ) : (
                          <Shield className="h-7 w-7 sm:h-10 sm:w-10 text-muted-foreground" />
                        )}
                      </div>
                      <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold">
                        Tính năng đang phát triển
                      </h3>
                      <p className="mb-3 sm:mb-4 mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground px-2">
                        Chúng tôi đang làm việc để mang đến cho bạn trải nghiệm
                        tốt nhất. Vui lòng quay lại sau.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab("general")}
                        className="text-xs sm:text-sm"
                      >
                        Quay lại cài đặt chung
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 sm:gap-4 border-t px-4 sm:px-6 py-3 sm:py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="text-xs sm:text-sm"
            >
              Hủy
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="text-xs sm:text-sm"
            >
              Lưu cài đặt
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
