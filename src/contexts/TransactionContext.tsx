import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Transaction {
  id: string;
  type: "in" | "out";
  item: string;
  quantity: number;
  date: string;
  operator: string;
  notes: string;
}

export interface InventoryItem {
  name: string;
  currentStock: number;
  lastUpdated: string;
  totalIn: number;
  totalOut: number;
}

interface TransactionContextType {
  transactions: Transaction[];
  inventory: InventoryItem[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  getInventoryReport: () => InventoryItem[];
  getTransactionReport: (startDate?: string, endDate?: string) => Transaction[];
  getMonthlyReport: (month: string, year: string) => {
    totalIn: number;
    totalOut: number;
    netChange: number;
    transactions: Transaction[];
  };
  getRecentTransactions: (limit?: number) => Transaction[];
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

// Sample initial data
const initialTransactions: Transaction[] = [
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

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      try {
        const parsed = JSON.parse(savedTransactions);
        setTransactions(parsed);
      } catch (error) {
        console.error('Error parsing saved transactions:', error);
        setTransactions(initialTransactions);
        localStorage.setItem('transactions', JSON.stringify(initialTransactions));
      }
    } else {
      setTransactions(initialTransactions);
      localStorage.setItem('transactions', JSON.stringify(initialTransactions));
    }
  }, []);

  // Update inventory whenever transactions change
  useEffect(() => {
    const inventoryMap = new Map<string, InventoryItem>();

    transactions.forEach(transaction => {
      const existing = inventoryMap.get(transaction.item) || {
        name: transaction.item,
        currentStock: 0,
        lastUpdated: transaction.date,
        totalIn: 0,
        totalOut: 0
      };

      if (transaction.type === 'in') {
        existing.totalIn += transaction.quantity;
        existing.currentStock += transaction.quantity;
      } else {
        existing.totalOut += transaction.quantity;
        existing.currentStock -= transaction.quantity;
      }

      existing.lastUpdated = transaction.date;
      inventoryMap.set(transaction.item, existing);
    });

    const newInventory = Array.from(inventoryMap.values());
    setInventory(newInventory);
  }, [transactions]);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  const addTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newId = `TXN${(transactions.length + 1).toString().padStart(3, "0")}`;
    const newTransaction: Transaction = {
      ...transactionData,
      id: newId
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateTransaction = (id: string, transactionData: Omit<Transaction, 'id'>) => {
    setTransactions(prev =>
      prev.map(t => t.id === id ? { ...transactionData, id } : t)
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const getInventoryReport = (): InventoryItem[] => {
    return inventory;
  };

  const getTransactionReport = (startDate?: string, endDate?: string): Transaction[] => {
    let filtered = transactions;

    if (startDate) {
      filtered = filtered.filter(t => t.date >= startDate);
    }

    if (endDate) {
      filtered = filtered.filter(t => t.date <= endDate);
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getMonthlyReport = (month: string, year: string) => {
    const monthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() + 1 === parseInt(month) && date.getFullYear() === parseInt(year);
    });

    const totalIn = monthTransactions
      .filter(t => t.type === 'in')
      .reduce((sum, t) => sum + t.quantity, 0);

    const totalOut = monthTransactions
      .filter(t => t.type === 'out')
      .reduce((sum, t) => sum + t.quantity, 0);

    return {
      totalIn,
      totalOut,
      netChange: totalIn - totalOut,
      transactions: monthTransactions
    };
  };

  const getRecentTransactions = (limit: number = 10): Transaction[] => {
    return transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };

  return (
    <TransactionContext.Provider value={{
      transactions,
      inventory,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      getInventoryReport,
      getTransactionReport,
      getMonthlyReport,
      getRecentTransactions
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};
