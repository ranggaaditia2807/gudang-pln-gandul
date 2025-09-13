import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, BarChart3, Calendar, TrendingUp, Plus, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useWarehouse } from "@/contexts/WarehouseContext";
import { useToast } from "@/hooks/use-toast";
import React from "react";

let useTransactionsSafe;
try {
  useTransactionsSafe = require("@/contexts/TransactionContext").useTransactions;
} catch (e) {
  useTransactionsSafe = () => {
    throw new Error("useTransactions must be used within a TransactionProvider. Pastikan aplikasi dibungkus dengan TransactionProvider.");
  };
}

const reportTypes = [
  {
    id: "inventory",
    title: "Laporan Inventaris",
    description: "Ringkasan stok barang terkini",
    icon: BarChart3,
    color: "text-primary"
  },
  {
    id: "transactions",
    title: "Laporan Transaksi",
    description: "Riwayat barang masuk dan keluar",
    icon: TrendingUp,
    color: "text-success"
  },
  {
    id: "monthly",
    title: "Laporan Bulanan",
    description: "Ringkasan aktivitas per bulan",
    icon: Calendar,
    color: "text-warning"
  },
  {
    id: "custom",
    title: "Laporan Kustom",
    description: "Buat laporan sesuai kebutuhan",
    icon: FileText,
    color: "text-accent"
  }
];

export default function Reports() {
  let transactionsContext;
  try {
    transactionsContext = useTransactionsSafe();
  } catch (error) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded">
        <h2>Error</h2>
        <p>{error.message}</p>
        <p>Pastikan aplikasi dibungkus dengan <code>TransactionProvider</code> agar laporan dapat diakses.</p>
      </div>
    );
  }

  const { getInventoryReport, getTransactionReport, getMonthlyReport, inventory, transactions } = transactionsContext;
  const { stats } = useWarehouse();
  const { toast } = useToast();

  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [reportData, setReportData] = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Debug logging
  console.log("Reports component rendered");
  console.log("Inventory data:", inventory);
  console.log("Inventory length:", inventory?.length);
  console.log("Transactions data:", transactions);
  console.log("Transactions length:", transactions?.length);

  const generateReport = useCallback((type: string) => {
    try {
      setIsLoading(true);
      console.log("Generating report:", type);
      setSelectedReport(type);
      let data = null;
      switch (type) {
        case "inventory": {
          data = getInventoryReport();
          console.log("Inventory report data:", data);
          break;
        }
        case "transactions": {
          data = getTransactionReport();
          console.log("Transaction report data:", data);
          break;
        }
        case "monthly": {
          const now = new Date();
          data = getMonthlyReport((now.getMonth() + 1).toString(), now.getFullYear().toString());
          console.log("Monthly report data:", data);
          break;
        }
        case "custom": {
          const inventory = getInventoryReport();
          const transactions = getTransactionReport();
          const monthly = getMonthlyReport((new Date().getMonth() + 1).toString(), new Date().getFullYear().toString());
          data = { inventory, transactions, monthly };
          console.log("Custom report data:", data);
          break;
        }
        default:
          data = null;
      }
      setReportData(data);
      toast({
        title: "Laporan berhasil dibuat",
        description: `Laporan tipe ${type} telah berhasil dibuat.`,
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat membuat laporan",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [getInventoryReport, getTransactionReport, getMonthlyReport, toast]);

  useEffect(() => {
    console.log("useEffect triggered - inventory changed:", inventory);
    if (inventory && inventory.length > 0) {
      console.log("Auto-generating inventory report");
      generateReport("inventory");
    } else {
      console.log("No inventory data available yet");
    }
  }, [inventory, generateReport]);

  useEffect(() => {
    console.log("useEffect triggered - transactions changed:", transactions);
    if (transactions && transactions.length > 0 && (!inventory || inventory.length === 0)) {
      console.log("Transactions loaded, but no inventory yet - forcing inventory generation");
      const data = getInventoryReport();
      if (data && data.length > 0) {
        console.log("Forced inventory generation:", data);
        setSelectedReport("inventory");
        setReportData(data);
      }
    }
  }, [transactions, inventory, getInventoryReport]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Laporan</h1>
          <p className="text-muted-foreground">
            Generate dan kelola laporan gudang
          </p>
        </div>
        <Button onClick={() => generateReport("custom")} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export Semua
        </Button>
      </div>

      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-800">Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-1">
            <p><strong>Inventory Items:</strong> {inventory?.length || 0}</p>
            <p><strong>Transactions:</strong> {transactions?.length || 0}</p>
            <p><strong>Selected Report:</strong> {selectedReport || "None"}</p>
            <p><strong>Report Data:</strong> {reportData ? "Available" : "None"}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportTypes.map((report) => {
          const IconComponent = report.icon;
          return (
            <Card key={report.id} className="border-0 shadow-soft hover:shadow-medium transition-shadow cursor-pointer" onClick={() => generateReport(report.id)}>
              <CardHeader className="text-center pb-4">
                <div className={`mx-auto w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-3`}>
                  <IconComponent className={`h-6 w-6 ${report.color}`} />
                </div>
                <CardTitle className="text-lg">{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button className="w-full" variant="outline" onClick={() => generateReport(report.id)} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="mr-2 h-4 w-4" />
                  )}
                  Generate Laporan
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedReport && reportData && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Data Laporan: {selectedReport.charAt(0).toUpperCase() + selectedReport.slice(1)}
            </CardTitle>
            <CardDescription>
              {selectedReport === 'inventory' && 'Ringkasan stok barang terkini'}
              {selectedReport === 'transactions' && 'Riwayat transaksi barang masuk dan keluar'}
              {selectedReport === 'monthly' && 'Ringkasan aktivitas bulanan'}
              {selectedReport === 'custom' && 'Laporan gabungan semua data'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedReport === 'inventory' && Array.isArray(reportData) && reportData.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium">Inventaris Barang:</h3>
                  {reportData.map((item: any, index: number) => (
                    <div key={index} className="p-3 bg-secondary/20 rounded-lg">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Stok: {item.currentStock} | Masuk: {item.totalIn} | Keluar: {item.totalOut}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedReport === 'transactions' && Array.isArray(reportData) && reportData.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium">Riwayat Transaksi:</h3>
                  {reportData.map((transaction: any, index: number) => (
                    <div key={index} className="p-3 bg-secondary/20 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{transaction.item}</div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.type === 'in' ? 'Masuk' : 'Keluar'} | {transaction.quantity} unit
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {transaction.operator} - {transaction.date}
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded text-xs ${
                          transaction.type === 'in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type === 'in' ? '+' : '-'}{transaction.quantity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedReport === 'monthly' && reportData && typeof reportData === 'object' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{(reportData as any).totalIn}</div>
                      <div className="text-sm text-green-600">Barang Masuk</div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{(reportData as any).totalOut}</div>
                      <div className="text-sm text-red-600">Barang Keluar</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{(reportData as any).netChange}</div>
                      <div className="text-sm text-blue-600">Perubahan Net</div>
                    </div>
                  </div>
                  {(reportData as any).transactions && (reportData as any).transactions.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-medium">Transaksi Bulan Ini:</h3>
                      {(reportData as any).transactions.map((transaction: any, index: number) => (
                        <div key={index} className="p-3 bg-secondary/20 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{transaction.item}</div>
                              <div className="text-sm text-muted-foreground">
                                {transaction.type === 'in' ? 'Masuk' : 'Keluar'} | {transaction.quantity} unit
                              </div>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs ${
                              transaction.type === 'in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {transaction.type === 'in' ? '+' : '-'}{transaction.quantity}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {selectedReport === 'custom' && reportData && typeof reportData === 'object' && (
                <div className="space-y-6">
                  <div className="text-sm text-muted-foreground">
                    Laporan gabungan menampilkan semua data inventaris, transaksi, dan laporan bulanan
                  </div>
                  <pre className="whitespace-pre-wrap text-xs bg-secondary/20 p-4 rounded overflow-auto max-h-96">
                    {JSON.stringify(reportData, null, 2)}
                  </pre>
                </div>
              )}

              {(!Array.isArray(reportData) && typeof reportData !== 'object') && (
                <div className="text-center py-8 text-muted-foreground">
                  Tidak ada data untuk ditampilkan
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedReport && (
        <Card className="mt-6">
          <CardContent className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Pilih Tipe Laporan</h3>
            <p className="text-muted-foreground">
              Klik salah satu kartu laporan di atas untuk melihat data laporan
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="recent" className="space-y-6">
        <TabsList>
          <TabsTrigger value="recent">Laporan Terbaru</TabsTrigger>
          <TabsTrigger value="scheduled">Laporan Terjadwal</TabsTrigger>
          <TabsTrigger value="templates">Template</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Laporan Terbaru
              </CardTitle>
              <CardDescription>
                Laporan yang telah dibuat dalam 30 hari terakhir
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Laporan Inventaris - Januari 2024", date: "15 Jan 2024", type: "Inventaris" },
                { name: "Laporan Transaksi - Minggu 2", date: "12 Jan 2024", type: "Transaksi" },
                { name: "Laporan Bulanan - Desember 2023", date: "02 Jan 2024", type: "Bulanan" }
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-secondary/20">
                  <div>
                    <h4 className="font-medium">{report.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{report.date}</span>
                      <span>•</span>
                      <span>{report.type}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Lihat
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card className="border-0 shadow-soft">
            <CardContent className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Laporan Terjadwal</h3>
              <p className="text-muted-foreground mb-4">
                Atur laporan otomatis untuk dibuat secara berkala
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Buat Jadwal Laporan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card className="border-0 shadow-soft">
            <CardContent className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Template Laporan</h3>
              <p className="text-muted-foreground mb-4">
                Kelola template untuk mempercepat pembuatan laporan
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Buat Template Baru
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
