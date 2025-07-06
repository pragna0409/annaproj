export interface User {
  id: string;
  username: string;
  email: string;
  role: 'root' | 'add-only' | 'edit' | 'full';
  isRoot: boolean;
}

export interface Client {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  clientId: string;
  itemName: string;
  description?: string;
  createdAt: string;
}

export interface ChalanItem {
  id: string;
  sno: number;
  particulars: string;
  noOfBoxes: number;
  costPerBox: number;
  totalQty: number;
}

export interface Chalan {
  id: string;
  clientId: string;
  client: Client;
  serialNumber: number;
  date: string;
  poDate: string;
  poNumber: string;
  items: ChalanItem[];
  vehicleNo: string;
  remarks: string;
  createdBy: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}