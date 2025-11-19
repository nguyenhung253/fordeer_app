import { useState, useEffect } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Loader2, Eye, EyeOff } from "lucide-react";
import { productService } from "@/services/productService";
import { ProductDialog } from "@/components/ProductDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import type { Product } from "@/types/api";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showInactive, setShowInactive] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        isActive: !showInactive ? true : undefined,
      });
      setProducts(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, showInactive]);

  const handleToggleActive = async (product: Product) => {
    const action = product.isActive ? "ẩn" : "hiện";
    try {
      await productService.update(product.id, { isActive: !product.isActive });
      toast.success(`${action.charAt(0).toUpperCase() + action.slice(1)} sản phẩm thành công!`);
      // If hiding product and on page > 1, check if need to go back
      if (product.isActive && products.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        await fetchProducts();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Lỗi khi ${action} sản phẩm`);
    }
  };

  const handleDelete = (id: number) => {
    setProductToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      await productService.delete(productToDelete);
      toast.success("Xóa sản phẩm thành công!");
      if (products.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        await fetchProducts();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi xóa sản phẩm");
    } finally {
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleSave = async (productData: any) => {
    try {
      if (selectedProduct) {
        await productService.update(selectedProduct.id, productData);
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        await productService.create(productData);
        toast.success("Thêm sản phẩm thành công!");
      }
      fetchProducts();
      setDialogOpen(false);
      setSelectedProduct(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi lưu sản phẩm");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Quản lý sản phẩm
            </h1>
            <p className="text-muted-foreground">
              Quản lý danh sách sản phẩm đồ uống
            </p>
          </div>
          <Button
            className="gap-2"
            onClick={() => {
              setSelectedProduct(null);
              setDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Thêm sản phẩm
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
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
                {showInactive ? "Hiện đã ẩn" : "Hiện tất cả"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách sản phẩm ({products.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Không có sản phẩm nào
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                          Tên sản phẩm
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
                          Trạng thái
                        </th>
                        <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="py-4 text-sm font-medium text-foreground">
                            {product.productName}
                          </td>
                          <td className="py-4 text-sm text-muted-foreground">
                            {product.category}
                          </td>
                          <td className="py-4 text-sm text-foreground">
                            ₫{product.price.toLocaleString()}
                          </td>
                          <td className="py-4 text-sm text-foreground">
                            {product.quantity}
                          </td>
                          <td className="py-4">
                            <div className="flex gap-2">
                              <Badge
                                variant={
                                  product.quantity > 10
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {product.quantity > 10 ? "Còn hàng" : "Sắp hết"}
                              </Badge>
                              {!product.isActive && (
                                <Badge variant="secondary">Đã ẩn</Badge>
                              )}
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(product)}
                                title="Sửa"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleToggleActive(product)}
                                title={product.isActive ? "Ẩn" : "Hiện"}
                              >
                                {product.isActive ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <Eye className="h-4 w-4 text-primary" />
                                )}
                              </Button>
                              {!product.isActive && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(product.id)}
                                  title="Xóa vĩnh viễn"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
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

      <ProductDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={selectedProduct}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Xác nhận xóa sản phẩm"
        description="Bạn có chắc muốn xóa vĩnh viễn sản phẩm này? Hành động này không thể hoàn tác."
        onConfirm={confirmDelete}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
      />
    </DashboardLayout>
  );
}
