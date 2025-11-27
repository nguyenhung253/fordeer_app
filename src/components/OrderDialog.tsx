import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { productService } from "@/services/productService";
import { orderService } from "@/services/orderService";
import { Loader2, Plus, Trash2 } from "lucide-react";
import type { Product } from "@/types/api";

interface OrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: () => void;
}

interface OrderItem {
  productId: number;
  quantity: number;
  selectedProductName?: string;
}

const formatVND = (num: number) => {
  return num.toLocaleString("vi-VN");
};

export function OrderDialog({ open, onOpenChange, onSave }: OrderDialogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  const [discount, setDiscount] = useState("");

  const [items, setItems] = useState<OrderItem[]>([
    { productId: 0, quantity: 1, selectedProductName: "" },
  ]);

  useEffect(() => {
    if (open) {
      fetchData();
      // Reset form
      setCustomerInfo({ fullName: "", phone: "", address: "" });
      setDiscount("");
      setItems([{ productId: 0, quantity: 1, selectedProductName: "" }]);
    }
  }, [open]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const productsRes = await productService.getAll({ limit: 100 });
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      toast.error("Không thể tải dữ liệu. Vui lòng thử lại!");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      { productId: 0, quantity: 1, selectedProductName: "" },
    ]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotal = () => {
    let total = 0;
    items.forEach((item) => {
      if (item.productId > 0) {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          total += product.price * item.quantity;
        }
      }
    });
    const discountValue = parseFloat(discount) || 0;
    return Math.max(0, total - discountValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerInfo.fullName.trim()) {
      toast.warning("Vui lòng nhập tên khách hàng");
      return;
    }

    if (!customerInfo.phone.trim()) {
      toast.warning("Vui lòng nhập số điện thoại");
      return;
    }

    const validItems = items.filter(
      (item) => item.productId > 0 && item.quantity > 0
    );
    if (validItems.length === 0) {
      toast.warning("Vui lòng thêm ít nhất một sản phẩm");
      return;
    }

    try {
      setSubmitting(true);

      // Validate stock
      for (const item of validItems) {
        const product = products.find((p) => p.id === item.productId);
        if (product && product.quantity < item.quantity) {
          toast.error(
            `Sản phẩm "${product.productName}" chỉ còn ${product.quantity} trong kho!`
          );
          setSubmitting(false);
          return;
        }
      }

      await orderService.create({
        customerInfo: {
          fullName: customerInfo.fullName.trim(),
          phone: customerInfo.phone.trim(),
          address: customerInfo.address.trim() || undefined,
        },
        items: validItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        discount: parseFloat(discount) || 0,
      });

      toast.success("Tạo đơn hàng thành công!");
      if (onSave) onSave();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error creating order:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Lỗi khi tạo đơn hàng";
      toast.error(
        typeof errorMessage === "string"
          ? errorMessage
          : JSON.stringify(errorMessage)
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo đơn hàng mới</DialogTitle>
          <DialogDescription>Nhập thông tin đơn hàng</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {/* Customer Info */}
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Thông tin khách hàng
                </Label>
                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Tên khách hàng *</Label>
                    <Input
                      id="fullName"
                      value={customerInfo.fullName}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          fullName: e.target.value,
                        })
                      }
                      placeholder="Nhập tên khách hàng"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <Input
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          phone: e.target.value,
                        })
                      }
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Input
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          address: e.target.value,
                        })
                      }
                      placeholder="Nhập địa chỉ (không bắt buộc)"
                    />
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Sản phẩm *</Label>
                  <Button type="button" size="sm" onClick={addItem}>
                    <Plus className="h-4 w-4 mr-1" />
                    Thêm sản phẩm
                  </Button>
                </div>

                {items.map((item, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <Select
                        value={item.productId.toString()}
                        onValueChange={(value) => {
                          const selected = products.find(
                            (p) => p.id.toString() === value
                          );
                          const newItems = [...items];
                          newItems[index] = {
                            ...newItems[index],
                            productId: Number(value),
                            selectedProductName: selected
                              ? `${selected.productName} - ${formatVND(
                                  selected.price
                                )}₫`
                              : "",
                          };
                          setItems(newItems);
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <span className="text-left truncate">
                            {item.selectedProductName || "Chọn sản phẩm"}
                          </span>
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                          {products.length === 0 ? (
                            <div className="p-2 text-sm text-muted-foreground">
                              Không có sản phẩm
                            </div>
                          ) : (
                            products.map((product) => (
                              <SelectItem
                                key={product.id}
                                value={product.id.toString()}
                              >
                                {product.productName} -{" "}
                                {formatVND(product.price)}₫ (Còn:{" "}
                                {product.quantity})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", Number(e.target.value))
                      }
                      placeholder="SL"
                      min="1"
                      className="w-24"
                    />
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeItem(index)}
                        className="border-destructive/50 hover:bg-destructive/10 hover:border-destructive"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="discount">Giảm giá (₫)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="Nhập số tiền giảm giá"
                  min="0"
                />
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Tổng tiền:</span>
                  <span className="text-primary">
                    {formatVND(calculateTotal())}₫
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={submitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  "Tạo đơn hàng"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
