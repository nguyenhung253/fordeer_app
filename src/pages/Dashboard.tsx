import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, ShoppingCart, TrendingUp, Loader2 } from "lucide-react";
import { productService } from "@/services/productService";
import { customerService } from "@/services/customerService";
import { orderService } from "@/services/orderService";
import { reportService } from "@/services/reportService";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [bestSelling, setBestSelling] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [products, customers, orders, bestSellingData] = await Promise.all([
        productService.getAll({ limit: 1 }),
        customerService.getAll({ limit: 1 }),
        orderService.getAll({ limit: 10 }),
        reportService.getBestSelling({ limit: 4 }).catch(() => []),
      ]);

      // Calculate total revenue from completed orders
      const completedOrders = orders.data.filter((o) => o.status === "completed");
      const revenue = completedOrders.reduce((sum, o) => sum + parseFloat(o.totalAmount.toString() || "0"), 0);

      setStats({
        totalProducts: products.pagination.totalItems,
        totalCustomers: customers.pagination.totalItems,
        totalOrders: orders.pagination.totalItems,
        totalRevenue: revenue,
      });

      // Extract topByQuantity from response
      const bestSellingArray = (bestSellingData as any)?.topByQuantity || bestSellingData || [];
      setBestSelling(Array.isArray(bestSellingArray) ? bestSellingArray : []);
      setRecentOrders(orders.data.slice(0, 4));
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu dashboard:", error);
      setBestSelling([]);
      setRecentOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
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
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Chào mừng trở lại!
          </h1>
          <p className="text-muted-foreground">
            Đây là tổng quan về cửa hàng đồ uống của bạn
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-2 border-accent/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Tổng sản phẩm
                  </CardTitle>
                  <Package className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.totalProducts}
                  </div>
                  <p className="text-xs text-primary">Đang quản lý</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-accent/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Khách hàng
                  </CardTitle>
                  <Users className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.totalCustomers}
                  </div>
                  <p className="text-xs text-primary">Tổng khách hàng</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-accent/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Đơn hàng
                  </CardTitle>
                  <ShoppingCart className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.totalOrders}
                  </div>
                  <p className="text-xs text-primary">Tổng đơn hàng</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-accent/20">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Doanh thu
                  </CardTitle>
                  <TrendingUp className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    ₫{(stats.totalRevenue / 1000000).toFixed(1)}M
                  </div>
                  <p className="text-xs text-primary">Đơn hoàn thành</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {!loading && (
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sản phẩm bán chạy</CardTitle>
              </CardHeader>
              <CardContent>
                {bestSelling.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Chưa có dữ liệu
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bestSelling.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            {product.productName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Đã bán: {product.totalQuantity}
                          </p>
                        </div>
                        <p className="font-semibold text-primary">
                          ₫{(product.totalRevenue / 1000).toFixed(0)}K
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Đơn hàng gần đây</CardTitle>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Chưa có đơn hàng
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                      >
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {order.orderCode}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.customer?.fullName || `ID: ${order.customerId}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-foreground">
                            ₫{order.totalAmount.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getStatusText(order.status)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
