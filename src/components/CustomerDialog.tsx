import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import type { Customer } from "@/types/api";

interface CustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: Customer | null;
  onSave?: (customer: any) => void;
}

export function CustomerDialog({
  open,
  onOpenChange,
  customer,
  onSave,
}: CustomerDialogProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    birthYear: undefined as number | undefined,
    address: "",
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        birthYear: customer.birthYear,
        address: customer.address || "",
      });
    } else {
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        birthYear: undefined,
        address: "",
      });
    }
  }, [customer, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {customer ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
          </DialogTitle>
          <DialogDescription>
            {customer
              ? "Cập nhật thông tin khách hàng"
              : "Nhập thông tin khách hàng mới"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="Nhập họ và tên"
                required
                minLength={2}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Nhập email"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="0901234567"
                  required
                  pattern="[0-9]{10,11}"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="birthYear">Năm sinh</Label>
                <Input
                  id="birthYear"
                  type="number"
                  value={formData.birthYear || ""}
                  onChange={(e) =>
                    setFormData({ 
                      ...formData, 
                      birthYear: e.target.value ? Number(e.target.value) : undefined 
                    })
                  }
                  placeholder="1990"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Nhập địa chỉ (tùy chọn)"
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
            <Button type="submit">{customer ? "Cập nhật" : "Thêm mới"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
