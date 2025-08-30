
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Users, TrendingUp, AlertCircle, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

export default function Home() {
  const { user, logout } = useUser();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-hero rounded-xl p-8 text-white">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">
            {user ? `Selamat Datang, ${user.name}!` : 'Selamat Datang di Sistem Manajemen Gudang'}
          </h1>
          <p className="text-xl mb-6 text-white/90">
            PLN UPT Gandul - Kelola inventaris dengan mudah dan efisien
          </p>
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-white/80 mb-2">Anda login sebagai: {user.role}</p>
                <div className="flex gap-4">
                  <Button asChild variant="secondary" size="lg">
                    <Link to="/warehouse">Kelola Gudang</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-white border-white/20 hover:bg-white/10">
                    <Link to="/dashboard">Lihat Dashboard</Link>
                  </Button>
                </div>
              </div>
              <Button 
                onClick={logout} 
                variant="outline" 
                size="lg" 
                className="text-white border-white/20 hover:bg-white/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Button asChild variant="secondary" size="lg">
                <Link to="/warehouse">Kelola Gudang</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-white border-white/20 hover:bg-white/10">
                <Link to="/dashboard">Lihat Dashboard</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-white border-white/20 hover:bg-white/10">
                <Link to="/login">Login</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Barang
            </CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-success">
              +12% dari bulan lalu
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Stok Menipis
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-warning">
              Perlu restok segera
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Transaksi Hari Ini
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-success">
              +5% dari kemarin
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pengguna Aktif
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Saat ini online
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>
              Akses fitur utama dengan mudah
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/transactions">
                <Package className="mr-2 h-4 w-4" />
                Catat Transaksi Baru
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/warehouse">
                <AlertCircle className="mr-2 h-4 w-4" />
                Cek Stok Barang
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link to="/reports">
                <TrendingUp className="mr-2 h-4 w-4" />
                Generate Laporan
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>
              Pembaruan sistem terkini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Barang masuk: Kabel XLPE 150mm</p>
                  <p className="text-xs text-muted-foreground">2 jam yang lalu</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Stok menipis: Isolator Keramik</p>
                  <p className="text-xs text-muted-foreground">4 jam yang lalu</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Laporan bulanan telah dibuat</p>
                  <p className="text-xs text-muted-foreground">1 hari yang lalu</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
