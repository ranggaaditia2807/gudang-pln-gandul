import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, FileText, BarChart3, Calendar, TrendingUp, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useWarehouse } from "@/contexts/WarehouseContext";
import { useTransactions, TransactionProvider } from "@/contexts/TransactionContext";
import { useToast } from "@/hooks/use-toast";

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
  return <InnerReports />;
}

function InnerReports() {
  const { getInventoryReport, getTransactionReport, getMonthlyReport, inventory } = useTransactions();
  const { stats } = useWarehouse();
  const { toast } = useToast();

  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);

  const generateReport = (type: string) => {
    try {
      console.log("Generating report:", type);
      setSelectedReport(type);
      let data = null;
      switch (type) {
        case "inventory":
          data = getInventoryReport();
          console.log("Inventory report data:", data);
          break;
        case "transactions":
          data = getTransactionReport();
          console.log("Transaction report data:", data);
          break;
        case "monthly":
          // For example, generate report for current month and year
          const now = new Date();
          data = getMonthlyReport((now.getMonth() + 1).toString(), now.getFullYear().toString());
          console.log("Monthly report data:", data);
          break;
        case "custom":
          // Custom report logic here
          // For demonstration, generate all reports combined
          const inventory = getInventoryReport();
          const transactions = getTransactionReport();
          const monthly = getMonthlyReport((new Date().getMonth() + 1).toString(), new Date().getFullYear().toString());
          data = { inventory, transactions, monthly };
          console.log("Custom report data:", data);
          break;
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
    }
  };

  // Auto-generate inventory report when inventory data is available
  useEffect(() => {
    if (inventory && inventory.length > 0) {
      generateReport("inventory");
    }
  }, [inventory]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Laporan</h1>
          <p className="text-muted-foreground">
            Generate dan kelola laporan gudang
          </p>
        </div>
        <Button onClick={() => generateReport("custom")}>
          <Download className="mr-2 h-4 w-4" />
          Export Semua
        </Button>
      </div>

      {/* Report Types Grid */}
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
                <Button className="w-full" variant="outline" onClick={() => generateReport(report.id)}>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Laporan
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Display Report Data */}
      {selectedReport && reportData && (
        <div className="mt-6 p-4 border rounded bg-gray-50 shadow">
          <h2 className="text-xl font-semibold mb-4">Data Laporan: {selectedReport}</h2>
          <pre className="whitespace-pre-wrap text-sm text-gray-800">{JSON.stringify(reportData, null, 2)}</pre>
        </div>
      )}

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
