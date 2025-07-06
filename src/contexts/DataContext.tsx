import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Client, InventoryItem, Chalan } from '../types';

interface DataContextType {
  clients: Client[];
  inventory: InventoryItem[];
  chalans: Chalan[];
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  addClients: (clients: Omit<Client, 'id' | 'createdAt'>[]) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'createdAt'>) => void;
  addInventoryItems: (items: Omit<InventoryItem, 'id' | 'createdAt'>[]) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  addChalan: (chalan: Omit<Chalan, 'id' | 'createdAt'>) => void;
  updateChalan: (id: string, chalan: Partial<Chalan>) => void;
  deleteChalan: (id: string) => void;
  getClientInventory: (clientId: string) => InventoryItem[];
  getClientChalanCount: (clientId: string) => number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [chalans, setChalans] = useState<Chalan[]>([]);

  useEffect(() => {
    const storedClients = localStorage.getItem('clients');
    const storedInventory = localStorage.getItem('inventory');
    const storedChalans = localStorage.getItem('chalans');

    if (storedClients) setClients(JSON.parse(storedClients));
    if (storedInventory) setInventory(JSON.parse(storedInventory));
    if (storedChalans) setChalans(JSON.parse(storedChalans));
  }, []);

  const addClient = (client: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedClients = [...clients, newClient];
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  };

  const addClients = (newClients: Omit<Client, 'id' | 'createdAt'>[]) => {
    const clientsWithIds: Client[] = newClients.map(client => ({
      ...client,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    }));
    const updatedClients = [...clients, ...clientsWithIds];
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  };

  const updateClient = (id: string, client: Partial<Client>) => {
    const updatedClients = clients.map(c => c.id === id ? { ...c, ...client } : c);
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  };

  const deleteClient = (id: string) => {
    const updatedClients = clients.filter(c => c.id !== id);
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'createdAt'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedInventory = [...inventory, newItem];
    setInventory(updatedInventory);
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
  };

  const addInventoryItems = (newItems: Omit<InventoryItem, 'id' | 'createdAt'>[]) => {
    const itemsWithIds: InventoryItem[] = newItems.map(item => ({
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    }));
    const updatedInventory = [...inventory, ...itemsWithIds];
    setInventory(updatedInventory);
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
  };

  const updateInventoryItem = (id: string, item: Partial<InventoryItem>) => {
    const updatedInventory = inventory.map(i => i.id === id ? { ...i, ...item } : i);
    setInventory(updatedInventory);
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
  };

  const deleteInventoryItem = (id: string) => {
    const updatedInventory = inventory.filter(i => i.id !== id);
    setInventory(updatedInventory);
    localStorage.setItem('inventory', JSON.stringify(updatedInventory));
  };

  const addChalan = (chalan: Omit<Chalan, 'id' | 'createdAt'>) => {
    const newChalan: Chalan = {
      ...chalan,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    const updatedChalans = [...chalans, newChalan];
    setChalans(updatedChalans);
    localStorage.setItem('chalans', JSON.stringify(updatedChalans));
  };

  const updateChalan = (id: string, chalan: Partial<Chalan>) => {
    const updatedChalans = chalans.map(c => c.id === id ? { ...c, ...chalan } : c);
    setChalans(updatedChalans);
    localStorage.setItem('chalans', JSON.stringify(updatedChalans));
  };

  const deleteChalan = (id: string) => {
    const updatedChalans = chalans.filter(c => c.id !== id);
    setChalans(updatedChalans);
    localStorage.setItem('chalans', JSON.stringify(updatedChalans));
  };

  const getClientInventory = (clientId: string) => {
    return inventory.filter(item => item.clientId === clientId);
  };

  const getClientChalanCount = (clientId: string) => {
    return chalans.filter(chalan => chalan.clientId === clientId).length;
  };

  const value: DataContextType = {
    clients,
    inventory,
    chalans,
    addClient,
    addClients,
    updateClient,
    deleteClient,
    addInventoryItem,
    addInventoryItems,
    updateInventoryItem,
    deleteInventoryItem,
    addChalan,
    updateChalan,
    deleteChalan,
    getClientInventory,
    getClientChalanCount
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};