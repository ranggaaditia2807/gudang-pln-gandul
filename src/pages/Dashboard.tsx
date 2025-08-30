
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, RefreshCw, TrendingUp, Package, AlertTriangle } from "lucide-react";

const monthlyData = [
  { name: 'Jan', masuk: 65, keluar: 45 },
  { name: 'Feb', masuk: 59, keluar: 52 },
  { name: 'Mar', masuk: 80, keluar: 48 },
  { name: 'Apr', masuk: 81, keluar: 64 },
  { name: 'May', masuk: 56, keluar: 42 },
  { name: 'Jun', masuk: 75, keluar: 58 },
];

const categoryData = [
  { name: 'Kabel', value: 400, color: 'hsl(217 91% 45%)' },
  { name: 'Isolator', value: 300, color: 'hsl(0 84% 60%)' },
  { name: 'Trafo', value: 200, color: 'hsl(142 71% 45%)' },
  { name: 'Panel', value: 100, color: 'hsl(48 96% 53%)' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Ringkasan data gudang PLN UPT Gandul
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Nilai Inventaris</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 2.4M</div>
            <p className="text-xs text-success">+8.2% dari bulan lalu</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kategori Barang</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Kategori aktif</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Item Kritis</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-warning">Perlu perhatian</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Ringkasan</TabsTrigger>
          <TabsTrigger value="inventory">Inventaris</TabsTrigger>
          <TabsTrigger value="transactions">Transaksi</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Tren Barang Masuk & Keluar</CardTitle>
                <CardDescription>6 bulan terakhir</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="masuk" fill="hsl(217 91% 45%)" name="Barang Masuk" />
                    <Bar dataKey="keluar" fill="hsl(0 84% 60%)" name="Barang Keluar" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Distribusi Kategori Barang</CardTitle>
                <CardDescription>Berdasarkan jumlah item</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory">
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle>Status Inventaris</CardTitle>
              <CardDescription>Ringkasan kondisi stok barang</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Data Inventaris</h3>
                <p className="text-muted-foreground">
                  Fitur detail inventaris akan segera tersedia
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle>Riwayat Transaksi</CardTitle>
              <CardDescription>Aktivitas terbaru gudang</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Data Transaksi</h3>
                <p className="text-muted-foreground">
                  Fitur detail transaksi akan segera tersedia
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
