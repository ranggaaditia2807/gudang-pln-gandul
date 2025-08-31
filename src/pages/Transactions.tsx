import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, ArrowUp, ArrowDown, Calendar, Edit, Eye } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import TransactionForm from "@/components/TransactionForm";
import { useTransactions } from "@/contexts/TransactionContext";

export default function Transactions() {
  const { user, hasPermission } = useUser();
  const canEdit = user && hasPermission('owner');

  const {
    transactions,
    addTransaction,
    updateTransaction,
  } = useTransactions();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [selectedTransaction, setSelectedTransaction] = useState<typeof transactions[0] | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const getTransactionIcon = (type: string) => {
    return type === "in" ? (
      <ArrowUp className="h-4 w-4 text-success" />
    ) : (
      <ArrowDown className="h-4 w-4 text-destructive" />
    );
  };

  const getTransactionBadge = (type: string) => {
    return type === "in" ? (
      <Badge className="bg-success text-success-foreground">
        Barang Masuk
      </Badge>
    ) : (
      <Badge variant="destructive">
        Barang Keluar
      </Badge>
    );
  };

  const openAddForm = () => {
    setFormMode("add");
    setSelectedTransaction(null);
    setIsFormOpen(true);
  };

  const openEditForm = (transaction: typeof transactions[0]) => {
    setFormMode("edit");
    setSelectedTransaction(transaction);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedTransaction(null);
  };

  const saveTransaction = (transaction: Omit<typeof transactions[0], 'id'>) => {
    if (formMode === "add") {
      addTransaction(transaction);
    } else if (formMode === "edit" && selectedTransaction) {
      updateTransaction(selectedTransaction.id, transaction);
    }
  };

  const openDetail = (transaction: typeof transactions[0]) => {
    setSelectedTransaction(transaction);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setSelectedTransaction(null);
    setIsDetailOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Transaksi</h1>
          <p className="text-muted-foreground">
            Kelola transaksi barang masuk dan keluar
          </p>
        </div>
        {canEdit && (
          <Button onClick={openAddForm}>
            <Plus className="mr-2 h-4 w-4" />
            Transaksi Baru
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hari Ini</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground">
              Transaksi
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Barang Masuk</CardTitle>
            <ArrowUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transactions.filter(t => t.type === "in").reduce((sum, t) => sum + t.quantity, 0)}
            </div>
            <p className="text-xs text-success">
              {/* TODO: Tambahkan perbandingan dengan hari sebelumnya */}
              +0 dari kemarin
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Barang Keluar</CardTitle>
            <ArrowDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transactions.filter(t => t.type === "out").reduce((sum, t) => sum + t.quantity, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {/* TODO: Tambahkan perbandingan dengan hari sebelumnya */}
              -0 dari kemarin
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions List */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">Semua Transaksi</TabsTrigger>
          <TabsTrigger value="in">Barang Masuk</TabsTrigger>
          <TabsTrigger value="out">Barang Keluar</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {transactions.map((transaction) => (
            <Card key={transaction.id} className="border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="mt-1">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold">{transaction.item}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>ID: {transaction.id}</span>
                        <span>•</span>
                        <span>{transaction.date}</span>
                        <span>•</span>
                        <span>Operator: {transaction.operator}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {transaction.notes}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    {getTransactionBadge(transaction.type)}
                    <div className="text-lg font-semibold">
                      {transaction.quantity} unit
                    </div>
                    {canEdit && (
                      <div className="flex justify-end space-x-2 mt-2">
                        <Button size="sm" variant="outline" onClick={() => openDetail(transaction)}>
                          <Eye className="h-4 w-4" />
                          Detail
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => openEditForm(transaction)}>
                          <Edit className="h-4 w-4" />
                          Edit
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="in" className="space-y-4">
          {transactions
            .filter(t => t.type === "in")
            .map((transaction) => (
              <Card key={transaction.id} className="border-0 shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="mt-1">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold">{transaction.item}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>ID: {transaction.id}</span>
                          <span>•</span>
                          <span>{transaction.date}</span>
                          <span>•</span>
                          <span>Operator: {transaction.operator}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {transaction.notes}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      {getTransactionBadge(transaction.type)}
                      <div className="text-lg font-semibold">
                        {transaction.quantity} unit
                      </div>
                      {canEdit && (
                        <div className="flex justify-end space-x-2 mt-2">
                          <Button size="sm" variant="outline" onClick={() => openDetail(transaction)}>
                            <Eye className="h-4 w-4" />
                            Detail
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => openEditForm(transaction)}>
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="out" className="space-y-4">
          {transactions
            .filter(t => t.type === "out")
            .map((transaction) => (
              <Card key={transaction.id} className="border-0 shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="mt-1">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold">{transaction.item}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>ID: {transaction.id}</span>
                          <span>•</span>
                          <span>{transaction.date}</span>
                          <span>•</span>
                          <span>Operator: {transaction.operator}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {transaction.notes}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      {getTransactionBadge(transaction.type)}
                      <div className="text-lg font-semibold">
                        {transaction.quantity} unit
                      </div>
                      {canEdit && (
                        <div className="flex justify-end space-x-2 mt-2">
                          <Button size="sm" variant="outline" onClick={() => openDetail(transaction)}>
                            <Eye className="h-4 w-4" />
                            Detail
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => openEditForm(transaction)}>
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>

      <TransactionForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSave={saveTransaction}
        transaction={selectedTransaction || undefined}
        mode={formMode}
      />

      {isDetailOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Detail Transaksi</h2>
            <p><strong>ID:</strong> {selectedTransaction.id}</p>
            <p><strong>Tipe:</strong> {selectedTransaction.type === "in" ? "Barang Masuk" : "Barang Keluar"}</p>
            <p><strong>Barang:</strong> {selectedTransaction.item}</p>
            <p><strong>Jumlah:</strong> {selectedTransaction.quantity} unit</p>
            <p><strong>Tanggal:</strong> {selectedTransaction.date}</p>
            <p><strong>Operator:</strong> {selectedTransaction.operator}</p>
            <p><strong>Catatan:</strong> {selectedTransaction.notes}</p>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Tutup</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
