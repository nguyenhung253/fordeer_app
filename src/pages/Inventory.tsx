import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Loader2,
  AlertTriangle,
  Trash2,
  Calendar,
} from "lucide-react";
import { reportService } from "@/services/reportService";
import {
  stockEntryService,
  type StockEntry,
} from "@/services/stockEntryService";
import { StockEntryDialog } from "@/components/StockEntryDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import type { InventoryReport } from "@/services/reportService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatVND } from "@/lib/utils";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryReport[]>([]);
  const [stockEntries, setStockEntries] = useState<StockEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [inventorySearchTerm, setInventorySearchTerm] = useState("");
  const [entriesSearchTerm, setEntriesSearchTerm] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("inventory");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<number | null>(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await reportService.getInventory({
        lowStock: lowStockThreshold,
      });
      // Backend returns { report, summary, lowStockThreshold }
      const data = (response as any).report || response;
      setInventory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi khi tải báo cáo kho:", error);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStockEntries = async () => {
    try {
      setLoading(true);
      const response = await stockEntryService.getAll({
        page: currentPage,
        limit: 10,
        search: entriesSearchTerm || undefined,
      });
      setStockEntries(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error("Lỗi khi tải lịch sử nhập kho:", error);
      setStockEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "inventory") {
      fetchInventory();
    } else {
      fetchStockEntries();
    }
  }, [lowStockThreshold, activeTab, currentPage, entriesSearchTerm]);

  const handleSaveStockEntry = async (data: any) => {
    try {
      await stockEntryService.create(data);
      setDialogOpen(false);
      toast.success("Tạo phiếu nhập kho thành công!");

      // Reset entries search and switch to entries tab
      setEntriesSearchTerm("");
      setCurrentPage(1);
      setActiveTab("entries");

      // Refresh both inventory and entries
      fetchInventory();
      fetchStockEntries();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Lỗi khi tạo phiếu nhập kho"
      );
      throw error;
    }
  };

  const handleDeleteStockEntry = (id: number) => {
    setEntryToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteEntry = async () => {
    if (!entryToDelete) return;

    try {
      await stockEntryService.delete(entryToDelete);
      toast.success("Xóa phiếu nhập thành công!");
      fetchInventory();
      fetchStockEntries();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Lỗi khi xóa phiếu nhập kho"
      );
    } finally {
      setDeleteConfirmOpen(false);
      setEntryToDelete(null);
    }
  };

  const filteredInventory = Array.isArray(inventory)
    ? inventory.filter(
        (item) =>
          item.productName
            .toLowerCase()
            .includes(inventorySearchTerm.toLowerCase()) ||
          item.category
            .toLowerCase()
            .includes(inventorySearchTerm.toLowerCase())
      )
    : [];

  const lowStockCount = Array.isArray(inventory)
    ? inventory.filter((item) => item.lowStock || item.isLowStock).length
    : 0;

  const totalValue = Array.isArray(inventory)
    ? inventory.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Quản lý kho
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Theo dõi và quản lý tồn kho
            </p>
          </div>
          <Button className="gap-2 w-fit" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Nhập kho
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tổng sản phẩm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {inventory.length}
              </div>
              <p className="text-xs text-primary">Đang quản lý</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sắp hết hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {lowStockCount}
              </div>
              <p className="text-xs text-muted-foreground">Cần nhập thêm</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Giá trị kho
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ₫{(totalValue / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-primary">Tổng giá trị</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inventory">Tồn kho</TabsTrigger>
            <TabsTrigger value="entries">Lịch sử nhập</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm sản phẩm..."
                      className="pl-9"
                      value={inventorySearchTerm}
                      onChange={(e) => setInventorySearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      Cảnh báo:
                    </span>
                    <Input
                      type="number"
                      value={lowStockThreshold}
                      onChange={(e) =>
                        setLowStockThreshold(Number(e.target.value))
                      }
                      className="w-20"
                      min="1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Danh sách tồn kho ({filteredInventory.length})
                  {lowStockCount > 0 && (
                    <span className="ml-2 text-sm font-normal text-destructive">
                      ({lowStockCount} sản phẩm sắp hết)
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredInventory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Không có sản phẩm nào
                  </div>
                ) : (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                              Sản phẩm
                            </th>
                            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                              Danh mục
                            </th>
                            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                              Giá
                            </th>
                            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                              Tồn kho
                            </th>
                            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                              Giá trị
                            </th>
                            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                              Trạng thái
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredInventory.map((item) => (
                            <tr
                              key={item.id}
                              className={`border-b border-border last:border-0 ${
                                item.lowStock || item.isLowStock
                                  ? "bg-destructive/5"
                                  : ""
                              }`}
                            >
                              <td className="py-4">
                                <div className="flex items-center gap-2">
                                  {(item.lowStock || item.isLowStock) && (
                                    <AlertTriangle className="h-4 w-4 text-destructive" />
                                  )}
                                  <span className="text-sm font-medium text-foreground">
                                    {item.productName}
                                  </span>
                                </div>
                              </td>
                              <td className="py-4 text-sm text-muted-foreground">
                                {item.category}
                              </td>
                              <td className="py-4 text-sm text-foreground">
                                {formatVND(item.price)}₫
                              </td>
                              <td className="py-4 text-sm text-foreground">
                                {item.quantity}
                              </td>
                              <td className="py-4 text-sm font-medium text-foreground">
                                {formatVND(item.price * item.quantity)}₫
                              </td>
                              <td className="py-4">
                                <Badge
                                  variant={
                                    item.lowStock || item.isLowStock
                                      ? "destructive"
                                      : "default"
                                  }
                                >
                                  {item.lowStock || item.isLowStock
                                    ? "Sắp hết"
                                    : "Đủ hàng"}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3">
                      {filteredInventory.map((item) => (
                        <div
                          key={item.id}
                          className={`rounded-lg border border-border p-4 space-y-2 ${
                            item.lowStock || item.isLowStock
                              ? "bg-destructive/5 border-destructive/30"
                              : ""
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              {(item.lowStock || item.isLowStock) && (
                                <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />
                              )}
                              <div className="min-w-0">
                                <h3 className="font-medium text-foreground truncate">
                                  {item.productName}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                  {item.category}
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={
                                item.lowStock || item.isLowStock
                                  ? "destructive"
                                  : "default"
                              }
                              className="text-xs flex-shrink-0"
                            >
                              {item.lowStock || item.isLowStock
                                ? "Sắp hết"
                                : "Đủ hàng"}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-sm pt-2">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Giá
                              </p>
                              <p className="font-medium">
                                {formatVND(item.price)}₫
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Tồn kho
                              </p>
                              <p className="font-medium">{item.quantity}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Giá trị
                              </p>
                              <p className="font-medium">
                                {formatVND(item.price * item.quantity)}₫
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="entries" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm mã phiếu, nhà cung cấp..."
                    className="pl-9"
                    value={entriesSearchTerm}
                    onChange={(e) => {
                      setEntriesSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lịch sử nhập kho ({stockEntries.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : stockEntries.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Chưa có phiếu nhập kho nào
                  </div>
                ) : (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                              Mã phiếu
                            </th>
                            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                              Sản phẩm
                            </th>
                            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                              Số lượng
                            </th>
                            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                              Đơn giá
                            </th>
                            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                              Tổng tiền
                            </th>
                            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                              Nhà cung cấp
                            </th>
                            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                              Ngày nhập
                            </th>
                            <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                              Thao tác
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {stockEntries.map((entry) => (
                            <tr
                              key={entry.id}
                              className="border-b border-border last:border-0"
                            >
                              <td className="py-4 text-sm font-medium text-foreground">
                                {entry.entryCode}
                              </td>
                              <td className="py-4 text-sm text-foreground">
                                {entry.product?.productName}
                              </td>
                              <td className="py-4 text-sm text-foreground">
                                {entry.quantity}
                              </td>
                              <td className="py-4 text-sm text-foreground">
                                {formatVND(
                                  parseFloat(entry.unitPrice.toString())
                                )}
                                ₫
                              </td>
                              <td className="py-4 text-sm font-medium text-foreground">
                                {formatVND(
                                  parseFloat(entry.totalPrice.toString())
                                )}
                                ₫
                              </td>
                              <td className="py-4 text-sm text-muted-foreground">
                                {entry.supplier || "-"}
                              </td>
                              <td className="py-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(entry.entryDate).toLocaleDateString(
                                    "vi-VN"
                                  )}
                                </div>
                              </td>
                              <td className="py-4 text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleDeleteStockEntry(entry.id)
                                  }
                                  title="Xóa phiếu nhập"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3">
                      {stockEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="rounded-lg border border-border p-4 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h3 className="font-medium text-foreground">
                                {entry.entryCode}
                              </h3>
                              <p className="text-xs text-muted-foreground truncate">
                                {entry.product?.productName}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteStockEntry(entry.id)}
                              className="h-8 px-2 text-destructive hover:text-destructive flex-shrink-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Số lượng
                              </p>
                              <p className="font-medium">{entry.quantity}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Đơn giá
                              </p>
                              <p className="font-medium">
                                {formatVND(
                                  parseFloat(entry.unitPrice.toString())
                                )}
                                ₫
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Tổng tiền
                              </p>
                              <p className="font-medium">
                                {formatVND(
                                  parseFloat(entry.totalPrice.toString())
                                )}
                                ₫
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Ngày nhập
                              </p>
                              <p className="font-medium flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(entry.entryDate).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </p>
                            </div>
                          </div>

                          {entry.supplier && (
                            <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                              NCC: {entry.supplier}
                            </div>
                          )}
                        </div>
                      ))}
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
          </TabsContent>
        </Tabs>
      </div>

      <StockEntryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSaveStockEntry}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Xác nhận xóa phiếu nhập"
        description="Bạn có chắc muốn xóa phiếu nhập này? Số lượng sản phẩm sẽ được hoàn lại."
        onConfirm={confirmDeleteEntry}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
      />
    </DashboardLayout>
  );
}
