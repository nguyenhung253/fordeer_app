import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { productService } from "@/services/productService";
import type { Product } from "@/types/api";

interface StockEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => Promise<void>;
}

export function StockEntryDialog({
  open,
  onOpenChange,
  onSave,
}: StockEntryDialogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState("");
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    unitPrice: "",
    supplier: "",
    notes: "",
    entryDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (open) {
      fetchProducts();
    }
  }, [open]);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAll({ limit: 1000 });
      setProducts(response.data);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.productId) {
      toast.warning("Vui lòng chọn sản phẩm");
      return;
    }
    if (!formData.quantity || parseInt(formData.quantity) < 1) {
      toast.warning("Vui lòng nhập số lượng hợp lệ");
      return;
    }
    if (!formData.unitPrice || parseFloat(formData.unitPrice) < 0) {
      toast.warning("Vui lòng nhập đơn giá hợp lệ");
      return;
    }
    
    setLoading(true);
    try {
      await onSave({
        productId: parseInt(formData.productId),
        quantity: parseInt(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice),
        supplier: formData.supplier || undefined,
        notes: formData.notes || undefined,
        entryDate: formData.entryDate,
      });
      setFormData({
        productId: "",
        quantity: "",
        unitPrice: "",
        supplier: "",
        notes: "",
        entryDate: new Date().toISOString().split("T")[0],
      });
      setSelectedProductName("");
    } catch (error) {
      console.error("Error creating stock entry:", error);
      // Error will be handled by parent component
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = formData.quantity && formData.unitPrice
    ? parseInt(formData.quantity) * parseFloat(formData.unitPrice)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle>Tạo phiếu nhập kho</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productId">Sản phẩm *</Label>
            <Select
              value={formData.productId}
              onValueChange={(value) => {
                const selected = products.find((p) => p.id.toString() === value);
                setFormData({ ...formData, productId: value });
                setSelectedProductName(
                  selected ? `${selected.productName} - ${selected.category}` : ""
                );
              }}
            >
              <SelectTrigger className="w-full">
                <span className="text-left truncate">
                  {selectedProductName || "Chọn sản phẩm"}
                </span>
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.productName} - {product.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Số lượng *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitPrice">Đơn giá *</Label>
              <Input
                id="unitPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.unitPrice}
                onChange={(e) =>
                  setFormData({ ...formData, unitPrice: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tổng tiền</Label>
            <div className="text-lg font-bold text-primary">
              ₫{totalPrice.toLocaleString()}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier">Nhà cung cấp</Label>
            <Input
              id="supplier"
              value={formData.supplier}
              onChange={(e) =>
                setFormData({ ...formData, supplier: e.target.value })
              }
              placeholder="Tên nhà cung cấp"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="entryDate">Ngày nhập *</Label>
            <Input
              id="entryDate"
              type="date"
              value={formData.entryDate}
              onChange={(e) =>
                setFormData({ ...formData, entryDate: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Ghi chú thêm..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-background pb-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : "Tạo phiếu nhập"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
