
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, BarChart3, Calendar, TrendingUp, Plus, Eye, Package, ArrowUp, ArrowDown, Printer } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { useTransactions } from "@/contexts/TransactionContext";
import { useWarehouse } from "@/contexts/WarehouseContext";
import * as XLSX from 'xlsx';
import { useReactToPrint } from 'react-to-print';

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
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
  });

  const {
    transactions,
    getInventoryReport,
    getTransactionReport,
    getMonthlyReport,
    getRecentTransactions
  } = useTransactions();

  const {
    items: warehouseItems,
    stats: warehouseStats,
    getLowStockItems,
    getCriticalStockItems
  } = useWarehouse();

  const handleGenerateReport = async (reportType: string) => {
    setIsGenerating(reportType);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsGenerating(null);
    toast.success(`Laporan ${reportType} berhasil dibuat!`);
  };

  const handleViewReport = (reportType: string) => {
    let reportData;

    switch (reportType) {
      case 'inventory':
        reportData = {
          title: 'Laporan Inventaris',
          data: getInventoryReport(),
          type: 'inventory'
        };
        break;
      case 'transactions':
        reportData = {
          title: 'Laporan Transaksi',
          data: getTransactionReport(),
          type: 'transactions'
        };
        break;
      case 'monthly':
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        reportData = {
          title: `Laporan Bulanan ${currentMonth}/${currentYear}`,
          data: getMonthlyReport(currentMonth.toString(), currentYear.toString()),
          type: 'monthly'
        };
        break;
      default:
        reportData = {
          title: 'Laporan',
          data: [],
          type: 'custom'
        };
    }

    setSelectedReport(reportData);
    setIsReportModalOpen(true);
  };

  const handleExportReport = (reportName: string) => {
    const reportData = selectedReport || { title: reportName, data: [] };
    const worksheet = XLSX.utils.json_to_sheet(reportData.data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan');
    XLSX.writeFile(workbook, `${reportName.replace(/\s+/g, '_')}.xlsx`);
    toast.success(`Mengexport laporan: ${reportName}`);
  };



  const handleExportAll = () => {
    const allReports = {
      inventory: getInventoryReport(),
      transactions: getTransactionReport(),
      monthly: getMonthlyReport(new Date().getMonth() + 1 + '', new Date().getFullYear() + '')
    };

    const workbook = XLSX.utils.book_new();

    const inventorySheet = XLSX.utils.json_to_sheet(allReports.inventory);
    XLSX.utils.book_append_sheet(workbook, inventorySheet, 'Inventaris');

    const transactionsSheet = XLSX.utils.json_to_sheet(allReports.transactions);
    XLSX.utils.book_append_sheet(workbook, transactionsSheet, 'Transaksi');

    const monthlySheet = XLSX.utils.json_to_sheet([allReports.monthly]);
    XLSX.utils.book_append_sheet(workbook, monthlySheet, 'Bulanan');

    XLSX.writeFile(workbook, 'semua_laporan.xlsx');
    toast.success("Mengexport semua laporan...");
  };

  const handleCreateSchedule = () => {
    toast.info("Fitur buat jadwal laporan akan segera hadir!");
  };

  const handleCreateTemplate = () => {
    toast.info("Fitur buat template laporan akan segera hadir!");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Laporan</h1>
          <p className="text-muted-foreground">
            Generate dan kelola laporan gudang
          </p>
        </div>
        <Button onClick={handleExportAll}>
          <Download className="mr-2 h-4 w-4" />
          Export Semua
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Barang</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warehouseStats.totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Jenis barang berbeda
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stok</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warehouseStats.totalStock}</div>
            <p className="text-xs text-muted-foreground">
              Unit tersedia
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transaksi Bulan Ini</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getMonthlyReport(new Date().getMonth() + 1 + '', new Date().getFullYear() + '').transactions.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Total aktivitas
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Barang Masuk/Keluar</CardTitle>
            <ArrowUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              +{warehouseItems.reduce((sum, item) => sum + item.stock, 0)}
            </div>
            <div className="text-xs text-destructive">
              -{getLowStockItems().length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportTypes.map((report) => {
          const IconComponent = report.icon;
          return (
            <Card key={report.id} className="border-0 shadow-soft hover:shadow-medium transition-shadow cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className={`mx-auto w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-3`}>
                  <IconComponent className={`h-6 w-6 ${report.color}`} />
                </div>
                <CardTitle className="text-lg">{report.title}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <Button
                  className="w-full"
                  onClick={() => handleViewReport(report.id)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Lihat Laporan
                </Button>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => handleGenerateReport(report.title)}
                  disabled={isGenerating === report.title}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {isGenerating === report.title ? "Membuat..." : "Generate Laporan"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Reports */}
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
                Data real-time dari transaksi yang telah tercatat
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {getRecentTransactions(5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/20">
                  <div>
                    <h4 className="font-medium">{transaction.item}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{transaction.date}</span>
                      <span>•</span>
                      <span>{transaction.type === "in" ? "Barang Masuk" : "Barang Keluar"}</span>
                      <span>•</span>
                      <span>{transaction.quantity} unit</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedReport({
                          title: `Detail Transaksi ${transaction.id}`,
                          data: transaction,
                          type: 'transaction_detail'
                        });
                        setIsReportModalOpen(true);
                      }}
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      Detail
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportReport(`Transaksi_${transaction.id}`)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {getRecentTransactions(5).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Belum ada transaksi tercatat</p>
                </div>
              )}
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
              <Button onClick={handleCreateSchedule}>
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
              <Button onClick={handleCreateTemplate}>
                <Plus className="mr-2 h-4 w-4" />
                Buat Template Baru
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Report Modal */}
      {isReportModalOpen && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">{selectedReport.title}</h2>
              <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExportReport(selectedReport.title)}
      >
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrint}
        className="ml-2"
      >
        <Printer className="mr-2 h-4 w-4" />
        Print
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsReportModalOpen(false)}
      >
        Tutup
      </Button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]" ref={printRef}>
              {selectedReport.type === 'inventory' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card className="border-0 shadow-soft">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-primary">{warehouseStats.totalItems}</div>
                        <div className="text-sm text-muted-foreground">Jenis Barang</div>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-soft">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-success">{warehouseStats.totalStock}</div>
                        <div className="text-sm text-muted-foreground">Total Stok</div>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-soft">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{warehouseStats.lowStockItems}</div>
                        <div className="text-sm text-muted-foreground">Stok Rendah</div>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-soft">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-destructive">{warehouseStats.criticalStockItems}</div>
                        <div className="text-sm text-muted-foreground">Stok Kritis</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="border rounded-lg">
                    <div className="bg-secondary/20 p-4 border-b">
                      <h3 className="font-semibold">Detail Inventaris</h3>
                    </div>
                    <div className="divide-y">
                      {warehouseItems.map((item, index: number) => (
                        <div key={index} className="p-4 flex justify-between items-center">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">
                              ID: {item.id} • Lokasi: {item.location}
                            </div>
                            {item.description && (
                              <div className="text-sm text-muted-foreground mt-1">
                                {item.description}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold">{item.stock} unit</div>
                            <div className="text-sm text-muted-foreground">
                              Min: {item.minStock} • Status: {item.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedReport.type === 'transactions' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="border-0 shadow-soft">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold">{selectedReport.data.length}</div>
                        <div className="text-sm text-muted-foreground">Total Transaksi</div>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-soft">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-success">
                          {selectedReport.data.filter((t: any) => t.type === 'in').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Barang Masuk</div>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-soft">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-destructive">
                          {selectedReport.data.filter((t: any) => t.type === 'out').length}
                        </div>
                        <div className="text-sm text-muted-foreground">Barang Keluar</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="border rounded-lg">
                    <div className="bg-secondary/20 p-4 border-b">
                      <h3 className="font-semibold">Riwayat Transaksi</h3>
                    </div>
                    <div className="divide-y max-h-96 overflow-y-auto">
                      {selectedReport.data.map((transaction: any, index: number) => (
                        <div key={index} className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium">{transaction.item}</div>
                              <div className="text-sm text-muted-foreground">
                                {transaction.date} • {transaction.operator}
                              </div>
                              {transaction.notes && (
                                <div className="text-sm text-muted-foreground mt-1">
                                  {transaction.notes}
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${
                                transaction.type === 'in'
                                  ? 'bg-success/20 text-success'
                                  : 'bg-destructive/20 text-destructive'
                              }`}>
                                {transaction.type === 'in' ? '+' : '-'}{transaction.quantity} unit
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                ID: {transaction.id}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {selectedReport.type === 'monthly' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-0 shadow-soft">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-success">+{selectedReport.data.totalIn}</div>
                        <div className="text-sm text-muted-foreground">Total Masuk</div>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-soft">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold text-destructive">-{selectedReport.data.totalOut}</div>
                        <div className="text-sm text-muted-foreground">Total Keluar</div>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-soft">
                      <CardContent className="p-4 text-center">
                        <div className={`text-2xl font-bold ${
                          selectedReport.data.netChange >= 0 ? 'text-success' : 'text-destructive'
                        }`}>
                          {selectedReport.data.netChange >= 0 ? '+' : ''}{selectedReport.data.netChange}
                        </div>
                        <div className="text-sm text-muted-foreground">Perubahan Bersih</div>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-soft">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold">{selectedReport.data.transactions.length}</div>
                        <div className="text-sm text-muted-foreground">Jumlah Transaksi</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border-0 shadow-soft">
                    <CardHeader>
                      <CardTitle>Detail Transaksi Bulanan</CardTitle>
                      <CardDescription>
                        Semua transaksi dalam periode bulan ini
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {selectedReport.data.transactions.map((transaction: any, index: number) => (
                          <div key={index} className="flex justify-between items-center p-4 bg-secondary/20 rounded-lg">
                            <div>
                              <div className="font-medium">{transaction.item}</div>
                              <div className="text-sm text-muted-foreground">
                                {transaction.date} • {transaction.operator}
                              </div>
                            </div>
                            <div className={`px-3 py-1 rounded text-sm font-medium ${
                              transaction.type === 'in'
                                ? 'bg-success/20 text-success'
                                : 'bg-destructive/20 text-destructive'
                            }`}>
                              {transaction.type === 'in' ? '+' : '-'}{transaction.quantity}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {selectedReport.type === 'transaction_detail' && (
                <div className="space-y-4">
                  <Card className="border-0 shadow-soft">
                    <CardHeader>
                      <CardTitle>Detail Transaksi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">ID Transaksi</label>
                          <div className="text-lg font-semibold">{selectedReport.data.id}</div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Tipe</label>
                          <div className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium ${
                            selectedReport.data.type === 'in'
                              ? 'bg-success/20 text-success'
                              : 'bg-destructive/20 text-destructive'
                          }`}>
                            {selectedReport.data.type === 'in' ? 'Barang Masuk' : 'Barang Keluar'}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Barang</label>
                          <div className="text-lg font-semibold">{selectedReport.data.item}</div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Jumlah</label>
                          <div className="text-lg font-semibold">{selectedReport.data.quantity} unit</div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Tanggal</label>
                          <div className="text-lg font-semibold">{selectedReport.data.date}</div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Operator</label>
                          <div className="text-lg font-semibold">{selectedReport.data.operator}</div>
                        </div>
                      </div>
                      {selectedReport.data.notes && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Catatan</label>
                          <div className="mt-1 p-3 bg-secondary/20 rounded">{selectedReport.data.notes}</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
