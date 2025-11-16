import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Loader2, X } from "lucide-react";
import { orderService } from "@/services/orderService";
import { OrderDialog } from "@/components/OrderDialog";
import { OrderDetailDialog } from "@/components/OrderDetailDialog";
import type { Order } from "@/types/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    cancelled: 0,
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAll({
        page: currentPage,
        limit: 10,
        status: statusFilter || undefined,
      });
      setOrders(response.data);
      setTotalPages(response.pagination.totalPages);

      // Calculate stats
      const allOrders = response.data;
      setStats({
        total: response.pagination.totalItems,
        pending: allOrders.filter((o) => o.status === "pending").length,
        processing: allOrders.filter((o) => o.status === "processing").length,
        completed: allOrders.filter((o) => o.status === "completed").length,
        cancelled: allOrders.filter((o) => o.status === "cancelled").length,
      });
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter]);

  const handleViewDetail = async (order: Order) => {
    try {
      const detailOrder = await orderService.getById(order.id);
      setSelectedOrder(detailOrder);
      setDetailDialogOpen(true);
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi khi tải chi tiết đơn hàng");
    }
  };

  const handleUpdateStatus = async (orderId: number, newStatus: Order["status"]) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      fetchOrders();
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi khi cập nhật trạng thái");
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;
    try {
      await orderService.cancel(orderId);
      fetchOrders();
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi khi hủy đơn hàng");
    }
  };

  const getStatusBadgeVariant = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return "default";
      case "processing":
        return "secondary";
      case "pending":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang xử lý";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Quản lý đơn hàng
            </h1>
            <p className="text-muted-foreground">
              Theo dõi và quản lý đơn hàng
            </p>
          </div>
          <Button
            className="gap-2"
            onClick={() => {
              setSelectedOrder(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Tạo đơn hàng
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tổng đơn hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.total}
              </div>
              <p className="text-xs text-primary">Tất cả đơn hàng</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Chờ xử lý
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.pending + stats.processing}
              </div>
              <p className="text-xs text-muted-foreground">Cần xử lý</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Hoàn thành
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.completed}
              </div>
              <p className="text-xs text-primary">
                {stats.total > 0
                  ? ((stats.completed / stats.total) * 100).toFixed(1)
                  : 0}
                % tỷ lệ thành công
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Đã hủy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stats.cancelled}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.total > 0
                  ? ((stats.cancelled / stats.total) * 100).toFixed(1)
                  : 0}
                % tỷ lệ hủy
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={statusFilter === "" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("")}
                >
                  Tất cả
                </Button>
                <Button
                  variant={statusFilter === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("pending")}
                >
                  Chờ xử lý
                </Button>
                <Button
                  variant={statusFilter === "processing" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("processing")}
                >
                  Đang xử lý
                </Button>
                <Button
                  variant={statusFilter === "completed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("completed")}
                >
                  Hoàn thành
                </Button>
                <Button
                  variant={statusFilter === "cancelled" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("cancelled")}
                >
                  Đã hủy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách đơn hàng ({orders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Không có đơn hàng nào
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                          Mã đơn
                        </th>
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                          Khách hàng
                        </th>
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                          Ngày đặt
                        </th>
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                          Tổng tiền
                        </th>
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                          Giảm giá
                        </th>
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                          Trạng thái
                        </th>
                        <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="py-4 text-sm font-medium text-foreground">
                            {order.orderCode}
                          </td>
                          <td className="py-4 text-sm text-foreground">
                            {order.customer?.fullName || `ID: ${order.customerId}`}
                          </td>
                          <td className="py-4 text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                          </td>
                          <td className="py-4 text-sm font-medium text-foreground">
                            ₫{order.totalAmount.toLocaleString()}
                          </td>
                          <td className="py-4 text-sm text-muted-foreground">
                            {order.discount > 0 ? `₫${order.discount.toLocaleString()}` : "-"}
                          </td>
                          <td className="py-4">
                            <Badge variant={getStatusBadgeVariant(order.status)}>
                              {getStatusText(order.status)}
                            </Badge>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewDetail(order)}
                                title="Xem chi tiết"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {(order.status === "pending" || order.status === "processing") && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleCancelOrder(order.id)}
                                  title="Hủy đơn"
                                >
                                  <X className="h-4 w-4 text-destructive" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                    >
                      Trước
                    </Button>
                    <span className="flex items-center px-4 text-sm">
                      Trang {currentPage} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                    >
                      Sau
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <OrderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={() => {
          fetchOrders();
          setDialogOpen(false);
        }}
      />

      <OrderDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
      />
    </DashboardLayout>
  );
}
