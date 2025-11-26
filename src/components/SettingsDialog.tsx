import { useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
  });
  const [theme, setTheme] = useState("light");

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
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background shadow-lg">
        <div className="flex h-[600px] flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Cài đặt</h2>
              <p className="text-sm text-muted-foreground">
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
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-56 border-r bg-muted/30 p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      activeTab === tab.id
                        ? "bg-accent text-accent-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                    )}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {activeTab === "general" && (
                  <div className="space-y-6">
                    <div className="rounded-lg border bg-card p-6 space-y-6">
                      <div>
                        <h3 className="text-lg font-medium">Giao diện</h3>
                        <p className="text-sm text-muted-foreground">
                          Tùy chỉnh giao diện ứng dụng
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <button
                          onClick={() => setTheme("light")}
                          className={cn(
                            "flex flex-col items-center gap-2 rounded-lg border-2 p-4 hover:bg-accent transition-all",
                            theme === "light"
                              ? "border-primary ring-1 ring-primary bg-primary/5"
                              : "border-muted"
                          )}
                        >
                          <div className="h-6 w-6 rounded-full bg-white border shadow-sm" />
                          <span className="text-sm font-medium">Sáng</span>
                        </button>
                        <button
                          onClick={() => setTheme("dark")}
                          className={cn(
                            "flex flex-col items-center gap-2 rounded-lg border-2 p-4 hover:bg-accent transition-all",
                            theme === "dark"
                              ? "border-primary ring-1 ring-primary bg-primary/5"
                              : "border-muted"
                          )}
                        >
                          <div className="h-6 w-6 rounded-full bg-slate-950 border shadow-sm" />
                          <span className="text-sm font-medium">Tối</span>
                        </button>
                        <button
                          onClick={() => setTheme("system")}
                          className={cn(
                            "flex flex-col items-center gap-2 rounded-lg border-2 p-4 hover:bg-accent transition-all",
                            theme === "system"
                              ? "border-primary ring-1 ring-primary bg-primary/5"
                              : "border-muted"
                          )}
                        >
                          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-white to-slate-950 border shadow-sm" />
                          <span className="text-sm font-medium">Hệ thống</span>
                        </button>
                      </div>
                    </div>

                    <div className="rounded-lg border bg-card p-6 space-y-6">
                      <div>
                        <h3 className="text-lg font-medium">
                          Ngôn ngữ & Khu vực
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Cài đặt ngôn ngữ và định dạng ngày giờ
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">
                            Ngôn ngữ
                          </label>
                          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            <option value="vi">Tiếng Việt</option>
                            <option value="en">English</option>
                          </select>
                        </div>
                        <div className="grid gap-2">
                          <label className="text-sm font-medium">Múi giờ</label>
                          <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
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
                  <div className="space-y-6">
                    <div className="rounded-lg border bg-card p-6 space-y-6">
                      <div>
                        <h3 className="text-lg font-medium">
                          Cài đặt thông báo
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Chọn cách bạn muốn nhận thông báo
                        </p>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between space-x-2">
                          <div className="flex items-center space-x-4">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div className="space-y-0.5">
                              <label className="text-sm font-medium">
                                Email thông báo
                              </label>
                              <p className="text-sm text-muted-foreground">
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
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                          <div className="flex items-center space-x-4">
                            <Smartphone className="h-5 w-5 text-muted-foreground" />
                            <div className="space-y-0.5">
                              <label className="text-sm font-medium">
                                Thông báo đẩy
                              </label>
                              <p className="text-sm text-muted-foreground">
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
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </div>
                        <div className="flex items-center justify-between space-x-2">
                          <div className="flex items-center space-x-4">
                            <Volume2 className="h-5 w-5 text-muted-foreground" />
                            <div className="space-y-0.5">
                              <label className="text-sm font-medium">
                                Tiếp thị
                              </label>
                              <p className="text-sm text-muted-foreground">
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
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {(activeTab === "account" || activeTab === "security") && (
                  <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                        {activeTab === "account" ? (
                          <User className="h-10 w-10 text-muted-foreground" />
                        ) : (
                          <Shield className="h-10 w-10 text-muted-foreground" />
                        )}
                      </div>
                      <h3 className="mt-4 text-lg font-semibold">
                        Tính năng đang phát triển
                      </h3>
                      <p className="mb-4 mt-2 text-sm text-muted-foreground">
                        Chúng tôi đang làm việc để mang đến cho bạn trải nghiệm
                        tốt nhất. Vui lòng quay lại sau.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab("general")}
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
          <div className="flex items-center justify-end gap-4 border-t px-6 py-4">
            <Button variant="outline" onClick={handleCancel}>
              Hủy thay đổi
            </Button>
            <Button onClick={handleSave}>Lưu cài đặt</Button>
          </div>
        </div>
      </div>
    </>
  );
}
