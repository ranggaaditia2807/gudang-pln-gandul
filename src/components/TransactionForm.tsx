import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Transaction {
  id?: string;
  type: "in" | "out";
  item: string;
  quantity: number;
  date: string;
  operator: string;
  notes: string;
}

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
  transaction?: Transaction;
  mode: "add" | "edit";
}

export default function TransactionForm({ isOpen, onClose, onSave, transaction, mode }: TransactionFormProps) {
  const [formData, setFormData] = useState<Omit<Transaction, 'id'>>(
    transaction ? {
      type: transaction.type,
      item: transaction.item,
      quantity: transaction.quantity,
      date: transaction.date,
      operator: transaction.operator,
      notes: transaction.notes
    } : {
      type: "in",
      item: "",
      quantity: 0,
      date: new Date().toISOString().split('T')[0],
      operator: "",
      notes: ""
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (field: keyof Omit<Transaction, 'id'>, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Tambah Transaksi Baru" : "Edit Transaksi"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Masukkan detail transaksi baru."
              : "Edit detail transaksi yang dipilih."
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Tipe
              </Label>
              <Select value={formData.type} onValueChange={(value: "in" | "out") => handleChange("type", value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih tipe transaksi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">Barang Masuk</SelectItem>
                  <SelectItem value="out">Barang Keluar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item" className="text-right">
                Barang
              </Label>
              <Input
                id="item"
                value={formData.item}
                onChange={(e) => handleChange("item", e.target.value)}
                className="col-span-3"
                placeholder="Nama barang"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Jumlah
              </Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", parseInt(e.target.value) || 0)}
                className="col-span-3"
                placeholder="Jumlah unit"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Tanggal
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="operator" className="text-right">
                Operator
              </Label>
              <Input
                id="operator"
                value={formData.operator}
                onChange={(e) => handleChange("operator", e.target.value)}
                className="col-span-3"
                placeholder="Nama operator"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Catatan
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="col-span-3"
                placeholder="Catatan tambahan"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              {mode === "add" ? "Tambah" : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
