import { useState, useEffect, useRef } from "react";
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
import { cn, formatVND } from "@/lib/utils";
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
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Trigger animation when data loads
  useEffect(() => {
    if (!loading) {
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [loading]);

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

  // Stat card component with animation
  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    index,
    showTrend = false,
  }: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: any;
    index: number;
    showTrend?: boolean;
  }) => (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-500 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/30",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="rounded-lg bg-primary/10 p-2 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
          <Icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:rotate-12" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground transition-all duration-300 group-hover:text-primary">
          {value}
        </div>
        <div
          className={cn(
            "flex items-center gap-1 text-xs",
            showTrend ? "text-primary" : "text-muted-foreground"
          )}
        >
          {showTrend && <TrendingUp className="h-3 w-3 animate-bounce" />}
          <span>{subtitle}</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div ref={containerRef} className="space-y-6">
        {/* Header with fade-in animation */}
        <div
          className={cn(
            "transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          )}
        >
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
            {/* Stats Grid with staggered animation */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <StatCard
                title="Doanh thu"
                value={`₫${(stats.totalRevenue / 1000000).toFixed(1)}M`}
                subtitle="Đơn hoàn thành"
                icon={DollarSign}
                index={0}
                showTrend
              />
              <StatCard
                title="Đơn hàng"
                value={stats.totalOrders}
                subtitle="Tổng đơn hàng"
                icon={ShoppingCart}
                index={1}
                showTrend
              />
              <StatCard
                title="Khách hàng"
                value={stats.totalCustomers}
                subtitle="Tổng khách hàng"
                icon={Users}
                index={2}
              />
              <StatCard
                title="Sản phẩm bán ra"
                value={stats.productsSold}
                subtitle="Tổng số lượng"
                icon={Package}
                index={3}
                showTrend
              />
              <StatCard
                title="Tổng sản phẩm"
                value={stats.totalProducts}
                subtitle="Đang quản lý"
                icon={Package}
                index={4}
              />
            </div>
          </>
        )}

        {!loading && (
          <>
            {/* Charts Grid with animation */}
            <div
              className={cn(
                "grid gap-4 lg:grid-cols-2 transition-all duration-700",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: "500ms" }}
            >
              <Card className="group transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <CardHeader>
                  <CardTitle className="transition-colors duration-300 group-hover:text-primary">
                    Biểu đồ sản phẩm bán chạy
                  </CardTitle>
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
                            animationBegin={0}
                            animationDuration={1500}
                          >
                            {bestSelling.map((_entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={`hsl(${120 + index * 30}, ${
                                  40 + index * 10
                                }%, ${35 + index * 5}%)`}
                                className="transition-all duration-300 hover:opacity-80"
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

              <Card className="group transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <CardHeader>
                  <CardTitle className="transition-colors duration-300 group-hover:text-primary">
                    Doanh thu theo sản phẩm
                  </CardTitle>
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
                            activeDot={{ r: 8, className: "animate-pulse" }}
                            animationDuration={2000}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Lists Grid with animation */}
            <div
              className={cn(
                "grid gap-4 lg:grid-cols-2 transition-all duration-700",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: "700ms" }}
            >
              <Card className="group transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <CardHeader>
                  <CardTitle className="transition-colors duration-300 group-hover:text-primary">
                    Sản phẩm bán chạy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {bestSelling.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Chưa có dữ liệu
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bestSelling.map((product, index) => (
                        <div
                          key={product.id}
                          className={cn(
                            "flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0",
                            "rounded-lg px-3 py-2 -mx-3 transition-all duration-300",
                            "hover:bg-primary/5 hover:border-transparent cursor-pointer",
                            isVisible
                              ? "opacity-100 translate-x-0"
                              : "opacity-0 -translate-x-4"
                          )}
                          style={{ transitionDelay: `${800 + index * 100}ms` }}
                        >
                          <div>
                            <p className="font-medium text-foreground transition-colors duration-300 hover:text-primary">
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

              <Card className="group transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <CardHeader>
                  <CardTitle className="transition-colors duration-300 group-hover:text-primary">
                    Đơn hàng gần đây
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentOrders.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      Chưa có đơn hàng
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentOrders.map((order, index) => (
                        <div
                          key={order.id}
                          className={cn(
                            "flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0",
                            "rounded-lg px-3 py-2 -mx-3 transition-all duration-300",
                            "hover:bg-primary/5 hover:border-transparent cursor-pointer",
                            isVisible
                              ? "opacity-100 translate-x-0"
                              : "opacity-0 translate-x-4"
                          )}
                          style={{ transitionDelay: `${800 + index * 100}ms` }}
                        >
                          <div>
                            <p className="text-sm font-semibold text-foreground transition-colors duration-300 hover:text-primary">
                              {order.orderCode}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {order.customer?.fullName ||
                                `ID: ${order.customerId}`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-foreground">
                              {formatVND(order.totalAmount)}₫
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
