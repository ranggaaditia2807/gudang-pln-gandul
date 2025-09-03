import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Transaction, useTransactions } from './TransactionContext';

export interface WarehouseItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  location: string;
  description?: string;
  lastUpdated: string;
  status: 'good' | 'normal' | 'low' | 'critical';
}

export interface WarehouseStats {
  totalItems: number;
  totalStock: number;
  lowStockItems: number;
  criticalStockItems: number;
  categories: string[];
  recentTransactions: Transaction[];
}

interface WarehouseContextType {
  items: WarehouseItem[];
  stats: WarehouseStats;
  addItem: (item: Omit<WarehouseItem, 'id' | 'lastUpdated' | 'status'>) => void;
  updateItem: (id: string, updates: Partial<WarehouseItem>) => void;
  deleteItem: (id: string) => void;
  getItemById: (id: string) => WarehouseItem | undefined;
  getItemsByCategory: (category: string) => WarehouseItem[];
  getLowStockItems: () => WarehouseItem[];
  getCriticalStockItems: () => WarehouseItem[];
  updateStockFromTransaction: (transaction: Transaction) => void;
  searchItems: (query: string) => WarehouseItem[];
}

const WarehouseContext = createContext<WarehouseContextType | undefined>(undefined);

// Initial warehouse data
const initialItems: WarehouseItem[] = [
  {
    id: "KB001",
    name: "Kabel XLPE 150mm",
    category: "Kabel",
    stock: 45,
    minStock: 20,
    location: "Rak A-01",
    description: "Kabel XLPE untuk distribusi tegangan menengah",
    lastUpdated: new Date().toISOString(),
    status: "good"
  },
  {
    id: "IS002",
    name: "Isolator Keramik 20kV",
    category: "Isolator",
    stock: 8,
    minStock: 15,
    location: "Rak B-02",
    description: "Isolator keramik untuk gardu distribusi",
    lastUpdated: new Date().toISOString(),
    status: "low"
  },
  {
    id: "TR003",
    name: "Trafo Distribusi 400kVA",
    category: "Trafo",
    stock: 3,
    minStock: 2,
    location: "Area C",
    description: "Trafo distribusi 20kV/0.4kV",
    lastUpdated: new Date().toISOString(),
    status: "normal"
  },
  {
    id: "PN004",
    name: "Panel Distribusi 20kV",
    category: "Panel",
    stock: 12,
    minStock: 5,
    location: "Area D",
    description: "Panel kontrol dan proteksi distribusi",
    lastUpdated: new Date().toISOString(),
    status: "good"
  }
];

export const WarehouseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WarehouseItem[]>([]);
  const { transactions, addTransaction } = useTransactions();

  // Load data from localStorage on mount
  useEffect(() => {
    const savedItems = localStorage.getItem('warehouse_items');
    if (savedItems) {
      try {
        const parsed = JSON.parse(savedItems);
        setItems(parsed);
      } catch (error) {
        console.error('Error parsing saved warehouse items:', error);
        setItems(initialItems);
        localStorage.setItem('warehouse_items', JSON.stringify(initialItems));
      }
    } else {
      setItems(initialItems);
      localStorage.setItem('warehouse_items', JSON.stringify(initialItems));
    }
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('warehouse_items', JSON.stringify(items));
    }
  }, [items]);

  // Update stock when transactions occur
  useEffect(() => {
    transactions.forEach(transaction => {
      updateStockFromTransaction(transaction);
    });
  }, [transactions]);

  const calculateStatus = (stock: number, minStock: number): WarehouseItem['status'] => {
    if (stock <= minStock * 0.5) return 'critical';
    if (stock <= minStock) return 'low';
    if (stock >= minStock * 2) return 'good';
    return 'normal';
  };

  const addItem = (itemData: Omit<WarehouseItem, 'id' | 'lastUpdated' | 'status'>) => {
    const newId = `WH${(items.length + 1).toString().padStart(3, "0")}`;
    const newItem: WarehouseItem = {
      ...itemData,
      id: newId,
      lastUpdated: new Date().toISOString(),
      status: calculateStatus(itemData.stock, itemData.minStock)
    };
    setItems(prev => [...prev, newItem]);
  };

  const updateItem = (id: string, updates: Partial<WarehouseItem>) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, ...updates };
        if (updates.stock !== undefined || updates.minStock !== undefined) {
          updatedItem.status = calculateStatus(
            updates.stock ?? item.stock,
            updates.minStock ?? item.minStock
          );
        }
        updatedItem.lastUpdated = new Date().toISOString();
        return updatedItem;
      }
      return item;
    }));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const getItemById = (id: string): WarehouseItem | undefined => {
    return items.find(item => item.id === id);
  };

  const getItemsByCategory = (category: string): WarehouseItem[] => {
    return items.filter(item => item.category === category);
  };

  const getLowStockItems = (): WarehouseItem[] => {
    return items.filter(item => item.status === 'low' || item.status === 'critical');
  };

  const getCriticalStockItems = (): WarehouseItem[] => {
    return items.filter(item => item.status === 'critical');
  };

  const updateStockFromTransaction = (transaction: Transaction) => {
    const existingItem = items.find(item => item.name === transaction.item);
    if (existingItem) {
      const newStock = transaction.type === 'in'
        ? existingItem.stock + transaction.quantity
        : existingItem.stock - transaction.quantity;

      updateItem(existingItem.id, {
        stock: Math.max(0, newStock), // Prevent negative stock
        lastUpdated: new Date().toISOString()
      });
    }
  };

  const searchItems = (query: string): WarehouseItem[] => {
    const lowerQuery = query.toLowerCase();
    return items.filter(item =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.id.toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery) ||
      item.location.toLowerCase().includes(lowerQuery)
    );
  };

  // Calculate warehouse statistics
  const stats: WarehouseStats = {
    totalItems: items.length,
    totalStock: items.reduce((sum, item) => sum + item.stock, 0),
    lowStockItems: getLowStockItems().length,
    criticalStockItems: getCriticalStockItems().length,
    categories: [...new Set(items.map(item => item.category))],
    recentTransactions: transactions.slice(0, 10)
  };

  return (
    <WarehouseContext.Provider value={{
      items,
      stats,
      addItem,
      updateItem,
      deleteItem,
      getItemById,
      getItemsByCategory,
      getLowStockItems,
      getCriticalStockItems,
      updateStockFromTransaction,
      searchItems
    }}>
      {children}
    </WarehouseContext.Provider>
  );
};

export const useWarehouse = () => {
  const context = useContext(WarehouseContext);
  if (context === undefined) {
    throw new Error('useWarehouse must be used within a WarehouseProvider');
  }
  return context;
};
