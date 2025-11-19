import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  Loader2,
  DollarSign,
} from "lucide-react";
import { productService } from "@/services/productService";
import { customerService } from "@/services/customerService";
import { orderService } from "@/services/orderService";
import { reportService } from "@/services/reportService";
import {
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    productsSold: 0,
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
      const completedOrders = orders.data.filter(
        (o) => o.status === "completed"
      );
      const revenue = completedOrders.reduce(
        (sum, o) => sum + parseFloat(o.totalAmount.toString() || "0"),
        0
      );
      const productsSold = completedOrders.reduce((sum: number, o: any) => {
        return (
          sum +
          (o.items?.reduce((s: number, item: any) => s + item.quantity, 0) || 0)
        );
      }, 0);

      setStats({
        totalProducts: products.pagination.totalItems,
        totalCustomers: customers.pagination.totalItems,
        totalOrders: orders.pagination.totalItems,
        totalRevenue: revenue,
        productsSold: productsSold,
      });

      // Extract topByQuantity from response
      const bestSellingArray =
        (bestSellingData as any)?.topByQuantity || bestSellingData || [];
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
            Tổng quan & Thống kê
          </h1>
          <p className="text-muted-foreground">
            Phân tích dữ liệu kinh doanh cửa hàng đồ uống
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Doanh thu
                  </CardTitle>
                  <DollarSign className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    ₫{(stats.totalRevenue / 1000000).toFixed(1)}M
                  </div>
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <TrendingUp className="h-3 w-3" />
                    <span>Đơn hoàn thành</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
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
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <TrendingUp className="h-3 w-3" />
                    <span>Tổng đơn hàng</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
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
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>Tổng khách hàng</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Sản phẩm bán ra
                  </CardTitle>
                  <Package className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.productsSold}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <TrendingUp className="h-3 w-3" />
                    <span>Tổng số lượng</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
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
                  <p className="text-xs text-muted-foreground">Đang quản lý</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {!loading && (
          <>
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Biểu đồ sản phẩm bán chạy</CardTitle>
                </CardHeader>
                <CardContent>
                  {bestSelling.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Chưa có dữ liệu
                    </div>
                  ) : (
                    <ChartContainer
                      config={{
                        totalQuantitySold: {
                          label: "Số lượng bán",
                          color: "hsl(135, 18%, 35%)",
                        },
                      }}
                      className="h-[350px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={bestSelling}
                            dataKey="totalQuantitySold"
                            nameKey="productName"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={(entry) => entry.productName}
                          >
                            {bestSelling.map((_entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={`hsl(${120 + index * 30}, ${
                                  40 + index * 10
                                }%, ${35 + index * 5}%)`}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Doanh thu theo sản phẩm</CardTitle>
                </CardHeader>
                <CardContent>
                  {bestSelling.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Chưa có dữ liệu
                    </div>
                  ) : (
                    <ChartContainer
                      config={{
                        totalRevenue: {
                          label: "Doanh thu",
                          color: "hsl(110, 35%, 65%)",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={bestSelling}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            className="stroke-border"
                          />
                          <XAxis
                            dataKey="productName"
                            className="text-xs"
                            stroke="hsl(140, 5%, 45%)"
                          />
                          <YAxis
                            className="text-xs"
                            stroke="hsl(140, 5%, 45%)"
                          />
                          <ChartTooltip />
                          <Line
                            type="monotone"
                            dataKey="totalRevenue"
                            stroke="hsl(110, 35%, 65%)"
                            strokeWidth={3}
                            dot={{ fill: "hsl(110, 35%, 65%)", r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>
            </div>

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
                              {order.customer?.fullName ||
                                `ID: ${order.customerId}`}
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
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
