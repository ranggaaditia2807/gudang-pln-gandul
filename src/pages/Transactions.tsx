
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, ArrowUp, ArrowDown, Calendar } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

const sampleTransactions = [
  {
    id: "TXN001",
    type: "in",
    item: "Kabel XLPE 150mm", 
    quantity: 20,
    date: "2024-01-15",
    operator: "Ahmad Rizki",
    notes: "Pengadaan rutin Q1"
  },
  {
    id: "TXN002", 
    type: "out",
    item: "Isolator Keramik 20kV",
    quantity: 5,
    date: "2024-01-14",
    operator: "Siti Nurhaliza",
    notes: "Proyek Gardu Induk Cibinong"
  },
  {
    id: "TXN003",
    type: "in", 
    item: "Trafo Distribusi 400kVA",
    quantity: 2,
    date: "2024-01-13",
    operator: "Budi Santoso",
    notes: "Pengadaan khusus"
  },
  {
    id: "TXN004",
    type: "out",
    item: "Panel Distribusi 20kV", 
    quantity: 3,
    date: "2024-01-12",
    operator: "Maya Sari",
    notes: "Maintenance rutin"
  }
];

export default function Transactions() {
  const { user, hasPermission } = useUser();
  const canEdit = user && hasPermission('owner');

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
          <Button>
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
            <div className="text-2xl font-bold">12</div>
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
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-success">
              +2 dari kemarin
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Barang Keluar</CardTitle>
            <ArrowDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              -1 dari kemarin
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
          {sampleTransactions.map((transaction) => (
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
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="in" className="space-y-4">
          {sampleTransactions
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="out" className="space-y-4">
          {sampleTransactions
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
