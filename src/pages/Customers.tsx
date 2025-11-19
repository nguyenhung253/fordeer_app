import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Mail, Phone, Loader2, RotateCcw } from "lucide-react";
import { customerService } from "@/services/customerService";
import { CustomerDialog } from "@/components/CustomerDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import type { Customer } from "@/types/api";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<number | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });

  const fetchStats = async () => {
    try {
      // Fetch all customers without pagination to get accurate stats
      const allCustomersResponse = await customerService.getAll({
        page: 1,
        limit: 9999, // Get all customers
      });
      
      const allCustomers = allCustomersResponse.data;
      setStats({
        total: allCustomersResponse.pagination.totalItems,
        active: allCustomers.filter((c) => c.isActive).length,
        inactive: allCustomers.filter((c) => !c.isActive).length,
      });
    } catch (error) {
      console.error("Lỗi khi tải thống kê:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await customerService.getAll({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        isActive: !showInactive ? true : undefined,
      });
      setCustomers(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error("Lỗi khi tải khách hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, searchTerm, showInactive]);

  const handleDelete = (id: number) => {
    setCustomerToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;
    
    try {
      await customerService.delete(customerToDelete);
      toast.success("Xóa khách hàng thành công!");
      fetchCustomers();
      fetchStats(); // Update stats after delete
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa khách hàng");
    } finally {
      setDeleteConfirmOpen(false);
      setCustomerToDelete(null);
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await customerService.restore(id);
      toast.success("Khôi phục khách hàng thành công!");
      fetchCustomers();
      fetchStats(); // Update stats after restore
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi khôi phục khách hàng");
    }
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };

  const handleSave = async (customerData: any) => {
    try {
      if (selectedCustomer) {
        await customerService.update(selectedCustomer.id, customerData);
        toast.success("Cập nhật khách hàng thành công!");
      } else {
        await customerService.create(customerData);
        toast.success("Thêm khách hàng thành công!");
      }
      fetchCustomers();
      fetchStats(); // Update stats after save
      setDialogOpen(false);
      setSelectedCustomer(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi lưu khách hàng");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Quản lý khách hàng
            </h1>
            <p className="text-muted-foreground">
              Quản lý thông tin khách hàng
            </p>
          </div>
          <Button
            className="gap-2"
            onClick={() => {
              setSelectedCustomer(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Thêm khách hàng
          </Button>
        </div>

        {!loading && (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Tổng khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stats.total}
                </div>
                <p className="text-xs text-primary">Tổng số khách hàng</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Đang hoạt động
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stats.active}
                </div>
                <p className="text-xs text-primary">Khách hàng active</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Đã xóa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stats.inactive}
                </div>
                <p className="text-xs text-muted-foreground">Khách hàng inactive</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm khách hàng..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <Button
                variant={showInactive ? "default" : "outline"}
                onClick={() => setShowInactive(!showInactive)}
              >
                {showInactive ? "Hiện tất cả" : "Hiện đã xóa"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách khách hàng ({customers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : customers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Không có khách hàng nào
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                          Mã KH
                        </th>
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                          Khách hàng
                        </th>
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                          Liên hệ
                        </th>
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                          Địa chỉ
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
                      {customers.map((customer) => (
                        <tr
                          key={customer.id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="py-4 text-sm font-medium text-foreground">
                            {customer.customerCode}
                          </td>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                <span className="text-sm font-semibold text-primary">
                                  {customer.fullName.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {customer.fullName}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                {customer.email}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="h-3 w-3" />
                                {customer.phone}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-muted-foreground">
                            {customer.address || "-"}
                          </td>
                          <td className="py-4">
                            <Badge
                              variant={customer.isActive ? "default" : "destructive"}
                            >
                              {customer.isActive ? "Hoạt động" : "Đã xóa"}
                            </Badge>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end gap-2">
                              {customer.isActive ? (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleEdit(customer)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(customer.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRestore(customer.id)}
                                  title="Khôi phục"
                                >
                                  <RotateCcw className="h-4 w-4 text-primary" />
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

      <CustomerDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        customer={selectedCustomer}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Xác nhận xóa khách hàng"
        description="Bạn có chắc muốn xóa khách hàng này? Hành động này không thể hoàn tác."
        onConfirm={confirmDelete}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
      />
      
    </DashboardLayout>
  );
}
