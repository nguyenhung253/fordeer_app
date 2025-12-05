import { useState, useEffect, useRef } from "react";
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
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, X } from "lucide-react";
import type { Product } from "@/types/api";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSave?: (formData: FormData) => void;
}

export function ProductDialog({
  open,
  onOpenChange,
  product,
  onSave,
}: ProductDialogProps) {
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName,
        category: product.category,
        price: product.price.toString(),
        quantity: product.quantity.toString(),
        description: product.description || "",
      });
      setImagePreview(product.productUrl || null);
    } else {
      setFormData({
        productName: "",
        category: "",
        price: "",
        quantity: "",
        description: "",
      });
      setImagePreview(null);
    }
    setImageFile(null);
  }, [product, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(product?.productUrl || null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      const data = new FormData();
      data.append("productName", formData.productName);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("quantity", formData.quantity);
      data.append("description", formData.description);
      if (imageFile) {
        data.append("image", imageFile);
      }
      onSave(data);
    }
    // Don't close dialog here - let parent handle it after save completes
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </DialogTitle>
          <DialogDescription>
            {product
              ? "Cập nhật thông tin sản phẩm"
              : "Nhập thông tin sản phẩm mới"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Image Upload */}
            <div className="grid gap-2">
              <Label>Hình ảnh sản phẩm</Label>
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-24 w-24 rounded-lg object-cover border"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-24 w-24 rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-1 hover:border-primary/50 transition-colors"
                  >
                    <ImagePlus className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Tải ảnh
                    </span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Đổi ảnh
                  </Button>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="productName">Tên sản phẩm</Label>
              <Input
                id="productName"
                value={formData.productName}
                onChange={(e) =>
                  setFormData({ ...formData, productName: e.target.value })
                }
                placeholder="Nhập tên sản phẩm"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Danh mục</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cà phê">Cà phê</SelectItem>
                  <SelectItem value="Trà sữa">Trà sữa</SelectItem>
                  <SelectItem value="Trà">Trà</SelectItem>
                  <SelectItem value="Nước ép">Nước ép</SelectItem>
                  <SelectItem value="Latte">Latte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Giá (₫)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="Nhập giá sản phẩm"
                  min="0"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="quantity">Tồn kho</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  placeholder="Nhập số lượng"
                  min="0"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Nhập mô tả sản phẩm (tùy chọn)"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit">{product ? "Cập nhật" : "Thêm mới"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
