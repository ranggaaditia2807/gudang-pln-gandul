
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Package, AlertCircle, CheckCircle, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useWarehouse } from "@/contexts/WarehouseContext";
import { useTransactions } from "@/contexts/TransactionContext";

export default function Warehouse() {
  const { hasPermission } = useUser();
  const canEdit = hasPermission('owner');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const { items, stats, addItem, updateItem, searchItems, getItemsByCategory } = useWarehouse();
  const { transactions } = useTransactions();

  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    stock: 0,
    location: "",
    description: ""
  });

  const filteredItems = searchTerm
    ? searchItems(searchTerm).filter(item =>
        selectedCategory === "all" || item.category === selectedCategory
      )
    : selectedCategory === "all"
      ? items
      : getItemsByCategory(selectedCategory);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Stok Kritis
        </Badge>;
      case 'low':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Stok Menipis
        </Badge>;
      case 'good':
        return <Badge className="bg-success text-success-foreground flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Stok Baik
        </Badge>;
      default:
        return <Badge variant="secondary">Normal</Badge>;
    }
  };

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleEditClick = (item: any) => {
    setSelectedItem(item);
    setNewItem({
      name: item.name,
      category: item.category,
      stock: item.stock,
      minStock: item.minStock,
      location: item.location,
      description: item.description || ""
    });
    setShowEditModal(true);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setNewItem(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.category) {
      alert("Nama dan Kategori harus diisi");
      return;
    }
    addItem(newItem);
    setNewItem({
      name: "",
      category: "",
      stock: 0,
      minStock: 0,
      location: "",
      description: ""
    });
    setShowAddModal(false);
  };

  const handleEditItem = () => {
    if (!selectedItem || !newItem.name || !newItem.category) {
      alert("Nama dan Kategori harus diisi");
      return;
    }
    updateItem(selectedItem.id, newItem);
    setShowEditModal(false);
    setSelectedItem(null);
    setNewItem({
      name: "",
      category: "",
      stock: 0,
      location: "",
      description: ""
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Gudang</h1>
          <p className="text-muted-foreground">
            Kelola inventaris barang PLN UPT Gandul
          </p>
        </div>
        {canEdit && (
          <Button onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Barang
          </Button>
        )}
      </div>

      {/* Dashboard Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Barang</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
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
            <div className="text-2xl font-bold">{stats.totalStock}</div>
            <p className="text-xs text-muted-foreground">
              Unit tersedia
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stok Menipis</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Perlu perhatian
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kategori</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories.length}</div>
            <p className="text-xs text-muted-foreground">
              Kategori barang
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="border-0 shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari barang berdasarkan nama atau kode..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-auto">
              <TabsList>
                <TabsTrigger value="all">Semua</TabsTrigger>
                {stats.categories.map(category => (
                  <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="border-0 shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription className="text-sm font-mono">
                    {item.id}
                  </CardDescription>
                </div>
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Kategori:</span>
                <Badge variant="outline">{item.category}</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Stok:</span>
                <span className="font-semibold">{item.stock} unit</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Min. Stok:</span>
                <span className="text-sm">{item.minStock} unit</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Lokasi:</span>
                <span className="text-sm font-mono">{item.location}</span>
              </div>

              <div className="pt-2 border-t">
                {getStatusBadge(item.status)}
              </div>

              <div className="flex gap-2 pt-2">
                {canEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEditClick(item)}
                  >
                    Edit
                  </Button>
                )}
                <Button variant="outline" size="sm" className="flex-1">
                  Detail
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card className="border-0 shadow-soft">
          <CardContent className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tidak Ada Barang Ditemukan</h3>
            <p className="text-muted-foreground">
              Coba ubah kata kunci pencarian atau filter kategori
            </p>
          </CardContent>
        </Card>
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Tambah Barang Baru</h2>
            <div className="space-y-4">
              <Input
                placeholder="Nama Barang"
                value={newItem.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              <Input
                placeholder="Kategori"
                value={newItem.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Stok"
                value={newItem.stock}
                onChange={(e) => handleInputChange("stock", Number(e.target.value))}
              />
              <Input
                type="number"
                placeholder="Min. Stok"
                value={newItem.minStock}
                onChange={(e) => handleInputChange("minStock", Number(e.target.value))}
              />
              <Input
                placeholder="Lokasi"
                value={newItem.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
              <Input
                placeholder="Deskripsi (opsional)"
                value={newItem.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Batal
              </Button>
              <Button onClick={handleAddItem}>Tambah</Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Barang</h2>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                ID: {selectedItem.id}
              </div>
              <Input
                placeholder="Nama Barang"
                value={newItem.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
              <Input
                placeholder="Kategori"
                value={newItem.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Stok"
                value={newItem.stock}
                onChange={(e) => handleInputChange("stock", Number(e.target.value))}
              />
              <Input
                type="number"
                placeholder="Min. Stok"
                value={newItem.minStock}
                onChange={(e) => handleInputChange("minStock", Number(e.target.value))}
              />
              <Input
                placeholder="Lokasi"
                value={newItem.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
              <Input
                placeholder="Deskripsi (opsional)"
                value={newItem.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <Button variant="outline" onClick={() => {
                setShowEditModal(false);
                setSelectedItem(null);
              }}>
                Batal
              </Button>
              <Button onClick={handleEditItem}>Simpan</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
