import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Order } from "@/types/api";

interface OrderDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onUpdateStatus?: (orderId: number, status: Order["status"]) => void;
}

export function OrderDetailDialog({
  open,
  onOpenChange,
  order,
  onUpdateStatus,
}: OrderDetailDialogProps) {
  if (!order) return null;

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

  const canUpdateStatus = (currentStatus: Order["status"], newStatus: Order["status"]) => {
    if (currentStatus === "cancelled" || currentStatus === "completed") return false;
    if (currentStatus === "pending" && (newStatus === "processing" || newStatus === "cancelled")) return true;
    if (currentStatus === "processing" && (newStatus === "completed" || newStatus === "cancelled")) return true;
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết đơn hàng</DialogTitle>
          <DialogDescription>Mã đơn: {order.orderCode}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Thông tin khách hàng */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">Thông tin khách hàng</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tên:</span>
                  <span className="font-medium">{order.customer?.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span>{order.customer?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">SĐT:</span>
                  <span>{order.customer?.phone}</span>
                </div>
                {order.customer?.address && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Địa chỉ:</span>
                    <span className="text-right">{order.customer.address}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Thông tin đơn hàng */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">Thông tin đơn hàng</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngày đặt:</span>
                  <span>{new Date(order.createdAt).toLocaleString("vi-VN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Trạng thái:</span>
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chi tiết sản phẩm */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3">Chi tiết sản phẩm</h3>
              <div className="space-y-3">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b pb-2 last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.product?.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        ₫{item.price.toLocaleString()} x {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ₫{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tổng tiền */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính:</span>
                  <span>
                    ₫{(order.totalAmount + order.discount).toLocaleString()}
                  </span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Giảm giá:</span>
                    <span className="text-destructive">
                      -₫{order.discount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Tổng cộng:</span>
                  <span className="text-primary">
                    ₫{order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {order.status !== "cancelled" && order.status !== "completed" && (
            <div className="flex gap-2 justify-end">
              {canUpdateStatus(order.status, "processing") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    if (onUpdateStatus) {
                      onUpdateStatus(order.id, "processing");
                      onOpenChange(false);
                    }
                  }}
                >
                  Chuyển sang Đang xử lý
                </Button>
              )}
              {canUpdateStatus(order.status, "completed") && (
                <Button
                  onClick={() => {
                    if (onUpdateStatus) {
                      onUpdateStatus(order.id, "completed");
                      onOpenChange(false);
                    }
                  }}
                >
                  Hoàn thành đơn hàng
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
