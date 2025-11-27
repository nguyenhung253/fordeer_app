import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  Eye,
  ChevronUp,
} from "lucide-react";
import { productService } from "@/services/productService";
import { ProductDialog } from "@/components/ProductDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { formatVND } from "@/lib/utils";
import type { Product } from "@/types/api";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [expandedProducts, setExpandedProducts] = useState<Set<number>>(
    new Set()
  );

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAll({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
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
  }, [currentPage, searchTerm]);

  const toggleExpand = (productId: number) => {
    setExpandedProducts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
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
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Quản lý sản phẩm
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Quản lý danh sách sản phẩm đồ uống
            </p>
          </div>
          <Button
            className="gap-2 w-fit"
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
            <div className="relative">
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
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
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
                        <React.Fragment key={product.id}>
                          <tr className="border-b border-border last:border-0">
                            <td className="py-4 text-sm font-medium text-foreground">
                              {product.productName}
                            </td>
                            <td className="py-4 text-sm text-muted-foreground">
                              {product.category}
                            </td>
                            <td className="py-4 text-sm text-foreground">
                              {formatVND(product.price)}₫
                            </td>
                            <td className="py-4 text-sm text-foreground">
                              {product.quantity}
                            </td>
                            <td className="py-4">
                              <Badge
                                variant={
                                  product.quantity > 10
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {product.quantity > 10 ? "Còn hàng" : "Sắp hết"}
                              </Badge>
                            </td>
                            <td className="py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => toggleExpand(product.id)}
                                  title={
                                    expandedProducts.has(product.id)
                                      ? "Ẩn chi tiết"
                                      : "Xem chi tiết"
                                  }
                                >
                                  {expandedProducts.has(product.id) ? (
                                    <ChevronUp className="h-4 w-4 text-primary" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </Button>
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
                                  onClick={() => handleDelete(product.id)}
                                  title="Xóa"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                          {expandedProducts.has(product.id) && (
                            <tr className="bg-muted/30">
                              <td colSpan={6} className="py-4 px-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <p className="text-muted-foreground">
                                      Mã sản phẩm
                                    </p>
                                    <p className="font-medium">
                                      SP-{product.id}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">
                                      Giá trị tồn kho
                                    </p>
                                    <p className="font-medium">
                                      {formatVND(
                                        product.price * product.quantity
                                      )}
                                      ₫
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">
                                      Ngày tạo
                                    </p>
                                    <p className="font-medium">
                                      {new Date(
                                        product.createdAt
                                      ).toLocaleDateString("vi-VN")}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">
                                      Cập nhật lần cuối
                                    </p>
                                    <p className="font-medium">
                                      {new Date(
                                        product.updatedAt
                                      ).toLocaleDateString("vi-VN")}
                                    </p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="rounded-lg border border-border p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-foreground truncate">
                            {product.productName}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            {product.category}
                          </p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <Badge
                            variant={
                              product.quantity > 10 ? "default" : "destructive"
                            }
                            className="text-xs"
                          >
                            {product.quantity > 10 ? "Còn hàng" : "Sắp hết"}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex gap-4">
                          <div>
                            <span className="text-muted-foreground">Giá: </span>
                            <span className="font-medium text-foreground">
                              {formatVND(product.price)}₫
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Kho: </span>
                            <span className="font-medium text-foreground">
                              {product.quantity}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Expanded details for mobile */}
                      {expandedProducts.has(product.id) && (
                        <div className="bg-muted/30 rounded-lg p-3 text-sm space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Mã SP:
                            </span>
                            <span className="font-medium">SP-{product.id}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Giá trị kho:
                            </span>
                            <span className="font-medium">
                              {formatVND(product.price * product.quantity)}₫
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Ngày tạo:
                            </span>
                            <span className="font-medium">
                              {new Date(product.createdAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end gap-1 pt-2 border-t border-border">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(product.id)}
                          className="h-8 px-2"
                        >
                          {expandedProducts.has(product.id) ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-1 text-primary" />
                              Ẩn
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-1 text-muted-foreground" />
                              Chi tiết
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          className="h-8 px-2"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Sửa
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          className="h-8 px-2 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Xóa
                        </Button>
                      </div>
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
