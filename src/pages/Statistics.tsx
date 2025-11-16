import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Loader2,
} from "lucide-react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { reportService } from "@/services/reportService";
import { orderService } from "@/services/orderService";

export default function StatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [bestSelling, setBestSelling] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    newCustomers: 0,
    productsSold: 0,
  });

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const [bestSellingData, ordersData] = await Promise.all([
        reportService.getBestSelling({ limit: 5 }).catch(() => []),
        orderService.getAll({ limit: 100 }).catch(() => ({ data: [], pagination: { totalItems: 0 } })),
      ]);

      // Extract topByQuantity from response
      const bestSellingArray = (bestSellingData as any)?.topByQuantity || bestSellingData || [];
      setBestSelling(Array.isArray(bestSellingArray) ? bestSellingArray : []);

      // Calculate stats from orders
      const completedOrders = ordersData.data.filter((o: any) => o.status === "completed");
      const revenue = completedOrders.reduce((sum: number, o: any) => sum + parseFloat(o.totalAmount?.toString() || "0"), 0);
      const productsSold = completedOrders.reduce((sum: number, o: any) => {
        return sum + (o.items?.reduce((s: number, item: any) => s + item.quantity, 0) || 0);
      }, 0);

      setStats({
        totalRevenue: revenue,
        totalOrders: ordersData.pagination.totalItems,
        newCustomers: 0, // Would need customer report API
        productsSold: productsSold,
      });
    } catch (error) {
      console.error("Lỗi khi tải thống kê:", error);
      setBestSelling([]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Thống kê & Báo cáo
          </h1>
          <p className="text-muted-foreground">Phân tích dữ liệu kinh doanh</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                    Khách hàng mới
                  </CardTitle>
                  <Users className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {stats.newCustomers}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>Tháng này</span>
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
                  <ChartContainer
                    config={{
                      totalQuantitySold: {
                        label: "Số lượng bán",
                        color: "hsl(135, 18%, 35%)",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={bestSelling}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="stroke-border"
                        />
                        <XAxis 
                          dataKey="productName" 
                          className="text-xs" 
                          stroke="hsl(140, 5%, 45%)"
                        />
                        <YAxis className="text-xs" stroke="hsl(140, 5%, 45%)" />
                        <ChartTooltip />
                        <Bar
                          dataKey="totalQuantitySold"
                          fill="hsl(135, 18%, 35%)"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
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
                        <YAxis className="text-xs" stroke="hsl(140, 5%, 45%)" />
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
        )}

        {!loading && bestSelling.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Top sản phẩm</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bestSelling.slice(0, 3).map((product, index) => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {index + 1}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {product.productName}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {product.totalQuantity} đã bán
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Doanh thu cao nhất</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bestSelling
                    .sort((a, b) => b.totalRevenue - a.totalRevenue)
                    .slice(0, 3)
                    .map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {index + 1}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {product.productName}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          ₫{(product.totalRevenue / 1000).toFixed(0)}K
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thống kê tổng quan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Tổng sản phẩm
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {bestSelling.length} loại
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Tổng đã bán
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {bestSelling.reduce((sum, p) => sum + p.totalQuantity, 0)} sản phẩm
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Doanh thu trung bình
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      ₫
                      {bestSelling.length > 0
                        ? (
                            bestSelling.reduce((sum, p) => sum + p.totalRevenue, 0) /
                            bestSelling.length /
                            1000
                          ).toFixed(0)
                        : 0}
                      K
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
